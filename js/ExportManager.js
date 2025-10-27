// Export Manager - Handles PNG, MP4, and PNG Sequence Exports
// Manages export functionality with progress tracking and format conversion

class ExportManager {
    constructor(textTickerTool) {
        this.tool = textTickerTool;
        this.ffmpeg = null;
        this.ffmpegLoaded = false;
        this.isExporting = false;
        this.exportHistory = [];
        
        // Initialize FFmpeg
        this.initFFmpeg();
    }
    
    // Show export modal
    showExportModal() {
        this.tool.updateCurrentTextDisplay();
        this.tool.exportModal.style.display = 'flex';
        setTimeout(() => {
            this.tool.exportModal.classList.add('show');
        }, 10);
    }
    
    // Hide export modal
    hideExportModal() {
        this.tool.exportModal.style.display = 'none';
        this.tool.exportModal.classList.remove('show');
    }
    
    // Show help modal
    showHelpModal() {
        this.tool.helpModal.style.display = 'flex';
    }
    
    // Hide help modal
    hideHelpModal() {
        this.tool.helpModal.style.display = 'none';
    }
    
    // Handle export from modal
    async handleModalExport() {
        const format = this.tool.exportFormat.value;
        const duration = parseFloat(this.tool.exportDuration.value) || 3.0;

        // Validate inputs
        if (isNaN(duration) || duration <= 0) {
            alert('Please enter a valid duration (greater than 0 seconds).');
            return;
        }

        // Don't hide modal for iframe mode
        if (format === 'iframe') {
            this.generateIframeCode();
            return;
        }

        this.hideExportModal();

        try {
            if (format === 'png') {
                this.exportPNG();
            } else if (format === 'png-sequence') {
                this.exportPNGSequence(duration);
            } else {
                // Video export (MP4, WebM, Auto)
                this.tool.preferredExportFormat = format;
                this.exportVideo(duration);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    }
    
    // Export single PNG
    exportPNG() {
        try {
            // Render frame without guides for clean export
            this.tool.renderText(true); // hideGuides = true
            
            // Export at original resolution, not zoomed
            const fileName = `text-ticker-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
            this.tool.p5Instance.save(fileName);
            
            // Restore guides after export
            this.tool.renderText(); // hideGuides = false
            
            // Add to export history if modular system is available
            this.addToExportHistory('PNG', fileName);
        } catch (error) {
            console.error('PNG export failed:', error);
            alert('PNG export failed. Please try again.');
        }
    }
    
    // Export PNG sequence for animation
    async exportPNGSequence(durationSeconds) {
        if (this.isExporting) return;
        this.isExporting = true;
        
        try {
            this.tool.exportBtn.textContent = 'Exporting PNGs...';
            this.tool.exportBtn.disabled = true;
            
            const frameRate = 60;
            const totalFrames = Math.ceil(durationSeconds * frameRate);
            const images = [];
            const originalAnimationSpeed = this.tool.animationSpeed;
            const originalAnimationOffset = this.tool.animationOffset;
            
            // Calculate animation parameters based on actual animation speed
            // Preview uses: animationSpeed * 60 degrees/second
            const totalRotation = this.tool.animationSpeed * 60 * durationSeconds;
            const degreesPerFrame = totalRotation / totalFrames;
            
            for (let frame = 0; frame < totalFrames; frame++) {
                // Update animation offset for this frame
                this.tool.animationOffset = (originalAnimationOffset + frame * degreesPerFrame) % 360;
                
                // Force re-render with current frame
                this.tool.renderText(true); // Hide guides for export
                
                // Capture frame as blob
                const canvas = this.tool.p5Instance.canvas;
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/png');
                });
                
                images.push({
                    name: `frame_${String(frame + 1).padStart(4, '0')}.png`,
                    blob: blob
                });
                
                // Update progress
                const progressPercent = Math.round(((frame + 1) / totalFrames) * 100);
                this.tool.exportBtn.textContent = `Exporting PNGs... ${progressPercent}%`;
                
                // Allow UI updates
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // Create and download ZIP file
            const zip = new JSZip();
            for (const image of images) {
                zip.file(image.name, image.blob);
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const fileName = `text-ticker-sequence-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
            
            // Download ZIP file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
            // Restore original animation state
            this.tool.animationOffset = originalAnimationOffset;
            this.tool.renderText(); // Restore guides
            
            // Add to export history
            this.addToExportHistory('PNG Sequence', fileName);
            
        } catch (error) {
            console.error('PNG sequence export failed:', error);
            alert('PNG sequence export failed. Please try again.');
        } finally {
            this.tool.exportBtn.textContent = 'Export';
            this.tool.exportBtn.disabled = false;
            this.isExporting = false;
        }
    }
    
    // Export video (MP4/WebM)
    async exportVideo(durationSeconds) {
        if (this.isExporting) return;
        this.isExporting = true;
        
        try {
            this.tool.exportBtn.textContent = 'Recording...';
            this.tool.exportBtn.disabled = true;
            
            const frameRate = 30; // Reduced for better performance
            const totalFrames = Math.ceil(durationSeconds * frameRate);
            const recordedFrames = [];
            const originalAnimationOffset = this.tool.animationOffset;
            
            // Calculate animation parameters based on actual animation speed
            // Preview uses: animationSpeed * 60 degrees/second
            const totalRotation = this.tool.animationSpeed * 60 * durationSeconds;
            const degreesPerFrame = totalRotation / totalFrames;
            
            for (let frame = 0; frame < totalFrames; frame++) {
                // Update animation offset for this frame
                this.tool.animationOffset = (originalAnimationOffset + frame * degreesPerFrame) % 360;
                
                // Force re-render with current frame (hide guides for clean export)
                this.tool.renderText(true);
                
                // Capture frame
                const canvas = this.tool.p5Instance.canvas;
                const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
                recordedFrames.push(imageData);
                
                // Allow UI updates
                await new Promise(resolve => setTimeout(resolve, 16));
            }
            
            // Create video from frames
            this.tool.exportBtn.textContent = 'Creating video...';
            const videoBlob = await this.createVideoFromFrames(recordedFrames, frameRate, durationSeconds);
            
            // Restore original state
            this.tool.animationOffset = originalAnimationOffset;
            this.tool.renderText();
            
            // Handle video format conversion and download
            const selectedFormat = this.tool.preferredExportFormat;
            const isMP4 = selectedFormat.includes('mp4') || selectedFormat === 'auto';
            
            if (isMP4 && !this.ffmpegLoaded) {
                // Try to load FFmpeg for auto mode, fallback to WebM if failed
                if (selectedFormat === 'auto' && this.ffmpeg) {
                    try {
                        this.tool.exportBtn.textContent = 'Loading MP4 converter...';
                        await this.ffmpeg.load();
                        this.ffmpegLoaded = true;
                        await this.convertToMP4(videoBlob);
                        return;
                    } catch (error) {
                        console.warn('Auto mode: FFmpeg failed, falling back to WebM:', error);
                    }
                }
                // Fallback to WebM if FFmpeg not loaded or failed - ensure WebM format
                this.downloadVideo(videoBlob, 'webm');
            } else if (isMP4) {
                await this.convertToMP4(videoBlob);
            } else {
                this.downloadVideo(videoBlob, 'webm');
            }
            
        } catch (error) {
            console.error('Video export failed:', error);
            alert('Video export failed. Please try again.');
        } finally {
            this.tool.exportBtn.textContent = 'Export';
            this.tool.exportBtn.disabled = false;
            this.isExporting = false;
        }
    }
    
    // Create video blob from frame data
    async createVideoFromFrames(frames, frameRate, duration) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const firstFrame = frames[0];
            
            canvas.width = firstFrame.width;
            canvas.height = firstFrame.height;
            
            const stream = canvas.captureStream(frameRate);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9',
                videoBitsPerSecond: 5000000
            });
            
