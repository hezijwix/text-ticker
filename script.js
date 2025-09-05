// Text Ticker Tool Script - P5.js powered typography tool with advanced export

class TextTickerTool {
    constructor() {
        this.frameContainer = document.getElementById('frameContainer');
        this.widthInput = document.getElementById('frameWidth');
        this.heightInput = document.getElementById('frameHeight');
        this.applySizeBtn = document.getElementById('applySizeBtn');
        
        // Text input control
        this.textInput = document.getElementById('textInput');
        
        // Font controls
        this.fontFamilySelect = document.getElementById('fontFamilySelect');
        this.fontSizeSlider = document.getElementById('fontSizeSlider');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.fontWeightSlider = document.getElementById('fontWeightSlider');
        this.fontWeightValue = document.getElementById('fontWeightValue');
        this.textColorPicker = document.getElementById('textColorPicker');
        
        // Debug X-Height controls
        this.xHeightSlider = document.getElementById('xHeightSlider');
        this.xHeightValue = document.getElementById('xHeightValue');
        
        // Developer controls
        this.modularArchToggle = document.getElementById('modularArchToggle');
        
        // Path mode controls
        this.pathModeSelect = document.getElementById('pathModeSelect');
        
        // Shape controls
        this.shapeTypeSelect = document.getElementById('shapeTypeSelect');
        
        // Shape controls - Circle
        this.radiusSlider = document.getElementById('radiusSlider');
        this.radiusValue = document.getElementById('radiusValue');
        
        // Shape controls - Rectangle
        this.rectWidthSlider = document.getElementById('rectWidthSlider');
        this.rectWidthValue = document.getElementById('rectWidthValue');
        this.rectHeightSlider = document.getElementById('rectHeightSlider');
        this.rectHeightValue = document.getElementById('rectHeightValue');
        this.rectCornerSlider = document.getElementById('rectCornerSlider');
        this.rectCornerValue = document.getElementById('rectCornerValue');
        
        
        // Common rotation control
        this.rotationSlider = document.getElementById('rotationSlider');
        this.rotationValue = document.getElementById('rotationValue');
        
        // Animation controls
        this.animationSpeedSlider = document.getElementById('animationSpeedSlider');
        this.animationSpeedValue = document.getElementById('animationSpeedValue');
        this.animationDirectionSelect = document.getElementById('animationDirectionSelect');
        
        // Property groups for dynamic visibility
        this.shapePropertiesSection = document.getElementById('shapePropertiesSection');
        this.splinePropertiesSection = document.getElementById('splinePropertiesSection');
        this.circleProperties = document.getElementById('circleProperties');
        this.rectangleProperties = document.getElementById('rectangleProperties');
        
        // Spline controls
        this.curveTypeSelect = document.getElementById('curveTypeSelect');
        this.showGuidesCheckbox = document.getElementById('showGuidesCheckbox');
        this.clearSplineBtn = document.getElementById('clearSplineBtn');
        this.splinePointCount = document.getElementById('splinePointCount');
        
        
        // Text Ribbon controls
        this.ribbonModeSelect = document.getElementById('ribbonModeSelect');
        this.ribbonWidthSlider = document.getElementById('ribbonWidthSlider');
        this.ribbonWidthValue = document.getElementById('ribbonWidthValue');
        this.ribbonColorPicker = document.getElementById('ribbonColorPicker');
        
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
        this.exportFormat = document.getElementById('exportFormat');
        this.exportDuration = document.getElementById('exportDuration');
        this.currentTextDisplay = document.getElementById('currentTextDisplay');
        this.startExport = document.getElementById('startExport');
        
        // Help modal elements
        this.helpModal = document.getElementById('helpModal');
        this.helpIcon = document.getElementById('helpIcon');
        this.closeHelpModal = document.getElementById('closeHelpModal');
        
        // P5.js and rendering properties
        this.p5Instance = null;
        this.currentZoom = 1.0;
        this.currentText = "Sample Text";
        this.currentFontFamily = "Wix Madefor Display";
        this.currentFontSize = 24;
        this.currentFontWeight = 500;
        this.currentTextColor = "#ffffff";
        this.currentRotation = 0;
        this.xHeightDebugOffset = 2; // X-Height offset for proper alignment
        
        // Path system
        this.currentPathMode = "shape"; // "shape" or "spline"
        this.currentShape = "circle";
        this.shapeParameters = {
            circle: {
                radius: 150
            },
            rectangle: {
                width: 300,
                height: 200,
                cornerRadius: 0
            }
        };
        
        // Spline system
        this.splinePoints = []; // Array of {x, y} points
        this.curveType = "linear"; // "linear" or "curved" 
        this.showGuides = true;
        this.splinePathLength = 0;
        
        // Text Ribbon properties
        this.ribbonMode = "character";  // "off", "character", "shapePath", "wordsBound"
        this.ribbonWidth = 0.25;  // Proportional to font size
        this.ribbonColor = "#ff0000";
        
        // Animation properties
        this.animationSpeed = 1.0;  // Speed multiplier (0 = stopped, higher = faster)
        this.animationDirection = "clockwise";  // "clockwise" or "counterclockwise"
        this.animationOffset = 0;  // Current animation position along path (degrees, for shapes)
        this.splineAnimationDistance = 0;  // Current animation position along spline (distance units)
        this.lastAnimationTime = 0;  // For time-based animation
        this.animationFrameId = null;  // For requestAnimationFrame
        
        // Export properties
        this.preferredExportFormat = 'auto';
        this.ffmpeg = null;
        this.ffmpegLoaded = false;
        
        // Auto-zoom properties
        this.autoZoom = 1.0;
        this.manualZoom = 1.0;
        
        // Feature flag for gradual modular migration
        this.useModularArchitecture = false;
        
        // Modular path system components (will be activated by feature flag)
        this.pathManager = null;
        this.circlePath = null;
        this.rectanglePath = null;
        this.splinePath = null;
        this.ribbonRenderer = null;
        
        // Phase 4: Advanced modular components
        this.exportManager = null;
        this.validationManager = null;
        this.moduleLoader = null;
        
        // Module loading state
        this.modulesLoaded = false;
        
        // Initialize the tool
        this.init();
    }
    
    init() {
        
        // Initialize text from textarea
        this.currentText = this.textInput.value || "Sample Text";
        
        // Initialize frame container with proper styling
        this.initFrameContainer();
        
        // Initialize manual zoom to match the slider value
        this.manualZoom = parseFloat(this.zoomSlider.value) || 1.0;
        
        // Initialize animation timing
        this.lastAnimationTime = 0;
        
        this.createP5Instance();
        this.setupEventListeners();
        this.updatePathModeControls(); // Initialize path mode controls visibility
        this.updateShapeControls(); // Initialize shape controls visibility
        this.updateSplinePointCount(); // Initialize spline point count
        this.initFFmpeg(); // Initialize FFmpeg for video conversion
        
        // Initialize modular architecture components (if enabled)
        this.initModularComponents();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
    }
    
    initFrameContainer() {
        // Ensure frame container has proper CSS properties according to documentation
        this.frameContainer.style.position = 'relative';
        this.frameContainer.style.overflow = 'hidden';
        this.frameContainer.style.display = 'flex';
        this.frameContainer.style.alignItems = 'center';
        this.frameContainer.style.justifyContent = 'center';
        
        // Apply initial frame size
        this.applyFrameSize();
        
    }
    
    createP5Instance() {
        const self = this;
        
        
        // P5.js instance mode setup
        const sketch = (p) => {
            p.setup = () => {
                const frameSize = self.getFrameSize();
                
                // Disable pixel density scaling to avoid coordinate system issues
                p.pixelDensity(1);
                
                const canvas = p.createCanvas(frameSize.width, frameSize.height);
                canvas.parent(self.frameContainer);
                
                // Remove absolute positioning to allow flexbox centering
                // The frame container uses display: flex; align-items: center; justify-content: center;
                canvas.canvas.style.position = 'static';
                canvas.canvas.style.display = 'block';
                
                
                // Set initial text properties
                p.textAlign(p.CENTER, p.CENTER);
                
                // Initialize animation timing for P5.js
                self.lastAnimationTime = p.millis();
                
                // Enable P5.js draw loop for animation
                self.renderText();
                
            };
            
            p.draw = () => {
                // Update animation offset based on speed and direction
                if (self.animationSpeed > 0) {
                    const currentTime = p.millis();
                    const deltaTime = (currentTime - self.lastAnimationTime) / 1000; // Convert to seconds
                    
                    const speedMultiplier = self.animationSpeed;
                    const directionMultiplier = self.animationDirection === "clockwise" ? 1 : -1;
                    
                    let deltaOffset;
                    
                    if (self.currentPathMode === "spline" && self.splinePoints.length >= 2) {
                        // For splines: use distance-per-second for consistent visual speed
                        // Base speed: move one character spacing per second at 1.0x speed
                        const pathLength = self.calculateSplinePathLength();
                        if (pathLength > 0) {
                            const baseDistancePerSecond = pathLength / self.currentText.length; // One character spacing per second
                            const deltaDistance = baseDistancePerSecond * speedMultiplier * directionMultiplier * deltaTime;
                            
                            // Update spline distance directly (no degree conversion needed)
                            self.splineAnimationDistance = (self.splineAnimationDistance + deltaDistance) % pathLength;
                            
                            // Ensure positive values for calculations
                            if (self.splineAnimationDistance < 0) {
                                self.splineAnimationDistance += pathLength;
                            }
                        }
                        
                        // Keep degree-based offset in sync for mode switching (convert distance to degrees)
                        if (pathLength > 0) {
                            self.animationOffset = (self.splineAnimationDistance / pathLength) * 360;
                        }
                    } else {
                        // For shapes: use degrees-per-second (original behavior)
                        // Base speed: 1.0x = 60 degrees per second (1 full rotation every 6 seconds)
                        const baseDegreesPerSecond = 60;
                        deltaOffset = baseDegreesPerSecond * speedMultiplier * directionMultiplier * deltaTime;
                        
                        self.animationOffset = (self.animationOffset + deltaOffset) % 360;
                        
                        // Ensure positive values for calculations
                        if (self.animationOffset < 0) {
                            self.animationOffset += 360;
                        }
                    }
                    
                    self.lastAnimationTime = currentTime;
                }
                
                // Render the current frame
                self.renderText();
            };
            
            // Mouse event handlers for spline editing
            p.mousePressed = () => {
                if (self.currentPathMode === "spline") {
                    self.handleSplineMousePressed(p.mouseX, p.mouseY);
                }
            };
        };
        
        if (this.p5Instance) {
            this.p5Instance.remove();
        }
        
        this.p5Instance = new p5(sketch);
    }
    
