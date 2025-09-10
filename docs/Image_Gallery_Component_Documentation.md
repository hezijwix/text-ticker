# Image Gallery Component - Implementation Documentation

## Overview

This document provides comprehensive implementation details for the **Image Gallery Upload and Management Component** from the SV Generative Gallery project. This component handles image uploading, thumbnail management, drag-and-drop reordering, and supports multiple image formats including JPG, PNG, and SVG.

## Core Features

### ✨ Key Capabilities
- **Multi-file image upload** with drag & drop support
- **Interactive thumbnail grid** with hover effects
- **Drag & drop reordering** with visual feedback
- **Individual image removal** with confirmation UI
- **Format support**: JPG, PNG, GIF, SVG, WebP
- **Responsive design** that adapts to container size
- **Dark theme** with professional UI styling
- **State management** for image data and display

---

## 1. HTML Structure

### Core Upload Component
```html
<div class="controls-section">
    <h4>Gallery Images</h4>
    <div class="image-upload-container">
        <!-- Upload Button -->
        <div class="upload-area" id="uploadArea">
            <div class="upload-button" id="uploadButton">
                <span class="upload-icon">+</span>
                <span class="upload-text">Add Image</span>
            </div>
            <input type="file" id="imageInput" accept="image/*" multiple style="display: none;">
        </div>
        
        <!-- Thumbnails Container -->
        <div class="thumbnails-container" id="thumbnailsContainer">
            <!-- Thumbnails will be added here dynamically -->
        </div>
    </div>
</div>
```

### Individual Thumbnail Structure (Generated Dynamically)
```html
<div class="thumbnail-item" data-image-id="unique-id" draggable="true">
    <img class="thumbnail-image" src="data:image/jpeg;base64,..." alt="image-name.jpg">
    <button class="thumbnail-remove" data-image-id="unique-id">×</button>
</div>
```

---

## 2. CSS Styling System

### Component Variables
```css
:root {
    /* Dark Mode Color Palette */
    --border-color: #2a2a2a;
    --text-color: #e5e5e5;
    --text-color-light: #888;
    --text-color-bright: #fff;
    
    /* Button & Control Colors */
    --button-subtle: #1a1a1a;
    --button-subtle-hover: #222;
    --button-subtle-text: #e5e5e5;
    --button-subtle-border: #2a2a2a;
}
```

### Upload Button Styling
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
    color: var(--text-color);
}

.upload-button:hover {
    background-color: var(--button-subtle-hover);
    border-color: #333;
    color: var(--text-color-bright);
}

.upload-icon {
    font-size: 24px;
    font-weight: 300;
    line-height: 1;
    margin-bottom: 4px;
}

.upload-text {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}
```

### Thumbnails Grid System
```css
.thumbnails-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
}

.thumbnail-item {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--button-subtle-border);
    background-color: var(--button-subtle);
    cursor: grab;
    transition: all 0.15s ease;
}

.thumbnail-item:active {
    cursor: grabbing;
}

.thumbnail-item:hover {
    border-color: #333;
    transform: scale(1.05);
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: filter 0.15s ease;
}