            const recordedChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, {
                    type: 'video/webm'
                });
                resolve(blob);
            };
            
            mediaRecorder.onerror = (error) => {
                reject(error);
            };
            
            mediaRecorder.start();
            
            let currentFrame = 0;
            const frameInterval = setInterval(() => {
                if (currentFrame < frames.length) {
                    ctx.putImageData(frames[currentFrame], 0, 0);
                    currentFrame++;
                } else {
                    clearInterval(frameInterval);
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 100);
                }
            }, 1000 / frameRate);
        });
    }
    
    // Initialize FFmpeg for MP4 conversion
    async initFFmpeg() {
        try {
            // Check if FFmpeg is available (v0.10.x API)
            if (typeof FFmpeg !== 'undefined' && FFmpeg.createFFmpeg) {
                this.ffmpeg = FFmpeg.createFFmpeg({
                    log: false,
                    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
                });
                // Don't load immediately to save resources
                this.ffmpegLoaded = false;
                console.log('FFmpeg available, will load on demand for MP4 conversion');
            } else {
                console.warn('FFmpeg not available, will fallback to WebM');
            }
        } catch (error) {
            console.warn('FFmpeg initialization failed:', error);
            this.ffmpegLoaded = false;
        }
    }
    
    // Convert WebM to MP4 using FFmpeg
    async convertToMP4(webmBlob) {
        if (!this.ffmpeg) {
            this.downloadVideo(webmBlob, 'webm');
            return;
        }
        
        try {
            if (!this.ffmpegLoaded) {
                this.tool.exportBtn.textContent = 'Loading MP4 converter...';
                await this.ffmpeg.load();
                this.ffmpegLoaded = true;
            }
            
            this.tool.exportBtn.textContent = 'Converting to MP4... (0%)';
            
            // Write input file (v0.10.x API)
            const webmData = new Uint8Array(await webmBlob.arrayBuffer());
            await this.ffmpeg.FS('writeFile', 'input.webm', webmData);
            
            this.tool.exportBtn.textContent = 'Converting to MP4... (25%)';
            
            // Convert to MP4
            await this.ffmpeg.run(
                '-i', 'input.webm',
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '23',
                'output.mp4'
            );
            
            this.tool.exportBtn.textContent = 'Converting to MP4... (75%)';
            
            // Read output file (v0.10.x API)
            const mp4Data = this.ffmpeg.FS('readFile', 'output.mp4');
            const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
            
            this.tool.exportBtn.textContent = 'Downloading MP4...';
            this.downloadVideo(mp4Blob, 'mp4');
            
            // Clean up
            this.ffmpeg.FS('unlink', 'input.webm');
            this.ffmpeg.FS('unlink', 'output.mp4');
            
        } catch (error) {
            console.error('MP4 conversion failed:', error);
            console.warn('Auto mode: MP4 conversion failed, falling back to WebM');
            this.downloadVideo(webmBlob, 'webm');
        }
    }
    
    // Download video file
    downloadVideo(blob, format) {
        const fileName = `text-ticker-video-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${format}`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        // Add to export history
        this.addToExportHistory(`Video (${format.toUpperCase()})`, fileName);
        
        this.tool.exportBtn.textContent = 'Export';
        this.tool.exportBtn.disabled = false;
        this.isExporting = false;
    }
    
    // Generate iframe embed code
    generateIframeCode() {
        try {
            // Capture complete animation state
            const settings = this.captureAnimationState();

            // Generate standalone HTML
            const iframeCode = this.createStandaloneHTML(settings);

            // Copy to clipboard
            this.copyToClipboard(iframeCode);

        } catch (error) {
            console.error('iframe generation failed:', error);
            alert('Failed to generate iframe code. Please try again.');
        }
    }

    // Capture complete animation state
    captureAnimationState() {
        const tool = this.tool;

        // Capture all animation parameters
        const settings = {
            // Canvas dimensions
            width: tool.currentFrameWidth,
            height: tool.currentFrameHeight,

            // Text settings
            text: tool.currentText,
            fontFamily: tool.currentFontFamily,
            fontSize: tool.currentFontSize,
            fontWeight: tool.currentFontWeight,
            textColor: tool.currentTextColor,
            xHeightAdjustment: tool.xHeightAdjustment,

            // Path mode and settings
            pathMode: tool.currentPathMode,

            // Shape mode settings
            shapeType: tool.currentShape,
            circleRadius: tool.shapeParameters.circle.radius,
            rectWidth: tool.shapeParameters.rectangle.width,
            rectHeight: tool.shapeParameters.rectangle.height,
            rectCornerRadius: tool.shapeParameters.rectangle.cornerRadius,
            rotation: tool.currentRotation,

            // Spline mode settings
            splinePoints: tool.splinePoints,
            curveType: tool.curveType,

            // Ribbon settings
            ribbonMode: tool.ribbonMode,
            boundsType: tool.boundsType,
            ribbonWidth: tool.ribbonWidth,
            ribbonColor: tool.ribbonColor,
            strokeWidth: tool.strokeWidth,
            strokeColor: tool.strokeColor,

            // Animation settings
            animationMode: tool.animationMode,
            animationSpeed: tool.animationSpeed,
            animationDirection: tool.animationDirection,
            pulseEase: tool.pulseEase,
            pulseDistance: tool.pulseDistance,
            pulseTime: tool.pulseTime,
            pulseHold: tool.pulseHold,

            // Background settings
            backgroundColor: tool.currentBackgroundColor,
            isTransparent: tool.isTransparentBackground,

            // Convert background/foreground images to base64
            backgroundImage: tool.backgroundImage ? tool.backgroundImage.canvas.toDataURL('image/png') : null,
            foregroundImage: tool.foregroundImage ? tool.foregroundImage.canvas.toDataURL('image/png') : null
        };

        return settings;
    }

    // Create standalone HTML with embedded animation
    createStandaloneHTML(settings) {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Ticker Animation</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400..800&family=Inter:wght@400..700&family=Roboto:wght@400..700&display=swap" rel="stylesheet">

    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
        }
        canvas {
            display: block;
            max-width: 100%;
            max-height: 100vh;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        // Animation settings
        const settings = ${JSON.stringify(settings, null, 4)};

        // Canvas setup
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = settings.width;
        canvas.height = settings.height;

        // Load images if present
        let bgImage = null;
        let fgImage = null;

        if (settings.backgroundImage) {
            bgImage = new Image();
            bgImage.src = settings.backgroundImage;
        }

        if (settings.foregroundImage) {
            fgImage = new Image();
            fgImage.src = settings.foregroundImage;
        }

        // Animation state
        let animationOffset = 0;
        let pulseStartTime = Date.now();
        const targetFPS = 60;
        const frameDuration = 1000 / targetFPS;
        let lastFrameTime = 0;

        // Helper: Draw rounded rectangle
        function drawRoundedRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        // Helper: Interpolate spline points (Catmull-Rom)
        function interpolateSplinePoint(t, points) {
            if (points.length < 2) return { x: 0, y: 0 };

            if (settings.curveType === 'linear') {
                const segmentCount = points.length - 1;
                const segmentIndex = Math.floor(t * segmentCount);
                const localT = (t * segmentCount) - segmentIndex;

                const p1 = points[Math.min(segmentIndex, points.length - 1)];
                const p2 = points[Math.min(segmentIndex + 1, points.length - 1)];

                return {
                    x: p1.x + (p2.x - p1.x) * localT,
                    y: p1.y + (p2.y - p1.y) * localT
                };
            }

            // Catmull-Rom spline
            const segmentCount = points.length - 1;
            const segmentIndex = Math.floor(t * segmentCount);
            const localT = (t * segmentCount) - segmentIndex;

            const p0 = points[Math.max(0, segmentIndex - 1)];
            const p1 = points[segmentIndex];
            const p2 = points[Math.min(points.length - 1, segmentIndex + 1)];
            const p3 = points[Math.min(points.length - 1, segmentIndex + 2)];

            const t2 = localT * localT;
            const t3 = t2 * localT;

            const x = 0.5 * (
                (2 * p1.x) +
                (-p0.x + p2.x) * localT +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
            );

            const y = 0.5 * (
                (2 * p1.y) +
                (-p0.y + p2.y) * localT +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
            );

            return { x, y };
        }

        // Easing function for pulse animation
        function easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        }

        // Update animation based on mode
        function updateAnimation(currentTime) {
            if (settings.animationMode === 'linear') {
                const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
                const direction = settings.animationDirection === 'clockwise' ? 1 : -1;
                animationOffset += settings.animationSpeed * 60 * deltaTime * direction;
                animationOffset = animationOffset % 360;
            } else if (settings.animationMode === 'pulse') {
                const elapsed = currentTime - pulseStartTime;
                const cycle = (settings.pulseTime * 1000) + (settings.pulseHold * 1000);
                const phase = (elapsed % cycle) / cycle;

                if (phase <= settings.pulseTime * 1000 / cycle) {
                    const t = phase / (settings.pulseTime * 1000 / cycle);
                    const eased = easeInOutQuart(t);
                    animationOffset = eased * settings.pulseDistance * 360;
                } else {
                    animationOffset = settings.pulseDistance * 360;
                }
            }
        }

        // Main render function
        function render(currentTime) {
            // Clear or fill background
            if (settings.isTransparent) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = settings.backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw background image
            if (bgImage && bgImage.complete) {
                ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
            }

            // Update animation
            updateAnimation(currentTime);

            // Render text based on path mode
            if (settings.pathMode === 'shape') {
                renderShapeMode();
            } else if (settings.pathMode === 'spline') {
                renderSplineMode();
            }

            // Draw foreground image
            if (fgImage && fgImage.complete) {
                ctx.drawImage(fgImage, 0, 0, canvas.width, canvas.height);
            }
        }

        // Render shape mode (circle/rectangle)
        function renderShapeMode() {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((settings.rotation + animationOffset) * Math.PI / 180);

            // Set font
            ctx.font = \`\${settings.fontWeight} \${settings.fontSize}px "\${settings.fontFamily}", sans-serif\`;
            ctx.fillStyle = settings.textColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (settings.shapeType === 'circle') {
                renderCircleText();
            } else if (settings.shapeType === 'rectangle') {
                renderRectangleText();
            }

            ctx.restore();
        }

        // Render text on circle
        function renderCircleText() {
            const radius = settings.circleRadius;
            const characters = settings.text.split('');
            const totalChars = characters.length;

            for (let i = 0; i < totalChars; i++) {
                const angle = (i / totalChars) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle + Math.PI / 2);

                if (settings.strokeWidth > 0) {
                    ctx.strokeStyle = settings.strokeColor;
                    ctx.lineWidth = settings.strokeWidth;
                    ctx.strokeText(characters[i], 0, settings.xHeightAdjustment);
                }

                ctx.fillText(characters[i], 0, settings.xHeightAdjustment);
                ctx.restore();
            }
        }

        // Render text on rectangle
        function renderRectangleText() {
            const w = settings.rectWidth;
            const h = settings.rectHeight;
            const r = settings.rectCornerRadius;

            // Calculate perimeter and distribute text
            const perimeter = 2 * (w + h) - 8 * r + 2 * Math.PI * r;
            const characters = settings.text.split('');
            const charSpacing = perimeter / characters.length;

            let currentDist = 0;

            for (let i = 0; i < characters.length; i++) {
                const pos = getPositionOnRectangle(currentDist, w, h, r);

                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.rotate(pos.angle);

                if (settings.strokeWidth > 0) {
                    ctx.strokeStyle = settings.strokeColor;
                    ctx.lineWidth = settings.strokeWidth;
                    ctx.strokeText(characters[i], 0, settings.xHeightAdjustment);
                }

                ctx.fillText(characters[i], 0, settings.xHeightAdjustment);
                ctx.restore();

                currentDist += charSpacing;
            }
        }

        // Get position on rectangle path
        function getPositionOnRectangle(dist, w, h, r) {
            const halfW = w / 2;
            const halfH = h / 2;
            const topEdge = w - 2 * r;
            const rightEdge = h - 2 * r;

            // Simplified rectangle positioning
            const perimeter = 2 * (w + h);
            const t = (dist / perimeter) % 1;

            let x, y, angle;

            if (t < 0.25) {
                const s = t * 4;
                x = -halfW + s * w;
                y = -halfH;
                angle = 0;
            } else if (t < 0.5) {
                const s = (t - 0.25) * 4;
                x = halfW;
                y = -halfH + s * h;
                angle = Math.PI / 2;
            } else if (t < 0.75) {
                const s = (t - 0.5) * 4;
                x = halfW - s * w;
                y = halfH;
                angle = Math.PI;
            } else {
                const s = (t - 0.75) * 4;
                x = -halfW;
                y = halfH - s * h;
                angle = -Math.PI / 2;
            }

            return { x, y, angle };
        }

        // Render spline mode
        function renderSplineMode() {
            if (settings.splinePoints.length < 2) return;

            const characters = settings.text.split('');
            const totalChars = characters.length;

            ctx.font = \`\${settings.fontWeight} \${settings.fontSize}px "\${settings.fontFamily}", sans-serif\`;
            ctx.fillStyle = settings.textColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < totalChars; i++) {
                const t = ((i / totalChars) + (animationOffset / 360)) % 1;
                const pos = interpolateSplinePoint(t, settings.splinePoints);
                const nextT = ((i / totalChars) + 0.01 + (animationOffset / 360)) % 1;
                const nextPos = interpolateSplinePoint(nextT, settings.splinePoints);

                const angle = Math.atan2(nextPos.y - pos.y, nextPos.x - pos.x);

                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.rotate(angle + Math.PI / 2);

                if (settings.strokeWidth > 0) {
                    ctx.strokeStyle = settings.strokeColor;
                    ctx.lineWidth = settings.strokeWidth;
                    ctx.strokeText(characters[i], 0, settings.xHeightAdjustment);
                }

                ctx.fillText(characters[i], 0, settings.xHeightAdjustment);
                ctx.restore();
            }
        }

        // Animation loop with FPS control
        function animate(currentTime) {
            if (currentTime - lastFrameTime >= frameDuration) {
                render(currentTime);
                lastFrameTime = currentTime;
            }
            requestAnimationFrame(animate);
        }

        // Start animation
        const imagesToLoad = [];
        if (bgImage) imagesToLoad.push(bgImage);
        if (fgImage) imagesToLoad.push(fgImage);

        if (imagesToLoad.length > 0) {
            let loadedCount = 0;
            imagesToLoad.forEach(img => {
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === imagesToLoad.length) {
                        requestAnimationFrame(animate);
                    }
                };
            });
        } else {
            requestAnimationFrame(animate);
        }
    </script>
</body>
</html>`;
    }

    // Copy to clipboard
    copyToClipboard(code) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code)
                .then(() => {
                    alert('iframe embed code copied to clipboard! You can now paste it into your webpage.');
                    this.hideExportModal();
                })
                .catch(err => {
                    console.error('Clipboard API failed:', err);
                    this.fallbackCopyMethod(code);
                });
        } else {
            this.fallbackCopyMethod(code);
        }
    }

    // Fallback copy method for older browsers
    fallbackCopyMethod(code) {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            alert('iframe embed code copied to clipboard! You can now paste it into your webpage.');
            this.hideExportModal();
        } catch (err) {
            console.error('Fallback copy failed:', err);
            prompt('Copy this iframe code manually:', code);
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // Add export to history (for modular system)
    addToExportHistory(format, filename) {
        const exportEntry = {
            timestamp: new Date().toISOString(),
            format: format,
            filename: filename,
            text: this.tool.currentText,
            settings: {
                pathMode: this.tool.currentPathMode,
                shape: this.tool.currentShape,
                fontFamily: this.tool.currentFontFamily,
                fontSize: this.tool.currentFontSize,
                fontWeight: this.tool.currentFontWeight
            }
        };
        
        this.exportHistory.unshift(exportEntry);
        
        // Keep only last 10 exports
        if (this.exportHistory.length > 10) {
            this.exportHistory = this.exportHistory.slice(0, 10);
        }
        
        console.log(`🎬 Export completed: ${format} - ${filename}`);
    }
    
    // Get export history
    getExportHistory() {
        return this.exportHistory;
    }
    
    // Check if currently exporting
    isCurrentlyExporting() {
        return this.isExporting;
    }
    
    // Cancel current export (if possible)
    cancelExport() {
        if (this.isExporting) {
            this.isExporting = false;
            this.tool.exportBtn.textContent = 'Export';
            this.tool.exportBtn.disabled = false;
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}