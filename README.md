# Grue Interface - Advanced Crane Operations Management System

## Overview

Grue Interface is a state-of-the-art web application built with Angular that provides comprehensive monitoring and control of crane operations in port and terminal environments. Featuring a modern, intuitive interface with neomorphic design elements, the application offers real-time visualization and management of crane operations with enhanced safety and efficiency.

## Features

- **Modern UI/UX**
  - Sleek, responsive design with neomorphic elements
  - Animated welcome section with visual feedback
  - Card-based interface with hover effects and smooth transitions
  - Dark/light theme support

- **Hierarchical Equipment Selection**
  - Three-level selection interface (Terminal > Category > Equipment)
  - Professional ERP/GMAO style interface
  - Visual feedback for selections
  - Summary panel for quick overview

- **Advanced Crane Control**
  - **Slewing Control**
    - 360° rotation control with compass directions
    - Visual grid for spatial orientation
    - Luffing extension control with dynamic arm adjustment
  
  - **Real-time Monitoring**
    - Dynamic visualization of crane movements
    - Scale adjustment with visual feedback
    - Interactive grabber control with open/close states

- **Port Management**
  - Visual port selection with location indicators
  - Card-based interface with port images
  - Gradient overlays for better text visibility
  - Responsive design for all devices

## Technical Stack

- **Frontend**
  - Angular 19.2.8
  - TypeScript 5.0+
  - HTML5/CSS3 with CSS Variables
  - RxJS for reactive programming
  - Angular Animations

- **UI/UX**
  - Neomorphic design principles
  - Responsive layouts with Flexbox/Grid
  - Interactive elements with hover/focus states
  - Smooth CSS transitions and animations

- **Development Tools**
  - Angular CLI
  - Karma & Jasmine (Testing)
  - ESLint & Prettier (Code Quality)
  - Git for version control

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sevenalli/G-int.git
   cd G-int
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200/`

## Project Structure

```
src/
├── app/
│   ├── app-header/          # Header component with navigation
│   ├── acceuil/             # Modern home page with dashboard
│   ├── choix-supervision/   # Hierarchical equipment selection
│   ├── ports/              # Port management interface
│   ├── terex-supervision/   # Crane supervision controls
│   ├── operations/         # Crane operations management
│   └── rotation/           # 360° rotation control
├── assets/                 # Static assets (images, icons, etc.)
└── styles/                # Global styles and themes
   ├── _variables.scss     # Design tokens and variables
   ├── _mixins.scss       # Reusable style mixins
   └── _animations.scss   # Animation definitions
```

## Development

### Running the Development Server

```bash
ng serve
```

### Building for Production

```bash
ng build --prod
```

### Running Tests

```bash
ng test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or to report issues, please open an issue in the [GitHub repository](https://github.com/sevenalli/G-int).

## Best Practices

- **Responsive Design**: Works on all device sizes from mobile to desktop
- **Performance**: Optimized animations and lazy loading for better performance
- **Accessibility**: Built with WCAG guidelines in mind
- **Maintainability**: Clean, modular code with clear documentation

## Future Enhancements

- Real-time data integration
- Advanced analytics dashboard
- Multi-language support
- User authentication and roles
- Mobile application version

## Acknowledgments

- Angular Team for the excellent framework
- All contributors who have helped improve this project
- The open-source community for valuable resources and inspiration

## Contact

For any questions or feedback, please contact [sevenalli](mailto:sevenalli@gmail.com) or visit [GitHub repository](https://github.com/sevenalli/G-int)
