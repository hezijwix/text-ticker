// Spline Mode - Custom Curve Path Drawing and Rendering
// Handles interactive spline creation, Catmull-Rom interpolation, and arc-length parameterization

class SplineMode {
    constructor(textTickerTool) {
        this.tool = textTickerTool;
    }
    
    // Main spline text rendering
    drawText(p, hideGuides = false) {
        // Ensure handle properties are set up for curved mode
        this.ensureHandleProperties();
        
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
        
        // Ensure userModified property exists for all points
        this.ensureUserModifiedProperty();
        
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
        
        // Draw control points and handles
        for (let i = 0; i < this.tool.splinePoints.length; i++) {
            const point = this.tool.splinePoints[i];
            
            // Draw handles for curved mode only
            if (this.tool.curveType === "curved" && point.handleLength && point.handleAngle !== undefined) {
                const handles = this.getHandlePositions(point);
                
                // Draw handle lines
                p.push();
                p.stroke(150, 150, 255, 150); // Light blue handles with transparency
                p.strokeWeight(1);
                p.line(handles.handleIn.x, handles.handleIn.y, point.x, point.y);
                p.line(point.x, point.y, handles.handleOut.x, handles.handleOut.y);
                p.pop();
                
                // Draw handle endpoints
                p.push();
                p.fill(100, 100, 255); // Blue handle endpoints
                p.noStroke();
                p.circle(handles.handleIn.x, handles.handleIn.y, 4);
                p.circle(handles.handleOut.x, handles.handleOut.y, 4);
                p.pop();
            }
            
            // Draw main control point
            p.fill(255, 100, 100); // Red points
            p.noStroke();
            p.circle(point.x, point.y, 8);
            
            // Draw point numbers
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(10);
            p.text(i + 1, point.x, point.y);
        }
        
        p.pop();
    }
    
