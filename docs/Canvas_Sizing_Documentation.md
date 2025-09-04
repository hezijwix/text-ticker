# Canvas Sizing and Resizing Documentation

This document contains all the information about canvas sizing, resizing, zoom behavior, and content fitting for implementing the same behavior in other tools.

## Frame Sizing System

### CSS Variables
```css
:root {
    --frame-width: 800px;   /* Default width */
    --frame-height: 600px;  /* Default height */
}
```

### Frame Container Structure
```css
.frame-container {
    width: var(--frame-width);
    height: var(--frame-height);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
}
```

## Frame Size Management

### Getting Frame Size
```javascript
getFrameSize() {
    return {
        width: parseInt(this.widthInput.value) || 800,
        height: parseInt(this.heightInput.value) || 600
    };
}
```

### Setting Frame Size
```javascript
applyFrameSize() {
    const width = parseInt(this.widthInput.value) || 800;
    const height = parseInt(this.heightInput.value) || 600;
    
    // Clamp values to reasonable limits
    const clampedWidth = Math.max(200, Math.min(2000, width));
    const clampedHeight = Math.max(150, Math.min(1500, height));
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--frame-width', `${clampedWidth}px`);
    document.documentElement.style.setProperty('--frame-height', `${clampedHeight}px`);
    
    // Update input fields with clamped values
    this.widthInput.value = clampedWidth;
    this.heightInput.value = clampedHeight;
    
    // Apply responsive constraints that preserve aspect ratio
    this.applyResponsiveConstraints(clampedWidth, clampedHeight);
    
    // Update Three.js renderer size
    if (this.renderer && this.camera) {
        this.camera.aspect = clampedWidth / clampedHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(clampedWidth, clampedHeight);
    }
}
```

## Responsive Constraints

### Aspect Ratio Preservation
```javascript
applyResponsiveConstraints(targetWidth, targetHeight) {
    // Get the content area dimensions to calculate available space
    const contentArea = this.frameContainer.parentElement;
    const contentRect = contentArea.getBoundingClientRect();
    
    // Account for content area padding (20px on each side for mobile, 40px for desktop)
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? 40 : 80; // 20px or 40px on each side
    const availableWidth = contentRect.width - padding;
    const availableHeight = contentRect.height - padding;
    
    // Calculate the aspect ratio
    const aspectRatio = targetWidth / targetHeight;
    
    // Determine the constraining dimension while preserving aspect ratio
    let constrainedWidth = targetWidth;
    let constrainedHeight = targetHeight;
    
    // Check if width needs to be constrained
    if (constrainedWidth > availableWidth) {
        constrainedWidth = availableWidth;
        constrainedHeight = constrainedWidth / aspectRatio;
    }
    
    // Check if height needs to be constrained after width adjustment
    if (constrainedHeight > availableHeight) {
        constrainedHeight = availableHeight;
        constrainedWidth = constrainedHeight * aspectRatio;
    }
    
    // Apply the constraints as CSS properties on the frame container
    this.frameContainer.style.maxWidth = `${constrainedWidth}px`;
    this.frameContainer.style.maxHeight = `${constrainedHeight}px`;
}
```

### CSS Responsive Design
```css
.content-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-primary);
    padding: 40px;
    overflow: auto;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
    .content-area {
        padding: 20px;
    }
}

@media (max-width: 768px) {
    .content-area {
        padding: 20px;
    }
    
    .frame-container {
        /* Allow frame to be constrained by JavaScript for proper aspect ratio */
        max-width: none;
        max-height: none;
    }
}
```

## Zoom System

### Zoom Properties
```javascript
// Zoom properties
this.currentZoom = 1.0; // Current zoom level (1.0 = 100%)
this.isZoomed = false; // Whether preview is zoomed
```

### Zoom Controls Setup
```javascript
// Zoom controls
this.zoomSlider = document.getElementById('zoomSlider');
this.zoomValue = document.getElementById('zoomValue');
this.resetZoomBtn = document.getElementById('resetZoomBtn');

// Zoom event listeners
this.zoomSlider.addEventListener('input', (e) => {
    const zoomValue = parseFloat(e.target.value);
    this.setZoom(zoomValue);
    this.zoomValue.textContent = Math.round(zoomValue * 100) + '%';
});

this.resetZoomBtn.addEventListener('click', () => {
    this.resetZoom();
});
```

