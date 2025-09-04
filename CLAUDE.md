# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Text Ticker Tool** - a specialized typography application for creating text paths with advanced font controls. The application supports both primitive shapes (circle, rectangle) and custom vector splines for flexible text layout. The application uses P5.js for sophisticated typography rendering and Canvas 2D context for variable font support.

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
- Dual path system: Shape mode (primitive geometries) and Spline mode (custom vector curves)
- Professional-grade canvas export functionality

### Core Architecture Components

#### P5.js Integration Layer
- **Instance Mode**: Uses `new p5(sketch)` for isolated P5.js context
- **Hybrid Rendering**: P5.js for transformations + Canvas 2D for variable fonts
- **Typography Engine**: Multiple path rendering systems with character-by-character positioning
- **Export System**: Native P5.js export functions with high-quality output and guide hiding

#### Variable Font System
- **Primary Font**: Wix Madefor Display (400-800 weight range)
- **Additional Fonts**: Inter, Roboto (variable), Arial (fallback)
- **Weight Control**: Dynamic font-variation-settings with real-time preview
- **Rendering Pipeline**: Canvas 2D context for precise variable font rendering

#### Typography Path System
- **Shape Mode**: Primitive geometries (circle, rectangle) with parametric controls
- **Spline Mode**: Custom vector paths with point-and-click editing and curve interpolation
- **Path Types**: Linear and Catmull-Rom spline interpolation for smooth curves
- **Interactive Editing**: Mouse-based point creation/deletion with visual guides
- **Text Transformation**: Character-level positioning with rotation and scaling along any path type
- **Performance Optimization**: Efficient rendering with minimal redraws and guide toggling

### Core Files Structure

- **`index.html`**: UI structure with Path Mode toggle system, shape controls, spline controls, P5.js CDN integration
- **`script.js`**: Complete P5.js implementation in `TextTickerTool` class with dual path system
- **`style.css`**: Dark theme styling optimized for typography work
- **`design-system.md`**: Comprehensive UI/UX design system documentation

### User Interface Architecture

#### Path Mode Controls
```html
<!-- Path Mode Selection -->
<select id="pathModeSelect">
    <option value="shape">Shape</option>
    <option value="spline">Spline</option>
</select>

<!-- Shape Properties Panel (visible when Shape mode selected) -->
<div id="shapePropertiesSection">
    <select id="shapeTypeSelect">
        <option value="circle">Circle</option>
        <option value="rectangle">Rectangle</option>
    </select>
    <!-- Shape-specific controls (radius, width/height, corner radius, rotation) -->
</div>

<!-- Spline Properties Panel (visible when Spline mode selected) -->
<div id="splinePropertiesSection">
    <select id="curveTypeSelect">
        <option value="linear">Linear</option>
        <option value="curved">Curved</option>
    </select>
    <input type="checkbox" id="showGuidesCheckbox" checked>
    <button id="clearSplineBtn">Clear All Points</button>
    <span id="splinePointCount">0</span>
</div>
```

#### Dynamic UI Panel Switching
```javascript
// UI visibility management based on selected path mode
updatePathModeControls() {
    if (this.currentPathMode === "shape") {
        this.shapePropertiesSection.style.display = "block";
        this.splinePropertiesSection.style.display = "none";
    } else if (this.currentPathMode === "spline") {
        this.shapePropertiesSection.style.display = "none";
        this.splinePropertiesSection.style.display = "block";
    }
}
```

## Key Typography Features

### Font Management
- **Variable Font Support**: Smooth weight transitions (400-800) for supported fonts
- **Font Loading**: Google Fonts CDN with preconnect optimization
- **Real-time Updates**: Instant font changes with live preview
- **Fallback System**: Graceful degradation to standard font weights

### Text Path Rendering
- **Shape Paths**: Circle (radius-controlled) and Rectangle (width/height/corner radius)
- **Spline Paths**: Custom vector curves with linear or smooth interpolation
- **Character Positioning**: Precise positioning and rotation along any path type
- **Typography Controls**: Font family, weight, size, color, background
- **Visual Preview**: Real-time updates with zoom controls and optional guide visibility

### Export Capabilities
- **PNG Export**: High-quality static typography designs with automatic guide hiding
- **MP4 Export**: Animation support with frame-by-frame rendering
- **PNG Sequences**: Individual frame export for external video processing
- **Guide Management**: Automatic guide hiding during export, restored after completion
- **Resolution Independence**: Export at original resolution regardless of zoom
- **Background Layers**: Support for background and foreground image overlays

## P5.js Implementation Details

### Application Class Structure (`TextTickerTool`)
```javascript
class TextTickerTool {
    // P5.js instance management
    createP5Instance()     // Sets up P5.js with canvas and mouse handlers
    
    // Path system management
    currentPathMode        // "shape" or "spline"
    splinePoints[]         // Array of {x, y} points for spline paths
    curveType             // "linear" or "curved" interpolation
    showGuides            // Visual guide visibility toggle
    
    // Typography rendering pipeline
    drawTextOnPath()      // Main path rendering dispatcher
    drawTextOnCircle()    // Circle path text algorithm
    drawTextOnRectangle() // Rectangle path text algorithm  
    drawTextOnSpline()    // Spline path text algorithm
    drawSplineGuides()    // Visual editing guides
    renderText()          // Main rendering pipeline with guide hiding support
    
    // Spline interaction system
    handleSplineMousePressed()  // Point creation/deletion interface
    calculateSplinePathLength() // Path length calculation
    getPointOnSplinePath()      // Character positioning along spline
    catmullRomInterpolate()     // Smooth curve interpolation
    
    // Export functionality  
    exportPNG()           // PNG export with guide hiding
    exportPNGSequence()   // Animated frame sequence export
    exportMP4()           // Video export functionality
}
```

