# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a generative gallery application with four distinct display modes: Ring (3D circular), Follow Spline (2D path drawing), Cursor Trail (mouse following), and Shuffle (animated positioning). The application uses Three.js for 3D rendering and HTML5 Canvas for 2D interactions.

## Development Setup

This is a vanilla JavaScript project with no build system. Development is done by:
- Opening `index.html` in a browser or using a local server
- No package.json exists - the project uses CDN dependencies (Three.js)
- No build, test, or lint commands are available

## Architecture

The application follows a modular architecture with clear separation of concerns:

### Core Entry Points
- `index.html` - Main HTML structure with extensive UI controls
- `main.js` - Modern ES6 module entry point with proper imports
- `script.js` - Legacy monolithic implementation (appears to be backup)

### Manager Classes (managers/)
- `SceneManager.js` - Three.js scene, camera, renderer management
- `ImageManager.js` - Image upload, storage, and lifecycle management  
- `UIController.js` - UI controls and event handling

### Gallery Modes (galleries/)
- `RingGallery.js` - 3D circular gallery using Three.js
- Additional gallery modes may be implemented as separate classes

### Application Flow
1. `GenerativeGallery` class initializes all managers and galleries
2. `ImageManager` handles image upload and provides callbacks
3. `UIController` manages control panels and mode switching
4. `SceneManager` provides Three.js rendering infrastructure
5. Gallery classes implement specific display modes

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
- **Three.js**: WebGL rendering for 3D modes
- **HTML5 Canvas**: 2D drawing and interactions
- **Modular ES6**: Clean separation with import/export
- **Event-driven**: Callback system between managers

## Development Notes

### File Structure
- Use ES6 modules with proper imports/exports
- Manager classes handle specific responsibilities
- Gallery classes implement display modes
- Utils directory exists but may be empty

### Code Style
- ES6 class syntax throughout
- Clear separation of concerns
- Event-driven architecture with callbacks
- Three.js follows standard patterns

### Testing
- No automated testing framework
- Manual testing via browser
- Use browser dev tools for debugging Three.js scenes

## Common Tasks

### Adding New Gallery Mode
1. Create new class in `galleries/` directory
2. Implement required methods (init, addImage, removeImage, etc.)
3. Add controls to `index.html`
4. Update `UIController.js` for new controls
5. Register in `GenerativeGallery` class

### Modifying Existing Mode
- Gallery-specific code is in `galleries/` directory
- UI controls are in `index.html` with IDs matching mode names
- Control handling is in `UIController.js`

### Working with Three.js
- Scene setup is handled by `SceneManager`
- Gallery classes receive scene reference
- Follow Three.js best practices for memory management
- Use `requestAnimationFrame` for smooth animations