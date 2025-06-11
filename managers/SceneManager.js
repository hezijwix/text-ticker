export class SceneManager {
    constructor(frameContainer) {
        this.frameContainer = frameContainer;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Get initial frame size
        const frameSize = this.getFrameSize();
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x121212);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, frameSize.width / frameSize.height, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(frameSize.width, frameSize.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add renderer to frame container
        this.frameContainer.appendChild(this.renderer.domElement);
        
        // Add lighting
        this.addLighting();
    }
    
    addLighting() {
        // Add minimal ambient light for scene elements
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
    }
    
    startRenderLoop(renderCallback) {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            
            if (renderCallback) {
                renderCallback();
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
    
    stopRenderLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    getFrameSize() {
        const widthInput = document.getElementById('frameWidth');
        const heightInput = document.getElementById('frameHeight');
        return {
            width: parseInt(widthInput.value) || 800,
            height: parseInt(heightInput.value) || 600
        };
    }
    
    resize() {
        const frameSize = this.getFrameSize();
        
        if (this.camera && this.renderer) {
            this.camera.aspect = frameSize.width / frameSize.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(frameSize.width, frameSize.height);
        }
    }
    
    createImagePlane(imageData, scale = 1.5) {
        return new Promise((resolve) => {
            const loader = new THREE.TextureLoader();
            loader.load(imageData.dataUrl, (texture) => {
                // Ensure texture uses proper color space and preserves alpha
                texture.colorSpace = THREE.SRGBColorSpace;
                
                // Create geometry for the image plane
                const geometry = new THREE.PlaneGeometry(1, 1);
                
                // Create material with the image texture - support alpha transparency
                const material = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    alphaTest: 0.1,
                    toneMapped: false
                });
                
                // Create the plane mesh
                const plane = new THREE.Mesh(geometry, material);
                plane.userData.imageId = imageData.id;
                plane.userData.originalSize = {
                    width: texture.image.width,
                    height: texture.image.height
                };
                
                // Scale the plane to maintain aspect ratio
                const aspectRatio = texture.image.width / texture.image.height;
                if (aspectRatio > 1) {
                    // Landscape
                    plane.scale.set(scale, scale / aspectRatio, 1);
                } else {
                    // Portrait
                    plane.scale.set(scale * aspectRatio, scale, 1);
                }
                
                resolve(plane);
            });
        });
    }
    
    showRenderer() {
        if (this.renderer) {
            this.renderer.domElement.style.display = 'block';
        }
    }
    
    hideRenderer() {
        if (this.renderer) {
            this.renderer.domElement.style.display = 'none';
        }
    }
    
    destroy() {
        this.stopRenderLoop();
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
} 