.thumbnail-item:hover .thumbnail-image {
    filter: brightness(0.7);
}
```

### Remove Button Styling
```css
.thumbnail-remove {
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
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.15s ease;
    z-index: 10;
    font-family: monospace;
    font-weight: bold;
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

### Drag & Drop Visual Feedback
```css
.thumbnail-item.dragging {
    opacity: 0.5;
    transform: rotate(5deg) scale(1.1);
    z-index: 1000;
}

/* Drop dividers for reordering feedback */
.thumbnails-container.showing-dividers .thumbnail-item:not(.dragging):before {
    content: '';
    position: absolute;
    left: -4px;
    top: 0;
    width: 4px;
    height: 100%;
    background: var(--button-primary);
    border-radius: 2px;
    opacity: 0.6;
    animation: dividerPulse 1s ease-in-out infinite alternate;
}

@keyframes dividerPulse {
    from { opacity: 0.4; }
    to { opacity: 0.8; }
}
```

---

## 3. JavaScript Implementation

### Core Data Structure
```javascript
class ImageGalleryComponent {
    constructor() {
        // DOM Elements
        this.uploadButton = document.getElementById('uploadButton');
        this.imageInput = document.getElementById('imageInput');
        this.thumbnailsContainer = document.getElementById('thumbnailsContainer');
        
        // Data Management
        this.uploadedImages = []; // Array to store uploaded image data
        this.draggedElement = null; // Currently dragged thumbnail element
        
        this.initEventListeners();
    }
}
```

### Image Data Structure
```javascript
const imageData = {
    id: Date.now() + Math.random(), // Unique identifier
    file: file, // Original File object
    dataUrl: e.target.result, // Base64 data URL
    name: file.name, // Original filename
    size: file.size, // File size in bytes
    type: file.type // MIME type (image/jpeg, image/png, etc.)
};
```

### Event Listeners Setup
```javascript
initEventListeners() {
    // Upload button click handler
    this.uploadButton.addEventListener('click', () => {
        this.imageInput.click();
    });
    
    // File input change handler
    this.imageInput.addEventListener('change', (e) => {
        this.handleImageUpload(e);
    });
    
    // Drag and drop support
    this.uploadButton.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.uploadButton.classList.add('drag-over');
    });
    
    this.uploadButton.addEventListener('dragleave', () => {
        this.uploadButton.classList.remove('drag-over');
    });
    
    this.uploadButton.addEventListener('drop', (e) => {
        e.preventDefault();
        this.uploadButton.classList.remove('drag-over');
        this.handleFileDrop(e);
    });
}
```

### Image Upload Handler
```javascript
handleImageUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    dataUrl: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
                
                this.uploadedImages.push(imageData);
                this.createThumbnail(imageData);
                
                // Trigger custom event for external handling
                this.dispatchImageAddedEvent(imageData);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Reset file input
    event.target.value = '';
}
```

### Thumbnail Creation
```javascript
createThumbnail(imageData) {
    // Create thumbnail container
    const thumbnailItem = document.createElement('div');
    thumbnailItem.className = 'thumbnail-item';
    thumbnailItem.dataset.imageId = imageData.id;
    thumbnailItem.draggable = true;
    
    // Create image element
    const img = document.createElement('img');
    img.className = 'thumbnail-image';
    img.src = imageData.dataUrl;
    img.alt = imageData.name;
    img.loading = 'lazy'; // Performance optimization
    
    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'thumbnail-remove';
    removeBtn.dataset.imageId = imageData.id;
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove image';
    
    // Add remove event listener
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeImage(imageData.id);
    });
    
    // Add drag and drop event listeners
    this.addDragAndDropListeners(thumbnailItem);
    
    // Assemble thumbnail
    thumbnailItem.appendChild(img);
    thumbnailItem.appendChild(removeBtn);
    this.thumbnailsContainer.appendChild(thumbnailItem);
}
```

### Image Removal
```javascript
removeImage(imageId) {
    // Remove from data array
    this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
    
    // Remove thumbnail from DOM
    const thumbnail = this.thumbnailsContainer.querySelector(`[data-image-id="${imageId}"]`);
    if (thumbnail) {
        thumbnail.remove();
    }
    
    // Trigger custom event for external handling
    this.dispatchImageRemovedEvent(imageId);
    
    // Handle empty state
    if (this.uploadedImages.length === 0) {
        this.showEmptyState();
    }
}
```

### Drag & Drop Reordering
```javascript
addDragAndDropListeners(thumbnailItem) {
    thumbnailItem.addEventListener('dragstart', (e) => {
        this.draggedElement = thumbnailItem;
        thumbnailItem.classList.add('dragging');
        this.showDropDividers();
        
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', thumbnailItem.outerHTML);
    });
    
    thumbnailItem.addEventListener('dragend', () => {
        thumbnailItem.classList.remove('dragging');
        this.hideDropDividers();
        this.draggedElement = null;
    });
    
    thumbnailItem.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    thumbnailItem.addEventListener('drop', (e) => {
        e.preventDefault();
        
        if (this.draggedElement && this.draggedElement !== thumbnailItem) {
            this.reorderToPosition(thumbnailItem);
        }
    });
}

reorderToPosition(targetThumbnail) {
    if (!this.draggedElement) return;
    
    const draggedId = this.draggedElement.dataset.imageId;
    const targetId = targetThumbnail.dataset.imageId;
    
    const draggedIndex = this.uploadedImages.findIndex(img => img.id == draggedId);
    const targetIndex = this.uploadedImages.findIndex(img => img.id == targetId);
    
    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return;
    
    // Remove the dragged item from the array
    const [draggedImage] = this.uploadedImages.splice(draggedIndex, 1);
    
    // Insert at target position
    this.uploadedImages.splice(targetIndex, 0, draggedImage);
    
    // Update DOM order
    if (draggedIndex < targetIndex) {
        targetThumbnail.parentNode.insertBefore(this.draggedElement, targetThumbnail.nextSibling);
    } else {
        targetThumbnail.parentNode.insertBefore(this.draggedElement, targetThumbnail);
    }
    
    // Trigger reorder event
    this.dispatchImagesReorderedEvent();
}
```

### Visual Feedback Methods
```javascript
showDropDividers() {
    this.thumbnailsContainer.classList.add('showing-dividers');
}

hideDropDividers() {
    this.thumbnailsContainer.classList.remove('showing-dividers');
}

showEmptyState() {
    // Add empty state messaging or placeholder
    if (this.uploadedImages.length === 0) {
        this.thumbnailsContainer.innerHTML = '<div class="empty-state">No images uploaded</div>';
    }
}
```

---

## 4. Event System

### Custom Events for External Integration
```javascript
// Event dispatchers for external handling
dispatchImageAddedEvent(imageData) {
    const event = new CustomEvent('imageAdded', {
        detail: { imageData, totalImages: this.uploadedImages.length }
    });
    this.thumbnailsContainer.dispatchEvent(event);
}

dispatchImageRemovedEvent(imageId) {
    const event = new CustomEvent('imageRemoved', {
        detail: { imageId, totalImages: this.uploadedImages.length }
    });
    this.thumbnailsContainer.dispatchEvent(event);
}

dispatchImagesReorderedEvent() {
    const event = new CustomEvent('imagesReordered', {
        detail: { images: this.uploadedImages }
    });
    this.thumbnailsContainer.dispatchEvent(event);
}
```

### Event Listeners for External Code
```javascript
// How external code can listen to gallery events
const gallery = document.getElementById('thumbnailsContainer');

gallery.addEventListener('imageAdded', (e) => {
    const { imageData, totalImages } = e.detail;
    console.log('Image added:', imageData.name);
    console.log('Total images:', totalImages);
    
    // Handle new image in your application
    updateImageDisplay(imageData);
});

gallery.addEventListener('imageRemoved', (e) => {
    const { imageId, totalImages } = e.detail;
    console.log('Image removed:', imageId);
    
    // Handle image removal in your application
    removeImageFromDisplay(imageId);
});

gallery.addEventListener('imagesReordered', (e) => {
    const { images } = e.detail;
    console.log('Images reordered. New order:', images);
    
    // Handle reordering in your application
    updateImageOrder(images);
});
```

---

## 5. Advanced Features

### File Format Support
```javascript
// Supported image formats
const SUPPORTED_FORMATS = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'image/bmp',
    'image/tiff'
];

// Format validation
isValidImageFormat(file) {
    return SUPPORTED_FORMATS.includes(file.type.toLowerCase());
}
```

### File Size Validation
```javascript
// File size limits (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

validateFileSize(file) {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File "${file.name}" is too large. Maximum size is ${MAX_FILE_SIZE / (1024*1024)}MB`);
    }
    
    const totalSize = this.uploadedImages.reduce((sum, img) => sum + img.size, 0);
    if (totalSize + file.size > MAX_TOTAL_SIZE) {
        throw new Error('Total upload size limit exceeded');
    }
    
    return true;
}
```

### Performance Optimizations
```javascript
// Lazy loading for thumbnails
createOptimizedThumbnail(imageData) {
    const img = document.createElement('img');
    img.className = 'thumbnail-image';
    img.alt = imageData.name;
    img.loading = 'lazy'; // Browser-native lazy loading
    
    // Create smaller thumbnail for performance
    this.createThumbnailDataUrl(imageData.dataUrl, 60, 60).then(thumbnailUrl => {
        img.src = thumbnailUrl;
    });
}

