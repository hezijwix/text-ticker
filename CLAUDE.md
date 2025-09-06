# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Text Ticker Tool** - a specialized typography application for creating text paths with advanced font controls. The application supports both primitive shapes (circle, rectangle) and custom vector splines for flexible text layout. The application uses P5.js for sophisticated typography rendering and Canvas 2D context for variable font support.

## Development Setup

This is a vanilla JavaScript project with no build system. Development is done by:
- Opening `index.html` in a browser or using a local server
- No package.json exists - uses CDN dependencies (P5.js, FFmpeg.js, JSZip)
- No build, test, or lint commands are available
- Uses modular architecture with composition pattern for maintainability and extensibility

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

#### Application Structure
- **`index.html`**: UI structure with Path Mode toggle system, shape controls, spline controls, P5.js CDN integration
- **`design-system.md`**: Comprehensive UI/UX design system documentation

#### JavaScript Modular Architecture
- **`js/TextTickerTool.js`**: Main orchestrator class (~800 lines) - composition pattern coordinator
- **`js/ShapeMode.js`**: Shape path system (~510 lines) - circles, rectangles, ribbons
- **`js/SplineMode.js`**: Custom curve system (~585 lines) - splines, interpolation, guides
- **`js/ExportManager.js`**: Export functionality (~300 lines) - PNG, MP4, sequences

#### CSS Modular System
- **`css/variables.css`**: CSS custom properties, color system, typography scale
- **`css/layout.css`**: Reset, typography, grid system, positioning, responsive structure  
- **`css/controls.css`**: Form controls, input elements, interactive components
- **`css/toggles.css`**: Toggle switches, radio buttons, checkbox styling
- **`css/modals.css`**: Modal dialogs, overlays, popup components
- **`css/style.css`**: Canvas-specific styling, positioning, P5.js integration

#### Legacy Reference
- **`legacy/script.js`**: Original monolithic implementation preserved for reference

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

### Modular Architecture Overview

#### TextTickerTool (Main Orchestrator)
```javascript
class TextTickerTool {
    constructor() {
        // Composition pattern - inject this instance into modules
        this.shapeMode = new ShapeMode(this);
        this.splineMode = new SplineMode(this);
        this.exportManager = new ExportManager(this);
    }
    
    // P5.js instance management
    createP5Instance()     // Sets up P5.js with canvas and mouse handlers
    
    // Path system coordination
    currentPathMode        // "shape" or "spline"
    drawTextOnPath()      // Delegates to appropriate module
    renderText()          // Main rendering pipeline coordinator
    
    // UI state management
    updatePathModeControls()  // Module visibility switching
    updateCurrentTextDisplay() // Text preview updates
}
```

#### ShapeMode (Geometric Paths)
```javascript
class ShapeMode {
    constructor(tool) {
        this.tool = tool;  // Dependency injection
    }
    
    // Shape rendering algorithms
    drawTextOnCircle()    // Circle path text with ribbons
    drawTextOnRectangle() // Rectangle path text with ribbons
    drawRibbonOnCircle()  // Circle ribbon rendering
    drawRibbonOnRectangle() // Rectangle ribbon rendering
    
    // Words Bound ribbon support
    drawSingleWordRibbonOnCircle()    // Individual word ribbons
    drawSingleWordRibbonOnRectangle() // Rectangle word ribbons
}
```

#### SplineMode (Custom Curves)
```javascript
class SplineMode {
    constructor(tool) {
        this.tool = tool;  // Access to main application state
    }
    
    // Spline path system
    drawTextOnSpline()    // Spline text rendering with coordinate transforms
    drawSplineGuides()    // Interactive editing visualization
    drawRibbonOnSpline()  // Spline ribbon rendering
    
    // Spline interaction
    handleSplineMousePressed() // Point creation/deletion interface
    calculateSplinePathLength() // Arc-length parameterization
    getPointOnSplinePath()      // Character positioning
    catmullRomInterpolate()     // Smooth curve interpolation
    
    // Words Bound ribbon support
    drawSingleWordRibbonOnSpline() // Word-level spline segments
    drawSplineSegment()            // Helper for ribbon drawing
}
```

