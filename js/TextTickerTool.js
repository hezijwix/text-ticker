// Text Ticker Tool Script - P5.js powered typography tool with modular architecture
// Main class integrating ShapeMode, SplineMode, and ExportManager

class TextTickerTool {
    constructor() {
        // DOM element references
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
        this.animationModeSelect = document.getElementById('animationModeSelect');
        this.linearAnimationControls = document.getElementById('linearAnimationControls');
        this.pulseAnimationControls = document.getElementById('pulseAnimationControls');
        this.animationSpeedSlider = document.getElementById('animationSpeedSlider');
        this.animationSpeedValue = document.getElementById('animationSpeedValue');
        this.animationDirectionSelect = document.getElementById('animationDirectionSelect');
        
        // Pulse animation controls
        this.pulseEaseSlider = document.getElementById('pulseEaseSlider');
        this.pulseEaseValue = document.getElementById('pulseEaseValue');
        this.pulseDistanceSlider = document.getElementById('pulseDistanceSlider');
        this.pulseDistanceValue = document.getElementById('pulseDistanceValue');
        this.pulseTimeSlider = document.getElementById('pulseTimeSlider');
        this.pulseTimeValue = document.getElementById('pulseTimeValue');
        this.pulseHoldSlider = document.getElementById('pulseHoldSlider');
        this.pulseHoldValue = document.getElementById('pulseHoldValue');
        
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
        
        // Arc-length parameterization system
        this.arcLengthTable = []; // Array of {t, distance, x, y, angle} for even distribution
        this.totalArcLength = 0; // Cached total arc-length
        this.arcLengthCacheValid = false; // Cache invalidation flag
        
        // Text Ribbon properties
        this.ribbonMode = "character";  // "off", "character", "shapePath", "wordsBound"
        this.ribbonWidth = 0.25;  // Proportional to font size
        this.ribbonColor = "#ff0000";
        
        // Animation properties
        this.animationMode = "linear";  // "linear" or "pulse"
        this.animationSpeed = 1.0;  // Speed multiplier (0 = stopped, higher = faster)
        this.animationDirection = "clockwise";  // "clockwise" or "counterclockwise"
        this.animationOffset = 0;  // Current animation position along path (degrees, for shapes)
        this.lastAnimationTime = 0;  // For time-based animation
        this.animationFrameId = null;  // For requestAnimationFrame
        
        // Pulse animation properties
        this.pulseConfig = {
            ease: 0.5,      // 0-1 (subtle to harsh easing)
            distance: 1.0,   // amplitude multiplier
            time: 2.0,      // pulse duration (seconds)
            hold: 0         // hold time between pulses (seconds)
        };
        
        // Pulse animation state
        this.pulseStartTime = 0;  // When current pulse cycle started
        this.pulseCycleTime = 0;  // Total cycle time (pulse + hold)
        this.pulseBaseOffset = 0; // Base offset before pulse modulation
        
        // Easing Functions for Pulse Animation - Smooth Progression (No Bounce)
        this.easingFunctions = {
            // Linear (no easing)
            linear: (t) => t,
            
            // Sine (subtle, natural curve)
            easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
            
            // Quadratic (moderate)
            easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
            
            // Cubic (strong)
            easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            
            // Quartic (very strong)
            easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
            
            // Quintic (maximum smooth)
            easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
        };
        
        // Export properties
        this.preferredExportFormat = 'auto';
        
        // Auto-zoom properties
        this.autoZoom = 1.0;
        this.manualZoom = 1.0;
        
        // Feature flag for gradual modular migration
        this.useModularArchitecture = false;
        
        // Initialize modular components
        this.shapeMode = new ShapeMode(this);
        this.splineMode = new SplineMode(this);
        this.exportManager = new ExportManager(this);
        
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
        this.updateAnimationModeControls(); // Initialize animation mode controls visibility
        this.updateSplinePointCount(); // Initialize spline point count
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    // Get easing function based on ease slider value (0-1) - Smooth Progression
    getEasingFunction(easeValue) {
        if (easeValue <= 0.2) return this.easingFunctions.linear;
        if (easeValue <= 0.4) return this.easingFunctions.easeInOutSine;
        if (easeValue <= 0.6) return this.easingFunctions.easeInOutQuad;
        if (easeValue <= 0.8) return this.easingFunctions.easeInOutCubic;
        if (easeValue < 1.0) return this.easingFunctions.easeInOutQuart;
        return this.easingFunctions.easeInOutQuint;
    }
    
    // Calculate pulse animation offset - Accumulating Forward Motion (No Snap-Back)
    calculatePulseOffset(currentTime) {
        const { ease, distance, time, hold } = this.pulseConfig;
        const totalCycleTime = (time + hold) * 1000; // Convert to milliseconds
        
        // Initialize pulse start time if needed
        if (this.pulseStartTime === 0) {
            this.pulseStartTime = currentTime;
        }
        
        // Calculate elapsed time and cycle information
        const elapsedTime = currentTime - this.pulseStartTime;
        const completedCycles = Math.floor(elapsedTime / totalCycleTime);
        const cycleProgress = (elapsedTime % totalCycleTime) / totalCycleTime;
        const pulsePhase = time / (time + hold); // What fraction of cycle is pulse vs hold
        
        // Accumulated offset from completed cycles (continuous forward progress)
        const accumulatedOffset = completedCycles * distance * 360;
        
        let currentCycleOffset = 0;
        
        if (cycleProgress <= pulsePhase) {
            // We're in the pulse phase - smooth progression within current cycle
            const pulseProgress = cycleProgress / pulsePhase; // 0-1 within pulse
            const easingFunction = this.getEasingFunction(ease);
            
            // Create single-direction pulse (0 -> 1) within current cycle
            const t = pulseProgress;
            const easedT = easingFunction(t);
            
            // Current cycle progress
            currentCycleOffset = easedT * distance * 360;
        } else {
            // We're in the hold phase - stay at end of current cycle (no snap-back)
            currentCycleOffset = distance * 360;
        }
        
        // Return total accumulated offset (continuous forward motion)
        return accumulatedOffset + currentCycleOffset;
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
                const currentTime = p.millis();
                
                if (self.animationMode === "linear") {
                    // Linear animation - original behavior
                    if (self.animationSpeed > 0) {
                        const deltaTime = (currentTime - self.lastAnimationTime) / 1000; // Convert to seconds
                        
                        const speedMultiplier = self.animationSpeed;
                        const directionMultiplier = self.animationDirection === "clockwise" ? 1 : -1;
                        
                        const baseDegreesPerSecond = 60;
                        
                        const deltaOffset = baseDegreesPerSecond * speedMultiplier * directionMultiplier * deltaTime;
                        self.animationOffset = (self.animationOffset + deltaOffset) % 360;
                        
                        // Ensure positive values for calculations
                        if (self.animationOffset < 0) {
                            self.animationOffset += 360;
                        }
                        
                        self.lastAnimationTime = currentTime;
                    }
                } else if (self.animationMode === "pulse") {
                    // Pulse animation - calculate accumulating pulse offset
                    const pulseOffset = self.calculatePulseOffset(currentTime);
                    const directionMultiplier = self.animationDirection === "clockwise" ? 1 : -1;
                    
                    // Apply pulse offset with direction (no modulo for continuous forward motion)
                    self.animationOffset = self.pulseBaseOffset + (pulseOffset * directionMultiplier);
                    
                    // Note: Removed modulo constraint to allow continuous forward motion
                    // The offset will accumulate indefinitely, creating seamless forward animation
                }
                
                // Render the current frame
                self.renderText();
            };
            
            // Mouse event handlers for spline editing
            p.mousePressed = () => {
                if (self.currentPathMode === "spline") {
                    self.splineMode.handleSplineMousePressed(p.mouseX, p.mouseY);
                }
            };
            
            // Mouse drag handler for handle manipulation
            p.mouseDragged = () => {
                if (self.currentPathMode === "spline") {
                    self.splineMode.handleSplineMouseDrag(p.mouseX, p.mouseY);
                }
            };
            
            // Mouse release handler to stop dragging
            p.mouseReleased = () => {
                if (self.currentPathMode === "spline") {
                    self.splineMode.stopHandleDrag();
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
            this.splineMode.invalidateArcLengthCache();
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
            this.splineMode.invalidateArcLengthCache();
            this.updateSplinePointCount();
            this.renderText();
        });
        
        // Animation controls
        this.animationModeSelect.addEventListener('change', () => {
            this.animationMode = this.animationModeSelect.value;
            this.updateAnimationModeControls();
            
            // Reset pulse animation state when switching modes
            if (this.animationMode === "pulse") {
                this.pulseStartTime = 0;
                this.pulseBaseOffset = this.animationOffset;
            }
        });
        
        this.animationSpeedSlider.addEventListener('input', () => {
            this.animationSpeed = parseFloat(this.animationSpeedSlider.value);
            this.animationSpeedValue.textContent = this.animationSpeed.toFixed(1) + 'x';
        });
        
        this.animationDirectionSelect.addEventListener('change', () => {
            this.animationDirection = this.animationDirectionSelect.value;
        });
        
        // Pulse animation controls
        this.pulseEaseSlider.addEventListener('input', () => {
            this.pulseConfig.ease = parseFloat(this.pulseEaseSlider.value);
            this.pulseEaseValue.textContent = this.pulseConfig.ease.toFixed(1);
        });
        
        this.pulseDistanceSlider.addEventListener('input', () => {
            this.pulseConfig.distance = parseFloat(this.pulseDistanceSlider.value);
            this.pulseDistanceValue.textContent = this.pulseConfig.distance.toFixed(1) + 'x';
        });
        
        this.pulseTimeSlider.addEventListener('input', () => {
            this.pulseConfig.time = parseFloat(this.pulseTimeSlider.value);
            this.pulseTimeValue.textContent = this.pulseConfig.time.toFixed(1) + 's';
            this.pulseStartTime = 0; // Reset pulse timing when time changes
        });
        
        this.pulseHoldSlider.addEventListener('input', () => {
            this.pulseConfig.hold = parseFloat(this.pulseHoldSlider.value);
            this.pulseHoldValue.textContent = this.pulseConfig.hold.toFixed(1) + 's';
            this.pulseStartTime = 0; // Reset pulse timing when hold changes
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
        
        // Export functionality - delegate to ExportManager
        this.exportBtn.addEventListener('click', () => this.exportManager.showExportModal());
        this.closeExportModal.addEventListener('click', () => this.exportManager.hideExportModal());
        this.cancelExport.addEventListener('click', () => this.exportManager.hideExportModal());
        this.startExport.addEventListener('click', () => this.exportManager.handleModalExport());
        
        // Help modal
        this.helpIcon.addEventListener('click', () => this.exportManager.showHelpModal());
        this.closeHelpModal.addEventListener('click', () => this.exportManager.hideHelpModal());
        
        // Click outside modals to close
        window.addEventListener('click', (e) => {
            if (e.target === this.exportModal) this.exportManager.hideExportModal();
            if (e.target === this.helpModal) this.exportManager.hideHelpModal();
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.exportModal.classList.contains('show') || this.exportModal.style.display === 'flex') {
                    this.exportManager.hideExportModal();
                } else if (this.helpModal.style.display === 'flex') {
                    this.exportManager.hideHelpModal();
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
            this.zoomValue.innerHTML = `${Math.round(this.manualZoom * 100)}% <span style=\"color: #888; font-size: 10px;\">(${Math.round(this.currentZoom * 100)}% total)</span>`;
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
    
    // Main rendering pipeline
    renderText(hideGuides = false) {
        if (!this.p5Instance) {
            return;
        }
        
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
        if (this.ribbonMode === "shapePath") {
            this.drawShapePathRibbon(p);
        } else if (this.ribbonMode === "character") {
            this.drawCharacterRibbon(p);
        } else if (this.ribbonMode === "wordsBound") {
            this.drawWordsBoundRibbon(p);
        }
        
        // Draw text based on current path mode
        this.drawTextOnPath(p, hideGuides);
        
        // Draw foreground image if loaded
        if (this.foregroundImageElement) {
            p.image(this.foregroundImageElement, 0, 0, p.width, p.height);
        }
    }
    
    // Main text rendering dispatcher
    drawTextOnPath(p, hideGuides = false) {
        if (this.currentPathMode === "shape") {
            this.shapeMode.drawText(p, hideGuides);
        } else if (this.currentPathMode === "spline") {
            this.splineMode.drawText(p, hideGuides);
        }
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
    
    updateAnimationModeControls() {
        // Show/hide animation mode controls based on selected mode
        if (this.animationMode === "linear") {
            this.linearAnimationControls.style.display = 'block';
            this.pulseAnimationControls.style.display = 'none';
        } else if (this.animationMode === "pulse") {
            this.linearAnimationControls.style.display = 'none';
            this.pulseAnimationControls.style.display = 'block';
        }
    }
    
    convertAnimationOffsetBetweenModes(oldMode, newMode) {
        // Animation continuity is maintained through the common animationOffset property
        // Both shapes and splines now use the same degree-based animation system
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
    
    // Image upload handlers
    handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.backgroundImageDataUrl = e.target.result;
                this.backgroundImageElement = this.p5Instance.loadImage(e.target.result, () => {
                    this.renderText();
                });
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
                this.foregroundImageElement = this.p5Instance.loadImage(e.target.result, () => {
                    this.renderText();
                });
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Ribbon rendering methods (simplified - delegate to modes when needed)
    drawShapePathRibbon(p) {
        const rotation = this.currentRotation * (Math.PI / 180);
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
            this.splineMode.drawSplinePathRibbon(ctx);
        } else {
            // Shape mode - delegate to shape mode
            switch (this.currentShape) {
                case 'circle':
                    this.shapeMode.drawCirclePathRibbon(ctx);
                    break;
                case 'rectangle':
                    this.shapeMode.drawRectanglePathRibbon(ctx);
                    break;
            }
        }
        
        ctx.restore();
    }
    
    drawCharacterRibbon(p) {
        const text = this.currentText;
        
        // Skip if no text
        if (!text || text.length === 0) {
            return;
        }
        
        const rotation = this.currentRotation * (Math.PI / 180);
        const borderWidth = this.currentFontSize * this.ribbonWidth;
        
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
        
        // Delegate to appropriate mode for ribbon drawing
        if (this.currentPathMode === 'spline') {
            this.splineMode.drawSplineRibbon(ctx, text, borderWidth);
        } else {
            // Shape mode
            switch (this.currentShape) {
                case 'circle':
                    this.shapeMode.drawCircleRibbon(ctx, text, borderWidth);
                    break;
                case 'rectangle':
                    this.shapeMode.drawRectangleRibbon(ctx, text, borderWidth);
                    break;
            }
        }
        
        // Restore canvas state
        ctx.restore();
    }
    
    drawWordsBoundRibbon(p) {
        const text = this.currentText;
        
        // Skip if no text
        if (!text || text.length === 0) {
            return;
        }
        
        const rotation = this.currentRotation * (Math.PI / 180);
        const borderWidth = this.currentFontSize * this.ribbonWidth;
        
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
        
        // Delegate to appropriate mode for word ribbon drawing
        if (this.currentPathMode === 'spline') {
            this.splineMode.drawSplineWordRibbons(ctx, text, words, borderWidth);
        } else {
            // Shape mode
            switch (this.currentShape) {
                case 'circle':
                    this.shapeMode.drawCircleWordRibbons(ctx, text, words, borderWidth);
                    break;
                case 'rectangle':
                    this.shapeMode.drawRectangleWordRibbons(ctx, text, words, borderWidth);
                    break;
            }
        }
        
        // Restore canvas state
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
    
    // Helper method for ribbon rendering
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
}

// Initialize the tool when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const textTickerTool = new TextTickerTool();
    
    // Make it globally accessible for debugging
    window.textTickerTool = textTickerTool;
});