    // Handle mouse interaction for spline point creation/deletion and handle dragging
    handleSplineMousePressed(mouseX, mouseY) {
        // Check if click is within canvas bounds
        const canvas = this.tool.p5Instance.canvas;
        if (mouseX < 0 || mouseX > canvas.width || mouseY < 0 || mouseY > canvas.height) {
            return; // Ignore clicks outside canvas area
        }
        
        const clickRadius = 10; // Distance threshold for detecting clicks on existing points
        const handleClickRadius = 6; // Smaller radius for handle endpoints
        
        // First, check if clicking on handle endpoints (in curved mode only)
        if (this.tool.curveType === "curved") {
            for (let i = 0; i < this.tool.splinePoints.length; i++) {
                const point = this.tool.splinePoints[i];
                if (point.handleLength && point.handleAngle !== undefined) {
                    const handles = this.getHandlePositions(point);
                    
                    // Check handleIn
                    const distanceHandleIn = Math.sqrt((mouseX - handles.handleIn.x) ** 2 + (mouseY - handles.handleIn.y) ** 2);
                    if (distanceHandleIn <= handleClickRadius) {
                        this.startHandleDrag(i, 'in', mouseX, mouseY);
                        return;
                    }
                    
                    // Check handleOut
                    const distanceHandleOut = Math.sqrt((mouseX - handles.handleOut.x) ** 2 + (mouseY - handles.handleOut.y) ** 2);
                    if (distanceHandleOut <= handleClickRadius) {
                        this.startHandleDrag(i, 'out', mouseX, mouseY);
                        return;
                    }
                }
            }
        }
        
        // Check if clicking on an existing control point (to delete or drag it)
        for (let i = 0; i < this.tool.splinePoints.length; i++) {
            const point = this.tool.splinePoints[i];
            const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
            
            if (distance <= clickRadius) {
                // Start point drag detection (will delete if no drag occurs)
                this.startPointDrag(i, mouseX, mouseY);
                return; // Don't add a new point
            }
        }
        
        // Add a new point with default symmetric handles
        const newPoint = { 
            x: mouseX, 
            y: mouseY,
            handleLength: 50,  // Will be recalculated based on neighbors
            handleAngle: 0,    // Will be auto-calculated based on path flow
            userModified: false // Track whether user has manually adjusted handles
        };
        
        // Auto-calculate optimal handle properties based on neighboring points
        newPoint.handleLength = this.getOptimalHandleLength(newPoint, this.tool.splinePoints);
        this.calculateDefaultHandleAngle(newPoint, this.tool.splinePoints);
        
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
    
    // Get curved point at parametric position t (0-1) using cubic Bezier curves
    getCurvedPointAt(t) {
        // Clamp t to [0, 1]
        t = Math.max(0, Math.min(1, t));
        
        if (this.tool.splinePoints.length < 2) return null;
        
        // Use cubic Bezier curves with symmetric handles
        const numSegments = this.tool.splinePoints.length - 1;
        const segmentT = t * numSegments;
        const segmentIndex = Math.floor(segmentT);
        const localT = segmentT - segmentIndex;
        
        // Get control points for this segment
        const p1 = this.tool.splinePoints[segmentIndex];
        const p2 = this.tool.splinePoints[Math.min(this.tool.splinePoints.length - 1, segmentIndex + 1)];
        
        if (!p1 || !p2) return null;
        
        // Get handle positions for the two control points
        const p1Handles = this.getHandlePositions(p1);
        const p2Handles = this.getHandlePositions(p2);
        
        // Cubic Bezier interpolation using:
        // P0 = p1 (start point)
        // P1 = p1.handleOut (first control handle)
        // P2 = p2.handleIn (second control handle) 
        // P3 = p2 (end point)
        const x = this.cubicBezierInterpolate(p1.x, p1Handles.handleOut.x, p2Handles.handleIn.x, p2.x, localT);
        const y = this.cubicBezierInterpolate(p1.y, p1Handles.handleOut.y, p2Handles.handleIn.y, p2.y, localT);
        
        // Calculate tangent for angle using Bezier derivative
        const tangentX = this.cubicBezierTangent(p1.x, p1Handles.handleOut.x, p2Handles.handleIn.x, p2.x, localT);
        const tangentY = this.cubicBezierTangent(p1.y, p1Handles.handleOut.y, p2Handles.handleIn.y, p2.y, localT);
        const angle = Math.atan2(tangentY, tangentX);
        
        return { x, y, angle };
    }
    
    // Cubic Bezier interpolation
    cubicBezierInterpolate(p0, p1, p2, p3, t) {
        const invT = 1 - t;
        const invT2 = invT * invT;
        const invT3 = invT2 * invT;
        const t2 = t * t;
        const t3 = t2 * t;
        
        return invT3 * p0 + 3 * invT2 * t * p1 + 3 * invT * t2 * p2 + t3 * p3;
    }
    
    // Cubic Bezier tangent calculation (first derivative)
    cubicBezierTangent(p0, p1, p2, p3, t) {
        const invT = 1 - t;
        const invT2 = invT * invT;
        const t2 = t * t;
        
        return -3 * invT2 * p0 + 3 * invT2 * p1 - 6 * invT * t * p1 - 3 * t2 * p2 + 6 * invT * t * p2 + 3 * t2 * p3;
    }
    
    // Legacy Catmull-Rom methods (kept for backward compatibility during transition)
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
    
    // Legacy Catmull-Rom tangent calculation
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
    
    // Calculate default handle angle using De Casteljau's algorithm for natural curve direction
    calculateDefaultHandleAngle(newPoint, existingPoints) {
        // Use De Casteljau's algorithm for mathematically accurate handle positioning
        newPoint.handleAngle = this.calculateDeCasteljauHandleAngle(newPoint, existingPoints);
    }
    
    // Get symmetric handle positions for a point
    getHandlePositions(point) {
        const handleInX = point.x - Math.cos(point.handleAngle) * point.handleLength;
        const handleInY = point.y - Math.sin(point.handleAngle) * point.handleLength;
        const handleOutX = point.x + Math.cos(point.handleAngle) * point.handleLength;
        const handleOutY = point.y + Math.sin(point.handleAngle) * point.handleLength;
        
        return {
            handleIn: { x: handleInX, y: handleInY },
            handleOut: { x: handleOutX, y: handleOutY }
        };
    }
    
    // Distance helper function
    distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    }
    
