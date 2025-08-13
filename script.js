// Project Template Script - Minimal functionality for frame sizing

class ProjectTemplate {
    constructor() {
        this.frameContainer = document.getElementById('frameContainer');
        this.widthInput = document.getElementById('frameWidth');
        this.heightInput = document.getElementById('frameHeight');
        this.applySizeBtn = document.getElementById('applySizeBtn');
        
        // Image upload controls
        this.uploadButton = document.getElementById('uploadButton');
        this.imageInput = document.getElementById('imageInput');
        this.thumbnailsContainer = document.getElementById('thumbnailsContainer');
        
        // Preset control
        this.presetSelect = document.getElementById('presetSelect');
        
        // Spline controls
        this.splineSpeedSlider = document.getElementById('splineSpeedSlider');
        this.splineSpeedValue = document.getElementById('splineSpeedValue');
        this.splineScaleSlider = document.getElementById('splineScaleSlider');
        this.splineScaleValue = document.getElementById('splineScaleValue');
        this.splineDensitySlider = document.getElementById('splineDensitySlider');
        this.splineDensityValue = document.getElementById('splineDensityValue');
        
        // Cursor trail controls
        this.trailSpeedSlider = document.getElementById('trailSpeedSlider');
        this.trailSpeedValue = document.getElementById('trailSpeedValue');
        this.trailScaleSlider = document.getElementById('trailScaleSlider');
        this.trailScaleValue = document.getElementById('trailScaleValue');
        
        // Shuffle controls
        this.shuffleSpeedSlider = document.getElementById('shuffleSpeedSlider');
        this.shuffleSpeedValue = document.getElementById('shuffleSpeedValue');
        this.shuffleIntervalSlider = document.getElementById('shuffleIntervalSlider');
        this.shuffleIntervalValue = document.getElementById('shuffleIntervalValue');
        this.scatterPositionSlider = document.getElementById('scatterPositionSlider');
        this.scatterPositionValue = document.getElementById('scatterPositionValue');
        this.shuffleScaleSlider = document.getElementById('shuffleScaleSlider');
        this.shuffleScaleValue = document.getElementById('shuffleScaleValue');
        this.scatterScaleSlider = document.getElementById('scatterScaleSlider');
        this.scatterScaleValue = document.getElementById('scatterScaleValue');
        this.seedInput = document.getElementById('seedInput');
        this.seedIncrementBtn = document.getElementById('seedIncrementBtn');
        this.seedDecrementBtn = document.getElementById('seedDecrementBtn');
        this.animateToggle = document.getElementById('animateCheckbox');
        this.animateToggleText = document.querySelector('#animateToggle .toggle-text');
        
        // Slider controls
        this.radiusSlider = document.getElementById('radiusSlider');
        this.radiusValue = document.getElementById('radiusValue');
        this.heightSlider = document.getElementById('heightSlider');
        this.heightValue = document.getElementById('heightValue');
        this.scaleSlider = document.getElementById('scaleSlider');
        this.scaleValue = document.getElementById('scaleValue');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.rotationXSlider = document.getElementById('rotationXSlider');
        this.rotationXValue = document.getElementById('rotationXValue');
        this.rotationZSlider = document.getElementById('rotationZSlider');
        this.rotationZValue = document.getElementById('rotationZValue');
        this.resetRotationBtn = document.getElementById('resetRotationBtn');
        
        // Background controls
        this.backgroundColorPicker = document.getElementById('backgroundColorPicker');
        this.alphaBackgroundCheckbox = document.getElementById('alphaBackgroundCheckbox');
        this.alphaBackgroundToggleText = document.querySelector('#alphaBackgroundToggle .toggle-text');
        this.isAlphaBackground = false;
        // Background image controls
        this.bgUploadButton = document.getElementById('bgUploadButton');
        this.bgImageInput = document.getElementById('bgImageInput');
        this.backgroundImageDataUrl = null;
        this.backgroundImageElement = null;
        
        // Foreground image controls
        this.fgUploadButton = document.getElementById('fgUploadButton');
        this.fgImageInput = document.getElementById('fgImageInput');
        this.foregroundImageDataUrl = null;
        this.foregroundImageElement = null;
        
        // Zoom controls
        this.zoomSlider = document.getElementById('zoomSlider');
        this.zoomValue = document.getElementById('zoomValue');
        this.resetZoomBtn = document.getElementById('resetZoomBtn');
        
        // Export button
        this.exportBtn = document.getElementById('exportBtn');
        
        // Export modal elements
        this.exportModal = document.getElementById('exportModal');
        this.closeExportModal = document.getElementById('closeExportModal');
        this.cancelExport = document.getElementById('cancelExport');
        this.startExport = document.getElementById('startExport');
        this.exportDuration = document.getElementById('exportDuration');
        this.exportFormat = document.getElementById('exportFormat');
        this.currentModeDisplay = document.getElementById('currentModeDisplay');
        
        // Help modal elements
        this.helpIcon = document.getElementById('helpIcon');
        this.helpModal = document.getElementById('helpModal');
        this.closeHelpModal = document.getElementById('closeHelpModal');
        this.closeHelpBtn = document.getElementById('closeHelpBtn');
        
        // FFmpeg instance for video conversion
        this.ffmpeg = null;
        this.ffmpegLoaded = false;
        
        // Three.js properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.rotationGroup = null; // Parent group for manual rotation controls
        this.pathGroup = null; // Child group for internal animation
        this.circularPath = null;
        this.pathMarkers = [];
        this.centerSphere = null;
        this.animationId = null;
        this.currentRadius = 3;
        this.currentHeight = 0; // Y offset for the circular path
        this.worldRotation = { x: 0, y: 0, z: 0 }; // Local space rotation values
        
        // 2D Canvas properties for spline mode
        this.canvas2D = null;
        this.ctx2D = null;
        this.isDrawing = false;
        this.splinePoints = [];
        this.currentSpline = [];
        this.splineCumulativeDistances = null; // For distance-based interpolation
        
        // 2D Image properties for spline mode
        this.imageElements2D = []; // Array to store 2D image elements
        this.splineAnimationDistance = 0; // Track absolute distance traveled
        this.splineAnimationSpeed = 0.5; // Speed in pixels per frame (absolute speed)
        this.splineAnimationId = null; // Track animation frame to prevent multiple loops
        this.splineImageScale = 1.0; // Scale for images in spline mode
        this.splineImageDensity = 1; // Density control (1=few duplicates, 10=lots of duplicates)
        this.isRecreatingImages = false; // Prevent multiple simultaneous recreations
        
        // Cursor trail properties
        this.cursorPosition = { x: 0, y: 0 }; // Current cursor position
        this.trailLength = 10; // Number of images in the trail
        this.trailAnimationSpeed = 0.5; // Speed of following animation (0.1 = slow, 2.0 = fast)
        this.trailImageScale = 1.0; // Scale for images in trail mode
        this.trailImages = []; // Array to store trail image elements with target positions
        this.trailAnimationId = null; // Track animation frame
        this.isTrackingCursor = false; // Whether cursor tracking is active
        this.mouseInCanvas = false; // Whether mouse is in canvas
        
        // Gallery properties
        this.uploadedImages = []; // Array to store uploaded image data
        this.imagePlanes = []; // Array to store Three.js image planes
        this.animationTime = 0; // For animating images along the path
        this.currentScale = 1.5; // Default scale for images
        this.currentSpeed = 0.5; // Default rotation speed (degrees per frame)
        this.currentPreset = 'ring'; // Current gallery preset
        this.currentBackgroundColor = '#181818'; // Current background color
        
        // Zoom properties
        this.currentZoom = 1.0; // Current zoom level (1.0 = 100%)
        this.isZoomed = false; // Whether preview is zoomed
        
        // Export properties
        this.preferredExportFormat = 'auto'; // Default export format preference
        
        // Placeholder frames
        this.placeholderPlane = null; // 3D placeholder for ring mode
        this.hasPlaceholder = true; // Track if placeholder should be shown
        
        // Shuffle properties
        this.shuffleImages = []; // Array to store 2D shuffle image elements
        this.shuffleAnimationSpeed = 0.8; // Speed of shuffle animations
        this.shuffleInterval = 3.0; // Time between automatic shuffles (seconds)
        this.shuffleTimeout = null; // Timeout for automatic shuffling
        this.isShuffling = false; // Prevent multiple simultaneous shuffles
        this.animationEnabled = false; // Controls whether animations are enabled
        this.scatterPosition = 1.0; // Controls spread of positions (0.1 = tight, 1.0 = full canvas)
        this.shuffleScale = 1.0; // Controls overall base scale of all images
        this.scatterScale = 1.0; // Controls variation in image sizes (0.1 = uniform, 1.0 = max variation)
        this.seed = 0; // Random seed for reproducible shuffling
        this.randomSeed = 0; // Current seed state for seeded random generator
        
        // Drag and drop properties
        this.draggedElement = null; // Currently dragged thumbnail element
        
        this.initEventListeners();
        this.initThreeJS();
        this.initFFmpeg();
    }

