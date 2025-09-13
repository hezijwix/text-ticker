// Shape Mode - Circle and Rectangle Path Rendering
// Handles all geometric shape-based text path calculations and rendering

class ShapeMode {
    constructor(textTickerTool) {
        this.tool = textTickerTool;
    }
    
    // Main shape text rendering dispatcher
    drawText(p, hideGuides = false) {
        switch (this.tool.currentShape) {
            case 'circle':
                return this.drawTextOnCircle(p);
            case 'rectangle':
                return this.drawTextOnRectangle(p);
            default:
                console.warn('Unknown shape type:', this.tool.currentShape);
        }
    }
    
    // Circle path text rendering
    drawTextOnCircle(p) {
        const text = this.tool.currentText;
        const radius = this.tool.shapeParameters.circle.radius;
        const rotation = this.tool.currentRotation * (Math.PI / 180);
        
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
        ctx.fillStyle = this.tool.currentTextColor;
        ctx.font = `${this.tool.currentFontWeight} ${this.tool.currentFontSize}px "${this.tool.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic'; // Changed from 'middle' for better x-height alignment
        
        // Calculate font metrics for proper vertical centering
        const metrics = ctx.measureText('Mg'); // Use letters with ascenders and descenders
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent; // Center based on actual glyph bounds
        const xHeightOffset = baseXHeightOffset + this.tool.xHeightDebugOffset; // Add debug adjustment
        
        const angleStep = (2 * Math.PI) / text.length;
        // Convert animation offset from degrees to radians and apply to character positioning
        const animationOffsetRadians = (this.tool.animationOffset * Math.PI) / 180;
        
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
    
    // Rectangle path text rendering
    drawTextOnRectangle(p) {
        const text = this.tool.currentText;
        const width = this.tool.shapeParameters.rectangle.width;
        const height = this.tool.shapeParameters.rectangle.height;
        const cornerRadius = this.tool.shapeParameters.rectangle.cornerRadius;
        const rotation = this.tool.currentRotation * (Math.PI / 180);
        
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
        ctx.fillStyle = this.tool.currentTextColor;
        ctx.font = `${this.tool.currentFontWeight} ${this.tool.currentFontSize}px "${this.tool.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic'; // Changed from 'middle' for consistency
        
        // Calculate font metrics for proper vertical centering
        const metrics = ctx.measureText('Mg');
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent;
        const xHeightOffset = baseXHeightOffset + this.tool.xHeightDebugOffset; // Add debug adjustment
        
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
        const animationOffsetDistance = (this.tool.animationOffset / 360) * perimeter;
        
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
    
    // Rectangle path point calculation (no corner radius)
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
    
    // Calculate perimeter for rounded rectangle
    getRoundedRectanglePerimeter(width, height, cornerRadius) {
        // Calculate perimeter including rounded corners
        // Straight segments: (width - 2*r) * 2 + (height - 2*r) * 2
        // Curved segments: 4 * (π*r/2) = 2*π*r
        const clampedRadius = Math.min(cornerRadius, width / 2, height / 2);
        const straightPerimeter = 2 * (width - 2 * clampedRadius) + 2 * (height - 2 * clampedRadius);
        const curvedPerimeter = 2 * Math.PI * clampedRadius;
        return straightPerimeter + curvedPerimeter;
    }
    
    // Rounded rectangle path point calculation
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
    
    // Draw circle ribbon for shape path mode
    drawCircleRibbon(ctx, text, borderWidth) {
        const radius = this.tool.shapeParameters.circle.radius;
        const angleStep = (2 * Math.PI) / text.length;
        // Convert animation offset from degrees to radians and apply to character positioning
        const animationOffsetRadians = (this.tool.animationOffset * Math.PI) / 180;
        
        for (let i = 0; i < text.length; i++) {
            const angle = angleStep * i + animationOffsetRadians;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            this.tool.drawSingleCharacterRibbon(ctx, text[i], x, y, angle + Math.PI / 2, borderWidth); // Match text rotation
        }
    }
    
    // Draw rectangle ribbon for shape path mode
    drawRectangleRibbon(ctx, text, borderWidth) {
        const width = this.tool.shapeParameters.rectangle.width;
        const height = this.tool.shapeParameters.rectangle.height;
        const cornerRadius = this.tool.shapeParameters.rectangle.cornerRadius;
        
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
        const animationOffsetDistance = (this.tool.animationOffset / 360) * perimeter;
        
        for (let i = 0; i < text.length; i++) {
            const distanceAlongPerimeter = (i * charSpacing + animationOffsetDistance) % perimeter;
            const pathPoint = pathCalculator(distanceAlongPerimeter, width, height, cornerRadius);
            
            this.tool.drawSingleCharacterRibbon(ctx, text[i], pathPoint.x, pathPoint.y, pathPoint.angle, borderWidth); // Match text rotation
        }
    }
    
    // Draw word ribbons on circle
    drawCircleWordRibbons(ctx, text, words, borderWidth) {
        const radius = this.tool.shapeParameters.circle.radius;
        const angleStep = (2 * Math.PI) / text.length;
        const animationOffsetRadians = (this.tool.animationOffset * Math.PI) / 180;
        
        // Calculate border padding
        const borderPadding = borderWidth * 0.5;
        const ribbonHeight = this.tool.currentFontSize + borderPadding * 2;
        
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
    
    // Draw word ribbons on rectangle
    drawRectangleWordRibbons(ctx, text, words, borderWidth) {
        const width = this.tool.shapeParameters.rectangle.width;
        const height = this.tool.shapeParameters.rectangle.height;
        const cornerRadius = this.tool.shapeParameters.rectangle.cornerRadius;
        
        // Use rounded rectangle path if corner radius is specified
        const pathCalculator = cornerRadius > 0 ? 
            this.getRoundedRectanglePathPoint.bind(this) : 
            this.getRectanglePathPoint.bind(this);
        
        // Calculate perimeter based on whether we have rounded corners
        const perimeter = cornerRadius > 0 ? 
            this.getRoundedRectanglePerimeter(width, height, cornerRadius) : 
            2 * (width + height);
        const charSpacing = perimeter / text.length;
        const animationOffsetDistance = (this.tool.animationOffset / 360) * perimeter;
        
        // Calculate border padding
        const borderPadding = borderWidth * 0.5;
        const ribbonHeight = this.tool.currentFontSize + borderPadding * 2;
        
        for (const word of words) {
            // Calculate raw word boundaries WITHOUT modulo to detect wrapping
            const rawStartDistance = word.startIndex * charSpacing + animationOffsetDistance;
            const rawEndDistance = word.endIndex * charSpacing + animationOffsetDistance;
            
            // Check if word spans across perimeter boundary (would create unwanted connection)
            const startPathCycle = Math.floor(rawStartDistance / perimeter);
            const endPathCycle = Math.floor(rawEndDistance / perimeter);
            
            // Calculate word width for ribbon sizing
            const wordWidth = ctx.measureText(word.text).width;
            
            if (startPathCycle !== endPathCycle) {
                // Word wraps around - render as unified path to maintain stroke continuity
                
                // Segment 1: From word start to end of perimeter
                const segment1Start = rawStartDistance % perimeter;
                const segment1End = perimeter;
                
                // Segment 2: From start of perimeter to word end  
                const segment2Start = 0;
                const segment2End = rawEndDistance % perimeter;
                
                // Render both segments as unified path for stroke continuity
                if ((segment1End > segment1Start) || (segment2End > segment2Start)) {
                    this.drawUnifiedWordRibbonOnRectangle(ctx, word, 
                        [{start: segment1Start, end: segment1End}, {start: segment2Start, end: segment2End}], 
                        width, height, cornerRadius, wordWidth, ribbonHeight, borderPadding, perimeter, pathCalculator);
                }
            } else {
                // Normal case - word doesn't wrap around, safe to render as single segment
                const wordStartDistance = rawStartDistance % perimeter;
                const wordEndDistance = rawEndDistance % perimeter;
                
                this.drawSingleWordRibbonOnRectangle(ctx, word, wordStartDistance, wordEndDistance, width, height, cornerRadius, wordWidth, ribbonHeight, borderPadding, perimeter, pathCalculator);
            }
        }
    }
    
    // Draw circle path ribbon (outline mode)
    drawCirclePathRibbon(ctx) {
        const radius = this.tool.shapeParameters.circle.radius;
        
        // Draw stroke outline first (if enabled) so it appears behind the path
        if (this.tool.strokeWidth > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = this.tool.strokeColor;
            ctx.lineWidth = this.tool.currentFontSize * this.tool.ribbonWidth + (this.tool.strokeWidth * 2);
            ctx.stroke();
        }
        
        // Draw main path outline on top
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.tool.ribbonColor;
        ctx.stroke();
    }
    
    // Draw rectangle path ribbon (outline mode)
    drawRectanglePathRibbon(ctx) {
        const width = this.tool.shapeParameters.rectangle.width;
        const height = this.tool.shapeParameters.rectangle.height;
        const cornerRadius = this.tool.shapeParameters.rectangle.cornerRadius;
        
        // Draw stroke outline first (if enabled) so it appears behind the path
        if (this.tool.strokeWidth > 0) {
            ctx.beginPath();
            // Use roundRect if available, fallback to regular rect
            if (typeof ctx.roundRect === 'function' && cornerRadius > 0) {
                ctx.roundRect(-width/2, -height/2, width, height, cornerRadius);
            } else {
                ctx.rect(-width/2, -height/2, width, height);
            }
            ctx.strokeStyle = this.tool.strokeColor;
            ctx.lineWidth = this.tool.currentFontSize * this.tool.ribbonWidth + (this.tool.strokeWidth * 2);
            ctx.stroke();
        }
        
        // Draw main path outline on top
        ctx.beginPath();
        // Use roundRect if available, fallback to regular rect
        if (typeof ctx.roundRect === 'function' && cornerRadius > 0) {
            ctx.roundRect(-width/2, -height/2, width, height, cornerRadius);
        } else {
            ctx.rect(-width/2, -height/2, width, height);
        }
        ctx.strokeStyle = this.tool.ribbonColor;
        ctx.stroke();
    }
    
    // Single word ribbon drawing methods for Words Bound mode
    drawSingleWordRibbonOnCircle(ctx, word, centerAngle, angleSpan, radius, wordWidth, ribbonHeight, borderPadding) {
        ctx.save();
        
        // Calculate start and end angles for the word
        const startAngle = centerAngle - angleSpan / 2;
        const endAngle = centerAngle + angleSpan / 2;
        
        // Set common stroke properties
        ctx.lineCap = this.tool.boundsType === 'round' ? 'round' : 'square';
        ctx.lineJoin = this.tool.boundsType === 'round' ? 'round' : 'miter';
        
        // Draw stroke outline first (if enabled) so it appears behind the ribbon
        if (this.tool.strokeWidth > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.strokeStyle = this.tool.strokeColor;
            ctx.lineWidth = ribbonHeight + (this.tool.strokeWidth * 2);
            ctx.stroke();
        }
        
        // Draw curved ribbon arc segment for this word on top
        ctx.beginPath();
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.strokeStyle = this.tool.ribbonColor;
        ctx.lineWidth = ribbonHeight;
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
        
        // Set common stroke properties
        ctx.lineCap = this.tool.boundsType === 'round' ? 'round' : 'square';
        ctx.lineJoin = this.tool.boundsType === 'round' ? 'round' : 'miter';
        
        // Create path points for reuse
        const pathResolution = Math.max(10, Math.ceil(wordDistance / 5)); // Sample every ~5 units or at least 10 points
        const pathPoints = [];
        
        for (let i = 0; i <= pathResolution; i++) {
            const progress = i / pathResolution;
            const currentDistance = (startDistance + wordDistance * progress) % perimeter;
            const point = pathCalculator(currentDistance, width, height, cornerRadius);
            pathPoints.push(point);
        }
        
        // Draw stroke outline first (if enabled) so it appears behind the ribbon
        if (this.tool.strokeWidth > 0) {
            ctx.beginPath();
            pathPoints.forEach((point, i) => {
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.strokeStyle = this.tool.strokeColor;
            ctx.lineWidth = ribbonHeight + (this.tool.strokeWidth * 2);
            ctx.stroke();
        }
        
        // Draw path ribbon segment on top
        ctx.beginPath();
        pathPoints.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.strokeStyle = this.tool.ribbonColor;
        ctx.lineWidth = ribbonHeight;
        ctx.stroke();
        ctx.restore();
    }
    
    // Draw unified word ribbon segments for wrapped words to maintain stroke continuity
    drawUnifiedWordRibbonOnRectangle(ctx, word, segments, width, height, cornerRadius, wordWidth, ribbonHeight, borderPadding, perimeter, pathCalculator) {
        ctx.save();
        
        // Set common stroke properties
        ctx.lineCap = this.tool.boundsType === 'round' ? 'round' : 'square';
        ctx.lineJoin = this.tool.boundsType === 'round' ? 'round' : 'miter';
        
        // Collect all valid path points for all segments
        const allPathPoints = [];
        const allStrokePathPoints = [];
        
        for (const segment of segments) {
            // Skip empty segments
            if (segment.end <= segment.start) continue;
            
            const wordDistance = segment.end - segment.start;
            const pathResolution = Math.max(10, Math.ceil(wordDistance / 5)); // Sample every ~5 units or at least 10 points
            
            const segmentPoints = [];
            for (let i = 0; i <= pathResolution; i++) {
                const progress = i / pathResolution;
                const currentDistance = (segment.start + wordDistance * progress) % perimeter;
                const point = pathCalculator(currentDistance, width, height, cornerRadius);
                segmentPoints.push(point);
            }
            
            // Add segment points to collection
            if (segmentPoints.length > 0) {
                allPathPoints.push(segmentPoints);
                allStrokePathPoints.push(segmentPoints);
            }
        }
        
        // Skip rendering if no valid segments
        if (allPathPoints.length === 0) {
            ctx.restore();
            return;
        }
        
        // Draw stroke outline first (if enabled) so it appears behind the ribbon
        if (this.tool.strokeWidth > 0) {
            ctx.beginPath();
            
            // Draw each segment as separate sub-paths within the same beginPath
            for (const segmentPoints of allStrokePathPoints) {
                segmentPoints.forEach((point, i) => {
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
            }
            
            ctx.strokeStyle = this.tool.strokeColor;
            ctx.lineWidth = ribbonHeight + (this.tool.strokeWidth * 2);
            ctx.stroke();
        }
        
        // Draw main ribbon path on top using unified path for continuity
        ctx.beginPath();
        
        // Draw each segment as separate sub-paths within the same beginPath
        for (const segmentPoints of allPathPoints) {
            segmentPoints.forEach((point, i) => {
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
        }
        
        ctx.strokeStyle = this.tool.ribbonColor;
        ctx.lineWidth = ribbonHeight;
        ctx.stroke();
        
        ctx.restore();
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShapeMode;
}