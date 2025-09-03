/**
 * MediaPipe hand tracking integration with gesture recognition
 * Optimized for real-time particle system control
 */
import { Hands, Results } from '@mediapipe/hands';

export class MediaPipeController {
  private hands: Hands;
  private videoElement: HTMLVideoElement;
  private gestureProcessor: GestureProcessor;
  private calibrationManager: CalibrationManager;
  
  // Performance optimization
  private readonly TARGET_FPS = 30; // Balance accuracy vs performance
  private lastProcessTime = 0;
  private readonly PROCESS_INTERVAL = 1000 / this.TARGET_FPS;
  
  constructor(
    videoElement: HTMLVideoElement,
    onGestureUpdate: (gestures: GestureData) => void
  ) {
    this.videoElement = videoElement;
    this.gestureProcessor = new GestureProcessor(onGestureUpdate);
    this.calibrationManager = new CalibrationManager();
    
    this.initializeMediaPipe();
  }
  
  private initializeMediaPipe(): void {
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    
    // Optimize for performance vs accuracy balance
    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,        // 0=lite, 1=full (balance performance)
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
      staticImageMode: false     // Video stream optimization
    });
    
    this.hands.onResults(this.onHandResults.bind(this));
    
    // Setup video stream processing
    this.startVideoProcessing();
  }
  
  private onHandResults(results: Results): void {
    // Throttle processing to maintain 60 FPS on particle system
    const now = performance.now();
    if (now - this.lastProcessTime < this.PROCESS_INTERVAL) return;
    this.lastProcessTime = now;
    
    if (results.multiHandLandmarks) {
      const gestures = this.gestureProcessor.processHands(
        results.multiHandLandmarks,
        results.multiHandedness
      );
      
      // Apply calibration offsets
      const calibratedGestures = this.calibrationManager.calibrate(gestures);
      
      // Trigger particle system updates
      this.gestureProcessor.updateParticleSystem(calibratedGestures);
    }
  }
  
  private startVideoProcessing(): void {
    const processFrame = async () => {
      if (this.videoElement.readyState >= 2) {
        await this.hands.send({ image: this.videoElement });
      }
      requestAnimationFrame(processFrame);
    };
    processFrame();
  }
}

/**
 * Gesture processing and particle system mapping
 */
export class GestureProcessor {
  private onGestureUpdate: (gestures: GestureData) => void;
  private gestureHistory: GestureData[] = [];
  private readonly HISTORY_SIZE = 10;
  
  constructor(onGestureUpdate: (gestures: GestureData) => void) {
    this.onGestureUpdate = onGestureUpdate;
  }
  
  public processHands(
    landmarks: any[],
    handedness: any[]
  ): GestureData {
    const gestures: GestureData = {
      leftHand: null,
      rightHand: null,
      gestures: [],
      timestamp: performance.now()
    };
    
    landmarks.forEach((hand, index) => {
      const isRight = handedness[index].label === 'Right';
      const handData = this.processHandLandmarks(hand);
      
      if (isRight) {
        gestures.rightHand = handData;
      } else {
        gestures.leftHand = handData;
      }
      
      // Detect specific gestures
      const detectedGestures = this.detectGestures(hand);
      gestures.gestures.push(...detectedGestures);
    });
    
    // Smooth gestures over time
    this.smoothGestures(gestures);
    
    return gestures;
  }
  
  private processHandLandmarks(landmarks: any[]): HandData {
    return {
      palm: this.getLandmarkPosition(landmarks[9]),
      thumb: this.getLandmarkPosition(landmarks[4]),
      indexFinger: this.getLandmarkPosition(landmarks[8]),
      middleFinger: this.getLandmarkPosition(landmarks[12]),
      ringFinger: this.getLandmarkPosition(landmarks[16]),
      pinky: this.getLandmarkPosition(landmarks[20]),
      
      // Calculated properties for particle control
      palmVelocity: this.calculateVelocity(landmarks[9]),
      fingerSpread: this.calculateFingerSpread(landmarks),
      handOpenness: this.calculateHandOpenness(landmarks),
      
      // Gesture-specific calculations
      pinchStrength: this.calculatePinchStrength(landmarks[4], landmarks[8]),
      grabStrength: this.calculateGrabStrength(landmarks)
    };
  }
  