    setupEventListeners() {
        // Frame size controls
        this.applySizeBtn.addEventListener('click', () => this.applyFrameSize());
        
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
        
        // Text input
        this.textInput.addEventListener('input', () => {
            this.currentText = this.textInput.value || "Sample Text";
            this.updateCurrentTextDisplay();
            this.renderText();
        });
        
        // Font controls
        this.fontFamilySelect.addEventListener('change', () => {
            this.currentFontFamily = this.fontFamilySelect.value;
            this.renderText();
        });
        
        this.fontSizeSlider.addEventListener('input', () => {
            this.currentFontSize = parseInt(this.fontSizeSlider.value);
            this.fontSizeValue.textContent = this.currentFontSize + 'px';
            this.renderText();
        });
        
        this.fontWeightSlider.addEventListener('input', () => {
            this.currentFontWeight = parseInt(this.fontWeightSlider.value);
            this.fontWeightValue.textContent = this.currentFontWeight;
            this.renderText();
        });
        
        this.textColorPicker.addEventListener('input', () => {
            this.currentTextColor = this.textColorPicker.value;
            this.renderText();
        });
        
        // Debug X-Height slider
        this.xHeightSlider.addEventListener('input', () => {
            this.xHeightDebugOffset = parseFloat(this.xHeightSlider.value);
            this.xHeightValue.textContent = this.xHeightDebugOffset.toFixed(1);
            this.renderText();
        });
        
        // Modular Architecture Toggle
        this.modularArchToggle.addEventListener('change', () => {
            this.useModularArchitecture = this.modularArchToggle.checked;
            const toggleText = this.modularArchToggle.parentElement.querySelector('.toggle-text');
            toggleText.textContent = this.useModularArchitecture ? 'On' : 'Off';
            
            // Initialize module loader if needed
            if (!this.moduleLoader) {
                this.moduleLoader = new ModuleLoader(this);
            }
            
            // Load or unload modular components
            if (this.useModularArchitecture) {
                this.moduleLoader.loadModularComponents();
                console.log('🔧 Phase 4 modular architecture activated - Advanced features enabled');
            } else {
                this.moduleLoader.unloadModularComponents();
                console.log('🔧 Switched back to original architecture');
            }
            
            this.renderText();
            console.log('Modular Architecture:', this.useModularArchitecture ? 'ENABLED' : 'DISABLED');
            
            // Log current path mode for testing
            if (this.useModularArchitecture) {
                console.log('🔧 Testing mode: Watch for colored path method calls');
                console.log('🔵 = CirclePath, 🟠 = RectanglePath, 🟢 = SplinePath');
                console.log('🎬 = ExportManager, ✅ = ValidationManager, 📦 = ModuleLoader');
            }
            
            // Log performance comparison after a few renders
            setTimeout(() => {
                PerformanceMonitor.logComparison();
            }, 2000);
        });
        
        // Path mode selection
        this.pathModeSelect.addEventListener('change', () => {
            const newPathMode = this.pathModeSelect.value;
            const oldPathMode = this.currentPathMode;
            
            // Convert animation offset between modes to maintain continuity
            this.convertAnimationOffsetBetweenModes(oldPathMode, newPathMode);
            
            this.currentPathMode = newPathMode;
            this.updatePathModeControls();
            this.renderText();
        });
        
        // Shape type selection
        this.shapeTypeSelect.addEventListener('change', () => {
            this.currentShape = this.shapeTypeSelect.value;
            this.updateShapeControls();
            this.renderText();
        });
        
        // Circle controls
        this.radiusSlider.addEventListener('input', () => {
            this.shapeParameters.circle.radius = parseFloat(this.radiusSlider.value);
            this.radiusValue.textContent = this.shapeParameters.circle.radius;
            this.renderText();
        });
        
        // Rectangle controls
        this.rectWidthSlider.addEventListener('input', () => {
            this.shapeParameters.rectangle.width = parseFloat(this.rectWidthSlider.value);
            this.rectWidthValue.textContent = this.shapeParameters.rectangle.width;
            this.renderText();
        });
        
        this.rectHeightSlider.addEventListener('input', () => {
            this.shapeParameters.rectangle.height = parseFloat(this.rectHeightSlider.value);
            this.rectHeightValue.textContent = this.shapeParameters.rectangle.height;
            this.renderText();
        });
        
        this.rectCornerSlider.addEventListener('input', () => {
            this.shapeParameters.rectangle.cornerRadius = parseFloat(this.rectCornerSlider.value);
            this.rectCornerValue.textContent = this.shapeParameters.rectangle.cornerRadius;
            this.renderText();
        });
        
        
        // Common rotation control
        this.rotationSlider.addEventListener('input', () => {
            this.currentRotation = parseFloat(this.rotationSlider.value);
            this.rotationValue.textContent = this.currentRotation + '°';
            this.renderText();
        });
        
        // Spline controls
        this.curveTypeSelect.addEventListener('change', () => {
            this.curveType = this.curveTypeSelect.value;
            this.renderText();
        });
        
        this.showGuidesCheckbox.addEventListener('change', () => {
            this.showGuides = this.showGuidesCheckbox.checked;
            // Update toggle text
            const toggleText = this.showGuidesCheckbox.parentElement.querySelector('.toggle-text');
            toggleText.textContent = this.showGuides ? 'ON' : 'OFF';
            this.renderText();
        });
        
        this.clearSplineBtn.addEventListener('click', () => {
            this.splinePoints = [];
            this.updateSplinePointCount();
            this.renderText();
        });
        
        // Animation controls
        this.animationSpeedSlider.addEventListener('input', () => {
            this.animationSpeed = parseFloat(this.animationSpeedSlider.value);
            this.animationSpeedValue.textContent = this.animationSpeed.toFixed(1) + 'x';
        });
        
        this.animationDirectionSelect.addEventListener('change', () => {
            this.animationDirection = this.animationDirectionSelect.value;
        });
        
        // Text Ribbon controls
        this.ribbonModeSelect.addEventListener('change', () => {
            this.ribbonMode = this.ribbonModeSelect.value;
            this.renderText();
        });
        
        this.ribbonWidthSlider.addEventListener('input', () => {
            this.ribbonWidth = parseFloat(this.ribbonWidthSlider.value);
            this.ribbonWidthValue.textContent = this.ribbonWidth.toFixed(2) + 'x';
            this.renderText();
        });
        
        this.ribbonColorPicker.addEventListener('input', () => {
            this.ribbonColor = this.ribbonColorPicker.value;
            this.renderText();
        });
        
        // Background controls
        this.backgroundColorPicker.addEventListener('input', () => {
            this.renderText();
        });
        
        this.alphaBackgroundCheckbox.addEventListener('change', () => {
            this.isAlphaBackground = this.alphaBackgroundCheckbox.checked;
            this.alphaBackgroundToggleText.textContent = this.isAlphaBackground ? 'ON' : 'OFF';
            this.renderText();
        });
        
        // Background image upload
        this.bgUploadButton.addEventListener('click', () => {
            this.bgImageInput.click();
        });
        
        this.bgImageInput.addEventListener('change', (e) => {
            this.handleBackgroundImageUpload(e);
        });
        
        // Foreground image upload
        this.fgUploadButton.addEventListener('click', () => {
            this.fgImageInput.click();
        });
        
        this.fgImageInput.addEventListener('change', (e) => {
            this.handleForegroundImageUpload(e);
        });
        
        // Zoom controls
        this.zoomSlider.addEventListener('input', () => this.updateZoom());
        this.resetZoomBtn.addEventListener('click', () => this.resetZoom());
        
        // Export functionality
        this.exportBtn.addEventListener('click', () => this.showExportModal());
        this.closeExportModal.addEventListener('click', () => this.hideExportModal());
        this.cancelExport.addEventListener('click', () => this.hideExportModal());
        this.startExport.addEventListener('click', () => this.handleModalExport());
        
        // Help modal
        this.helpIcon.addEventListener('click', () => this.showHelpModal());
        this.closeHelpModal.addEventListener('click', () => this.hideHelpModal());
        
        
        // Click outside modals to close
        window.addEventListener('click', (e) => {
            if (e.target === this.exportModal) this.hideExportModal();
            if (e.target === this.helpModal) this.hideHelpModal();
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.exportModal.classList.contains('show') || this.exportModal.style.display === 'flex') {
                    this.hideExportModal();
                } else if (this.helpModal.style.display === 'flex') {
                    this.hideHelpModal();
                }
            }
        });
    }
    
    // Frame size management
    getFrameSize() {
        return {
            width: parseInt(this.widthInput.value) || 800,
            height: parseInt(this.heightInput.value) || 600
        };
    }
    
    applyFrameSize() {
        const width = parseInt(this.widthInput.value) || 800;
        const height = parseInt(this.heightInput.value) || 600;
        
        // Clamp values to reasonable limits
        const clampedWidth = Math.max(200, Math.min(2000, width));
        const clampedHeight = Math.max(150, Math.min(1500, height));
        
        // Update input values if they were clamped (avoid triggering input events)
        if (this.widthInput.value != clampedWidth) {
            this.widthInput.value = clampedWidth;
        }
        if (this.heightInput.value != clampedHeight) {
            this.heightInput.value = clampedHeight;
        }
        
        // Update CSS custom properties for responsive design
        document.documentElement.style.setProperty('--frame-width', clampedWidth + 'px');
        document.documentElement.style.setProperty('--frame-height', clampedHeight + 'px');
        
        // Apply responsive constraints that preserve aspect ratio
        this.applyResponsiveConstraints(clampedWidth, clampedHeight);
        
        // Resize P5.js canvas
        if (this.p5Instance) {
            this.p5Instance.resizeCanvas(clampedWidth, clampedHeight);
            this.renderText();
        }
        
    }
    
    applyResponsiveConstraints(targetWidth, targetHeight) {
        // Set the actual frame container size without CSS scaling constraints
        this.frameContainer.style.width = targetWidth + 'px';
        this.frameContainer.style.height = targetHeight + 'px';
        
        // Remove any max-width/max-height constraints that cause coordinate mismatches
        this.frameContainer.style.maxWidth = 'none';
        this.frameContainer.style.maxHeight = 'none';
        
        // Calculate auto-zoom to fit large canvases in viewport
        this.calculateAutoZoom(targetWidth, targetHeight);
        
    }
    
    calculateAutoZoom(canvasWidth, canvasHeight) {
        // Get the content area dimensions to calculate available space
        const contentArea = this.frameContainer.parentElement;
        const contentRect = contentArea.getBoundingClientRect();
        
        // Account for content area padding - minimal padding for maximum space utilization
        const isMobile = window.innerWidth <= 768;
        const padding = isMobile ? 10 : 20; // 5px or 10px on each side
        const availableWidth = contentRect.width - padding;
        const availableHeight = contentRect.height - padding;
        
        // Calculate the scale needed to fit both dimensions
        const scaleX = availableWidth / canvasWidth;
        const scaleY = availableHeight / canvasHeight;
        
        // Smart scaling: Use the dimension that provides better space utilization
        // For very wide canvases, prioritize width scaling
        // For very tall canvases, prioritize height scaling
        const aspectRatio = canvasWidth / canvasHeight;
        const availableAspectRatio = availableWidth / availableHeight;
        
        let calculatedAutoZoom;
        if (aspectRatio > availableAspectRatio * 2.0) {
            // Very wide canvas: use width-based scaling primarily
            calculatedAutoZoom = scaleX;
        } else if (aspectRatio < availableAspectRatio / 2.0) {
            // Very tall canvas: use height-based scaling primarily  
            calculatedAutoZoom = scaleY;
        } else {
            // Balanced aspect ratio: use traditional min scaling
            calculatedAutoZoom = Math.min(scaleX, scaleY);
        }
        
        // Never zoom in automatically
        calculatedAutoZoom = Math.min(calculatedAutoZoom, 1.0);
        
        // Only update auto-zoom if it changed significantly (avoid constant recalculation)
        if (Math.abs(calculatedAutoZoom - this.autoZoom) > 0.01) {
            this.autoZoom = calculatedAutoZoom;
            
            // Update the zoom to apply auto-zoom + manual zoom
            this.updateCombinedZoom();
            
        }
    }
    
    onWindowResize() {
        const frameSize = this.getFrameSize();
        
        // Recalculate auto-zoom on window resize
        this.calculateAutoZoom(frameSize.width, frameSize.height);
    }
    
    updateCurrentTextDisplay() {
        if (this.currentTextDisplay) {
            this.currentTextDisplay.textContent = this.currentText || "Sample Text";
        }
    }
    
    updateZoom() {
        this.manualZoom = parseFloat(this.zoomSlider.value);
        this.updateCombinedZoom();
    }
    
    updateCombinedZoom() {
        // Combine auto-zoom and manual zoom
        this.currentZoom = this.autoZoom * this.manualZoom;
        
        // Update the display to show both manual zoom and effective zoom
        if (this.autoZoom < 1.0) {
            // Show both manual and effective zoom when auto-zoom is active
            this.zoomValue.innerHTML = `${Math.round(this.manualZoom * 100)}% <span style="color: #888; font-size: 10px;">(${Math.round(this.currentZoom * 100)}% total)</span>`;
        } else {
            // Show only the manual zoom when no auto-zoom is needed
            this.zoomValue.textContent = Math.round(this.currentZoom * 100) + '%';
        }
        
        // Apply the combined zoom to frame container with center transform origin
        this.frameContainer.style.transform = `scale(${this.currentZoom})`;
        this.frameContainer.style.transformOrigin = 'center center';
        
    }
    
    resetZoom() {
        // Reset manual zoom to 1.0 (auto-zoom remains as calculated)
        this.manualZoom = 1.0;
        this.zoomSlider.value = 1.0;
        
        // Update combined zoom
        this.updateCombinedZoom();
    }
    
    
    // Animation now handled by P5.js draw loop
    
    renderText(hideGuides = false) {
        if (!this.p5Instance) {
            return;
        }
        
        // Start performance monitoring
        const perfMeasurement = PerformanceMonitor.startTiming(
            'renderText', 
            this.useModularArchitecture ? 'modular' : 'original'
        );
        
        const p = this.p5Instance;
        
        // Set background
        if (this.isAlphaBackground) {
            p.clear(); // Transparent background
        } else {
            p.background(this.backgroundColorPicker.value);
        }
        
        // Draw background image if loaded
        if (this.backgroundImageElement) {
            p.image(this.backgroundImageElement, 0, 0, p.width, p.height);
        }
        
        // Draw text ribbons based on mode
        if (this.useModularArchitecture && this.ribbonRenderer) {
            // Use modular ribbon rendering
            this.ribbonRenderer.render(p);
        } else {
            // Use original ribbon rendering
            if (this.ribbonMode === "shapePath") {
                this.drawShapePathRibbon(p);
            } else if (this.ribbonMode === "character") {
                this.drawCharacterRibbon(p);
            } else if (this.ribbonMode === "wordsBound") {
                this.drawWordsBoundRibbon(p);
            }
        }
        
        // Draw text based on current shape - pass hideGuides to drawTextOnPath
        this.drawTextOnPath(p, hideGuides);
        
        // Draw foreground image if loaded
        if (this.foregroundImageElement) {
            p.image(this.foregroundImageElement, 0, 0, p.width, p.height);
        }
        
        // End performance monitoring
        const duration = PerformanceMonitor.endTiming(perfMeasurement);
        if (duration > 16.67) { // Flag renders slower than 60fps
            console.warn(`⚠️ Slow render: ${duration.toFixed(2)}ms (${this.useModularArchitecture ? 'modular' : 'original'})`);
        }
    }
    
    drawTextOnCircle(p) {
        const text = this.currentText;
        const radius = this.shapeParameters.circle.radius;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        
        // Use Canvas 2D API for variable font support with P5.js coordinate system
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas state
        ctx.save();
        
        // Use P5.js dimensions (now consistent with pixel density = 1)
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        
        // Move to exact center of canvas
        ctx.translate(centerX, centerY);
        
        // Apply rotation around center
        ctx.rotate(rotation);
        
        // Set font properties with variable font weight
        ctx.fillStyle = this.currentTextColor;
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic'; // Changed from 'middle' for better x-height alignment
        
        // Calculate font metrics for proper vertical centering
        const metrics = ctx.measureText('Mg'); // Use letters with ascenders and descenders
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent; // Center based on actual glyph bounds
        const xHeightOffset = baseXHeightOffset + this.xHeightDebugOffset; // Add debug adjustment
        
        const angleStep = (2 * Math.PI) / text.length;
        // Convert animation offset from degrees to radians and apply to character positioning
        const animationOffsetRadians = (this.animationOffset * Math.PI) / 180;
        
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i + animationOffsetRadians;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(text[i], 0, xHeightOffset);
            ctx.restore();
        }
        
        // Restore canvas state
        ctx.restore();
    }
    
    updatePathModeControls() {
        // Show/hide the appropriate properties section
        if (this.currentPathMode === "shape") {
            this.shapePropertiesSection.style.display = 'block';
            this.splinePropertiesSection.style.display = 'none';
        } else if (this.currentPathMode === "spline") {
            this.shapePropertiesSection.style.display = 'none';
            this.splinePropertiesSection.style.display = 'block';
        }
    }
    
    convertAnimationOffsetBetweenModes(oldMode, newMode) {
        // Convert animation offset between modes to maintain visual continuity
        if (oldMode === newMode) return; // No conversion needed
        
        if (oldMode === "spline" && newMode === "shape") {
            // Converting FROM spline TO shape: Convert distance to degrees
            if (this.splinePoints.length >= 2) {
                const pathLength = this.calculateSplinePathLength();
                if (pathLength > 0) {
                    // Convert spline distance to equivalent degrees (0-360)
                    this.animationOffset = (this.splineAnimationDistance / pathLength) * 360;
                }
            }
            // Spline distance remains as-is for future spline mode use
            
        } else if (oldMode === "shape" && newMode === "spline") {
            // Converting FROM shape TO spline: Convert degrees to distance
            if (this.splinePoints.length >= 2) {
                const pathLength = this.calculateSplinePathLength();
                if (pathLength > 0) {
                    // Convert degrees to spline distance
                    this.splineAnimationDistance = (this.animationOffset / 360) * pathLength;
                }
            } else {
                // If no spline points yet, set distance to 0
                this.splineAnimationDistance = 0;
            }
            // Degree offset remains as-is for future shape mode use
        }
    }
    
    updateShapeControls() {
        // Hide all shape property groups
        this.circleProperties.style.display = 'none';
        this.rectangleProperties.style.display = 'none';
        
        // Show the current shape's properties
        switch (this.currentShape) {
            case 'circle':
                this.circleProperties.style.display = 'block';
                break;
            case 'rectangle':
                this.rectangleProperties.style.display = 'block';
                break;
        }
    }
    
    updateSplinePointCount() {
        this.splinePointCount.textContent = this.splinePoints.length;
    }
    
    handleSplineMousePressed(mouseX, mouseY) {
        // Check if click is within canvas bounds
        const canvas = this.p5Instance.canvas;
        if (mouseX < 0 || mouseX > canvas.width || mouseY < 0 || mouseY > canvas.height) {
            return; // Ignore clicks outside canvas area
        }
        
        const clickRadius = 10; // Distance threshold for detecting clicks on existing points
        
        // Check if clicking on an existing point (to delete it)
        for (let i = 0; i < this.splinePoints.length; i++) {
            const point = this.splinePoints[i];
            const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
            
            if (distance <= clickRadius) {
                // Remove this point
                this.splinePoints.splice(i, 1);
                this.updateSplinePointCount();
                this.renderText();
                return; // Don't add a new point
            }
        }
        
        // Add a new point
        const newPoint = { x: mouseX, y: mouseY };
        this.splinePoints.push(newPoint);
        this.updateSplinePointCount();
        this.renderText();
    }
    
    drawTextOnPath(p, hideGuides = false) {
        if (this.useModularArchitecture && this.pathManager) {
            // Use new modular architecture
            return this.pathManager.drawCurrentPath(p, hideGuides);
        } else {
            // Use original monolithic approach
            if (this.currentPathMode === "shape") {
                switch (this.currentShape) {
                    case 'circle':
                        this.drawTextOnCircle(p);
                        break;
                    case 'rectangle':
                        this.drawTextOnRectangle(p);
                        break;
                }
            } else if (this.currentPathMode === "spline") {
                this.drawTextOnSpline(p);
                
                // Only show guides if showGuides is true AND hideGuides is false (not during export)
                if (this.showGuides && !hideGuides) {
                    this.drawSplineGuides(p);
                }
            }
        }
    }
    
    drawTextOnSpline(p) {
        if (this.splinePoints.length < 2) {
            return; // Need at least 2 points to create a path
        }
        
        const text = this.currentText;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        // Use Canvas 2D API for variable font support
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas state
        ctx.save();
        
        // Apply rotation around center
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);
        
        // Set font properties
        ctx.fillStyle = this.currentTextColor;
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        
        // Calculate font metrics
        const metrics = ctx.measureText('Mg');
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent;
        const xHeightOffset = baseXHeightOffset + this.xHeightDebugOffset;
        
        // Calculate path length
        const pathLength = this.calculateSplinePathLength();
        if (pathLength === 0) return;
        
        // Distribute characters along path
        const charSpacing = pathLength / text.length;
        // Use direct distance-based animation offset for consistent speed regardless of path length
        const animationOffsetDistance = this.splineAnimationDistance;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPath = (i * charSpacing + animationOffsetDistance) % pathLength;
            const pathPoint = this.getPointOnSplinePath(distanceAlongPath);
            
            if (pathPoint) {
                ctx.save();
                ctx.translate(pathPoint.x, pathPoint.y);
                ctx.rotate(pathPoint.angle);
                ctx.fillText(text[i], 0, xHeightOffset);
                ctx.restore();
            }
        }
        
        // Restore canvas state
        ctx.restore();
    }
    
    drawSplineGuides(p) {
        if (this.splinePoints.length === 0) return;
        
        p.push();
        
        // Apply rotation around center for consistency
        p.translate(p.width / 2, p.height / 2);
        p.rotate(this.currentRotation * (Math.PI / 180));
        p.translate(-p.width / 2, -p.height / 2);
        
        // Draw path connecting points
        if (this.splinePoints.length > 1) {
            p.push(); // Isolate path rendering state
            p.stroke(100, 150, 255); // Blue guide color
            p.strokeWeight(2);
            p.noFill();
            
            if (this.curveType === "linear") {
                // Draw straight lines between points
                p.beginShape();
                p.noFill(); // Ensure no fill for path
                for (const point of this.splinePoints) {
                    p.vertex(point.x, point.y);
                }
                p.endShape();
            } else {
                // Draw curved path using P5.js curve function
                this.drawCurvedSplinePath(p);
            }
            p.pop(); // Restore rendering state after path
        }
        
        // Draw control points
        p.fill(255, 100, 100); // Red points
        p.noStroke();
        for (let i = 0; i < this.splinePoints.length; i++) {
            const point = this.splinePoints[i];
            p.circle(point.x, point.y, 8);
            
            // Draw point numbers
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(10);
            p.text(i + 1, point.x, point.y);
            p.fill(255, 100, 100); // Restore point color
        }
        
        p.pop();
    }
    
    calculateSplinePathLength() {
        if (this.splinePoints.length < 2) return 0;
        
        let totalLength = 0;
        
        if (this.curveType === "linear") {
            // Calculate linear path length
            for (let i = 1; i < this.splinePoints.length; i++) {
                const prev = this.splinePoints[i - 1];
                const curr = this.splinePoints[i];
                totalLength += Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
            }
        } else {
            // Estimate curved path length by sampling
            const samples = 100;
            let prevPoint = this.getCurvedPointAt(0);
            
            for (let i = 1; i <= samples; i++) {
                const t = i / samples;
                const currPoint = this.getCurvedPointAt(t);
                if (prevPoint && currPoint) {
                    totalLength += Math.sqrt((currPoint.x - prevPoint.x) ** 2 + (currPoint.y - prevPoint.y) ** 2);
                    prevPoint = currPoint;
                }
            }
        }
        
        return totalLength;
    }
    
    getPointOnSplinePath(distance) {
        if (this.splinePoints.length < 2) return null;
        
        if (this.curveType === "linear") {
            return this.getLinearPointAtDistance(distance);
        } else {
            return this.getCurvedPointAtDistance(distance);
        }
    }
    
    getLinearPointAtDistance(targetDistance) {
        let currentDistance = 0;
        
        for (let i = 1; i < this.splinePoints.length; i++) {
            const prev = this.splinePoints[i - 1];
            const curr = this.splinePoints[i];
            const segmentLength = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
            
            if (currentDistance + segmentLength >= targetDistance) {
                // Found the segment containing the target distance
                const segmentProgress = (targetDistance - currentDistance) / segmentLength;
                const x = prev.x + (curr.x - prev.x) * segmentProgress;
                const y = prev.y + (curr.y - prev.y) * segmentProgress;
                
                // Calculate angle for character rotation (tangent to path)
                const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
                
                return { x, y, angle };
            }
            
            currentDistance += segmentLength;
        }
        
        // If we've gone past the end, return the last point
        const lastPoint = this.splinePoints[this.splinePoints.length - 1];
        const secondLastPoint = this.splinePoints[this.splinePoints.length - 2];
        const angle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);
        return { x: lastPoint.x, y: lastPoint.y, angle };
    }
    
    getCurvedPointAtDistance(targetDistance) {
        // For curved splines, we need to sample the curve and find the point at the target distance
        const pathLength = this.calculateSplinePathLength();
        const t = targetDistance / pathLength;
        
        return this.getCurvedPointAt(t);
    }
    
    getCurvedPointAt(t) {
        // Clamp t to [0, 1]
        t = Math.max(0, Math.min(1, t));
        
        if (this.splinePoints.length < 2) return null;
        
        // Use P5.js curve functions for smooth interpolation
        // For simplicity, we'll use Catmull-Rom splines
        const numSegments = this.splinePoints.length - 1;
        const segmentT = t * numSegments;
        const segmentIndex = Math.floor(segmentT);
        const localT = segmentT - segmentIndex;
        
        // Get control points for this segment
        const p0 = this.splinePoints[Math.max(0, segmentIndex - 1)];
        const p1 = this.splinePoints[segmentIndex];
        const p2 = this.splinePoints[Math.min(this.splinePoints.length - 1, segmentIndex + 1)];
        const p3 = this.splinePoints[Math.min(this.splinePoints.length - 1, segmentIndex + 2)];
        
        if (!p1 || !p2) return null;
        
        // Catmull-Rom interpolation
        const x = this.catmullRomInterpolate(p0?.x || p1.x, p1.x, p2.x, p3?.x || p2.x, localT);
        const y = this.catmullRomInterpolate(p0?.y || p1.y, p1.y, p2.y, p3?.y || p2.y, localT);
        
        // Calculate tangent for angle
        const tangentX = this.catmullRomTangent(p0?.x || p1.x, p1.x, p2.x, p3?.x || p2.x, localT);
        const tangentY = this.catmullRomTangent(p0?.y || p1.y, p1.y, p2.y, p3?.y || p2.y, localT);
        const angle = Math.atan2(tangentY, tangentX);
        
        return { x, y, angle };
    }
    
    catmullRomInterpolate(p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        
        return 0.5 * (
            2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3
        );
    }
    
    catmullRomTangent(p0, p1, p2, p3, t) {
        const t2 = t * t;
        
        return 0.5 * (
            (-p0 + p2) +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * 2 * t +
            (-p0 + 3 * p1 - 3 * p2 + p3) * 3 * t2
        );
    }
    
    drawCurvedSplinePath(p) {
        if (this.splinePoints.length < 2) return;
        
        // Ensure proper stroke properties are inherited from caller
        p.beginShape();
        p.noFill(); // Explicitly ensure no fill for the curved path
        
        // Sample the curve with many points for smooth visualization
        const samples = 100;
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const point = this.getCurvedPointAt(t);
            if (point) {
                p.vertex(point.x, point.y);
            }
        }
        
        p.endShape();
    }
    
    drawTextOnRectangle(p) {
        const text = this.currentText;
        const width = this.shapeParameters.rectangle.width;
        const height = this.shapeParameters.rectangle.height;
        const cornerRadius = this.shapeParameters.rectangle.cornerRadius;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        
        // Use Canvas 2D API for variable font support
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas state
        ctx.save();
        
        // Center coordinates
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        // Move to center and apply rotation
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Set font properties
        ctx.fillStyle = this.currentTextColor;
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic'; // Changed from 'middle' for consistency
        
        // Calculate font metrics for proper vertical centering
        const metrics = ctx.measureText('Mg');
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent;
        const xHeightOffset = baseXHeightOffset + this.xHeightDebugOffset; // Add debug adjustment
        
        // Use rounded rectangle path if corner radius is specified
        const pathCalculator = cornerRadius > 0 ? 
            this.getRoundedRectanglePathPoint.bind(this) : 
            this.getRectanglePathPoint.bind(this);
        
        // Calculate perimeter based on whether we have rounded corners
        const perimeter = cornerRadius > 0 ? 
            this.getRoundedRectanglePerimeter(width, height, cornerRadius) : 
            2 * (width + height);
        const charSpacing = perimeter / text.length; // Distribute evenly around closed path
        
        // Convert animation offset from degrees to distance along perimeter
        const animationOffsetDistance = (this.animationOffset / 360) * perimeter;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = (i * charSpacing + animationOffsetDistance) % perimeter;
            const pathPoint = pathCalculator(distanceAlongPerimeter, width, height, cornerRadius);
            
            ctx.save();
            ctx.translate(pathPoint.x, pathPoint.y);
            ctx.rotate(pathPoint.angle);
            ctx.fillText(text[i], 0, xHeightOffset);
            ctx.restore();
        }
        
        // Restore canvas state
        ctx.restore();
    }
    
    getRectanglePathPoint(distance, width, height) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const perimeter = 2 * (width + height);
        
        // Normalize distance to be within perimeter
        const normalizedDistance = distance % perimeter;
        
        let x, y, angle;
        
        if (normalizedDistance <= width) {
            // Top edge (left to right)
            const progress = normalizedDistance / width;
            x = -halfWidth + progress * width;
            y = -halfHeight;
            angle = 0;
        } else if (normalizedDistance <= width + height) {
            // Right edge (top to bottom)
            const progress = (normalizedDistance - width) / height;
            x = halfWidth;
            y = -halfHeight + progress * height;
            angle = Math.PI / 2;
        } else if (normalizedDistance <= 2 * width + height) {
            // Bottom edge (right to left)
            const progress = (normalizedDistance - width - height) / width;
            x = halfWidth - progress * width;
            y = halfHeight;
            angle = Math.PI;
        } else {
            // Left edge (bottom to top)
            const progress = (normalizedDistance - 2 * width - height) / height;
            x = -halfWidth;
            y = halfHeight - progress * height;
            angle = -Math.PI / 2;
        }
        
        return { x, y, angle };
    }
    
    getRoundedRectanglePerimeter(width, height, cornerRadius) {
        // Calculate perimeter including rounded corners
        // Straight segments: (width - 2*r) * 2 + (height - 2*r) * 2
        // Curved segments: 4 * (π*r/2) = 2*π*r
        const clampedRadius = Math.min(cornerRadius, width / 2, height / 2);
        const straightPerimeter = 2 * (width - 2 * clampedRadius) + 2 * (height - 2 * clampedRadius);
        const curvedPerimeter = 2 * Math.PI * clampedRadius;
        return straightPerimeter + curvedPerimeter;
    }
    
    getRoundedRectanglePathPoint(distance, width, height, cornerRadius) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const clampedRadius = Math.min(cornerRadius, halfWidth, halfHeight);
        
        const perimeter = this.getRoundedRectanglePerimeter(width, height, cornerRadius);
        // Proper modulo that handles negative values correctly
        const normalizedDistance = ((distance % perimeter) + perimeter) % perimeter;
        
        // Calculate segment lengths
        const topStraight = width - 2 * clampedRadius;
        const rightStraight = height - 2 * clampedRadius;
        const bottomStraight = width - 2 * clampedRadius;
        const leftStraight = height - 2 * clampedRadius;
        const quarterArc = Math.PI * clampedRadius / 2;
        
        // Pre-calculate cumulative distances for each segment (8 total: 4 straights + 4 arcs)
        const segments = [
            { length: topStraight, start: 0 },
            { length: quarterArc, start: topStraight },
            { length: rightStraight, start: topStraight + quarterArc },
            { length: quarterArc, start: topStraight + quarterArc + rightStraight },
            { length: bottomStraight, start: topStraight + 2 * quarterArc + rightStraight },
            { length: quarterArc, start: topStraight + 2 * quarterArc + rightStraight + bottomStraight },
            { length: leftStraight, start: topStraight + 3 * quarterArc + rightStraight + bottomStraight },
            { length: quarterArc, start: topStraight + 3 * quarterArc + rightStraight + bottomStraight + leftStraight }
        ];
        
        let x, y, angle;
        
        // Top edge (left to right)
        if (normalizedDistance <= segments[0].start + segments[0].length) {
            const progress = (normalizedDistance - segments[0].start) / segments[0].length;
            x = -halfWidth + clampedRadius + progress * topStraight;
            y = -halfHeight;
            angle = 0;
        }
        // Top-right corner
        else if (normalizedDistance <= segments[1].start + segments[1].length) {
            const progress = (normalizedDistance - segments[1].start) / segments[1].length;
            const cornerAngle = progress * Math.PI / 2;
            const centerX = halfWidth - clampedRadius;
            const centerY = -halfHeight + clampedRadius;
            x = centerX + clampedRadius * Math.cos(-Math.PI / 2 + cornerAngle);
            y = centerY + clampedRadius * Math.sin(-Math.PI / 2 + cornerAngle);
            angle = cornerAngle;
        }
        // Right edge (top to bottom)
        else if (normalizedDistance <= segments[2].start + segments[2].length) {
            const progress = (normalizedDistance - segments[2].start) / segments[2].length;
            x = halfWidth;
            y = -halfHeight + clampedRadius + progress * rightStraight;
            angle = Math.PI / 2;
        }
        // Bottom-right corner
        else if (normalizedDistance <= segments[3].start + segments[3].length) {
            const progress = (normalizedDistance - segments[3].start) / segments[3].length;
            const cornerAngle = progress * Math.PI / 2;
            const centerX = halfWidth - clampedRadius;
            const centerY = halfHeight - clampedRadius;
            x = centerX + clampedRadius * Math.cos(0 + cornerAngle);
            y = centerY + clampedRadius * Math.sin(0 + cornerAngle);
            angle = Math.PI / 2 + cornerAngle;
        }
        // Bottom edge (right to left)
        else if (normalizedDistance <= segments[4].start + segments[4].length) {
            const progress = (normalizedDistance - segments[4].start) / segments[4].length;
            x = halfWidth - clampedRadius - progress * bottomStraight;
            y = halfHeight;
            angle = Math.PI;
        }
        // Bottom-left corner
        else if (normalizedDistance <= segments[5].start + segments[5].length) {
            const progress = (normalizedDistance - segments[5].start) / segments[5].length;
            const cornerAngle = progress * Math.PI / 2;
            const centerX = -halfWidth + clampedRadius;
            const centerY = halfHeight - clampedRadius;
            x = centerX + clampedRadius * Math.cos(Math.PI / 2 + cornerAngle);
            y = centerY + clampedRadius * Math.sin(Math.PI / 2 + cornerAngle);
            angle = Math.PI + cornerAngle;
        }
        // Left edge (bottom to top)
        else if (normalizedDistance <= segments[6].start + segments[6].length) {
            const progress = (normalizedDistance - segments[6].start) / segments[6].length;
            x = -halfWidth;
            y = halfHeight - clampedRadius - progress * leftStraight;
            angle = -Math.PI / 2;
        }
        // Top-left corner (last arc connecting back to start)
        else {
            const progress = (normalizedDistance - segments[7].start) / segments[7].length;
            const cornerAngle = progress * Math.PI / 2;
            const centerX = -halfWidth + clampedRadius;
            const centerY = -halfHeight + clampedRadius;
            // Arc from left edge to top edge: starts at 180° and goes to 270° (-90°)
            x = centerX + clampedRadius * Math.cos(Math.PI + cornerAngle);
            y = centerY + clampedRadius * Math.sin(Math.PI + cornerAngle);
            angle = -Math.PI / 2 + cornerAngle;
        }
        
        return { x, y, angle };
    }
    
    
    
    drawShapePathRibbon(p) {
        const rotation = this.currentRotation * (Math.PI / 180);
        
        // Calculate ribbon stroke width proportional to font size
        const strokeWidth = this.currentFontSize * this.ribbonWidth;
        
        
        const ctx = p.canvas.getContext('2d');
        ctx.save();
        
        // Move to center of canvas and apply rotation
        ctx.translate(p.width / 2, p.height / 2);
        ctx.rotate(rotation);
        
        // Set stroke properties for shape outline
        ctx.strokeStyle = this.ribbonColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = 'transparent';
        
        // Draw path outline based on current path mode
        if (this.currentPathMode === 'spline') {
            this.drawSplinePathRibbon(ctx);
        } else {
            // Shape mode - draw based on current shape
            switch (this.currentShape) {
                case 'circle':
                    this.drawCirclePathRibbon(ctx);
                    break;
                case 'rectangle':
                    this.drawRectanglePathRibbon(ctx);
                    break;
            }
        }
        
        ctx.restore();
    }
    
    drawCirclePathRibbon(ctx) {
        const radius = this.shapeParameters.circle.radius;
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    drawRectanglePathRibbon(ctx) {
        const width = this.shapeParameters.rectangle.width;
        const height = this.shapeParameters.rectangle.height;
        const cornerRadius = this.shapeParameters.rectangle.cornerRadius;
        
        ctx.beginPath();
        
        // Use roundRect if available, fallback to regular rect
        if (typeof ctx.roundRect === 'function' && cornerRadius > 0) {
            ctx.roundRect(-width/2, -height/2, width, height, cornerRadius);
        } else {
            ctx.rect(-width/2, -height/2, width, height);
        }
        
        ctx.stroke();
    }
    
    drawSplinePathRibbon(ctx) {
        if (this.splinePoints.length < 2) return; // Need at least 2 points
        
        // The parent function already applied rotation around center, but we need to 
        // translate back to canvas coordinates for spline points which are in absolute coordinates
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(-centerX, -centerY);
        
        ctx.beginPath();
        
        if (this.curveType === "linear") {
            // Draw straight lines between points
            ctx.moveTo(this.splinePoints[0].x, this.splinePoints[0].y);
            for (let i = 1; i < this.splinePoints.length; i++) {
                ctx.lineTo(this.splinePoints[i].x, this.splinePoints[i].y);
            }
        } else {
            // Draw curved path by sampling the curve
            const samples = 100;
            let firstPoint = true;
            
            for (let i = 0; i <= samples; i++) {
                const t = i / samples;
                const point = this.getCurvedPointAt(t);
                if (point) {
                    if (firstPoint) {
                        ctx.moveTo(point.x, point.y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }
            }
        }
        
        ctx.stroke();
        
        // Restore coordinate system
        ctx.translate(centerX, centerY);
    }
    
    
    drawCharacterRibbon(p) {
        const text = this.currentText;
        
        // Skip if no text
        if (!text || text.length === 0) {
            return;
        }
        
        const rotation = this.currentRotation * (Math.PI / 180);
        
        // Calculate ribbon border width proportional to font size
        const borderWidth = this.currentFontSize * this.ribbonWidth;
        
        
        // Use Canvas 2D API for precise border rendering
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas state
        ctx.save();
        
        // Center coordinates
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        // Move to center and apply rotation
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Set border/ribbon properties
        ctx.fillStyle = this.ribbonColor;
        ctx.strokeStyle = this.ribbonColor;
        ctx.lineWidth = borderWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Set font properties to calculate character dimensions
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Create ribbon border by drawing filled shapes behind each character
        // Use the same path calculation logic as the text rendering
        this.drawRibbonForCurrentShape(ctx, text, borderWidth);
        
        // Restore canvas state
        ctx.restore();
    }
    
    drawRibbonForCurrentShape(ctx, text, borderWidth) {
        // Draw ribbon borders based on current path mode
        if (this.currentPathMode === 'spline') {
            this.drawSplineRibbon(ctx, text, borderWidth);
        } else {
            // Shape mode - draw based on current shape
            switch (this.currentShape) {
                case 'circle':
                    this.drawCircleRibbon(ctx, text, borderWidth);
                    break;
                case 'rectangle':
                    this.drawRectangleRibbon(ctx, text, borderWidth);
                    break;
            }
        }
    }
    
    drawCircleRibbon(ctx, text, borderWidth) {
        const radius = this.shapeParameters.circle.radius;
        const angleStep = (2 * Math.PI) / text.length;
        // Convert animation offset from degrees to radians and apply to character positioning
        const animationOffsetRadians = (this.animationOffset * Math.PI) / 180;
        
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i + animationOffsetRadians;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            this.drawSingleCharacterRibbon(ctx, text[i], x, y, angle + Math.PI / 2, borderWidth); // Match text rotation
        }
    }
    
    drawRectangleRibbon(ctx, text, borderWidth) {
        const width = this.shapeParameters.rectangle.width;
        const height = this.shapeParameters.rectangle.height;
        const cornerRadius = this.shapeParameters.rectangle.cornerRadius;
        
        // Use rounded rectangle path if corner radius is specified
        const pathCalculator = cornerRadius > 0 ? 
            this.getRoundedRectanglePathPoint.bind(this) : 
            this.getRectanglePathPoint.bind(this);
        
        // Calculate perimeter based on whether we have rounded corners
        const perimeter = cornerRadius > 0 ? 
            this.getRoundedRectanglePerimeter(width, height, cornerRadius) : 
            2 * (width + height);
        const charSpacing = perimeter / text.length;
        
        // Convert animation offset from degrees to distance along perimeter
        const animationOffsetDistance = (this.animationOffset / 360) * perimeter;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = (i * charSpacing + animationOffsetDistance) % perimeter;
            const pathPoint = pathCalculator(distanceAlongPerimeter, width, height, cornerRadius);
            
            this.drawSingleCharacterRibbon(ctx, text[i], pathPoint.x, pathPoint.y, pathPoint.angle, borderWidth); // Match text rotation
        }
    }
    
    drawSplineRibbon(ctx, text, borderWidth) {
        if (this.splinePoints.length < 2) return;
        
        const pathLength = this.calculateSplinePathLength();
        const charSpacing = pathLength / text.length;
        
        // Use direct distance-based animation offset for consistent speed regardless of path length
        const animationOffsetDistance = this.splineAnimationDistance;
        
        // Get canvas dimensions for coordinate transformation
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPath = (i * charSpacing + animationOffsetDistance) % pathLength;
            const pathPoint = this.getPointOnSplinePath(distanceAlongPath);
            
            if (pathPoint) {
                // Convert absolute canvas coordinates to current rotated coordinate system
                // pathPoint.x,y are in absolute canvas coordinates, but current context is rotated around center
                const transformedX = pathPoint.x - centerX;
                const transformedY = pathPoint.y - centerY;
                
                this.drawSingleCharacterRibbon(ctx, text[i], transformedX, transformedY, pathPoint.angle, borderWidth); // Match text rotation
            }
        }
    }
    
    
    drawSingleCharacterRibbon(ctx, char, x, y, angle, borderWidth) {
        // Skip drawing borders for space characters
        if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
            return;
        }
        
        // Get character metrics for accurate border sizing
        const metrics = ctx.measureText(char);
        const charWidth = metrics.width;
        const charHeight = this.currentFontSize;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Draw sharp rectangle border behind character (no rounded corners)
        const borderPadding = borderWidth * 0.5;
        const rectWidth = charWidth + borderPadding * 2;
        const rectHeight = charHeight + borderPadding * 2;
        
        // Always draw simple rectangle with sharp corners
        ctx.beginPath();
        ctx.rect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight);
        ctx.fill();
        
        ctx.restore();
    }
    
    parseTextIntoWords(text) {
        // Split text into words while preserving word boundaries and positions
        const words = [];
        let currentWord = '';
        let wordStartIndex = 0;
        let characterIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
                // End of current word
                if (currentWord.length > 0) {
                    words.push({
                        text: currentWord,
                        startIndex: wordStartIndex,
                        endIndex: i - 1,
                        length: currentWord.length
                    });
                    currentWord = '';
                }
                
                // Skip spaces and find next word start
                while (i < text.length && (text[i] === ' ' || text[i] === '\t' || text[i] === '\n' || text[i] === '\r')) {
                    i++;
                }
                
                if (i < text.length) {
                    wordStartIndex = i;
                    currentWord = text[i];
                } else {
                    break;
                }
            } else {
                // Add character to current word
                if (currentWord.length === 0) {
                    wordStartIndex = i;
                }
                currentWord += char;
            }
        }
        
        // Add the last word if it exists
        if (currentWord.length > 0) {
            words.push({
                text: currentWord,
                startIndex: wordStartIndex,
                endIndex: text.length - 1,
                length: currentWord.length
            });
        }
        
        return words;
    }
    
    drawWordsBoundRibbon(p) {
        const text = this.currentText;
        
        // Skip if no text
        if (!text || text.length === 0) {
            return;
        }
        
        const rotation = this.currentRotation * (Math.PI / 180);
        
        // Calculate ribbon border width proportional to font size
        const borderWidth = this.currentFontSize * this.ribbonWidth;
        
        // Use Canvas 2D API for precise border rendering
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas state
        ctx.save();
        
        // Center coordinates
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        // Move to center and apply rotation
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Set border/ribbon properties for stroke-based rendering
        ctx.strokeStyle = this.ribbonColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Set font properties to calculate character dimensions
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Parse text into words and draw ribbons for each word
        const words = this.parseTextIntoWords(text);
        this.drawWordRibbonsForCurrentShape(ctx, text, words, borderWidth);
        
        // Restore canvas state
        ctx.restore();
    }
    
    drawWordRibbonsForCurrentShape(ctx, text, words, borderWidth) {
        // Draw word ribbons based on current path mode
        if (this.currentPathMode === 'spline') {
            this.drawSplineWordRibbons(ctx, text, words, borderWidth);
        } else {
            // Shape mode - draw based on current shape
            switch (this.currentShape) {
                case 'circle':
                    this.drawCircleWordRibbons(ctx, text, words, borderWidth);
                    break;
                case 'rectangle':
                    this.drawRectangleWordRibbons(ctx, text, words, borderWidth);
                    break;
            }
        }
    }
    
    drawCircleWordRibbons(ctx, text, words, borderWidth) {
        const radius = this.shapeParameters.circle.radius;
        const angleStep = (2 * Math.PI) / text.length;
        const animationOffsetRadians = (this.animationOffset * Math.PI) / 180;
        
        // Calculate border padding
        const borderPadding = borderWidth * 0.5;
        const ribbonHeight = this.currentFontSize + borderPadding * 2;
        
        for (const word of words) {
            // Calculate word boundaries on the circle
            const wordStartAngle = angleStep * word.startIndex + animationOffsetRadians;
            const wordEndAngle = angleStep * word.endIndex + animationOffsetRadians;
            const wordCenterAngle = (wordStartAngle + wordEndAngle) / 2;
            
            // Calculate word width for ribbon sizing
            const wordWidth = ctx.measureText(word.text).width;
            const wordAngleSpan = wordEndAngle - wordStartAngle;
            
            // Draw ribbon arc for the entire word
            this.drawSingleWordRibbonOnCircle(ctx, word, wordCenterAngle, wordAngleSpan, radius, wordWidth, ribbonHeight, borderPadding);
        }
    }
    
    drawRectangleWordRibbons(ctx, text, words, borderWidth) {
        const width = this.shapeParameters.rectangle.width;
        const height = this.shapeParameters.rectangle.height;
        const cornerRadius = this.shapeParameters.rectangle.cornerRadius;
        
        // Use rounded rectangle path if corner radius is specified
        const pathCalculator = cornerRadius > 0 ? 
            this.getRoundedRectanglePathPoint.bind(this) : 
            this.getRectanglePathPoint.bind(this);
        
        // Calculate perimeter based on whether we have rounded corners
        const perimeter = cornerRadius > 0 ? 
            this.getRoundedRectanglePerimeter(width, height, cornerRadius) : 
            2 * (width + height);
        const charSpacing = perimeter / text.length;
        const animationOffsetDistance = (this.animationOffset / 360) * perimeter;
        
        // Calculate border padding
        const borderPadding = borderWidth * 0.5;
        const ribbonHeight = this.currentFontSize + borderPadding * 2;
        
        for (const word of words) {
            // Calculate word boundaries along the rectangle perimeter
            const wordStartDistance = (word.startIndex * charSpacing + animationOffsetDistance) % perimeter;
            const wordEndDistance = (word.endIndex * charSpacing + animationOffsetDistance) % perimeter;
            
            // Calculate word width for ribbon sizing
            const wordWidth = ctx.measureText(word.text).width;
            
            // Draw ribbon segment for the entire word
            this.drawSingleWordRibbonOnRectangle(ctx, word, wordStartDistance, wordEndDistance, width, height, cornerRadius, wordWidth, ribbonHeight, borderPadding, perimeter, pathCalculator);
        }
    }
    
    drawSplineWordRibbons(ctx, text, words, borderWidth) {
        if (this.splinePoints.length < 2) return; // Need at least 2 points
        
        const pathLength = this.calculateSplinePathLength();
        if (pathLength === 0) return;
        
        const charSpacing = pathLength / text.length;
        // Use direct distance-based animation offset for consistent speed regardless of path length
        const animationOffsetDistance = this.splineAnimationDistance;
        
        // Calculate border padding
        const borderPadding = borderWidth * 0.5;
        const ribbonHeight = this.currentFontSize + borderPadding * 2;
        
        for (const word of words) {
            // Calculate word boundaries along the spline path
            const wordStartDistance = (word.startIndex * charSpacing + animationOffsetDistance) % pathLength;
            const wordEndDistance = (word.endIndex * charSpacing + animationOffsetDistance) % pathLength;
            
            // Calculate word width for ribbon sizing
            const wordWidth = ctx.measureText(word.text).width;
            
            // Draw ribbon segment for the entire word along spline
            this.drawSingleWordRibbonOnSpline(ctx, word, wordStartDistance, wordEndDistance, pathLength, wordWidth, ribbonHeight, borderPadding);
        }
    }
    
    drawSingleWordRibbonOnCircle(ctx, word, centerAngle, angleSpan, radius, wordWidth, ribbonHeight, borderPadding) {
        ctx.save();
        
        // Calculate start and end angles for the word
        const startAngle = centerAngle - angleSpan / 2;
        const endAngle = centerAngle + angleSpan / 2;
        
        // Set stroke properties for curved ribbon
        ctx.lineWidth = ribbonHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw curved ribbon arc segment for this word
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawSingleWordRibbonOnRectangle(ctx, word, startDistance, endDistance, width, height, cornerRadius, wordWidth, ribbonHeight, borderPadding, perimeter, pathCalculator) {
        ctx.save();
        
        // Handle case where word might wrap around the rectangle (from end back to start)
        let wordDistance = endDistance - startDistance;
        if (wordDistance < 0) {
            wordDistance += perimeter;
        }
        
        // Set stroke properties for path ribbon
        ctx.lineWidth = ribbonHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw path segment along rectangle perimeter for this word
        ctx.beginPath();
        
        // Sample points along the word's portion of the rectangle path
        const pathResolution = Math.max(10, Math.ceil(wordDistance / 5)); // Sample every ~5 units or at least 10 points
        
        for (let i = 0; i <= pathResolution; i++) {
            const progress = i / pathResolution;
            const currentDistance = (startDistance + wordDistance * progress) % perimeter;
            const point = pathCalculator(currentDistance, width, height, cornerRadius);
            
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    drawSingleWordRibbonOnSpline(ctx, word, startDistance, endDistance, pathLength, wordWidth, ribbonHeight, borderPadding) {
        ctx.save();
        
        // Apply coordinate transformation to match spline coordinates
        // The parent ribbon function has rotated around center, but spline points are in absolute coordinates
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(-centerX, -centerY);
        
        // Set stroke properties for spline ribbon
        ctx.lineWidth = ribbonHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Check if word wraps around (from end back to start of spline)
        if (endDistance < startDistance) {
            // Word wraps around - split into two separate segments to avoid direct connection
            
            // Segment 1: From startDistance to end of path
            this.drawSplineSegment(ctx, startDistance, pathLength, pathLength);
            
            // Segment 2: From start of path to endDistance
            this.drawSplineSegment(ctx, 0, endDistance, pathLength);
        } else {
            // Normal case - word doesn't wrap around
            this.drawSplineSegment(ctx, startDistance, endDistance, pathLength);
        }
        
        // Restore coordinate system
        ctx.translate(centerX, centerY);
        ctx.restore();
    }
    
    drawSplineSegment(ctx, segmentStart, segmentEnd, pathLength) {
        const segmentDistance = segmentEnd - segmentStart;
        if (segmentDistance <= 0) return; // Nothing to draw
        
        // Calculate resolution for smooth curves
        const pathResolution = Math.max(10, Math.ceil(segmentDistance / 5)); // Sample every ~5 units or at least 10 points
        
        ctx.beginPath();
        
        // Sample points along this segment of the spline path
        for (let i = 0; i <= pathResolution; i++) {
            const progress = i / pathResolution;
            const currentDistance = segmentStart + segmentDistance * progress;
            const pathPoint = this.getPointOnSplinePath(currentDistance);
            
            if (pathPoint) {
                if (i === 0) {
                    ctx.moveTo(pathPoint.x, pathPoint.y);
                } else {
                    ctx.lineTo(pathPoint.x, pathPoint.y);
                }
            }
        }
        
        ctx.stroke();
    }
    
    // Image handling
    handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.backgroundImageDataUrl = e.target.result;
                this.loadBackgroundImage();
            };
            reader.readAsDataURL(file);
        }
    }
    
    handleForegroundImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.foregroundImageDataUrl = e.target.result;
                this.loadForegroundImage();
            };
            reader.readAsDataURL(file);
        }
    }
    
    loadBackgroundImage() {
        if (this.backgroundImageDataUrl && this.p5Instance) {
            this.p5Instance.loadImage(this.backgroundImageDataUrl, (img) => {
                this.backgroundImageElement = img;
                this.renderText();
            });
        }
    }
    
    loadForegroundImage() {
        if (this.foregroundImageDataUrl && this.p5Instance) {
            this.p5Instance.loadImage(this.foregroundImageDataUrl, (img) => {
                this.foregroundImageElement = img;
                this.renderText();
            });
        }
    }
    
    // Export functionality
    showExportModal() {
        this.updateCurrentTextDisplay();
        this.exportModal.style.display = 'flex';
        
        // Focus on duration input
        setTimeout(() => {
            this.exportDuration.focus();
            this.exportDuration.select();
        }, 100);
    }
    
    hideExportModal() {
        this.exportModal.style.display = 'none';
    }
    
    showHelpModal() {
        this.helpModal.style.display = 'flex';
    }
    
    hideHelpModal() {
        this.helpModal.style.display = 'none';
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
        
        // Route to appropriate export method
        if (format === 'png') {
            this.exportPNG();
        } else if (format === 'png-sequence') {
            this.exportPNGSequence(duration);
        } else {
            // Video export (MP4, WebM, Auto)
            this.preferredExportFormat = format;
            this.startVideoRecording(duration);
        }
    }
    
    exportPNG() {
        if (!this.p5Instance) return;
        
        // Hide guides during export, then restore
        this.renderText(true); // hideGuides = true
        
        // Export at original resolution, not zoomed
        this.p5Instance.save('text-ticker-export.png');
        
        // Restore normal rendering with guides
        this.renderText();
        
    }
    
    async exportPNGSequence(durationSeconds) {
        try {
            // Disable export button during capture
            this.exportBtn.disabled = true;
            this.exportBtn.textContent = 'Exporting PNGs...';

            const fps = 60;
            const totalFrames = Math.round(durationSeconds * fps);
            const frameSize = this.getFrameSize();
            
            const zip = new JSZip();
            const originalRotation = this.currentRotation;
            
            
            for (let frame = 0; frame < totalFrames; frame++) {
                // Update animation (rotate text)
                const progress = frame / totalFrames;
                this.currentRotation = originalRotation + (progress * 360);
                
                // Update rotation slider to reflect current state
                this.rotationSlider.value = this.currentRotation;
                this.rotationValue.textContent = Math.round(this.currentRotation) + '°';
                
                // Render frame with guides hidden
                this.renderText(true); // hideGuides = true
                
                // Wait for render to complete
                await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
                
                // Capture frame
                const canvas = this.p5Instance.canvas;
                const dataUrl = canvas.toDataURL('image/png');
                const base64Data = dataUrl.split(',')[1];
                
                // Add to zip with zero-padded filename
                const frameNumber = frame.toString().padStart(4, '0');
                zip.file(`frame_${frameNumber}.png`, base64Data, {base64: true});
                
                // Update progress
                const progressPercent = Math.round((frame / totalFrames) * 100);
                this.exportBtn.textContent = `Exporting PNGs... ${progressPercent}%`;
            }
            
            // Restore original rotation
            this.currentRotation = originalRotation;
            this.rotationSlider.value = originalRotation;
            this.rotationValue.textContent = originalRotation + '°';
            this.renderText();
            
            // Generate and download zip
            this.exportBtn.textContent = 'Creating ZIP...';
            const zipBlob = await zip.generateAsync({type: 'blob'});
            
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `text-ticker-sequence-${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Re-enable export button
            this.exportBtn.disabled = false;
            this.exportBtn.textContent = 'Export';
            
            
        } catch (error) {
            console.error('PNG sequence export failed:', error);
            alert('PNG sequence export failed. Please try again.');
            
            // Re-enable export button
            this.exportBtn.disabled = false;
            this.exportBtn.textContent = 'Export';
        }
    }
    
    startVideoRecording(duration) {
        // Disable export button during recording
        this.exportBtn.disabled = true;
        this.exportBtn.textContent = 'Recording...';
        
        // Create canvas for recording at original resolution
        const canvas = this.createRecordingCanvas();
        if (!canvas) {
            alert('Unable to create recording canvas');
            this.exportBtn.disabled = false;
            this.exportBtn.textContent = 'Export';
            return;
        }
        
        const stream = canvas.captureStream(60);
        
        // Determine supported formats
        let supportedFormats = [];
        
        switch (this.preferredExportFormat) {
            case 'mp4':
                supportedFormats = [
                    'video/mp4; codecs=avc1.42E01E',
                    'video/mp4; codecs=avc1.4D401E',
                    'video/mp4'
                ];
                break;
                
            case 'webm':
                supportedFormats = [
                    'video/webm; codecs=vp9',
                    'video/webm; codecs=vp8',
                    'video/webm'
                ];
                break;
                
            default: // 'auto'
                supportedFormats = [
                    'video/mp4; codecs=avc1.42E01E',
                    'video/mp4; codecs=avc1.4D401E',
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
                break;
            }
        }
        
        if (!selectedFormat) {
            alert('Your browser does not support video recording.');
            this.exportBtn.disabled = false;
            this.exportBtn.textContent = 'Export';
            return;
        }
        
        
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: selectedFormat,
            videoBitsPerSecond: 2500000 // 2.5 Mbps
        });
        
        const chunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const isMP4 = selectedFormat.includes('mp4');
            const blob = new Blob(chunks, { 
                type: isMP4 ? 'video/mp4' : 'video/webm' 
            });
            
            if (isMP4) {
                this.downloadMP4(blob);
            } else {
                this.convertToMP4(blob);
            }
        };
        
        mediaRecorder.start();
        
        // Stop recording after specified duration
        setTimeout(() => {
            mediaRecorder.stop();
            this.stopRecordingCanvas();
        }, duration * 1000);
        
        // Start animation
        this.startRecordingAnimation();
    }
    
    createRecordingCanvas() {
        try {
            const recordingCanvas = document.createElement('canvas');
            const ctx = recordingCanvas.getContext('2d');
            
            const frameSize = this.getFrameSize();
            recordingCanvas.width = frameSize.width;
            recordingCanvas.height = frameSize.height;
            
            
            const originalRotation = this.currentRotation;
            let startTime = null;
            
            const updateCanvas = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = (timestamp - startTime) / 1000; // seconds
                
                // Animate rotation
                this.currentRotation = originalRotation + (elapsed * 60); // 60 degrees per second
                
                // Clear canvas
                if (this.isAlphaBackground) {
                    ctx.clearRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                } else {
                    ctx.fillStyle = this.backgroundColorPicker.value;
                    ctx.fillRect(0, 0, recordingCanvas.width, recordingCanvas.height);
                }
                
                // Draw background image if loaded
                if (this.backgroundImageElement) {
                    ctx.drawImage(this.backgroundImageElement.canvas || this.backgroundImageElement, 0, 0, recordingCanvas.width, recordingCanvas.height);
                }
                
                // Draw text
                this.drawTextOnRecordingCanvas(ctx, recordingCanvas.width, recordingCanvas.height);
                
                // Draw foreground image if loaded
                if (this.foregroundImageElement) {
                    ctx.drawImage(this.foregroundImageElement.canvas || this.foregroundImageElement, 0, 0, recordingCanvas.width, recordingCanvas.height);
                }
                
                if (this.isRecording) {
                    this.recordingAnimationId = requestAnimationFrame(updateCanvas);
                }
            };
            
            this.isRecording = true;
            this.recordingAnimationId = requestAnimationFrame(updateCanvas);
            
            return recordingCanvas;
            
        } catch (error) {
            console.error('Failed to create recording canvas:', error);
            return null;
        }
    }
    
    drawTextOnRecordingCanvas(ctx, canvasWidth, canvasHeight) {
        const text = this.currentText;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        ctx.save();
        
        // Apply rotation around center
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);
        
        // Set font properties
        ctx.fillStyle = this.currentTextColor;
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        
        // Calculate font metrics
        const metrics = ctx.measureText('Mg');
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent;
        const xHeightOffset = baseXHeightOffset + this.xHeightDebugOffset;
        
        // Render based on current path mode (same logic as main rendering)
        if (this.currentPathMode === "shape") {
            if (this.currentShape === "circle") {
                const radius = this.shapeParameters.circle.radius;
                const angleStep = (2 * Math.PI) / text.length;
                const animationOffsetRadians = (this.animationOffset * Math.PI) / 180;
                
                for (let i = 0; i < text.length; i++) {
                    const angle = angleStep * i + animationOffsetRadians;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.fillText(text[i], 0, xHeightOffset);
                    ctx.restore();
                }
            } else if (this.currentShape === "rectangle") {
                // Rectangle rendering logic (similar to main drawTextOnRectangle)
                const width = this.shapeParameters.rectangle.width;
                const height = this.shapeParameters.rectangle.height;
                const cornerRadius = this.shapeParameters.rectangle.cornerRadius;
                
                const pathCalculator = cornerRadius > 0 ? 
                    this.getRoundedRectanglePathPoint.bind(this) : 
                    this.getRectanglePathPoint.bind(this);
                    
                const perimeter = cornerRadius > 0 ? 
                    this.getRoundedRectanglePerimeter(width, height, cornerRadius) : 
                    2 * (width + height);
                const charSpacing = perimeter / text.length;
                const animationOffsetDistance = (this.animationOffset / 360) * perimeter;
                
                for (let i = 0; i < text.length; i++) {
                    const distanceAlongPerimeter = (i * charSpacing + animationOffsetDistance) % perimeter;
                    const pathPoint = pathCalculator(distanceAlongPerimeter, width, height, cornerRadius);
                    
                    ctx.save();
                    ctx.translate(centerX + pathPoint.x, centerY + pathPoint.y);
                    ctx.rotate(pathPoint.angle);
                    ctx.fillText(text[i], 0, xHeightOffset);
                    ctx.restore();
                }
            }
        } else if (this.currentPathMode === "spline" && this.splinePoints.length >= 2) {
            // Spline rendering logic (no guides in recording)
            const pathLength = this.calculateSplinePathLength();
            if (pathLength > 0) {
                const charSpacing = pathLength / text.length;
                // Use direct distance-based animation offset for consistent speed regardless of path length
                const animationOffsetDistance = this.splineAnimationDistance;
                
                for (let i = 0; i < text.length; i++) {
                    const distanceAlongPath = (i * charSpacing + animationOffsetDistance) % pathLength;
                    const pathPoint = this.getPointOnSplinePath(distanceAlongPath);
                    
                    if (pathPoint) {
                        ctx.save();
                        ctx.translate(pathPoint.x, pathPoint.y);
                        ctx.rotate(pathPoint.angle);
                        ctx.fillText(text[i], 0, xHeightOffset);
                        ctx.restore();
                    }
                }
            }
        }
        
        ctx.restore();
    }
    
    startRecordingAnimation() {
        this.isRecording = true;
    }
    
    stopRecordingCanvas() {
        this.isRecording = false;
        if (this.recordingAnimationId) {
            cancelAnimationFrame(this.recordingAnimationId);
        }
    }
    
    // FFmpeg initialization and conversion
    async initFFmpeg() {
        try {
            if (typeof window.FFmpeg === 'undefined') {
                this.ffmpegLoaded = false;
                return;
            }
            
            this.ffmpeg = new window.FFmpeg.FFmpeg();
            
            await this.ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
            });
            
            this.ffmpegLoaded = true;
        } catch (error) {
            this.ffmpegLoaded = false;
        }
    }
    
    async convertToMP4(webmBlob) {
        
        if (!this.ffmpegLoaded) {
            this.exportBtn.textContent = 'Downloading WebM...';
            this.downloadWebM(webmBlob);
            return;
        }
        
        try {
            this.exportBtn.textContent = 'Converting to MP4... (0%)';
            
            const arrayBuffer = await webmBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            this.exportBtn.textContent = 'Converting to MP4... (25%)';
            
            await this.ffmpeg.writeFile('input.webm', uint8Array);
            
            this.exportBtn.textContent = 'Converting to MP4... (50%)';
            
            await this.ffmpeg.exec([
                '-i', 'input.webm',
                '-c:v', 'libx264',
                '-crf', '23',
                '-preset', 'medium',
                '-c:a', 'aac',
                'output.mp4'
            ]);
            
            this.exportBtn.textContent = 'Converting to MP4... (75%)';
            
            const data = await this.ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
            
            this.exportBtn.textContent = 'Downloading MP4...';
            this.downloadMP4(mp4Blob);
            
            // Clean up
            try {
                await this.ffmpeg.deleteFile('input.webm');
                await this.ffmpeg.deleteFile('output.mp4');
            } catch (cleanupError) {
            }
            
        } catch (error) {
            console.error('MP4 conversion failed:', error);
            alert('MP4 conversion failed. Downloading as WebM instead.');
            this.exportBtn.textContent = 'Downloading WebM...';
            this.downloadWebM(webmBlob);
        }
    }
    
    downloadMP4(mp4Blob) {
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `text-ticker-animation-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.exportBtn.disabled = false;
        this.exportBtn.textContent = 'Export';
        
    }
    
    downloadWebM(webmBlob) {
        const url = URL.createObjectURL(webmBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `text-ticker-animation-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.exportBtn.disabled = false;
        this.exportBtn.textContent = 'Export';
        
    }
    
    // =================================================================
    // MODULAR ARCHITECTURE COMPONENTS
    // =================================================================
    
    initModularComponents() {
        if (this.useModularArchitecture) {
            this.circlePath = new CirclePath(this);
            this.rectanglePath = new RectanglePath(this);
            this.splinePath = new SplinePath(this);
            this.pathManager = new PathManager(this);
            this.ribbonRenderer = new RibbonRenderer(this);
        }
    }
    
    // Update drawTextOnPath to support modular architecture
    drawTextOnPathModular(p, hideGuides = false) {
        if (this.currentPathMode === "shape") {
            switch (this.currentShape) {
                case 'circle':
                    return this.circlePath.drawText(p);
                case 'rectangle':
                    return this.rectanglePath.drawText(p);
            }
        } else if (this.currentPathMode === "spline") {
            this.splinePath.drawText(p);
            
            // Only show guides if showGuides is true AND hideGuides is false (not during export)
            if (this.showGuides && !hideGuides) {
                this.splinePath.drawGuides(p);
            }
        }
    }
}

// =================================================================
// PATH WRAPPER CLASSES - Initially delegate to original methods
// =================================================================

class CirclePath {
    constructor(tool) {
        this.tool = tool;
    }
    
    drawText(p) {
        // Use modular utilities for cleaner, more maintainable code
        console.log('🔵 CirclePath.drawText() - Modular architecture with utilities');
        
        const text = this.tool.currentText;
        const radius = this.tool.shapeParameters.circle.radius;
        
        // Setup canvas and coordinate system
        const { ctx, centerX, centerY, rotation } = CanvasManager.setupCanvas(p, this.tool);
        ctx.save();
        
        // Apply rotation around center
        CanvasManager.applyRotation(ctx, centerX, centerY, rotation);
        
        // Setup font and get metrics
        const { xHeightOffset } = FontManager.setupCanvasFont(ctx, this.tool);
        
        // Calculate character positioning
        const angleStep = (2 * Math.PI) / text.length;
        const animationOffsetRadians = AnimationManager.getAnimationOffset(this.tool, 0, true);
        
        // Render each character
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i + animationOffsetRadians;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            FontManager.renderCharacter(ctx, text[i], x, y, angle + Math.PI / 2, xHeightOffset);
        }
        
        ctx.restore();
    }
}

class RectanglePath {
    constructor(tool) {
        this.tool = tool;
    }
    
    drawText(p) {
        // Use modular utilities for cleaner, more maintainable code
        console.log('🟠 RectanglePath.drawText() - Modular architecture with utilities');
        
        const text = this.tool.currentText;
        const width = this.tool.shapeParameters.rectangle.width;
        const height = this.tool.shapeParameters.rectangle.height;
        const cornerRadius = this.tool.shapeParameters.rectangle.cornerRadius;
        
        // Setup canvas and coordinate system
        const { ctx, centerX, centerY, rotation } = CanvasManager.setupCanvas(p, this.tool);
        ctx.save();
        
        // Apply rotation around center
        CanvasManager.applyRotation(ctx, centerX, centerY, rotation);
        
        // Setup font and get metrics
        const { xHeightOffset } = FontManager.setupCanvasFont(ctx, this.tool);
        
        // Calculate path properties
        const pathCalculator = cornerRadius > 0 ? 
            this.tool.getRoundedRectanglePathPoint.bind(this.tool) : 
            this.tool.getRectanglePathPoint.bind(this.tool);
        
        const perimeter = cornerRadius > 0 ? 
            this.tool.getRoundedRectanglePerimeter(width, height, cornerRadius) : 
            2 * (width + height);
        
        const charSpacing = perimeter / text.length;
        const animationOffset = AnimationManager.getAnimationOffset(this.tool, perimeter);
        
        // Render each character along the rectangle path
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = AnimationManager.calculateCharacterPosition(
                i, charSpacing, animationOffset, perimeter
            );
            const pathPoint = pathCalculator(distanceAlongPerimeter, width, height, cornerRadius);
            
            FontManager.renderCharacter(ctx, text[i], pathPoint.x, pathPoint.y, pathPoint.angle, xHeightOffset);
        }
        
        ctx.restore();
    }
}

class SplinePath {
    constructor(tool) {
        this.tool = tool;
    }
    
    drawText(p) {
        // Use modular utilities for cleaner, more maintainable code
        console.log('🟢 SplinePath.drawText() - Modular architecture with utilities');
        
        if (this.tool.splinePoints.length < 2) {
            return; // Need at least 2 points to create a path
        }
        
        const text = this.tool.currentText;
        const pathLength = this.tool.calculateSplinePathLength();
        if (pathLength === 0) return;
        
        // Setup canvas and coordinate system  
        const { ctx, centerX, centerY, rotation } = CanvasManager.setupCanvas(p, this.tool);
        ctx.save();
        
        // Apply spline-specific rotation (different from shape rotation)
        CanvasManager.applySplineRotation(ctx, centerX, centerY, rotation);
        
        // Setup font and get metrics
        const { xHeightOffset } = FontManager.setupCanvasFont(ctx, this.tool);
        
        // Calculate character positioning along spline
        const charSpacing = pathLength / text.length;
        const animationOffset = AnimationManager.getAnimationOffset(this.tool, pathLength);
        
        // Render each character along the spline path
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPath = AnimationManager.calculateCharacterPosition(
                i, charSpacing, animationOffset, pathLength
            );
            const pathPoint = this.tool.getPointOnSplinePath(distanceAlongPath);
            
            if (pathPoint) {
                FontManager.renderCharacter(ctx, text[i], pathPoint.x, pathPoint.y, pathPoint.angle, xHeightOffset);
            }
        }
        
        ctx.restore();
    }
    
    drawGuides(p) {
        // Initially delegate to original method (keep this simple for now)
        return this.tool.drawSplineGuides(p);
    }
}

// ===============================================================================
// PHASE 4: Advanced Modular Components - Export Management & Enhanced Utilities
// ===============================================================================

class ExportManager {
    constructor(tool) {
        this.tool = tool;
        this.exportQueue = [];
        this.isExporting = false;
        this.exportHistory = [];
        console.log('🎬 ExportManager initialized - Advanced export system ready');
    }
    
    // Unified export dispatcher
    async exportContent(options = {}) {
        const defaultOptions = {
            format: 'png',
            duration: 5,
            quality: 1.0,
            guides: false,
            filename: null
        };
        
        const exportOptions = { ...defaultOptions, ...options };
        console.log('🎬 ExportManager.exportContent() - Starting export with options:', exportOptions);
        
        this.tool.performanceMonitor.startOperation('export');
        
        try {
            switch (exportOptions.format.toLowerCase()) {
                case 'png':
                    return await this.exportPNG(exportOptions);
                case 'mp4':
                    return await this.exportMP4(exportOptions);
                case 'png-sequence':
                    return await this.exportPNGSequence(exportOptions);
                default:
                    throw new Error(`Unsupported export format: ${exportOptions.format}`);
            }
        } catch (error) {
            console.error('🎬 ExportManager export failed:', error);
            throw error;
        } finally {
            this.tool.performanceMonitor.endOperation('export');
        }
    }
    
    async exportPNG(options) {
        console.log('🎬 ExportManager.exportPNG() - High-quality PNG export');
        
        // Use original export method with performance monitoring
        this.tool.performanceMonitor.startOperation('png-render');
        
        // Temporarily hide guides for clean export
        const originalShowGuides = this.tool.showGuides;
        if (!options.guides) {
            this.tool.showGuides = false;
        }
        
        try {
            // Delegate to original method but with enhanced monitoring
            this.tool.renderText(true); // Hide guides during render
            this.tool.p.save(options.filename || 'text-ticker-export.png');
            
            this.addToExportHistory('PNG', options.filename);
            return { success: true, format: 'PNG' };
            
        } finally {
            // Restore guides state
            if (!options.guides) {
                this.tool.showGuides = originalShowGuides;
            }
            this.tool.performanceMonitor.endOperation('png-render');
        }
    }
    
    async exportMP4(options) {
        console.log('🎬 ExportManager.exportMP4() - Video export with frame optimization');
        
        // Delegate to original MP4 export but with enhanced tracking
        this.tool.performanceMonitor.startOperation('mp4-export');
        
        try {
            // Use existing MP4 export logic
            await this.tool.exportVideo();
            
            this.addToExportHistory('MP4', options.filename);
            return { success: true, format: 'MP4' };
            
        } finally {
            this.tool.performanceMonitor.endOperation('mp4-export');
        }
    }
    
    async exportPNGSequence(options) {
        console.log('🎬 ExportManager.exportPNGSequence() - Frame sequence export');
        
        this.tool.performanceMonitor.startOperation('png-sequence');
        
        try {
            // Use existing PNG sequence logic
            await this.tool.exportPNGSequence();
            
            this.addToExportHistory('PNG Sequence', options.filename);
            return { success: true, format: 'PNG Sequence' };
            
        } finally {
            this.tool.performanceMonitor.endOperation('png-sequence');
        }
    }
    
    addToExportHistory(format, filename) {
        this.exportHistory.push({
            format,
            filename,
            timestamp: new Date(),
            settings: this.captureCurrentSettings()
        });
        
        // Keep only last 10 exports
        if (this.exportHistory.length > 10) {
            this.exportHistory.shift();
        }
    }
    
    captureCurrentSettings() {
        return {
            text: this.tool.currentText,
            font: this.tool.currentFontFamily,
            weight: this.tool.currentFontWeight,
            size: this.tool.currentFontSize,
            pathMode: this.tool.currentPathMode,
            architecture: this.tool.useModularArchitecture ? 'modular' : 'original'
        };
    }
    
    getExportHistory() {
        return this.exportHistory;
    }
}

class ValidationManager {
    constructor(tool) {
        this.tool = tool;
        this.validationRules = new Map();
        this.setupDefaultRules();
        console.log('✅ ValidationManager initialized - Quality gates active');
    }
    
    setupDefaultRules() {
        this.validationRules.set('text_length', {
            validate: (text) => text && text.length > 0 && text.length <= 500,
            message: 'Text must be 1-500 characters'
        });
        
        this.validationRules.set('font_size', {
            validate: (size) => size >= 8 && size <= 200,
            message: 'Font size must be 8-200px'
        });
        
        this.validationRules.set('spline_points', {
            validate: (points) => !points || points.length >= 2 || points.length === 0,
            message: 'Spline needs at least 2 points or none'
        });
    }
    
    validateCurrentState() {
        const results = {
            valid: true,
            errors: [],
            warnings: []
        };
        
        // Text validation
        if (!this.validationRules.get('text_length').validate(this.tool.currentText)) {
            results.valid = false;
            results.errors.push(this.validationRules.get('text_length').message);
        }
        
        // Font size validation
        if (!this.validationRules.get('font_size').validate(this.tool.currentFontSize)) {
            results.valid = false;
            results.errors.push(this.validationRules.get('font_size').message);
        }
        
        // Spline validation
        if (this.tool.currentPathMode === 'spline') {
            if (!this.validationRules.get('spline_points').validate(this.tool.splinePoints)) {
                results.valid = false;
                results.errors.push(this.validationRules.get('spline_points').message);
            }
        }
        
        return results;
    }
    
    validateBeforeExport() {
        const state = this.validateCurrentState();
        if (!state.valid) {
            console.warn('⚠️ ValidationManager: Export validation failed:', state.errors);
        }
        return state;
    }
}

class ModuleLoader {
    constructor(tool) {
        this.tool = tool;
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
        console.log('📦 ModuleLoader initialized - Dynamic module loading ready');
    }
    
    async loadModularComponents() {
        if (this.tool.modulesLoaded) {
            return true;
        }
        
        try {
            console.log('📦 ModuleLoader: Loading all modular components...');
            
            // Initialize all modular components
            this.tool.pathManager = new PathManager(this.tool);
            this.tool.circlePath = new CirclePath(this.tool);
            this.tool.rectanglePath = new RectanglePath(this.tool);
            this.tool.splinePath = new SplinePath(this.tool);
            this.tool.ribbonRenderer = new RibbonRenderer(this.tool);
            this.tool.exportManager = new ExportManager(this.tool);
            this.tool.validationManager = new ValidationManager(this.tool);
            
            // Initialize shared utilities if they don't exist
            if (!this.tool.fontManager) {
                this.tool.fontManager = FontManager;
            }
            if (!this.tool.canvasManager) {
                this.tool.canvasManager = CanvasManager;
            }
            if (!this.tool.animationManager) {
                this.tool.animationManager = AnimationManager;
            }
            
            this.tool.modulesLoaded = true;
            console.log('📦 ModuleLoader: All components loaded successfully');
            
            return true;
            
        } catch (error) {
            console.error('📦 ModuleLoader: Failed to load components:', error);
            return false;
        }
    }
    
    unloadModularComponents() {
        this.tool.pathManager = null;
        this.tool.circlePath = null;
        this.tool.rectanglePath = null;
        this.tool.splinePath = null;
        this.tool.ribbonRenderer = null;
        this.tool.exportManager = null;
        this.tool.validationManager = null;
        
        this.tool.modulesLoaded = false;
        console.log('📦 ModuleLoader: Modular components unloaded');
    }
    
    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return true;
        }
        
        if (this.loadingPromises.has(moduleName)) {
            return await this.loadingPromises.get(moduleName);
        }
        
        const loadPromise = this.performModuleLoad(moduleName);
        this.loadingPromises.set(moduleName, loadPromise);
        
        try {
            const result = await loadPromise;
            this.loadedModules.add(moduleName);
            return result;
        } finally {
            this.loadingPromises.delete(moduleName);
        }
    }
    
    async performModuleLoad(moduleName) {
        console.log(`📦 ModuleLoader: Loading ${moduleName}...`);
        
        switch (moduleName) {
            case 'export':
                if (!this.tool.exportManager) {
                    this.tool.exportManager = new ExportManager(this.tool);
                }
                return true;
                
            case 'validation':
                if (!this.tool.validationManager) {
                    this.tool.validationManager = new ValidationManager(this.tool);
                }
                return true;
                
            default:
                console.warn(`📦 ModuleLoader: Unknown module ${moduleName}`);
                return false;
        }
    }
    
    getLoadedModules() {
        return Array.from(this.loadedModules);
    }
    
    isModuleLoaded(moduleName) {
        return this.loadedModules.has(moduleName);
    }
}

// Enhanced Debug Utilities with Advanced Features
class AdvancedDebugUtils {
    constructor() {
        this.metrics = new Map();
        this.logs = [];
        this.maxLogs = 100;
    }
    
    logArchitectureSwitch(fromArch, toArch, renderTime) {
        const logEntry = {
            type: 'architecture_switch',
            from: fromArch,
            to: toArch,
            renderTime,
            timestamp: Date.now()
        };
        
        this.addLog(logEntry);
        console.log(`🔄 Architecture Switch: ${fromArch} → ${toArch} (${renderTime.toFixed(2)}ms)`);
    }
    
    logPerformanceMetric(operation, duration, details = {}) {
        const metric = {
            operation,
            duration,
            details,
            timestamp: Date.now()
        };
        
        if (!this.metrics.has(operation)) {
            this.metrics.set(operation, []);
        }
        
        this.metrics.get(operation).push(metric);
        
        // Keep only last 50 metrics per operation
        if (this.metrics.get(operation).length > 50) {
            this.metrics.get(operation).shift();
        }
        
        this.addLog({
            type: 'performance',
            ...metric
        });
    }
    
    addLog(entry) {
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }
    
    getPerformanceReport() {
        const report = {};
        
        for (const [operation, metrics] of this.metrics.entries()) {
            if (metrics.length > 0) {
                const durations = metrics.map(m => m.duration);
                report[operation] = {
                    count: metrics.length,
                    avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
                    minDuration: Math.min(...durations),
                    maxDuration: Math.max(...durations),
                    lastRun: new Date(metrics[metrics.length - 1].timestamp)
                };
            }
        }
        
        return report;
    }
    
    exportDebugData() {
        return {
            metrics: Object.fromEntries(this.metrics),
            logs: this.logs,
            performanceReport: this.getPerformanceReport(),
            timestamp: Date.now()
        };
    }
    
    clearMetrics() {
        this.metrics.clear();
        this.logs = [];
        console.log('🧹 Debug metrics cleared');
    }
}

class PathManager {
    constructor(tool) {
        this.tool = tool;
    }
    
    drawCurrentPath(p, hideGuides = false) {
        return this.tool.drawTextOnPathModular(p, hideGuides);
    }
}

// =================================================================
// RIBBON RENDERING CLASSES
// =================================================================

class RibbonRenderer {
    constructor(tool) {
        this.tool = tool;
    }
    
    render(p) {
        if (this.tool.ribbonMode === "shapePath") {
            this.renderShapePath(p);
        } else if (this.tool.ribbonMode === "character") {
            this.renderCharacter(p);
        } else if (this.tool.ribbonMode === "wordsBound") {
            this.renderWordsBound(p);
        }
    }
    
    renderShapePath(p) {
        // Delegate to original method for now
        this.tool.drawShapePathRibbon(p);
    }
    
    renderCharacter(p) {
        // Delegate to original method for now
        this.tool.drawCharacterRibbon(p);
    }
    
    renderWordsBound(p) {
        // Delegate to original method for now
        this.tool.drawWordsBoundRibbon(p);
    }
}

class CircleRibbonRenderer {
    static render(ctx, text, tool, borderWidth) {
        const radius = tool.shapeParameters.circle.radius;
        const angleStep = (2 * Math.PI) / text.length;
        const animationOffsetRadians = AnimationManager.getAnimationOffset(tool, 0, true);
        
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i + animationOffsetRadians;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            CircleRibbonRenderer.renderSingleCharacter(ctx, text[i], x, y, angle + Math.PI / 2, borderWidth);
        }
    }
    
    static renderSingleCharacter(ctx, char, x, y, angle, borderWidth) {
        if (char === ' ') return; // Skip spaces
        
        // Get character metrics for accurate border sizing
        const metrics = ctx.measureText(char);
        const charWidth = metrics.width;
        const charHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Draw rectangle border behind character
        ctx.fillRect(
            -charWidth / 2 - borderWidth,
            -charHeight / 2 - borderWidth,
            charWidth + borderWidth * 2,
            charHeight + borderWidth * 2
        );
        
        ctx.restore();
    }
}

// =================================================================
// SHARED UTILITY CLASSES
// =================================================================

class FontManager {
    static setupCanvasFont(ctx, tool) {
        // Set font properties with variable font support
        ctx.fillStyle = tool.currentTextColor;
        ctx.font = `${tool.currentFontWeight} ${tool.currentFontSize}px "${tool.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        
        // Calculate font metrics for proper vertical centering
        const metrics = ctx.measureText('Mg');
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent;
        const xHeightOffset = baseXHeightOffset + tool.xHeightDebugOffset;
        
        return { metrics, fontHeight, xHeightOffset };
    }
    
    static renderCharacter(ctx, char, x, y, angle, xHeightOffset) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(char, 0, xHeightOffset);
        ctx.restore();
    }
}

