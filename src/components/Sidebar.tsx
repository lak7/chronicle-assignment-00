import React, { useEffect, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { setAiInstructionsEnabled, setAiInstructionsText, getAiConfig } from '@/lib/aiConfig';

export const Sidebar: React.FC = () => {
  const chapters = [
    { id: 1, title: 'Heading 1', active: true },
  ];

  const initial = getAiConfig();
  const [instructions, setInstructions] = useState<string>(initial.instructionsText);
  const [useInstructions, setUseInstructions] = useState<boolean>(initial.instructionsEnabled);

  useEffect(() => {
    setAiInstructionsText(instructions);
  }, [instructions]);

  useEffect(() => {
    setAiInstructionsEnabled(useInstructions);
  }, [useInstructions]);

  return (
    <div className="border border-zinc-300/25 rounded-lg h-full flex flex-col overflow-hidden">
      {/* Top Section: ~65% height */}
      <div className="h-[65%] min-h-0 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-zinc-300/25">
          <Button 
            className="w-full justify-center text-sm h-9 border-primary/30 hover:border-primary/60 hover:bg-primary/10"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create new chapter
          </Button>
        </div>

        {/* Published Section */}
        <div className="p-3 space-y-2 flex-1 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-3">
            <span>Published</span>
          </div>
          
          <div className="space-y-1">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`p-2 rounded cursor-pointer transition-all text-sm ${
                  chapter.active 
                    ? 'bg-primary/10 text-primary border border-primary/30' 
                    : 'hover:bg-muted/20 text-foreground hover-border-primary/20 border border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <FileText className="mr-2 h-3 w-3" />
                  <span>{chapter.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: ~35% height - AI Instructions */}
      <div className="h-[45%] min-h-0 border-t border-zinc-300/25 p-3 flex flex-col gap-2">
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
            `flex-1 resize-none ` +
            (useInstructions
              ? ' ring-emerald-500 focus-visible:ring-emerald-500 border-emerald-500'
              : ' ring-orange-500 focus-visible:ring-orange-500 border-orange-500')
          }
        />
      </div>
    </div>
  );
};