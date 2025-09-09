# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT MAINTENANCE RULE
**File Structure Updates**: Any changes to the project file structure (adding/removing/moving files or directories) MUST be reflected in the "File Structure" section of this document. This ensures Claude always has current context about the codebase organization.

## Project Overview

**Text Ticker Tool** - A specialized typography application for creating animated text paths with advanced font controls. The application supports both primitive shapes (circle, rectangle) and custom vector splines for flexible text layout, featuring smooth animation controls for dynamic typography effects. Built with P5.js for sophisticated typography rendering and Canvas 2D context for variable font support.

## Development Setup

- **Technology Stack**: Vanilla JavaScript project with no build system
- **Development**: Open `index.html` in browser or use local server
- **Dependencies**: CDN-based (P5.js, FFmpeg.js, JSZip) - no package.json
- **Commands**: No build, test, or lint commands available
- **Architecture**: Modular composition pattern for maintainability and extensibility

## Core Architecture

### System Design
- **P5.js Instance Mode**: Isolated P5.js context with advanced typography rendering
- **Hybrid Rendering**: P5.js transformations + Canvas 2D for variable font support
- **Dual Path System**: Shape mode (parametric geometries) + Spline mode (custom vector curves)
- **Modular Composition**: Dependency injection pattern with specialized modules

### Typography Capabilities
- **Variable Fonts**: Primary font Wix Madefor Display (400-800 weight), Inter, Roboto fallbacks
- **Path Types**: Circle, rectangle with parametric controls; custom splines with curve interpolation
- **Interactive Editing**: Point-and-click spline creation with visual guides
- **Character Positioning**: Precise rotation and scaling along any path type
- **Animation System**: Smooth animation offsets with 60fps performance
- **Export Formats**: PNG, MP4, PNG sequences with automatic guide hiding

### Ribbon Modes
- **Off**: Clean text without decorative elements
- **Character Borders**: Individual character outlines
- **Shape Path**: Path visualization for reference
- **Words Bound**: Word-level ribbon segments (critical feature requiring special coordinate handling)

## File Structure

### Application Core
- **`index.html`**: UI structure with path mode controls and P5.js integration
- **`design-system.md`**: **Comprehensive UI/UX design system - reference for all styling decisions**

### JavaScript Modules (Composition Pattern)
- **`js/TextTickerTool.js`**: Main orchestrator (~800 lines) - module coordination, UI state, P5.js management
- **`js/ShapeMode.js`**: Geometric paths (~510 lines) - circles, rectangles, ribbons
- **`js/SplineMode.js`**: Custom curves (~585 lines) - splines, interpolation, interactive editing
- **`js/ExportManager.js`**: Output generation (~300 lines) - PNG, MP4, sequences

### Styling System
- **`css/variables.css`**: Design tokens, color system, typography scale
- **`css/layout.css`**: Grid system, responsive structure, component positioning
- **`css/controls.css`**: Form elements, interactive states
- **`css/toggles.css`**: Custom toggles, radio buttons, checkboxes
- **`css/modals.css`**: Export modal, help dialogs
- **`css/style.css`**: Canvas integration, P5.js positioning

### Reference
- **`legacy/script.js`**: Original monolithic implementation preserved for reference

## Key Features

### Typography System
- **Shape Paths**: Circle (radius-controlled), Rectangle (width/height/corner radius)
- **Spline Paths**: Linear or Catmull-Rom interpolation with arc-length parameterization
- **Font Management**: Real-time variable font weight transitions with live preview
- **Character Distribution**: Even spacing regardless of path curvature
- **Visual Guides**: Optional editing visualization (hidden during export)

### Export Capabilities
- **Static Export**: High-quality PNG with guide management
- **Animation Export**: MP4 video with frame-by-frame rendering
- **Sequence Export**: PNG frames in ZIP for external processing
- **Resolution Independence**: Export at original resolution regardless of zoom

### User Interface
- **Path Mode Toggle**: Shape vs Spline with dynamic control panels
- **Real-time Preview**: Instant updates with zoom and pan controls
- **Responsive Design**: Mobile-optimized layout with touch support
- **Dark Theme**: Eye-strain optimized for extended typography work

