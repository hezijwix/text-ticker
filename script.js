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
        
        // Shape control
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
        
        // Shape controls - Triangle
        this.triangleSizeSlider = document.getElementById('triangleSizeSlider');
        this.triangleSizeValue = document.getElementById('triangleSizeValue');
        this.triangleCornerSlider = document.getElementById('triangleCornerSlider');
        this.triangleCornerValue = document.getElementById('triangleCornerValue');
        
        // Common rotation control
        this.rotationSlider = document.getElementById('rotationSlider');
        this.rotationValue = document.getElementById('rotationValue');
        
        // Shape property groups for dynamic visibility
        this.circleProperties = document.getElementById('circleProperties');
        this.rectangleProperties = document.getElementById('rectangleProperties');
        this.triangleProperties = document.getElementById('triangleProperties');
        
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
        
        // Shape system
        this.currentShape = "circle";
        this.shapeParameters = {
            circle: {
                radius: 150
            },
            rectangle: {
                width: 300,
                height: 200,
                cornerRadius: 0
            },
            triangle: {
                size: 200,
                cornerRadius: 0
            }
        };
        
        // Text Ribbon properties
        this.ribbonMode = "character";  // "off", "character", "shapePath"
        this.ribbonWidth = 0.25;  // Proportional to font size
        this.ribbonColor = "#ff0000";
        
        // Export properties
        this.preferredExportFormat = 'auto';
        this.ffmpeg = null;
        this.ffmpegLoaded = false;
        
        // Auto-zoom properties
        this.autoZoom = 1.0;
        this.manualZoom = 1.0;
        
        // Initialize the tool
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Text Ticker Tool...');
        console.log('📦 Frame container:', this.frameContainer);
        
        // Initialize text from textarea
        this.currentText = this.textInput.value || "Sample Text";
        console.log('📝 Initial text:', this.currentText);
        
        // Initialize frame container with proper styling
        this.initFrameContainer();
        
        // Initialize manual zoom to match the slider value
        this.manualZoom = parseFloat(this.zoomSlider.value) || 1.0;
        
        this.createP5Instance();
        this.setupEventListeners();
        this.updateShapeControls(); // Initialize shape controls visibility
        this.initFFmpeg(); // Initialize FFmpeg for video conversion
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        console.log('✅ Text Ticker Tool initialized successfully');
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
        
        console.log('🖼️ Frame container initialized with proper CSS');
    }
    
    createP5Instance() {
        const self = this;
        
        console.log('🎨 Creating P5.js instance...');
        
        // P5.js instance mode setup
        const sketch = (p) => {
            p.setup = () => {
                console.log('📐 P5.js setup running...');
                const frameSize = self.getFrameSize();
                console.log('📏 Frame size:', frameSize);
                
                // Disable pixel density scaling to avoid coordinate system issues
                p.pixelDensity(1);
                
                const canvas = p.createCanvas(frameSize.width, frameSize.height);
                canvas.parent(self.frameContainer);
                
                // Remove absolute positioning to allow flexbox centering
                // The frame container uses display: flex; align-items: center; justify-content: center;
                canvas.canvas.style.position = 'static';
                canvas.canvas.style.display = 'block';
                
                console.log('🖼️ Canvas created and positioned with flexbox centering');
                console.log('📊 Canvas dimensions:', {
                    canvasWidth: canvas.canvas.width,
                    canvasHeight: canvas.canvas.height,
                    p5Width: p.width,
                    p5Height: p.height,
                    pixelDensity: p.pixelDensity()
                });
                
                // Set initial text properties
                p.textAlign(p.CENTER, p.CENTER);
                p.noLoop(); // Stop continuous draw loop
                self.renderText();
                
                console.log('✅ P5.js setup completed');
            };
            
            p.draw = () => {
                // This should not run continuously
                console.log('⚠️ P5.js draw() called - this should not happen');
            };
        };
        
        if (this.p5Instance) {
            console.log('🔄 Removing existing P5.js instance');
            this.p5Instance.remove();
        }
        
        this.p5Instance = new p5(sketch);
        console.log('✅ P5.js instance created');
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
        
        // Triangle controls
        this.triangleSizeSlider.addEventListener('input', () => {
            this.shapeParameters.triangle.size = parseFloat(this.triangleSizeSlider.value);
            this.triangleSizeValue.textContent = this.shapeParameters.triangle.size;
            this.renderText();
        });
        
        this.triangleCornerSlider.addEventListener('input', () => {
            this.shapeParameters.triangle.cornerRadius = parseFloat(this.triangleCornerSlider.value);
            this.triangleCornerValue.textContent = this.shapeParameters.triangle.cornerRadius;
            this.renderText();
        });
        
        // Common rotation control
        this.rotationSlider.addEventListener('input', () => {
            this.currentRotation = parseFloat(this.rotationSlider.value);
            this.rotationValue.textContent = this.currentRotation + '°';
            this.renderText();
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
        
        console.log(`Frame size applied: ${clampedWidth}x${clampedHeight}`);
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
        
        console.log(`Frame size applied: ${targetWidth}x${targetHeight}`);
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
            
            console.log(`Auto-zoom calculated: ${this.autoZoom.toFixed(3)} (canvas: ${canvasWidth}x${canvasHeight}, available: ${availableWidth.toFixed(0)}x${availableHeight.toFixed(0)}, aspect: ${aspectRatio.toFixed(2)} vs ${availableAspectRatio.toFixed(2)})`);
        }
    }
    
    onWindowResize() {
        const frameSize = this.getFrameSize();
        
        // Recalculate auto-zoom on window resize
        this.calculateAutoZoom(frameSize.width, frameSize.height);
        console.log(`Window resized. Frame size: ${frameSize.width}x${frameSize.height}`);
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
        
        console.log(`Zoom updated: auto=${this.autoZoom.toFixed(3)}, manual=${this.manualZoom.toFixed(3)}, combined=${this.currentZoom.toFixed(3)}`);
    }
    
    resetZoom() {
        // Reset manual zoom to 1.0 (auto-zoom remains as calculated)
        this.manualZoom = 1.0;
        this.zoomSlider.value = 1.0;
        
        // Update combined zoom
        this.updateCombinedZoom();
    }
    
    renderText() {
        console.log('🎨 renderText called');
        
        if (!this.p5Instance) {
            console.log('❌ No P5.js instance available');
            return;
        }
        
        const p = this.p5Instance;
        console.log('📝 Rendering text:', this.currentText);
        
        // Set background
        if (this.isAlphaBackground) {
            p.clear(); // Transparent background
            console.log('🔳 Using transparent background');
        } else {
            p.background(this.backgroundColorPicker.value);
            console.log('🎨 Background color:', this.backgroundColorPicker.value);
        }
        
        // Draw background image if loaded
        if (this.backgroundImageElement) {
            p.image(this.backgroundImageElement, 0, 0, p.width, p.height);
            console.log('🖼️ Drew background image');
        }
        
        // Draw text ribbons based on mode
        console.log('🎨 Ribbon mode check:', this.ribbonMode);
        if (this.ribbonMode === "shapePath") {
            console.log('✅ Drawing shape path ribbon');
            this.drawShapePathRibbon(p);
        } else if (this.ribbonMode === "character") {
            console.log('✅ Drawing character ribbon');
            this.drawCharacterRibbon(p);
        } else {
            console.log('ℹ️ No ribbon mode active');
        }
        
        // Draw text based on current shape
        this.drawTextOnPath(p);
        
        // Draw foreground image if loaded
        if (this.foregroundImageElement) {
            p.image(this.foregroundImageElement, 0, 0, p.width, p.height);
            console.log('🖼️ Drew foreground image');
        }
        
        console.log('✅ Text rendering completed');
    }
    
    drawTextOnCircle(p) {
        const text = this.currentText;
        const radius = this.shapeParameters.circle.radius;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        console.log('🔤 Drawing text on circle:', {
            text: text,
            radius: radius,
            rotation: this.currentRotation,
            fontFamily: this.currentFontFamily,
            fontWeight: this.currentFontWeight,
            canvasSize: `${p.width}x${p.height}`
        });
        
        // Use Canvas 2D API for variable font support with P5.js coordinate system
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas state
        ctx.save();
        
        // Use P5.js dimensions (now consistent with pixel density = 1)
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        console.log('📍 Center coordinates:', { 
            centerX, 
            centerY, 
            canvasWidth: canvas.width, 
            canvasHeight: canvas.height,
            p5Width: p.width,
            p5Height: p.height,
            pixelDensity: p.pixelDensity()
        });
        
        // Move to exact center of canvas
        ctx.translate(centerX, centerY);
        
        // Apply rotation around center
        ctx.rotate(rotation);
        
        // Set font properties with variable font weight
        ctx.fillStyle = this.currentTextColor;
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const angleStep = (2 * Math.PI) / text.length;
        console.log('📐 Angle step per character:', (angleStep * 180 / Math.PI));
        
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
        
        // Restore canvas state
        ctx.restore();
        console.log('✅ Text drawing completed and centered');
    }
    
    updateShapeControls() {
        // Hide all shape property groups
        this.circleProperties.style.display = 'none';
        this.rectangleProperties.style.display = 'none';
        this.triangleProperties.style.display = 'none';
        
        // Show the current shape's properties
        switch (this.currentShape) {
            case 'circle':
                this.circleProperties.style.display = 'block';
                break;
            case 'rectangle':
                this.rectangleProperties.style.display = 'block';
                break;
            case 'triangle':
                this.triangleProperties.style.display = 'block';
                break;
        }
        
        console.log('🔄 Shape controls updated for:', this.currentShape);
    }
    
    drawTextOnPath(p) {
        switch (this.currentShape) {
            case 'circle':
                this.drawTextOnCircle(p);
                break;
            case 'rectangle':
                this.drawTextOnRectangle(p);
                break;
            case 'triangle':
                this.drawTextOnTriangle(p);
                break;
        }
    }
    
    drawTextOnRectangle(p) {
        const text = this.currentText;
        const width = this.shapeParameters.rectangle.width;
        const height = this.shapeParameters.rectangle.height;
        const cornerRadius = this.shapeParameters.rectangle.cornerRadius;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        console.log('🔤 Drawing text on rectangle:', {
            text: text,
            width: width,
            height: height,
            cornerRadius: cornerRadius,
            rotation: this.currentRotation,
            fontFamily: this.currentFontFamily,
            fontSize: this.currentFontSize,
            fontWeight: this.currentFontWeight,
            canvasSize: `${p.width}x${p.height}`
        });
        
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
        ctx.textBaseline = 'middle';
        
        // Calculate rectangle perimeter for text distribution
        const perimeter = 2 * (width + height);
        const charSpacing = perimeter / text.length;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = i * charSpacing;
            const pathPoint = this.getRectanglePathPoint(distanceAlongPerimeter, width, height);
            
            ctx.save();
            ctx.translate(pathPoint.x, pathPoint.y);
            ctx.rotate(pathPoint.angle);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
        
        // Restore canvas state
        ctx.restore();
        console.log('✅ Rectangle text drawing completed');
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
    
    drawTextOnTriangle(p) {
        const text = this.currentText;
        const size = this.shapeParameters.triangle.size;
        const cornerRadius = this.shapeParameters.triangle.cornerRadius;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        console.log('🔤 Drawing text on triangle:', {
            text: text,
            size: size,
            cornerRadius: cornerRadius,
            rotation: this.currentRotation,
            fontFamily: this.currentFontFamily,
            fontSize: this.currentFontSize,
            fontWeight: this.currentFontWeight,
            canvasSize: `${p.width}x${p.height}`
        });
        
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
        ctx.textBaseline = 'middle';
        
        // Calculate triangle perimeter for text distribution
        const sideLength = size;
        const perimeter = 3 * sideLength;
        const charSpacing = perimeter / text.length;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = i * charSpacing;
            const pathPoint = this.getTrianglePathPoint(distanceAlongPerimeter, size);
            
            ctx.save();
            ctx.translate(pathPoint.x, pathPoint.y);
            ctx.rotate(pathPoint.angle);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
        
        // Restore canvas state
        ctx.restore();
        console.log('✅ Triangle text drawing completed');
    }
    
    getTrianglePathPoint(distance, size) {
        const sideLength = size;
        const height = (Math.sqrt(3) / 2) * sideLength;
        const perimeter = 3 * sideLength;
        
        // Normalize distance to be within perimeter
        const normalizedDistance = distance % perimeter;
        
        // Equilateral triangle vertices (pointing up)
        const vertices = [
            { x: 0, y: -height / 2 },                    // Top vertex
            { x: -sideLength / 2, y: height / 2 },       // Bottom left
            { x: sideLength / 2, y: height / 2 }         // Bottom right
        ];
        
        let x, y, angle;
        
        if (normalizedDistance <= sideLength) {
            // Side 1: Top to bottom-right
            const progress = normalizedDistance / sideLength;
            const start = vertices[0];
            const end = vertices[2];
            x = start.x + progress * (end.x - start.x);
            y = start.y + progress * (end.y - start.y);
            angle = Math.atan2(end.y - start.y, end.x - start.x) + Math.PI / 2;
        } else if (normalizedDistance <= 2 * sideLength) {
            // Side 2: Bottom-right to bottom-left
            const progress = (normalizedDistance - sideLength) / sideLength;
            const start = vertices[2];
            const end = vertices[1];
            x = start.x + progress * (end.x - start.x);
            y = start.y + progress * (end.y - start.y);
            angle = Math.atan2(end.y - start.y, end.x - start.x) + Math.PI / 2;
        } else {
            // Side 3: Bottom-left to top
            const progress = (normalizedDistance - 2 * sideLength) / sideLength;
            const start = vertices[1];
            const end = vertices[0];
            x = start.x + progress * (end.x - start.x);
            y = start.y + progress * (end.y - start.y);
            angle = Math.atan2(end.y - start.y, end.x - start.x) + Math.PI / 2;
        }
        
        return { x, y, angle };
    }
    
    drawShapePathRibbon(p) {
        const rotation = this.currentRotation * (Math.PI / 180);
        
        // Calculate ribbon stroke width proportional to font size
        const strokeWidth = this.currentFontSize * this.ribbonWidth;
        
        console.log('🎨 Drawing shape path ribbon:', {
            shape: this.currentShape,
            strokeWidth: strokeWidth,
            ribbonColor: this.ribbonColor,
            rotation: rotation
        });
        
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
        
        // Draw shape outline based on current shape
        switch (this.currentShape) {
            case 'circle':
                this.drawCirclePathRibbon(ctx);
                break;
            case 'rectangle':
                this.drawRectanglePathRibbon(ctx);
                break;
            case 'triangle':
                this.drawTrianglePathRibbon(ctx);
                break;
        }
        
        ctx.restore();
        console.log('✅ Shape path ribbon completed');
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
    
    drawTrianglePathRibbon(ctx) {
        const size = this.shapeParameters.triangle.size;
        const cornerRadius = this.shapeParameters.triangle.cornerRadius;
        
        // Calculate triangle vertices (equilateral triangle)
        const height = size * Math.sqrt(3) / 2;
        const vertices = [
            { x: 0, y: -height * 2/3 },           // Top vertex
            { x: -size/2, y: height * 1/3 },      // Bottom left
            { x: size/2, y: height * 1/3 }        // Bottom right
        ];
        
        ctx.beginPath();
        
        if (cornerRadius > 0 && typeof ctx.arcTo === 'function') {
            // Draw triangle with rounded corners using arcTo (if supported)
            try {
                ctx.moveTo(vertices[0].x, vertices[0].y - cornerRadius);
                
                for (let i = 0; i < 3; i++) {
                    const current = vertices[i];
                    const next = vertices[(i + 1) % 3];
                    const nextNext = vertices[(i + 2) % 3];
                    
                    ctx.arcTo(next.x, next.y, nextNext.x, nextNext.y, cornerRadius);
                }
                
                ctx.closePath();
            } catch (error) {
                // Fallback to regular triangle if arcTo fails
                console.warn('Rounded triangle corners not supported, using regular triangle');
                ctx.beginPath();
                ctx.moveTo(vertices[0].x, vertices[0].y);
                ctx.lineTo(vertices[1].x, vertices[1].y);
                ctx.lineTo(vertices[2].x, vertices[2].y);
                ctx.closePath();
            }
        } else {
            // Draw regular triangle
            ctx.moveTo(vertices[0].x, vertices[0].y);
            ctx.lineTo(vertices[1].x, vertices[1].y);
            ctx.lineTo(vertices[2].x, vertices[2].y);
            ctx.closePath();
        }
        
        ctx.stroke();
    }
    
    drawCharacterRibbon(p) {
        const text = this.currentText;
        
        // Skip if no text
        if (!text || text.length === 0) {
            console.log('⚠️ No text to draw character ribbons for');
            return;
        }
        
        const rotation = this.currentRotation * (Math.PI / 180);
        
        // Calculate ribbon border width proportional to font size
        const borderWidth = this.currentFontSize * this.ribbonWidth;
        
        console.log('🎀 Drawing character ribbon borders:', {
            text: text,
            shape: this.currentShape,
            borderWidth: borderWidth,
            ribbonColor: this.ribbonColor,
            canvasSize: `${p.width}x${p.height}`
        });
        
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
        console.log('✅ Character ribbon borders completed');
    }
    
    drawRibbonForCurrentShape(ctx, text, borderWidth) {
        // Draw ribbon borders based on current shape
        switch (this.currentShape) {
            case 'circle':
                this.drawCircleRibbon(ctx, text, borderWidth);
                break;
            case 'rectangle':
                this.drawRectangleRibbon(ctx, text, borderWidth);
                break;
            case 'triangle':
                this.drawTriangleRibbon(ctx, text, borderWidth);
                break;
        }
    }
    
    drawCircleRibbon(ctx, text, borderWidth) {
        const radius = this.shapeParameters.circle.radius;
        const angleStep = (2 * Math.PI) / text.length;
        
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            this.drawSingleCharacterRibbon(ctx, text[i], x, y, angle + Math.PI / 2, borderWidth);
        }
    }
    
    drawRectangleRibbon(ctx, text, borderWidth) {
        const width = this.shapeParameters.rectangle.width;
        const height = this.shapeParameters.rectangle.height;
        const perimeter = 2 * (width + height);
        const charSpacing = perimeter / text.length;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = i * charSpacing;
            const pathPoint = this.getRectanglePathPoint(distanceAlongPerimeter, width, height);
            
            this.drawSingleCharacterRibbon(ctx, text[i], pathPoint.x, pathPoint.y, pathPoint.angle, borderWidth);
        }
    }
    
    drawTriangleRibbon(ctx, text, borderWidth) {
        const size = this.shapeParameters.triangle.size;
        const perimeter = 3 * size;
        const charSpacing = perimeter / text.length;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = i * charSpacing;
            const pathPoint = this.getTrianglePathPoint(distanceAlongPerimeter, size);
            
            this.drawSingleCharacterRibbon(ctx, text[i], pathPoint.x, pathPoint.y, pathPoint.angle, borderWidth);
        }
    }
    
    drawSingleCharacterRibbon(ctx, char, x, y, angle, borderWidth) {
        // Get character metrics for accurate border sizing
        const metrics = ctx.measureText(char);
        const charWidth = metrics.width;
        const charHeight = this.currentFontSize;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Draw rounded rectangle border behind character
        const borderPadding = borderWidth * 0.5;
        const rectWidth = charWidth + borderPadding * 2;
        const rectHeight = charHeight + borderPadding * 2;
        
        // Create rounded rectangle path
        const cornerRadius = Math.min(borderWidth * 0.3, rectWidth * 0.2, rectHeight * 0.2);
        
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            // Modern browsers with roundRect support
            ctx.roundRect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight, cornerRadius);
        } else {
            // Fallback for older browsers - draw simple rectangle
            ctx.rect(-rectWidth/2, -rectHeight/2, rectWidth, rectHeight);
        }
        ctx.fill();
        
        ctx.restore();
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
        
        // Export at original resolution, not zoomed
        this.p5Instance.save('text-ticker-export.png');
        
        console.log('✅ PNG exported successfully');
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
            
            console.log(`Starting PNG sequence export: ${totalFrames} frames at ${fps}fps`);
            
            for (let frame = 0; frame < totalFrames; frame++) {
                // Update animation (rotate text)
                const progress = frame / totalFrames;
                this.currentRotation = originalRotation + (progress * 360);
                
                // Update rotation slider to reflect current state
                this.rotationSlider.value = this.currentRotation;
                this.rotationValue.textContent = Math.round(this.currentRotation) + '°';
                
                // Render frame
                this.renderText();
                
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
            
            console.log('✅ PNG sequence exported successfully');
            
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
        
        console.log('Recording with format:', selectedFormat);
        
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
                console.log('MP4 recorded natively, downloading directly');
                this.downloadMP4(blob);
            } else {
                console.log('WebM recorded, converting to MP4 for better compatibility');
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
            
            console.log('Created recording canvas at original resolution:', recordingCanvas.width + 'x' + recordingCanvas.height);
            
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
        const radius = this.currentRadius;
        const rotation = this.currentRotation * (Math.PI / 180);
        
        ctx.save();
        
        // Center the coordinate system
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        ctx.fillStyle = this.currentTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.currentFontWeight} ${this.currentFontSize}px "${this.currentFontFamily}", sans-serif`;
        
        const angleStep = (2 * Math.PI) / text.length;
        
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
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
                console.warn('FFmpeg not found in global scope');
                this.ffmpegLoaded = false;
                return;
            }
            
            this.ffmpeg = new window.FFmpeg.FFmpeg();
            
            await this.ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
            });
            
            this.ffmpegLoaded = true;
            console.log('✅ FFmpeg loaded successfully');
        } catch (error) {
            console.warn('⚠️ FFmpeg loading failed:', error.message);
            this.ffmpegLoaded = false;
        }
    }
    
    async convertToMP4(webmBlob) {
        console.log('convertToMP4 called, ffmpegLoaded:', this.ffmpegLoaded);
        
        if (!this.ffmpegLoaded) {
            console.log('FFmpeg not loaded, falling back to WebM download');
            this.exportBtn.textContent = 'Downloading WebM...';
            this.downloadWebM(webmBlob);
            return;
        }
        
        try {
            this.exportBtn.textContent = 'Converting to MP4... (0%)';
            console.log('Starting WebM to MP4 conversion...');
            
            const arrayBuffer = await webmBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            console.log('WebM blob size:', (uint8Array.length / 1024 / 1024).toFixed(2) + 'MB');
            
            this.exportBtn.textContent = 'Converting to MP4... (25%)';
            
            await this.ffmpeg.writeFile('input.webm', uint8Array);
            console.log('Input file written to FFmpeg filesystem');
            
            this.exportBtn.textContent = 'Converting to MP4... (50%)';
            
            await this.ffmpeg.exec([
                '-i', 'input.webm',
                '-c:v', 'libx264',
                '-crf', '23',
                '-preset', 'medium',
                '-c:a', 'aac',
                'output.mp4'
            ]);
            console.log('FFmpeg conversion completed');
            
            this.exportBtn.textContent = 'Converting to MP4... (75%)';
            
            const data = await this.ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });
            console.log('MP4 blob created, size:', (mp4Blob.size / 1024 / 1024).toFixed(2) + 'MB');
            
            this.exportBtn.textContent = 'Downloading MP4...';
            this.downloadMP4(mp4Blob);
            
            // Clean up
            try {
                await this.ffmpeg.deleteFile('input.webm');
                await this.ffmpeg.deleteFile('output.mp4');
                console.log('Temporary files cleaned up');
            } catch (cleanupError) {
                console.warn('Cleanup warning:', cleanupError.message);
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
        
        console.log('✅ MP4 file downloaded successfully');
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
        
        console.log('✅ WebM file downloaded successfully');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextTickerTool();
});