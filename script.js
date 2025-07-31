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
        
        // Background color picker
        this.backgroundColorPicker = document.getElementById('backgroundColorPicker');
        
        // Export button
        this.exportBtn = document.getElementById('exportBtn');
        
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
        
        this.initEventListeners();
        this.initThreeJS();
        this.initFFmpeg();
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
        
        // Background color picker
        this.backgroundColorPicker.addEventListener('change', (e) => {
            this.setBackgroundColor(e.target.value);
        });
        
        // Export button
        this.exportBtn.addEventListener('click', () => {
            this.handleExport();
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
        
        // Get mouse position relative to canvas
        const rect = this.frameContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add first point
        this.currentSpline.push({ x, y });
        this.clearCanvas();
        this.drawSpline();
    }
    
    continueDrawing(e) {
        if (!this.isDrawing) return;
        
        // Get mouse position relative to canvas
        const rect = this.frameContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add point to current spline
        this.currentSpline.push({ x, y });
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
            this.ctx2D.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
            // Set background color to match frame
            this.ctx2D.fillStyle = this.currentBackgroundColor;
            this.ctx2D.fillRect(0, 0, this.canvas2D.width, this.canvas2D.height);
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
        
        // Get mouse position relative to canvas
        const rect = this.frameContainer.getBoundingClientRect();
        this.cursorPosition.x = e.clientX - rect.left;
        this.cursorPosition.y = e.clientY - rect.top;
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
        img.style.borderRadius = '4px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
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
        const frameSize = this.getFrameSize();
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
        const frameSize = this.getFrameSize();
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
        this.scene.background = new THREE.Color(0x121212);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, frameSize.width / frameSize.height, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(frameSize.width, frameSize.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
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
            this.scene.background = new THREE.Color(color);
        }
        
        // Also set the frame container background for modes that don't use Three.js (like shuffle mode)
        if (this.frameContainer) {
            this.frameContainer.style.backgroundColor = color;
            // Use !important to override CSS rule
            this.frameContainer.style.setProperty('background-color', color, 'important');
        }
        
        // If we have a 2D canvas (for spline mode), update its background
        if (this.canvas2D && this.currentPreset === 'follow-spline') {
            this.clearCanvas();
            this.drawSpline();
        }
    }
    
    handleExport() {
        // Ask user for duration
        const duration = prompt('Enter video duration in seconds (1-60):', '5');
        
        if (!duration || isNaN(duration)) {
            alert('Please enter a valid number.');
            return;
        }
        
        const durationNum = parseFloat(duration);
        if (durationNum < 1 || durationNum > 60) {
            alert('Duration must be between 1 and 60 seconds.');
            return;
        }
        
        this.startVideoRecording(durationNum);
    }
    
    startVideoRecording(duration) {
        if (!this.renderer || !this.renderer.domElement) {
            alert('Canvas not ready for recording');
            return;
        }
        
        // Disable export button during recording
        this.exportBtn.disabled = true;
        this.exportBtn.textContent = 'Recording...';
        
        const canvas = this.renderer.domElement;
        const stream = canvas.captureStream(30); // 30 fps
        
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm; codecs=vp9'
        });
        
        const chunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            this.convertToMP4(blob);
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
                console.error('FFmpeg not found in global scope');
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
                console.log('FFmpeg progress:', progress);
            });
            
            // Load FFmpeg core with proper base URL
            await this.ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
                wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
            });
            
            this.ffmpegLoaded = true;
            console.log('FFmpeg loaded successfully');
        } catch (error) {
            console.error('Failed to load FFmpeg:', error);
            console.error('Error details:', error.message);
            this.ffmpegLoaded = false;
        }
    }
    
    async convertToMP4(webmBlob) {
        console.log('convertToMP4 called, ffmpegLoaded:', this.ffmpegLoaded);
        
        if (!this.ffmpegLoaded) {
            console.log('FFmpeg not loaded, falling back to WebM');
            this.downloadWebM(webmBlob);
            return;
        }
        
        try {
            this.exportBtn.textContent = 'Converting to MP4...';
            console.log('Starting MP4 conversion...');
            
            // Convert blob to array buffer
            const arrayBuffer = await webmBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            console.log('WebM blob size:', uint8Array.length);
            
            // Write input file to FFmpeg's virtual file system
            await this.ffmpeg.writeFile('input.webm', uint8Array);
            console.log('Input file written to FFmpeg filesystem');
            
            // Convert WebM to MP4 with H.264 codec
            console.log('Starting FFmpeg conversion...');
            await this.ffmpeg.exec([
                '-i', 'input.webm',
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '23',
                '-pix_fmt', 'yuv420p',
                'output.mp4'
            ]);
            
            console.log('FFmpeg conversion completed');
            
            // Read the output file
            const data = await this.ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
            console.log('MP4 blob created, size:', mp4Blob.size);
            
            // Download the MP4 file
            const url = URL.createObjectURL(mp4Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gallery-animation-${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('MP4 file downloaded successfully');
            
            // Clean up
            await this.ffmpeg.deleteFile('input.webm');
            await this.ffmpeg.deleteFile('output.mp4');
            
        } catch (error) {
            console.error('MP4 conversion failed:', error);
            console.error('Error stack:', error.stack);
            alert('MP4 conversion failed: ' + error.message + '. Downloading as WebM instead.');
            this.downloadWebM(webmBlob);
        }
        
        // Re-enable export button
        this.exportBtn.disabled = false;
        this.exportBtn.textContent = 'Export MP4';
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
        
        alert('Video exported as WebM format. For MP4 conversion, you can use online converters or video editing software.');
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
        
        // Update Three.js renderer size
        if (this.renderer && this.camera) {
            this.camera.aspect = clampedWidth / clampedHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(clampedWidth, clampedHeight);
        }
        
        console.log(`Frame size updated to: ${clampedWidth}x${clampedHeight}`);
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
        });
    }
    
    create2DImageElement(imageData, index, totalImages, totalDistance) {
        const img = document.createElement('img');
        img.src = imageData.dataUrl;
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.zIndex = '10';
        img.style.borderRadius = '4px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        
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