// Create smaller thumbnail data URL
async createThumbnailDataUrl(originalDataUrl, width, height) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = width;
            canvas.height = height;
            
            // Calculate aspect ratio
            const aspectRatio = img.width / img.height;
            let drawWidth = width;
            let drawHeight = height;
            
            if (aspectRatio > 1) {
                drawHeight = width / aspectRatio;
            } else {
                drawWidth = height * aspectRatio;
            }
            
            const x = (width - drawWidth) / 2;
            const y = (height - drawHeight) / 2;
            
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        
        img.src = originalDataUrl;
    });
}
```

---

## 6. UX/UI Behavior Details

### Interaction States

#### Upload Button States
1. **Default State**: Dashed border, subtle background
2. **Hover State**: Solid border, brighter background
3. **Drag Over State**: Highlighted border, visual feedback
4. **Loading State**: Disabled with loading indicator

#### Thumbnail States
1. **Default**: Clean border, normal opacity
2. **Hover**: Enhanced border, slight scale transform, show remove button
3. **Dragging**: Reduced opacity, rotation transform, elevated z-index
4. **Drop Target**: Visual divider indicators

### Visual Feedback System
- **Immediate Response**: All interactions provide instant visual feedback
- **Smooth Transitions**: 0.15s ease transitions for all state changes
- **Progressive Enhancement**: Hover effects enhance usability without being essential
- **Clear Affordances**: Visual cues make interactive elements obvious

### Accessibility Features
```css
/* Focus states for keyboard navigation */
.upload-button:focus,
.thumbnail-remove:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .thumbnail-item {
        border-width: 2px;
    }
    
    .thumbnail-remove {
        background-color: #000;
        color: #fff;
        border: 2px solid #fff;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .thumbnail-item,
    .upload-button,
    .thumbnail-remove {
        transition: none;
    }
}
```

---

## 7. Integration Guide

### Basic Integration
```javascript
// 1. Include the CSS and HTML structure
// 2. Initialize the component
const imageGallery = new ImageGalleryComponent();