### Zoom Implementation
```javascript
setZoom(zoomLevel) {
    this.currentZoom = zoomLevel;
    this.isZoomed = zoomLevel !== 1.0;
    
    // Apply CSS transform to the frame container
    const transform = `scale(${zoomLevel})`;
    this.frameContainer.style.transform = transform;
    this.frameContainer.style.transformOrigin = 'center center';
    
    console.log('Zoom set to:', Math.round(zoomLevel * 100) + '%');
}

resetZoom() {
    this.setZoom(1.0);
    this.zoomSlider.value = '1.0';
    this.zoomValue.textContent = '100%';
    console.log('Zoom reset to 100%');
}
```

## Canvas Coordinate System

### Getting Canvas Coordinates with Zoom Consideration
```javascript
getCanvasCoordinates(event) {
    // Get the frame container's bounding rect
    const rect = this.frameContainer.getBoundingClientRect();
    
    // Use the actual rendered frame size, not the intended size from inputs
    // This accounts for CSS constraints like max-width/max-height
    const actualFrameWidth = rect.width / this.currentZoom;
    const actualFrameHeight = rect.height / this.currentZoom;
    
    // Calculate the visual size after zoom transform
    const visualWidth = actualFrameWidth * this.currentZoom;
    const visualHeight = actualFrameHeight * this.currentZoom;
    
    // Since we're using actual dimensions, the frame fills its bounding rect perfectly
    // We only need to account for zoom transform centering within the frame container
    const zoomOffsetX = (rect.width - visualWidth) / 2;
    const zoomOffsetY = (rect.height - visualHeight) / 2;
    
    // Get mouse position relative to the frame container's bounding rect
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    
    // Adjust for zoom transform centering
    const visualX = relativeX - zoomOffsetX;
    const visualY = relativeY - zoomOffsetY;
    
    // Convert back to actual canvas coordinates by dividing by zoom
    const canvasX = visualX / this.currentZoom;
    const canvasY = visualY / this.currentZoom;
    
    return { x: canvasX, y: canvasY };
}
```

## 2D Canvas Setup and Management

### Canvas Creation and Sizing
```javascript
setup2DCanvas() {
    const frameSize = this.getFrameSize();
    
    // Create 2D canvas if it doesn't exist
    if (!this.canvas2D) {
        this.canvas2D = document.createElement('canvas');
        this.canvas2D.style.position = 'absolute';
        this.canvas2D.style.top = '0';
        this.canvas2D.style.left = '0';
        this.canvas2D.style.cursor = 'crosshair';
        this.frameContainer.appendChild(this.canvas2D);
        
        // Get 2D context
        this.ctx2D = this.canvas2D.getContext('2d');
    }
    
    // Set canvas size
    this.canvas2D.width = frameSize.width;
    this.canvas2D.height = frameSize.height;
    this.canvas2D.style.width = frameSize.width + 'px';
    this.canvas2D.style.height = frameSize.height + 'px';
    
    // Show canvas
    this.canvas2D.style.display = 'block';
    
    console.log('2D Canvas setup complete:', frameSize.width + 'x' + frameSize.height);
}
```

### Canvas Clearing
```javascript
clearCanvas() {
    if (this.ctx2D) {
        // Clear the canvas
        this.ctx2D.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        
        // Ensure we're using source-over composition for maximum compatibility
        this.ctx2D.globalCompositeOperation = 'source-over';
        
        // If background is not alpha and no background image is set, fill with background color
        if (!this.isAlphaBackground && !this.backgroundImageDataUrl) {
            const bgColor = this.currentBackgroundColor || '#121212';
            this.ctx2D.fillStyle = bgColor;
            this.ctx2D.fillRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        }
    }
}
```

## Window Resize Handling

### Resize Event Handler
```javascript
onWindowResize() {
    const frameSize = this.getFrameSize();
    
    // Update responsive constraints to maintain aspect ratio
    this.applyResponsiveConstraints(frameSize.width, frameSize.height);
    
    if (this.camera && this.renderer) {
        this.camera.aspect = frameSize.width / frameSize.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(frameSize.width, frameSize.height);
    }
    
    // Handle 2D canvas resize
    if (this.canvas2D && this.currentPreset === 'follow-spline') {
        this.canvas2D.width = frameSize.width;
        this.canvas2D.height = frameSize.height;
        this.canvas2D.style.width = frameSize.width + 'px';
        this.canvas2D.style.height = frameSize.height + 'px';
        this.clearCanvas();
        
        // Redraw spline if it exists
        if (this.splinePoints.length > 0) {
            this.drawSpline();
        }
        
        // Update 2D images if they exist
        if (this.uploadedImages.length > 0 && this.splinePoints.length > 0) {
            this.createImagesAlongSpline();
        }
    }
}

// Register resize listener
window.addEventListener('resize', () => {
    this.onWindowResize();
});
```

