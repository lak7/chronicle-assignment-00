import { TextEditor } from '../components/TextEditor';
import { Sidebar } from '../components/Sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Home = () => {
  return (
    <div className="h-screen bg-background subtle-grid liquid-glass-bg overflow-hidden">
      <div className="flex h-full gap-3 p-3">
        {/* Sidebar - 25% width */}
        <div className="hidden sm:block w-1/4 min-w-[280px] max-w-[320px]">
          <Sidebar />
        </div> 

        {/* Editor - 75% width */}
        <div className="flex-1 min-w-0 glass-sidebar">
          <div className="border border-zinc-300/25 rounded-lg h-full overflow-hidden">
            <div className="hidden sm:block p-4 border-b border-zinc-300/25">
              <h1 className="text-xl font-bold glow-text">
                AI Text Editor
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Start writing your masterpiece now...
              </p>
            </div>

            <div className="h-full sm:h-[calc(100%-5rem)] overflow-hidden">
              <TextEditor 
                initialContent="<h1>Welcome to the Future</h1><p>Start writing here. This AI enabled editor supports rich text formatting, headings, lists, and more.</p>"
                onContentChange={(content) => {
                  console.log('Content changed:', content);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only Settings button that opens full-screen sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="sm:hidden fixed bottom-4 right-4 z-50 shadow-lg" variant="secondary" size="icon">
            ⚙️
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full p-0">
          <div className="h-full w-full p-4 sm:p-0">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Home;
