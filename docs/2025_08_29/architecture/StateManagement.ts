/**
 * Zustand + Immer state management for particle system
 * Optimized for real-time updates and performance
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

// Particle System Store
export interface ParticleSystemState {
  // Core particle properties
  config: ParticleConfig;
  isPlaying: boolean;
  currentTime: number;
  totalParticles: number;
  
  // MediaPipe integration
  gestureData: GestureData | null;
  mediaPipeEnabled: boolean;
  calibrationData: CalibrationData;
  
  // Performance monitoring
  performance: PerformanceMetrics;
  performanceHistory: PerformanceMetrics[];
  
  // UI state
  selectedTool: 'emitter' | 'attractor' | 'repulsor' | 'wind';
  viewMode: '2d' | '3d';
  showPerformanceOverlay: boolean;
  showGestureBounds: boolean;
  
  // Presets and history
  presets: ParticlePreset[];
  undoStack: ParticleConfig[];
  redoStack: ParticleConfig[];
  
  // Actions
  updateConfig: (updates: Partial<ParticleConfig>) => void;
  resetConfig: () => void;
  playPause: () => void;
  updateTime: (deltaTime: number) => void;
  
  // MediaPipe actions
  updateGestureData: (data: GestureData) => void;
  toggleMediaPipe: () => void;
  updateCalibration: (data: CalibrationData) => void;
  
  // Performance actions
  updatePerformance: (metrics: PerformanceMetrics) => void;
  
  // UI actions
  setSelectedTool: (tool: string) => void;
  setViewMode: (mode: '2d' | '3d') => void;
  togglePerformanceOverlay: () => void;
  
  // Preset actions
  savePreset: (name: string, description?: string) => void;
  loadPreset: (preset: ParticlePreset) => void;
  deletePreset: (id: string) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  pushToUndoStack: () => void;
}

export const useParticleSystemStore = create<ParticleSystemState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        // Initial state
        config: DEFAULT_PARTICLE_CONFIG,
        isPlaying: false,
        currentTime: 0,
        totalParticles: 0,
        
        gestureData: null,
        mediaPipeEnabled: false,
        calibrationData: DEFAULT_CALIBRATION,
        
        performance: {
          fps: 60,
          memoryUsage: 0,
          particleCount: 0,
          renderTime: 0,
          gpuUtilization: 0
        },
        performanceHistory: [],
        
        selectedTool: 'emitter',
        viewMode: '3d',
        showPerformanceOverlay: false,
        showGestureBounds: false,
        
        presets: DEFAULT_PRESETS,
        undoStack: [],
        redoStack: [],
        
        // Actions
        updateConfig: (updates) => 
          set((state) => {
            // Push current config to undo stack before changing
            state.undoStack.push(structuredClone(state.config));
            if (state.undoStack.length > 50) {
              state.undoStack.shift();
            }
            state.redoStack = []; // Clear redo stack
            
            // Update config
            Object.assign(state.config, updates);
          }),
          
        resetConfig: () =>
          set((state) => {
            state.undoStack.push(structuredClone(state.config));
            state.config = DEFAULT_PARTICLE_CONFIG;
            state.redoStack = [];
          }),
          
        playPause: () =>
          set((state) => {
            state.isPlaying = !state.isPlaying;
          }),
          
        updateTime: (deltaTime) =>
          set((state) => {
            if (state.isPlaying) {
              state.currentTime += deltaTime;
            }
          }),
          
        // MediaPipe actions
        updateGestureData: (data) =>
          set((state) => {
            state.gestureData = data;
          }),
          
        toggleMediaPipe: () =>
          set((state) => {
            state.mediaPipeEnabled = !state.mediaPipeEnabled;
            if (!state.mediaPipeEnabled) {
              state.gestureData = null;
            }
          }),
          
        updateCalibration: (data) =>
          set((state) => {
            state.calibrationData = data;
          }),
          
        // Performance actions
        updatePerformance: (metrics) =>
          set((state) => {
            state.performance = metrics;
            
            // Keep performance history for trending
            state.performanceHistory.push(metrics);
            if (state.performanceHistory.length > 300) { // 5 seconds at 60fps
              state.performanceHistory.shift();
            }
          }),
          
        // UI actions
        setSelectedTool: (tool) =>
          set((state) => {
            state.selectedTool = tool as any;
          }),
          
        setViewMode: (mode) =>
          set((state) => {
            state.viewMode = mode;
          }),
          
        togglePerformanceOverlay: () =>
          set((state) => {
            state.showPerformanceOverlay = !state.showPerformanceOverlay;
          }),
          
        // Preset actions
        savePreset: (name, description = '') =>
          set((state) => {
            const preset: ParticlePreset = {
              id: crypto.randomUUID(),
              name,
              description,
              config: structuredClone(state.config),
              timestamp: Date.now()
            };
            state.presets.push(preset);
          }),
          
        loadPreset: (preset) =>
          set((state) => {
            state.undoStack.push(structuredClone(state.config));
            state.config = structuredClone(preset.config);
            state.redoStack = [];
          }),
          
        deletePreset: (id) =>
          set((state) => {
            state.presets = state.presets.filter(p => p.id !== id);
          }),
          
        // Undo/Redo
        undo: () =>
          set((state) => {
            const previous = state.undoStack.pop();
            if (previous) {
              state.redoStack.push(structuredClone(state.config));
              state.config = previous;
            }
          }),
          
        redo: () =>
          set((state) => {
            const next = state.redoStack.pop();
            if (next) {
              state.undoStack.push(structuredClone(state.config));
              state.config = next;
            }
          }),
          
        pushToUndoStack: () =>
          set((state) => {
            state.undoStack.push(structuredClone(state.config));
            if (state.undoStack.length > 50) {
              state.undoStack.shift();
            }
          }),
      })),
      {
        name: 'particle-system-store',
        // Only persist user preferences, not runtime state
        partialize: (state) => ({
          config: state.config,
          presets: state.presets,
          viewMode: state.viewMode,
          showPerformanceOverlay: state.showPerformanceOverlay,
          calibrationData: state.calibrationData
        })
      }
    )
  )
);

// Performance monitoring hook with automatic optimization
export const usePerformanceMonitor = () => {
  const { performance, updatePerformance } = useParticleSystemStore();
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    // Monitor performance and suggest optimizations
    const suggestions: string[] = [];
    
    if (performance.fps < 45) {
      suggestions.push('Consider reducing particle count or emission rate');
    }
    
    if (performance.memoryUsage > 100) {
      suggestions.push('High memory usage detected - enable object pooling');
    }
    
    if (performance.gpuUtilization > 80) {
      suggestions.push('GPU utilization high - reduce particle complexity');
    }
    
    setOptimizationSuggestions(suggestions);
  }, [performance]);
  
  return {
    performance,
    optimizationSuggestions,
    isOptimal: performance.fps >= 55 && performance.memoryUsage < 50
  };
};

// Gesture integration hook
export const useGestureIntegration = () => {
  const { 
    gestureData, 
    mediaPipeEnabled, 
    updateGestureData,
    updateConfig,
    config 
  } = useParticleSystemStore();
  
  // Auto-map gestures to particle parameters
  useEffect(() => {
    if (!mediaPipeEnabled || !gestureData) return;
    
    const updates: Partial<ParticleConfig> = {};
    
    // Left hand controls emission
    if (gestureData.leftHand) {
      updates.emissionRate = gestureData.leftHand.handOpenness * 1000;
      // Map palm position to emission position
    }
    
    // Right hand controls physics
    if (gestureData.rightHand) {
      updates.gravity = {
        x: (gestureData.rightHand.palm.x - 0.5) * 200,
        y: (gestureData.rightHand.palm.y - 0.5) * -200,
        z: 0
      };
    }
    
    // Apply gesture-based updates
    if (Object.keys(updates).length > 0) {
      updateConfig(updates);
    }
  }, [gestureData, mediaPipeEnabled, updateConfig]);
  
  return {
    gestureData,
    isEnabled: mediaPipeEnabled
  };
};

// Constants and default values
const DEFAULT_PARTICLE_CONFIG: ParticleConfig = {
  emissionRate: 100,
  burstSize: 1,
  emissionSpread: 45,
  initialVelocity: 100,
  velocityRandomness: 20,
  gravity: { x: 0, y: -98, z: 0 },
  airResistance: 0.01,
  turbulence: 0,
  lifetime: 3.0,
  lifetimeVariance: 50,
  startColor: '#ff6b6b',
  endColor: '#4ecdc4',
  startSize: 5,
  endSize: 0,
  opacity: 1.0,
  enableGlow: true,
  enableTrails: false
};

const DEFAULT_CALIBRATION: CalibrationData = {
  handBounds: {
    minX: 0, maxX: 1,
    minY: 0, maxY: 1,
    minZ: 0, maxZ: 1
  },
  gestureThresholds: {
    pinch: 0.05,
    grab: 0.3,
    wave: 0.1
  }
};

const DEFAULT_PRESETS: ParticlePreset[] = [
  {
    id: 'fire',
    name: 'Fire',
    description: 'Realistic fire effect with upward motion',
    config: {
      ...DEFAULT_PARTICLE_CONFIG,
      startColor: '#ff4444',
      endColor: '#ffaa00',
      gravity: { x: 0, y: 50, z: 0 },
      turbulence: 30
    },
    timestamp: Date.now()
  }
  // Add more default presets
];

// Type definitions
export interface ParticleConfig {
  emissionRate: number;
  burstSize: number;
  emissionSpread: number;
  initialVelocity: number;
  velocityRandomness: number;
  gravity: { x: number; y: number; z: number };
  airResistance: number;
  turbulence: number;
  lifetime: number;
  lifetimeVariance: number;
  startColor: string;
  endColor: string;
  startSize: number;
  endSize: number;
  opacity: number;
  enableGlow: boolean;
  enableTrails: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  particleCount: number;
  renderTime: number;
  gpuUtilization: number;
}

export interface CalibrationData {
  handBounds: {
    minX: number; maxX: number;
    minY: number; maxY: number;
    minZ: number; maxZ: number;
  };
  gestureThresholds: {
    pinch: number;
    grab: number;
    wave: number;
  };
}

export interface ParticlePreset {
  id: string;
  name: string;
  description: string;
  config: ParticleConfig;
  timestamp: number;
}