## Three.js Renderer Integration

### Renderer Setup
```javascript
initThreeJS() {
    // Get initial frame size
    const frameSize = this.getFrameSize();
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = this.isAlphaBackground ? null : new THREE.Color(0x121212);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, frameSize.width / frameSize.height, 0.1, 1000);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer (support transparency for alpha background mode)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(frameSize.width, frameSize.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add renderer to frame container
    this.frameContainer.appendChild(this.renderer.domElement);
}
```

## Content Positioning and Scaling

### Image Element Positioning
```javascript
// For DOM-based image elements (used in cursor trail and shuffle modes)
createTrailImageElement(imageData, index) {
    const img = document.createElement('img');
    img.src = imageData.dataUrl;
    img.style.position = 'absolute';
    img.style.pointerEvents = 'none';
    img.style.zIndex = (1000 - index).toString();
    img.style.transition = 'none';
    
    // Set initial position (centered in frame)
    const frameSize = this.getFrameSize();
    img.style.left = (frameSize.width / 2) + 'px';
    img.style.top = (frameSize.height / 2) + 'px';
    
    img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const baseSize = 80 * this.trailImageScale;
        
        if (aspectRatio > 1) {
            // Landscape
            img.style.width = baseSize + 'px';
            img.style.height = (baseSize / aspectRatio) + 'px';
        } else {
            // Portrait
            img.style.width = (baseSize * aspectRatio) + 'px';
            img.style.height = baseSize + 'px';
        }
    };
    
    this.frameContainer.appendChild(img);
    return img;
}
```

### Random Image Positioning with Scatter
```javascript
randomizeImagePosition(img) {
    // Use actual displayed frame dimensions instead of configured dimensions
    const frameRect = this.frameContainer.getBoundingClientRect();
    const frameSize = {
        width: frameRect.width,
        height: frameRect.height
    };
    
    const margin = 20;
    const imgWidth = img.offsetWidth || 100;
    const imgHeight = img.offsetHeight || 100;
    
    // Calculate canvas center
    const canvasCenterX = frameSize.width / 2;
    const canvasCenterY = frameSize.height / 2;
    
    if (this.scatterPosition === 0) {
        // When scatter position is 0, place all images at the center
        const leftPos = canvasCenterX - imgWidth / 2;
        const topPos = canvasCenterY - imgHeight / 2;
        
        img.style.left = leftPos + 'px';
        img.style.top = topPos + 'px';
    } else {
        // Calculate bounds for image centers (not top-left corners)
        const minCenterX = margin + imgWidth / 2;
        const maxCenterX = frameSize.width - margin - imgWidth / 2;
        const minCenterY = margin + imgHeight / 2;
        const maxCenterY = frameSize.height - margin - imgHeight / 2;
        
        // Calculate scatter range around canvas center
        const maxScatterX = (maxCenterX - minCenterX) / 2;
        const maxScatterY = (maxCenterY - minCenterY) / 2;
        
        const scatterRangeX = maxScatterX * this.scatterPosition;
        const scatterRangeY = maxScatterY * this.scatterPosition;
        
        // Calculate random center position within scatter bounds
        const randomCenterX = canvasCenterX + (this.seededRandom() - 0.5) * 2 * scatterRangeX;
        const randomCenterY = canvasCenterY + (this.seededRandom() - 0.5) * 2 * scatterRangeY;
        
        // Clamp to bounds and convert to top-left position
        const clampedCenterX = Math.max(minCenterX, Math.min(maxCenterX, randomCenterX));
        const clampedCenterY = Math.max(minCenterY, Math.min(maxCenterY, randomCenterY));
        
        const leftPos = clampedCenterX - imgWidth / 2;
        const topPos = clampedCenterY - imgHeight / 2;
        
        img.style.left = leftPos + 'px';
        img.style.top = topPos + 'px';
    }
}
```

## Key Implementation Notes

### CSS Transform Origin
- All zoom transforms use `transform-origin: center center` to ensure content scales from the center
- This maintains visual consistency when zooming in/out

