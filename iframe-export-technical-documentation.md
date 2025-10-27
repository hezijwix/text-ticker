# iframe Export Technical Implementation Guide

## Overview

This document describes the technical implementation of the **iframe embed code export feature** for canvas-based animation tools. The feature enables users to export their canvas animations as self-contained HTML documents that can be embedded anywhere via iframe or used as standalone web pages.

## System Architecture

### Core Concept

The iframe export system captures the **complete state** of a canvas animation and generates a **standalone HTML file** containing:
- All animation parameters and settings
- Embedded assets (images as base64 data URLs)
- Self-contained rendering engine (JavaScript)
- Minimal styling for display
- Animation loop with requestAnimationFrame

### Key Advantages

1. **Zero Dependencies**: Exported HTML runs without external files or libraries
2. **Platform Agnostic**: Works on any web platform that supports HTML/Canvas
3. **Instant Sharing**: Copy-paste embed code for quick integration
4. **Preserves Interactivity**: Animations continue to run in real-time
5. **Lightweight**: Efficient code generation with minimal overhead

---

## Implementation Components

### 1. Export Modal Integration

#### HTML Structure
```html
<div class="modal-section">
    <label for="exportFormat" class="modal-label">Format</label>
    <select id="exportFormat" class="modal-select">
        <option value="png">PNG Image</option>
        <option value="mp4">MP4 Video</option>
        <option value="png-sequence">PNG Sequence</option>
        <option value="iframe">iframe Embed Code</option>
    </select>
</div>
```

**Purpose**: Add iframe as an export format option alongside traditional formats (PNG, MP4, etc.)

**UX Consideration**: When iframe is selected, disable duration input (not applicable for live animations)

#### Modal Behavior Logic
```javascript
// Event listener on format selection
exportFormat.addEventListener('change', (e) => {
    if (e.target.value === 'iframe') {
        // Disable duration input - not needed for iframe
        exportDuration.disabled = true;
        exportDuration.style.opacity = '0.5';

        // Update button text for clarity
        startExport.textContent = 'Copy Embed Code';
    } else {
        // Re-enable for video/sequence formats
        exportDuration.disabled = false;
        exportDuration.style.opacity = '1';
        startExport.textContent = 'Start Export';
    }
});
```

---

### 2. State Capture System

The iframe export requires capturing **all parameters** that define the current animation state.

#### Settings Object Structure
```javascript
const settings = {
    // Canvas dimensions
    width: this.width,
    height: this.height,

    // Mode system (if multi-mode tool)
    mode: 'image', // or 'text', 'particle', etc.

    // Asset data
    imageData: this.canvas.toDataURL(), // Base64 encoded image

    // Animation parameters (tool-specific)
    duplicates: 5,
    scaleOffset: 0.1,
    rotationOffset: 15,
    positionXOffset: 10,
    positionYOffset: 10,

    // Animation settings
    animations: {
        scale: { enabled: true, frequency: 1.0, amplitude: 50 },
        rotation: { enabled: false, frequency: 1.0, amplitude: 50 }
    },

    // Visual effects
    dropShadow: {
        enabled: true,
        distance: 10,
        blur: 5,
        opacity: 0.5,
        angle: 45
    },

    // Background
    backgroundColor: '#ffffff',
    isTransparent: false
};
```

#### Implementation Pattern
```javascript
exportIframe() {
    // Gather all current state from animation engine
    const settings = this.captureAnimationState();

    // Generate standalone HTML
    const iframeCode = this.generateIframeCode(settings);

    // Copy to clipboard
    this.copyToClipboard(iframeCode);
}

captureAnimationState() {
    // Collect all parameters from your animation system
    return {
        // Tool-specific implementation
    };
}
```

---

### 3. HTML Generation Engine

#### Template Structure

The generated HTML follows this structure:

```
<!DOCTYPE html>
<html>
├── <head>
│   ├── Meta tags (charset, viewport)
│   ├── External resources (fonts, if needed)
│   ├── Embedded styles
│   └── Title
│
├── <body>
│   ├── Canvas element
│   └── <script>
│       ├── Settings object (serialized JSON)
│       ├── Asset loading logic
│       ├── Helper functions
│       ├── Render function
│       └── Animation loop
│
└── </html>
```

#### Code Generation Method

```javascript
generateIframeCode(settings) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animation Export</title>

    <!-- External resources (fonts, etc.) -->
    ${this.generateExternalResources(settings)}

    <!-- Minimal embedded styles -->
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
        }
        canvas {
            display: block;
            max-width: 100%;
            max-height: 100vh;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        ${this.generateAnimationScript(settings)}
    </script>
</body>
</html>`;
}
```

---

### 4. Animation Script Generation

The core rendering logic must be **recreated in vanilla JavaScript** within the iframe.

#### Script Components

**A. Settings Serialization**
```javascript
const settings = ${JSON.stringify(settings, null, 8)};
```

**B. Canvas Setup**
```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = settings.width;
canvas.height = settings.height;
```

**C. Asset Loading**
```javascript
let sourceImage = null;
if (settings.imageData) {
    sourceImage = new Image();
    sourceImage.src = settings.imageData; // Base64 data URL
}
```

**D. Helper Functions**
```javascript
// Recreate any utility functions needed
function interpolateColor(color1, color2, t) {
    // Color interpolation logic
}

