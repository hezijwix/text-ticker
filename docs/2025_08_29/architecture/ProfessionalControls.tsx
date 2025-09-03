/**
 * Professional control panel components for particle system
 * Optimized for real-time parameter adjustment
 */
import React, { useCallback, useMemo } from 'react';
import {
  NumberInput,
  Slider,
  ColorInput,
  Switch,
  Tabs,
  Card,
  Group,
  Text,
  Badge,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { IconSettings, IconEye, IconWand } from '@tabler/icons-react';
import { useParticleSystem } from '../hooks/useParticleSystem';
import { usePerformance } from '../hooks/usePerformance';

export const ProfessionalControlPanel: React.FC = () => {
  const { 
    particleConfig, 
    updateConfig, 
    presets, 
    savePreset,
    loadPreset 
  } = useParticleSystem();
  
  const { metrics, isPerformanceOptimal } = usePerformance();
  
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="control-panel">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>Particle System Controls</Text>
        <PerformanceIndicator metrics={metrics} />
      </Group>
      
      <Tabs defaultValue="emission" className="control-tabs">
        <Tabs.List>
          <Tabs.Tab value="emission" leftSection={<IconWand size="0.8rem" />}>
            Emission
          </Tabs.Tab>
          <Tabs.Tab value="physics" leftSection={<IconSettings size="0.8rem" />}>
            Physics
          </Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<IconEye size="0.8rem" />}>
            Appearance
          </Tabs.Tab>
        </Tabs.List>
        
        <Tabs.Panel value="emission" pt="md">
          <EmissionControls config={particleConfig} onChange={updateConfig} />
        </Tabs.Panel>
        
        <Tabs.Panel value="physics" pt="md">
          <PhysicsControls config={particleConfig} onChange={updateConfig} />
        </Tabs.Panel>
        
        <Tabs.Panel value="appearance" pt="md">
          <AppearanceControls config={particleConfig} onChange={updateConfig} />
        </Tabs.Panel>
      </Tabs>
      
      <PresetManager 
        presets={presets}
        onSave={savePreset}
        onLoad={loadPreset}
      />
    </Card>
  );
};

// Emission controls for particle generation
const EmissionControls: React.FC<{
  config: ParticleConfig;
  onChange: (updates: Partial<ParticleConfig>) => void;
}> = ({ config, onChange }) => {
  
  const handleEmissionRateChange = useCallback((value: number) => {
    onChange({ emissionRate: Math.max(0, Math.min(10000, value)) });
  }, [onChange]);
  
  return (
    <div className="control-section">
      <Group grow mb="md">
        <NumberInput
          label="Particles per Second"
          value={config.emissionRate}
          onChange={handleEmissionRateChange}
          min={0}
          max={10000}
          step={10}
          description="Higher values may impact performance"
        />
        
        <NumberInput
          label="Burst Size"
          value={config.burstSize}
          onChange={(value) => onChange({ burstSize: value as number })}
          min={1}
          max={1000}
          description="Particles emitted per burst"
        />
      </Group>
      
      <Slider
        label="Emission Spread"
        value={config.emissionSpread}
        onChange={(value) => onChange({ emissionSpread: value })}
        min={0}
        max={180}
        step={1}
        marks={[
          { value: 0, label: '0°' },
          { value: 45, label: '45°' },
          { value: 90, label: '90°' },
          { value: 180, label: '180°' }
        ]}
        mb="md"
      />
      
      <Group grow>
        <NumberInput
          label="Initial Velocity"
          value={config.initialVelocity}
          onChange={(value) => onChange({ initialVelocity: value as number })}
          min={0}
          max={1000}
          step={5}
        />
        
        <NumberInput
          label="Velocity Randomness"
          value={config.velocityRandomness}
          onChange={(value) => onChange({ velocityRandomness: value as number })}
          min={0}
          max={100}
          step={1}
        />
      </Group>
    </div>
  );
};

