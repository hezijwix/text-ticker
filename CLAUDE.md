# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a text ticker tool that renders typography on customizable paths. The application currently supports circular text paths with adjustable radius and rotation controls. Built with HTML5 Canvas for 2D text rendering and typography effects.

## Development Setup

This is a vanilla JavaScript project with no build system. Development is done by:
- Opening `index.html` in a browser or using a local server
- No package.json exists - the project uses CDN dependencies for export functionality (JSZip, FFmpeg.js)
- No build, test, or lint commands are available

## Architecture

The application uses a single-file architecture for simplicity:

### Core Files
- `index.html` - Main HTML structure with typography controls and UI
- `script.js` - Complete implementation of text rendering and path functionality
- `style.css` - All styling and responsive design

### Application Structure in script.js
The `TextTickerTool` class contains all functionality:
- HTML5 Canvas text rendering system
- Path calculation and text positioning algorithms
- Text input and control management
- Background/foreground image handling
- Export functionality with PNG/MP4 support

## Key Features

### Typography Modes
- **Shape Mode**: Circular text paths with adjustable radius and rotation

### Text Controls
- Text input box for content entry
- Radius control for circular path size
- Rotation control for text orientation
- Real-time preview updates

### Technical Implementation
- **HTML5 Canvas**: 2D text rendering and path positioning
- **Typography Engine**: Custom text-on-path rendering algorithms
- **Export System**: PNG export with future MP4 animation support
- **Event-driven**: All interactions handled through event listeners

## Development Notes

### Code Organization
The script.js file is organized into logical sections:
- Constructor and initialization
- Canvas setup and text rendering
- Path calculation methods
- UI control handlers
- Export functionality

### Code Style
- ES6 class syntax
- Clear method naming
- Comprehensive comments
- Canvas API follows best practices

### Testing
- No automated testing framework
- Manual testing via browser
- Use browser dev tools for debugging

## Common Tasks

### Adding New Path Mode
1. Add new mode option to Path Preset dropdown in `index.html`
2. Create mode-specific control section in HTML
3. Add mode detection and switching logic in script.js
4. Implement new path calculation method
5. Add mode-specific rendering logic

### Modifying Text Rendering
- Find text rendering methods in script.js (e.g., `drawTextOnCircle`)
- Typography controls are in `index.html` with descriptive IDs
- Control handlers are in the constructor's event listener section

### Working with Canvas
- Canvas setup is in `createCanvas` method
- Text rendering logic is in `renderText` and path-specific methods
- Follow Canvas API best practices for text rendering
- Use `save()` and `restore()` for text transformations

### Typography Features
- Font selection and styling
- Text color and effects
- Letter spacing and kerning
- Text alignment on paths
- Path-specific text distribution