#### ExportManager (Output Generation)
```javascript
class ExportManager {
    constructor(textTickerTool) {
        this.tool = textTickerTool;
        this.ffmpeg = null;
        this.exportHistory = [];
    }
    
    // Export coordination
    showExportModal()     // Modal management
    handleModalExport()   // Format-specific routing
    
    // Export formats
    exportPNG()           // Static image with guide hiding
    exportPNGSequence()   // Animation frames in ZIP
    exportVideo()         // MP4/WebM with FFmpeg conversion
    
    // Export utilities
    addToExportHistory()  // Session tracking
    createVideoFromFrames() // Frame-to-video conversion
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

## Modular Architecture Benefits

### Composition Pattern Implementation
- **Zero Breaking Changes**: Seamless transition from monolithic architecture
- **Dependency Injection**: Modules receive `tool` instance for state access
- **Separation of Concerns**: Each module handles specific domain expertise
- **Maintainability**: Focused, smaller files easier to understand and modify
- **Extensibility**: New path types can be added as separate modules
- **Testing**: Individual modules can be tested in isolation

### Module Communication
```javascript
// TextTickerTool orchestrates and provides shared state
class TextTickerTool {
    constructor() {
        // Inject this instance for communication
        this.shapeMode = new ShapeMode(this);
        this.splineMode = new SplineMode(this);
        this.exportManager = new ExportManager(this);
    }
    
    drawTextOnPath() {
        // Delegate based on current mode
        if (this.currentPathMode === "shape") {
            this.shapeMode.drawTextOnShape();
        } else if (this.currentPathMode === "spline") {
            this.splineMode.drawTextOnSpline();
        }
    }
}

// Modules access shared state through injected tool reference
class ShapeMode {
    constructor(tool) {
        this.tool = tool;  // Access to shared state and P5.js instance
    }
    
    drawTextOnCircle() {
        // Access shared properties
        const p = this.tool.p5Instance;
        const text = this.tool.currentText;
        const radius = this.tool.circleRadius;
        // Shape-specific rendering logic
    }
}
```

### Recent Architecture Migration (Words Bound Bug Fix)

During the modular refactoring, several critical methods were inadvertently omitted:
- `drawSingleWordRibbonOnCircle()` - missing from ShapeMode.js
- `drawSingleWordRibbonOnRectangle()` - missing from ShapeMode.js
- `drawSingleWordRibbonOnSpline()` - missing from SplineMode.js
- `drawSplineSegment()` - helper method missing from SplineMode.js

**Resolution**: Methods were extracted from `legacy/script.js` and properly integrated into the modular architecture with:
- Coordinate transformation preservation for spline mode
- Method signature updates (`this.tool.method()` → `this.method()`)
- Full ribbon functionality restoration across all path types

### Technical Details of Words Bound Bug Fix

#### Root Cause Analysis
The bug occurred when transitioning from the monolithic `script.js` to the modular architecture. During the refactoring process, the focus was on the primary text rendering methods, but the Words Bound ribbon functionality was inadvertently omitted from the modular classes.

**Missing Methods**:
```javascript
// These methods existed in legacy/script.js but were missing from modules:

// From ShapeMode.js
drawSingleWordRibbonOnCircle(ctx, word, centerAngle, angleSpan, radius, wordWidth, ribbonHeight, borderPadding)
drawSingleWordRibbonOnRectangle(ctx, word, startDistance, endDistance, pathLength, wordWidth, ribbonHeight, borderPadding)

