import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import {
  setAiInstructionsEnabled,
  setAiInstructionsText,
  getAiConfig,
  setAiTemperature,
  setAiMaxTokens,
  setAiModel,
} from '@/lib/aiConfig';

export const Sidebar: React.FC = () => {
  const initial = getAiConfig();
  const [instructions, setInstructions] = useState<string>(initial.instructionsText);
  const [useInstructions, setUseInstructions] = useState<boolean>(initial.instructionsEnabled);
  const [temperature, setTemperatureLocal] = useState<number>(initial.temperature);
  const [maxTokens, setMaxTokensLocal] = useState<number>(initial.maxTokens);
  const [model, setModelLocal] = useState<string>(initial.model);

  const models = [
    'gpt-4o-mini',
    'gpt-4.1-mini',
    'gpt-4o',
    'gpt-3.5-turbo',
  ];

  useEffect(() => {
    setAiInstructionsText(instructions);
  }, [instructions]);

  useEffect(() => {
    setAiInstructionsEnabled(useInstructions);
  }, [useInstructions]);

  useEffect(() => {
    setAiTemperature(temperature);
  }, [temperature]);

  useEffect(() => {
    setAiMaxTokens(maxTokens);
  }, [maxTokens]);

  useEffect(() => {
    setAiModel(model);
  }, [model]);

  return (
    <div className=" glass-sidebar border border-zinc-300/25 rounded-lg h-full flex flex-col overflow-hidden">
      <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Temperature</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{temperature.toFixed(2)}</span>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(v: number[]) => setTemperatureLocal(v?.[0] ?? 0)}
            min={0}
            max={2}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Max tokens</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{maxTokens}</span>
          </div>
          <Input
            type="number"
            min={1}
            max={4096}
            value={maxTokens}
            onChange={(e) => {
              const next = parseInt(e.target.value || '0', 10);
              if (!Number.isNaN(next)) setMaxTokensLocal(next);
            }}
            className="h-9 text-sm glass-sidebar border border-zinc-300/15"
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Model</div>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={m === model ? 'default' : 'outline'}
                className={m === model ? 'bg-primary text-primary-foreground' : 'glass-siebar border border-zinc-300/15  hover:border-primary/60'}
                onClick={() => setModelLocal(m)}
              >
                {m}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex pb-2 items-center justify-between">
            <div className="text-xs font-medium text-muted-foreground">AI Instructions</div>
            <div className="flex items-center gap-2 text-xs">
              <Switch
                checked={useInstructions}
                className="text-white"
                id="airplane-mode"
                onCheckedChange={(v: boolean) => setUseInstructions(v)}
                aria-label="Toggle AI instructions use"
              />
            </div>
          </div>
          <Textarea 
            placeholder="Describe what you'd like the AI to do..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className={
              `min-h-[250px] resize-y glass-sidebar` +
              (useInstructions
                ? ' '
                : ' ')
            }
          />
        </div>
      </div>
    </div>
  );
};