### Typography Rendering Pipeline
1. **P5.js Setup**: Canvas creation and mouse event handler registration
2. **Font Loading**: Variable font application via Canvas 2D context
3. **Path Mode Selection**: Shape (parametric) or Spline (vector) path generation
4. **Text Processing**: Character-by-character positioning calculation along selected path
5. **Path Rendering**: Dynamic path rendering with animation support
6. **Guide Rendering**: Optional visual guides for spline editing (hidden during export)
7. **Layer Composition**: Background, text ribbons, text, foreground image layers
8. **Export Processing**: High-quality output with automatic guide management

### Variable Font Implementation
```javascript
// Hybrid approach: P5.js + Canvas 2D for variable fonts
const ctx = p.canvas.getContext('2d');
ctx.font = `${fontWeight} 24px "${fontFamily}", sans-serif`;
// Character-level rendering with transformations
```

### Spline System Implementation

The spline system provides custom vector path creation with two interpolation modes:

#### Spline Data Structure
```javascript
// Core spline properties
this.splinePoints = [];           // Array of {x, y} coordinate points
this.curveType = "linear";        // "linear" or "curved" interpolation
this.showGuides = true;           // Visual guide visibility toggle
this.splinePathLength = 0;        // Cached path length for performance
```

#### Interactive Point Management
```javascript
// Point-and-click interface for spline creation/editing
handleSplineMousePressed(mouseX, mouseY) {
    const clickRadius = 10;
    
    // Check for existing point deletion
    for (let i = 0; i < this.splinePoints.length; i++) {
        const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2));
        if (distance <= clickRadius) {
            this.splinePoints.splice(i, 1); // Remove point
            return;
        }
    }
    
    // Add new point
    this.splinePoints.push({ x: mouseX, y: mouseY });
}
```

#### Catmull-Rom Spline Interpolation
```javascript
// Smooth curve interpolation between control points
catmullRomInterpolate(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    
    return {
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + 
               (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2 + 
               (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + 
               (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2 + 
               (-p0.y + 3*p1.y - 3*p2.y + p3.y) * t3)
    };
}
```

#### Path Length Calculation
```javascript
// Efficient path length calculation for character distribution
calculateSplinePathLength() {
    if (this.splinePoints.length < 2) return 0;
    
    let totalLength = 0;
    const segments = this.curveType === "curved" ? 100 : 1; // Adaptive sampling
    
    // Calculate cumulative distance along path
    for (let i = 0; i < this.splinePoints.length - 1; i++) {
        // Linear or curved segment length calculation
        totalLength += this.calculateSegmentLength(i, segments);
    }
    
    return totalLength;
}
```

#### Character Positioning Along Spline
```javascript
// Precise character placement with rotation calculation
getPointOnSplinePath(distanceAlongPath) {
    // Find segment containing the target distance
    // Calculate interpolated position and tangent angle
    // Return {x, y, angle} for character placement
}
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
3. **Rendering Updates**: Modify path-specific rendering methods (`drawTextOnCircle()`, `drawTextOnSpline()`, etc.)
4. **Path Mode Integration**: Update `drawTextOnPath()` dispatcher method
5. **Animation Support**: Ensure animation offset calculations work with new path type
6. **Ribbon Support**: Add corresponding ribbon drawing method if needed
7. **Export Testing**: Verify high-quality export functionality with guide hiding

### Implemented Typography Modes
- **Shape Mode**: Parametric primitive geometries (circle with radius, rectangle with width/height/corner radius)
- **Spline Mode**: Custom vector curves with linear or Catmull-Rom interpolation

### Future Typography Modes
The architecture is designed for further extensibility:
- **Bezier Curve Paths**: Text following parametric bezier curves with control point handles
- **Physics-Based Animation**: Dynamic typography with collision and spring physics
- **Interactive Deformation**: Real-time stretching, bending, morphing text along paths
- **Multi-Path Systems**: Complex text arrangements with path transitions and branching

## Common Development Tasks

### Adding New Typography Mode
1. Create new path calculation method (similar to `drawTextOnCircle()` or `drawTextOnSpline()`)
2. Add mode-specific UI controls in HTML (follow existing pattern in Path Mode section)
3. Add control event handlers in constructor and update control visibility logic
4. Update `drawTextOnPath()` dispatcher to include new mode
5. Add corresponding ribbon drawing method in `drawRibbonForCurrentShape()`
6. Update `drawTextOnRecordingCanvas()` for video export support
7. Add animation offset calculation for new path type
8. Test export functionality with automatic guide hiding
9. Update help modal documentation with new mode instructions

### Integrating New Fonts
1. Add font to Google Fonts CDN link in HTML
2. Update font dropdown options
3. Test variable font support or add fallback handling
4. Verify export quality with new font

### Modifying Text Rendering
- **Shape Mode**: Core algorithms in `drawTextOnCircle()` and `drawTextOnRectangle()` methods
- **Spline Mode**: Core algorithm in `drawTextOnSpline()` with spline-specific helper methods
- **Path Dispatcher**: Main routing logic in `drawTextOnPath()` method
- **Font Application**: Canvas 2D context font properties set per path type
- **Canvas Management**: P5.js instance with mouse event handling for spline interaction
- **Export System**: Uses P5.js `save()` function with `renderText(hideGuides=true)` for clean output

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