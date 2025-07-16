export class UIController {
    constructor() {
        this.controls = {
            // Frame controls
            frameWidth: document.getElementById('frameWidth'),
            frameHeight: document.getElementById('frameHeight'),
            applySizeBtn: document.getElementById('applySizeBtn'),
            
            // Preset control
            presetSelect: document.getElementById('presetSelect'),
            
            // Ring controls
            radiusSlider: document.getElementById('radiusSlider'),
            radiusValue: document.getElementById('radiusValue'),
            heightSlider: document.getElementById('heightSlider'),
            heightValue: document.getElementById('heightValue'),
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue'),
            rotationXSlider: document.getElementById('rotationXSlider'),
            rotationXValue: document.getElementById('rotationXValue'),
            rotationZSlider: document.getElementById('rotationZSlider'),
            rotationZValue: document.getElementById('rotationZValue'),
            resetRotationBtn: document.getElementById('resetRotationBtn'),
            
            // Spline controls
            splineSpeedSlider: document.getElementById('splineSpeedSlider'),
            splineSpeedValue: document.getElementById('splineSpeedValue'),
            splineScaleSlider: document.getElementById('splineScaleSlider'),
            splineScaleValue: document.getElementById('splineScaleValue'),
            splineDensitySlider: document.getElementById('splineDensitySlider'),
            splineDensityValue: document.getElementById('splineDensityValue'),
            
            // Shuffle controls
            shuffleSpeedSlider: document.getElementById('shuffleSpeedSlider'),
            shuffleSpeedValue: document.getElementById('shuffleSpeedValue'),
            shuffleIntervalSlider: document.getElementById('shuffleIntervalSlider'),
            shuffleIntervalValue: document.getElementById('shuffleIntervalValue'),
            shuffleNowBtn: document.getElementById('shuffleNowBtn'),
            
            // Scale control (shared)
            scaleSlider: document.getElementById('scaleSlider'),
            scaleValue: document.getElementById('scaleValue'),
            
            // Background color control
            backgroundColorPicker: document.getElementById('backgroundColorPicker')
        };
        
        this.sections = {
            imageScaleSection: document.getElementById('imageScaleSection'),
            circlePropertiesSection: document.getElementById('circlePropertiesSection'),
            splinePropertiesSection: document.getElementById('splinePropertiesSection'),
            shufflePropertiesSection: document.getElementById('shufflePropertiesSection')
        };
        
        // Callback handlers
        this.callbacks = {};
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Frame size controls
        this.controls.applySizeBtn.addEventListener('click', () => {
            this.triggerCallback('frameSize', this.getFrameSize());
        });
        
        [this.controls.frameWidth, this.controls.frameHeight].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.triggerCallback('frameSize', this.getFrameSize());
                }
            });
            
            // Input validation - only allow numbers
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        });
        
        // Preset selector
        this.controls.presetSelect.addEventListener('change', (e) => {
            this.triggerCallback('presetChange', e.target.value);
        });
        
        // Ring controls
        this.controls.radiusSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.radiusValue.textContent = value.toFixed(1);
            this.triggerCallback('radiusChange', value);
        });
        
        this.controls.heightSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.heightValue.textContent = value.toFixed(1);
            this.triggerCallback('heightChange', value);
        });
        
        this.controls.speedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.speedValue.textContent = value.toFixed(1);
            this.triggerCallback('speedChange', value);
        });
        
        this.controls.rotationXSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.controls.rotationXValue.textContent = `${value}°`;
            this.triggerCallback('rotationXChange', value);
        });
        
        this.controls.rotationZSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.controls.rotationZValue.textContent = `${value}°`;
            this.triggerCallback('rotationZChange', value);
        });
        
        this.controls.resetRotationBtn.addEventListener('click', () => {
            this.resetRotationSliders();
            this.triggerCallback('resetRotation');
        });
        
        // Spline controls
        this.controls.splineSpeedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.splineSpeedValue.textContent = value.toString();
            this.triggerCallback('splineSpeedChange', value);
        });
        
        this.controls.splineScaleSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.splineScaleValue.textContent = value.toFixed(1);
            this.triggerCallback('splineScaleChange', value);
        });
        
        this.controls.splineDensitySlider.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            this.controls.splineDensityValue.textContent = value.toString();
            this.triggerCallback('splineDensityChange', value);
        });
        
        this.controls.splineDensitySlider.addEventListener('input', (e) => {
            this.controls.splineDensityValue.textContent = e.target.value;
        });
        
        // Shuffle controls
        this.controls.shuffleSpeedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.shuffleSpeedValue.textContent = value.toFixed(1);
            this.triggerCallback('shuffleSpeedChange', value);
        });
        
        this.controls.shuffleIntervalSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.shuffleIntervalValue.textContent = value.toFixed(1) + 's';
            this.triggerCallback('shuffleIntervalChange', value);
        });
        
        this.controls.shuffleNowBtn.addEventListener('click', () => {
            this.triggerCallback('shuffleNow');
        });
        
        // Scale control (shared across modes)
        this.controls.scaleSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.controls.scaleValue.textContent = value.toFixed(1);
            this.triggerCallback('scaleChange', value);
        });
        
        // Background color control
        this.controls.backgroundColorPicker.addEventListener('change', (e) => {
            this.triggerCallback('backgroundColorChange', e.target.value);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.triggerCallback('windowResize');
        });
    }
    
    // UI State Management
    showRingControls() {
        this.sections.imageScaleSection.style.display = 'block';
        this.sections.circlePropertiesSection.style.display = 'block';
        this.sections.splinePropertiesSection.style.display = 'none';
        this.sections.shufflePropertiesSection.style.display = 'none';
    }
    
    showSplineControls() {
        this.sections.imageScaleSection.style.display = 'none';
        this.sections.circlePropertiesSection.style.display = 'none';
        this.sections.splinePropertiesSection.style.display = 'block';
        this.sections.shufflePropertiesSection.style.display = 'none';
    }
    
    showShuffleControls() {
        this.sections.imageScaleSection.style.display = 'block';
        this.sections.circlePropertiesSection.style.display = 'none';
        this.sections.splinePropertiesSection.style.display = 'none';
        this.sections.shufflePropertiesSection.style.display = 'block';
    }
    
    resetRotationSliders() {
        this.controls.rotationXSlider.value = 0;
        this.controls.rotationZSlider.value = 0;
        this.controls.rotationXValue.textContent = '0°';
        this.controls.rotationZValue.textContent = '0°';
    }
    
    // Getters
    getFrameSize() {
        const width = parseInt(this.controls.frameWidth.value) || 800;
        const height = parseInt(this.controls.frameHeight.value) || 600;
        
        // Clamp values to reasonable limits
        const clampedWidth = Math.max(200, Math.min(2000, width));
        const clampedHeight = Math.max(150, Math.min(1500, height));
        
        // Update input fields with clamped values
        this.controls.frameWidth.value = clampedWidth;
        this.controls.frameHeight.value = clampedHeight;
        
        return { width: clampedWidth, height: clampedHeight };
    }
    
    getControlValues() {
        return {
            radius: parseFloat(this.controls.radiusSlider.value),
            height: parseFloat(this.controls.heightSlider.value),
            speed: parseFloat(this.controls.speedSlider.value),
            scale: parseFloat(this.controls.scaleSlider.value),
            rotationX: parseInt(this.controls.rotationXSlider.value),
            rotationZ: parseInt(this.controls.rotationZSlider.value),
            splineSpeed: parseFloat(this.controls.splineSpeedSlider.value),
            splineScale: parseFloat(this.controls.splineScaleSlider.value),
            splineDensity: parseInt(this.controls.splineDensitySlider.value),
            shuffleSpeed: parseFloat(this.controls.shuffleSpeedSlider.value),
            shuffleInterval: parseFloat(this.controls.shuffleIntervalSlider.value)
        };
    }
    
    // Callback system
    on(event, callback) {
        this.callbacks[event] = callback;
    }
    
    triggerCallback(event, data = null) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }
} 