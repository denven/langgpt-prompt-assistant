# LangGPT Prompt Assistant Frontend

A modern, responsive web interface for the LangGPT Prompt Assistant. This frontend provides an intuitive way to generate, analyze, and optimize LangGPT-style prompts through a beautiful web interface.

## Features

- 🎨 **Modern UI Design**: Clean, responsive interface with smooth animations
- 📝 **Prompt Generator**: Create custom LangGPT prompts with detailed configuration
- 🔍 **Prompt Analyzer**: Analyze existing prompts for structure, clarity, and effectiveness
- ⚡ **Prompt Optimizer**: Optimize prompts based on specific goals and constraints
- 📋 **Template Library**: Pre-built templates for common use cases
- 📱 **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🎯 **Real-time Feedback**: Toast notifications and loading states for better UX

## Quick Start

### Option 1: Simple HTTP Server (Recommended)

1. Navigate to the frontend directory:
   ```bash
   cd langgpt-prompt-assistant/frontend
   ```

2. Start a simple HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8080
   
   # Using Python 2
   python -m SimpleHTTPServer 8080
   
   # Using Node.js (if you have http-server installed)
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```

3. Open your browser and go to:
   ```
   http://localhost:8080
   ```

### Option 2: Live Server (VS Code)

If you're using VS Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Direct File Opening

Simply double-click `index.html` to open it directly in your browser (some features may be limited due to CORS restrictions).

## Usage Guide

### 1. Prompt Generator

The main feature for creating custom LangGPT prompts:

1. **Configure Role Settings**:
   - Choose the role type (Assistant, Expert, Tutor, etc.)
   - Select the domain (Programming, Writing, Analysis, etc.)
   - Set expertise level and communication style

2. **Define Specific Task**:
   - Describe what the role should do
   - Be specific about responsibilities and expectations

3. **Add Requirements & Constraints**:
   - List additional requirements (one per line)
   - Define constraints and limitations
   - Specify additional skills needed

4. **Generate & Use**:
   - Click "Generate Prompt" to create your custom prompt
   - Copy or download the generated prompt
   - Use it with your preferred AI assistant

### 2. Prompt Analyzer

Analyze existing prompts for improvement:

1. **Paste Your Prompt**: Enter the prompt you want to analyze
2. **Choose Analysis Type**: Select what aspect to focus on
3. **Set Target Audience**: Specify who the prompt is for
4. **Review Results**: Get detailed feedback and suggestions

### 3. Prompt Optimizer

Improve existing prompts:

1. **Input Original Prompt**: Paste the prompt to optimize
2. **Set Optimization Goals**: Choose what to improve (clarity, structure, etc.)
3. **Define Constraints**: Specify what to maintain
4. **Get Optimized Version**: Receive an improved prompt with explanations

### 4. Templates

Use pre-built templates for common scenarios:

- **Programming Assistant**: For code development and debugging
- **Writing Assistant**: For content creation and editing
- **Data Analyst**: For data interpretation and insights
- **Research Assistant**: For academic and research work

Click any template to automatically fill the generator form with pre-configured settings.

## Features in Detail

### Responsive Design
- Adapts to different screen sizes
- Touch-friendly on mobile devices
- Optimized layouts for desktop and tablet

### Interactive Elements
- Smooth tab navigation
- Hover effects and animations
- Loading states and progress indicators
- Toast notifications for user feedback

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast design

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## Customization

### Styling
The frontend uses CSS custom properties for easy theming. You can modify colors, fonts, and other visual elements in `styles.css`.

### Templates
Add new templates by modifying the `loadTemplate()` function in `script.js` and adding corresponding template cards in `index.html`.

### API Integration
Currently, the frontend uses mock implementations. To connect to the actual MCP server:

1. Modify the API calls in `script.js`
2. Replace mock functions with actual HTTP requests
3. Handle CORS and authentication as needed

## File Structure

```
frontend/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Development

### Adding New Features

1. **New Tab**: Add a new tab button in the navigation and corresponding panel
2. **New Form**: Create form elements and add event handlers
3. **New API**: Implement API calls and result display functions

### Styling Guidelines

- Use CSS Grid and Flexbox for layouts
- Follow the existing color scheme
- Maintain responsive design principles
- Use consistent spacing and typography

### JavaScript Structure

The application uses a class-based architecture:
- `LangGPTPromptAssistant` class manages all functionality
- Event listeners are set up in the constructor
- Mock implementations simulate API responses
- UI updates are handled through dedicated methods

## Troubleshooting

### Common Issues

1. **CORS Errors**: Use a local HTTP server instead of opening files directly
2. **Styling Issues**: Check browser compatibility and CSS support
3. **JavaScript Errors**: Open browser console to see detailed error messages

### Performance Tips

- Use the browser's developer tools to monitor performance
- Optimize images and assets if adding custom content
- Consider lazy loading for large template libraries

## Contributing

To contribute to the frontend:

1. Follow the existing code style and structure
2. Test on multiple browsers and devices
3. Ensure accessibility standards are met
4. Update documentation for new features

## License

This frontend is part of the LangGPT Prompt Assistant project and follows the same licensing terms.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the main project documentation
3. Open an issue in the project repository 