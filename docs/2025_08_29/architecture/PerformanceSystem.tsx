/**
 * Real-time performance monitoring and optimization system
 * Target: 60+ FPS with 10,000+ particles
 */
import React, { useEffect, useRef, useState } from 'react';
import { Card, Group, Text, Progress, Badge, ActionIcon, Tooltip } from '@mantine/core';
import { IconChartLine, IconSettings, IconAlertTriangle } from '@tabler/icons-react';
import { Line } from 'react-chartjs-2';

export class PerformanceMonitor {
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private fpsHistory: number[] = [];
  private memoryHistory: number[] = [];
  private renderTimeHistory: number[] = [];
  
  private readonly HISTORY_SIZE = 300; // 5 seconds at 60fps
  private readonly FPS_TARGET = 60;
  private readonly MEMORY_TARGET = 50; // MB
  
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];
  
  public startMonitoring(): void {
    const measureFrame = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      
      if (deltaTime >= 16.67) { // ~60fps
        this.frameCount++;
        
        // Calculate FPS
        const fps = 1000 / deltaTime;
        this.fpsHistory.push(fps);
        
        // Memory usage (approximation)
        const memoryUsage = this.estimateMemoryUsage();
        this.memoryHistory.push(memoryUsage);
        
        // Render time measurement
        const renderTime = this.measureRenderTime();
        this.renderTimeHistory.push(renderTime);
        
        // Trim history arrays
        this.trimHistory();
        
        // Calculate metrics
        const metrics = this.calculateMetrics();
        
        // Notify callbacks
        this.callbacks.forEach(callback => callback(metrics));
        
        this.lastFrameTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    measureFrame();
  }
  
  public subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
  
  private calculateMetrics(): PerformanceMetrics {
    const avgFps = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
      : 0;
      
    const currentMemory = this.memoryHistory[this.memoryHistory.length - 1] || 0;
    const avgRenderTime = this.renderTimeHistory.length > 0
      ? this.renderTimeHistory.reduce((a, b) => a + b, 0) / this.renderTimeHistory.length
      : 0;
    
    return {
      fps: avgFps,
      minFps: Math.min(...this.fpsHistory.slice(-60)), // Last 1 second
      maxFps: Math.max(...this.fpsHistory.slice(-60)),
      memoryUsage: currentMemory,
      renderTime: avgRenderTime,
      frameTime: 1000 / avgFps,
      isOptimal: avgFps >= 55 && currentMemory < this.MEMORY_TARGET,
      
      // Performance warnings
      warnings: this.generateWarnings(avgFps, currentMemory, avgRenderTime)
    };
  }
  
  private estimateMemoryUsage(): number {
    // Use performance.memory if available (Chrome)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    
    // Fallback estimation based on particle count and textures
    return 0; // Would be calculated based on actual usage
  }
  
  private measureRenderTime(): number {
    // This would be integrated with the WebGL renderer
    // For now, return a placeholder
    return performance.now() - this.lastFrameTime;
  }
  
  private generateWarnings(fps: number, memory: number, renderTime: number): PerformanceWarning[] {
    const warnings: PerformanceWarning[] = [];
    
    if (fps < 45) {
      warnings.push({
        type: 'fps',
        severity: fps < 30 ? 'critical' : 'warning',
        message: `Low FPS: ${fps.toFixed(1)} (target: ${this.FPS_TARGET})`,
        suggestions: [
          'Reduce particle count',
          'Lower emission rate',
          'Disable expensive effects (glow, trails)',
          'Use simpler particle shapes'
        ]
      });
    }
    
    if (memory > this.MEMORY_TARGET) {
      warnings.push({
        type: 'memory',
        severity: memory > 100 ? 'critical' : 'warning',
        message: `High memory usage: ${memory.toFixed(1)}MB`,
        suggestions: [
          'Enable object pooling',
          'Reduce particle lifetime',
          'Lower texture resolution',
          'Clear unused resources'
        ]
      });
    }
    
    if (renderTime > 16.67) {
      warnings.push({
        type: 'render',
        severity: 'warning',
        message: `Slow render time: ${renderTime.toFixed(1)}ms`,
        suggestions: [
          'Optimize shaders',
          'Use instanced rendering',
          'Enable frustum culling',
          'Reduce shader complexity'
        ]
      });
    }
    
    return warnings;
  }
  
  private trimHistory(): void {
    if (this.fpsHistory.length > this.HISTORY_SIZE) {
      this.fpsHistory.shift();
    }
    if (this.memoryHistory.length > this.HISTORY_SIZE) {
      this.memoryHistory.shift();
    }
    if (this.renderTimeHistory.length > this.HISTORY_SIZE) {
      this.renderTimeHistory.shift();
    }
  }
  
  // Auto-optimization system
  public enableAutoOptimization(particleSystem: any): void {
    this.subscribe((metrics) => {
      if (metrics.fps < 45) {
        // Auto-reduce particle count
        const currentCount = particleSystem.getParticleCount();
        particleSystem.setMaxParticles(Math.max(1000, currentCount * 0.8));
      }
      
      if (metrics.memoryUsage > 75) {
        // Enable memory optimization
        particleSystem.enableObjectPooling(true);
        particleSystem.clearDeadParticles();
      }
      
      if (metrics.fps > 58 && metrics.memoryUsage < 40) {
        // Performance headroom available, can increase quality
        const currentCount = particleSystem.getParticleCount();
        if (currentCount < 10000) {
          particleSystem.setMaxParticles(Math.min(10000, currentCount * 1.1));
        }
      }
    });
  }
}