## Development Guidance

### MCP Tool Usage
- **Playwright MCP**: Use for testing application functionality, validating UI interactions, checking export features, and visual regression testing
- **Context7 MCP**: Use for P5.js documentation lookup, JavaScript framework patterns, and typography implementation references

### UI/UX Development
- **Primary Reference**: `design-system.md` contains comprehensive styling guidelines, component patterns, color system, and responsive design principles
- **Design System**: 099.supply-inspired minimal aesthetic with dark mode optimization
- **Component Development**: Follow modular CSS architecture with CSS custom properties

### Architecture Patterns

#### Modular Composition
- **Dependency Injection**: Modules receive `tool` instance for shared state access
- **Zero Breaking Changes**: Seamless transition from monolithic to modular
- **Separation of Concerns**: Each module handles specific domain expertise
- **Event Coordination**: UI controls trigger module-specific rendering updates

#### Module Communication
- **TextTickerTool**: Orchestrates all modules, manages P5.js instance, handles UI state
- **Path Delegation**: Routes rendering calls to appropriate modules (Shape/Spline)
- **Shared State**: Typography controls, animation state, export settings accessible to all modules
- **Mouse Event Routing**: Interactive editing delegated to active module

#### Critical Architecture Lessons
- **Words Bound Ribbon**: Requires special coordinate transformation handling in spline mode
- **Interface Completeness**: All modules must implement full ribbon mode support
- **Canvas State Management**: Proper save/restore cycles essential for transformations
- **Arc-Length Parameterization**: Ensures consistent character spacing on curved paths

### Development Workflows

#### Adding New Typography Features
1. **Planning**: Determine if feature belongs in ShapeMode, SplineMode, or requires new module
2. **UI Controls**: Add controls to `index.html` with event handlers in TextTickerTool
3. **Module Implementation**: Add rendering methods with full ribbon support
4. **Path Dispatcher**: Update routing logic in TextTickerTool
5. **Export Integration**: Verify compatibility with ExportManager
6. **Testing**: Use Playwright MCP for comprehensive validation across all modes

#### UI Development Process
1. **Design Reference**: Check `design-system.md` for patterns and guidelines
2. **CSS Module Selection**: Choose appropriate CSS file based on component type
3. **Variable Integration**: Use CSS custom properties for theming consistency
4. **Responsive Implementation**: Follow mobile-first approach with defined breakpoints
5. **Testing**: Use Playwright MCP for cross-browser and responsive validation

#### Debugging and Testing
- **Playwright MCP**: Visual testing, interaction validation, export verification
- **Context7 MCP**: API documentation lookup, best practices research
- **Manual Testing**: Browser-based preview with export validation
- **Legacy Reference**: Use `legacy/script.js` for method comparison and bug investigation

### Performance Considerations
- **Conditional Rendering**: Only redraw on state changes
- **Path Caching**: Store calculated lengths to avoid recalculation
- **Guide Toggle**: Optional rendering for better performance
- **Memory Management**: Proper P5.js lifecycle and resource cleanup

### Future Extensibility
Architecture designed for additional typography modes:
- **Physics-Based Animation**: Dynamic text with collision and spring physics
- **Bezier Curve Paths**: Parametric curves with control point handles
- **Interactive Deformation**: Real-time morphing along paths
- **Multi-Path Systems**: Complex arrangements with path transitions

## Technical Dependencies

### External Libraries
- **P5.js v1.11.8**: Core graphics and typography engine
- **Google Fonts CDN**: Variable font delivery with preconnect optimization
- **JSZip**: PNG sequence packaging
- **FFmpeg.js**: MP4 video generation (planned enhancement)

### Browser Requirements
- Canvas 2D context support
- Variable font support (Chrome 62+, Firefox 62+, Safari 11+)
- WebGL support for P5.js (fallback available)

---

## Quick Reference

**For UI/Design Questions**: See `design-system.md`  
**For Testing/Validation**: Use Playwright MCP  
**For Documentation/APIs**: Use Context7 MCP  
**For Implementation Reference**: Check `legacy/script.js`  
**For Architecture**: Follow composition pattern with dependency injection