// 3. Listen for events
document.getElementById('thumbnailsContainer').addEventListener('imageAdded', (e) => {
    const { imageData } = e.detail;
    // Handle new image in your application
    handleNewImage(imageData);
});
```

### Advanced Integration with SVG Support
```javascript
// Enhanced constructor for SVG support
constructor(options = {}) {
    this.supportedFormats = options.supportedFormats || [
        'image/jpeg', 'image/jpg', 'image/png', 
        'image/gif', 'image/svg+xml', 'image/webp'
    ];
    
    this.maxFileSize = options.maxFileSize || (10 * 1024 * 1024);
    this.enableDragReorder = options.enableDragReorder !== false;
    
    // Override image input accept attribute for SVG support
    this.imageInput.accept = this.supportedFormats.join(',');
}

// SVG-specific handling
handleSvgImage(imageData) {
    // SVG images might need special handling
    if (imageData.type === 'image/svg+xml') {
        // Ensure SVG is safe (no scripts)
        this.sanitizeSvg(imageData.dataUrl).then(sanitizedSvg => {
            imageData.dataUrl = sanitizedSvg;
            this.createThumbnail(imageData);
        });
    } else {
        this.createThumbnail(imageData);
    }
}
```

### Configuration Options
```javascript
const galleryConfig = {
    // Format support
    supportedFormats: ['image/jpeg', 'image/png', 'image/svg+xml'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalFiles: 20,
    
    // UI options
    thumbnailSize: 60, // pixels
    enableDragReorder: true,
    showFileNames: false,
    
    // Grid options
    gridColumns: 'auto-fill',
    gridMinSize: '60px',
    gridGap: '8px',
    
    // Callbacks
    onImageAdded: (imageData) => console.log('Added:', imageData),
    onImageRemoved: (imageId) => console.log('Removed:', imageId),
    onImagesReordered: (images) => console.log('Reordered:', images),
    onError: (error) => console.error('Gallery error:', error)
};

const gallery = new ImageGalleryComponent(galleryConfig);
```

---

## 8. Responsive Design

### Mobile Adaptations
```css
@media (max-width: 768px) {
    .thumbnails-container {
        grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
        gap: 6px;
        max-height: 150px;
    }
    
    .thumbnail-item {
        width: 50px;
        height: 50px;
    }
    
    .upload-button {
        height: 60px;
    }
    
    .upload-icon {
        font-size: 20px;
    }
    
    .upload-text {
        font-size: 10px;
    }
}

@media (max-width: 480px) {
    .thumbnails-container {
        grid-template-columns: repeat(4, 1fr);
        max-height: 120px;
    }
}
```

### Touch Device Enhancements
```javascript
// Touch-friendly drag and drop
addTouchDragSupport(thumbnailItem) {
    let touchStartPos = null;
    let touchElement = null;
    
    thumbnailItem.addEventListener('touchstart', (e) => {
        touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        touchElement = thumbnailItem;
    });
    
    thumbnailItem.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (touchElement && touchStartPos) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartPos.x;
            const deltaY = touch.clientY - touchStartPos.y;
            
            // Start drag if moved enough
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                this.startTouchDrag(thumbnailItem, touch);
            }
        }
    });
    
    thumbnailItem.addEventListener('touchend', () => {
        this.endTouchDrag();
        touchStartPos = null;
        touchElement = null;
    });
}
```

---

## 9. Error Handling

### Comprehensive Error Management
```javascript
class ImageGalleryError extends Error {
    constructor(message, type, details = {}) {
        super(message);
        this.name = 'ImageGalleryError';
        this.type = type;
        this.details = details;
    }
}