// From SplineMode.js  
drawSingleWordRibbonOnSpline(ctx, word, startDistance, endDistance, pathLength, wordWidth, ribbonHeight, borderPadding)
drawSplineSegment(ctx, startDistance, endDistance, pathLength, isRibbon)
```

#### Implementation Solution

**ShapeMode.js - Circle Word Ribbons**
```javascript
drawSingleWordRibbonOnCircle(ctx, word, centerAngle, angleSpan, radius, wordWidth, ribbonHeight, borderPadding) {
    ctx.save();
    
    // Calculate arc parameters for word segment
    const startAngle = centerAngle - angleSpan / 2;
    const endAngle = centerAngle + angleSpan / 2;
    
    // Configure ribbon style
    ctx.lineWidth = ribbonHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw arc segment for individual word
    ctx.beginPath();
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.stroke();
    
    ctx.restore();
}
```

**SplineMode.js - Critical Coordinate Transformation**
```javascript
drawSingleWordRibbonOnSpline(ctx, word, startDistance, endDistance, pathLength, wordWidth, ribbonHeight, borderPadding) {
    ctx.save();
    
    // CRITICAL: Transform to match spline coordinate system
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(-centerX, -centerY);  // Essential for proper positioning
    
    // Configure ribbon rendering
    ctx.lineWidth = ribbonHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw spline segment for word
    this.drawSplineSegment(ctx, startDistance, endDistance, pathLength, true);
    
    // Restore coordinate system
    ctx.translate(centerX, centerY);
    ctx.restore();
}
```

#### Bug Symptoms and User Impact

**Visual Disappearance**:
- Selecting "Words Bound" ribbon mode resulted in complete visual disappearance of text
- Canvas appeared completely blank with no visible elements
- All other ribbon modes (Off, Character Borders, Shape Path) worked correctly

**Positioning Issues**:
- When text reappeared after mode switching, elements were "thrown to the bottom right"
- This was caused by coordinate transformation errors in the missing spline methods
- The coordinate system became corrupted without proper `ctx.translate()` restoration

**Error Pattern**:
```javascript
// Code was calling methods that didn't exist:
this.drawSingleWordRibbonOnCircle(/* parameters */);  // ❌ Method not found
this.drawSingleWordRibbonOnSpline(/* parameters */);  // ❌ Method not found

// This caused JavaScript exceptions that broke the rendering pipeline
// Result: Canvas context became corrupted, no visual output
```

#### Method Migration Process

**Extraction from Legacy Code**:
```javascript
// Located methods in legacy/script.js at lines 2030-2138
// Identified coordinate transformation requirements
// Preserved critical canvas state management logic
```

**Method Signature Updates**:
```javascript
// Legacy pattern (accessing through tool reference)
this.tool.drawSingleWordRibbonOnCircle(/* params */);

// Modular pattern (direct method calls within class)
this.drawSingleWordRibbonOnCircle(/* params */);
```

**Integration Verification**:
- Tested all ribbon modes across all path types (Circle, Rectangle, Spline)
- Verified coordinate transformations preserved correct positioning  
- Confirmed animation offset calculations remained accurate
- Validated export functionality maintained compatibility

#### Prevention Strategy

**Code Review Checklist**:
- [ ] All public methods from original class are present in new modules
- [ ] Method calls updated to use correct scope (`this.` vs `this.tool.`)
- [ ] Coordinate transformations preserved exactly as in legacy implementation
- [ ] Canvas state management (save/restore) maintained correctly
- [ ] All ribbon modes tested across all path types

**Architecture Pattern**:
The bug highlighted the importance of interface completeness when modularizing code. The modular architecture now includes comprehensive ribbon support as a core requirement for all path mode modules.

## JavaScript Module Documentation

### TextTickerTool.js - Main Orchestrator (~800 lines)

**Primary Responsibilities**:
- P5.js instance management and canvas coordination
- UI state management and control event handling
- Module composition and communication coordination
- Path mode switching and routing logic
- Shared state management across all modules

**Key Methods**:
```javascript
// Core initialization and P5.js management
constructor()                    // Module composition and UI binding
createP5Instance()              // P5.js setup with mouse/resize handlers
setupControls()                 // Event listener registration

// Path rendering coordination  
drawTextOnPath()                // Routes to appropriate module based on path mode
renderText(hideGuides = false)  // Main rendering pipeline with export support
updateCurrentTextDisplay()     // UI text preview updates

// UI state management
updatePathModeControls()        // Module visibility switching
updateZoomLevel()               // Canvas zoom and pan coordination
handleCanvasResize()            // Responsive canvas management

// Module communication bridges
delegateMousePressed(mouseX, mouseY) // Route mouse events to active module
updateAnimationOffset()         // Animation state coordination
```

**Module Integration Pattern**:
```javascript
constructor() {
    // Composition pattern with dependency injection
    this.shapeMode = new ShapeMode(this);
    this.splineMode = new SplineMode(this);
    this.exportManager = new ExportManager(this);
    
    // Shared state accessible by all modules
    this.p5Instance = null;
    this.currentText = "Sample Text";
    this.currentPathMode = "shape";
    // ... other shared properties
}
```

### ShapeMode.js - Geometric Path System (~510 lines)

**Primary Responsibilities**:
- Circle and rectangle path text rendering
- Shape-specific ribbon drawing (Character Borders, Shape Path, Words Bound)
- Parametric path calculations and character positioning
- Shape property management (radius, dimensions, rotation)

**Key Methods**:
```javascript
// Primary text rendering
drawTextOnShape()               // Main dispatcher for shape-based text
drawTextOnCircle()             // Circle path algorithm with animation support
drawTextOnRectangle()          // Rectangle path with corner radius support

