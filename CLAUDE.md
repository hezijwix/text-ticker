# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Text Ticker Tool** - a specialized typography application for creating circular text paths with advanced font controls. The application uses P5.js for sophisticated typography rendering and Canvas 2D context for variable font support.

## Development Setup

This is a vanilla JavaScript project with no build system. Development is done by:
- Opening `index.html` in a browser or using a local server
- No package.json exists - uses CDN dependencies (P5.js, FFmpeg.js, JSZip)
- No build, test, or lint commands are available
- All functionality is contained in single-file architecture for simplicity

## P5.js Infrastructure & Typography Architecture

The application is built on **P5.js instance mode** which provides:
- Advanced typography rendering capabilities
- Better font loading and management
- Smooth animations and transformations
- Extensible path system for future typography modes
- Professional-grade canvas export functionality

### Core Architecture Components

#### P5.js Integration Layer
- **Instance Mode**: Uses `new p5(sketch)` for isolated P5.js context
- **Hybrid Rendering**: P5.js for transformations + Canvas 2D for variable fonts
- **Typography Engine**: Custom text-on-circle algorithm with character-by-character positioning
- **Export System**: Native P5.js export functions with high-quality output

#### Variable Font System
- **Primary Font**: Wix Madefor Display (400-800 weight range)
- **Additional Fonts**: Inter, Roboto (variable), Arial (fallback)
- **Weight Control**: Dynamic font-variation-settings with real-time preview
- **Rendering Pipeline**: Canvas 2D context for precise variable font rendering

#### Typography Path System
- **Current Mode**: Circular/Shape mode with radius and rotation controls
- **Extensible Design**: Architecture supports future path modes (bezier curves, physics)
- **Text Transformation**: Character-level positioning with rotation and scaling
- **Performance Optimization**: Efficient rendering with minimal redraws

### Core Files Structure

- **`index.html`**: UI structure with typography controls, font selection, P5.js CDN integration
- **`script.js`**: Complete P5.js implementation in `TextTickerTool` class
- **`style.css`**: Dark theme styling optimized for typography work
- **`design-system.md`**: Comprehensive UI/UX design system documentation

## Key Typography Features

### Font Management
- **Variable Font Support**: Smooth weight transitions (400-800) for supported fonts
- **Font Loading**: Google Fonts CDN with preconnect optimization
- **Real-time Updates**: Instant font changes with live preview
- **Fallback System**: Graceful degradation to standard font weights

### Text Path Rendering
- **Circular Paths**: Radius-controlled circular text with rotation
- **Character Positioning**: Precise angle-based character placement
- **Typography Controls**: Font family, weight, size, color, background
- **Visual Preview**: Real-time updates with zoom controls

### Export Capabilities
- **PNG Export**: High-quality static typography designs
- **MP4 Export**: Planned animation support
- **Resolution Independence**: Export at original resolution regardless of zoom
- **Background Layers**: Support for background and foreground image overlays

## P5.js Implementation Details

### Application Class Structure (`TextTickerTool`)
```javascript
class TextTickerTool {
    // P5.js instance management
    createP5Instance()     // Sets up P5.js with canvas
    
    // Typography rendering
    drawTextOnCircle()     // Core circular text algorithm
    updateFontStyle()      // Variable font application
    renderText()           // Main rendering pipeline
    
    // Export functionality
    exportPNG()           // P5.js-powered export
    exportMP4()           // Future animation export
}
```

### Typography Rendering Pipeline
1. **P5.js Setup**: Canvas creation and initial configuration
2. **Font Loading**: Variable font application via Canvas 2D context
3. **Text Processing**: Character-by-character positioning calculation
4. **Path Rendering**: Circular path with rotation and scaling
5. **Layer Composition**: Background, text, foreground image layers
6. **Export Processing**: High-quality output generation

### Variable Font Implementation
```javascript
// Hybrid approach: P5.js + Canvas 2D for variable fonts
const ctx = p.canvas.getContext('2d');
ctx.font = `${fontWeight} 24px "${fontFamily}", sans-serif`;
// Character-level rendering with transformations
```

## Development Patterns

### Code Organization
- **Single Class Architecture**: All functionality in `TextTickerTool` class
- **Event-Driven Updates**: UI controls trigger immediate re-rendering
- **P5.js Instance Management**: Proper setup/teardown for canvas resizing
- **Memory Management**: Efficient image loading and P5.js resource handling

### Typography Development Workflow
1. **Font Integration**: Add new fonts to Google Fonts CDN
2. **Control Creation**: Add UI controls in HTML with event handlers
3. **Rendering Updates**: Modify `drawTextOnCircle()` method
4. **Export Testing**: Verify high-quality export functionality

### Future Typography Modes
The architecture is designed for extensibility:
- **Bezier Curve Paths**: Text following custom drawn curves
- **Physics-Based Animation**: Dynamic typography with physics
- **Interactive Deformation**: Stretching, bending, morphing text
- **Multi-Path Systems**: Complex text arrangements

## Common Development Tasks

### Adding New Typography Mode
1. Create new path calculation method (similar to `drawTextOnCircle`)
2. Add mode-specific UI controls in HTML
3. Add control event handlers in constructor
4. Update rendering pipeline to support new mode
5. Test export functionality with new mode

### Integrating New Fonts
1. Add font to Google Fonts CDN link in HTML
2. Update font dropdown options
3. Test variable font support or add fallback handling
4. Verify export quality with new font

### Modifying Text Rendering
- Core algorithm is in `drawTextOnCircle()` method
- Font application handled in `updateFontStyle()`
- Canvas properties managed through P5.js instance
- Export uses P5.js `save()` function

## Technical Dependencies

### External Libraries (CDN)
- **P5.js v1.11.8**: Core graphics and typography engine
- **Google Fonts**: Variable font delivery (Wix Madefor Display, Inter, Roboto)
- **JSZip**: PNG sequence packaging for future animation
- **FFmpeg.js**: MP4 video generation (planned)

### Browser Requirements
- Modern browsers with Canvas 2D context support
- Variable font support (Chrome 62+, Firefox 62+, Safari 11+)
- WebGL support for P5.js (fallback available)

## Performance Considerations

- **Efficient Rendering**: Only re-render on control changes
- **Font Loading**: Preconnect and async loading optimization
- **Canvas Management**: Proper P5.js instance lifecycle
- **Memory Usage**: Efficient image handling and cleanup

## Testing Approach

- **Manual Testing**: Browser-based typography preview
- **Export Validation**: Test PNG output quality and resolution
- **Font Compatibility**: Verify variable font rendering across browsers
- **Responsive Testing**: UI behavior at different screen sizes

This architecture provides a solid foundation for advanced typography tools while maintaining simplicity and extensibility for future enhancements.