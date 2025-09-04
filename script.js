// Text Ticker Tool Script - Typography on path rendering tool

class TextTickerTool {
    constructor() {
        this.frameContainer = document.getElementById('frameContainer');
        this.widthInput = document.getElementById('frameWidth');
        this.heightInput = document.getElementById('frameHeight');
        this.applySizeBtn = document.getElementById('applySizeBtn');
        
        // Text input control
        this.textInput = document.getElementById('textInput');
        
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
        this.exportFormatSelect = document.getElementById('exportFormatSelect');
        this.exportDurationSlider = document.getElementById('exportDurationSlider');
        this.exportDurationValue = document.getElementById('exportDurationValue');
        this.exportProgressContainer = document.getElementById('exportProgressContainer');
        this.exportProgress = document.getElementById('exportProgress');
        this.exportProgressText = document.getElementById('exportProgressText');
        this.startExport = document.getElementById('startExport');
        
        // Help modal elements
        this.helpModal = document.getElementById('helpModal');
        this.helpIcon = document.getElementById('helpIcon');
        this.closeHelpModal = document.getElementById('closeHelpModal');
        
        // Canvas and rendering properties
        this.canvas = null;
        this.ctx = null;
        this.currentZoom = 1.0;
        this.currentText = "Sample Text";
        this.currentRadius = 150;
        this.currentRotation = 0;
        
        // Initialize the tool
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.updateFrameSize();
        this.renderText();
    }
    
    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'textCanvas';
        this.ctx = this.canvas.getContext('2d');
        
        // Clear container and add canvas
        this.frameContainer.innerHTML = '';
        this.frameContainer.appendChild(this.canvas);
        
        // Set default canvas size
        this.canvas.width = parseInt(this.widthInput.value);
        this.canvas.height = parseInt(this.heightInput.value);
        
        // Apply zoom to container
        this.updateZoom();
    }
    
    setupEventListeners() {
        // Frame size controls
        this.applySizeBtn.addEventListener('click', () => this.updateFrameSize());
        
        // Text input
        this.textInput.addEventListener('input', () => {
            this.currentText = this.textInput.value || "Sample Text";
            this.renderText();
        });
        
        // Shape controls
        this.radiusSlider.addEventListener('input', () => {
            this.currentRadius = parseInt(this.radiusSlider.value);
            this.radiusValue.textContent = this.currentRadius;
            this.renderText();
        });
        
        this.rotationSlider.addEventListener('input', () => {
            this.currentRotation = parseInt(this.rotationSlider.value);
            this.rotationValue.textContent = this.currentRotation + '°';
            this.renderText();
        });
        
        // Background color
        this.backgroundColorPicker.addEventListener('change', () => this.renderText());
        
        // Alpha background toggle
        this.alphaBackgroundCheckbox.addEventListener('change', () => {
            this.isAlphaBackground = this.alphaBackgroundCheckbox.checked;
            this.alphaBackgroundToggleText.textContent = this.isAlphaBackground ? 'ON' : 'OFF';
            this.renderText();
        });
        
        // Background image upload
        this.bgUploadButton.addEventListener('click', () => this.bgImageInput.click());
        this.bgImageInput.addEventListener('change', (e) => this.handleBackgroundImageUpload(e));
        
        // Foreground image upload  
        this.fgUploadButton.addEventListener('click', () => this.fgImageInput.click());
        this.fgImageInput.addEventListener('change', (e) => this.handleForegroundImageUpload(e));
        
        // Zoom controls
        this.zoomSlider.addEventListener('input', () => this.updateZoom());
        this.resetZoomBtn.addEventListener('click', () => this.resetZoom());
        
        // Export functionality
        this.exportBtn.addEventListener('click', () => this.showExportModal());
        this.closeExportModal.addEventListener('click', () => this.hideExportModal());
        this.cancelExport.addEventListener('click', () => this.hideExportModal());
        this.startExport.addEventListener('click', () => this.startExportProcess());
        
        // Help modal
        this.helpIcon.addEventListener('click', () => this.showHelpModal());
        this.closeHelpModal.addEventListener('click', () => this.hideHelpModal());
        
        // Click outside modals to close
        window.addEventListener('click', (e) => {
            if (e.target === this.exportModal) this.hideExportModal();
            if (e.target === this.helpModal) this.hideHelpModal();
        });
    }
    
    updateFrameSize() {
        const width = parseInt(this.widthInput.value);
        const height = parseInt(this.heightInput.value);
        
        if (width > 0 && height > 0) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.renderText();
        }
    }
    
    updateZoom() {
        this.currentZoom = parseFloat(this.zoomSlider.value);
        this.zoomValue.textContent = Math.round(this.currentZoom * 100) + '%';
        this.frameContainer.style.transform = `scale(${this.currentZoom})`;
    }
    
    resetZoom() {
        this.zoomSlider.value = '1.0';
        this.updateZoom();
    }
    
    renderText() {
        if (!this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw background
        this.drawBackground();
        
        // Draw background image if exists
        if (this.backgroundImageElement) {
            this.ctx.drawImage(this.backgroundImageElement, 0, 0, width, height);
        }
        
        // Draw text on circular path
        this.drawTextOnCircle();
        
        // Draw foreground image if exists
        if (this.foregroundImageElement) {
            this.ctx.drawImage(this.foregroundImageElement, 0, 0, width, height);
        }
    }
    
    drawBackground() {
        if (this.isAlphaBackground) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.fillStyle = this.backgroundColorPicker.value;
        this.ctx.fillRect(0, 0, width, height);
    }
    
    drawTextOnCircle() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = this.currentRadius;
        const text = this.currentText;
        const rotationOffset = (this.currentRotation * Math.PI) / 180;
        
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const angleStep = (2 * Math.PI) / text.length;
        
        for (let i = 0; i < text.length; i++) {
            const angle = i * angleStep + rotationOffset;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle + Math.PI / 2);
            this.ctx.fillText(text[i], 0, 0);
            this.ctx.restore();
        }
    }
    
    handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.backgroundImageDataUrl = e.target.result;
                const img = new Image();
                img.onload = () => {
                    this.backgroundImageElement = img;
                    this.renderText();
                };
                img.src = this.backgroundImageDataUrl;
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
                const img = new Image();
                img.onload = () => {
                    this.foregroundImageElement = img;
                    this.renderText();
                };
                img.src = this.foregroundImageDataUrl;
            };
            reader.readAsDataURL(file);
        }
    }
    
    showExportModal() {
        this.exportModal.style.display = 'flex';
    }
    
    hideExportModal() {
        this.exportModal.style.display = 'none';
        this.exportProgressContainer.style.display = 'none';
    }
    
    showHelpModal() {
        this.helpModal.style.display = 'flex';
    }
    
    hideHelpModal() {
        this.helpModal.style.display = 'none';
    }
    
    async startExportProcess() {
        const format = this.exportFormatSelect.value;
        
        if (format === 'png') {
            this.exportPNG();
        } else if (format === 'mp4') {
            await this.exportMP4();
        }
    }
    
    exportPNG() {
        const link = document.createElement('a');
        link.download = 'text-ticker-export.png';
        link.href = this.canvas.toDataURL();
        link.click();
        this.hideExportModal();
    }
    
    async exportMP4() {
        // Placeholder for MP4 export functionality
        // This would require implementing animation frames and FFmpeg integration
        alert('MP4 export will be implemented in the next phase');
        this.hideExportModal();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextTickerTool();
});