class CanvasManager {
    static setupCanvas(p, tool) {
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        const rotation = tool.currentRotation * (Math.PI / 180);
        
        return { canvas, ctx, centerX, centerY, rotation };
    }
    
    static applyRotation(ctx, centerX, centerY, rotation) {
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
    }
    
    static applySplineRotation(ctx, centerX, centerY, rotation) {
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);
    }
}

class AnimationManager {
    static getAnimationOffset(tool, totalLength, isCircle = false) {
        if (isCircle) {
            // Convert degrees to radians for circle
            return (tool.animationOffset * Math.PI) / 180;
        } else if (tool.currentPathMode === "spline") {
            // For splines: use direct distance-based animation offset
            return tool.splineAnimationDistance;
        } else {
            // For rectangles: convert degrees to distance along path
            return (tool.animationOffset / 360) * totalLength;
        }
    }
    
    static calculateCharacterPosition(index, charSpacing, animationOffset, totalLength) {
        return (index * charSpacing + animationOffset) % totalLength;
    }
}

class PerformanceMonitor {
    static measurements = [];
    
    static startTiming(label, architecture) {
        return {
            label,
            architecture,
            startTime: performance.now()
        };
    }
    
    static endTiming(measurement) {
        const endTime = performance.now();
        const duration = endTime - measurement.startTime;
        
        this.measurements.push({
            label: measurement.label,
            architecture: measurement.architecture,
            duration: duration,
            timestamp: Date.now()
        });
        
        // Keep only the last 100 measurements
        if (this.measurements.length > 100) {
            this.measurements.shift();
        }
        
        return duration;
    }
    