// Ribbon rendering system
drawRibbonOnShape()            // Shape ribbon dispatcher
drawRibbonOnCircle()           // Circle ribbon (Character Borders, Shape Path)
drawRibbonOnRectangle()        // Rectangle ribbon rendering
drawSingleWordRibbonOnCircle()    // Words Bound: individual word arc segments
drawSingleWordRibbonOnRectangle() // Words Bound: word-level rectangle segments

// Path calculations
calculateCirclePathLength()     // Circumference calculations
calculateRectanglePathLength()  // Perimeter with corner radius support
getCharacterPositionOnCircle()  // Character placement with rotation
getCharacterPositionOnRectangle() // Rectangle path character positioning
```

**Shape Path Algorithms**:
```javascript
// Circle text rendering with even character distribution
drawTextOnCircle() {
    const circumference = 2 * Math.PI * radius;
    const characterSpacing = circumference / text.length;
    
    for (let i = 0; i < text.length; i++) {
        const angle = (i * characterSpacing / radius) + animationOffset;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        // Character rendering with rotation
    }
}

// Rectangle path with corner radius support
drawTextOnRectangle() {
    const perimeter = 2 * (width + height) - 8 * cornerRadius + 2 * Math.PI * cornerRadius;
    // Complex path calculation with linear segments and rounded corners
}
```

### SplineMode.js - Custom Curve System (~585 lines)

**Primary Responsibilities**:
- Custom spline path creation and editing
- Catmull-Rom curve interpolation and path calculations
- Interactive point management (creation/deletion)
- Spline-specific coordinate transformations and ribbon rendering
- Arc-length parameterization for consistent character spacing

**Key Methods**:
```javascript
// Primary spline rendering
drawTextOnSpline()             // Main spline text algorithm with coordinate transforms
drawSplineGuides()             // Interactive editing visualization
drawSplineInterpolation()      // Path rendering (linear/curved modes)

// Interactive editing system
handleSplineMousePressed(x, y)  // Point creation/deletion interface
clearSplinePoints()             // Reset spline to empty state
updateSplinePointCount()        // UI counter updates

// Path calculations and interpolation
calculateSplinePathLength()     // Arc-length parameterization
getPointOnSplinePath(distance)  // Character positioning along path
catmullRomInterpolate(p0, p1, p2, p3, t) // Smooth curve interpolation
calculateSegmentLength(segmentIndex) // Individual segment length

// Spline ribbon system
drawRibbonOnSpline()           // Spline ribbon dispatcher
drawSingleWordRibbonOnSpline() // Words Bound: word-level spline segments
drawSplineSegment(ctx, startDist, endDist) // Helper for ribbon drawing
```

**Spline Coordinate System**:
```javascript
// Critical coordinate transformation for spline rendering
drawTextOnSpline() {
    const ctx = p.canvas.getContext('2d');
    ctx.save();
    
    // Transform to spline coordinate system
    const centerX = p.canvas.width / 2;
    const centerY = p.canvas.height / 2;
    ctx.translate(-centerX, -centerY);
    
    // Character positioning along spline
    for (each character) {
        const point = this.getPointOnSplinePath(distanceAlongPath);
        ctx.translate(point.x + centerX, point.y + centerY);
        ctx.rotate(point.angle);
        // Render character
        ctx.restore(); ctx.save();
    }
    
    ctx.translate(centerX, centerY);
    ctx.restore();
}
```

**Arc-Length Parameterization**:
```javascript
// Ensures consistent character spacing regardless of curvature
calculateSplinePathLength() {
    let totalLength = 0;
    const resolution = this.curveType === "curved" ? 100 : 1;
    
    for (let i = 0; i < this.splinePoints.length - 1; i++) {
        if (this.curveType === "linear") {
            totalLength += this.distance(points[i], points[i + 1]);
        } else {
            // Sample curved segment at high resolution
            for (let t = 0; t < resolution; t++) {
                const t1 = t / resolution;
                const t2 = (t + 1) / resolution;
                const p1 = this.catmullRomInterpolate(...controlPoints, t1);
                const p2 = this.catmullRomInterpolate(...controlPoints, t2);
                totalLength += this.distance(p1, p2);
            }
        }
    }
    
    return totalLength;
}
```

### ExportManager.js - Output Generation System (~300 lines)

**Primary Responsibilities**:
- Export modal management and user interface
- PNG static image export with guide hiding
- PNG sequence animation export (ZIP packaging)
- MP4/WebM video generation with FFmpeg integration
- Export history tracking and progress management

**Key Methods**:
```javascript
// Modal management
showExportModal()              // Display export options interface
hideExportModal()              // Close export modal
handleModalExport()            // Process export based on selected format

