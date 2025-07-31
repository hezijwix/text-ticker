# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a generative gallery application with four distinct display modes: Ring (3D circular), Follow Spline (2D path drawing), Cursor Trail (mouse following), and Shuffle (animated positioning). The application uses Three.js for 3D rendering and HTML5 Canvas for 2D interactions.

## Development Setup

This is a vanilla JavaScript project with no build system. Development is done by:
- Opening `index.html` in a browser or using a local server
- No package.json exists - the project uses CDN dependencies (Three.js, FFmpeg.js)
- No build, test, or lint commands are available

## Architecture

The application uses a single-file architecture for simplicity:

### Core Files
- `index.html` - Main HTML structure with extensive UI controls
- `script.js` - Complete implementation of all gallery modes and functionality
- `style.css` - All styling and responsive design

### Application Structure in script.js
The `ProjectTemplate` class contains all functionality:
- Three.js scene management for Ring mode
- 2D Canvas handling for Spline mode  
- DOM manipulation for Cursor Trail and Shuffle modes
- Image upload and management
- UI control event handling
- Export functionality with FFmpeg integration

## Key Features

### Gallery Modes
- **Ring Mode**: 3D circular arrangement with rotation controls
- **Follow Spline Mode**: 2D path drawing with image trails
- **Cursor Trail Mode**: Images follow mouse cursor
- **Shuffle Mode**: Animated positioning with seed-based randomization

### UI Controls
Each mode has specific control panels that show/hide based on selection:
- Ring: radius, height, speed, rotation controls
- Spline: speed, scale, density
- Cursor Trail: follow speed, scale
- Shuffle: seed, scatter controls, animation toggle

### Technical Implementation
- **Three.js**: WebGL rendering for 3D Ring mode
- **HTML5 Canvas**: 2D drawing for Spline mode
- **DOM Elements**: Direct manipulation for Trail and Shuffle modes
- **Event-driven**: All interactions handled through event listeners

## Development Notes

### Code Organization
The script.js file is organized into logical sections:
- Constructor and initialization
- Gallery mode implementations
- UI control handlers
- Utility functions
- Export functionality

### Code Style
- ES6 class syntax
- Clear method naming
- Comprehensive comments
- Three.js follows standard patterns

### Testing
- No automated testing framework
- Manual testing via browser
- Use browser dev tools for debugging

## Common Tasks

### Adding New Gallery Mode
1. Add new mode methods to `ProjectTemplate` class
2. Add controls to `index.html`
3. Add control handlers in script.js
4. Update mode switching logic
5. Add mode-specific rendering logic

### Modifying Existing Mode
- Find the mode's methods in script.js (e.g., `showRingGallery`, `showSplineGallery`)
- UI controls are in `index.html` with descriptive IDs
- Control handlers are in the constructor's event listener section

### Working with Three.js (Ring Mode)
- Scene setup is in the constructor
- Ring-specific code is in `createCircularPath` and related methods
- Follow Three.js best practices for memory management
- Use `requestAnimationFrame` for smooth animations