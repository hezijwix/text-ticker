# Text Ribbon Intersection Issue - Technical Analysis

## Problem Description

Character ribbons in spline mode are still intersecting/overlapping incorrectly despite implementing a two-pass rendering system. The ribbons cut through each other instead of layering properly like the outer stroke outline does.

![Current Issue](https://user-provided-image-showing-intersecting-ribbons)
*Current behavior: Red character ribbons intersect and cut through each other*

## Expected Behavior

Character ribbons should layer on top of each other cleanly, similar to how the outer stroke outline behaves - where later elements appear to "cover" earlier ones without visible intersections.

## Technical Context

### Framework & Architecture
- **Core Engine**: P5.js v1.11.8 (instance mode)
- **Rendering**: Hybrid system using P5.js transformations + Canvas 2D context
- **Architecture**: Modular composition pattern with dependency injection
- **Path System**: Dual-mode (Shape geometries + Custom splines)

### Current Implementation

#### File Structure
```
js/
├── TextTickerTool.js     # Main orchestrator (~800 lines)
├── SplineMode.js         # Custom curves (~585 lines) 
├── ShapeMode.js          # Geometric paths (~510 lines)
└── ExportManager.js      # Output generation (~300 lines)
```

#### Rendering Pipeline
1. **Main Orchestration** (`TextTickerTool.js:renderText()`)
   ```javascript
   // Rendering order:
   drawBackground() → drawRibbons() → drawText() → drawForeground()
   ```

2. **Ribbon Rendering** (`TextTickerTool.js:drawCharacterRibbon()`)
   ```javascript
   // Delegates to mode-specific implementations
   if (currentPathMode === 'spline') {
       splineMode.drawSplineRibbon(ctx, text, borderWidth);
   }
   ```

3. **Spline Character Ribbons** (`SplineMode.js:drawSplineRibbon()`)
   ```javascript
   // Two-pass rendering system (implemented but not working)
   // Pass 1: All strokes (background)
   // Pass 2: All fills (foreground)
   ```

### Attempted Solution: Two-Pass Rendering

#### Implementation Details
```javascript
// SplineMode.js - drawSplineRibbon method
drawSplineRibbon(ctx, text, borderWidth) {
    // Collect all character positions first
    const characterPositions = [];
    for (let i = 0; i < text.length; i++) {
        const distanceAlongPath = (i * charSpacing + animationOffsetDistance) % pathLength;
        const pathPoint = this.getPointOnSplinePath(distanceAlongPath);
        characterPositions.push({
            char: text[i], x: transformedX, y: transformedY, angle: pathPoint.angle
        });
    }
    
    // Pass 1: Draw all strokes
    if (this.tool.strokeWidth > 0) {
        for (const pos of characterPositions) {
            this.tool.drawSingleCharacterRibbon(ctx, pos.char, pos.x, pos.y, pos.angle, borderWidth, 'stroke');
        }
    }
    
    // Pass 2: Draw all fills
    for (const pos of characterPositions) {
        this.tool.drawSingleCharacterRibbon(ctx, pos.char, pos.x, pos.y, pos.angle, borderWidth, 'fill');
    }
}
```

#### Character Ribbon Drawing (`TextTickerTool.js`)
```javascript
drawSingleCharacterRibbon(ctx, char, x, y, angle, borderWidth, renderMode = 'both') {
    // Creates rounded/sharp rectangle behind each character
    // Supports 'stroke', 'fill', or 'both' rendering modes
    
    ctx.beginPath();
    if (this.boundsType === "sharp") {
        ctx.rect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight);
    } else {
        // rounded rectangle using ctx.roundRect() or fallback
    }
    
    if (renderMode === 'stroke' || renderMode === 'both') {
        ctx.stroke(); // Background layer
    }
    if (renderMode === 'fill' || renderMode === 'both') {
        ctx.fill();   // Foreground layer
    }
}
```

## Why Two-Pass Rendering Failed

The two-pass system should theoretically work, but ribbons are still intersecting. Possible issues:

1. **Canvas State Management**: Context transformations may not be preserved correctly between passes
2. **Path Coordinate System**: Spline points use absolute canvas coordinates, but rendering happens in rotated coordinate system
3. **Z-Index/Layering**: Canvas 2D doesn't have true z-indexing - later draws always appear on top
4. **Intersection Geometry**: Character ribbons may be overlapping due to character spacing vs ribbon size calculations

## Technical Constraints

### Coordinate Systems
- **Spline Points**: Stored in absolute canvas coordinates
- **Character Positioning**: Requires transformation to rotated coordinate system
- **Ribbon Drawing**: Individual character-based rectangles with rotations

### Canvas Rendering Context
```javascript
// Current coordinate transformation chain:
ctx.save();
ctx.translate(canvas.width/2, canvas.height/2);    // Center
ctx.rotate(globalRotation);                        // Global rotation
// → Delegate to spline mode
ctx.translate(-centerX, -centerY);                 // Spline coordinate adjustment
// → Individual character transforms per ribbon
ctx.translate(x, y); ctx.rotate(angle);           // Per-character transform
```

### Character Metrics & Spacing
- **Arc-length parameterization**: Even character distribution along curved paths
- **Character sizing**: Font size + border padding determines ribbon dimensions
- **Animation offset**: Characters animated along path with wrapping

## Similar Working Implementation

The **outer stroke outline** works correctly and could serve as a reference:
- Located in: `SplineMode.js:drawSplinePathRibbon()`
- Draws continuous path stroke rather than individual character rectangles
- Uses single path with `ctx.strokeStyle` and `ctx.lineWidth`

## Alternative Approaches to Consider

1. **Continuous Path Ribbons**: Instead of individual character rectangles, draw continuous ribbon segments
2. **Clipping Masks**: Use canvas clipping to ensure proper layering
3. **Separate Canvas Layers**: Render ribbons on separate canvas element
4. **Depth Sorting**: Calculate ribbon intersections and render in depth order
5. **Path Offsetting**: Create parallel paths for ribbon edges instead of rectangles

## Request for Alternative Solution

Current two-pass rendering approach is not solving the intersection issue. Need alternative approach that ensures character ribbons layer properly without cutting through each other, similar to how the outer stroke outline behaves.

## Files to Reference

- `js/SplineMode.js` - Lines 868-914 (drawSplineRibbon method)
- `js/TextTickerTool.js` - Lines 1247-1296 (drawSingleCharacterRibbon method)  
- `js/SplineMode.js` - Lines 950-1006 (drawSplinePathRibbon - working reference)
- `index.html` - UI controls and P5.js setup