// Export format implementations
exportPNG()                    // Static image export with guide hiding
exportPNGSequence(duration)    // Animation frames to ZIP file
exportVideo(duration)          // MP4/WebM with frame-by-frame capture

// Video processing pipeline
createVideoFromFrames(frames, frameRate) // MediaRecorder-based video creation
convertToMP4(webmBlob)         // FFmpeg conversion for MP4 output
downloadVideo(blob, format)    // File download with history tracking

// Export utilities
addToExportHistory(format, filename) // Session tracking
cancelExport()                 // User cancellation support
```

**Export Process Flow**:
```javascript
// PNG Sequence Export with Animation
async exportPNGSequence(duration) {
    const frameRate = 60;
    const totalFrames = Math.ceil(duration * frameRate);
    const images = [];
    
    // Capture animation frames
    for (let frame = 0; frame < totalFrames; frame++) {
        // Update animation state
        this.tool.animationOffset = (frame * 360 / totalFrames) % 360;
        
        // Render frame without guides
        this.tool.renderText(true);
        
        // Capture as blob
        const blob = await new Promise(resolve => {
            this.tool.p5Instance.canvas.toBlob(resolve, 'image/png');
        });
        
        images.push({ name: `frame_${frame.toString().padStart(4, '0')}.png`, blob });
    }
    
    // Package to ZIP and download
    const zip = new JSZip();
    images.forEach(img => zip.file(img.name, img.blob));
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    // Download ZIP file
}
```

## CSS Modular Architecture Documentation

### Design System Foundation

The CSS architecture implements a 099.supply-inspired minimal design system with dark mode aesthetics optimized for typography work.

#### CSS Variables System (variables.css)
```css
:root {
    /* Frame Dimensions - Responsive canvas sizing */
    --frame-width: 800px;
    --frame-height: 600px;
    
    /* Dark Mode Color Palette - Ultra-minimalistic */
    --border-width: 1px;
    --border-color: #2a2a2a;           /* Primary borders */
    --border-color-subtle: #1f1f1f;   /* Secondary borders */
    --text-color: #e5e5e5;            /* Primary text */
    --text-color-light: #888;         /* Secondary text */
    --text-color-subtle: #555;        /* Tertiary text */
    --text-color-bright: #fff;        /* High contrast text */
    
    /* Component-Specific Variables */
    --side-panel-width: 260px;
    --side-panel-bg: #0f0f0f;
    --button-primary: #e5e5e5;
    --button-hover: #fff;
    
    /* Background Hierarchy */
    --bg-primary: #121212;            /* Main background */
    --bg-secondary: #181818;          /* Panel backgrounds */
    --bg-tertiary: #1f1f1f;           /* Component backgrounds */
}
```

#### Layout System (layout.css)
- **CSS Reset**: Universal box-sizing, margin/padding reset
- **Typography Foundation**: System font stack with optimized letter-spacing
- **Flexbox Layout**: Side panel + main content area structure
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1200px
- **Component Structure**: Header, side panel, content area with proper overflow handling

#### Control System (controls.css)
- **Form Elements**: Inputs, selects, textareas with dark theme styling
- **Interactive States**: Hover, focus, active states for all controls
- **Accessibility**: Proper focus indicators and keyboard navigation
- **Spacing System**: Consistent margins and padding using 8px grid system

#### Toggle Components (toggles.css)  
- **Custom Toggle Switches**: iOS-style toggles with smooth animations
- **Radio Button Styling**: Custom radio buttons with dark theme
- **Checkbox Components**: Styled checkboxes with proper states

#### Modal System (modals.css)
- **Export Modal**: Full-screen modal with backdrop blur
- **Help Modal**: Documentation modal with scrollable content
- **Animation System**: Smooth enter/exit animations with CSS transitions

#### Canvas Integration (style.css)
- **P5.js Canvas Positioning**: Absolute positioning for canvas overlay
- **Frame Container**: Responsive container with aspect ratio preservation
- **Alpha Background**: Checkerboard pattern for transparent previews
- **Zoom Controls**: CSS transforms for canvas scaling and panning

### CSS Architecture Benefits

#### Modularity and Maintainability
- **Separation of Concerns**: Each CSS file handles specific UI domains
- **Variable System**: Centralized theming with CSS custom properties
- **Component Isolation**: Styles scoped to specific component responsibilities
- **Easy Customization**: Theme changes through variable updates only

#### Performance Optimization
- **Minimal Specificity**: Flat CSS architecture avoiding deep nesting
- **Efficient Selectors**: Class-based selectors for optimal performance
- **CSS Grid/Flexbox**: Modern layout techniques for better rendering
- **Optimized Animations**: Hardware-accelerated transforms and opacity changes

#### Responsive Design Strategy
```css
/* Mobile-First Responsive Approach */
@media (max-width: 768px) {
    .main-container {
        flex-direction: column;  /* Stack layout vertically */
    }
    
    .side-panel {
        width: 100%;            /* Full-width controls */
        border-right: none;
        border-bottom: 1px solid var(--side-panel-border);
    }
    
    .frame-container {
        /* JavaScript handles aspect ratio preservation */
        max-width: none;
        max-height: none;
    }
}
```

#### Dark Mode Implementation
- **Consistent Color System**: All colors derived from CSS variables
- **High Contrast Ratios**: WCAG-compliant text contrast ratios
- **Visual Hierarchy**: Clear information hierarchy through color and typography
- **Eye Strain Reduction**: Low-brightness backgrounds optimized for extended use

## Development Patterns

### Code Organization
- **Modular Architecture**: Composition pattern with specialized classes
- **Zero Breaking Changes**: Seamless transition from monolithic to modular
- **Dependency Injection**: Modules receive `tool` instance for communication
- **Event-Driven Updates**: UI controls trigger immediate re-rendering
- **P5.js Instance Management**: Proper setup/teardown for canvas resizing
- **Memory Management**: Efficient image loading and P5.js resource handling

### Modular Development Workflows

#### Typography Development Workflow
1. **Font Integration**: Add new fonts to Google Fonts CDN in `index.html`
2. **Control Creation**: Add UI controls in HTML with event handlers in `TextTickerTool.js`
3. **Module Selection**: Choose appropriate module (ShapeMode/SplineMode) for new feature
4. **Rendering Implementation**: Add rendering methods to selected module class
5. **Path Dispatcher**: Update `drawTextOnPath()` in TextTickerTool to route to new methods
6. **Animation Support**: Ensure animation offset calculations work across modules  
7. **Ribbon Integration**: Add ribbon methods with full Words Bound support
8. **Export Compatibility**: Verify ExportManager works with new rendering methods
9. **Cross-Module Testing**: Test functionality across all path modes and ribbon types
10. **Documentation**: Update method documentation and usage examples

#### CSS Development Workflow
1. **Variable Definition**: Add new CSS variables to `css/variables.css`
2. **Module Selection**: Choose appropriate CSS file based on component type
3. **Component Implementation**: Add styles following existing naming conventions
4. **Responsive Design**: Add mobile breakpoints and responsive behavior
5. **Theme Integration**: Ensure dark mode compatibility with color variables
6. **Cross-Browser Testing**: Verify compatibility across modern browsers
7. **Performance Validation**: Check for render-blocking or layout thrashing

#### Module Extension Workflow
1. **Architecture Analysis**: Understand existing module responsibilities
2. **Interface Design**: Plan public methods and dependency injection patterns
3. **Class Creation**: Create new module class with constructor dependency injection
4. **TextTickerTool Integration**: Add module instantiation in main class constructor
5. **Method Delegation**: Add routing logic in TextTickerTool for new module methods
6. **Testing**: Verify zero breaking changes and proper module communication
7. **Documentation**: Update architecture diagrams and usage examples

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

### Adding New Typography Mode (Detailed Guide)

#### 1. Architecture Planning
```javascript
// Decide: Extend existing module or create new module?
// ShapeMode: For parametric/mathematical paths (circle, rectangle, polygon)
// SplineMode: For point-based custom curves and user-drawn paths
// New Module: For complex systems (physics, procedural generation, etc.)
```

#### 2. Module Implementation
```javascript
// Example: Creating new PhysicsMode module
class PhysicsMode {
    constructor(tool) {
        this.tool = tool;  // Dependency injection for shared state access
        this.particles = [];
        this.springs = [];
    }
    