    static getAverageTime(architecture, label = null) {
        const filtered = this.measurements.filter(m => 
            m.architecture === architecture && 
            (!label || m.label === label)
        );
        
        if (filtered.length === 0) return 0;
        
        const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
        return sum / filtered.length;
    }
    
    static logComparison() {
        const originalAvg = this.getAverageTime('original', 'renderText');
        const modularAvg = this.getAverageTime('modular', 'renderText');
        
        if (originalAvg > 0 && modularAvg > 0) {
            const improvement = ((originalAvg - modularAvg) / originalAvg * 100).toFixed(1);
            console.log(`🔧 Performance Comparison:
                Original: ${originalAvg.toFixed(2)}ms
                Modular: ${modularAvg.toFixed(2)}ms
                ${improvement > 0 ? 'Improvement' : 'Regression'}: ${Math.abs(improvement)}%`);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tool = new TextTickerTool();
    
    // Expose debugging utilities to global scope
    window.TextTickerDebug = {
        tool: tool,
        performance: {
            clear: () => {
                PerformanceMonitor.measurements = [];
                console.log('🧹 Performance measurements cleared');
            },
            compare: () => PerformanceMonitor.logComparison(),
            data: () => PerformanceMonitor.measurements
        },
        modules: {
            loader: () => tool.moduleLoader,
            export: () => tool.exportManager,
            validation: () => tool.validationManager,
            loaded: () => tool.moduleLoader ? tool.moduleLoader.getLoadedModules() : []
        },
        export: {
            history: () => tool.exportManager ? tool.exportManager.getExportHistory() : [],
            test: async (format = 'png') => {
                if (tool.exportManager) {
                    return await tool.exportManager.exportContent({ format });
                } else {
                    console.warn('🎬 ExportManager not loaded - Enable modular architecture first');
                }
            }
        },
        validation: {
            check: () => tool.validationManager ? tool.validationManager.validateCurrentState() : null,
            rules: () => tool.validationManager ? Array.from(tool.validationManager.validationRules.keys()) : []
        },
        toggleArchitecture: () => {
            tool.modularArchToggle.click();
        }
    };
    
    console.log('🔧 Debug utilities available at window.TextTickerDebug');
});