# Contributing to FlowSense.ai

Thank you for your interest in contributing to FlowSense.ai! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards others

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:
- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **System information** (OS, Python version, Node version)
- **Screenshots** if applicable
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:
- **Use a clear title** describing the enhancement
- **Provide detailed description** of the proposed functionality
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

## Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Setup Steps

1. **Fork and clone**:
```bash
git clone https://github.com/YOUR_USERNAME/FlowSense.ai.git
cd FlowSense.ai
```

2. **Create a branch**:
```bash
git checkout -b feature/your-feature-name
```

3. **Setup backend**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

4. **Setup frontend**:
```bash
cd frontend
npm install
```

5. **Make your changes**

6. **Test your changes**:
```bash
# Backend
cd backend
python -m pytest  # if tests exist

# Frontend
cd frontend
npm run lint
npm run build
```

## Coding Guidelines

### Python (Backend)

**Style Guide**: Follow PEP 8
```bash
# Install linters
pip install flake8 black

# Format code
black .

# Check style
flake8 .
```

**Best Practices**:
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and small
- Use meaningful variable names
- Handle exceptions properly

Example:
```python
def count_vehicles(frame: np.ndarray) -> int:
    """
    Count vehicles in a frame using YOLOv8.
    
    Args:
        frame: Input image frame as numpy array
        
    Returns:
        Number of vehicles detected
    """
    # Implementation here
    pass
```

### JavaScript/React (Frontend)

**Style Guide**: Use ESLint configuration provided

```bash
# Format code
npm run lint

# Check for errors
npm run build
```

**Best Practices**:
- Use functional components with hooks
- Keep components small and focused
- Use prop-types or TypeScript for type checking
- Follow React best practices
- Use meaningful component and variable names

Example:
```jsx
function VehicleCounter({ count, lane }) {
  return (
    <div className="vehicle-counter">
      <span>{lane}: {count} vehicles</span>
    </div>
  )
}
```

### Git Commit Messages

**Format**:
```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat: add emergency vehicle priority detection

Added YOLOv8 model extension to detect emergency vehicles
and give them signal priority in the adaptive algorithm.

Closes #123
```

```
fix: resolve memory leak in video processing

Fixed issue where video frames were not properly released,
causing memory usage to grow over time.
```

## Submitting Changes

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] All tests pass
- [ ] No new warnings introduced
- [ ] Commit messages are clear

### Pull Request Process

1. **Update your fork**:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Push your changes**:
```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request**:
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

4. **PR Description should include**:
   - What changes were made
   - Why these changes were necessary
   - How to test the changes
   - Screenshots (for UI changes)
   - Related issues (if any)

### Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## Areas for Contribution

### High Priority
- [ ] Unit tests for backend functions
- [ ] Integration tests for API endpoints
- [ ] E2E tests for frontend
- [ ] Performance optimizations
- [ ] Mobile responsiveness improvements

### Medium Priority
- [ ] Additional vehicle types detection
- [ ] Emergency vehicle priority
- [ ] Pedestrian detection
- [ ] Weather-based signal adjustment
- [ ] Multi-language support

### Documentation
- [ ] Video tutorials
- [ ] API documentation improvements
- [ ] Code examples
- [ ] Architecture diagrams
- [ ] Deployment guides

## Testing

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## Getting Help

- **Questions?** Open a GitHub issue with the `question` label
- **Stuck?** Join our discussions on GitHub
- **Found a bug?** Report it with detailed information

## Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Given credit in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to FlowSense.ai!** 🚦

Every contribution, no matter how small, helps make this project better.