    // Core rendering method - called by TextTickerTool
    drawTextOnPhysics() {
        // Physics simulation and character positioning
        this.updatePhysics();
        this.renderCharactersOnPhysics();
    }
    
    // Ribbon support - all modes must support all ribbon types
    drawRibbonOnPhysics() {
        switch (this.tool.currentRibbonMode) {
            case 'off': break;
            case 'characterBorders': this.drawCharacterBordersRibbon(); break;
            case 'shapePath': this.drawShapePathRibbon(); break;
            case 'wordsBound': this.drawWordsRibbonOnPhysics(); break;
        }
    }
    
    // Words Bound support - individual word-level ribbon segments
    drawSingleWordRibbonOnPhysics(word, startIndex, endIndex) {
        // Physics-based word ribbon rendering
    }
}
```

#### 3. TextTickerTool Integration
```javascript
// In TextTickerTool constructor
constructor() {
    // Add new module to composition
    this.shapeMode = new ShapeMode(this);
    this.splineMode = new SplineMode(this);
    this.physicsMode = new PhysicsMode(this);  // New module
    this.exportManager = new ExportManager(this);
}

// Update path dispatcher
drawTextOnPath() {
    if (this.currentPathMode === "shape") {
        this.shapeMode.drawTextOnShape();
    } else if (this.currentPathMode === "spline") {
        this.splineMode.drawTextOnSpline();
    } else if (this.currentPathMode === "physics") {  // New path mode
        this.physicsMode.drawTextOnPhysics();
    }
}

