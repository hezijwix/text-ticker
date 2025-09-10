// Frame Mode - Canvas Perimeter Text Rendering
// Handles text wrapping around canvas edges like a ticker with inset control

class FrameMode {
    constructor(textTickerTool) {
        this.tool = textTickerTool;
    }
    
    // Main frame text rendering dispatcher
    drawText(p, hideGuides = false) {
        const text = this.tool.currentText;
        const inset = this.tool.frameParameters.inset;
        const direction = this.tool.frameParameters.direction;
        const cornerStyle = this.tool.frameParameters.cornerStyle;
        
        // Use Canvas 2D API for variable font support with P5.js coordinate system
        const canvas = p.canvas;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas state
        ctx.save();
        
        // Set font properties with variable font weight
        ctx.fillStyle = this.tool.currentTextColor;
        ctx.font = `${this.tool.currentFontWeight} ${this.tool.currentFontSize}px "${this.tool.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        
        // Calculate font metrics for proper vertical centering
        const fontMetrics = ctx.measureText('Mg');
        const actualHeight = fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent;
        const xHeightOffset = this.tool.xHeightDebugOffset;
        
        // Calculate frame path
        const framePath = this.calculateFramePath(p, inset, cornerStyle);
        const totalPathLength = this.calculatePathLength(framePath);
        
        // Calculate character positions
        const charPositions = this.calculateCharacterPositions(text, totalPathLength, direction);
        
        // Render characters along frame path
        this.renderCharactersOnFrame(ctx, text, charPositions, framePath, actualHeight, xHeightOffset);
        
        // Handle ribbon rendering
        if (this.tool.ribbonMode !== 'off' && !hideGuides) {
            this.drawRibbon(ctx, text, charPositions, framePath);
        }
        
        // Draw frame guide (optional)
        if (!hideGuides && this.tool.showGuides) {
            this.drawFrameGuide(ctx, framePath);
        }
        
        // Restore canvas state
        ctx.restore();
    }
    
    // Calculate rectangular frame path around canvas with inset
    calculateFramePath(p, inset, cornerStyle) {
        const width = p.width;
        const height = p.height;
        const margin = inset;
        
        // Calculate frame boundaries
        const left = margin;
        const right = width - margin;
        const top = margin;
        const bottom = height - margin;
        
        const path = {
            segments: [],
            totalLength: 0
        };
        
        if (cornerStyle === 'sharp') {
            // Sharp corners - simple rectangle
            path.segments = [
                // Top edge (left to right)
                {
                    type: 'line',
                    start: { x: left, y: top },
                    end: { x: right, y: top },
                    length: right - left
                },
                // Right edge (top to bottom)
                {
                    type: 'line',
                    start: { x: right, y: top },
                    end: { x: right, y: bottom },
                    length: bottom - top
                },
                // Bottom edge (right to left)
                {
                    type: 'line',
                    start: { x: right, y: bottom },
                    end: { x: left, y: bottom },
                    length: right - left
                },
                // Left edge (bottom to top)
                {
                    type: 'line',
                    start: { x: left, y: bottom },
                    end: { x: left, y: top },
                    length: bottom - top
                }
            ];
        } else {
            // Rounded corners with small radius
            const cornerRadius = Math.min(20, margin / 2);
            
            path.segments = [
                // Top edge (left to right, minus corner radius)
                {
                    type: 'line',
                    start: { x: left + cornerRadius, y: top },
                    end: { x: right - cornerRadius, y: top },
                    length: (right - cornerRadius) - (left + cornerRadius)
                },
                // Top-right corner
                {
                    type: 'arc',
                    center: { x: right - cornerRadius, y: top + cornerRadius },
                    radius: cornerRadius,
                    startAngle: -Math.PI / 2,
                    endAngle: 0,
                    length: cornerRadius * Math.PI / 2
                },
                // Right edge (top to bottom, minus corner radius)
                {
                    type: 'line',
                    start: { x: right, y: top + cornerRadius },
                    end: { x: right, y: bottom - cornerRadius },
                    length: (bottom - cornerRadius) - (top + cornerRadius)
                },
                // Bottom-right corner
                {
                    type: 'arc',
                    center: { x: right - cornerRadius, y: bottom - cornerRadius },
                    radius: cornerRadius,
                    startAngle: 0,
                    endAngle: Math.PI / 2,
                    length: cornerRadius * Math.PI / 2
                },
                // Bottom edge (right to left, minus corner radius)
                {
                    type: 'line',
                    start: { x: right - cornerRadius, y: bottom },
                    end: { x: left + cornerRadius, y: bottom },
                    length: (right - cornerRadius) - (left + cornerRadius)
                },
                // Bottom-left corner
                {
                    type: 'arc',
                    center: { x: left + cornerRadius, y: bottom - cornerRadius },
                    radius: cornerRadius,
                    startAngle: Math.PI / 2,
                    endAngle: Math.PI,
                    length: cornerRadius * Math.PI / 2
                },
                // Left edge (bottom to top, minus corner radius)
                {
                    type: 'line',
                    start: { x: left, y: bottom - cornerRadius },
                    end: { x: left, y: top + cornerRadius },
                    length: (bottom - cornerRadius) - (top + cornerRadius)
                },
                // Top-left corner
                {
                    type: 'arc',
                    center: { x: left + cornerRadius, y: top + cornerRadius },
                    radius: cornerRadius,
                    startAngle: Math.PI,
                    endAngle: -Math.PI / 2,
                    length: cornerRadius * Math.PI / 2
                }
            ];
        }
        
        return path;
    }
    
    // Calculate total path length
    calculatePathLength(framePath) {
        return framePath.segments.reduce((total, segment) => total + segment.length, 0);
    }
    
    // Calculate character positions along frame path
    calculateCharacterPositions(text, totalPathLength, direction) {
        const characters = text.split('');
        const charCount = characters.length;
        
        if (charCount === 0) return [];
        
        // Calculate spacing between characters
        const spacing = totalPathLength / charCount;
        const positions = [];
        
        // Apply animation offset
        const animationOffset = (this.tool.animationOffset * totalPathLength) % totalPathLength;
        
        for (let i = 0; i < charCount; i++) {
            let t = (i * spacing + animationOffset) % totalPathLength;
            
            // Reverse direction if counterclockwise
            if (direction === 'counterclockwise') {
                t = totalPathLength - t;
            }
            
            positions.push({
                char: characters[i],
                t: t,
                normalizedT: t / totalPathLength
            });
        }
        
        return positions;
    }
    
    // Render characters along frame path
    renderCharactersOnFrame(ctx, text, charPositions, framePath, actualHeight, xHeightOffset) {
        charPositions.forEach(pos => {
            const pathPoint = this.getPointOnPath(framePath, pos.t);
            if (!pathPoint) return;
            
            ctx.save();
            
            // Move to character position
            ctx.translate(pathPoint.x, pathPoint.y);
            
            // Rotate to align with path direction
            ctx.rotate(pathPoint.angle);
            
            // Apply x-height offset for better vertical alignment
            const yOffset = -actualHeight / 2 + xHeightOffset;
            
            // Render character
            ctx.fillText(pos.char, 0, yOffset);
            
            ctx.restore();
        });
    }
    
    // Get point and angle on path at distance t
    getPointOnPath(framePath, t) {
        let currentLength = 0;
        
        for (const segment of framePath.segments) {
            if (currentLength + segment.length >= t) {
                // Found the segment
                const segmentT = (t - currentLength) / segment.length;
                return this.getPointOnSegment(segment, segmentT);
            }
            currentLength += segment.length;
        }
        
        // If we get here, wrap around to beginning
        return this.getPointOnSegment(framePath.segments[0], 0);
    }
    
    // Get point and angle on specific segment
    getPointOnSegment(segment, t) {
        if (segment.type === 'line') {
            const x = segment.start.x + (segment.end.x - segment.start.x) * t;
            const y = segment.start.y + (segment.end.y - segment.start.y) * t;
            const angle = Math.atan2(segment.end.y - segment.start.y, segment.end.x - segment.start.x);
            
            return { x, y, angle };
        } else if (segment.type === 'arc') {
            const angleRange = segment.endAngle - segment.startAngle;
            const currentAngle = segment.startAngle + angleRange * t;
            
            const x = segment.center.x + segment.radius * Math.cos(currentAngle);
            const y = segment.center.y + segment.radius * Math.sin(currentAngle);
            
            // Tangent angle is perpendicular to radius
            const angle = currentAngle + Math.PI / 2;
            
            return { x, y, angle };
        }
        
        return null;
    }
    
    // Draw ribbon around frame path
    drawRibbon(ctx, text, charPositions, framePath) {
        ctx.save();
        
        ctx.strokeStyle = this.tool.ribbonColor;
        ctx.lineWidth = this.tool.currentFontSize * this.tool.ribbonWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        switch (this.tool.ribbonMode) {
            case 'character':
                this.drawCharacterRibbons(ctx, charPositions, framePath);
                break;
            case 'shapePath':
                this.drawShapePathRibbon(ctx, framePath);
                break;
            case 'wordsBound':
                this.drawWordsBoundRibbons(ctx, text, charPositions, framePath);
                break;
        }
        
        ctx.restore();
    }
    
    // Draw individual character ribbons
    drawCharacterRibbons(ctx, charPositions, framePath) {
        const ribbonLength = this.tool.currentFontSize * 0.8;
        
        charPositions.forEach(pos => {
            const startT = Math.max(0, pos.t - ribbonLength / 2);
            const endT = Math.min(this.calculatePathLength(framePath), pos.t + ribbonLength / 2);
            
            this.drawRibbonSegment(ctx, framePath, startT, endT);
        });
    }
    
    // Draw complete shape path ribbon
    drawShapePathRibbon(ctx, framePath) {
        const totalLength = this.calculatePathLength(framePath);
        this.drawRibbonSegment(ctx, framePath, 0, totalLength);
    }
    
    // Draw word-bound ribbons
    drawWordsBoundRibbons(ctx, text, charPositions, framePath) {
        const words = text.split(/\s+/);
        let charIndex = 0;
        
        words.forEach(word => {
            if (word.length === 0) return;
            
            const wordStart = charPositions[charIndex];
            const wordEnd = charPositions[charIndex + word.length - 1];
            
            if (wordStart && wordEnd) {
                const ribbonPadding = this.tool.currentFontSize * 0.2;
                const startT = Math.max(0, wordStart.t - ribbonPadding);
                const endT = Math.min(this.calculatePathLength(framePath), wordEnd.t + ribbonPadding);
                
                this.drawRibbonSegment(ctx, framePath, startT, endT);
            }
            
            // Account for word + space
            charIndex += word.length + 1;
        });
    }
    
    // Draw ribbon segment between two points on path
    drawRibbonSegment(ctx, framePath, startT, endT) {
        ctx.beginPath();
        
        const steps = Math.max(10, (endT - startT) / 5);
        const stepSize = (endT - startT) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const t = startT + i * stepSize;
            const point = this.getPointOnPath(framePath, t);
            
            if (point) {
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
        }
        
        ctx.stroke();
    }
    
    // Draw frame guide for editing reference
    drawFrameGuide(ctx, framePath) {
        ctx.save();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        
        framePath.segments.forEach((segment, index) => {
            if (segment.type === 'line') {
                if (index === 0) {
                    ctx.moveTo(segment.start.x, segment.start.y);
                }
                ctx.lineTo(segment.end.x, segment.end.y);
            } else if (segment.type === 'arc') {
                ctx.arc(segment.center.x, segment.center.y, segment.radius, segment.startAngle, segment.endAngle);
            }
        });
        
        ctx.stroke();
        ctx.restore();
    }
    
    // Get canvas dimensions for frame calculation
    getCanvasDimensions(p) {
        return {
            width: p.width,
            height: p.height
        };
    }
    
    // Handle mouse interactions for frame mode
    handleMousePressed(p, mouseX, mouseY) {
        // Frame mode doesn't have interactive editing like spline mode
        // Could add corner handles or inset preview in future
        return false;
    }
    
    handleMouseDragged(p, mouseX, mouseY) {
        return false;
    }
    
    handleMouseReleased(p, mouseX, mouseY) {
        return false;
    }
}