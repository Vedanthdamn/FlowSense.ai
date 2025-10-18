"""
Supabase Logger for Traffic History
Handles logging traffic events to Supabase database
"""

import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SupabaseLogger:
    """Logger for traffic events to Supabase"""
    
    def __init__(self):
        self.enabled = False
        self.client = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Supabase client if credentials are available"""
        try:
            supabase_url = os.getenv('SUPABASE_URL')
            supabase_key = os.getenv('SUPABASE_KEY')
            
            if supabase_url and supabase_key:
                from supabase import create_client
                self.client = create_client(supabase_url, supabase_key)
                self.enabled = True
                print("✓ Supabase logging enabled")
            else:
                print("ℹ Supabase credentials not found - logging disabled")
                print("  Set SUPABASE_URL and SUPABASE_KEY in .env to enable")
        except Exception as e:
            print(f"⚠ Supabase initialization failed: {e}")
            self.enabled = False
    
    def log_traffic_event(self, event_data):
        """
        Log a traffic event to Supabase
        
        Args:
            event_data: Dictionary containing:
                - lane: Current active lane
                - vehicle_count: Number of vehicles in lane
                - signal_time: Signal duration
                - all_counts: Dictionary of all lane counts
        """
        if not self.enabled:
            return
        
        try:
            data = {
                "timestamp": datetime.now().isoformat(),
                "lane": event_data.get("lane"),
                "vehicle_count": event_data.get("vehicle_count"),
                "signal_time": event_data.get("signal_time"),
                "north_count": event_data.get("all_counts", {}).get("North", 0),
                "south_count": event_data.get("all_counts", {}).get("South", 0),
                "east_count": event_data.get("all_counts", {}).get("East", 0),
                "west_count": event_data.get("all_counts", {}).get("West", 0)
            }
            
            self.client.table('traffic_logs').insert(data).execute()
        except Exception as e:
            print(f"Error logging to Supabase: {e}")
    
    def get_recent_logs(self, limit=50):
        """
        Get recent traffic logs from Supabase
        
        Args:
            limit: Number of logs to retrieve
            
        Returns:
            List of log entries
        """
        if not self.enabled:
            return []
        
        try:
            response = self.client.table('traffic_logs')\
                .select('*')\
                .order('timestamp', desc=True)\
                .limit(limit)\
                .execute()
            
            return response.data
        except Exception as e:
            print(f"Error fetching logs from Supabase: {e}")
            return []
