// Spline Mode - Custom Curve Path Drawing and Rendering
// Handles interactive spline creation, Catmull-Rom interpolation, and arc-length parameterization

class SplineMode {
    constructor(textTickerTool) {
        this.tool = textTickerTool;
    }
    
    // Main spline text rendering
    drawText(p, hideGuides = false) {
        this.drawTextOnSpline(p);
        
        // Only show guides if showGuides is true AND hideGuides is false (not during export)
        if (this.tool.showGuides && !hideGuides) {
            this.drawSplineGuides(p);
        }
    }
    
    // Spline text rendering
    drawTextOnSpline(p) {
        if (this.tool.splinePoints.length < 2) {
            return; // Need at least 2 points to create a path
        }
        
        const text = this.tool.currentText;
        const rotation = this.tool.currentRotation * (Math.PI / 180);
        
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
        ctx.fillStyle = this.tool.currentTextColor;
        ctx.font = `${this.tool.currentFontWeight} ${this.tool.currentFontSize}px "${this.tool.currentFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        
        // Calculate font metrics
        const metrics = ctx.measureText('Mg');
        const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baseXHeightOffset = -fontHeight / 2 + metrics.actualBoundingBoxAscent;
        const xHeightOffset = baseXHeightOffset + this.tool.xHeightDebugOffset;
        
        // Calculate path length
        const pathLength = this.calculateSplinePathLength();
        if (pathLength === 0) return;
        
        // Distribute characters along path
        const charSpacing = pathLength / text.length;
        // Convert animation offset from degrees to proportional distance along path
        const animationOffsetDistance = (this.tool.animationOffset / 360) * pathLength;
        
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
    
    // Draw visual guides for spline editing
    drawSplineGuides(p) {
        if (this.tool.splinePoints.length === 0) return;
        
        p.push();
        
        // Apply rotation around center for consistency
        p.translate(p.width / 2, p.height / 2);
        p.rotate(this.tool.currentRotation * (Math.PI / 180));
        p.translate(-p.width / 2, -p.height / 2);
        
        // Draw path connecting points
        if (this.tool.splinePoints.length > 1) {
            p.push(); // Isolate path rendering state
            p.stroke(100, 150, 255); // Blue guide color
            p.strokeWeight(2);
            p.noFill();
            
            if (this.tool.curveType === "linear") {
                // Draw straight lines between points
                p.beginShape();
                p.noFill(); // Ensure no fill for path
                for (const point of this.tool.splinePoints) {
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
        for (let i = 0; i < this.tool.splinePoints.length; i++) {
            const point = this.tool.splinePoints[i];
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
    
    // Handle mouse interaction for spline point creation/deletion
    handleSplineMousePressed(mouseX, mouseY) {
        // Check if click is within canvas bounds
        const canvas = this.tool.p5Instance.canvas;
        if (mouseX < 0 || mouseX > canvas.width || mouseY < 0 || mouseY > canvas.height) {
            return; // Ignore clicks outside canvas area
        }
        
        const clickRadius = 10; // Distance threshold for detecting clicks on existing points
        
        // Check if clicking on an existing point (to delete it)
        for (let i = 0; i < this.tool.splinePoints.length; i++) {
            const point = this.tool.splinePoints[i];
            const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
            
            if (distance <= clickRadius) {
                // Remove this point
                this.tool.splinePoints.splice(i, 1);
                this.invalidateArcLengthCache();
                this.tool.updateSplinePointCount();
                this.tool.renderText();
                return; // Don't add a new point
            }
        }
        
        // Add a new point
        const newPoint = { x: mouseX, y: mouseY };
        this.tool.splinePoints.push(newPoint);
        this.invalidateArcLengthCache();
        this.tool.updateSplinePointCount();
        this.tool.renderText();
    }
    
    // Calculate total path length
    calculateSplinePathLength() {
        if (this.tool.splinePoints.length < 2) return 0;
        
        if (this.tool.curveType === "linear") {
            // Calculate linear path length
            let totalLength = 0;
            for (let i = 1; i < this.tool.splinePoints.length; i++) {
                const prev = this.tool.splinePoints[i - 1];
                const curr = this.tool.splinePoints[i];
                totalLength += Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
            }
            return totalLength;
        } else {
            // For curved splines, use exact arc-length from pre-computed table
            if (!this.tool.arcLengthCacheValid || this.tool.arcLengthTable.length === 0) {
                this.buildArcLengthTable();
            }
            return this.tool.totalArcLength;
        }
    }
    
    // Get point at specific distance along spline
    getPointOnSplinePath(distance) {
        if (this.tool.splinePoints.length < 2) return null;
        
        if (this.tool.curveType === "linear") {
            return this.getLinearPointAtDistance(distance);
        } else {
            return this.getCurvedPointAtDistance(distance);
        }
    }
    
    // Linear interpolation along straight segments
    getLinearPointAtDistance(targetDistance) {
        let currentDistance = 0;
        
        for (let i = 1; i < this.tool.splinePoints.length; i++) {
            const prev = this.tool.splinePoints[i - 1];
            const curr = this.tool.splinePoints[i];
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
        const lastPoint = this.tool.splinePoints[this.tool.splinePoints.length - 1];
        const secondLastPoint = this.tool.splinePoints[this.tool.splinePoints.length - 2];
        const angle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);
        return { x: lastPoint.x, y: lastPoint.y, angle };
    }
    
    // Curved interpolation using arc-length parameterization
    getCurvedPointAtDistance(targetDistance) {
        // Ensure arc-length table is built and valid
        if (!this.tool.arcLengthCacheValid || this.tool.arcLengthTable.length === 0) {
            this.buildArcLengthTable();
        }
        
        if (this.tool.arcLengthTable.length === 0) {
            return null;
        }
        
        // Handle edge cases
        if (targetDistance <= 0) {
            return this.tool.arcLengthTable[0];
        }
        if (targetDistance >= this.tool.totalArcLength) {
            return this.tool.arcLengthTable[this.tool.arcLengthTable.length - 1];
        }
        
        // Binary search to find the segment containing the target distance
        let left = 0;
        let right = this.tool.arcLengthTable.length - 1;
        
        while (left < right - 1) {
            const mid = Math.floor((left + right) / 2);
            if (this.tool.arcLengthTable[mid].distance < targetDistance) {
                left = mid;
            } else {
                right = mid;
            }
        }
        
        // Interpolate between the two closest points
        const point1 = this.tool.arcLengthTable[left];
        const point2 = this.tool.arcLengthTable[right];
        
        const segmentDistance = point2.distance - point1.distance;
        if (segmentDistance === 0) {
            return point1;
        }
        
        const t = (targetDistance - point1.distance) / segmentDistance;
        
        // Linear interpolation between the two points
        return {
            x: point1.x + t * (point2.x - point1.x),
            y: point1.y + t * (point2.y - point1.y),
            angle: point1.angle + t * this.angleDiff(point1.angle, point2.angle)
        };
    }
    
    // Helper function to handle angle interpolation correctly
    angleDiff(angle1, angle2) {
        let diff = angle2 - angle1;
        // Ensure we take the shortest path around the circle
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        return diff;
    }
    
    // Get curved point at parametric position t (0-1)
    getCurvedPointAt(t) {
        // Clamp t to [0, 1]
        t = Math.max(0, Math.min(1, t));
        
        if (this.tool.splinePoints.length < 2) return null;
        
        // Use P5.js curve functions for smooth interpolation
        // For simplicity, we'll use Catmull-Rom splines
        const numSegments = this.tool.splinePoints.length - 1;
        const segmentT = t * numSegments;
        const segmentIndex = Math.floor(segmentT);
        const localT = segmentT - segmentIndex;
        
        // Get control points for this segment
        const p0 = this.tool.splinePoints[Math.max(0, segmentIndex - 1)];
        const p1 = this.tool.splinePoints[segmentIndex];
        const p2 = this.tool.splinePoints[Math.min(this.tool.splinePoints.length - 1, segmentIndex + 1)];
        const p3 = this.tool.splinePoints[Math.min(this.tool.splinePoints.length - 1, segmentIndex + 2)];
        
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
    
    // Catmull-Rom spline interpolation
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
    
    // Catmull-Rom tangent calculation
    catmullRomTangent(p0, p1, p2, p3, t) {
        const t2 = t * t;
        
        return 0.5 * (
            (-p0 + p2) +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * 2 * t +
            (-p0 + 3 * p1 - 3 * p2 + p3) * 3 * t2
        );
    }
    
    // Build arc-length parameterization table for even character distribution
    buildArcLengthTable() {
        if (this.tool.splinePoints.length < 2) {
            this.tool.arcLengthTable = [];
            this.tool.totalArcLength = 0;
            this.tool.arcLengthCacheValid = true;
            return;
        }
        
        this.tool.arcLengthTable = [];
        let cumulativeDistance = 0;
        
        // High resolution sampling for accurate arc-length calculation
        const segments = 200; // Higher resolution for better accuracy
        let lastPoint = null;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const point = this.getCurvedPointAt(t);
            
            if (point) {
                if (lastPoint) {
                    // Calculate distance from previous point
                    const dx = point.x - lastPoint.x;
                    const dy = point.y - lastPoint.y;
                    const segmentDistance = Math.sqrt(dx * dx + dy * dy);
                    cumulativeDistance += segmentDistance;
                }
                
                // Store t, cumulative distance, and point data
                this.tool.arcLengthTable.push({
                    t: t,
                    distance: cumulativeDistance,
                    x: point.x,
                    y: point.y,
                    angle: point.angle
                });
                
                lastPoint = point;
            }
        }
        
        this.tool.totalArcLength = cumulativeDistance;
        this.tool.arcLengthCacheValid = true;
    }
    
    // Invalidate arc-length cache when spline changes
    invalidateArcLengthCache() {
        this.tool.arcLengthCacheValid = false;
        this.tool.arcLengthTable = [];
        this.tool.totalArcLength = 0;
    }
    
    // Draw curved spline path for guides
    drawCurvedSplinePath(p) {
        if (this.tool.splinePoints.length < 2) return;
        
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
    
    // Draw spline ribbon for character mode
    drawSplineRibbon(ctx, text, borderWidth) {
        if (this.tool.splinePoints.length < 2) return;
        
        const pathLength = this.calculateSplinePathLength();
        const charSpacing = pathLength / text.length;
        
        // Convert animation offset from degrees to proportional distance along path
        const animationOffsetDistance = (this.tool.animationOffset / 360) * pathLength;
        
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
                
                this.tool.drawSingleCharacterRibbon(ctx, text[i], transformedX, transformedY, pathPoint.angle, borderWidth); // Match text rotation
            }
        }
    }
    
    // Draw spline word ribbons
    drawSplineWordRibbons(ctx, text, words, borderWidth) {
        if (this.tool.splinePoints.length < 2) return; // Need at least 2 points
        
        const pathLength = this.calculateSplinePathLength();
        if (pathLength === 0) return;
        
        const charSpacing = pathLength / text.length;
        // Convert animation offset from degrees to proportional distance along path
        const animationOffsetDistance = (this.tool.animationOffset / 360) * pathLength;
        
        // Calculate border padding
        const borderPadding = borderWidth * 0.5;
        const ribbonHeight = this.tool.currentFontSize + borderPadding * 2;
        
        for (const word of words) {
            // Calculate raw word boundaries WITHOUT modulo to detect wrapping
            const rawStartDistance = word.startIndex * charSpacing + animationOffsetDistance;
            const rawEndDistance = word.endIndex * charSpacing + animationOffsetDistance;
            
            // Calculate word width for ribbon sizing
            const wordWidth = ctx.measureText(word.text).width;
            
            // Check if word wraps around the path boundary
            const startPathCycle = Math.floor(rawStartDistance / pathLength);
            const endPathCycle = Math.floor(rawEndDistance / pathLength);
            
            if (startPathCycle !== endPathCycle) {
                // Word wraps around - draw two segments
                
                // Segment 1: From word start to end of path
                const segment1Start = rawStartDistance % pathLength;
                const segment1End = pathLength;
                if (segment1End > segment1Start) {
                    this.drawSingleWordRibbonOnSpline(ctx, word, segment1Start, segment1End, pathLength, wordWidth, ribbonHeight, borderPadding);
                }
                
                // Segment 2: From start of path to word end
                const segment2Start = 0;
                const segment2End = rawEndDistance % pathLength;
                if (segment2End > segment2Start) {
                    this.drawSingleWordRibbonOnSpline(ctx, word, segment2Start, segment2End, pathLength, wordWidth, ribbonHeight, borderPadding);
                }
            } else {
                // Normal case - word doesn't wrap around
                const wordStartDistance = rawStartDistance % pathLength;
                const wordEndDistance = rawEndDistance % pathLength;
                this.drawSingleWordRibbonOnSpline(ctx, word, wordStartDistance, wordEndDistance, pathLength, wordWidth, ribbonHeight, borderPadding);
            }
        }
    }
    
    // Draw spline path ribbon (outline mode)
    drawSplinePathRibbon(ctx) {
        if (this.tool.splinePoints.length < 2) return; // Need at least 2 points
        
        // The parent function already applied rotation around center, but we need to 
        // translate back to canvas coordinates for spline points which are in absolute coordinates
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(-centerX, -centerY);
        
        ctx.beginPath();
        
        if (this.tool.curveType === "linear") {
            // Draw straight lines between points
            ctx.moveTo(this.tool.splinePoints[0].x, this.tool.splinePoints[0].y);
            for (let i = 1; i < this.tool.splinePoints.length; i++) {
                ctx.lineTo(this.tool.splinePoints[i].x, this.tool.splinePoints[i].y);
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
    
    // Single word ribbon drawing methods for Words Bound mode
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
        
        // Draw single continuous segment from startDistance to endDistance
        // Note: The caller handles word splitting for wrapped segments
        this.drawSplineSegment(ctx, startDistance, endDistance, pathLength, true);
        
        // Restore coordinate system
        ctx.translate(centerX, centerY);
        ctx.restore();
    }
    
    drawSplineSegment(ctx, segmentStart, segmentEnd, pathLength, shouldStroke = false) {
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
        
        // Only stroke if requested (for independent segment rendering)
        if (shouldStroke) {
            ctx.stroke();
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SplineMode;
}