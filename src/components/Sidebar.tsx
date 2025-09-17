import React from 'react';
import { FileText, Plus, Folder, Search, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export const Sidebar: React.FC = () => {
  const chapters = [
    { id: 1, title: 'Chapter 1', active: true },
    { id: 2, title: 'Chapter 2', active: false },
    { id: 3, title: 'Chapter 3', active: false },
    { id: 4, title: 'Chapter 4', active: false },
    { id: 5, title: 'Chapter 5', active: false },
    { id: 6, title: 'Chapter 6', active: false },
  ];

  return (
    <div className="border border-zinc-300/50 rounded-lg h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-glass-border/30">
        <Button 
          className="w-full justify-start text-sm h-9 border-primary/30 hover:border-primary/60 hover:bg-primary/10"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create new chapter
        </Button>
      </div>

      {/* Published Section */}
      <div className="p-3 space-y-2 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-3">
          <span>Published</span>
          <span className="bg-muted/50 px-2 py-0.5 rounded text-xs">6</span>
        </div>
        
        <div className="space-y-1">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`p-2 rounded cursor-pointer transition-all text-sm ${
                chapter.active 
                  ? 'bg-primary/10 text-primary border border-primary/30' 
                  : 'hover:bg-muted/20 text-foreground hover:border-primary/20 border border-transparent'
              }`}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-3 w-3" />
                <span>{chapter.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="my-4">
          <Separator className="opacity-20" />
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-3">
          <span>Drafts</span>
          <span className="bg-muted/50 px-2 py-0.5 rounded text-xs">1</span>
        </div>
        
        <div className="glass-panel p-3 border-primary/20">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center mx-auto">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-medium text-sm">How to write bestsellers</h3>
            <p className="text-xs text-muted-foreground">6 simple tips</p>
            <Button size="sm" variant="outline" className="w-full h-7 text-xs border-primary/30 hover:bg-primary/10">
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-glass-border/30 space-y-1">
        <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs hover:bg-primary/10">
          <Search className="mr-2 h-3 w-3" />
          Search
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs hover:bg-primary/10">
          <Folder className="mr-2 h-3 w-3" />
          Browse
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs hover:bg-primary/10">
          <Settings className="mr-2 h-3 w-3" />
          Settings
        </Button>
      </div>
    </div>
  );
};