### Coordinate System Consistency
- Canvas coordinates are always calculated relative to the unzoomed frame size
- Mouse events are converted from screen coordinates to canvas coordinates accounting for zoom level
- All positioning calculations use the actual rendered frame dimensions, not the configured size

### Responsive Behavior
- Frame container can be constrained by CSS `max-width` and `max-height` while preserving aspect ratio
- Content area provides padding that adapts to screen size (40px desktop, 20px mobile)
- Canvas elements are sized to match the actual frame dimensions, not the visual zoomed size

### Background Handling
- Support for solid colors, alpha transparency, and background images
- Alpha mode uses checkerboard pattern behind transparent content
- Canvas clearing respects background mode settings

## Content Behavior Inside Canvas

### Content Centering and Scaling Principles

The canvas content follows specific behavior patterns that ensure consistent appearance across different zoom levels and frame sizes:

#### 1. Content Origin and Centering
```javascript
// All content should be positioned relative to canvas center
const canvasCenter = {
    x: frameSize.width / 2,
    y: frameSize.height / 2
};

// Example: Centering content in p5.js
function setup() {
    createCanvas(frameSize.width, frameSize.height);
}

function draw() {
    // Always translate to canvas center for consistent positioning
    translate(width / 2, height / 2);
    
    // Draw content relative to center (0,0)
    // Content coordinates: (-width/2 to +width/2, -height/2 to +height/2)
}
```

#### 2. Content Scaling Behavior
Content inside the canvas should scale proportionally with the frame size while maintaining aspect ratios:

```javascript
// Calculate scale factors based on reference dimensions
const referenceWidth = 800;  // Base reference width
const referenceHeight = 600; // Base reference height

function calculateContentScale(currentWidth, currentHeight) {
    const scaleX = currentWidth / referenceWidth;
    const scaleY = currentHeight / referenceHeight;
    
    // Use the smaller scale to maintain aspect ratio
    return Math.min(scaleX, scaleY);
}

// Apply scaling in p5.js
function draw() {
    translate(width / 2, height / 2);
    
    const contentScale = calculateContentScale(width, height);
    scale(contentScale);
    
    // Now draw at reference dimensions - content will scale automatically
    drawContent(); // Draw as if canvas is 800x600
}
```

#### 3. Responsive Content Layout
```javascript
// Content should adapt to different aspect ratios
function adaptToAspectRatio(canvasWidth, canvasHeight) {
    const aspectRatio = canvasWidth / canvasHeight;
    
    if (aspectRatio > 1.333) {
        // Wide canvas: content fits to height, centered horizontally
        return {
            contentWidth: canvasHeight * (4/3), // Maintain 4:3 content ratio
            contentHeight: canvasHeight,
            offsetX: (canvasWidth - (canvasHeight * (4/3))) / 2,
            offsetY: 0
        };
    } else if (aspectRatio < 1.333) {
        // Tall canvas: content fits to width, centered vertically
        return {
            contentWidth: canvasWidth,
            contentHeight: canvasWidth * (3/4), // Maintain 4:3 content ratio
            offsetX: 0,
            offsetY: (canvasHeight - (canvasWidth * (3/4))) / 2
        };
    } else {
        // Perfect 4:3 ratio
        return {
            contentWidth: canvasWidth,
            contentHeight: canvasHeight,
            offsetX: 0,
            offsetY: 0
        };
    }
}
```

### Framework-Specific Implementation

#### P5.js Implementation
```javascript
let canvas;
let frameSize = { width: 800, height: 600 };

function setup() {
    // Create canvas with current frame size
    canvas = createCanvas(frameSize.width, frameSize.height);
    
    // Attach to frame container
    const frameContainer = document.querySelector('.frame-container');
    canvas.parent(frameContainer);
    
    // Position canvas absolutely within frame
    canvas.canvas.style.position = 'absolute';
    canvas.canvas.style.top = '0';
    canvas.canvas.style.left = '0';
}

function draw() {
    clear(); // Clear with transparency for alpha backgrounds
    
    // Center coordinate system
    translate(width / 2, height / 2);
    
    // Scale content based on canvas size
    const scale = Math.min(width / 800, height / 600);
    push();
    scale(scale);
    
    // Draw content in reference coordinate system (-400 to +400, -300 to +300)
    drawMyContent();
    
    pop();
}

// Resize function to be called when frame size changes
function resizeP5Canvas(newWidth, newHeight) {
    frameSize.width = newWidth;
    frameSize.height = newHeight;
    resizeCanvas(newWidth, newHeight);
}

// Handle zoom by updating canvas CSS (p5.js canvas resizes automatically with container)
function handleZoom(zoomLevel) {
    // P5.js canvas will scale with CSS transform applied to frame container
    // No additional handling needed - content scales with container
}
```