// React components for performance monitoring UI
export const PerformancePanel: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const monitorRef = useRef<PerformanceMonitor>();
  
  useEffect(() => {
    monitorRef.current = new PerformanceMonitor();
    monitorRef.current.startMonitoring();
    
    const unsubscribe = monitorRef.current.subscribe(setMetrics);
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  if (!metrics) return null;
  
  return (
    <Card shadow="sm" p="md" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text size="sm" fw={600}>Performance Monitor</Text>
        
        <Group gap="xs">
          <ActionIcon
            variant="light"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <IconChartLine size="0.8rem" />
          </ActionIcon>
          
          {metrics.warnings.length > 0 && (
            <Tooltip label={`${metrics.warnings.length} performance warnings`}>
              <ActionIcon variant="light" color="orange" size="sm">
                <IconAlertTriangle size="0.8rem" />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>
      
      <PerformanceMetrics metrics={metrics} />
      
      {showDetails && <DetailedPerformanceView metrics={metrics} />}
      
      {metrics.warnings.length > 0 && (
        <PerformanceWarnings warnings={metrics.warnings} />
      )}
    </Card>
  );
};

const PerformanceMetrics: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => {
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'green';
    if (fps >= 45) return 'yellow';
    return 'red';
  };
  
  const getMemoryColor = (usage: number) => {
    if (usage < 50) return 'green';
    if (usage < 75) return 'yellow';
    return 'red';
  };
  
  return (
    <div className="performance-metrics">
      <Group grow mb="sm">
        <div>
          <Text size="xs" c="dimmed">FPS</Text>
          <Badge color={getFpsColor(metrics.fps)} variant="filled">
            {metrics.fps.toFixed(1)}
          </Badge>
        </div>
        
        <div>
          <Text size="xs" c="dimmed">Memory</Text>
          <Badge color={getMemoryColor(metrics.memoryUsage)} variant="light">
            {metrics.memoryUsage.toFixed(1)}MB
          </Badge>
        </div>
        
        <div>
          <Text size="xs" c="dimmed">Frame Time</Text>
          <Badge color="blue" variant="outline">
            {metrics.frameTime.toFixed(1)}ms
          </Badge>
        </div>
      </Group>
      
      <Progress
        value={(metrics.fps / 60) * 100}
        color={getFpsColor(metrics.fps)}
        size="sm"
        label="FPS Target (60)"
        mb="xs"
      />
      
      <Progress
        value={(metrics.memoryUsage / 100) * 100}
        color={getMemoryColor(metrics.memoryUsage)}
        size="sm"
        label="Memory Usage"
      />
    </div>
  );
};

const DetailedPerformanceView: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => {
  // Chart.js configuration for performance graphs
  const chartData = {
    labels: Array.from({ length: 60 }, (_, i) => i),
    datasets: [
      {
        label: 'FPS',
        data: [], // Would be populated with actual FPS history
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 60
      }
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };
  
  return (
    <div className="detailed-performance" style={{ height: 200, marginTop: 16 }}>
      <Text size="sm" mb="sm">FPS History (Last 60 frames)</Text>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

const PerformanceWarnings: React.FC<{ warnings: PerformanceWarning[] }> = ({ warnings }) => {
  return (
    <div className="performance-warnings" style={{ marginTop: 16 }}>
      <Text size="sm" fw={500} mb="sm" c="orange">
        Performance Warnings
      </Text>
      
      {warnings.map((warning, index) => (
        <Card key={index} p="xs" mb="xs" withBorder>
          <Group gap="xs" mb="xs">
            <Badge 
              color={warning.severity === 'critical' ? 'red' : 'orange'} 
              variant="light"
              size="sm"
            >
              {warning.severity}
            </Badge>
            <Text size="sm">{warning.message}</Text>
          </Group>
          
          <Text size="xs" c="dimmed">Suggestions:</Text>
          <ul style={{ margin: '4px 0', paddingLeft: 16 }}>
            {warning.suggestions.map((suggestion, i) => (
              <li key={i}>
                <Text size="xs" c="dimmed">{suggestion}</Text>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};

// Auto-optimization component
export const PerformanceOptimizer: React.FC<{
  particleSystem: any;
  enabled: boolean;
}> = ({ particleSystem, enabled }) => {
  const monitorRef = useRef<PerformanceMonitor>();
  
  useEffect(() => {
    if (!enabled || !particleSystem) return;
    
    monitorRef.current = new PerformanceMonitor();
    monitorRef.current.startMonitoring();
    monitorRef.current.enableAutoOptimization(particleSystem);
    
    return () => {
      // Cleanup monitoring
    };
  }, [enabled, particleSystem]);
  
  return null; // This component works behind the scenes
};

// Type definitions
export interface PerformanceMetrics {
  fps: number;
  minFps: number;
  maxFps: number;
  memoryUsage: number;
  renderTime: number;
  frameTime: number;
  isOptimal: boolean;
  warnings: PerformanceWarning[];
}

export interface PerformanceWarning {
  type: 'fps' | 'memory' | 'render' | 'gpu';
  severity: 'warning' | 'critical';
  message: string;
  suggestions: string[];
}