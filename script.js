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
        this.fontWeightSlider = document.getElementById('fontWeightSlider');
        this.fontWeightValue = document.getElementById('fontWeightValue');
        
        // Preset control
        this.presetSelect = document.getElementById('presetSelect');
        
        // Shape controls
        this.radiusSlider = document.getElementById('radiusSlider');
        this.radiusValue = document.getElementById('radiusValue');
        this.rotationSlider = document.getElementById('rotationSlider');
        this.rotationValue = document.getElementById('rotationValue');
        
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
        this.currentRadius = 150;
        this.currentRotation = 0;
        this.currentFontFamily = "Wix Madefor Display";
        this.currentFontWeight = 500;
        
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
        
        // Initialize frame container with proper styling
        this.initFrameContainer();
        
        // Initialize manual zoom to match the slider value
        this.manualZoom = parseFloat(this.zoomSlider.value) || 1.0;
        
        this.createP5Instance();
        this.setupEventListeners();
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
        
        this.fontWeightSlider.addEventListener('input', () => {
            this.currentFontWeight = parseInt(this.fontWeightSlider.value);
            this.fontWeightValue.textContent = this.currentFontWeight;
            this.renderText();
        });
        
        // Shape controls
        this.radiusSlider.addEventListener('input', () => {
            this.currentRadius = parseFloat(this.radiusSlider.value);
            this.radiusValue.textContent = this.currentRadius;
            this.renderText();
        });
        
        this.rotationSlider.addEventListener('input', () => {
            this.currentRotation = parseFloat(this.rotationSlider.value);
            this.rotationValue.textContent = this.currentRotation + '°';
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
        
        // Draw text on circle
        this.drawTextOnCircle(p);
        
        // Draw foreground image if loaded
        if (this.foregroundImageElement) {
            p.image(this.foregroundImageElement, 0, 0, p.width, p.height);
            console.log('🖼️ Drew foreground image');
        }
        
        console.log('✅ Text rendering completed');
    }
    
    drawTextOnCircle(p) {
        const text = this.currentText;
        const radius = this.currentRadius;
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
        ctx.fillStyle = 'white';
        ctx.font = `${this.currentFontWeight} 24px "${this.currentFontFamily}", sans-serif`;
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
        
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${this.currentFontWeight} 24px "${this.currentFontFamily}", sans-serif`;
        
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