// Physics controls for particle behavior
const PhysicsControls: React.FC<{
  config: ParticleConfig;
  onChange: (updates: Partial<ParticleConfig>) => void;
}> = ({ config, onChange }) => {
  
  return (
    <div className="control-section">
      <Group grow mb="md">
        <NumberInput
          label="Gravity X"
          value={config.gravity.x}
          onChange={(value) => onChange({ 
            gravity: { ...config.gravity, x: value as number } 
          })}
          min={-1000}
          max={1000}
          step={1}
        />
        
        <NumberInput
          label="Gravity Y"
          value={config.gravity.y}
          onChange={(value) => onChange({ 
            gravity: { ...config.gravity, y: value as number } 
          })}
          min={-1000}
          max={1000}
          step={1}
        />
        
        <NumberInput
          label="Gravity Z"
          value={config.gravity.z}
          onChange={(value) => onChange({ 
            gravity: { ...config.gravity, z: value as number } 
          })}
          min={-1000}
          max={1000}
          step={1}
        />
      </Group>
      
      <Slider
        label="Air Resistance"
        value={config.airResistance}
        onChange={(value) => onChange({ airResistance: value })}
        min={0}
        max={1}
        step={0.01}
        mb="md"
      />
      
      <Slider
        label="Turbulence Strength"
        value={config.turbulence}
        onChange={(value) => onChange({ turbulence: value })}
        min={0}
        max={100}
        step={1}
        mb="md"
      />
      
      <Group grow>
        <NumberInput
          label="Particle Lifetime"
          value={config.lifetime}
          onChange={(value) => onChange({ lifetime: value as number })}
          min={0.1}
          max={30}
          step={0.1}
          suffix=" sec"
        />
        
        <NumberInput
          label="Lifetime Variance"
          value={config.lifetimeVariance}
          onChange={(value) => onChange({ lifetimeVariance: value as number })}
          min={0}
          max={100}
          step={1}
          suffix=" %"
        />
      </Group>
    </div>
  );
};

// Appearance controls for visual properties
const AppearanceControls: React.FC<{
  config: ParticleConfig;
  onChange: (updates: Partial<ParticleConfig>) => void;
}> = ({ config, onChange }) => {
  
  return (
    <div className="control-section">
      <Group grow mb="md">
        <ColorInput
          label="Start Color"
          value={config.startColor}
          onChange={(value) => onChange({ startColor: value })}
          format="rgba"
          swatches={[
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
            '#ff00ff', '#00ffff', '#ffffff', '#000000'
          ]}
        />
        
        <ColorInput
          label="End Color"
          value={config.endColor}
          onChange={(value) => onChange({ endColor: value })}
          format="rgba"
        />
      </Group>
      
      <Group grow mb="md">
        <NumberInput
          label="Start Size"
          value={config.startSize}
          onChange={(value) => onChange({ startSize: value as number })}
          min={0.1}
          max={100}
          step={0.1}
        />
        
        <NumberInput
          label="End Size"
          value={config.endSize}
          onChange={(value) => onChange({ endSize: value as number })}
          min={0.1}
          max={100}
          step={0.1}
        />
      </Group>
      
      <Slider
        label="Opacity"
        value={config.opacity}
        onChange={(value) => onChange({ opacity: value })}
        min={0}
        max={1}
        step={0.01}
        mb="md"
      />
      
      <Switch
        label="Enable Glow"
        checked={config.enableGlow}
        onChange={(event) => onChange({ 
          enableGlow: event.currentTarget.checked 
        })}
        mb="md"
      />
      
      <Switch
        label="Enable Trails"
        checked={config.enableTrails}
        onChange={(event) => onChange({ 
          enableTrails: event.currentTarget.checked 
        })}
      />
    </div>
  );
};

// Performance indicator component
const PerformanceIndicator: React.FC<{
  metrics: PerformanceMetrics;
}> = ({ metrics }) => {
  
  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'green';
    if (fps >= 30) return 'yellow';
    return 'red';
  };
  
  const getMemoryColor = (usage: number) => {
    if (usage < 50) return 'green';
    if (usage < 75) return 'yellow';
    return 'red';
  };
  
  return (
    <Group gap="xs">
      <Tooltip label={`${metrics.fps.toFixed(1)} FPS`}>
        <Badge color={getPerformanceColor(metrics.fps)} variant="filled">
          {metrics.fps.toFixed(0)} FPS
        </Badge>
      </Tooltip>
      
      <Tooltip label={`${metrics.memoryUsage.toFixed(1)}MB Memory`}>
        <Badge color={getMemoryColor(metrics.memoryUsage)} variant="light">
          {metrics.memoryUsage.toFixed(0)}MB
        </Badge>
      </Tooltip>
      
      <Tooltip label={`${metrics.particleCount} Particles`}>
        <Badge color="blue" variant="outline">
          {metrics.particleCount}
        </Badge>
      </Tooltip>
    </Group>
  );
};

// Preset management component
const PresetManager: React.FC<{
  presets: ParticlePreset[];
  onSave: (name: string) => void;
  onLoad: (preset: ParticlePreset) => void;
}> = ({ presets, onSave, onLoad }) => {
  
  return (
    <Card withBorder p="md" mt="md">
      <Text size="sm" fw={500} mb="sm">Presets</Text>
      
      <Group gap="xs" mb="sm">
        {presets.map((preset) => (
          <Tooltip key={preset.id} label={preset.description}>
            <ActionIcon
              variant="light"
              size="sm"
              onClick={() => onLoad(preset)}
            >
              {preset.name}
            </ActionIcon>
          </Tooltip>
        ))}
      </Group>
      
      {/* Add preset save functionality */}
    </Card>
  );
};

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
}

export interface ParticlePreset {
  id: string;
  name: string;
  description: string;
  config: ParticleConfig;
}