  private detectGestures(landmarks: any[]): DetectedGesture[] {
    const gestures: DetectedGesture[] = [];
    
    // Pinch gesture (thumb + index finger)
    const pinchDistance = this.calculateDistance(landmarks[4], landmarks[8]);
    if (pinchDistance < 0.05) {
      gestures.push({
        type: 'pinch',
        confidence: Math.max(0, 1 - (pinchDistance / 0.05)),
        position: this.getMidpoint(landmarks[4], landmarks[8])
      });
    }
    
    // Grab gesture (all fingers closed)
    if (this.calculateHandOpenness(landmarks) < 0.3) {
      gestures.push({
        type: 'grab',
        confidence: 1 - this.calculateHandOpenness(landmarks),
        position: this.getLandmarkPosition(landmarks[9])
      });
    }
    
    // Wave gesture (rapid side-to-side motion)
    if (this.detectWaveMotion(landmarks[9])) {
      gestures.push({
        type: 'wave',
        confidence: 0.8,
        position: this.getLandmarkPosition(landmarks[9])
      });
    }
    
    return gestures;
  }
  
  public updateParticleSystem(gestures: GestureData): void {
    // Map gestures to particle system parameters
    const particleUpdates: ParticleSystemUpdate = {
      timestamp: gestures.timestamp
    };
    
    // Left hand controls particle emission
    if (gestures.leftHand) {
      particleUpdates.emissionRate = gestures.leftHand.handOpenness * 1000;
      particleUpdates.emissionPosition = gestures.leftHand.palm;
      particleUpdates.emissionVelocity = gestures.leftHand.palmVelocity;
    }
    
    // Right hand controls particle behavior
    if (gestures.rightHand) {
      particleUpdates.gravity = gestures.rightHand.palm;
      particleUpdates.turbulence = gestures.rightHand.fingerSpread;
    }
    
    // Gesture-based effects
    gestures.gestures.forEach(gesture => {
      switch (gesture.type) {
        case 'pinch':
          particleUpdates.attraction = {
            position: gesture.position,
            strength: gesture.confidence * 100
          };
          break;
        case 'grab':
          particleUpdates.repulsion = {
            position: gesture.position,
            strength: gesture.confidence * 150
          };
          break;
        case 'wave':
          particleUpdates.turbulence = gesture.confidence * 50;
          break;
      }
    });
    
    this.onGestureUpdate(gestures);
  }
  
  private smoothGestures(currentGestures: GestureData): void {
    // Implement temporal smoothing to reduce jitter
    this.gestureHistory.push(currentGestures);
    if (this.gestureHistory.length > this.HISTORY_SIZE) {
      this.gestureHistory.shift();
    }
    
    // Apply exponential smoothing
    if (this.gestureHistory.length > 1) {
      // Smooth position data over time
      // Implementation depends on specific smoothing requirements
    }
  }
}

// Type definitions
export interface GestureData {
  leftHand: HandData | null;
  rightHand: HandData | null;
  gestures: DetectedGesture[];
  timestamp: number;
}

export interface HandData {
  palm: Vector3;
  thumb: Vector3;
  indexFinger: Vector3;
  middleFinger: Vector3;
  ringFinger: Vector3;
  pinky: Vector3;
  palmVelocity: Vector3;
  fingerSpread: number;
  handOpenness: number;
  pinchStrength: number;
  grabStrength: number;
}

export interface DetectedGesture {
  type: 'pinch' | 'grab' | 'wave' | 'point';
  confidence: number;
  position: Vector3;
}

export interface ParticleSystemUpdate {
  timestamp: number;
  emissionRate?: number;
  emissionPosition?: Vector3;
  emissionVelocity?: Vector3;
  gravity?: Vector3;
  turbulence?: number;
  attraction?: { position: Vector3; strength: number };
  repulsion?: { position: Vector3; strength: number };
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}