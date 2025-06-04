class GridResizer {
    constructor() {
        this.gridContainer = document.getElementById('gridContainer');
        this.isDragging = false;
        this.currentSplitter = null;
        this.startPosition = 0;
        this.columnSizes = [1, 1, 1]; // Initial fr units for columns
        this.rowSizes = [1, 1, 1]; // Initial fr units for rows
        this.selectedCell = null; // Track selected cell
        this.defaultImageDataUrl = null; // Default circle image
        this.currentImageDataUrl = null; // Currently loaded image (uploaded or default)
        this.isUsingDefaultImage = true; // Track if we're using default or uploaded
        
        // Animation properties
        this.isAnimating = false;
        this.animationId = null;
        this.animationTime = 0;
        this.frequency = 0.5;
        this.amplitude = 0.3;
        this.baseColumnSizes = [...this.columnSizes]; // Store original sizes
        this.baseRowSizes = [...this.rowSizes]; // Store original sizes
        
        this.init();
    }
    
    init() {
        this.setupSplitters();
        this.updateSplitterPositions();
        this.setupImageUpload();
        this.setupCellSelection();
        this.setupControlButtons();
        this.setupDefaultContent(); // Add default content to cells
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateSplitterPositions();
        });
    }
    
    setupImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadImageToAllCells(file, false); // Load uploaded file
            }
            // Reset the input
            imageUpload.value = '';
        });
    }
    
    setupCellSelection() {
        // Cell selection functionality removed - no longer needed
        // Images will be placed in all cells
    }
    
    setupControlButtons() {
        const clearAllBtn = document.getElementById('clearAllBtn');
        const imageFitModeSelect = document.getElementById('imageFitMode');
        const addColumnBtn = document.getElementById('addColumnBtn');
        const removeColumnBtn = document.getElementById('removeColumnBtn');
        const addRowBtn = document.getElementById('addRowBtn');
        const removeRowBtn = document.getElementById('removeRowBtn');
        
        clearAllBtn.addEventListener('click', () => {
            this.clearAllImages();
        });
        
        imageFitModeSelect.addEventListener('change', (e) => {
            this.setImageFitMode(e.target.value);
        });
        
        addColumnBtn.addEventListener('click', () => {
            this.addColumn();
        });
        
        removeColumnBtn.addEventListener('click', () => {
            this.removeColumn();
        });
        
        addRowBtn.addEventListener('click', () => {
            this.addRow();
        });
        
        removeRowBtn.addEventListener('click', () => {
            this.removeRow();
        });
        
        // Animation controls
        const animationToggle = document.getElementById('animationToggle');
        const frequencySlider = document.getElementById('frequencySlider');
        const amplitudeSlider = document.getElementById('amplitudeSlider');
        const frequencyValue = document.getElementById('frequencyValue');
        const amplitudeValue = document.getElementById('amplitudeValue');
        
        animationToggle.addEventListener('change', (e) => {
            this.toggleAnimation(e.target.checked);
        });
        
        frequencySlider.addEventListener('input', (e) => {
            this.frequency = parseFloat(e.target.value);
            frequencyValue.textContent = this.frequency;
        });
        
        amplitudeSlider.addEventListener('input', (e) => {
            this.amplitude = parseFloat(e.target.value);
            amplitudeValue.textContent = this.amplitude;
        });
        
        // Update button states
        this.updateGridControlButtons();
    }
    
    selectCell(cellElement) {
        // Cell selection functionality removed
    }
    
    setupDefaultContent() {
        // Create a default circle image as data URL
        this.createDefaultCircleImage().then(dataUrl => {
            this.defaultImageDataUrl = dataUrl;
            this.currentImageDataUrl = dataUrl; // Set as current image
            this.isUsingDefaultImage = true;
            this.loadImageToAllCells(null, true); // Load default content
        });
    }
    
    createDefaultCircleImage() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;
            
            // Create a simple pattern with a circle and some design elements
            // Background
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 200, 200);
            
            // Main circle
            ctx.fillStyle = '#007acc';
            ctx.beginPath();
            ctx.arc(100, 100, 60, 0, 2 * Math.PI);
            ctx.fill();
            
            // Corner circles (for nine-slice testing)
            ctx.fillStyle = '#ff4444';
            // Top-left corner
            ctx.beginPath();
            ctx.arc(30, 30, 15, 0, 2 * Math.PI);
            ctx.fill();
            // Top-right corner
            ctx.beginPath();
            ctx.arc(170, 30, 15, 0, 2 * Math.PI);
            ctx.fill();
            // Bottom-left corner
            ctx.beginPath();
            ctx.arc(30, 170, 15, 0, 2 * Math.PI);
            ctx.fill();
            // Bottom-right corner
            ctx.beginPath();
            ctx.arc(170, 170, 15, 0, 2 * Math.PI);
            ctx.fill();
            
            // Border pattern
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.strokeRect(5, 5, 190, 190);
            
            resolve(canvas.toDataURL());
        });
    }
    
    loadImageToAllCells(file, useDefault = false) {
        if (useDefault) {
            // Use the default image
            this.currentImageDataUrl = this.defaultImageDataUrl;
            this.isUsingDefaultImage = true;
            this.loadImageFromDataUrl(this.defaultImageDataUrl);
        } else {
            // Load from file
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImageDataUrl = e.target.result;
                this.isUsingDefaultImage = false;
                this.loadImageFromDataUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    loadImageFromDataUrl(dataUrl) {
        const gridItems = document.querySelectorAll('.grid-item');
        
        gridItems.forEach(cellElement => {
            const imageWrapper = cellElement.querySelector('.image-wrapper');
            const cellLabel = cellElement.querySelector('.cell-label');
            
            // Remove existing image if any
            const existingImg = imageWrapper.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }
            
            // Create new image element
            const img = document.createElement('img');
            img.src = dataUrl;
            img.alt = `Image in cell ${cellElement.getAttribute('data-cell')}`;
            
            // Add image to wrapper
            imageWrapper.appendChild(img);
            
            // Hide cell label when image is present
            cellLabel.classList.add('hidden');
        });
        
        // Ensure splitters are positioned correctly after images load
        setTimeout(() => {
            this.updateSplitterPositions();
        }, 100);
        
        console.log('Image loaded to all cells');
    }
    
    clearAllImages() {
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        const cellLabels = document.querySelectorAll('.cell-label');
        
        imageWrappers.forEach(wrapper => {
            const img = wrapper.querySelector('img');
            if (img) {
                img.remove();
            }
        });
        
        // Show cell labels again
        cellLabels.forEach(label => {
            label.classList.remove('hidden');
        });
        
        // Reset image tracking
        this.currentImageDataUrl = null;
        this.isUsingDefaultImage = true;
        
        console.log('All images cleared');
    }
    
    setImageFitMode(mode) {
        console.log('setImageFitMode called with mode:', mode);
        const imageWrappers = document.querySelectorAll('.image-wrapper');
        console.log('Found image wrappers:', imageWrappers.length);
        
        // Remove all existing fit classes
        imageWrappers.forEach(wrapper => {
            wrapper.classList.remove('fit-contain', 'fit-cover', 'debug-corners');
            // Clean up debug elements if they exist
            this.clearDebugElements(wrapper);
        });
        
        // Apply the selected fit mode
        switch(mode) {
            case 'fill':
                // Default behavior - no additional classes needed
                // Images will use object-fit: fill
                console.log('Image fit mode: Stretch to Fill Cell');
                break;
            case 'contain':
                imageWrappers.forEach(wrapper => {
                    wrapper.classList.add('fit-contain');
                });
                console.log('Image fit mode: Fit Within Cell');
                break;
            case 'cover':
                imageWrappers.forEach(wrapper => {
                    wrapper.classList.add('fit-cover');
                });
                console.log('Image fit mode: Fill Cell Completely');
                break;
            case 'debug-corners':
                console.log('Debug corners mode selected, setting up...');
                imageWrappers.forEach(wrapper => {
                    console.log('Processing wrapper for debug corners...');
                    this.setupDebugCorners(wrapper);
                });
                console.log('Image fit mode: Debug 4 Corners');
                break;
        }
    }
    
    setupDebugCorners(wrapper) {
        console.log('setupDebugCorners called');
        const img = wrapper.querySelector('img');
        
        if (!img || !img.src) {
            console.log('No image found for debug corners');
            return;
        }
        
        console.log('Setting up debug corners for image');
        wrapper.classList.add('debug-corners');
        
        const createCornerSlices = () => {
            console.log('Creating corner slices...');
            
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            
            tempCanvas.width = img.naturalWidth;
            tempCanvas.height = img.naturalHeight;
            
            console.log('Debug canvas size:', tempCanvas.width, 'x', tempCanvas.height);
            
            if (tempCanvas.width === 0 || tempCanvas.height === 0) {
                console.log('Debug canvas has zero dimensions!');
                return;
            }
            
            ctx.drawImage(img, 0, 0);
            
            const quarterWidth = Math.floor(tempCanvas.width / 2);
            const quarterHeight = Math.floor(tempCanvas.height / 2);
            
            // Create top-left corner slice
            console.log('Creating top-left corner');
            const topLeftCanvas = document.createElement('canvas');
            const topLeftCtx = topLeftCanvas.getContext('2d');
            topLeftCanvas.width = quarterWidth;
            topLeftCanvas.height = quarterHeight;
            
            const topLeftImageData = ctx.getImageData(0, 0, quarterWidth, quarterHeight);
            topLeftCtx.putImageData(topLeftImageData, 0, 0);
            
            const topLeftDiv = document.createElement('div');
            topLeftDiv.className = 'debug-corner-slice top-left';
            topLeftDiv.style.backgroundImage = `url("${topLeftCanvas.toDataURL()}")`;
            wrapper.appendChild(topLeftDiv);
            
            // Create top-right corner slice
            console.log('Creating top-right corner');
            const topRightCanvas = document.createElement('canvas');
            const topRightCtx = topRightCanvas.getContext('2d');
            topRightCanvas.width = quarterWidth;
            topRightCanvas.height = quarterHeight;
            
            const topRightImageData = ctx.getImageData(quarterWidth, 0, quarterWidth, quarterHeight);
            topRightCtx.putImageData(topRightImageData, 0, 0);
            
            const topRightDiv = document.createElement('div');
            topRightDiv.className = 'debug-corner-slice top-right';
            topRightDiv.style.backgroundImage = `url("${topRightCanvas.toDataURL()}")`;
            wrapper.appendChild(topRightDiv);
            
            // Create bottom-left corner slice
            console.log('Creating bottom-left corner');
            const bottomLeftCanvas = document.createElement('canvas');
            const bottomLeftCtx = bottomLeftCanvas.getContext('2d');
            bottomLeftCanvas.width = quarterWidth;
            bottomLeftCanvas.height = quarterHeight;
            
            const bottomLeftImageData = ctx.getImageData(0, quarterHeight, quarterWidth, quarterHeight);
            bottomLeftCtx.putImageData(bottomLeftImageData, 0, 0);
            
            const bottomLeftDiv = document.createElement('div');
            bottomLeftDiv.className = 'debug-corner-slice bottom-left';
            bottomLeftDiv.style.backgroundImage = `url("${bottomLeftCanvas.toDataURL()}")`;
            wrapper.appendChild(bottomLeftDiv);
            
            // Create bottom-right corner slice
            console.log('Creating bottom-right corner');
            const bottomRightCanvas = document.createElement('canvas');
            const bottomRightCtx = bottomRightCanvas.getContext('2d');
            bottomRightCanvas.width = quarterWidth;
            bottomRightCanvas.height = quarterHeight;
            
            const bottomRightImageData = ctx.getImageData(quarterWidth, quarterHeight, quarterWidth, quarterHeight);
            bottomRightCtx.putImageData(bottomRightImageData, 0, 0);
            
            const bottomRightDiv = document.createElement('div');
            bottomRightDiv.className = 'debug-corner-slice bottom-right';
            bottomRightDiv.style.backgroundImage = `url("${bottomRightCanvas.toDataURL()}")`;
            wrapper.appendChild(bottomRightDiv);
            
            // Create left vertical stretch between the left corners
            console.log('Creating left vertical stretch between corners');
            const leftStretchCanvas = document.createElement('canvas');
            const leftStretchCtx = leftStretchCanvas.getContext('2d');
            leftStretchCanvas.width = quarterWidth; // Full width of the corner
            leftStretchCanvas.height = 1; // Just 1 pixel high
            
            // Get the top pixel row of the bottom-left corner (where the stretch should come from)
            const leftStretchRowImageData = ctx.getImageData(0, quarterHeight, quarterWidth, 1);
            leftStretchCtx.putImageData(leftStretchRowImageData, 0, 0);
            
            console.log('Left stretch canvas size:', leftStretchCanvas.width, 'x', leftStretchCanvas.height);
            
            const leftStretchDiv = document.createElement('div');
            leftStretchDiv.className = 'debug-vertical-stretch left-stretch';
            leftStretchDiv.style.position = 'absolute';
            leftStretchDiv.style.left = '0px';
            leftStretchDiv.style.top = '50px'; // Start below top-left corner
            leftStretchDiv.style.width = '50px'; // Match the corner display width
            leftStretchDiv.style.height = 'calc(100% - 100px)'; // Fill space between corners
            leftStretchDiv.style.backgroundImage = `url("${leftStretchCanvas.toDataURL()}")`;
            leftStretchDiv.style.backgroundRepeat = 'repeat-y';
            leftStretchDiv.style.backgroundSize = '50px 1px'; // Ensure proper scaling
            leftStretchDiv.style.backgroundPosition = '0 0';
            leftStretchDiv.style.zIndex = '10';
            
            wrapper.appendChild(leftStretchDiv);
            
            // Create right vertical stretch between the right corners
            console.log('Creating right vertical stretch between corners');
            const rightStretchCanvas = document.createElement('canvas');
            const rightStretchCtx = rightStretchCanvas.getContext('2d');
            rightStretchCanvas.width = quarterWidth; // Full width of the corner
            rightStretchCanvas.height = 1; // Just 1 pixel high
            
            // Get the top pixel row of the bottom-right corner (where the stretch should come from)
            const rightStretchRowImageData = ctx.getImageData(quarterWidth, quarterHeight, quarterWidth, 1);
            rightStretchCtx.putImageData(rightStretchRowImageData, 0, 0);
            
            console.log('Right stretch canvas size:', rightStretchCanvas.width, 'x', rightStretchCanvas.height);
            
            const rightStretchDiv = document.createElement('div');
            rightStretchDiv.className = 'debug-vertical-stretch right-stretch';
            rightStretchDiv.style.position = 'absolute';
            rightStretchDiv.style.right = '0px'; // Position from right edge
            rightStretchDiv.style.top = '50px'; // Start below top-right corner
            rightStretchDiv.style.width = '50px'; // Match the corner display width
            rightStretchDiv.style.height = 'calc(100% - 100px)'; // Fill space between corners
            rightStretchDiv.style.backgroundImage = `url("${rightStretchCanvas.toDataURL()}")`;
            rightStretchDiv.style.backgroundRepeat = 'repeat-y';
            rightStretchDiv.style.backgroundSize = '50px 1px'; // Ensure proper scaling
            rightStretchDiv.style.backgroundPosition = '0 0';
            rightStretchDiv.style.zIndex = '10';
            
            wrapper.appendChild(rightStretchDiv);
            
            // Create top horizontal stretch between the top corners
            console.log('Creating top horizontal stretch between corners');
            const topStretchCanvas = document.createElement('canvas');
            const topStretchCtx = topStretchCanvas.getContext('2d');
            topStretchCanvas.width = 1; // Just 1 pixel wide
            topStretchCanvas.height = quarterHeight; // Full height of the corner
            
            // Get the rightmost pixel column of the top-left corner (where the stretch should come from)
            const topStretchColumnImageData = ctx.getImageData(quarterWidth - 1, 0, 1, quarterHeight);
            topStretchCtx.putImageData(topStretchColumnImageData, 0, 0);
            
            console.log('Top stretch canvas size:', topStretchCanvas.width, 'x', topStretchCanvas.height);
            
            const topStretchDiv = document.createElement('div');
            topStretchDiv.className = 'debug-horizontal-stretch top-stretch';
            topStretchDiv.style.position = 'absolute';
            topStretchDiv.style.left = '50px'; // Start after top-left corner
            topStretchDiv.style.top = '0px';
            topStretchDiv.style.width = 'calc(100% - 100px)'; // Fill space between corners
            topStretchDiv.style.height = '50px'; // Match the corner display height
            topStretchDiv.style.backgroundImage = `url("${topStretchCanvas.toDataURL()}")`;
            topStretchDiv.style.backgroundRepeat = 'repeat-x';
            topStretchDiv.style.backgroundSize = '1px 50px'; // Ensure proper scaling
            topStretchDiv.style.backgroundPosition = '0 0';
            topStretchDiv.style.zIndex = '10';
            
            wrapper.appendChild(topStretchDiv);
            
            // Create bottom horizontal stretch between the bottom corners
            console.log('Creating bottom horizontal stretch between corners');
            const bottomStretchCanvas = document.createElement('canvas');
            const bottomStretchCtx = bottomStretchCanvas.getContext('2d');
            bottomStretchCanvas.width = 1; // Just 1 pixel wide
            bottomStretchCanvas.height = quarterHeight; // Full height of the corner
            
            // Get the rightmost pixel column of the bottom-left corner (where the stretch should come from)
            const bottomStretchColumnImageData = ctx.getImageData(quarterWidth - 1, quarterHeight, 1, quarterHeight);
            bottomStretchCtx.putImageData(bottomStretchColumnImageData, 0, 0);
            
            console.log('Bottom stretch canvas size:', bottomStretchCanvas.width, 'x', bottomStretchCanvas.height);
            
            const bottomStretchDiv = document.createElement('div');
            bottomStretchDiv.className = 'debug-horizontal-stretch bottom-stretch';
            bottomStretchDiv.style.position = 'absolute';
            bottomStretchDiv.style.left = '50px'; // Start after bottom-left corner
            bottomStretchDiv.style.bottom = '0px'; // Position from bottom edge
            bottomStretchDiv.style.width = 'calc(100% - 100px)'; // Fill space between corners
            bottomStretchDiv.style.height = '50px'; // Match the corner display height
            bottomStretchDiv.style.backgroundImage = `url("${bottomStretchCanvas.toDataURL()}")`;
            bottomStretchDiv.style.backgroundRepeat = 'repeat-x';
            bottomStretchDiv.style.backgroundSize = '1px 50px'; // Ensure proper scaling
            bottomStretchDiv.style.backgroundPosition = '0 0';
            bottomStretchDiv.style.zIndex = '10';
            
            wrapper.appendChild(bottomStretchDiv);
            
            // Sample the center pixel color for seamless background
            console.log('Sampling center pixel color');
            const centerPixelData = ctx.getImageData(quarterWidth, quarterHeight, 1, 1);
            const pixel = centerPixelData.data;
            const centerColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            console.log('Center color sampled:', centerColor);
            
            // Create center area with sampled background color
            console.log('Creating center area');
            const centerDiv = document.createElement('div');
            centerDiv.className = 'debug-center-area';
            centerDiv.style.position = 'absolute';
            centerDiv.style.left = '50px'; // Start after left edge
            centerDiv.style.top = '50px'; // Start below top edge
            centerDiv.style.width = 'calc(100% - 100px)'; // Fill space between left and right edges
            centerDiv.style.height = 'calc(100% - 100px)'; // Fill space between top and bottom edges
            centerDiv.style.backgroundColor = centerColor;
            centerDiv.style.zIndex = '5'; // Lower z-index so edges appear above it
            
            wrapper.appendChild(centerDiv);
            
            console.log('All four corners, edges, and center area complete!');
        };
        
        if (img.complete && img.naturalWidth > 0) {
            console.log('Image ready for debug corners');
            createCornerSlices();
        } else {
            console.log('Waiting for image to load for debug corners...');
            img.onload = () => {
                console.log('Image loaded for debug corners');
                createCornerSlices();
            };
        }
    }
    
    clearDebugElements(wrapper) {
        const debugElements = wrapper.querySelectorAll('.debug-corner-slice, .debug-vertical-stretch, .debug-horizontal-stretch, .debug-center-area');
        debugElements.forEach(element => element.remove());
    }
    
    setupSplitters() {
        const splitters = document.querySelectorAll('.splitter');
        
        splitters.forEach(splitter => {
            splitter.addEventListener('mousedown', (e) => this.startDrag(e, splitter));
        });
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
    }
    
    updateSplitterPositions() {
        const containerRect = this.gridContainer.getBoundingClientRect();
        const borderWidth = parseInt(getComputedStyle(this.gridContainer).borderLeftWidth) || 0;
        
        console.log('Container dimensions:', {
            width: containerRect.width,
            height: containerRect.height,
            borderWidth: borderWidth
        });
        
        // Position vertical splitters (column separators)
        const verticalSplitters = document.querySelectorAll('.splitter.vertical');
        const totalColumns = this.columnSizes.length;
        const totalColumnFr = this.columnSizes.reduce((sum, size) => sum + size, 0);
        const containerWidth = containerRect.width - 2 * borderWidth;
        
        verticalSplitters.forEach((splitter, index) => {
            const columnIndex = parseInt(splitter.dataset.index);
            if (columnIndex < totalColumns - 1) {
                // Calculate position based on fr units - sum up columns up to this splitter
                let accumulatedWidth = 0;
                for (let i = 0; i <= columnIndex; i++) {
                    accumulatedWidth += (this.columnSizes[i] / totalColumnFr) * containerWidth;
                }
                const leftPosition = accumulatedWidth - 4;
                splitter.style.left = `${leftPosition}px`; // Center the splitter (4px = half of splitter width)
                console.log(`Vertical splitter ${columnIndex} positioned at: ${leftPosition}px`);
            }
        });
        
        // Position horizontal splitters (row separators)
        const horizontalSplitters = document.querySelectorAll('.splitter.horizontal');
        const totalRows = this.rowSizes.length;
        const totalRowFr = this.rowSizes.reduce((sum, size) => sum + size, 0);
        const containerHeight = containerRect.height - 2 * borderWidth;
        
        horizontalSplitters.forEach((splitter, index) => {
            const rowIndex = parseInt(splitter.dataset.index);
            if (rowIndex < totalRows - 1) {
                // Calculate position based on fr units - sum up rows up to this splitter
                let accumulatedHeight = 0;
                for (let i = 0; i <= rowIndex; i++) {
                    accumulatedHeight += (this.rowSizes[i] / totalRowFr) * containerHeight;
                }
                const topPosition = accumulatedHeight - 4;
                splitter.style.top = `${topPosition}px`; // Center the splitter (4px = half of splitter height)
                console.log(`Horizontal splitter ${rowIndex} positioned at: ${topPosition}px`);
            }
        });
    }
    
    startDrag(e, splitter) {
        e.preventDefault();
        this.isDragging = true;
        this.currentSplitter = splitter;
        
        if (splitter.classList.contains('vertical')) {
            this.startPosition = e.clientX;
        } else {
            this.startPosition = e.clientY;
        }
        
        document.body.classList.add('dragging');
        splitter.classList.add('dragging');
    }
    
    drag(e) {
        if (!this.isDragging || !this.currentSplitter) return;
        
        e.preventDefault();
        
        const containerRect = this.gridContainer.getBoundingClientRect();
        const borderWidth = parseInt(getComputedStyle(this.gridContainer).borderLeftWidth) || 0;
        
        if (this.currentSplitter.classList.contains('vertical')) {
            // Column resizing
            const splitterIndex = parseInt(this.currentSplitter.dataset.index);
            const containerWidth = containerRect.width - 2 * borderWidth;
            const mouseX = e.clientX - containerRect.left - borderWidth;
            const percentage = mouseX / containerWidth;
            
            this.resizeColumns(splitterIndex, percentage);
        } else {
            // Row resizing
            const splitterIndex = parseInt(this.currentSplitter.dataset.index);
            const containerHeight = containerRect.height - 2 * borderWidth;
            const mouseY = e.clientY - containerRect.top - borderWidth;
            const percentage = mouseY / containerHeight;
            
            this.resizeRows(splitterIndex, percentage);
        }
    }
    
    resizeColumns(splitterIndex, targetPercentage) {
        // Ensure the percentage is within bounds
        targetPercentage = Math.max(0.05, Math.min(0.95, targetPercentage));
        
        // Calculate minimum cell width to prevent nine-slice overlap
        const containerRect = this.gridContainer.getBoundingClientRect();
        const borderWidth = parseInt(getComputedStyle(this.gridContainer).borderLeftWidth) || 0;
        const containerWidth = containerRect.width - 2 * borderWidth;
        const minCellWidth = 100; // 50px left corner + 50px right corner
        const minPercentagePerCell = minCellWidth / containerWidth;
        
        // Calculate the target position in terms of fractional units
        const totalFr = this.columnSizes.reduce((sum, size) => sum + size, 0);
        const targetFr = targetPercentage * totalFr;
        
        // Calculate current position of this splitter
        let currentFr = 0;
        for (let i = 0; i <= splitterIndex; i++) {
            currentFr += this.columnSizes[i];
        }
        
        // Calculate the difference
        const frDifference = targetFr - currentFr;
        
        // Simple approach: adjust the column to the left and right of the splitter
        if (splitterIndex < this.columnSizes.length - 1) {
            // Adjust the last column in the left group and first column in the right group
            const leftColumnIndex = splitterIndex;
            const rightColumnIndex = splitterIndex + 1;
            
            // Calculate minimum size in fractional units based on container width
            const minSizeFr = (minPercentagePerCell * totalFr);
            
            // Calculate proposed new sizes
            const proposedLeftSize = this.columnSizes[leftColumnIndex] + frDifference;
            const proposedRightSize = this.columnSizes[rightColumnIndex] - frDifference;
            
            // Check if both proposed sizes meet minimum requirements
            if (proposedLeftSize >= minSizeFr && proposedRightSize >= minSizeFr) {
                // Both sizes are valid, apply the changes
                this.columnSizes[leftColumnIndex] = proposedLeftSize;
                this.columnSizes[rightColumnIndex] = proposedRightSize;
                
                this.updateGridColumns();
                this.updateSplitterPositions();
                
                console.log(`Column resize applied: left: ${proposedLeftSize.toFixed(2)}fr, right: ${proposedRightSize.toFixed(2)}fr`);
            } else {
                // One or both sizes would violate minimum, don't apply any changes
                console.log(`Column resize blocked: would violate minimum ${minCellWidth}px`);
            }
        }
    }
    
    resizeRows(splitterIndex, targetPercentage) {
        // Ensure the percentage is within bounds
        targetPercentage = Math.max(0.05, Math.min(0.95, targetPercentage));
        
        // Calculate minimum cell height to prevent nine-slice overlap
        const containerRect = this.gridContainer.getBoundingClientRect();
        const borderWidth = parseInt(getComputedStyle(this.gridContainer).borderLeftWidth) || 0;
        const containerHeight = containerRect.height - 2 * borderWidth;
        const minCellHeight = 100; // 50px top corner + 50px bottom corner
        const minPercentagePerCell = minCellHeight / containerHeight;
        
        // Calculate the target position in terms of fractional units
        const totalFr = this.rowSizes.reduce((sum, size) => sum + size, 0);
        const targetFr = targetPercentage * totalFr;
        
        // Calculate current position of this splitter
        let currentFr = 0;
        for (let i = 0; i <= splitterIndex; i++) {
            currentFr += this.rowSizes[i];
        }
        
        // Calculate the difference
        const frDifference = targetFr - currentFr;
        
        // Simple approach: adjust the row above and below the splitter
        if (splitterIndex < this.rowSizes.length - 1) {
            // Adjust the last row in the top group and first row in the bottom group
            const topRowIndex = splitterIndex;
            const bottomRowIndex = splitterIndex + 1;
            
            // Calculate minimum size in fractional units based on container height
            const minSizeFr = (minPercentagePerCell * totalFr);
            
            // Calculate proposed new sizes
            const proposedTopSize = this.rowSizes[topRowIndex] + frDifference;
            const proposedBottomSize = this.rowSizes[bottomRowIndex] - frDifference;
            
            // Check if both proposed sizes meet minimum requirements
            if (proposedTopSize >= minSizeFr && proposedBottomSize >= minSizeFr) {
                // Both sizes are valid, apply the changes
                this.rowSizes[topRowIndex] = proposedTopSize;
                this.rowSizes[bottomRowIndex] = proposedBottomSize;
                
                this.updateGridRows();
                this.updateSplitterPositions();
                
                console.log(`Row resize applied: top: ${proposedTopSize.toFixed(2)}fr, bottom: ${proposedBottomSize.toFixed(2)}fr`);
            } else {
                // One or both sizes would violate minimum, don't apply any changes
                console.log(`Row resize blocked: would violate minimum ${minCellHeight}px`);
            }
        }
    }
    
    updateGridColumns() {
        const columnTemplate = this.columnSizes.map(size => `${size}fr`).join(' ');
        this.gridContainer.style.gridTemplateColumns = columnTemplate;
    }
    
    updateGridRows() {
        const rowTemplate = this.rowSizes.map(size => `${size}fr`).join(' ');
        this.gridContainer.style.gridTemplateRows = rowTemplate;
    }
    
    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        document.body.classList.remove('dragging');
        
        if (this.currentSplitter) {
            this.currentSplitter.classList.remove('dragging');
            this.currentSplitter = null;
        }
    }
    
    addColumn() {
        this.columnSizes.push(1); // Add new column with 1fr
        this.baseColumnSizes.push(1); // Also update base sizes
        this.updateGridStructure();
        this.updateGridControlButtons();
        console.log('Added column, total columns:', this.columnSizes.length);
    }
    
    removeColumn() {
        if (this.columnSizes.length > 1) {
            this.columnSizes.pop(); // Remove last column
            this.baseColumnSizes.pop(); // Also update base sizes
            this.updateGridStructure();
            this.updateGridControlButtons();
            console.log('Removed column, total columns:', this.columnSizes.length);
        }
    }
    
    addRow() {
        this.rowSizes.push(1); // Add new row with 1fr
        this.baseRowSizes.push(1); // Also update base sizes
        this.updateGridStructure();
        this.updateGridControlButtons();
        console.log('Added row, total rows:', this.rowSizes.length);
    }
    
    removeRow() {
        if (this.rowSizes.length > 1) {
            this.rowSizes.pop(); // Remove last row
            this.baseRowSizes.pop(); // Also update base sizes
            this.updateGridStructure();
            this.updateGridControlButtons();
            console.log('Removed row, total rows:', this.rowSizes.length);
        }
    }
    
    updateGridControlButtons() {
        const columnCount = document.getElementById('columnCount');
        const rowCount = document.getElementById('rowCount');
        const removeColumnBtn = document.getElementById('removeColumnBtn');
        const removeRowBtn = document.getElementById('removeRowBtn');
        
        columnCount.textContent = this.columnSizes.length;
        rowCount.textContent = this.rowSizes.length;
        
        // Disable remove buttons if at minimum
        removeColumnBtn.disabled = this.columnSizes.length <= 1;
        removeRowBtn.disabled = this.rowSizes.length <= 1;
    }
    
    updateGridStructure() {
        // Get current image fit mode before updating
        const currentFitMode = document.getElementById('imageFitMode').value;
        console.log('Updating grid structure, preserving fit mode:', currentFitMode);
        
        // Update CSS variables
        document.documentElement.style.setProperty('--grid-columns', this.columnSizes.length);
        document.documentElement.style.setProperty('--grid-rows', this.rowSizes.length);
        
        // Update grid template
        this.updateGridColumns();
        this.updateGridRows();
        
        // Regenerate grid items
        this.regenerateGridItems();
        
        // Regenerate splitters
        this.regenerateSplitters();
        
        // Reload current image if any exists
        if (this.currentImageDataUrl) {
            console.log('Reloading current image, using default:', this.isUsingDefaultImage);
            this.loadImageFromDataUrl(this.currentImageDataUrl);
            
            // Reapply the current fit mode after a short delay to ensure images are loaded
            setTimeout(() => {
                console.log('Reapplying fit mode:', currentFitMode);
                this.setImageFitMode(currentFitMode);
            }, 150);
        }
        
        // Update splitter positions
        setTimeout(() => {
            this.updateSplitterPositions();
        }, 200);
    }
    
    regenerateGridItems() {
        const gridContainer = this.gridContainer;
        
        // Remove existing grid items
        const existingItems = gridContainer.querySelectorAll('.grid-item');
        existingItems.forEach(item => item.remove());
        
        // Create new grid items
        const totalCells = this.columnSizes.length * this.rowSizes.length;
        for (let i = 1; i <= totalCells; i++) {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.setAttribute('data-cell', i);
            
            gridItem.innerHTML = `
                <div class="cell-content">
                    <div class="image-wrapper">
                        <!-- Image will be inserted here -->
                    </div>
                    <div class="cell-label">${i}</div>
                </div>
            `;
            
            gridContainer.appendChild(gridItem);
        }
    }
    
    regenerateSplitters() {
        const gridContainer = this.gridContainer;
        
        // Remove existing splitters
        const existingSplitters = gridContainer.querySelectorAll('.splitter');
        existingSplitters.forEach(splitter => splitter.remove());
        
        // Create vertical splitters (for columns)
        for (let i = 0; i < this.columnSizes.length - 1; i++) {
            const splitter = document.createElement('div');
            splitter.className = 'splitter vertical';
            splitter.setAttribute('data-index', i);
            gridContainer.appendChild(splitter);
        }
        
        // Create horizontal splitters (for rows)
        for (let i = 0; i < this.rowSizes.length - 1; i++) {
            const splitter = document.createElement('div');
            splitter.className = 'splitter horizontal';
            splitter.setAttribute('data-index', i);
            gridContainer.appendChild(splitter);
        }
        
        // Re-setup splitter event listeners
        this.setupSplitters();
    }
    
    toggleAnimation(enabled) {
        this.isAnimating = enabled;
        
        if (enabled) {
            console.log('Starting grid animation');
            // Store current sizes as base sizes for animation
            this.baseColumnSizes = [...this.columnSizes];
            this.baseRowSizes = [...this.rowSizes];
            this.animationTime = 0;
            this.startAnimation();
        } else {
            console.log('Stopping grid animation');
            this.stopAnimation();
            // Reset to base sizes
            this.columnSizes = [...this.baseColumnSizes];
            this.rowSizes = [...this.baseRowSizes];
            this.updateGridColumns();
            this.updateGridRows();
            this.updateSplitterPositions();
        }
    }
    
    startAnimation() {
        if (!this.isAnimating) return;
        
        this.animationId = requestAnimationFrame(() => {
            this.updateAnimation();
            this.startAnimation();
        });
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    updateAnimation() {
        if (!this.isAnimating) return;
        
        // Increment time for smooth animation
        this.animationTime += 0.016 * this.frequency; // Approximately 60fps * frequency
        
        // Calculate minimum size constraints
        const containerRect = this.gridContainer.getBoundingClientRect();
        const borderWidth = parseInt(getComputedStyle(this.gridContainer).borderLeftWidth) || 0;
        const containerWidth = containerRect.width - 2 * borderWidth;
        const containerHeight = containerRect.height - 2 * borderWidth;
        const minCellWidth = 100;
        const minCellHeight = 100;
        const minPercentagePerCellWidth = minCellWidth / containerWidth;
        const minPercentagePerCellHeight = minCellHeight / containerHeight;
        
        // Animate columns
        const totalColumnFr = this.baseColumnSizes.reduce((sum, size) => sum + size, 0);
        const minColumnSizeFr = minPercentagePerCellWidth * totalColumnFr;
        
        for (let i = 0; i < this.columnSizes.length; i++) {
            // Use different phase for each column to create organic movement
            const phase = (i * 2.3) + this.animationTime;
            const noise = this.smoothNoise(phase);
            const variation = noise * this.amplitude;
            
            // Apply variation to base size
            let newSize = this.baseColumnSizes[i] * (1 + variation);
            // Clamp to minimum size
            newSize = Math.max(minColumnSizeFr, newSize);
            
            this.columnSizes[i] = newSize;
        }
        
        // Animate rows
        const totalRowFr = this.baseRowSizes.reduce((sum, size) => sum + size, 0);
        const minRowSizeFr = minPercentagePerCellHeight * totalRowFr;
        
        for (let i = 0; i < this.rowSizes.length; i++) {
            // Use different phase for each row to create organic movement
            const phase = (i * 1.7) + this.animationTime + 100; // Offset from columns
            const noise = this.smoothNoise(phase);
            const variation = noise * this.amplitude;
            
            // Apply variation to base size
            let newSize = this.baseRowSizes[i] * (1 + variation);
            // Clamp to minimum size
            newSize = Math.max(minRowSizeFr, newSize);
            
            this.rowSizes[i] = newSize;
        }
        
        // Update the grid
        this.updateGridColumns();
        this.updateGridRows();
        this.updateSplitterPositions();
    }
    
    // Simple smooth noise function using sine waves
    smoothNoise(x) {
        // Combine multiple sine waves for more organic movement
        const wave1 = Math.sin(x) * 0.5;
        const wave2 = Math.sin(x * 2.1 + 0.5) * 0.3;
        const wave3 = Math.sin(x * 0.7 + 1.2) * 0.2;
        
        return wave1 + wave2 + wave3;
    }
}

// Initialize the grid resizer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GridResizer();
}); 