function applyTransformations(ctx, params) {
    // Transformation logic
}
```

**E. Render Function**
```javascript
function render(time) {
    // Clear canvas
    if (settings.isTransparent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render animation based on settings
    // This is tool-specific - recreate your render logic
    for (let i = 0; i < settings.duplicates; i++) {
        ctx.save();

        // Apply transformations
        // Apply animations
        // Draw content

        ctx.restore();
    }
}
```

**F. Animation Loop**
```javascript
function animate() {
    const time = Date.now() * 0.001; // Convert to seconds
    render(time);
    requestAnimationFrame(animate);
}

// Handle asset loading
if (sourceImage) {
    sourceImage.onload = animate;
} else {
    animate();
}
```

---

### 5. Clipboard Integration

#### Modern Clipboard API
```javascript
copyToClipboard(code) {
    navigator.clipboard.writeText(code)
        .then(() => {
            alert('iframe code copied to clipboard! Paste it into your webpage.');
        })
        .catch(err => {
            // Fallback for older browsers
            this.fallbackCopyMethod(code);
        });
}

fallbackCopyMethod(code) {
    // Use prompt as fallback
    prompt('Copy this iframe code:', code);
}
```

---

## Adapting to Different Animation Tools

### Tool-Specific Considerations

#### Particle Systems
```javascript
const settings = {
    particleCount: 100,
    particleColor: '#ffffff',
    gravity: 0.5,
    wind: 0.1,
    // ... particle-specific parameters
};

// Render function would implement particle physics
function render(time) {
    updateParticles(time);
    drawParticles();
}
```

#### Generative Art Tools
```javascript
const settings = {
    seed: 12345,
    complexity: 0.8,
    colorPalette: ['#ff0000', '#00ff00', '#0000ff'],
    algorithm: 'perlin-noise',
    // ... generative parameters
};

// Render might use noise functions
function render(time) {
    generatePattern(settings.seed, time);
}
```

#### Audio Visualizers
```javascript
const settings = {
    audioData: null, // Cannot export live audio
    visualizationType: 'waveform',
    sensitivity: 0.8,
    // ... visualizer parameters

    // Important: Note for users
    note: 'This is a static preview. Live audio not supported in iframe export.'
};
```

---

## Key Implementation Patterns

### Pattern 1: Settings Extraction

**Principle**: Create a single source of truth for all animation parameters.

```javascript
class AnimationEngine {
    captureState() {
        return {
            // Extract from class properties
            canvas: {
                width: this.width,
                height: this.height
            },
            animation: {
                ...this.animationParams
            },
            visual: {
                ...this.visualEffects
            }
        };
    }
}
```

### Pattern 2: Render Logic Duplication

**Principle**: Your iframe script must **recreate** your main render logic in vanilla JS.

```javascript
// Original render method (in your class)
render(ctx, width, height, time) {
    for (let i = 0; i < this.count; i++) {
        this.drawElement(ctx, i, time);
    }
}

// Generated iframe version (as string template)
function render(time) {
    for (let i = 0; i < settings.count; i++) {
        drawElement(ctx, i, time);
    }
}

function drawElement(ctx, index, time) {
    // Recreated drawing logic
}
```

### Pattern 3: Asset Embedding

**Principle**: Convert assets to base64 data URLs for self-contained exports.

```javascript
embedAssets() {
    const assets = {};

    // Convert canvas to data URL
    if (this.sourceImage) {
        assets.image = this.canvas.toDataURL('image/png');
    }

    // Embed background if needed
    if (this.backgroundImage) {
        const tempCanvas = document.createElement('canvas');
        // ... render background to temp canvas
        assets.background = tempCanvas.toDataURL('image/png');
    }

    return assets;
}
```

### Pattern 4: External Resource Loading

**Principle**: Include CDN links for resources that can't be embedded.

```javascript
generateExternalResources(settings) {
    let resources = '';

    // Fonts
    if (settings.customFonts) {
        resources += `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=${settings.fontFamily}" rel="stylesheet">`;
    }

    return resources;
}
```

---

## Complete Implementation Checklist

### Phase 1: UI Integration
- [ ] Add iframe option to export format selector
- [ ] Update modal behavior (disable duration for iframe)
- [ ] Change button text based on format selection
- [ ] Add user feedback (copy confirmation)

### Phase 2: State Management
- [ ] Create settings capture method
- [ ] Identify all animatable parameters
- [ ] Include canvas dimensions
- [ ] Capture background/transparency state
- [ ] Convert images to base64 data URLs

### Phase 3: Code Generation
- [ ] Create HTML template generator
- [ ] Embed minimal CSS styles
- [ ] Serialize settings to JSON
- [ ] Include external resource links (fonts, etc.)

### Phase 4: Animation Logic
- [ ] Recreate render function in vanilla JS
- [ ] Implement animation loop with requestAnimationFrame
- [ ] Add asset loading logic (for images)
- [ ] Include helper functions (color interpolation, etc.)

### Phase 5: Clipboard & UX
- [ ] Implement clipboard API integration
- [ ] Add fallback for older browsers
- [ ] Provide user feedback (alert/notification)
- [ ] Test across different browsers

---

## Example: Adapting to a Wave Generator Tool

### Hypothetical Tool: "WaveGen"

**Tool Purpose**: Creates animated sine wave patterns with customizable parameters.

#### Settings Object
```javascript
const settings = {
    width: 1920,
    height: 1080,
    waveCount: 5,
    frequency: 2.0,
    amplitude: 100,
    phaseOffset: 0.5,
    waveColor: '#00ffff',
    backgroundColor: '#000000',
    lineWidth: 3,
    animationSpeed: 1.0
};
```

#### Render Function for iframe
```javascript
function render(time) {
    // Clear canvas
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waves
    ctx.strokeStyle = settings.waveColor;
    ctx.lineWidth = settings.lineWidth;

    for (let w = 0; w < settings.waveCount; w++) {
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {
            const phase = (x / canvas.width) * Math.PI * 2 * settings.frequency;
            const timePhase = time * settings.animationSpeed + w * settings.phaseOffset;
            const y = canvas.height / 2 + Math.sin(phase + timePhase) * settings.amplitude;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.stroke();
    }
}
```

---

## Advanced Considerations

### Performance Optimization

**Problem**: Large settings objects increase HTML file size.

**Solution**: Minimize JSON output and use shorter property names.

```javascript
// Before
const settings = {
    numberOfDuplicates: 50,
    scaleOffsetValue: 0.1
};

// After (abbreviated)
const s = {
    dup: 50,
    scl: 0.1
};
```

### Security Considerations

**Problem**: User-generated content in settings could contain XSS vulnerabilities.

**Solution**: Sanitize text inputs before embedding.

```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// When generating template
textContent: '${escapeHtml(settings.textContent)}'
```

### Browser Compatibility

**Problem**: Some Canvas features not universally supported.

**Solution**: Include feature detection and fallbacks.

```javascript
// In generated script
if (!ctx.ellipse) {
    ctx.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle) {
        // Polyfill implementation
    };
}
```

---

## Testing Strategy

### Manual Testing
1. Export iframe from various parameter configurations
2. Test in major browsers (Chrome, Firefox, Safari, Edge)
3. Verify animations run smoothly
4. Check transparency handling
5. Test embedded in actual webpage via iframe tag

### Automated Testing
```javascript
describe('iframe Export', () => {
    it('generates valid HTML', () => {
        const code = exporter.generateIframeCode(mockSettings);
        expect(code).toContain('<!DOCTYPE html>');
    });

    it('includes all settings', () => {
        const code = exporter.generateIframeCode(mockSettings);
        expect(code).toContain(JSON.stringify(mockSettings));
    });
});
```

---

## Usage in End-User Workflow

### User Perspective

1. **Configure Animation**: User adjusts parameters in the tool
2. **Click Export**: Opens export modal
3. **Select iframe Format**: Chooses "iframe Embed Code" option
4. **Copy Code**: Clicks export button → code copied to clipboard
5. **Embed**: Pastes into their website, CMS, or documentation

### Example Embed
```html
<!-- User's webpage -->
<div class="animation-container">
    <iframe
        srcdoc="<!DOCTYPE html>...generated code..."
        width="800"
        height="600"
        style="border: none;"
    ></iframe>
</div>
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Forgetting to Serialize Complex Objects

**Problem**: JSON.stringify fails on circular references or functions.

**Solution**: Filter settings to only serializable data.

```javascript
function sanitizeSettings(settings) {
    return {
        ...settings,
        // Exclude non-serializable properties
        sourceImage: undefined,
        contextReference: undefined
    };
}
```

### Pitfall 2: Canvas Context State Leakage

**Problem**: Transform states not properly saved/restored.

**Solution**: Always use `ctx.save()` and `ctx.restore()` pairs.

```javascript
for (let i = 0; i < count; i++) {
    ctx.save(); // Save state
    // Apply transformations
    // Draw
    ctx.restore(); // Restore state
}
```

### Pitfall 3: Time-Based Animation Drift

**Problem**: Animations not synchronized across different framerates.

**Solution**: Use time-based animation, not frame-based.

```javascript
// Bad: Frame-based
frame++;
rotation = frame * 0.01;

// Good: Time-based
const time = Date.now() * 0.001;
rotation = time * Math.PI * 2; // Complete rotation per second
```

---

## Conclusion

The iframe export feature provides a powerful way to **share canvas animations** as self-contained web content. Key success factors:

1. **Complete State Capture**: All parameters needed to recreate the animation
2. **Vanilla JS Implementation**: Recreate render logic without dependencies
3. **Asset Embedding**: Convert images to base64 for portability
4. **Clean User Experience**: Simple copy-paste workflow

This implementation pattern is **highly adaptable** to different animation tools—from particle systems to generative art to data visualizations. The core principles remain the same: capture state, generate HTML, embed assets, recreate render logic.
