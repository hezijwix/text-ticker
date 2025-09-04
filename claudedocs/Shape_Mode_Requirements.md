# Shape Mode Requirements & Implementation Plan

## Overview
Enhanced text ticker tool with multiple shape paths, dynamic UI controls, text ribbon visualization, and marquee animation capabilities.

## Core Requirements

### 1. Shape Types & Parameters
**Circle**
- Properties: radius, rotation (x, y, z)
- Existing: Current `drawTextOnCircle()` implementation
- Extension: Add 3D rotation support

**Rectangle** 
- Properties: width, height, rounded corners, rotation (x, y, z)
- Path Algorithm: Text follows rectangular perimeter with corner handling
- Corner Logic: Smooth text transition around rounded corners

**Triangle**
- Properties: size, rounded corners, rotation (x, y, z)  
- Path Algorithm: Text follows triangular perimeter
- Vertex Handling: Smooth transitions at triangle points

### 2. Dynamic UI Architecture
**Shape Selection**
- Dropdown/tabs for Circle, Rectangle, Triangle
- JavaScript event handlers update parameter visibility
- Each shape shows only relevant controls

**Parameter Controls**
- Circle: radius slider, x/y/z rotation sliders
- Rectangle: width/height sliders, corner radius, x/y/z rotation
- Triangle: size slider, corner radius, x/y/z rotation

### 3. Typography Controls  
**Font Enhancements**
- Font size slider (addition to existing weight controls)
- Color picker for text color (RGB/hex input)
- Integration with existing variable font system

### 4. Text Ribbon System
**"Text Ribbon" Toggle**
- Checkbox to show/hide the path visualization
- Renders path outline below text layer
- Customizable appearance:
  - Ribbon width control (stroke weight)
  - Ribbon color picker
  - Optional ribbon fill vs stroke only

**Visual Design**
- Ribbon appears as colored outline following exact text path
- Layered rendering: background → ribbon → text → foreground

### 5. Marquee Animation
**Endless Text Movement**
- Text continuously moves along the shape path
- Seamless loop when text completes circuit
- Speed control slider (pixels per frame or RPM)
- Animation toggle (play/pause)

**Technical Approach**
- Offset parameter in text positioning algorithm
- Frame-based animation using P5.js `frameCount` or custom timer
- Speed calculation: distance per frame based on path circumference

## Technical Implementation Strategy

### P5.js Architecture Extensions

**Shape Path Calculation**
```javascript
// Extend existing circular algorithm
class ShapePathCalculator {
  getPathPoint(progress, shapeType, parameters) {
    switch(shapeType) {
      case 'circle': return this.getCirclePoint(progress, parameters);
      case 'rectangle': return this.getRectanglePoint(progress, parameters); 
      case 'triangle': return this.getTrianglePoint(progress, parameters);
    }
  }
}
```

**Dynamic UI System**
```javascript
// Shape-aware UI updates
updateShapeControls(selectedShape) {
  hideAllShapeControls();
  showControlsForShape(selectedShape);
  updateParameterVisibility();
}
```

**Text Ribbon Rendering**
```javascript
// Ribbon path visualization  
drawTextRibbon(pathPoints, ribbonWidth, ribbonColor) {
  p.strokeWeight(ribbonWidth);
  p.stroke(ribbonColor);
  p.noFill();
  // Draw path using P5.js shape functions
}
```

**Marquee Animation**
```javascript
// Animation loop integration
updateTextPosition() {
  this.textOffset += this.animationSpeed;
  if (this.textOffset > this.pathCircumference) {
    this.textOffset = 0; // Seamless loop
  }
}
```

### Integration with Existing Architecture

**TextTickerTool Class Extensions**
- Maintain existing P5.js instance mode structure
- Extend `drawTextOnCircle()` to `drawTextOnPath(shape, params)`
- Add shape parameter management
- Integrate with existing font/export systems

**Export Compatibility**
- Text ribbon layer option in PNG/MP4 export
- Maintain existing high-quality export functionality
- Layer control: text-only or text+ribbon export options

## Implementation Priority

1. **Shape Path Algorithms** - Core text positioning for rectangle/triangle
2. **Dynamic UI Controls** - Shape selection and parameter visibility  
3. **Text Ribbon System** - Path visualization with customization
4. **Marquee Animation** - Endless movement with speed control
5. **Font Controls** - Size and color selection integration

## Success Criteria

✅ **Shape Modes**: Three distinct shape types with accurate text positioning  
✅ **UI Responsiveness**: Controls update dynamically based on shape selection  
✅ **Text Ribbon**: Customizable path visualization system  
✅ **Animation**: Smooth marquee movement with speed control  
✅ **Integration**: Seamless integration with existing typography and export systems

---

*Updated: Text ribbon terminology (previously "spline") for accurate feature description*