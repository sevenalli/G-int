# Grue Interface - Crane Operations Management System

## Overview

Grue Interface is a modern web application built with Angular that provides real-time monitoring and control of crane operations in port and terminal environments. The application offers a comprehensive interface for managing crane movements, rotations, and operations with a focus on safety and efficiency.

## Features

- **Real-time Crane Monitoring**
  - Dynamic visualization of crane movements and rotations
  - Scale X control for precise positioning
  - Interactive grabber control with open/close states

- **Operation Controls**
  - Scale adjustment with visual feedback
  - Smooth animations for crane movements
  - Intuitive user interface for operators

- **Visual Feedback**
  - Real-time rope length adjustment
  - Grabber position tracking
  - Scale-dependent grabber state changes

## Technical Stack

- **Frontend**
  - Angular 19.2.8
  - TypeScript
  - HTML5/CSS3

- **Development Tools**
  - Angular CLI
  - Karma (Testing)
  - ESLint (Code Quality)

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
│   ├── app-header/        # Header component
│   ├── home/             # Home page
│   ├── operations/       # Crane operations management
│   ├── others/           # Additional components
│   └── rotation/         # Rotation control
├── assets/               # Static assets
└── styles/              # Global styles
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

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Angular Team for the excellent framework
- All contributors who have helped improve this project

## Contact

For any questions or feedback, please contact [sevenalli] at [sevenalli@gmail.com]
