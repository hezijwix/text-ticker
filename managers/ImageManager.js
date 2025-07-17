export class ImageManager {
    constructor() {
        this.uploadedImages = [];
        this.uploadButton = document.getElementById('uploadButton');
        this.imageInput = document.getElementById('imageInput');
        this.thumbnailsContainer = document.getElementById('thumbnailsContainer');
        
        this.onImageAdded = null;
        this.onImageRemoved = null;
        this.onFirstImageAdded = null;
        this.onAllImagesRemoved = null;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.uploadButton.addEventListener('click', () => {
            this.imageInput.click();
        });
        
        this.imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
    }
    
    handleImageUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now() + Math.random(),
                        file: file,
                        dataUrl: e.target.result,
                        name: file.name
                    };
                    
                    this.uploadedImages.push(imageData);
                    this.createThumbnail(imageData);
                    
                    // Trigger callbacks
                    if (this.uploadedImages.length === 1 && this.onFirstImageAdded) {
                        this.onFirstImageAdded();
                    }
                    
                    if (this.onImageAdded) {
                        this.onImageAdded(imageData);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Reset the input
        event.target.value = '';
    }
    
    createThumbnail(imageData) {
        const thumbnailItem = document.createElement('div');
        thumbnailItem.className = 'thumbnail-item';
        thumbnailItem.dataset.imageId = imageData.id;
        
        const img = document.createElement('img');
        img.className = 'thumbnail-image';
        img.src = imageData.dataUrl;
        img.alt = imageData.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'thumbnail-remove';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeImage(imageData.id);
        });
        
        thumbnailItem.appendChild(img);
        thumbnailItem.appendChild(removeBtn);
        this.thumbnailsContainer.appendChild(thumbnailItem);
    }
    
    removeImage(imageId) {
        // Remove from uploaded images array
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
        
        // Remove thumbnail from DOM
        const thumbnail = this.thumbnailsContainer.querySelector(`[data-image-id="${imageId}"]`);
        if (thumbnail) {
            thumbnail.remove();
        }
        
        // Trigger callbacks
        if (this.uploadedImages.length === 0 && this.onAllImagesRemoved) {
            this.onAllImagesRemoved();
        }
        
        if (this.onImageRemoved) {
            this.onImageRemoved(imageId);
        }
    }
    
    getImages() {
        return this.uploadedImages;
    }
    
    getImageById(id) {
        return this.uploadedImages.find(img => img.id === id);
    }
    
    hasImages() {
        return this.uploadedImages.length > 0;
    }
    
    getImageCount() {
        return this.uploadedImages.length;
    }
    
    // Callback setters
    setOnImageAdded(callback) {
        this.onImageAdded = callback;
    }
    
    setOnImageRemoved(callback) {
        this.onImageRemoved = callback;
    }
    
    setOnFirstImageAdded(callback) {
        this.onFirstImageAdded = callback;
    }
    
    setOnAllImagesRemoved(callback) {
        this.onAllImagesRemoved = callback;
    }
} 