export class RingGallery {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.scene;
        this.camera = sceneManager.camera;
        
        // Ring-specific properties
        this.rotationGroup = null;
        this.pathGroup = null;
        this.circularPath = null;
        this.pathMarkers = [];
        this.centerSphere = null;
        this.imagePlanes = [];
        this.placeholderPlane = null;
        
        // Configuration
        this.radius = 3;
        this.height = 0;
        this.scale = 1.5;
        this.speed = 0.5;
        this.worldRotation = { x: 0, y: 0, z: 0 };
        
        this.init();
    }
    
    init() {
        // Create parent group for manual rotation controls
        this.rotationGroup = new THREE.Group();
        this.scene.add(this.rotationGroup);
        
        // Create child group for internal animation
        this.pathGroup = new THREE.Group();
        this.rotationGroup.add(this.pathGroup);
        
        // Create initial circular path
        this.createCircularPath();
    }
    
    activate() {
        this.pathGroup.visible = true;
        this.sceneManager.showRenderer();
        this.createCircularPath();
        this.showPlaceholder();
    }
    
    deactivate() {
        this.pathGroup.visible = false;
        this.removePlaceholder();
    }
    
    createCircularPath() {
        // Clear existing elements from the group (except image planes)
        const imagesToKeep = [...this.imagePlanes];
        while (this.pathGroup.children.length > 0) {
            const child = this.pathGroup.children[0];
            if (!imagesToKeep.includes(child)) {
                this.pathGroup.remove(child);
            } else {
                // Temporarily remove image planes
                this.pathGroup.remove(child);
            }
        }
        
        // Re-add image planes
        imagesToKeep.forEach(plane => this.pathGroup.add(plane));
        this.pathMarkers = [];
        
        // Create geometry for the circular path
        const radius = this.radius;
        const segments = 64;
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        // Generate circular path vertices
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = this.height;
            
            vertices.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        // Create material for the path
        const material = new THREE.LineBasicMaterial({ 
            color: 0x00ff88,
            linewidth: 3
        });
        
        // Create the line and add to group
        this.circularPath = new THREE.Line(geometry, material);
        this.pathGroup.add(this.circularPath);
        
        // Add path markers to group
        this.addPathMarkers(radius, segments);
        
        // Apply current world rotation
        this.updateWorldRotation();
    }
    
    addPathMarkers(radius, segments) {
        // Add small spheres along the path
        const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        for (let i = 0; i < segments; i += 8) { // Every 8th point
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = this.height;
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(x, y, z);
            this.pathMarkers.push(sphere);
            this.pathGroup.add(sphere);
        }
        
        // Add a center reference point
        const centerGeometry = new THREE.SphereGeometry(0.1, 12, 12);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
        this.centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
        this.centerSphere.position.set(0, this.height, 0);
        this.pathGroup.add(this.centerSphere);
    }
    
    async addImage(imageData) {
        const plane = await this.sceneManager.createImagePlane(imageData, this.scale);
        this.imagePlanes.push(plane);
        this.pathGroup.add(plane);
        this.updateImagePositions();
        this.removePlaceholder();
    }
    
    removeImage(imageId) {
        // Remove from scene and dispose resources
        const planesToRemove = [];
        this.pathGroup.children.forEach(child => {
            if (child.userData && child.userData.imageId === imageId) {
                planesToRemove.push(child);
            }
        });
        
        planesToRemove.forEach(plane => {
            this.pathGroup.remove(plane);
            if (plane.geometry) plane.geometry.dispose();
            if (plane.material) {
                if (plane.material.map) plane.material.map.dispose();
                plane.material.dispose();
            }
        });
        
        // Remove from imagePlanes array
        this.imagePlanes = this.imagePlanes.filter(plane => 
            plane.userData.imageId !== imageId
        );
        
        this.updateImagePositions();
        
        if (this.imagePlanes.length === 0) {
            this.showPlaceholder();
        }
    }
    
    recreateImages(images) {
        // Clear all existing image planes
        this.clearImages();
        
        // Add all images
        images.forEach(async (imageData) => {
            await this.addImage(imageData);
        });
    }
    
    clearImages() {
        const planesToRemove = [];
        this.pathGroup.children.forEach(child => {
            if (child.userData && child.userData.imageId) {
                planesToRemove.push(child);
            }
        });
        
        planesToRemove.forEach(plane => {
            this.pathGroup.remove(plane);
            if (plane.geometry) plane.geometry.dispose();
            if (plane.material) {
                if (plane.material.map) plane.material.map.dispose();
                plane.material.dispose();
            }
        });
        
        this.imagePlanes = [];
    }
    
    updateImagePositions() {
        if (this.imagePlanes.length === 0) return;
        
        // Calculate static positions in LOCAL space (not affected by parent rotation)
        const radius = this.radius + 1; // Slightly outside the path
        const angleStep = (Math.PI * 2) / this.imagePlanes.length;
        
        this.imagePlanes.forEach((plane, index) => {
            // Static circular position calculation in local XZ plane
            const angle = index * angleStep;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = this.height;
            
            // Set position in LOCAL pathGroup space
            plane.position.set(x, y, z);
            
            // Get world positions for camera facing calculation
            const cameraWorldPosition = new THREE.Vector3();
            const planeWorldPosition = new THREE.Vector3();
            
            this.camera.getWorldPosition(cameraWorldPosition);
            plane.getWorldPosition(planeWorldPosition);
            
            // Make the plane face the camera using lookAt
            plane.lookAt(cameraWorldPosition);
        });
    }
    
    updateImageScales() {
        this.imagePlanes.forEach(plane => {
            const originalSize = plane.userData.originalSize;
            if (originalSize) {
                const aspectRatio = originalSize.width / originalSize.height;
                if (aspectRatio > 1) {
                    // Landscape
                    plane.scale.set(this.scale, this.scale / aspectRatio, 1);
                } else {
                    // Portrait
                    plane.scale.set(this.scale * aspectRatio, this.scale, 1);
                }
            }
        });
    }
    
    updateWorldRotation() {
        if (this.rotationGroup) {
            // Apply X and Z rotations in world space (global)
            // Reset rotation first, then apply world space rotations
            const currentLocalY = this.rotationGroup.rotation.y; // Preserve local Y rotation
            
            // Reset to identity
            this.rotationGroup.rotation.set(0, 0, 0);
            
            // Apply global X and Z rotations using Euler angles
            this.rotationGroup.rotation.x = THREE.MathUtils.degToRad(this.worldRotation.x);
            this.rotationGroup.rotation.z = THREE.MathUtils.degToRad(this.worldRotation.z);
            
            // Restore the local Y rotation (from automatic spinning)
            this.rotationGroup.rotation.y = currentLocalY;
        }
    }
    
    resetRotation() {
        this.worldRotation = { x: 0, y: 0, z: 0 };
        
        // Reset X and Z rotations but preserve Y (local spinning)
        const currentLocalY = this.rotationGroup.rotation.y;
        this.rotationGroup.rotation.set(0, currentLocalY, 0);
    }
    
    showPlaceholder() {
        if (this.imagePlanes.length > 0) return;
        
        this.removePlaceholder();
        
        // Create placeholder plane
        const geometry = new THREE.PlaneGeometry(2, 1.5);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x2a2a2a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        this.placeholderPlane = new THREE.Mesh(geometry, material);
        
        // Add border effect with wireframe
        const borderGeometry = new THREE.PlaneGeometry(2, 1.5);
        const borderMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x666666,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
        borderPlane.position.set(0, 0, 0.001); // Slightly in front
        
        // Group placeholder and border together
        const placeholderGroup = new THREE.Group();
        placeholderGroup.add(this.placeholderPlane);
        placeholderGroup.add(borderPlane);
        
        // Add to pathGroup so it moves with the circle
        this.pathGroup.add(placeholderGroup);
        this.placeholderPlane.borderPlane = borderPlane;
        this.placeholderPlane.group = placeholderGroup;
    }
    
    removePlaceholder() {
        if (this.placeholderPlane) {
            const group = this.placeholderPlane.group;
            if (group && group.parent) {
                group.parent.remove(group);
            }
            this.placeholderPlane = null;
        }
    }
    
    updatePlaceholderPosition() {
        if (this.placeholderPlane && this.imagePlanes.length === 0) {
            // Position placeholder at front of circle
            const radius = this.radius + 1;
            this.placeholderPlane.group.position.set(0, this.height, radius);
            
            // Make it face the camera
            const cameraWorldPosition = new THREE.Vector3();
            this.camera.getWorldPosition(cameraWorldPosition);
            this.placeholderPlane.group.lookAt(cameraWorldPosition);
        }
    }
    
    update() {
        // STEP 1: Automatic Y rotation (continuous spin)
        this.rotationGroup.rotateY(THREE.MathUtils.degToRad(this.speed));
        
        // STEP 2: Calculate image positions (static, no animation)
        this.updateImagePositions();
        
        // STEP 3: Update placeholder position if it exists
        this.updatePlaceholderPosition();
    }
    
    // Setters for configuration
    setRadius(radius) {
        this.radius = radius;
        this.createCircularPath();
        this.updateImagePositions();
    }
    
    setHeight(height) {
        this.height = height;
        this.createCircularPath();
        this.updateImagePositions();
    }
    
    setScale(scale) {
        this.scale = scale;
        this.updateImageScales();
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
    
    setRotationX(rotationX) {
        this.worldRotation.x = rotationX;
        this.updateWorldRotation();
    }
    
    setRotationZ(rotationZ) {
        this.worldRotation.z = rotationZ;
        this.updateWorldRotation();
    }
} 