    // Background image helpers
    handleBackgroundImageUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            event.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            this.backgroundImageDataUrl = e.target.result;
            this.applyBackgroundImageStyles();
            this.renderBackgroundThumbnail();
            this.updateRendererClearAlphaForBackground();
            // Update Three.js scene background to be transparent so CSS background image shows
            if (this.scene) {
                this.scene.background = null;
            }
        };
        reader.readAsDataURL(file);
        // reset input
        event.target.value = '';
    }

    applyBackgroundImageStyles() {
        if (!this.frameContainer || !this.backgroundImageDataUrl) return;
        this.frameContainer.classList.remove('alpha-bg');
        // Show image as cover
        this.frameContainer.style.backgroundImage = `url('${this.backgroundImageDataUrl}')`;
        this.frameContainer.style.backgroundSize = 'cover';
        this.frameContainer.style.backgroundRepeat = 'no-repeat';
        this.frameContainer.style.backgroundPosition = 'center center';
        // Remove background color override
        this.frameContainer.style.removeProperty('background-color');
    }

    clearBackgroundImage() {
        this.backgroundImageDataUrl = null;
        this.backgroundImageElement = null;
        // Clear styles
        if (this.frameContainer) {
            this.frameContainer.style.removeProperty('background-image');
            this.frameContainer.style.removeProperty('background-size');
            this.frameContainer.style.removeProperty('background-repeat');
            this.frameContainer.style.removeProperty('background-position');
            if (this.isAlphaBackground) {
                this.frameContainer.classList.add('alpha-bg');
                this.frameContainer.style.removeProperty('background-color');
            } else {
                this.frameContainer.classList.remove('alpha-bg');
                const color = this.currentBackgroundColor || '#121212';
                this.frameContainer.style.backgroundColor = color;
                this.frameContainer.style.setProperty('background-color', color, 'important');
            }
        }
        // Update renderer and scene background
        this.updateRendererClearAlphaForBackground();
        if (this.scene) {
            if (this.isAlphaBackground) {
                this.scene.background = null;
            } else {
                this.scene.background = new THREE.Color(this.currentBackgroundColor || '#121212');
            }
        }
        // Clear thumbnail
        this.renderBackgroundThumbnail();
        // Redraw canvases if needed
        if (this.canvas2D && this.currentPreset === 'follow-spline') {
            this.clearCanvas();
            this.drawSpline();
        }
    }

    renderBackgroundThumbnail() {
        if (!this.bgUploadButton) return;
        
        if (!this.backgroundImageDataUrl) {
            // Reset to upload state
            this.bgUploadButton.classList.remove('has-thumbnail');
            this.bgUploadButton.style.removeProperty('background-image');
            // Remove any existing remove button
            const existingRemoveBtn = this.bgUploadButton.querySelector('.bg-thumb-remove');
            if (existingRemoveBtn) {
                existingRemoveBtn.remove();
            }
            return;
        }

        // Show thumbnail in button
        this.bgUploadButton.classList.add('has-thumbnail');
        this.bgUploadButton.style.backgroundImage = `url('${this.backgroundImageDataUrl}')`;
        
        // Add remove button if not already present
        let removeBtn = this.bgUploadButton.querySelector('.bg-thumb-remove');
        if (!removeBtn) {
            removeBtn = document.createElement('button');
            removeBtn.className = 'bg-thumb-remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearBackgroundImage();
            });
            this.bgUploadButton.appendChild(removeBtn);
        }
    }

    // Foreground image helpers
    handleForegroundImageUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            event.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            this.foregroundImageDataUrl = e.target.result;
            this.applyForegroundImageStyles();
            this.renderForegroundThumbnail();
        };
        reader.readAsDataURL(file);
        // reset input
        event.target.value = '';
    }

    applyForegroundImageStyles() {
        if (!this.frameContainer || !this.foregroundImageDataUrl) return;
        
        // Remove existing foreground overlay if any
        const existingOverlay = this.frameContainer.querySelector('.foreground-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create foreground overlay element
        const overlay = document.createElement('div');
        overlay.className = 'foreground-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundImage = `url('${this.foregroundImageDataUrl}')`;
        overlay.style.backgroundSize = 'cover';
        overlay.style.backgroundRepeat = 'no-repeat';
        overlay.style.backgroundPosition = 'center center';
        overlay.style.pointerEvents = 'none'; // Allow clicks to pass through
        overlay.style.zIndex = '1000'; // High z-index to be on top of everything
        
        this.frameContainer.appendChild(overlay);
    }

    clearForegroundImage() {
        this.foregroundImageDataUrl = null;
        this.foregroundImageElement = null;
        
        // Remove overlay element
        if (this.frameContainer) {
            const existingOverlay = this.frameContainer.querySelector('.foreground-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
        }
        
        // Clear thumbnail
        this.renderForegroundThumbnail();
    }

    renderForegroundThumbnail() {
        if (!this.fgUploadButton) return;
        
        if (!this.foregroundImageDataUrl) {
            // Reset to upload state
            this.fgUploadButton.classList.remove('has-thumbnail');
            this.fgUploadButton.style.removeProperty('background-image');
            // Remove any existing remove button
            const existingRemoveBtn = this.fgUploadButton.querySelector('.fg-thumb-remove');
            if (existingRemoveBtn) {
                existingRemoveBtn.remove();
            }
            return;
        }

        // Show thumbnail in button
        this.fgUploadButton.classList.add('has-thumbnail');
        this.fgUploadButton.style.backgroundImage = `url('${this.foregroundImageDataUrl}')`;
        
        // Add remove button if not already present
        let removeBtn = this.fgUploadButton.querySelector('.fg-thumb-remove');
        if (!removeBtn) {
            removeBtn = document.createElement('button');
            removeBtn.className = 'fg-thumb-remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearForegroundImage();
            });
            this.fgUploadButton.appendChild(removeBtn);
        }
    }
    
    initEventListeners() {
        // Apply size button
        this.applySizeBtn.addEventListener('click', () => {
            this.applyFrameSize();
        });
        
        // Enter key in inputs
        this.widthInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyFrameSize();
            }
        });
        
        this.heightInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyFrameSize();
            }
        });
        
        // Input validation - only allow numbers
        [this.widthInput, this.heightInput].forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        });
        
        // Image upload event listeners
        this.uploadButton.addEventListener('click', () => {
            this.imageInput.click();
        });
        
        this.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
        
        // Preset selector
        this.presetSelect.addEventListener('change', (e) => {
            this.handlePresetChange(e.target.value);
        });
        
        // Spline speed slider
        this.splineSpeedSlider.addEventListener('input', (e) => {
            this.splineAnimationSpeed = parseFloat(e.target.value);
            this.splineSpeedValue.textContent = this.splineAnimationSpeed.toString();
        });
        
        // Spline scale slider
        this.splineScaleSlider.addEventListener('input', (e) => {
            this.splineImageScale = parseFloat(e.target.value);
            this.splineScaleValue.textContent = this.splineImageScale.toFixed(1);
            this.updateSplineImageScales();
        });
        
        // Spline density slider
        this.splineDensitySlider.addEventListener('change', (e) => {
            this.splineImageDensity = parseInt(e.target.value);
            this.splineDensityValue.textContent = this.splineImageDensity.toString();
            // Recreate images with new density
            if (this.splinePoints.length > 0) {
                this.createImagesAlongSpline();
            }
        });
        
        // Also update the display value while dragging (but don't recreate images)
        this.splineDensitySlider.addEventListener('input', (e) => {
            this.splineDensityValue.textContent = e.target.value;
        });
        
        // Cursor trail controls
        this.trailSpeedSlider.addEventListener('input', (e) => {
            this.trailAnimationSpeed = parseFloat(e.target.value);
            this.trailSpeedValue.textContent = this.trailAnimationSpeed.toFixed(1);
        });
        
        this.trailScaleSlider.addEventListener('input', (e) => {
            this.trailImageScale = parseFloat(e.target.value);
            this.trailScaleValue.textContent = this.trailImageScale.toFixed(1);
            this.updateTrailImageScales();
        });
        
        // Shuffle controls
        this.shuffleSpeedSlider.addEventListener('input', (e) => {
            this.shuffleAnimationSpeed = parseFloat(e.target.value);
            this.shuffleSpeedValue.textContent = this.shuffleAnimationSpeed.toFixed(1);
            // Update transition duration for all shuffle images with moderate exponential easing
            this.shuffleImages.forEach(img => {
                const duration = 2.1 - this.shuffleAnimationSpeed; // Invert speed: higher slider = faster animation
                img.style.transition = `left ${duration}s cubic-bezier(0.87, 0, 0.13, 1), top ${duration}s cubic-bezier(0.87, 0, 0.13, 1)`;
            });
        });
        
        this.shuffleIntervalSlider.addEventListener('input', (e) => {
            this.shuffleInterval = parseFloat(e.target.value);
            this.shuffleIntervalValue.textContent = this.shuffleInterval.toFixed(1) + 's';
            // Restart timer with new interval if animation is enabled
            if (this.animationEnabled) {
                this.resetShuffleTimer();
            }
        });
        
        this.scatterPositionSlider.addEventListener('input', (e) => {
            this.scatterPosition = parseFloat(e.target.value);
            this.scatterPositionValue.textContent = this.scatterPosition.toFixed(1);
            // Update positions when scatter position slider changes
            if (this.currentPreset === 'shuffle' && this.shuffleImages.length > 0) {
                this.repositionShuffleImages();
            }
        });
        
        this.shuffleScaleSlider.addEventListener('input', (e) => {
            this.shuffleScale = parseFloat(e.target.value);
            this.shuffleScaleValue.textContent = this.shuffleScale.toFixed(1);
            // Update shuffle when slider changes
            if (this.currentPreset === 'shuffle' && this.shuffleImages.length > 0) {
                this.performShuffle();
            }
        });
        
        this.scatterScaleSlider.addEventListener('input', (e) => {
            this.scatterScale = parseFloat(e.target.value);
            this.scatterScaleValue.textContent = this.scatterScale.toFixed(1);
            // Update shuffle when slider changes
            if (this.currentPreset === 'shuffle' && this.shuffleImages.length > 0) {
                this.performShuffle();
            }
        });
        
        // Seed input
        this.seedInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
            if (value === '') value = '0';
            const numValue = parseInt(value);
            if (numValue > 9999) {
                value = '9999';
            }
            e.target.value = value;
            this.seed = parseInt(value);
            // Update shuffle when seed changes
            if (this.currentPreset === 'shuffle' && this.shuffleImages.length > 0) {
                this.performShuffle();
            }
        });
        
        // Seed increment button
        this.seedIncrementBtn.addEventListener('click', () => {
            let currentValue = parseInt(this.seedInput.value) || 0;
            if (currentValue < 9999) {
                currentValue++;
                this.seedInput.value = currentValue.toString();
                this.seed = currentValue;
                // Update shuffle when seed changes
                if (this.currentPreset === 'shuffle' && this.shuffleImages.length > 0) {
                    this.performShuffle();
                }
            }
        });
        
        // Seed decrement button
        this.seedDecrementBtn.addEventListener('click', () => {
            let currentValue = parseInt(this.seedInput.value) || 0;
            if (currentValue > 0) {
                currentValue--;
                this.seedInput.value = currentValue.toString();
                this.seed = currentValue;
                // Update shuffle when seed changes
                if (this.currentPreset === 'shuffle' && this.shuffleImages.length > 0) {
                    this.performShuffle();
                }
            }
        });
        
        // Animate toggle switch
        this.animateToggle.addEventListener('change', () => {
            this.animationEnabled = this.animateToggle.checked;
            this.animateToggleText.textContent = this.animationEnabled ? 'ON' : 'OFF';
            
            if (this.animationEnabled) {
                // Start auto-shuffle timer
                this.resetShuffleTimer();
            } else {
                // Stop auto-shuffle timer
                if (this.shuffleTimeout) {
                    clearTimeout(this.shuffleTimeout);
                    this.shuffleTimeout = null;
                }
            }
        });
        
        // Radius slider
        this.radiusSlider.addEventListener('input', (e) => {
            this.currentRadius = parseFloat(e.target.value);
            this.radiusValue.textContent = this.currentRadius.toFixed(1);
            this.updateCircularPath();
            this.updateImagePositions();
        });
        
        // Height slider
        this.heightSlider.addEventListener('input', (e) => {
            this.currentHeight = parseFloat(e.target.value);
            this.heightValue.textContent = this.currentHeight.toFixed(1);
            this.updateCircularPath();
            this.updateImagePositions();
        });
        
        // Scale slider
        this.scaleSlider.addEventListener('input', (e) => {
            this.currentScale = parseFloat(e.target.value);
            this.scaleValue.textContent = this.currentScale.toFixed(1);
            this.updateImageScales();
        });
        
        // Speed slider
        this.speedSlider.addEventListener('input', (e) => {
            this.currentSpeed = parseFloat(e.target.value);
            this.speedValue.textContent = this.currentSpeed.toFixed(1);
        });
        
        // Rotation sliders - now using world space rotations
        this.rotationXSlider.addEventListener('input', (e) => {
            this.worldRotation.x = parseInt(e.target.value);
            this.rotationXValue.textContent = `${this.worldRotation.x}°`;
            this.updateWorldRotation();
        });
        
        this.rotationZSlider.addEventListener('input', (e) => {
            this.worldRotation.z = parseInt(e.target.value);
            this.rotationZValue.textContent = `${this.worldRotation.z}°`;
            this.updateWorldRotation();
        });
        
        // Reset rotation button
        this.resetRotationBtn.addEventListener('click', () => {
            this.resetRotation();
        });
        
        // Background controls
        this.backgroundColorPicker.addEventListener('change', (e) => {
            // If currently in alpha mode, disable it when a color is selected
            if (this.isAlphaBackground) {
                this.setAlphaBackground(false);
                if (this.alphaBackgroundCheckbox) {
                    this.alphaBackgroundCheckbox.checked = false;
                    if (this.alphaBackgroundToggleText) this.alphaBackgroundToggleText.textContent = 'OFF';
                }
            }
            this.setBackgroundColor(e.target.value);
        });

        if (this.alphaBackgroundCheckbox) {
            this.alphaBackgroundCheckbox.addEventListener('change', (e) => {
                const enabled = !!e.target.checked;
                this.setAlphaBackground(enabled);
                if (this.alphaBackgroundToggleText) {
                    this.alphaBackgroundToggleText.textContent = enabled ? 'ON' : 'OFF';
                }
            });
        }

        // Background image upload
        if (this.bgUploadButton && this.bgImageInput) {
            this.bgUploadButton.addEventListener('click', () => {
                this.bgImageInput.click();
            });
            this.bgImageInput.addEventListener('change', (e) => {
                this.handleBackgroundImageUpload(e);
            });
        }

        // Foreground image upload
        if (this.fgUploadButton && this.fgImageInput) {
            this.fgUploadButton.addEventListener('click', () => {
                this.fgImageInput.click();
            });
            this.fgImageInput.addEventListener('change', (e) => {
                this.handleForegroundImageUpload(e);
            });
        }
        
        // Export button
        this.exportBtn.addEventListener('click', () => {
            this.handleExport();
        });
        
        // Zoom controls
        this.zoomSlider.addEventListener('input', (e) => {
            const zoomValue = parseFloat(e.target.value);
            this.setZoom(zoomValue);
            this.zoomValue.textContent = Math.round(zoomValue * 100) + '%';
        });
        
        this.resetZoomBtn.addEventListener('click', () => {
            this.resetZoom();
        });
        
        // Export modal event listeners
        this.closeExportModal.addEventListener('click', () => {
            this.hideExportModal();
        });
        
        this.cancelExport.addEventListener('click', () => {
            this.hideExportModal();
        });
        
        this.startExport.addEventListener('click', () => {
            this.handleModalExport();
        });
        
        // Close modal when clicking outside
        this.exportModal.addEventListener('click', (e) => {
            if (e.target === this.exportModal) {
                this.hideExportModal();
            }
        });
        
        // Help modal event listeners
        this.helpIcon.addEventListener('click', () => {
            this.showHelpModal();
        });
        
        this.closeHelpModal.addEventListener('click', () => {
            this.hideHelpModal();
        });
        
        this.closeHelpBtn.addEventListener('click', () => {
            this.hideHelpModal();
        });
        
        // Close help modal when clicking outside
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.hideHelpModal();
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.exportModal.classList.contains('show')) {
                    this.hideExportModal();
                } else if (this.helpModal.classList.contains('show')) {
                    this.hideHelpModal();
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Mouse events for spline drawing (will be activated in spline mode)
        this.setupSplineDrawingEvents();
    }
    
    setupSplineDrawingEvents() {
        // Mouse events for 2D spline drawing
        this.frameContainer.addEventListener('mousedown', (e) => {
            if (this.currentPreset === 'follow-spline') {
                this.startDrawing(e);
            }
        });
        
        this.frameContainer.addEventListener('mousemove', (e) => {
            if (this.currentPreset === 'follow-spline' && this.isDrawing) {
                this.continueDrawing(e);
            }
        });
        
        this.frameContainer.addEventListener('mouseup', (e) => {
            if (this.currentPreset === 'follow-spline') {
                this.stopDrawing(e);
            }
        });
        
        this.frameContainer.addEventListener('mouseleave', (e) => {
            if (this.currentPreset === 'follow-spline') {
                this.stopDrawing(e);
            }
        });
    }
    
    startDrawing(e) {
        // Clear previous spline and start new one
        this.splinePoints = [];
        this.currentSpline = [];
        this.splineCumulativeDistances = null; // Reset distance calculations
        this.isDrawing = true;
        
        // Get mouse position with zoom consideration
        const coords = this.getCanvasCoordinates(e);
        
        // Add first point
        this.currentSpline.push({ x: coords.x, y: coords.y });
        this.clearCanvas();
        this.drawSpline();
    }
    
    continueDrawing(e) {
        if (!this.isDrawing) return;
        
        // Get mouse position with zoom consideration
        const coords = this.getCanvasCoordinates(e);
        
        // Add point to current spline
        this.currentSpline.push({ x: coords.x, y: coords.y });
        this.drawSpline();
    }
    
    stopDrawing(e) {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        // Store the completed spline
        this.splinePoints = [...this.currentSpline];
        console.log('Spline completed with', this.splinePoints.length, 'points');
        
        // Small delay to ensure spline rendering is complete before positioning images
        setTimeout(() => {
            this.createImagesAlongSpline();
        }, 50);
    }
    
    clearCanvas() {
        if (this.ctx2D) {
            // Clear the canvas
            this.ctx2D.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
            
            // Ensure we're using source-over composition for maximum compatibility
            this.ctx2D.globalCompositeOperation = 'source-over';
            this.ctx2D.globalAlpha = 1.0;
            
            // If not in alpha mode and no background image, fill the background
            if (!this.isAlphaBackground && !this.backgroundImageDataUrl) {
                const bgColor = this.currentBackgroundColor || '#121212';
                this.ctx2D.fillStyle = bgColor;
                this.ctx2D.fillRect(0, 0, this.canvas2D.width, this.canvas2D.height);
            }
        }
    }
    
    drawSpline() {
        if (!this.ctx2D || this.currentSpline.length < 2) return;
        
        this.clearCanvas();
        
        // Draw the spline
        this.ctx2D.strokeStyle = '#00ff88';
        this.ctx2D.lineWidth = 3;
        this.ctx2D.lineCap = 'round';
        this.ctx2D.lineJoin = 'round';
        
        this.ctx2D.beginPath();
        this.ctx2D.moveTo(this.currentSpline[0].x, this.currentSpline[0].y);
        
        // Draw smooth curve through points
        for (let i = 1; i < this.currentSpline.length; i++) {
            this.ctx2D.lineTo(this.currentSpline[i].x, this.currentSpline[i].y);
        }
        
        this.ctx2D.stroke();
    }
    
    handleImageUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now() + Math.random(), // Unique ID
                        file: file,
                        dataUrl: e.target.result,
                        name: file.name
                    };
                    
                    this.uploadedImages.push(imageData);
                    this.createThumbnail(imageData);
                    
                    // Remove placeholder if this is the first image
                    if (this.uploadedImages.length === 1) {
                        this.removePlaceholders();
                    }
                    
                    // Create image representation for current mode
                    if (this.currentPreset === 'ring') {
                        this.createImagePlane(imageData);
                        this.updateImagePositions();
                    } else if (this.currentPreset === 'follow-spline' && this.splinePoints.length > 0) {
                        // Recreate all images along spline
                        this.createImagesAlongSpline();
                    } else if (this.currentPreset === 'cursor-trail') {
                        // Recreate trail images with updated list
                        this.createTrailImages();
                    } else if (this.currentPreset === 'shuffle') {
                        // Add image to shuffle mode
                        this.removeShufflePlaceholder();
                        // Reset seed for consistent image creation
                        this.resetRandomSeed();
                        this.createShuffleImageElement(imageData, this.uploadedImages.length - 1);
                        // No shuffle needed when adding new image (no animation)
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Reset the input
        event.target.value = '';
    }
    
    createThumbnail(imageData) {
        const thumbnailItem = document.createElement('div');
        thumbnailItem.className = 'thumbnail-item';
        thumbnailItem.dataset.imageId = imageData.id;
        thumbnailItem.draggable = true;
        
        const img = document.createElement('img');
        img.className = 'thumbnail-image';
        img.src = imageData.dataUrl;
        img.alt = imageData.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'thumbnail-remove';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeImage(imageData.id);
        });
        
        // Add drag and drop event listeners
        this.addDragAndDropListeners(thumbnailItem);
        
        thumbnailItem.appendChild(img);
        thumbnailItem.appendChild(removeBtn);
        this.thumbnailsContainer.appendChild(thumbnailItem);
    }
    
    removeImage(imageId) {
        // Remove from uploaded images array
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
        
        // Show placeholder if no images left
        if (this.uploadedImages.length === 0) {
            this.showPlaceholders();
        }
        
        // Remove thumbnail from DOM
        const thumbnail = this.thumbnailsContainer.querySelector(`[data-image-id="${imageId}"]`);
        if (thumbnail) {
            thumbnail.remove();
        }
        
        if (this.currentPreset === 'ring') {
            // Remove from Three.js scene and recreate all
            this.imagePlanes = []; // Clear all planes
            // Remove all planes from the scene
            const planesToRemove = [];
            this.pathGroup.children.forEach(child => {
                if (child.userData && child.userData.imageId) {
                    planesToRemove.push(child);
                }
            });
            planesToRemove.forEach(plane => {
                this.pathGroup.remove(plane);
                if (plane.geometry) plane.geometry.dispose();
                if (plane.material) {
                    if (plane.material.map) plane.material.map.dispose();
                    plane.material.dispose();
                }
            });
            
            // Recreate all remaining images
            this.uploadedImages.forEach(imageData => {
                this.createImagePlane(imageData);
            });
            this.updateImagePositions();
            
        } else if (this.currentPreset === 'follow-spline') {
            // Recreate images along spline with updated list
            if (this.splinePoints.length > 0) {
                this.createImagesAlongSpline();
            }
        } else if (this.currentPreset === 'cursor-trail') {
            // Recreate trail images with updated list
            this.createTrailImages();
        } else if (this.currentPreset === 'shuffle') {
            // Find and remove from shuffle images
            const imgToRemove = this.shuffleImages.find(img => img.userData.imageId === imageId);
            if (imgToRemove && imgToRemove.parentNode) {
                imgToRemove.parentNode.removeChild(imgToRemove);
            }
            this.shuffleImages = this.shuffleImages.filter(img => img.userData.imageId !== imageId);
            
            // Show placeholder if no images left
            if (this.uploadedImages.length === 0) {
                this.showShufflePlaceholder();
            }
        }
    }

    addDragAndDropListeners(thumbnailItem) {
        thumbnailItem.addEventListener('dragstart', (e) => {
            thumbnailItem.classList.add('dragging');
            this.draggedElement = thumbnailItem;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', thumbnailItem.dataset.imageId);
            
            // Show all drop dividers
            this.showDropDividers();
        });

        thumbnailItem.addEventListener('dragend', (e) => {
            thumbnailItem.classList.remove('dragging');
            this.hideDropDividers();
            this.draggedElement = null;
        });

        // Add dragover and drop to the thumbnail itself for reordering
        thumbnailItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.draggedElement && this.draggedElement !== thumbnailItem) {
                e.dataTransfer.dropEffect = 'move';
            }
        });

        thumbnailItem.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedElement && this.draggedElement !== thumbnailItem) {
                this.reorderToPosition(thumbnailItem);
            }
        });
    }

    showDropDividers() {
        // Add visual dividers between thumbnails without creating new elements
        this.thumbnailsContainer.classList.add('showing-dividers');
    }

    hideDropDividers() {
        // Remove visual dividers
        this.thumbnailsContainer.classList.remove('showing-dividers');
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
        
        // Update DOM order by moving the dragged element
        if (draggedIndex < targetIndex) {
            // Moving forward - insert after target
            targetThumbnail.parentNode.insertBefore(this.draggedElement, targetThumbnail.nextSibling);
        } else {
            // Moving backward - insert before target
            targetThumbnail.parentNode.insertBefore(this.draggedElement, targetThumbnail);
        }
        
        // Update gallery display based on current mode
        this.updateGalleryAfterReorder();
    }

    updateGalleryAfterReorder() {
        switch (this.currentPreset) {
            case 'ring':
                // Recreate all image planes in new order
                this.clearImagePlanes();
                this.uploadedImages.forEach(imageData => {
                    this.createImagePlane(imageData);
                });
                this.updateImagePositions();
                break;
                
            case 'follow-spline':
                // Recreate images along spline with new order
                if (this.splinePoints.length > 0) {
                    this.createImagesAlongSpline();
                }
                break;
                
            case 'cursor-trail':
                // Recreate trail images with new order
                this.createTrailImages();
                break;
                
            case 'shuffle':
                // Recreate shuffle images with new order
                this.clearShuffleImages();
                this.uploadedImages.forEach((imageData, index) => {
                    this.createShuffleImageElement(imageData, index);
                });
                // Apply current shuffle state
                this.performShuffle();
                break;
        }
    }

    clearImagePlanes() {
        // Remove all image planes from the scene
        const planesToRemove = [];
        this.pathGroup.children.forEach(child => {
            if (child.userData && child.userData.imageId) {
                planesToRemove.push(child);
            }
        });
        planesToRemove.forEach(plane => {
            this.pathGroup.remove(plane);
            if (plane.geometry) plane.geometry.dispose();
            if (plane.material) {
                if (plane.material.map) plane.material.map.dispose();
                plane.material.dispose();
            }
        });
        this.imagePlanes = [];
    }
    
    handlePresetChange(preset) {
        this.currentPreset = preset;
        
        switch (preset) {
            case 'ring':
                // Show current ring gallery
                this.showRingGallery();
                break;
            case 'follow-spline':
                // Show empty canvas for now
                this.showFollowSplineGallery();
                break;
            case 'cursor-trail':
                // Show cursor trail gallery
                this.showCursorTrailGallery();
                break;
            case 'shuffle':
                // Show shuffle gallery
                this.showShuffleGallery();
                break;
            default:
                console.log('Unknown preset:', preset);
        }
    }
    
    showRingGallery() {
        // Enable ring gallery mode (current functionality)
        this.pathGroup.visible = true;
        
        // Stop cursor tracking if coming from trail mode
        if (this.isTrackingCursor) {
            this.stopCursorTracking();
        }
        
        // Show ring-specific UI controls
        this.showRingControls();
        
        // Show Three.js renderer and hide 2D canvas
        if (this.renderer) {
            this.renderer.domElement.style.display = 'block';
        }
        if (this.canvas2D) {
            this.canvas2D.style.display = 'none';
        }
        
        // Clear 2D images, trail images, and shuffle images
        this.clear2DImages();
        this.clearTrailImages();
        this.clearShuffleImages();
        
        // Recreate the circular path
        this.createCircularPath();
        
        // Create 3D planes for all uploaded images
        this.imagePlanes = []; // Clear existing planes
        this.uploadedImages.forEach(imageData => {
            this.createImagePlane(imageData);
        });
        
        // Update positions of all images
        this.updateImagePositions();
        
        // Show placeholder if no images
        if (this.uploadedImages.length === 0) {
            this.showRingPlaceholder();
        }
        
        console.log('Ring gallery mode activated');
    }
    
    showFollowSplineGallery() {
        // Hide ring elements for empty canvas
        this.pathGroup.visible = false;
        
        // Stop cursor tracking if coming from trail mode
        if (this.isTrackingCursor) {
            this.stopCursorTracking();
        }
        
        // Hide ring-specific UI controls
        this.hideRingControls();
        
        // Hide Three.js renderer and show 2D canvas
        if (this.renderer) {
            this.renderer.domElement.style.display = 'none';
        }
        
        // Clear shuffle images and trail images
        this.clearShuffleImages();
        this.clearTrailImages();
        
        // Create or show 2D canvas for spline drawing
        this.setup2DCanvas();
        
        // Show spline instruction text if no spline is drawn
        if (this.splinePoints.length === 0) {
            this.drawSplinePlaceholder();
        } else if (this.uploadedImages.length > 0) {
            // Create 2D images for uploaded images if there's a spline
            this.createImagesAlongSpline();
        }
        
        console.log('Follow spline mode activated - 2D canvas ready for drawing');
    }
    
    showShuffleGallery() {
        // Hide ring elements and Three.js renderer
        this.pathGroup.visible = false;
        
        // Stop cursor tracking if coming from trail mode
        if (this.isTrackingCursor) {
            this.stopCursorTracking();
        }
        
        // Hide ring-specific UI controls and show shuffle controls
        this.showShuffleControls();
        
        // Hide Three.js renderer
        if (this.renderer) {
            this.renderer.domElement.style.display = 'none';
        }
        if (this.canvas2D) {
            this.canvas2D.style.display = 'none';
        }
        
        // Clear 2D spline images, trail images, and 3D images
        this.clear2DImages();
        this.clearTrailImages();
        
        // Create 2D shuffle images for all uploaded images
        this.createShuffleImages();
        
        // Auto-shuffle disabled for now
        // this.resetShuffleTimer();
        
        console.log('Shuffle gallery mode activated');
    }
    
    showCursorTrailGallery() {
        // Hide ring elements and Three.js renderer
        this.pathGroup.visible = false;
        
        // Show cursor trail controls
        this.showCursorTrailControls();
        
        // Hide Three.js renderer and show 2D canvas
        if (this.renderer) {
            this.renderer.domElement.style.display = 'none';
        }
        
        // Clear other mode images
        this.clear2DImages();
        this.clearShuffleImages();
        
        // Create or show 2D canvas for cursor tracking
        this.setup2DCanvas();
        
        // Clear any existing trail
        this.clearTrailImages();
        
        // Create trail images
        this.createTrailImages();
        
        // Start cursor tracking
        this.startCursorTracking();
        
        console.log('Cursor trail mode activated - move your cursor to create a trail');
    }
    
    showCursorTrailControls() {
        // Hide all other control sections, only show cursor trail controls
        const imageScaleSection = document.getElementById('imageScaleSection');
        const circlePropertiesSection = document.getElementById('circlePropertiesSection');
        const splinePropertiesSection = document.getElementById('splinePropertiesSection');
        const cursorTrailPropertiesSection = document.getElementById('cursorTrailPropertiesSection');
        const shufflePropertiesSection = document.getElementById('shufflePropertiesSection');
        
        if (imageScaleSection) imageScaleSection.style.display = 'none';
        if (circlePropertiesSection) circlePropertiesSection.style.display = 'none';
        if (splinePropertiesSection) splinePropertiesSection.style.display = 'none';
        if (cursorTrailPropertiesSection) cursorTrailPropertiesSection.style.display = 'block';
        if (shufflePropertiesSection) shufflePropertiesSection.style.display = 'none';
    }
    
    clearTrailImages() {
        this.trailImages.forEach(trailImg => {
            if (trailImg.element && trailImg.element.parentNode) {
                trailImg.element.parentNode.removeChild(trailImg.element);
            }
        });
        this.trailImages = [];
    }
    
    startCursorTracking() {
        this.isTrackingCursor = true;
        
        // Add mouse move event listeners to the frame container
        this.frameContainer.addEventListener('mousemove', this.trackCursor.bind(this));
        this.frameContainer.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.frameContainer.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        
        // Start animation loop
        this.animateTrail();
    }
    
    stopCursorTracking() {
        this.isTrackingCursor = false;
        this.mouseInCanvas = false;
        
        // Remove event listeners
        this.frameContainer.removeEventListener('mousemove', this.trackCursor.bind(this));
        this.frameContainer.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.frameContainer.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
        
        // Stop animation
        if (this.trailAnimationId) {
            cancelAnimationFrame(this.trailAnimationId);
            this.trailAnimationId = null;
        }
    }
    
    onMouseEnter(e) {
        this.mouseInCanvas = true;
        this.trackCursor(e);
    }
    
    onMouseLeave() {
        this.mouseInCanvas = false;
    }
    
    trackCursor(e) {
        if (!this.isTrackingCursor || this.currentPreset !== 'cursor-trail') return;
        
        // Get mouse position with zoom consideration
        const coords = this.getCanvasCoordinates(e);
        this.cursorPosition.x = coords.x;
        this.cursorPosition.y = coords.y;
    }
    
    createTrailImages() {
        // Clear existing trail images
        this.clearTrailImages();
        
        if (this.uploadedImages.length === 0) return;
        
        // Create trail images based on trail length
        const numImages = Math.min(this.trailLength, this.uploadedImages.length);
        
        for (let i = 0; i < numImages; i++) {
            const imageData = this.uploadedImages[i % this.uploadedImages.length];
            this.createTrailImageElement(imageData, i);
        }
    }
    
    createTrailImageElement(imageData, index) {
        const img = document.createElement('img');
        img.src = imageData.dataUrl;
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.zIndex = (1000 - index).toString(); // First image (index 0) has highest z-index
        img.style.transition = 'none'; // No CSS transitions, we'll animate manually
        
        // Set initial position off-screen
        const frameSize = this.getFrameSize();
        img.style.left = (frameSize.width / 2) + 'px';
        img.style.top = (frameSize.height / 2) + 'px';
        
        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            
            // Calculate size based on trail scale
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
        
        // Create trail image object
        const trailImageObj = {
            element: img,
            currentX: frameSize.width / 2,
            currentY: frameSize.height / 2,
            targetX: frameSize.width / 2,
            targetY: frameSize.height / 2,
            index: index,
            imageData: imageData
        };
        
        this.frameContainer.appendChild(img);
        this.trailImages.push(trailImageObj);
    }
    
    animateTrail() {
        if (!this.isTrackingCursor || this.currentPreset !== 'cursor-trail') return;
        
        // Set target positions for each image in the trail
        if (this.trailImages.length > 0) {
            // First image follows cursor
            if (this.mouseInCanvas) {
                this.trailImages[0].targetX = this.cursorPosition.x;
                this.trailImages[0].targetY = this.cursorPosition.y;
            }
            
            // Each subsequent image follows the previous one
            for (let i = 1; i < this.trailImages.length; i++) {
                const prevImage = this.trailImages[i - 1];
                this.trailImages[i].targetX = prevImage.currentX;
                this.trailImages[i].targetY = prevImage.currentY;
            }
            
            // Animate each image towards its target
            this.trailImages.forEach(trailImg => {
                // Lerp towards target position
                const lerpFactor = this.trailAnimationSpeed * 0.1; // Convert speed to 0-0.2 range
                
                trailImg.currentX += (trailImg.targetX - trailImg.currentX) * lerpFactor;
                trailImg.currentY += (trailImg.targetY - trailImg.currentY) * lerpFactor;
                
                // Update DOM position
                const imgWidth = trailImg.element.offsetWidth || 80;
                const imgHeight = trailImg.element.offsetHeight || 80;
                
                trailImg.element.style.left = (trailImg.currentX - imgWidth / 2) + 'px';
                trailImg.element.style.top = (trailImg.currentY - imgHeight / 2) + 'px';
            });
        }
        
        // Continue animation
        this.trailAnimationId = requestAnimationFrame(() => this.animateTrail());
    }
    
    updateTrailImageScales() {
        this.trailImages.forEach(trailImg => {
            const img = trailImg.element;
            if (img.naturalWidth && img.naturalHeight) {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const baseSize = 80 * this.trailImageScale;
                
                if (aspectRatio > 1) {
                    img.style.width = baseSize + 'px';
                    img.style.height = (baseSize / aspectRatio) + 'px';
                } else {
                    img.style.width = (baseSize * aspectRatio) + 'px';
                    img.style.height = baseSize + 'px';
                }
            }
        });
    }
    
    showShuffleControls() {
        // Hide all other control sections, only show shuffle controls
        const imageScaleSection = document.getElementById('imageScaleSection');
        const circlePropertiesSection = document.getElementById('circlePropertiesSection');
        const splinePropertiesSection = document.getElementById('splinePropertiesSection');
        const shufflePropertiesSection = document.getElementById('shufflePropertiesSection');
        
        if (imageScaleSection) imageScaleSection.style.display = 'none';
        if (circlePropertiesSection) circlePropertiesSection.style.display = 'none';
        if (splinePropertiesSection) splinePropertiesSection.style.display = 'none';
        if (shufflePropertiesSection) shufflePropertiesSection.style.display = 'block';
    }
    
    createShuffleImages() {
        // Clear existing shuffle images
        this.clearShuffleImages();
        
        if (this.uploadedImages.length === 0) {
            this.showShufflePlaceholder();
            return;
        }
        
        // Remove placeholder
        this.removeShufflePlaceholder();
        
        // Set initial random seed for image creation
        this.resetRandomSeed();
        
        // Create randomly positioned and sized images
        this.uploadedImages.forEach((imageData, index) => {
            this.createShuffleImageElement(imageData, index);
        });
        
        // Perform initial shuffle to randomize positions (no delay needed without animation)
        this.performShuffle();
    }
    
    createShuffleImageElement(imageData, index) {
        const img = document.createElement('img');
        img.src = imageData.dataUrl;
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.zIndex = '10';
        img.style.borderRadius = '4px';
        // Add moderate exponential ease-in-out transition for position changes
        const duration = 2.1 - this.shuffleAnimationSpeed; // Invert speed: higher slider = faster animation
        img.style.transition = `left ${duration}s cubic-bezier(0.87, 0, 0.13, 1), top ${duration}s cubic-bezier(0.87, 0, 0.13, 1)`;
        
        // Calculate size based on scatter scale
        // scatterScale = 0.0 means all images are base size (80px)
        // scatterScale = 1.0 means some images scale up to 250px (never smaller than base)
        const baseSize = 80; // Minimum size for images
        const maxVariation = 170 * this.scatterScale; // Only scale up from base size
        const randomSize = baseSize + (this.seededRandom() * maxVariation);
        
        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            
            if (aspectRatio > 1) {
                // Landscape
                img.style.width = randomSize + 'px';
                img.style.height = (randomSize / aspectRatio) + 'px';
            } else {
                // Portrait
                img.style.width = (randomSize * aspectRatio) + 'px';
                img.style.height = randomSize + 'px';
            }
            
            // Update transition with current animation speed and moderate exponential easing
            const duration = 2.1 - this.shuffleAnimationSpeed; // Invert speed: higher slider = faster animation
            img.style.transition = `left ${duration}s cubic-bezier(0.87, 0, 0.13, 1), top ${duration}s cubic-bezier(0.87, 0, 0.13, 1)`;
            
            // Set random initial position immediately (no delay needed without animation)
            this.randomizeImagePosition(img);
        };
        
        img.userData = {
            imageId: imageData.id,
            index: index,
            baseSize: randomSize
        };
        
        this.frameContainer.appendChild(img);
        this.shuffleImages.push(img);
    }
    
    randomizeImagePosition(img) {
        // Use actual displayed frame dimensions instead of configured dimensions
        // This fixes positioning issues when frame is scaled down by responsive constraints
        const frameRect = this.frameContainer.getBoundingClientRect();
        const frameSize = {
            width: frameRect.width,
            height: frameRect.height
        };
        const margin = 20; // Margin from edges
        
        // Get image dimensions (fallback to 100x100 if not loaded yet)
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
            // Calculate available space for image centers (accounting for image dimensions)
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
    
    // Seeded random number generator (Linear Congruential Generator)
    seededRandom() {
        this.randomSeed = (this.randomSeed * 1664525 + 1013904223) % 4294967296;
        return this.randomSeed / 4294967296;
    }
    
    // Reset seed state for reproducible results
    resetRandomSeed() {
        this.randomSeed = this.seed;
    }
    
    performShuffle() {
        if (this.isShuffling || this.shuffleImages.length === 0) return;
        
        this.isShuffling = true;
        
        // Reset random seed for reproducible results
        this.resetRandomSeed();
        
        // Randomize positions, sizes, and stacking order of all images
        this.shuffleImages.forEach((img, index) => {
            // Calculate base size from shuffle scale (overall scale)
            const baseSize = 120 * this.shuffleScale; // Base size controlled by Scale slider
            
            // Calculate size variation based on scatter scale
            let newSize;
            if (this.scatterScale === 0) {
                // No variation - all images same size
                newSize = baseSize;
            } else {
                // Apply scatter variation around base size
                const variationRange = baseSize * this.scatterScale * 2; // Total variation range
                const minSize = Math.max(20, baseSize - variationRange / 2); // Minimum size
                const maxSize = baseSize + variationRange / 2; // Maximum size
                newSize = minSize + (this.seededRandom() * (maxSize - minSize));
            }
            
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            
            // Calculate new dimensions
            let newWidth, newHeight;
            if (aspectRatio > 1) {
                newWidth = newSize;
                newHeight = newSize / aspectRatio;
            } else {
                newWidth = newSize * aspectRatio;
                newHeight = newSize;
            }
            
            // Apply new size
            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
            
            // Randomize z-index for stacking order (range: 1-1000)
            const randomZIndex = Math.floor(this.seededRandom() * 1000) + 1;
            img.style.zIndex = randomZIndex.toString();
            
            // Always randomize position when performing full shuffle
            this.randomizeImagePosition(img);
        });
        
        // Don't restart timer here - let the animation timer handle continuous animation
        // Manual shuffle calls shouldn't restart the animation timer
        
        // Allow shuffling again immediately (no animation delay)
        this.isShuffling = false;
    }
    
    repositionShuffleImages() {
        if (this.shuffleImages.length === 0) return;
        
        // Reset random seed for reproducible results
        this.resetRandomSeed();
        
        // Reposition images and randomize stacking order, but don't change sizes
        this.shuffleImages.forEach((img) => {
            // Randomize z-index for stacking order (range: 1-1000)
            const randomZIndex = Math.floor(this.seededRandom() * 1000) + 1;
            img.style.zIndex = randomZIndex.toString();
            
            // Randomize position
            this.randomizeImagePosition(img);
        });
    }
    
    animatePositions() {
        if (this.shuffleImages.length === 0) return;
        
        // Reset random seed for current seed value to ensure reproducible animation
        this.resetRandomSeed();
        
        // Only animate positions, keep current sizes and stacking order
        this.shuffleImages.forEach((img) => {
            // Skip z-index changes during animation - keep current layering
            
            // Animate to new random position
            this.randomizeImagePosition(img);
        });
        
        // Increment seed for next animation cycle to get different positions
        this.seed = (this.seed + 1) % 10000;
        this.seedInput.value = this.seed.toString();
    }
    
    resetShuffleTimer() {
        // Clear existing timer
        if (this.shuffleTimeout) {
            clearTimeout(this.shuffleTimeout);
        }
        
        // Set new timer only if in shuffle mode and animation is enabled
        if (this.currentPreset === 'shuffle' && this.shuffleInterval > 0 && this.animationEnabled) {
            this.shuffleTimeout = setTimeout(() => {
                this.animatePositions();
                // Restart timer for continuous animation
                this.resetShuffleTimer();
            }, this.shuffleInterval * 1000);
        }
    }
    
    clearShuffleImages() {
        this.shuffleImages.forEach(img => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        });
        this.shuffleImages = [];
    }
    
    showShufflePlaceholder() {
        const frameSize = this.getFrameSize();
        const margin = 20;
        const placeholder = document.createElement('div');
        placeholder.className = 'shuffle-placeholder';
        placeholder.style.position = 'absolute';
        
        // Center the placeholder with margin consideration
        const placeholderWidth = 200;
        const placeholderHeight = 60;
        const centerX = Math.max(margin, (frameSize.width - placeholderWidth) / 2);
        const centerY = Math.max(margin, (frameSize.height - placeholderHeight) / 2);
        
        placeholder.style.left = centerX + 'px';
        placeholder.style.top = centerY + 'px';
        placeholder.style.width = placeholderWidth + 'px';
        placeholder.style.height = placeholderHeight + 'px';
        placeholder.style.backgroundColor = '#2a2a2a';
        placeholder.style.border = '2px dashed #666666';
        placeholder.style.borderRadius = '8px';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.color = '#888888';
        placeholder.style.fontSize = '14px';
        placeholder.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        placeholder.textContent = 'Add images to shuffle';
        
        this.frameContainer.appendChild(placeholder);
        this.shufflePlaceholder = placeholder;
    }
    
    removeShufflePlaceholder() {
        if (this.shufflePlaceholder && this.shufflePlaceholder.parentNode) {
            this.shufflePlaceholder.parentNode.removeChild(this.shufflePlaceholder);
            this.shufflePlaceholder = null;
        }
    }
    
    repositionShuffleImagesWithinBounds() {
        // Use actual displayed frame dimensions instead of configured dimensions
        const frameRect = this.frameContainer.getBoundingClientRect();
        const frameSize = {
            width: frameRect.width,
            height: frameRect.height
        };
        const margin = 20;
        
        this.shuffleImages.forEach((img) => {
            const imgWidth = img.offsetWidth || 100;
            const imgHeight = img.offsetHeight || 100;
            
            // Get current position
            const currentX = parseInt(img.style.left) || 0;
            const currentY = parseInt(img.style.top) || 0;
            
            // Calculate bounds
            const minX = margin;
            const minY = margin;
            const maxX = frameSize.width - imgWidth - margin;
            const maxY = frameSize.height - imgHeight - margin;
            
            // Clamp position to bounds
            const newX = Math.max(minX, Math.min(maxX, currentX));
            const newY = Math.max(minY, Math.min(maxY, currentY));
            
            // Update position if needed
            if (newX !== currentX || newY !== currentY) {
                img.style.left = newX + 'px';
                img.style.top = newY + 'px';
            }
        });
    }
    
    showRingControls() {
        // Show controls specific to ring gallery
        const imageScaleSection = document.getElementById('imageScaleSection');
        const circlePropertiesSection = document.getElementById('circlePropertiesSection');
        const splinePropertiesSection = document.getElementById('splinePropertiesSection');
        const cursorTrailPropertiesSection = document.getElementById('cursorTrailPropertiesSection');
        const shufflePropertiesSection = document.getElementById('shufflePropertiesSection');
        
        if (imageScaleSection) imageScaleSection.style.display = 'block';
        if (circlePropertiesSection) circlePropertiesSection.style.display = 'block';
        if (splinePropertiesSection) splinePropertiesSection.style.display = 'none';
        if (cursorTrailPropertiesSection) cursorTrailPropertiesSection.style.display = 'none';
        if (shufflePropertiesSection) shufflePropertiesSection.style.display = 'none';
    }
    
    hideRingControls() {
        // Hide controls specific to ring gallery and show spline controls
        const imageScaleSection = document.getElementById('imageScaleSection');
        const circlePropertiesSection = document.getElementById('circlePropertiesSection');
        const splinePropertiesSection = document.getElementById('splinePropertiesSection');
        const cursorTrailPropertiesSection = document.getElementById('cursorTrailPropertiesSection');
        const shufflePropertiesSection = document.getElementById('shufflePropertiesSection');
        
        if (imageScaleSection) imageScaleSection.style.display = 'none';
        if (circlePropertiesSection) circlePropertiesSection.style.display = 'none';
        if (splinePropertiesSection) splinePropertiesSection.style.display = 'block';
        if (cursorTrailPropertiesSection) cursorTrailPropertiesSection.style.display = 'none';
        if (shufflePropertiesSection) shufflePropertiesSection.style.display = 'none';
    }
    
    createImagePlane(imageData) {
        const loader = new THREE.TextureLoader();
        loader.load(imageData.dataUrl, (texture) => {
            // Ensure texture uses proper color space and preserves alpha
            texture.colorSpace = THREE.SRGBColorSpace;
            
            // Create geometry for the image plane
            const geometry = new THREE.PlaneGeometry(1, 1);
            
            // Create material with the image texture - support alpha transparency
            const material = new THREE.MeshBasicMaterial({ 
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,  // Enable transparency for PNG alpha
                alphaTest: 0.1,     // Discard pixels with alpha < 0.1 for better performance
                toneMapped: false   // Disable tone mapping for true colors
            });
            
            // Create the plane mesh
            const plane = new THREE.Mesh(geometry, material);
            plane.userData.imageId = imageData.id;
            plane.userData.originalSize = {
                width: texture.image.width,
                height: texture.image.height
            };
            
            // Scale the plane to maintain aspect ratio with current scale
            const aspectRatio = texture.image.width / texture.image.height;
            if (aspectRatio > 1) {
                // Landscape
                plane.scale.set(this.currentScale, this.currentScale / aspectRatio, 1);
            } else {
                // Portrait
                plane.scale.set(this.currentScale * aspectRatio, this.currentScale, 1);
            }
            
            this.imagePlanes.push(plane);
            this.pathGroup.add(plane);
            this.updateImagePositions();
        });
    }
    
    updateImagePositions() {
        if (this.imagePlanes.length === 0) return;
        
        // Calculate static positions in LOCAL space (not affected by parent rotation)
        const radius = this.currentRadius + 1; // Slightly outside the path
        const angleStep = (Math.PI * 2) / this.imagePlanes.length;
        
        this.imagePlanes.forEach((plane, index) => {
            // Static circular position calculation in local XZ plane
            const angle = index * angleStep;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = this.currentHeight; // Fixed Y position, no bobbing
            
            // Set position in LOCAL pathGroup space
            plane.position.set(x, y, z);
            
            // Get world positions for camera facing calculation
            const cameraWorldPosition = new THREE.Vector3();
            const planeWorldPosition = new THREE.Vector3();
            
            this.camera.getWorldPosition(cameraWorldPosition);
            plane.getWorldPosition(planeWorldPosition);
            
            // Make the plane face the camera using lookAt
            plane.lookAt(cameraWorldPosition);
        });
    }
    
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
        
        // Set initial clear alpha depending on toggle
        this.renderer.setClearAlpha(this.isAlphaBackground ? 0 : 1);

        // Add renderer to frame container
        this.frameContainer.appendChild(this.renderer.domElement);
        
        // Create parent group for manual rotation controls
        this.rotationGroup = new THREE.Group();
        this.scene.add(this.rotationGroup);
        
        // Create child group for internal animation
        this.pathGroup = new THREE.Group();
        this.rotationGroup.add(this.pathGroup);
        
        // Create circular path
        this.createCircularPath();
        
        // Add lighting
        this.addLighting();
        
        // Show initial placeholder
        this.showPlaceholders();
        
        // Start animation loop
        this.animate();
    }
    
    createCircularPath() {
        // Clear existing elements from the group (except image planes)
        const imagesToKeep = [...this.imagePlanes];
        while (this.pathGroup.children.length > 0) {
            const child = this.pathGroup.children[0];
            if (!imagesToKeep.includes(child)) {
                this.pathGroup.remove(child);
            } else {
                // Temporarily remove image planes
                this.pathGroup.remove(child);
            }
        }
        
        // Re-add image planes
        imagesToKeep.forEach(plane => this.pathGroup.add(plane));
        this.pathMarkers = [];
        
        // Create geometry for the circular path
        const radius = this.currentRadius;
        const segments = 64;
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        // Generate circular path vertices
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = this.currentHeight; // Use height slider value instead of 0
            
            vertices.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        // Create material for the path
        // const material = new THREE.LineBasicMaterial({ 
        //     color: 0x00ff88,
        //     linewidth: 3
        // });
        
        // Create the line and add to group
        // this.circularPath = new THREE.Line(geometry, material);
        // this.pathGroup.add(this.circularPath);
        
        // Add path markers to group
        // this.addPathMarkers(radius, segments);
        
        // Apply current world rotation
        this.updateWorldRotation();
    }
    
    addPathMarkers(radius, segments) {
        // Add small spheres along the path
        const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        for (let i = 0; i < segments; i += 8) { // Every 8th point
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = this.currentHeight; // Use height slider value instead of 0
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(x, y, z);
            this.pathMarkers.push(sphere);
            this.pathGroup.add(sphere);
        }
        
        // Add a center reference point
        // const centerGeometry = new THREE.SphereGeometry(0.1, 12, 12);
        // const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
        // this.centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
        // this.centerSphere.position.set(0, this.currentHeight, 0); // Use height slider value instead of hardcoded 0
        // this.pathGroup.add(this.centerSphere);
    }
    
    updateCircularPath() {
        this.createCircularPath();
        this.updatePlaceholderPosition();
    }
    
    updateWorldRotation() {
        if (this.rotationGroup) {
            // Apply X and Z rotations in world space (global)
            // Reset rotation first, then apply world space rotations
            const currentLocalY = this.rotationGroup.rotation.y; // Preserve local Y rotation
            
            // Reset to identity
            this.rotationGroup.rotation.set(0, 0, 0);
            
            // Apply global X and Z rotations using Euler angles
            this.rotationGroup.rotation.x = THREE.MathUtils.degToRad(this.worldRotation.x);
            this.rotationGroup.rotation.z = THREE.MathUtils.degToRad(this.worldRotation.z);
            
            // Restore the local Y rotation (from automatic spinning)
            this.rotationGroup.rotation.y = currentLocalY;
        }
    }
    
    resetRotation() {
        this.worldRotation = { x: 0, y: 0, z: 0 };
        this.rotationXSlider.value = 0;
        this.rotationZSlider.value = 0;
        this.rotationXValue.textContent = '0°';
        this.rotationZValue.textContent = '0°';
        
        // Reset X and Z rotations but preserve Y (local spinning)
        const currentLocalY = this.rotationGroup.rotation.y;
        this.rotationGroup.rotation.set(0, currentLocalY, 0);
    }
    
    setBackgroundColor(color) {
        // Store the color for canvas operations
        this.currentBackgroundColor = color;
        
        if (this.scene) {
            if (this.isAlphaBackground || this.backgroundImageDataUrl) {
                this.scene.background = null; // Transparent so CSS/image shows
            } else {
                this.scene.background = new THREE.Color(color);
            }
        }
        
        // Also set the frame container background for modes that don't use Three.js (like shuffle mode)
        if (this.frameContainer) {
            if (this.backgroundImageDataUrl) {
                // If an image is set, ensure it's displayed and color is not overriding
                this.applyBackgroundImageStyles();
            } else {
                if (this.isAlphaBackground) {
                    this.frameContainer.classList.add('alpha-bg');
                    this.frameContainer.style.removeProperty('background-color');
                    this.frameContainer.style.removeProperty('background-image');
                } else {
                    this.frameContainer.classList.remove('alpha-bg');
                    this.frameContainer.style.removeProperty('background-image');
                    this.frameContainer.style.backgroundColor = color;
                    // Use !important to override CSS rule
                    this.frameContainer.style.setProperty('background-color', color, 'important');
                }
            }
        }
        this.updateRendererClearAlphaForBackground();
        
        // If we have a 2D canvas (for spline mode), update its background
        if (this.canvas2D && this.currentPreset === 'follow-spline') {
            this.clearCanvas();
            this.drawSpline();
        }
    }

    setAlphaBackground(enabled) {
        this.isAlphaBackground = enabled;
        // Update Three.js renderer transparency
        this.updateRendererClearAlphaForBackground();

        // Scene background
        if (this.scene) {
            if (this.backgroundImageDataUrl || enabled) {
                this.scene.background = null;
            } else {
                this.scene.background = new THREE.Color(this.currentBackgroundColor || '#121212');
            }
        }

        // Frame container background and class
        if (this.frameContainer) {
            if (this.backgroundImageDataUrl) {
                // Background image takes precedence; keep it regardless of alpha toggle
                this.applyBackgroundImageStyles();
            } else {
                if (enabled) {
                    this.frameContainer.classList.add('alpha-bg');
                    this.frameContainer.style.removeProperty('background-color');
                    this.frameContainer.style.removeProperty('background-image');
                } else {
                    this.frameContainer.classList.remove('alpha-bg');
                    const color = this.currentBackgroundColor || '#121212';
                    this.frameContainer.style.removeProperty('background-image');
                    this.frameContainer.style.backgroundColor = color;
                    this.frameContainer.style.setProperty('background-color', color, 'important');
                }
            }
        }

        // 2D canvas background handling
        if (this.canvas2D) {
            // In alpha mode, we keep canvas clear (transparent) and rely on checkerboard behind
            this.clearCanvas();
            this.drawSpline();
        }
    }

    updateRendererClearAlphaForBackground() {
        if (!this.renderer) return;
        const shouldBeTransparent = this.isAlphaBackground || !!this.backgroundImageDataUrl;
        try {
            this.renderer.setClearAlpha(shouldBeTransparent ? 0 : 1);
        } catch (e) {
            this.renderer.getContext().clearColor(0, 0, 0, shouldBeTransparent ? 0 : 1);
        }
    }
    
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
    
    handleExport() {
        this.showExportModal();
    }
    
    showExportModal() {
        // Update current mode display
        const modeNames = {
            'ring': 'Ring',
            'follow-spline': 'Follow Spline',
            'cursor-trail': 'Cursor Trail',
            'shuffle': 'Shuffle'
        };
        this.currentModeDisplay.textContent = modeNames[this.currentPreset] || this.currentPreset;
        
        // Show modal with animation
        this.exportModal.classList.add('show');
        
        // Focus on duration input
        setTimeout(() => {
            this.exportDuration.focus();
            this.exportDuration.select();
        }, 100);
    }
    
    hideExportModal() {
        this.exportModal.classList.remove('show');
    }
    
    showHelpModal() {
        this.helpModal.classList.add('show');
    }
    
    hideHelpModal() {
        this.helpModal.classList.remove('show');
    }
    
    handleModalExport() {
        const duration = parseFloat(this.exportDuration.value);
        const format = this.exportFormat.value;
        
        // Validate duration
        if (isNaN(duration) || duration < 1 || duration > 60) {
            alert('Duration must be between 1 and 60 seconds.');
            this.exportDuration.focus();
            return;
        }
        
        // Hide modal
        this.hideExportModal();
        
        // Check if PNG sequence was selected
        if (format === 'png-sequence') {
            this.exportPNGSequence(duration);
        } else {
            // Store format preference for this session
            this.preferredExportFormat = format;
            
            // Start video recording
            this.startVideoRecording(duration);
        }
    }
    
    startVideoRecording(duration) {
        // Disable export button during recording
        this.exportBtn.disabled = true;
        this.exportBtn.textContent = 'Recording...';
        
        // Determine which canvas/element to capture based on current mode
        let canvas = null;
        let stream = null;
        
        console.log('Starting video recording for mode:', this.currentPreset);
        
        switch (this.currentPreset) {
            case 'ring':
                // Ring mode needs a properly sized canvas for recording
                canvas = this.createRingRecordingCanvas();
                if (!canvas) {
                    alert('Unable to create recording canvas for ring mode');
                    this.exportBtn.disabled = false;
                    this.exportBtn.textContent = 'Export';
                    return;
                }
                stream = canvas.captureStream(60);
                break;
                
            case 'follow-spline':
                // Spline mode needs to capture both canvas spline AND HTML image elements
                canvas = this.createSplineRecordingCanvas();
                if (!canvas) {
                    alert('Unable to create recording canvas for follow spline mode');
                    this.exportBtn.disabled = false;
                    this.exportBtn.textContent = 'Export';
                    return;
                }
                stream = canvas.captureStream(60);
                break;
                
            case 'cursor-trail':
            case 'shuffle':
                // These modes use HTML elements - need to capture frameContainer
                canvas = this.createFrameContainerCanvas();
                if (!canvas) {
                    alert('Unable to create canvas for recording HTML content');
                    this.exportBtn.disabled = false;
                    this.exportBtn.textContent = 'Export';
                    return;
                }
                stream = canvas.captureStream(60);
                break;
                
            default:
                alert('Unknown gallery mode for recording');
                this.exportBtn.disabled = false;
                this.exportBtn.textContent = 'Export';
                return;
        }
        
        // Determine format based on user preference from modal
        let supportedFormats = [];
        
        switch (this.preferredExportFormat) {
            case 'mp4':
                // Force MP4 only
                supportedFormats = [
                    'video/mp4; codecs=avc1.42E01E',
                    'video/mp4; codecs=avc1.4D401E',
                    'video/mp4; codecs=h264',
                    'video/mp4'
                ];
                break;
                
            case 'webm':
                // Force WebM only
                supportedFormats = [
                    'video/webm; codecs=vp9',
                    'video/webm; codecs=vp8',
                    'video/webm'
                ];
                break;
                
            default: // 'auto'
                // Prefer MP4, fallback to WebM
                supportedFormats = [
                    'video/mp4; codecs=avc1.42E01E',
                    'video/mp4; codecs=avc1.4D401E',
                    'video/mp4; codecs=h264',
                    'video/mp4',
                    'video/webm; codecs=vp9',
                    'video/webm; codecs=vp8',
                    'video/webm'
                ];
                break;
        }
        
        let selectedFormat = null;
        for (const format of supportedFormats) {
            if (MediaRecorder.isTypeSupported(format)) {
                selectedFormat = format;
                console.log('Selected recording format:', format);
                break;
            }
        }
        
        if (!selectedFormat) {
            alert('Your browser does not support video recording. Please try a different browser.');
            this.exportBtn.disabled = false;
            this.exportBtn.textContent = 'Export';
            return;
        }
        
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: selectedFormat
        });
        
        const chunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            // Clean up recording intervals based on mode
            if (this.currentPreset === 'cursor-trail' || this.currentPreset === 'shuffle') {
                this.stopFrameContainerRecording();
            } else if (this.currentPreset === 'follow-spline') {
                this.stopSplineRecording();
            } else if (this.currentPreset === 'ring') {
                this.stopRingRecording();
            }
            
            const isMP4 = selectedFormat.includes('mp4');
            const blob = new Blob(chunks, { 
                type: isMP4 ? 'video/mp4' : 'video/webm' 
            });
            
            if (isMP4) {
                // Direct MP4 download - no conversion needed!
                console.log('MP4 recorded natively, downloading directly');
                this.downloadMP4(blob);
            } else {
                // WebM recorded, always convert to MP4 (especially for follow-spline mode)
                console.log('WebM recorded, converting to MP4 for better compatibility');
                this.convertToMP4(blob);
            }
        };
        
        mediaRecorder.start();
        
        // Stop recording after specified duration
        setTimeout(() => {
            mediaRecorder.stop();
        }, duration * 1000);
    }
    
    async initFFmpeg() {
        try {
            // Check if FFmpeg is available in global scope
            if (typeof window.FFmpeg === 'undefined') {
                console.warn('FFmpeg not found in global scope - MP4 conversion will not be available');
                this.ffmpegLoaded = false;
                return;
            }
            
            const { FFmpeg } = window.FFmpeg;
            const { fetchFile } = window.FFmpegUtil;
            
            this.ffmpeg = new FFmpeg();
            
            this.ffmpeg.on('log', ({ message }) => {
                console.log('FFmpeg:', message);
            });
            
            this.ffmpeg.on('progress', ({ progress }) => {
                console.log('FFmpeg progress:', Math.round(progress * 100) + '%');
            });
            
            console.log('Loading FFmpeg core files...');
            
            // Load FFmpeg core with timeout
            const loadPromise = this.ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
                wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
            });
            
            // Set a 15-second timeout for loading FFmpeg
            await Promise.race([
                loadPromise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('FFmpeg loading timeout after 15 seconds')), 15000)
                )
            ]);
            
            this.ffmpegLoaded = true;
            console.log('✅ FFmpeg loaded successfully - MP4 conversion available');
        } catch (error) {
            console.warn('⚠️ FFmpeg loading failed:', error.message);
            console.log('📝 MP4 conversion will not be available, but native MP4 recording may still work');
            this.ffmpegLoaded = false;
        }
    }
    
    async convertToMP4(webmBlob) {
        console.log('convertToMP4 called, ffmpegLoaded:', this.ffmpegLoaded);
        
        if (!this.ffmpegLoaded) {
            if (this.currentPreset === 'follow-spline') {
                console.error('FFmpeg required for follow-spline MP4 conversion but not loaded');
                
                // Try to reload FFmpeg one more time for follow-spline mode
                console.log('Attempting to reload FFmpeg for follow-spline mode...');
                this.exportBtn.textContent = 'Retrying MP4 conversion...';
                
                await this.initFFmpeg();
                
                if (this.ffmpegLoaded) {
                    console.log('FFmpeg loaded successfully on retry, proceeding with conversion');
                    // Continue with conversion below
                } else {
                    alert('MP4 conversion requires FFmpeg to be loaded. The page may need to be refreshed to retry loading FFmpeg. Downloading as WebM for now.');
                    this.exportBtn.textContent = 'Downloading WebM (MP4 conversion failed)...';
                    this.downloadWebM(webmBlob);
                    return;
                }
            } else {
                console.log('FFmpeg not loaded, falling back to WebM download');
                this.exportBtn.textContent = 'Downloading WebM...';
                this.downloadWebM(webmBlob);
                return;
            }
        }
        
        try {
            this.exportBtn.textContent = 'Converting to MP4... (0%)';
            console.log('Starting WebM to MP4 conversion...');
            
            // Convert blob to array buffer
            const arrayBuffer = await webmBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            console.log('WebM blob size:', (uint8Array.length / 1024 / 1024).toFixed(2) + 'MB');
            
            // Update progress
            this.exportBtn.textContent = 'Converting to MP4... (25%)';
            
            // Write input file to FFmpeg's virtual file system
            await this.ffmpeg.writeFile('input.webm', uint8Array);
            console.log('Input file written to FFmpeg filesystem');
            
            // Update progress
            this.exportBtn.textContent = 'Converting to MP4... (50%)';
            
            // Convert WebM to MP4 with H.264 codec
            console.log('Starting FFmpeg conversion with optimized settings...');
            await this.ffmpeg.exec([
                '-i', 'input.webm',
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '23',
                '-pix_fmt', 'yuv420p',
                '-movflags', '+faststart',  // Optimize for web playback
                'output.mp4'
            ]);
            
            console.log('FFmpeg conversion completed');
            
            // Update progress
            this.exportBtn.textContent = 'Converting to MP4... (75%)';
            
            // Read the output file
            const data = await this.ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
            console.log('MP4 blob created, size:', (mp4Blob.size / 1024 / 1024).toFixed(2) + 'MB');
            
            // Update progress
            this.exportBtn.textContent = 'Downloading MP4...';
            
            // Download the MP4 file using the dedicated function
            this.downloadMP4(mp4Blob);
            
            // Clean up files from FFmpeg virtual filesystem
            try {
                await this.ffmpeg.deleteFile('input.webm');
                await this.ffmpeg.deleteFile('output.mp4');
                console.log('Temporary files cleaned up');
            } catch (cleanupError) {
                console.warn('Cleanup warning:', cleanupError.message);
            }
            
        } catch (error) {
            console.error('MP4 conversion failed:', error);
            
            // Provide specific error messages
            let errorMessage = 'MP4 conversion failed';
            if (error.message.includes('timeout')) {
                errorMessage = 'Conversion timed out - the video might be too large';
            } else if (error.message.includes('memory')) {
                errorMessage = 'Not enough memory for conversion';
            } else if (error.message.includes('codec')) {
                errorMessage = 'Video codec issue during conversion';
            }
            
            if (this.currentPreset === 'follow-spline') {
                alert(errorMessage + '. Note: Follow Spline mode works best with MP4 format. You may want to try again or use an online WebM to MP4 converter. Downloading as WebM for now.');
            } else {
                alert(errorMessage + '. Downloading as WebM instead.');
            }
            this.downloadWebM(webmBlob);
        }
    }
    
    downloadWebM(webmBlob) {
        const url = URL.createObjectURL(webmBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gallery-animation-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Re-enable export button
        this.exportBtn.disabled = false;
        this.exportBtn.textContent = 'Export';
        
        if (this.currentPreset === 'follow-spline') {
            alert('Video exported as WebM format. For best results with Follow Spline mode, try refreshing the page and exporting again to enable MP4 conversion. You can also use online converters like CloudConvert or HandBrake to convert WebM to MP4.');
        } else {
            alert('Video exported as WebM format. For MP4 conversion, you can use online converters or video editing software.');
        }
    }
    
    downloadMP4(mp4Blob) {
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gallery-animation-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Re-enable export button
        this.exportBtn.disabled = false;
        this.exportBtn.textContent = 'Export';
        
        console.log('✅ MP4 file downloaded successfully');
    }

    async exportPNGSequence(durationSeconds) {
        try {
            // Disable export button during capture
            this.exportBtn.disabled = true;
            this.exportBtn.textContent = 'Exporting PNGs...';

            const fps = 60;
            const totalFrames = Math.round(durationSeconds * fps);

            // Prepare a render source depending on mode
            // No need for a persistent capture canvas; we use an offscreen per frame
            let cleanups = [];

            const frameSize = this.getFrameSize();

            const createOffscreenCanvas = () => {
                const c = document.createElement('canvas');
                c.width = frameSize.width;
                c.height = frameSize.height;
                return c;
            };

            // Helper to draw current frame into a canvas honoring alpha/bg
            const drawFrameToCanvas = (targetCtx) => {
                // Clear
                targetCtx.clearRect(0, 0, frameSize.width, frameSize.height);
                
                // Draw background image if present, otherwise use color
                if (this.backgroundImageDataUrl) {
                    const img = this.backgroundImageElement || new Image();
                    if (!this.backgroundImageElement) {
                        img.src = this.backgroundImageDataUrl;
                        this.backgroundImageElement = img;
                    }
                    if (img.complete) {
                        const sw = img.width;
                        const sh = img.height;
                        const dw = frameSize.width;
                        const dh = frameSize.height;
                        const sRatio = sw / sh;
                        const dRatio = dw / dh;
                        let drawW, drawH;
                        if (sRatio > dRatio) {
                            drawH = dh;
                            drawW = dh * sRatio;
                        } else {
                            drawW = dw;
                            drawH = dw / sRatio;
                        }
                        const dx = (dw - drawW) / 2;
                        const dy = (dh - drawH) / 2;
                        targetCtx.drawImage(img, dx, dy, drawW, drawH);
                    }
                } else if (!this.isAlphaBackground) {
                    // If no background image and not alpha, paint background color
                    const color = this.currentBackgroundColor || '#121212';
                    targetCtx.fillStyle = color;
                    targetCtx.fillRect(0, 0, frameSize.width, frameSize.height);
                }

                switch (this.currentPreset) {
                    case 'ring': {
                        // Render Three.js to an offscreen then draw
                        // Ensure renderer is correct size
                        const prevPixelRatio = this.renderer.getPixelRatio ? this.renderer.getPixelRatio() : 1;
                        this.renderer.setSize(frameSize.width, frameSize.height, false);
                        if (this.renderer.setPixelRatio) this.renderer.setPixelRatio(1);
                        this.renderer.render(this.scene, this.camera);
                        targetCtx.drawImage(this.renderer.domElement, 0, 0);
                        // Restore pixel ratio
                        if (this.renderer.setPixelRatio) this.renderer.setPixelRatio(prevPixelRatio);
                        break;
                    }
                    case 'follow-spline': {
                        // Do NOT draw the green guide line; only draw images
                        // Optionally draw placeholder when nothing is present
                        if ((!this.currentSpline || this.currentSpline.length < 2) && 
                            (!this.splinePoints || this.splinePoints.length < 2) && 
                            this.imageElements2D.length === 0) {
                            this.drawSplinePlaceholderOnCanvas(targetCtx);
                        }
                        // Draw animated images
                        this.drawSplineImagesOnCanvas(targetCtx, frameSize);
                        break;
                    }
                    case 'cursor-trail':
                    case 'shuffle': {
                        // Draw DOM images positions into target
                        this.drawImagesOnCanvas(targetCtx, frameSize);
                        break;
                    }
                    default:
                        break;
                }
                
                // Draw foreground overlay if present (on top of everything)
                if (this.foregroundImageDataUrl) {
                    const img = this.foregroundImageElement || new Image();
                    if (!this.foregroundImageElement) {
                        img.src = this.foregroundImageDataUrl;
                        this.foregroundImageElement = img;
                    }
                    if (img.complete) {
                        const sw = img.width;
                        const sh = img.height;
                        const dw = frameSize.width;
                        const dh = frameSize.height;
                        const sRatio = sw / sh;
                        const dRatio = dw / dh;
                        let drawW, drawH;
                        if (sRatio > dRatio) {
                            drawH = dh;
                            drawW = dh * sRatio;
                        } else {
                            drawW = dw;
                            drawH = dw / sRatio;
                        }
                        const dx = (dw - drawW) / 2;
                        const dy = (dh - drawH) / 2;
                        targetCtx.drawImage(img, dx, dy, drawW, drawH);
                    }
                }
            };

            // Create a zip
            const zip = new JSZip();

            // Drive deterministic stepping per frame
            // For ring: increment rotation by speed per frame and render
            // For spline: step splineAnimationDistance deterministically

            // Cache starting values to restore later
            const savedRotationY = this.rotationGroup ? this.rotationGroup.rotation.y : 0;
            const savedSplineDistance = this.splineAnimationDistance;
            const savedSpeed = this.currentSpeed;
            const savedSplineSpeed = this.splineAnimationSpeed;
            const wasAnimatingSpline = !!this.splineAnimationId;

            // Pause spline rAF-driven animation to avoid double-stepping
            if (wasAnimatingSpline) {
                cancelAnimationFrame(this.splineAnimationId);
                this.splineAnimationId = null;
            }
            // Prevent ring animate loop from rotating during capture
            this.currentSpeed = 0;

            // Use fixed step independent of rAF
            for (let i = 0; i < totalFrames; i++) {
                // Step animations deterministically
                if (this.currentPreset === 'ring') {
                    // Rotate by degrees per frame, convert to radians
                    const deltaRad = THREE.MathUtils.degToRad(savedSpeed);
                    this.rotationGroup.rotateY(deltaRad);
                    this.updateImagePositions();
                } else if (this.currentPreset === 'follow-spline') {
                    if (this.splineCumulativeDistances) {
                        const totalDistance = this.splineCumulativeDistances[this.splineCumulativeDistances.length - 1] || 0;
                        this.splineAnimationDistance += savedSplineSpeed;
                        if (totalDistance > 0 && this.splineAnimationDistance > totalDistance) {
                            this.splineAnimationDistance = 0;
                        }
                        // Reposition elements to reflect new distance
                        const imagesWithPosition = [];
                        this.imageElements2D.forEach((element) => {
                            const offset = element.userData.animationOffset;
                            let currentDistance = totalDistance > 0 ? (this.splineAnimationDistance + offset) % totalDistance : 0;
                            let t = totalDistance > 0 ? currentDistance / totalDistance : 0;
                            const pos = this.getSplinePosition(t);
                            element.style.left = (pos.x - element.offsetWidth / 2) + 'px';
                            element.style.top = (pos.y - element.offsetHeight / 2) + 'px';
                            imagesWithPosition.push({ img: element, t });
                        });
                        imagesWithPosition.sort((a, b) => a.t - b.t);
                        imagesWithPosition.forEach((item, index) => {
                            item.img.style.zIndex = (10 + index).toString();
                        });
                    }
                }

                // Compose frame into offscreen
                const offscreen = createOffscreenCanvas();
                const ctx = offscreen.getContext('2d');
                drawFrameToCanvas(ctx);

                // Encode PNG
                const blob = await new Promise((resolve) => offscreen.toBlob(resolve, 'image/png'));
                const arrayBuffer = await blob.arrayBuffer();
                const uint8 = new Uint8Array(arrayBuffer);
                const filename = `svgallery_${String(i).padStart(4, '0')}.png`;
                zip.file(filename, uint8);
            }

            // Restore states
            if (this.rotationGroup) this.rotationGroup.rotation.y = savedRotationY;
            this.splineAnimationDistance = savedSplineDistance;
            this.currentSpeed = savedSpeed;
            if (wasAnimatingSpline) {
                this.splineAnimationId = requestAnimationFrame(() => this.animate2DImages());
            }

            // Generate zip
            this.exportBtn.textContent = 'Zipping...';
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            // Download zip
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `svgallery_frames_${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.exportBtn.disabled = false;
            this.exportBtn.textContent = 'Export';
        } catch (err) {
            console.error('PNG sequence export failed:', err);
            alert('PNG sequence export failed: ' + err.message);
            this.exportBtn.disabled = false;
            this.exportBtn.textContent = 'Export';
        }
    }
    
    createFrameContainerCanvas() {
        try {
            // Create a canvas to capture HTML elements
            const recordingCanvas = document.createElement('canvas');
            const ctx = recordingCanvas.getContext('2d');
            
            // Use actual frame size, not visual zoomed size
            const frameSize = this.getFrameSize();
            recordingCanvas.width = frameSize.width;
            recordingCanvas.height = frameSize.height;
            
            console.log('Created recording canvas at original resolution:', recordingCanvas.width + 'x' + recordingCanvas.height);
            
            // Create a function to continuously update this canvas
            const updateCanvas = () => {
                // Clear canvas
                ctx.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                
                // Fill background color unless alpha background is enabled or a background image is used
                if (!this.isAlphaBackground && !this.backgroundImageDataUrl) {
                    const bgColorPicker = document.getElementById('backgroundColorPicker');
                    const bgColor = bgColorPicker ? bgColorPicker.value : '#121212';
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                }
                // If a background image is used, draw it to fill canvas
                if (this.backgroundImageDataUrl) {
                    const img = this.backgroundImageElement || new Image();
                    if (!this.backgroundImageElement) {
                        img.src = this.backgroundImageDataUrl;
                        this.backgroundImageElement = img;
                    }
                    if (img.complete) {
                        const sw = img.width;
                        const sh = img.height;
                        const dw = recordingCanvas.width;
                        const dh = recordingCanvas.height;
                        const sRatio = sw / sh;
                        const dRatio = dw / dh;
                        let drawW, drawH;
                        if (sRatio > dRatio) {
                            drawH = dh;
                            drawW = dh * sRatio;
                        } else {
                            drawW = dw;
                            drawH = dw / sRatio;
                        }
                        const dx = (dw - drawW) / 2;
                        const dy = (dh - drawH) / 2;
                        ctx.drawImage(img, dx, dy, drawW, drawH);
                    }
                }
                
                // Draw all image elements at original resolution
                this.drawImagesOnCanvas(ctx, frameSize);
                
                // Draw foreground overlay if present
                if (this.foregroundImageDataUrl) {
                    const img = this.foregroundImageElement || new Image();
                    if (!this.foregroundImageElement) {
                        img.src = this.foregroundImageDataUrl;
                        this.foregroundImageElement = img;
                    }
                    if (img.complete) {
                        const sw = img.width;
                        const sh = img.height;
                        const dw = recordingCanvas.width;
                        const dh = recordingCanvas.height;
                        const sRatio = sw / sh;
                        const dRatio = dw / dh;
                        let drawW, drawH;
                        if (sRatio > dRatio) {
                            drawH = dh;
                            drawW = dh * sRatio;
                        } else {
                            drawW = dw;
                            drawH = dw / sRatio;
                        }
                        const dx = (dw - drawW) / 2;
                        const dy = (dh - drawH) / 2;
                        ctx.drawImage(img, dx, dy, drawW, drawH);
                    }
                }
            };
            
            // Start continuous updates for recording
            this.recordingUpdateInterval = setInterval(updateCanvas, 1000/30); // 30 FPS
            
            // Initial update
            updateCanvas();
            
            return recordingCanvas;
            
        } catch (error) {
            console.error('Failed to create frameContainer canvas:', error);
            return null;
        }
    }
    
    // Helper function to convert DOM element position to export canvas coordinates
    convertDOMToExportCoordinates(imgRect, frameSize) {
        const containerRect = this.frameContainer.getBoundingClientRect();
        
        // Calculate actual frame dimensions (accounting for responsive constraints)
        const actualFrameWidth = containerRect.width / this.currentZoom;
        const actualFrameHeight = containerRect.height / this.currentZoom;
        
        // Calculate zoom transform centering offsets
        const visualWidth = actualFrameWidth * this.currentZoom;
        const visualHeight = actualFrameHeight * this.currentZoom;
        const zoomOffsetX = (containerRect.width - visualWidth) / 2;
        const zoomOffsetY = (containerRect.height - visualHeight) / 2;
        
        // Get visual position relative to container
        const relativeX = imgRect.left - containerRect.left;
        const relativeY = imgRect.top - containerRect.top;
        
        // Adjust for zoom transform centering
        const visualX = relativeX - zoomOffsetX;
        const visualY = relativeY - zoomOffsetY;
        
        // Convert to actual canvas coordinates
        const canvasX = visualX / this.currentZoom;
        const canvasY = visualY / this.currentZoom;
        const canvasWidth = imgRect.width / this.currentZoom;
        const canvasHeight = imgRect.height / this.currentZoom;
        
        // Scale coordinates to export frame dimensions if they differ from actual frame
        const scaleX = frameSize.width / actualFrameWidth;
        const scaleY = frameSize.height / actualFrameHeight;
        
        return {
            x: canvasX * scaleX,
            y: canvasY * scaleY,
            width: canvasWidth * scaleX,
            height: canvasHeight * scaleY
        };
    }

    drawImagesOnCanvas(ctx, frameSize) {
        // Get all image elements within frameContainer
        const nodeList = this.frameContainer.querySelectorAll('img');
        const images = Array.from(nodeList).filter(img => img.style.display !== 'none');

        // Sort by computed z-index ascending so we paint back-to-front
        images.sort((a, b) => {
            const za = parseInt(window.getComputedStyle(a).zIndex || '0', 10) || 0;
            const zb = parseInt(window.getComputedStyle(b).zIndex || '0', 10) || 0;
            if (za === zb) return 0; // keep DOM order for ties
            return za - zb;
        });

        images.forEach(img => {
            try {
                const imgRect = img.getBoundingClientRect();
                
                // Use the new coordinate conversion function
                const coords = this.convertDOMToExportCoordinates(imgRect, frameSize);

                // Only draw if image is within frame bounds
                if (coords.x < frameSize.width && coords.y < frameSize.height &&
                    coords.x + coords.width > 0 && coords.y + coords.height > 0) {
                    ctx.drawImage(img, coords.x, coords.y, coords.width, coords.height);
                }
            } catch (drawError) {
                console.warn('Could not draw image to canvas:', drawError.message);
            }
        });
    }
    
    stopFrameContainerRecording() {
        if (this.recordingUpdateInterval) {
            clearInterval(this.recordingUpdateInterval);
            this.recordingUpdateInterval = null;
        }
    }
    
    createSplineRecordingCanvas() {
        try {
            // Create a canvas to capture spline + animated images
            const recordingCanvas = document.createElement('canvas');
            const ctx = recordingCanvas.getContext('2d');
            
            // Use actual frame size, not visual zoomed size
            const frameSize = this.getFrameSize();
            recordingCanvas.width = frameSize.width;
            recordingCanvas.height = frameSize.height;
            
            console.log('Created spline recording canvas at original resolution:', recordingCanvas.width + 'x' + recordingCanvas.height);
            
            // Create a function to continuously update this canvas
            const updateCanvas = () => {
                // Clear canvas
                ctx.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                
                // Fill background color unless alpha background is enabled or a background image is used
                if (!this.isAlphaBackground && !this.backgroundImageDataUrl) {
                    const bgColorPicker = document.getElementById('backgroundColorPicker');
                    const bgColor = bgColorPicker ? bgColorPicker.value : '#121212';
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                }
                // If a background image is used, draw it to fill canvas
                if (this.backgroundImageDataUrl) {
                    const img = this.backgroundImageElement || new Image();
                    if (!this.backgroundImageElement) {
                        img.src = this.backgroundImageDataUrl;
                        this.backgroundImageElement = img;
                    }
                    if (img.complete) {
                        const sw = img.width;
                        const sh = img.height;
                        const dw = recordingCanvas.width;
                        const dh = recordingCanvas.height;
                        const sRatio = sw / sh;
                        const dRatio = dw / dh;
                        let drawW, drawH;
                        if (sRatio > dRatio) {
                            drawH = dh;
                            drawW = dh * sRatio;
                        } else {
                            drawW = dw;
                            drawH = dw / sRatio;
                        }
                        const dx = (dw - drawW) / 2;
                        const dy = (dh - drawH) / 2;
                        ctx.drawImage(img, dx, dy, drawW, drawH);
                    }
                }
                
                // Note: We don't draw the spline line in the recording - only the animated images
                // The green guide line is only for editing, not for the final video output
                
                // Only draw placeholder if no spline exists and no images
                if ((!this.currentSpline || this.currentSpline.length < 2) && 
                    (!this.splinePoints || this.splinePoints.length < 2) && 
                    this.imageElements2D.length === 0) {
                    this.drawSplinePlaceholderOnCanvas(ctx);
                }
                
                // Draw all animated image elements at original resolution
                this.drawSplineImagesOnCanvas(ctx, frameSize);
                
                // Draw foreground overlay if present
                if (this.foregroundImageDataUrl) {
                    const img = this.foregroundImageElement || new Image();
                    if (!this.foregroundImageElement) {
                        img.src = this.foregroundImageDataUrl;
                        this.foregroundImageElement = img;
                    }
                    if (img.complete) {
                        const sw = img.width;
                        const sh = img.height;
                        const dw = recordingCanvas.width;
                        const dh = recordingCanvas.height;
                        const sRatio = sw / sh;
                        const dRatio = dw / dh;
                        let drawW, drawH;
                        if (sRatio > dRatio) {
                            drawH = dh;
                            drawW = dh * sRatio;
                        } else {
                            drawW = dw;
                            drawH = dw / sRatio;
                        }
                        const dx = (dw - drawW) / 2;
                        const dy = (dh - drawH) / 2;
                        ctx.drawImage(img, dx, dy, drawW, drawH);
                    }
                }
            };
            
            // Start continuous updates for recording
            this.splineRecordingUpdateInterval = setInterval(updateCanvas, 1000/30); // 30 FPS
            
            // Initial update
            updateCanvas();
            
            return recordingCanvas;
            
        } catch (error) {
            console.error('Failed to create spline recording canvas:', error);
            return null;
        }
    }

    createRingRecordingCanvas() {
        try {
            // Create a canvas to capture Three.js ring mode at proper size
            const recordingCanvas = document.createElement('canvas');
            const ctx = recordingCanvas.getContext('2d');
            
            // Use configured frame size to match PNG sequence export behavior
            const frameSize = this.getFrameSize();
            recordingCanvas.width = frameSize.width;
            recordingCanvas.height = frameSize.height;
            
            console.log('Created ring recording canvas at original resolution:', recordingCanvas.width + 'x' + recordingCanvas.height);
            
            // Store original renderer settings to restore later
            const originalSize = {
                width: this.renderer.domElement.width,
                height: this.renderer.domElement.height
            };
            const originalPixelRatio = this.renderer.getPixelRatio();
            
            // Create a function to continuously update this canvas
            const updateCanvas = () => {
                // Clear canvas
                ctx.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                
                // Draw background if not alpha mode
                if (!this.isAlphaBackground) {
                    if (this.backgroundImageDataUrl) {
                        // Draw background image
                        const img = this.backgroundImageElement || new Image();
                        if (!this.backgroundImageElement) {
                            img.src = this.backgroundImageDataUrl;
                            this.backgroundImageElement = img;
                        }
                        if (img.complete) {
                            const sw = img.width;
                            const sh = img.height;
                            const dw = recordingCanvas.width;
                            const dh = recordingCanvas.height;
                            const sRatio = sw / sh;
                            const dRatio = dw / dh;
                            let drawW, drawH;
                            if (sRatio > dRatio) {
                                drawH = dh;
                                drawW = dh * sRatio;
                            } else {
                                drawW = dw;
                                drawH = dw / sRatio;
                            }
                            const dx = (dw - drawW) / 2;
                            const dy = (dh - drawH) / 2;
                            ctx.drawImage(img, dx, dy, drawW, drawH);
                        }
                    } else {
                        // Draw background color
                        const bgColor = this.currentBackgroundColor || '#121212';
                        ctx.fillStyle = bgColor;
                        ctx.fillRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                    }
                }
                
                // Temporarily resize renderer to match recording canvas
                this.renderer.setSize(frameSize.width, frameSize.height, false);
                this.renderer.setPixelRatio(1);
                
                // Update camera aspect ratio for recording resolution (matches PNG sequence export)
                this.camera.aspect = frameSize.width / frameSize.height;
                this.camera.updateProjectionMatrix();
                
                // Render Three.js scene
                this.renderer.render(this.scene, this.camera);
                
                // Draw the Three.js canvas onto our recording canvas
                ctx.drawImage(this.renderer.domElement, 0, 0);
                
                // Draw foreground overlay if present
                if (this.foregroundImageDataUrl) {
                    const img = this.foregroundImageElement || new Image();
                    if (!this.foregroundImageElement) {
                        img.src = this.foregroundImageDataUrl;
                        this.foregroundImageElement = img;
                    }
                    if (img.complete) {
                        const sw = img.width;
                        const sh = img.height;
                        const dw = recordingCanvas.width;
                        const dh = recordingCanvas.height;
                        const sRatio = sw / sh;
                        const dRatio = dw / dh;
                        let drawW, drawH;
                        if (sRatio > dRatio) {
                            drawH = dh;
                            drawW = dh * sRatio;
                        } else {
                            drawW = dw;
                            drawH = dw / sRatio;
                        }
                        const dx = (dw - drawW) / 2;
                        const dy = (dh - drawH) / 2;
                        ctx.drawImage(img, dx, dy, drawW, drawH);
                    }
                }
            };
            
            // Start continuous updates for recording at 60 FPS
            this.ringRecordingUpdateInterval = setInterval(updateCanvas, 1000/60);
            
            // Store cleanup function to restore renderer settings
            this.ringRecordingCleanup = () => {
                if (this.ringRecordingUpdateInterval) {
                    clearInterval(this.ringRecordingUpdateInterval);
                    this.ringRecordingUpdateInterval = null;
                }
                
                // Restore original renderer settings
                this.renderer.setSize(originalSize.width, originalSize.height, false);
                this.renderer.setPixelRatio(originalPixelRatio);
                
                // Restore camera aspect ratio for display
                const displayFrameSize = this.getFrameSize();
                this.camera.aspect = displayFrameSize.width / displayFrameSize.height;
                this.camera.updateProjectionMatrix();
            };
            
            // Initial update
            updateCanvas();
            
            return recordingCanvas;
            
        } catch (error) {
            console.error('Failed to create ring recording canvas:', error);
            return null;
        }
    }
    
    drawSplineOnRecordingCanvas(ctx) {
        if (!this.currentSpline || this.currentSpline.length < 2) return;
        
        // Draw the spline line
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.currentSpline[0].x, this.currentSpline[0].y);
        
        // Draw smooth curve through points
        for (let i = 1; i < this.currentSpline.length; i++) {
            ctx.lineTo(this.currentSpline[i].x, this.currentSpline[i].y);
        }
        
        ctx.stroke();
    }
    
    drawSplineImagesOnCanvas(ctx, frameSize) {
        // Get all image elements for spline mode
        const images = this.imageElements2D.filter(img => img.style.display !== 'none');

        // Sort by computed z-index ascending so we paint back-to-front
        images.sort((a, b) => {
            const za = parseInt(window.getComputedStyle(a).zIndex || '0', 10) || 0;
            const zb = parseInt(window.getComputedStyle(b).zIndex || '0', 10) || 0;
            if (za === zb) return 0; // keep DOM order for ties
            return za - zb;
        });

        images.forEach(img => {
            try {
                const imgRect = img.getBoundingClientRect();
                
                // Use the same coordinate conversion function
                const coords = this.convertDOMToExportCoordinates(imgRect, frameSize);

                // Only draw if image is within frame bounds
                if (coords.x < frameSize.width && coords.y < frameSize.height &&
                    coords.x + coords.width > 0 && coords.y + coords.height > 0) {
                    ctx.drawImage(img, coords.x, coords.y, coords.width, coords.height);
                }
            } catch (drawError) {
                console.warn('Could not draw spline image to canvas:', drawError.message);
            }
        });
    }
    
    stopSplineRecording() {
        if (this.splineRecordingUpdateInterval) {
            clearInterval(this.splineRecordingUpdateInterval);
            this.splineRecordingUpdateInterval = null;
        }
    }

    stopRingRecording() {
        if (this.ringRecordingCleanup) {
            this.ringRecordingCleanup();
            this.ringRecordingCleanup = null;
        }
    }
    
    drawSplineFromPoints(ctx, points) {
        if (!points || points.length < 2) return;
        
        // Draw the spline line
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        // Draw smooth curve through points
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
    }
    
    drawSplinePlaceholderOnCanvas(ctx) {
        // Draw centered text instruction
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Set text properties
        ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw the instruction text
        ctx.fillText('Draw a spline', centerX, centerY);
    }
    
    prepareCanvasForRecording() {
        if (!this.canvas2D || !this.ctx2D) return;
        
        console.log('Preparing 2D canvas for recording...');
        
        // Force a specific pixel format that's compatible with video codecs
        const imageData = this.ctx2D.getImageData(0, 0, this.canvas2D.width, this.canvas2D.height);
        
        // Ensure we have a solid background by redrawing it
        this.clearCanvas();
        
        // If there's a spline, redraw it
        if (this.splinePoints.length > 0) {
            this.currentSpline = [...this.splinePoints];
            this.drawSpline();
        } else {
            // If no spline, draw the placeholder
            this.drawSplinePlaceholder();
        }
        
        // Add a slight border to ensure the canvas has defined content
        this.ctx2D.strokeStyle = 'rgba(255, 255, 255, 0.01)'; // Almost invisible border
        this.ctx2D.lineWidth = 1;
        this.ctx2D.strokeRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        
        // Force canvas to be opaque (remove any transparency issues)
        this.ctx2D.globalCompositeOperation = 'source-over';
        
        console.log('Canvas prepared for recording:', this.canvas2D.width + 'x' + this.canvas2D.height);
    }
    
    addLighting() {
        // Remove lighting since images use MeshBasicMaterial (unlit)
        // Only add minimal ambient light for other scene elements if needed
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // STEP 1: Automatic Y rotation (continuous spin)
        this.rotationGroup.rotateY(THREE.MathUtils.degToRad(this.currentSpeed));
        
        // STEP 2: Calculate image positions (static, no animation)
        this.updateImagePositions();
        
        // STEP 3: Update placeholder position if it exists
        this.updatePlaceholderPosition();
        
        // STEP 4: Camera in fixed position (no automatic rotation)
        // Camera stays at fixed position set in initThreeJS
        
        this.renderer.render(this.scene, this.camera);
    }
    
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
                this.currentSpline = [...this.splinePoints];
                this.drawSpline();
            }
        }
        
        // Handle shuffle images resize - reposition them within new bounds
        if (this.currentPreset === 'shuffle') {
            if (this.shuffleImages.length > 0) {
                this.repositionShuffleImagesWithinBounds();
            } else if (this.shufflePlaceholder) {
                // Reposition placeholder if it exists
                this.removeShufflePlaceholder();
                this.showShufflePlaceholder();
            }
        }
    }
    
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
        
        console.log(`Frame size updated to: ${clampedWidth}x${clampedHeight}`);
    }
    
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
        
        // Check if we need to scale down to fit available space
        if (targetWidth > availableWidth || targetHeight > availableHeight) {
            // Calculate scale factors for both dimensions
            const widthScale = availableWidth / targetWidth;
            const heightScale = availableHeight / targetHeight;
            
            // Use the more restrictive scale factor to preserve aspect ratio
            const scale = Math.min(widthScale, heightScale);
            
            constrainedWidth = targetWidth * scale;
            constrainedHeight = targetHeight * scale;
        }
        
        // Apply the constraints as CSS properties on the frame container
        this.frameContainer.style.maxWidth = `${constrainedWidth}px`;
        this.frameContainer.style.maxHeight = `${constrainedHeight}px`;
        
        console.log(`Applied responsive constraints: ${Math.round(constrainedWidth)}x${Math.round(constrainedHeight)} (aspect ratio: ${aspectRatio.toFixed(2)})`);
    }
    
    // Method to programmatically set frame size (useful for future extensions)
    setFrameSize(width, height) {
        this.widthInput.value = width;
        this.heightInput.value = height;
        this.applyFrameSize();
    }
    
    // Method to get current frame size
    getFrameSize() {
        return {
            width: parseInt(this.widthInput.value) || 800,
            height: parseInt(this.heightInput.value) || 600
        };
    }
    
    // Cleanup method
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.shuffleTimeout) {
            clearTimeout(this.shuffleTimeout);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Cleanup uploaded images and textures
        this.imagePlanes.forEach(plane => {
            if (plane.geometry) plane.geometry.dispose();
            if (plane.material) {
                if (plane.material.map) plane.material.map.dispose();
                plane.material.dispose();
            }
        });
        
        // Cleanup shuffle images
        this.clearShuffleImages();
    }
    
    updateImageScales() {
        this.imagePlanes.forEach(plane => {
            const originalSize = plane.userData.originalSize;
            if (originalSize) {
                const aspectRatio = originalSize.width / originalSize.height;
                if (aspectRatio > 1) {
                    // Landscape
                    plane.scale.set(this.currentScale, this.currentScale / aspectRatio, 1);
                } else {
                    // Portrait
                    plane.scale.set(this.currentScale * aspectRatio, this.currentScale, 1);
                }
            }
        });
    }
    
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
        
        // Clear and set background, show instruction text if no spline exists (only for follow-spline mode)
        if (this.currentPreset === 'follow-spline' && this.splinePoints.length === 0) {
            this.drawSplinePlaceholder();
        } else {
            this.clearCanvas();
        }
    }
    
    createImagesAlongSpline() {
        // Prevent multiple simultaneous recreations
        if (this.isRecreatingImages) {
            return;
        }
        
        this.isRecreatingImages = true;
        
        // Stop any existing animation
        if (this.splineAnimationId) {
            cancelAnimationFrame(this.splineAnimationId);
            this.splineAnimationId = null;
        }
        
        if (this.splinePoints.length < 2) {
            // Clear images if no spline
            this.clear2DImages();
            this.isRecreatingImages = false;
            return;
        }
        
        // Ensure distances are calculated
        if (!this.splineCumulativeDistances) {
            this.calculateSplineDistances();
        }
        
        const totalDistance = this.splineCumulativeDistances[this.splineCumulativeDistances.length - 1];
        
        // Store old images for cleanup
        const oldImages = [...this.imageElements2D];
        this.imageElements2D = [];
        
        if (this.uploadedImages.length === 0) {
            // No images to display along spline
            // The instruction text will be handled by other methods
        } else {
            // Calculate number of duplicates based on density
            // Higher density = more duplicates (1 = few, 10 = lots)
            const duplicatesPerImage = this.splineImageDensity;
            const totalImages = this.uploadedImages.length * duplicatesPerImage;
            
            let imageIndex = 0;
            
            // Create images by cycling through the array (0,1,2,3,0,1,2,3...)
            for (let duplicate = 0; duplicate < duplicatesPerImage; duplicate++) {
                for (let originalIndex = 0; originalIndex < this.uploadedImages.length; originalIndex++) {
                    const imageData = this.uploadedImages[originalIndex];
                    this.create2DImageElement(imageData, imageIndex, totalImages, totalDistance);
                    imageIndex++;
                }
            }
        }
        
        // Use requestAnimationFrame for smooth cleanup
        requestAnimationFrame(() => {
            // Remove old images after new ones are rendered
            oldImages.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            
            // Allow new recreations
            this.isRecreatingImages = false;
            
            // Start single animation loop
            this.animate2DImages();
            
            // Clear the canvas to remove the green guide line
            this.clearCanvas();
        });
    }
    
    create2DImageElement(imageData, index, totalImages, totalDistance) {
        const img = document.createElement('img');
        img.src = imageData.dataUrl;
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.zIndex = '10';
        
        // Set initial size (we'll scale based on splineImageScale)
        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const baseSize = 60; // Base size in pixels
            const scaledSize = baseSize * this.splineImageScale;
            
            if (aspectRatio > 1) {
                // Landscape
                img.style.width = scaledSize + 'px';
                img.style.height = (scaledSize / aspectRatio) + 'px';
            } else {
                // Portrait
                img.style.width = (scaledSize * aspectRatio) + 'px';
                img.style.height = scaledSize + 'px';
            }
        };
        
        img.userData = {
            imageId: imageData.id,
            index: index,
            animationOffset: (index / totalImages) * totalDistance // Spread images along spline in pixels
        };
        
        this.frameContainer.appendChild(img);
        this.imageElements2D.push(img);
    }
    
    clear2DImages() {
        // Stop animation
        if (this.splineAnimationId) {
            cancelAnimationFrame(this.splineAnimationId);
            this.splineAnimationId = null;
        }
        
        this.imageElements2D.forEach(img => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        });
        this.imageElements2D = [];
    }
    
    getSplinePosition(t) {
        // Normalize t to be between 0 and 1
        t = Math.max(0, Math.min(1, t));
        
        if (this.splinePoints.length < 2) {
            return { x: 0, y: 0 };
        }
        
        // Calculate cumulative distances if not already done
        if (!this.splineCumulativeDistances) {
            this.calculateSplineDistances();
        }
        
        // Get total distance
        const totalDistance = this.splineCumulativeDistances[this.splineCumulativeDistances.length - 1];
        const targetDistance = t * totalDistance;
        
        // Find the segment that contains our target distance
        for (let i = 0; i < this.splineCumulativeDistances.length - 1; i++) {
            const segmentStart = this.splineCumulativeDistances[i];
            const segmentEnd = this.splineCumulativeDistances[i + 1];
            
            if (targetDistance >= segmentStart && targetDistance <= segmentEnd) {
                // Linear interpolation within this segment
                const segmentDistance = segmentEnd - segmentStart;
                const segmentT = segmentDistance > 0 ? (targetDistance - segmentStart) / segmentDistance : 0;
                
                const startPoint = this.splinePoints[i];
                const endPoint = this.splinePoints[i + 1];
                
                const x = startPoint.x + (endPoint.x - startPoint.x) * segmentT;
                const y = startPoint.y + (endPoint.y - startPoint.y) * segmentT;
                
                return { x, y };
            }
        }
        
        // Fallback to last point
        const lastPoint = this.splinePoints[this.splinePoints.length - 1];
        return { x: lastPoint.x, y: lastPoint.y };
    }
    
    calculateSplineDistances() {
        this.splineCumulativeDistances = [0]; // Start with 0 distance
        
        for (let i = 1; i < this.splinePoints.length; i++) {
            const prevPoint = this.splinePoints[i - 1];
            const currPoint = this.splinePoints[i];
            
            // Calculate Euclidean distance between points
            const dx = currPoint.x - prevPoint.x;
            const dy = currPoint.y - prevPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Add to cumulative distance
            const prevCumulative = this.splineCumulativeDistances[i - 1];
            this.splineCumulativeDistances.push(prevCumulative + distance);
        }
    }
    
    animate2DImages() {
        if (this.currentPreset !== 'follow-spline' || this.imageElements2D.length === 0) {
            this.splineAnimationId = null;
            return;
        }
        
        if (!this.splineCumulativeDistances) {
            this.splineAnimationId = null;
            return;
        }
        
        const totalDistance = this.splineCumulativeDistances[this.splineCumulativeDistances.length - 1];
        
        // Update animation distance (absolute pixels)
        this.splineAnimationDistance += this.splineAnimationSpeed;
        if (this.splineAnimationDistance > totalDistance) {
            this.splineAnimationDistance = 0; // Loop the animation
        }
        
        // Array to store images with their current t values for z-index calculation
        const imagesWithPosition = [];
        
        // Update each image position
        this.imageElements2D.forEach((element, index) => {
            const offset = element.userData.animationOffset;
            let currentDistance = (this.splineAnimationDistance + offset) % totalDistance;
            let t = currentDistance / totalDistance;
            
            const position = this.getSplinePosition(t);
            
            // Position the element (centered on the spline point)
            element.style.left = (position.x - element.offsetWidth / 2) + 'px';
            element.style.top = (position.y - element.offsetHeight / 2) + 'px';
            
            // Store for z-index calculation
            imagesWithPosition.push({ img: element, t });
        });
        
        // Sort by t value and assign z-index accordingly
        // Lower t values (start of spline) get lower z-index (behind)
        // Higher t values (end of spline) get higher z-index (in front)
        imagesWithPosition.sort((a, b) => a.t - b.t);
        imagesWithPosition.forEach((item, index) => {
            item.img.style.zIndex = (10 + index).toString();
        });
        
        // Continue animation and store frame ID
        this.splineAnimationId = requestAnimationFrame(() => this.animate2DImages());
    }
    
    updateSplineImageScales() {
        this.imageElements2D.forEach(element => {
            if (element.userData && element.userData.isPlaceholder) {
                // Update placeholder size
                element.style.width = (60 * this.splineImageScale) + 'px';
                element.style.height = (45 * this.splineImageScale) + 'px';
            } else if (element.naturalWidth && element.naturalHeight) {
                // Update image size
                const aspectRatio = element.naturalWidth / element.naturalHeight;
                const baseSize = 60; // Base size in pixels
                const scaledSize = baseSize * this.splineImageScale;
                
                if (aspectRatio > 1) {
                    // Landscape
                    element.style.width = scaledSize + 'px';
                    element.style.height = (scaledSize / aspectRatio) + 'px';
                } else {
                    // Portrait
                    element.style.width = (scaledSize * aspectRatio) + 'px';
                    element.style.height = scaledSize + 'px';
                }
            }
        });
    }
    
    showPlaceholders() {
        if (this.currentPreset === 'ring') {
            this.showRingPlaceholder();
        } else if (this.currentPreset === 'follow-spline') {
            this.showSplinePlaceholder();
        } else if (this.currentPreset === 'shuffle') {
            this.showShufflePlaceholder();
        }
        // No placeholder for cursor-trail mode
        this.hasPlaceholder = true;
    }
    
    removePlaceholders() {
        this.removeRingPlaceholder();
        this.removeSplinePlaceholder();
        this.removeShufflePlaceholder();
        this.hasPlaceholder = false;
    }
    
    showRingPlaceholder() {
        // Remove existing placeholder
        this.removeRingPlaceholder();
        
        // Create placeholder plane that will move around the circle
        const geometry = new THREE.PlaneGeometry(2, 1.5);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x2a2a2a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        this.placeholderPlane = new THREE.Mesh(geometry, material);
        
        // Add border effect with wireframe
        const borderGeometry = new THREE.PlaneGeometry(2, 1.5);
        const borderMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x666666,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
        borderPlane.position.set(0, 0, 0.001); // Slightly in front
        
        // Group placeholder and border together
        const placeholderGroup = new THREE.Group();
        placeholderGroup.add(this.placeholderPlane);
        placeholderGroup.add(borderPlane);
        
        // Add to pathGroup so it moves with the circle
        this.pathGroup.add(placeholderGroup);
        this.placeholderPlane.borderPlane = borderPlane;
        this.placeholderPlane.group = placeholderGroup;
        
        // Position it on the circular path
        this.updatePlaceholderPosition();
    }
    
    removeRingPlaceholder() {
        if (this.placeholderPlane && this.placeholderPlane.group) {
            this.pathGroup.remove(this.placeholderPlane.group);
            
            // Dispose of border plane
            if (this.placeholderPlane.borderPlane) {
                this.placeholderPlane.borderPlane.geometry.dispose();
                this.placeholderPlane.borderPlane.material.dispose();
            }
            
            // Dispose of placeholder plane
            this.placeholderPlane.geometry.dispose();
            this.placeholderPlane.material.dispose();
            this.placeholderPlane = null;
        }
    }
    
    showSplinePlaceholder() {
        // This will be drawn in the drawSpline method when no spline exists
        if (this.ctx2D) {
            this.drawSplinePlaceholder();
        }
    }
    
    removeSplinePlaceholder() {
        // Will be removed when canvas is cleared or spline is drawn
    }
    
    drawSplinePlaceholder() {
        if (!this.ctx2D) return;
        
        this.clearCanvas();
        
        // Draw centered text instruction
        const canvasWidth = this.canvas2D.width;
        const canvasHeight = this.canvas2D.height;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Set text properties
        this.ctx2D.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        this.ctx2D.fillStyle = '#888888';
        this.ctx2D.textAlign = 'center';
        this.ctx2D.textBaseline = 'middle';
        
        // Draw the instruction text
        this.ctx2D.fillText('Draw a spline', centerX, centerY);
    }
    
    updatePlaceholderPosition() {
        if (this.placeholderPlane && this.placeholderPlane.group && this.currentPreset === 'ring') {
            // Position placeholder on the circular path like an image
            const radius = this.currentRadius + 1;
            const angle = 0; // Fixed position for placeholder
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = this.currentHeight;
            
            this.placeholderPlane.group.position.set(x, y, z);
            
            // Make it face the camera
            const cameraWorldPosition = new THREE.Vector3();
            this.camera.getWorldPosition(cameraWorldPosition);
            this.placeholderPlane.group.lookAt(cameraWorldPosition);
        }
    }
    
    createSplinePlaceholder(totalDistance) {
        // Create a div element as placeholder
        const placeholder = document.createElement('div');
        placeholder.style.position = 'absolute';
        placeholder.style.width = (60 * this.splineImageScale) + 'px';
        placeholder.style.height = (45 * this.splineImageScale) + 'px'; // 4:3 aspect ratio
        placeholder.style.backgroundColor = '#2a2a2a';
        placeholder.style.border = '1px solid #666666';
        placeholder.style.borderRadius = '4px';
        placeholder.style.pointerEvents = 'none';
        placeholder.style.zIndex = '10';
        placeholder.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        
        placeholder.userData = {
            imageId: 'placeholder',
            index: 0,
            animationOffset: 0,
            isPlaceholder: true
        };
        
        this.frameContainer.appendChild(placeholder);
        this.imageElements2D.push(placeholder);
    }
}

// Initialize the template when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectTemplate = new ProjectTemplate();
}); 