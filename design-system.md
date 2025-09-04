# SV Generative Gallery Design System

A comprehensive design system for the ultra-minimalistic, dark-themed gallery tool inspired by 099.supply aesthetics.

## Design Philosophy

### Core Principles
- **Ultra-Minimalism**: Clean, uncluttered interface with focus on content
- **Dark-First Design**: Optimized for comfortable viewing in low-light conditions
- **Precision Engineering**: Subtle details and micro-interactions
- **Professional Tool Aesthetic**: Studio-grade interface for creative professionals

### Inspiration
- **099.supply aesthetic**: Clean, minimal, dark interfaces
- **Studio tools**: Professional video/audio editing software
- **Apple System Fonts**: Native system integration

---

## Color System

### Design Tokens (CSS Custom Properties)

```css
:root {
    /* Primary Backgrounds */
    --bg-primary: #121212;        /* Main app background */
    --bg-secondary: #181818;      /* Header, frame container */
    --bg-tertiary: #1f1f1f;       /* Unused, reserved for depth */
    
    /* Side Panel Colors */
    --side-panel-bg: #0f0f0f;     /* Darkest panel background */
    --side-panel-text: #e5e5e5;   /* Panel text color */
    --side-panel-border: #2a2a2a; /* Panel border */
    
    /* Text Hierarchy */
    --text-color: #e5e5e5;        /* Primary text */
    --text-color-bright: #fff;     /* Headers, emphasis */
    --text-color-light: #888;      /* Secondary text, hints */
    --text-color-subtle: #555;     /* Disabled, subtle text */
    
    /* Interactive Elements */
    --button-primary: #e5e5e5;     /* Primary button background */
    --button-hover: #fff;          /* Button hover state */
    --button-subtle: #1a1a1a;      /* Input backgrounds */
    --button-subtle-hover: #222;   /* Input hover state */
    --button-subtle-text: #e5e5e5; /* Input text */
    --button-subtle-border: #2a2a2a; /* Input borders */
    
    /* Borders & Structure */
    --border-width: 1px;
    --border-color: #2a2a2a;       /* Primary borders */
    --border-color-subtle: #1f1f1f; /* Subtle dividers */
}
```

### Color Usage Guidelines

