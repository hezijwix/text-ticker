# Generative Gallery

A dynamic, interactive gallery application with multiple display modes and real-time animations.

## Features

### 🎯 Four Unique Gallery Modes

1. **Ring Mode** - 3D circular gallery using Three.js
   - Images arranged in a rotating circle
   - Adjustable radius, height, and rotation speed
   - 3D camera controls and lighting

2. **Follow Spline Mode** - 2D drawing with image trails
   - Draw custom paths with your mouse
   - Images follow the drawn spline in real-time
   - Adjustable speed, scale, and density

3. **Cursor Trail Mode** - Interactive mouse following
   - Images form a trail that follows your cursor
   - Smooth interpolation and real-time animation
   - Configurable follow speed and scale

4. **Shuffle Mode** - Animated positioning system
   - Manual or automatic image shuffling
   - Extreme scatter controls with dramatic size variations
   - Seed-based randomization for reproducible layouts

### 🎮 Dynamic Controls

- **Image Management**: Upload multiple images, drag & drop support
- **Mode-Specific Controls**: Each mode has tailored parameter controls
- **Real-time Updates**: All changes apply instantly
- **Responsive Design**: Clean, modern UI that scales to different screen sizes

### 🚀 Key Features

- **Dynamic Image Loading**: Add/remove images on the fly
- **Smooth Animations**: 60fps animations with optimized performance
- **Mode Switching**: Seamlessly switch between gallery modes
- **Custom Canvas Sizes**: Adjustable frame dimensions
- **Advanced Randomization**: Seeded random generation for consistent results

## Usage

1. **Upload Images**: Click the "Add Image" button or use the upload area
2. **Select Mode**: Choose from Ring, Follow Spline, Cursor Trail, or Shuffle
3. **Adjust Parameters**: Use the side panel controls to customize the experience
4. **Interact**: 
   - Ring: Automatic rotation with manual controls
   - Spline: Draw paths with your mouse
   - Trail: Move your cursor to create trails
   - Shuffle: Use seed controls or enable auto-animation

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js for WebGL rendering
- **2D Canvas**: HTML5 Canvas for drawing and animations
- **Responsive Design**: Modern CSS with Flexbox
- **Performance**: RequestAnimationFrame for smooth animations

## File Structure

```
├── index.html          # Main HTML structure
├── style.css           # Complete styling and responsive design
├── script.js           # Main application logic and all gallery modes
├── galleries/          # Modular gallery components
├── managers/           # Scene and UI management utilities
└── utils/             # Helper functions and utilities
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use and modify for your projects! 