// Add ribbon dispatcher routing
drawRibbonForCurrentShape() {
    if (this.currentRibbonMode === 'off') return;
    
    if (this.currentPathMode === "shape") {
        this.shapeMode.drawRibbonOnShape();
    } else if (this.currentPathMode === "spline") {
        this.splineMode.drawRibbonOnSpline();
    } else if (this.currentPathMode === "physics") {  // New ribbon routing
        this.physicsMode.drawRibbonOnPhysics();
    }
}
```

#### 4. UI Integration
```html
<!-- Add to Path Mode dropdown in index.html -->
<select id="pathModeSelect">
    <option value="shape">Shape</option>
    <option value="spline">Spline</option>
    <option value="physics">Physics</option>  <!-- New option -->
</select>

<!-- Add mode-specific controls section -->
<div id="physicsPropertiesSection" class="controls-section" style="display: none;">
    <h4>Physics Properties</h4>
    <!-- Physics-specific controls -->
    <div class="frame-control-row">
        <label for="gravitySlider">Gravity:</label>
        <input type="range" id="gravitySlider" min="0" max="2" step="0.1" value="0.5">
    </div>
</div>
```

#### 5. Control Visibility Management
```javascript
// In TextTickerTool - update control visibility logic
updatePathModeControls() {
    // Hide all mode-specific sections
    this.shapePropertiesSection.style.display = "none";
    this.splinePropertiesSection.style.display = "none";
    this.physicsPropertiesSection.style.display = "none";  // New section
    
    // Show relevant section
    if (this.currentPathMode === "shape") {
        this.shapePropertiesSection.style.display = "block";
    } else if (this.currentPathMode === "spline") {
        this.splinePropertiesSection.style.display = "block";
    } else if (this.currentPathMode === "physics") {  // New mode visibility
        this.physicsPropertiesSection.style.display = "block";
    }
}
```

#### 6. Animation Integration
```javascript
// In new module - handle animation offset
drawTextOnPhysics() {
    // Apply animation offset to physics simulation
    const timeOffset = this.tool.animationOffset * 0.016; // Convert to seconds
    this.updatePhysicsSimulation(timeOffset);
    // Character rendering with animated positions
}
```

#### 7. Export Compatibility
```javascript
// Verify ExportManager works with new mode
// ExportManager calls this.tool.renderText(hideGuides) which will:
// 1. Route to drawTextOnPath() 
// 2. Call new module's drawTextOnPhysics()
// 3. Include ribbon rendering if enabled
// No changes needed if module follows interface correctly
```

#### 8. Testing Checklist
- [ ] All ribbon modes work (Off, Character Borders, Shape Path, Words Bound)
- [ ] Animation offset produces smooth animation
- [ ] Export functionality works (PNG, PNG Sequence, MP4)
- [ ] UI controls show/hide correctly when switching path modes
- [ ] No console errors or exceptions
- [ ] Performance acceptable (smooth 60fps animation)
- [ ] Mobile responsive layout works
- [ ] All typography controls (font, weight, size, color) apply correctly

### Integrating New Fonts
1. Add font to Google Fonts CDN link in HTML
2. Update font dropdown options
3. Test variable font support or add fallback handling
4. Verify export quality with new font

### Modifying Text Rendering
- **Shape Mode**: Algorithms in `js/ShapeMode.js` - `drawTextOnCircle()` and `drawTextOnRectangle()` methods
- **Spline Mode**: Algorithms in `js/SplineMode.js` - `drawTextOnSpline()` with coordinate transformation
- **Path Dispatcher**: Main routing in `js/TextTickerTool.js` - `drawTextOnPath()` delegates to modules
- **Ribbon System**: Words Bound support in both modules with arc-segment rendering
- **Font Application**: Canvas 2D context font properties managed per module
- **Canvas Management**: P5.js instance in TextTickerTool with module mouse delegation
- **Export System**: ExportManager coordinates with modules using `renderText(hideGuides=true)`

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

## Advanced Typography Features

### Arc-Length Parameterization System
- **Consistent Speed**: Characters distributed evenly along path regardless of curvature
- **Path Length Caching**: Efficient recalculation only when spline points change
- **Adaptive Sampling**: Higher resolution for curved paths, optimized for linear segments
- **Animation Integration**: Smooth animation offset calculations across all path types

### Words Bound Ribbon Mode
- **Word-Level Segmentation**: Individual ribbon segments for each word
- **Arc-Based Rendering**: Smooth ribbon segments following path curvature
- **Coordinate Transformation**: Proper positioning for spline mode with canvas transforms
- **Border Padding**: Configurable spacing around word boundaries

### Variable Font Integration
- **Real-Time Weight Control**: Smooth transitions between font weights (400-800)
- **Hybrid Rendering**: P5.js transformations + Canvas 2D for variable font support
- **Font Loading Optimization**: Preconnect and async loading for performance
- **Fallback Handling**: Graceful degradation for browsers without variable font support

### Export System Architecture
- **Format Agnostic**: PNG, MP4, PNG sequences with unified interface
- **Guide Management**: Automatic hiding/restoration during export process
- **Frame-by-Frame Generation**: Precise animation control with customizable frame rates
- **Resolution Independence**: Export at original canvas resolution regardless of zoom
- **Progress Tracking**: Real-time export progress with user feedback

## Performance Optimizations

### Rendering Efficiency
- **Conditional Re-rendering**: Only redraw when state changes
- **Path Length Caching**: Store calculated path lengths to avoid recalculation
- **Guide Toggle**: Optional rendering of editing guides for better performance
- **Canvas State Management**: Efficient save/restore cycles for transformations

### Memory Management
- **P5.js Instance Lifecycle**: Proper setup and teardown procedures
- **Image Resource Handling**: Efficient loading and disposal of background/foreground images
- **Export Buffer Management**: Clean up temporary canvases and data after export
- **Module Isolation**: Prevent memory leaks through proper module encapsulation

This modular architecture provides a robust foundation for advanced typography tools with clear separation of concerns, maintainable code structure, and extensible design patterns for future enhancements.