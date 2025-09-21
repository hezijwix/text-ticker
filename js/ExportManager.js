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