#### Three.js Content Behavior
```javascript
function setupThreeJSContent() {
    // Camera should be positioned to show content centered
    const frameSize = this.getFrameSize();
    const aspect = frameSize.width / frameSize.height;
    
    // Set camera to maintain consistent field of view
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    
    // Position camera to center content
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Scale content based on canvas dimensions
    const referenceScale = Math.min(frameSize.width / 800, frameSize.height / 600);
    this.scene.scale.setScalar(referenceScale);
}

function updateThreeJSForResize(newWidth, newHeight) {
    // Update camera aspect ratio
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(newWidth, newHeight);
    
    // Rescale content to maintain proportions
    const referenceScale = Math.min(newWidth / 800, newHeight / 600);
    this.scene.scale.setScalar(referenceScale);
}
```

#### Canvas 2D Content Behavior
```javascript
function drawCanvas2DContent() {
    const ctx = this.ctx2D;
    const frameSize = this.getFrameSize();
    
    // Clear and prepare canvas
    ctx.clearRect(0, 0, frameSize.width, frameSize.height);
    
    // Set up coordinate system with center origin
    ctx.save();
    ctx.translate(frameSize.width / 2, frameSize.height / 2);
    
    // Scale content proportionally
    const scale = Math.min(frameSize.width / 800, frameSize.height / 600);
    ctx.scale(scale, scale);
    
    // Draw content in reference coordinate system (-400 to +400, -300 to +300)
    drawMyCanvasContent(ctx);
    
    ctx.restore();
}
```

### Content Positioning Rules

#### Rule 1: Always Use Canvas Center as Origin
```javascript
// ✅ Correct: Position relative to center
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
element.x = centerX + offsetX;
element.y = centerY + offsetY;

// ❌ Wrong: Position relative to top-left
element.x = offsetX;
element.y = offsetY;
```

#### Rule 2: Scale Content, Not Container
```javascript
// ✅ Correct: Scale content within canvas
function draw() {
    translate(width/2, height/2);
    scale(calculateScale());
    drawContent(); // Content drawn at reference size
}

// ❌ Wrong: Change content dimensions directly
function draw() {
    const newSize = canvas.width * 0.8;
    drawContent(newSize); // Breaks proportions
}
```

#### Rule 3: Maintain Reference Coordinate System
```javascript
// Define reference dimensions for consistent scaling
const REFERENCE_WIDTH = 800;
const REFERENCE_HEIGHT = 600;

// Always draw as if canvas is reference size
function drawInReferenceSystem() {
    // Content coordinates from -400 to +400 (x), -300 to +300 (y)
    // Framework handles scaling to actual canvas size
}
```

### Zoom Interaction with Content

When zoom is applied via CSS transform on the frame container:

1. **Canvas Element**: Scales visually but retains original pixel dimensions
2. **Content Rendering**: Remains at original resolution (no pixelation)
3. **Mouse Coordinates**: Must be converted using `getCanvasCoordinates()`
4. **Interactive Elements**: Hit detection must account for zoom level

```javascript
function handleMouseInteraction(event) {
    // Convert screen coordinates to canvas coordinates
    const coords = this.getCanvasCoordinates(event);
    
    // coords are now in unzoomed canvas coordinate system
    // Use these for hit detection and interaction
    checkCollision(coords.x, coords.y);
}
```

### Framework Integration Checklist

For any framework integration, ensure:

- [ ] Canvas is positioned absolutely within frame container
- [ ] Content uses center-based coordinate system
- [ ] Content scales proportionally with frame size
- [ ] Zoom behavior works via CSS transform (no content re-rendering needed)
- [ ] Mouse/touch coordinates are properly converted
- [ ] Aspect ratio is preserved during resizing
- [ ] Content remains centered regardless of frame dimensions
- [ ] Background transparency is supported for alpha mode

This documentation provides all the necessary information to recreate the same canvas sizing, zooming, and content fitting behavior in other applications, with specific guidance for different frameworks including p5.js.