    // De Casteljau's algorithm for Bezier curve evaluation
    // Returns point on curve at parameter t (0 to 1) given control points
    deCasteljauEvaluate(controlPoints, t) {
        if (controlPoints.length === 0) return null;
        if (controlPoints.length === 1) return { ...controlPoints[0] };
        
        // Create working array to avoid modifying original points
        let points = controlPoints.map(p => ({ x: p.x, y: p.y }));
        
        // Recursive linear interpolation
        while (points.length > 1) {
            const newPoints = [];
            for (let i = 0; i < points.length - 1; i++) {
                // Linear interpolation: (1-t) * p0 + t * p1
                const x = (1 - t) * points[i].x + t * points[i + 1].x;
                const y = (1 - t) * points[i].y + t * points[i + 1].y;
                newPoints.push({ x, y });
            }
            points = newPoints;
        }
        
        return points[0];
    }
    
    // De Casteljau's algorithm to find tangent vector at parameter t
    // Returns both position and tangent direction
    deCasteljauTangent(controlPoints, t) {
        if (controlPoints.length < 2) return null;
        
        // For tangent calculation, we need the derivative
        // The derivative of a Bezier curve is another Bezier curve with n-1 control points
        const derivativePoints = [];
        const n = controlPoints.length - 1; // degree of curve
        
        for (let i = 0; i < controlPoints.length - 1; i++) {
            // Derivative control points: n * (P[i+1] - P[i])
            const dx = n * (controlPoints[i + 1].x - controlPoints[i].x);
            const dy = n * (controlPoints[i + 1].y - controlPoints[i].y);
            derivativePoints.push({ x: dx, y: dy });
        }
        
        // Evaluate the derivative curve to get tangent vector
        const tangentVector = this.deCasteljauEvaluate(derivativePoints, t);
        const position = this.deCasteljauEvaluate(controlPoints, t);
        
        if (!tangentVector || !position) return null;
        
        // Calculate tangent angle
        const angle = Math.atan2(tangentVector.y, tangentVector.x);
        
        return {
            position,
            tangent: tangentVector,
            angle
        };
    }
    
    // Use De Casteljau's algorithm to calculate natural handle angle for new points
    calculateDeCasteljauHandleAngle(newPoint, existingPoints) {
        if (existingPoints.length < 2) {
            // Fall back to simple method for insufficient points
            return this.calculateSimpleHandleAngle(newPoint, existingPoints);
        }
        
        // Create a local curve using the last few points plus the new point
        const localControlPoints = [];
        
        if (existingPoints.length >= 3) {
            // Use last 3 existing points plus new point for a cubic curve
            localControlPoints.push(existingPoints[existingPoints.length - 3]);
            localControlPoints.push(existingPoints[existingPoints.length - 2]);
            localControlPoints.push(existingPoints[existingPoints.length - 1]);
            localControlPoints.push(newPoint);
        } else {
            // Use all existing points plus new point
            localControlPoints.push(...existingPoints);
            localControlPoints.push(newPoint);
        }
        
        // Calculate tangent at the end of the local curve (t = 1)
        const tangentInfo = this.deCasteljauTangent(localControlPoints, 1.0);
        
        if (tangentInfo) {
            return tangentInfo.angle;
        } else {
            // Fall back to simple calculation if De Casteljau fails
            return this.calculateSimpleHandleAngle(newPoint, existingPoints);
        }
    }
    
