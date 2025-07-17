import { SceneManager } from './managers/SceneManager.js';
import { ImageManager } from './managers/ImageManager.js';
import { UIController } from './managers/UIController.js';
import { RingGallery } from './galleries/RingGallery.js';

class GenerativeGallery {
    constructor() {
        // Initialize core managers
        this.frameContainer = document.getElementById('frameContainer');
        this.sceneManager = new SceneManager(this.frameContainer);
        this.imageManager = new ImageManager();
        this.uiController = new UIController();
        
        // Initialize galleries
        this.ringGallery = new RingGallery(this.sceneManager);
        
        // Current state
        this.currentMode = 'ring';
        
        this.initCallbacks();
        this.initApp();
    }
    
    initCallbacks() {
        // Image Manager callbacks
        this.imageManager.setOnImageAdded((imageData) => {
            this.handleImageAdded(imageData);
        });
        
        this.imageManager.setOnImageRemoved((imageId) => {
            this.handleImageRemoved(imageId);
        });
        
        this.imageManager.setOnFirstImageAdded(() => {
            // Remove placeholders when first image is added
            this.getCurrentGallery().removePlaceholder();
        });
        
        this.imageManager.setOnAllImagesRemoved(() => {
            // Show placeholders when all images are removed
            this.getCurrentGallery().showPlaceholder();
        });
        
        // UI Controller callbacks
        this.uiController.on('presetChange', (preset) => {
            this.switchMode(preset);
        });
        
        this.uiController.on('frameSize', (size) => {
            this.handleFrameSize(size);
        });
        
        this.uiController.on('windowResize', () => {
            this.sceneManager.resize();
        });
        
        this.uiController.on('backgroundColorChange', (color) => {
            this.sceneManager.setBackgroundColor(color);
        });
        
        // Ring gallery specific callbacks
        this.uiController.on('radiusChange', (value) => {
            this.ringGallery.setRadius(value);
        });
        
        this.uiController.on('heightChange', (value) => {
            this.ringGallery.setHeight(value);
        });
        
        this.uiController.on('speedChange', (value) => {
            this.ringGallery.setSpeed(value);
        });
        
        this.uiController.on('scaleChange', (value) => {
            this.getCurrentGallery().setScale(value);
        });
        
        this.uiController.on('rotationXChange', (value) => {
            this.ringGallery.setRotationX(value);
        });
        
        this.uiController.on('rotationZChange', (value) => {
            this.ringGallery.setRotationZ(value);
        });
        
        this.uiController.on('resetRotation', () => {
            this.ringGallery.resetRotation();
        });
    }
    
    initApp() {
        // Start with ring mode
        this.switchMode('ring');
        
        // Start the render loop
        this.sceneManager.startRenderLoop(() => {
            this.update();
        });
        
        console.log('Generative Gallery initialized with modular architecture');
    }
    
    update() {
        // Update current gallery mode
        if (this.currentMode === 'ring') {
            this.ringGallery.update();
        }
        // Add other gallery updates here when implemented
    }
    
    switchMode(mode) {
        // Deactivate current mode
        this.getCurrentGallery().deactivate();
        
        // Update current mode
        this.currentMode = mode;
        
        // Activate new mode
        switch (mode) {
            case 'ring':
                this.uiController.showRingControls();
                this.ringGallery.activate();
                this.ringGallery.recreateImages(this.imageManager.getImages());
                break;
                
            case 'follow-spline':
                this.uiController.showSplineControls();
                this.sceneManager.hideRenderer();
                // TODO: Implement SplineGallery
                console.log('Spline mode - TODO: Implement SplineGallery');
                break;
                
            case 'shuffle':
                this.uiController.showShuffleControls();
                // TODO: Implement ShuffleGallery
                console.log('Shuffle mode - TODO: Implement ShuffleGallery');
                break;
                
            default:
                console.warn('Unknown mode:', mode);
                return;
        }
        
        console.log(`Switched to ${mode} mode`);
    }
    
    getCurrentGallery() {
        switch (this.currentMode) {
            case 'ring':
                return this.ringGallery;
            default:
                return this.ringGallery; // fallback
        }
    }
    
    handleImageAdded(imageData) {
        const currentGallery = this.getCurrentGallery();
        if (currentGallery.addImage) {
            currentGallery.addImage(imageData);
        }
    }
    
    handleImageRemoved(imageId) {
        const currentGallery = this.getCurrentGallery();
        if (currentGallery.removeImage) {
            currentGallery.removeImage(imageId);
        }
    }
    
    handleFrameSize(size) {
        // Update CSS custom properties
        document.documentElement.style.setProperty('--frame-width', `${size.width}px`);
        document.documentElement.style.setProperty('--frame-height', `${size.height}px`);
        
        // Update scene manager
        this.sceneManager.resize();
        
        console.log(`Frame size updated to: ${size.width}x${size.height}`);
    }
    
    destroy() {
        this.sceneManager.destroy();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.generativeGallery = new GenerativeGallery();
}); 