#### Background Hierarchy
1. **--bg-primary** (#121212): Main application background, content areas
2. **--bg-secondary** (#181818): Elevated elements like header, frame container
3. **--side-panel-bg** (#0f0f0f): Side panel background (darkest for focus)

#### Text Hierarchy
1. **--text-color-bright** (#fff): Section headers, emphasized text
2. **--text-color** (#e5e5e5): Primary body text, labels
3. **--text-color-light** (#888): Secondary information, value displays
4. **--text-color-subtle** (#555): Disabled states, hints

#### Interactive States
- **Default**: --button-subtle (#1a1a1a) background
- **Hover**: --button-subtle-hover (#222) 
- **Focus**: --border-color (#2a2a2a) → #333 on focus
- **Active**: Darker variations or accent colors

### Accent Colors
```css
/* Accent Colors (Hardcoded) */
--export-primary: #0066cc;      /* Export buttons */
--export-hover: #0052a3;        /* Export button hover */
--toggle-active: #00ff88;       /* Active toggle state */
--toggle-active-hover: #00cc6a; /* Active toggle hover */
--danger: #ff4444;              /* Delete/remove actions */
--danger-hover: #ff6666;        /* Danger hover state */
```

---

## Typography System

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale & Hierarchy

#### Headers
```css
/* Main Header Title */
.header-title {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--text-color-bright);
}

/* Panel Section Headers */
.panel-header h3, .controls-section h4 {
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-color-bright);
}

/* Sub-section Headers */
.controls-section h4 {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}
```

#### Body Text
```css
/* Primary Body Text */
body {
    font-size: 13px;
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: -0.01em;
}

/* Control Labels */
.frame-control-row label, .slider-control-row label {
    font-size: 12px;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
}

/* Small Text & Values */
.frame-control-row span, .slider-control-row span {
    font-size: 11px;
    color: var(--text-color-light);
}
```

#### Interactive Text
```css
/* Button Text */
.control-btn, .modal-btn {
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

/* Input Text */
.size-input, .preset-select, .seed-input {
    font-size: 11px;
}
```

### Typography Guidelines
- **Uppercase**: Reserved for section headers and button labels
- **Letter Spacing**: Increased for uppercase text (0.02em - 0.05em)
- **Font Weight**: Primarily 400 (normal), 500 for emphasis, 600 for monospace elements
- **Line Height**: 1.6 for body text, 1 for compact elements

---

## Layout System

### Grid & Spacing

#### Frame Dimensions
```css
--frame-width: 800px;
--frame-height: 600px;
--side-panel-width: 260px;
```

#### Spacing Patterns
- **Section Spacing**: 32px between control sections
- **Element Spacing**: 16px between section header and content
- **Control Spacing**: 12px between individual controls
- **Micro Spacing**: 8px for internal element gaps
- **Padding Standards**: 
  - Side Panel: 24px 20px
  - Header: 16px 24px
  - Content Area: 40px
  - Modal: 20px 24px

#### Layout Structure
```
Header (fixed height)
├── Main Container (flex horizontal)
    ├── Side Panel (260px fixed width)
    │   ├── Panel Header
    │   ├── Controls Sections (32px spacing)
    │   └── Section Elements (12px spacing)
    └── Content Area (flex: 1)
        └── Frame Container (centered)
```

---

## Component Library

### Buttons

#### Primary Button (.control-btn)
```css
.control-btn {
    background-color: var(--button-primary); /* #e5e5e5 */
    color: var(--bg-primary); /* #121212 - inverted text */
    border: none;
    padding: 8px 16px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    transition: all 0.15s ease;
    width: 100%;
}

.control-btn:hover {
    background-color: var(--button-hover); /* #fff */
}
```

#### Export Button (.export-btn)
```css
.export-btn {
    background-color: #0066cc;
    color: white;
    font-weight: 500;
}

.export-btn:hover {
    background-color: #0052a3;
}

.export-btn:disabled {
    background-color: #666;
    opacity: 0.5;
    cursor: not-allowed;
}
```

#### Seed Buttons (.seed-btn)
```css
.seed-btn {
    width: 24px;
    height: 28px;
    background-color: var(--button-subtle);
    border: 1px solid var(--button-subtle-border);
    font-weight: bold;
}

#seedDecrementBtn { border-radius: 2px 0 0 2px; }
#seedIncrementBtn { border-radius: 0 2px 2px 0; }
```

### Form Controls

#### Text Inputs (.size-input, .seed-input, .modal-input)
```css
.size-input {
    background-color: var(--button-subtle);
    color: var(--button-subtle-text);
    border: 1px solid var(--button-subtle-border);
    padding: 6px 8px;
    border-radius: 2px;
    font-size: 11px;
    width: 70px;
    text-align: center;
    transition: all 0.15s ease;
}

.size-input:focus {
    border-color: #333;
    background-color: var(--button-subtle-hover);
}
```

#### Sliders (.control-slider)
```css
.control-slider {
    height: 4px;
    background: var(--button-subtle);
    border-radius: 2px;
    appearance: none;
}

.control-slider::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    background: var(--button-primary);
    border-radius: 50%;
    transition: all 0.15s ease;
}

.control-slider::-webkit-slider-thumb:hover {
    background: var(--button-hover);
    transform: scale(1.1);
}
```

#### Select Dropdowns (.preset-select)
```css
.preset-select {
    background-color: var(--button-subtle);
    border: 1px solid var(--button-subtle-border);
    padding: 6px 8px;
    border-radius: 2px;
    appearance: none;
    background-image: /* Custom dropdown arrow SVG */;
    background-position: right 8px center;
    background-size: 12px;
    padding-right: 28px;
}
```

#### Color Pickers (.color-picker)
```css
.color-picker {
    width: 60px;
    height: 32px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
}

.color-picker:hover {
    border-color: var(--text-color-light);
}

.color-picker:focus {
    border-color: var(--button-primary);
}
```

### Toggle Switches

#### Toggle Structure
```css
.toggle-switch {
    display: flex;
    align-items: center;
}

.toggle-slider {
    width: 40px;
    height: 20px;
    background-color: var(--button-subtle);
    border: 1px solid var(--button-subtle-border);
    border-radius: 10px;
    position: relative;
}

.toggle-slider::before {
    content: '';
    width: 16px;
    height: 16px;
    background-color: var(--button-primary);
    border-radius: 50%;
    position: absolute;
    top: 1px;
    left: 1px;
    transition: all 0.15s ease;
}

/* Active State */
.toggle-checkbox:checked + .toggle-label .toggle-slider {
    background-color: #00ff88;
    border-color: #00ff88;
}

.toggle-checkbox:checked + .toggle-label .toggle-slider::before {
    transform: translateX(18px);
    background-color: #000000;
}

.toggle-checkbox:checked + .toggle-label .toggle-text {
    color: #00ff88;
}
```

### Upload Components

#### Main Upload Button (.upload-button)
```css
.upload-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
    background-color: var(--button-subtle);
    border: 2px dashed var(--button-subtle-border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.upload-button:hover {
    background-color: var(--button-subtle-hover);
    border-color: #333;
    color: var(--text-color-bright);
}
```

#### Background/Foreground Upload (.bg-upload-button, .fg-upload-button)
```css
.bg-upload-button {
    width: 60px;
    height: 60px;
    background-color: var(--button-subtle);
    border: 2px dashed var(--button-subtle-border);
    border-radius: 4px;
}

/* With Thumbnail State */
.bg-upload-button.has-thumbnail {
    background-size: cover;
    background-position: center;
    border-style: solid;
}
```

### Thumbnail Grid

#### Thumbnail Container
```css
.thumbnails-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
}
```

#### Thumbnail Items
```css
.thumbnail-item {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid var(--button-subtle-border);
    background-color: var(--button-subtle);
    cursor: grab;
    transition: all 0.15s ease;
}

.thumbnail-item:hover {
    border-color: #333;
    transform: scale(1.05);
}

.thumbnail-item.dragging {
    opacity: 0.5;
    transform: rotate(5deg) scale(1.1);
    z-index: 1000;
}
```

#### Remove Buttons
```css
.thumbnail-remove, .bg-thumb-remove, .fg-thumb-remove {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #444444;
    color: #e5e5e5;
    border: 1px solid #666666;
    border-radius: 50%;
    font-size: 12px;
    font-family: monospace;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.15s ease;
}

.thumbnail-item:hover .thumbnail-remove {
    opacity: 1;
}

.thumbnail-remove:hover {
    background-color: #ff4444;
    color: white;
    border-color: #ff6666;
    transform: translate(-50%, -50%) scale(1.1);
}
```

### Modal System

#### Modal Structure
```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    z-index: 1000;
    animation: modalFadeIn 0.2s ease;
}

.modal-content {
    background-color: var(--side-panel-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    width: 420px;
    max-width: 90vw;
    max-height: 90vh;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    animation: modalSlideIn 0.25s ease;
}
```

#### Modal Buttons
```css
.modal-btn-primary {
    background-color: #0066cc;
    color: white;
    font-weight: 500;
    min-width: 100px;
    padding: 10px 20px;
}

.modal-btn-secondary {
    background-color: var(--button-subtle);
    color: var(--text-color);
    border: 1px solid var(--button-subtle-border);
}
```

---

## Interactive Patterns

### Transitions & Animations

#### Standard Transition
```css
transition: all 0.15s ease;
```

#### Hover States
- **Scale Effects**: `transform: scale(1.05)` for thumbnails
- **Color Shifts**: Lighter backgrounds and borders
- **Slider Thumbs**: `transform: scale(1.1)` with color change

#### Drag and Drop
```css
.thumbnail-item.dragging {
    opacity: 0.5;
    transform: rotate(5deg) scale(1.1);
    z-index: 1000;
}

/* Drop Dividers */
@keyframes dividerPulse {
    from { opacity: 0.4; }
    to { opacity: 0.8; }
}
```

#### Modal Animations
```css
@keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes modalSlideIn {
    from { 
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to { 
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

### Micro-Interactions
- **Button Hover**: Immediate color response (0.15s)
- **Focus States**: Border color changes with subtle shadows
- **Toggle Switches**: Smooth thumb translation (0.15s)
- **Remove Buttons**: Fade in on hover, scale up on hover
- **Thumbnail Hover**: Scale + brightness filter combination

---

## Responsive Design

### Breakpoints
```css
@media (max-width: 1200px) {
    .content-area { padding: 20px; }
}

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
        height: auto;
    }
    
    .side-panel {
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid var(--side-panel-border);
    }
    
    .modal-content { width: 350px; }
    .help-modal { width: 320px; }
}
```

### Mobile Adaptations
- **Layout**: Side panel moves to top on mobile
- **Modal Sizing**: Reduced width with maintained padding
- **Touch Targets**: 44px minimum for touch interactions (maintained via padding)

---

## Accessibility Standards

### Color Contrast
- **Text on Dark Backgrounds**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Clear focus indicators with 3:1 contrast
- **Disabled States**: Reduced opacity (0.5) with maintained readability

### Focus Management
```css
/* Focus States */
.size-input:focus, .modal-input:focus, .modal-select:focus {
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
}

.color-picker:focus {
    outline: none;
    border-color: var(--button-primary);
}
```

### Keyboard Navigation
- **Tab Order**: Logical flow through controls
- **Visual Indicators**: Clear focus states for all interactive elements
- **Skip Links**: Not implemented but recommended for complex layouts

---

## Implementation Guidelines

### CSS Custom Properties Usage
```css
/* DO: Use semantic color variables */
background-color: var(--button-subtle);
color: var(--text-color);

/* DON'T: Use hardcoded colors */
background-color: #1a1a1a;
color: #e5e5e5;
```

### Border Radius Standards
- **Input Elements**: 2px border radius
- **Containers**: 4px border radius
- **Circular Elements**: 50% (remove buttons, toggle thumbs)
- **Pills**: 10px (toggle backgrounds)

### Shadow Usage
```css
/* Modal Shadow */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);

/* Focus Shadow */
box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
```

### Z-Index Scale
- **Base Layer**: 1 (default)
- **Hover Elements**: 10
- **Drag Elements**: 1000
- **Modals**: 1000

---

## Brand Elements

### Header Branding
```css
.header-title {
    content: "SV Generative Gallery V1.0";
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.02em;
}

.header-credit {
    content: "MADE BY STUDIO-VIDEO";
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.02em;
    opacity: 1;
}
```

### Visual Identity
- **Dark Professional Aesthetic**: Studio tool appearance
- **Subtle Branding**: Non-intrusive credit placement
- **Monospace Elements**: Used for technical inputs (font-family: monospace)

---

## Usage Guidelines for New Features

### Adding New Components
1. **Use existing color variables** from the design system
2. **Follow spacing patterns** (8px, 12px, 16px, 32px)
3. **Apply consistent transitions** (0.15s ease)
4. **Maintain typography hierarchy** with established font sizes
5. **Test responsive behavior** at 768px and 1200px breakpoints

### Color Extensions
When adding new colors:
1. Add to `:root` with semantic naming
2. Follow the established naming pattern: `--component-state-property`
3. Ensure minimum 4.5:1 contrast ratio for text
4. Test in both light and dark environments

### Component Variations
- **Size Variants**: Use established spacing multiples
- **State Variants**: Follow hover, focus, active, disabled patterns
- **Color Variants**: Extend existing color patterns rather than introducing new palettes

This design system ensures visual consistency and maintainability across the tool and any future extensions or similar tools you create.