    // Simple fallback handle angle calculation (previous algorithm)
    calculateSimpleHandleAngle(newPoint, existingPoints) {
        if (existingPoints.length === 0) {
            return 0; // Horizontal handles for first point
        }
        
        if (existingPoints.length === 1) {
            // Handle tangent to line from first to second point
            const dx = newPoint.x - existingPoints[0].x;
            const dy = newPoint.y - existingPoints[0].y;
            return Math.atan2(dy, dx);
        }
        
        // Use chord-tangent approximation for fallback
        const lastPoint = existingPoints[existingPoints.length - 1];
        const secondLastPoint = existingPoints[existingPoints.length - 2];
        
        const prevDx = lastPoint.x - secondLastPoint.x;
        const prevDy = lastPoint.y - secondLastPoint.y;
        const prevAngle = Math.atan2(prevDy, prevDx);
        
        const currentDx = newPoint.x - lastPoint.x;
        const currentDy = newPoint.y - lastPoint.y;
        const currentAngle = Math.atan2(currentDy, currentDx);
        
        // Average the two directions
        let avgAngle = (prevAngle + currentAngle) / 2;
        
        // Handle angle wrapping
        let angleDiff = currentAngle - prevAngle;
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        if (Math.abs(angleDiff) > Math.PI / 2) {
            avgAngle = prevAngle + angleDiff * 0.5;
        }
        
        return avgAngle;
    }
    
    
    // Get optimal handle length based on neighboring point distances
    getOptimalHandleLength(point, neighboringPoints) {
        if (neighboringPoints.length === 0) {
            return 50; // Default length
        }
        
        // Find the distance to closest neighbors
        let minDistance = Infinity;
        for (const neighbor of neighboringPoints) {
            const dist = this.distance(point, neighbor);
            if (dist > 0) { // Avoid same point
                minDistance = Math.min(minDistance, dist);
            }
        }
        
        if (minDistance === Infinity) {
            return 50;
        }
        
        // Handle length should be proportional to neighbor distance
        // But clamped to reasonable bounds
        const proportionalLength = minDistance * 0.3;
        return Math.max(20, Math.min(80, proportionalLength));
    }
    
    // Handle dragging state
    startHandleDrag(pointIndex, handleType, mouseX, mouseY) {
        this.dragState = {
            isDragging: true,
            dragType: 'handle',
            pointIndex: pointIndex,
            handleType: handleType, // 'in' or 'out'
            startMouseX: mouseX,
            startMouseY: mouseY
        };
        
        // Store original handle values for reference
        const point = this.tool.splinePoints[pointIndex];
        this.dragState.originalHandleLength = point.handleLength;
        this.dragState.originalHandleAngle = point.handleAngle;
        
        // Mark this point as user-modified since handle is being manually adjusted
        point.userModified = true;
    }
    
    // Start point drag (can become either a drag operation or a click-delete)
    startPointDrag(pointIndex, mouseX, mouseY) {
        const dragThreshold = 5; // pixels - minimum movement to count as drag
        
        this.dragState = {
            isDragging: false, // Will become true when drag threshold is exceeded
            dragType: 'point',
            pointIndex: pointIndex,
            startMouseX: mouseX,
            startMouseY: mouseY,
            dragThreshold: dragThreshold,
            hasMoved: false
        };
        
        // Store original point position for reference
        const point = this.tool.splinePoints[pointIndex];
        this.dragState.originalX = point.x;
        this.dragState.originalY = point.y;
    }
    