// Error types
const ERROR_TYPES = {
    INVALID_FORMAT: 'invalid_format',
    FILE_TOO_LARGE: 'file_too_large',
    UPLOAD_FAILED: 'upload_failed',
    CORRUPTION: 'file_corruption',
    NETWORK_ERROR: 'network_error'
};

// Error handler with user feedback
handleError(error, file = null) {
    console.error('Gallery Error:', error);
    
    let userMessage = '';
    
    switch (error.type) {
        case ERROR_TYPES.INVALID_FORMAT:
            userMessage = `File "${file?.name}" is not a supported image format.`;
            break;
        case ERROR_TYPES.FILE_TOO_LARGE:
            userMessage = `File "${file?.name}" is too large. Maximum size is 10MB.`;
            break;
        case ERROR_TYPES.UPLOAD_FAILED:
            userMessage = `Failed to upload "${file?.name}". Please try again.`;
            break;
        default:
            userMessage = error.message || 'An unexpected error occurred.';
    }
    
    this.showErrorMessage(userMessage);
    
    // Trigger error event for external handling
    if (this.options.onError) {
        this.options.onError(error);
    }
}

// User-friendly error display
showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'gallery-error-message';
    errorDiv.textContent = message;
    
    this.thumbnailsContainer.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}
```

---

## 10. Performance Considerations

### Memory Management
```javascript
// Clean up resources when component is destroyed
destroy() {
    // Remove event listeners
    this.uploadButton.removeEventListener('click', this.handleUploadClick);
    this.imageInput.removeEventListener('change', this.handleImageUpload);
    
    // Clear image data URLs to free memory
    this.uploadedImages.forEach(imageData => {
        if (imageData.dataUrl) {
            URL.revokeObjectURL(imageData.dataUrl);
        }
    });
    
    // Clear arrays
    this.uploadedImages = [];
    this.draggedElement = null;
    
    // Remove DOM elements
    this.thumbnailsContainer.innerHTML = '';
}

// Efficient batch operations
updateMultipleImages(imageDataArray) {
    // Batch DOM updates for better performance
    const fragment = document.createDocumentFragment();
    
    imageDataArray.forEach(imageData => {
        const thumbnailElement = this.createThumbnailElement(imageData);
        fragment.appendChild(thumbnailElement);
    });
    
    // Single DOM update
    this.thumbnailsContainer.appendChild(fragment);
}
```

---

This documentation provides everything needed to implement the image gallery component in any web application, with full support for drag-and-drop, SVG/PNG formats, and professional dark theme styling. The component is modular, accessible, and highly customizable.

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Analyze existing image gallery implementation structure", "status": "completed", "activeForm": "Analyzing existing image gallery implementation structure"}, {"content": "Extract UI/UX patterns and behaviors", "status": "completed", "activeForm": "Extracting UI/UX patterns and behaviors"}, {"content": "Document CSS styling and layout system", "status": "completed", "activeForm": "Documenting CSS styling and layout system"}, {"content": "Create implementation guide with code examples", "status": "completed", "activeForm": "Creating implementation guide with code examples"}, {"content": "Document event handling and state management", "status": "completed", "activeForm": "Documenting event handling and state management"}]