    // Handle mouse drag for handle manipulation and point movement
    handleSplineMouseDrag(mouseX, mouseY) {
        if (!this.dragState) return;
        
        const point = this.tool.splinePoints[this.dragState.pointIndex];
        if (!point) return;
        
        if (this.dragState.dragType === 'handle' && this.dragState.isDragging) {
            // Handle dragging (existing functionality)
            const dx = mouseX - point.x;
            const dy = mouseY - point.y;
            
            const newHandleLength = Math.sqrt(dx * dx + dy * dy);
            const newHandleAngle = Math.atan2(dy, dx);
            
            point.handleLength = Math.max(5, newHandleLength);
            point.handleAngle = newHandleAngle;
            
            this.invalidateArcLengthCache();
            this.tool.renderText();
            
        } else if (this.dragState.dragType === 'point') {
            // Point dragging
            const dx = mouseX - this.dragState.startMouseX;
            const dy = mouseY - this.dragState.startMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if we've moved beyond the drag threshold
            if (!this.dragState.isDragging && distance > this.dragState.dragThreshold) {
                this.dragState.isDragging = true;
                this.dragState.hasMoved = true;
            }
            
            // If we're in drag mode, update the point position
            if (this.dragState.isDragging) {
                point.x = mouseX;
                point.y = mouseY;
                
                // Recalculate handles for this point and neighbors using De Casteljau
                this.recalculateHandlesAfterPointMove(this.dragState.pointIndex);
                
                this.invalidateArcLengthCache();
                this.tool.renderText();
            }
        }
    }
    
    // Recalculate handles after a point has been moved
    recalculateHandlesAfterPointMove(movedPointIndex) {
        // Recalculate handles for the moved point and its immediate neighbors
        // but ONLY for points that haven't been manually adjusted by the user
        const points = this.tool.splinePoints;
        const indicesToRecalculate = [];
        
        // Always recalculate the moved point (unless user-modified)
        indicesToRecalculate.push(movedPointIndex);
        
        // Recalculate previous point if it exists (unless user-modified)
        if (movedPointIndex > 0) {
            indicesToRecalculate.push(movedPointIndex - 1);
        }
        
        // Recalculate next point if it exists (unless user-modified)
        if (movedPointIndex < points.length - 1) {
            indicesToRecalculate.push(movedPointIndex + 1);
        }
        
        // Recalculate handles using De Casteljau algorithm, but PRESERVE user modifications
        for (const index of indicesToRecalculate) {
            const point = points[index];
            
            // Skip recalculation if user has manually modified this point's handles
            if (point.userModified === true) {
                continue; // Preserve user's manual handle adjustments
            }
            
            // Only recalculate for auto-generated handles
            const otherPoints = points.slice(0, index).concat(points.slice(index + 1));
            this.calculateDefaultHandleAngle(point, otherPoints);
            point.handleLength = this.getOptimalHandleLength(point, otherPoints);
        }
    }
    
    // Stop dragging (handles point deletion for click-only interactions)
    stopHandleDrag() {
        if (this.dragState && this.dragState.dragType === 'point' && !this.dragState.hasMoved) {
            // This was a click without drag - delete the point
            const pointIndex = this.dragState.pointIndex;
            this.tool.splinePoints.splice(pointIndex, 1);
            this.invalidateArcLengthCache();
            this.tool.updateSplinePointCount();
            this.tool.renderText();
        }
        
        this.dragState = null;
    }
    
    // Check if currently dragging a handle
    isHandleDragging() {
        return this.dragState && this.dragState.isDragging;
    }
    
    // Upgrade existing spline points to include handle properties
    upgradeSplinePointsToHandles() {
        for (let i = 0; i < this.tool.splinePoints.length; i++) {
            const point = this.tool.splinePoints[i];
            
            // Add handle properties if they don't exist
            if (point.handleLength === undefined) {
                // Calculate optimal handle length based on existing points
                const existingPoints = this.tool.splinePoints.slice(0, i);
                point.handleLength = this.getOptimalHandleLength(point, existingPoints);
            }
            if (point.handleAngle === undefined) {
                point.handleAngle = 0; // Default handle angle - will be recalculated
                this.calculateDefaultHandleAngle(point, this.tool.splinePoints.slice(0, i));
            }
        }
    }
    
    // Ensure all points have handle properties when in curved mode
    ensureHandleProperties() {
        if (this.tool.curveType === "curved") {
            this.upgradeSplinePointsToHandles();
        }
    }
    
    // Ensure all points have userModified property
    ensureUserModifiedProperty() {
        for (const point of this.tool.splinePoints) {
            if (point.userModified === undefined) {
                point.userModified = false; // Default to not user-modified for existing points
            }
        }
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