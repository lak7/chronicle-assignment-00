import React, { useEffect } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { toggleMark, setBlockType, wrapIn, lift } from 'prosemirror-commands';
import { wrapInList, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { undo, redo } from 'prosemirror-history';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Bold,
  Italic,
  Code,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Type,
} from 'lucide-react';
import { useMachine } from '@xstate/react';
import { continueWritingMachine } from '../lib/continueWritingMachine';

interface EditorToolbarProps {
  editorView: EditorView;
  editorState: EditorState;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editorView,
  editorState,
}) => {
  const [state, send] = useMachine(continueWritingMachine);

  const executeCommand = (command: any) => {
    if (command(editorState, editorView.dispatch, editorView)) {
      editorView.focus();
    }
  };

  const isMarkActive = (markType: any) => {
    const { from, $from, to, empty } = editorState.selection;
    if (empty) {
      return markType.isInSet(editorState.storedMarks || $from.marks());
    }
    return editorState.doc.rangeHasMark(from, to, markType);
  };

  const isBlockActive = (nodeType: any, attrs = {}) => {
    const { $from, to } = editorState.selection;
    return to <= $from.end() && $from.parent.hasMarkup(nodeType, attrs);
  };

  const isNodeActive = (nodeType: any) => {
    const { $from } = editorState.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
      if ($from.node(depth).type === nodeType) return true;
    }
    return false;
  };

  const toggleBlockquote = () => {
    const active = isNodeActive(schema.nodes.blockquote);
    const command = active ? lift : wrapIn(schema.nodes.blockquote);
    executeCommand(command);
  };

  const isInList = (listType: any) => isNodeActive(listType);

  const toggleList = (listType: any) => {
    const inThisList = isInList(listType);
    if (inThisList) {
      executeCommand(liftListItem(schema.nodes.list_item));
    } else {
      executeCommand(wrapInList(listType));
    }
  };

  const schema = editorState.schema;

  const isGenerating = state.matches('generating');

  // When generation succeeds, insert the generated text at the current selection
  useEffect(() => {
    if (state.matches('success') && state.context.generatedText) {
      const textToInsert = `${editorView.state.selection.empty ? ' ' : ''}${state.context.generatedText}`;
      const { from, to } = editorView.state.selection;
      const tr = editorView.state.tr.insertText(textToInsert, Math.max(from, to));
      editorView.dispatch(tr);
      editorView.focus();
      send({ type: 'RESET' });
    }
  }, [state, editorView, send]);

  // Trigger Continue Writing on Shift+Enter within the editor
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        if (!isGenerating) {
          const content = editorView.state.doc.textContent;
          send({ type: 'GENERATE', input: { existingText: content } });
        }
      }
    };

    const editorDom = editorView.dom as HTMLElement | undefined;
    if (editorDom) {
      editorDom.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (editorDom) {
        editorDom.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [editorView, send, isGenerating]);

  return (
    <div className="flex items-center gap-1 p-2 border-b border-glass-border/30 bg-muted/20 flex-wrap">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1 p-2">
          {/* Text formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={isMarkActive(schema.marks.strong) ? "default" : "ghost"}
          size="sm"
          onClick={() => executeCommand(toggleMark(schema.marks.strong))}
          className="h-7 w-7 p-0"
        >
          <Bold className="h-3 w-3" />
        </Button>
        
        <Button
          variant={isMarkActive(schema.marks.em) ? "default" : "ghost"}
          size="sm"
          onClick={() => executeCommand(toggleMark(schema.marks.em))}
          className="h-7 w-7 p-0"
        >
          <Italic className="h-3 w-3" />
        </Button>

        <Button
          variant={isMarkActive(schema.marks.code) ? "default" : "ghost"}
          size="sm"
          onClick={() => executeCommand(toggleMark(schema.marks.code))}
          className="h-7 w-7 p-0"
        >
          <Code className="h-3 w-3" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Button
          variant={isBlockActive(schema.nodes.paragraph) ? "default" : "ghost"}
          size="sm"
          onClick={() => executeCommand(setBlockType(schema.nodes.paragraph))}
          className="h-7 w-7 p-0"
        >
          <Type className="h-3 w-3" />
        </Button>

        <Button
          variant={isBlockActive(schema.nodes.heading, { level: 1 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => executeCommand(setBlockType(schema.nodes.heading, { level: 1 }))}
          className="h-7 w-7 p-0"
        >
          <Heading1 className="h-3 w-3" />
        </Button>

        <Button
          variant={isBlockActive(schema.nodes.heading, { level: 2 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => executeCommand(setBlockType(schema.nodes.heading, { level: 2 }))}
          className="h-7 w-7 p-0"
        >
          <Heading2 className="h-3 w-3" />
        </Button>

        <Button
          variant={isBlockActive(schema.nodes.heading, { level: 3 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => executeCommand(setBlockType(schema.nodes.heading, { level: 3 }))}
          className="h-7 w-7 p-0"
        >
          <Heading3 className="h-3 w-3" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* Block elements */}
      <div className="flex items-center gap-1">
        <Button
          variant={isNodeActive(schema.nodes.blockquote) ? "default" : "ghost"}
          size="sm"
          onClick={toggleBlockquote}
          className="h-7 w-7 p-0"
        >
          <Quote className="h-3 w-3" />
        </Button>

        {schema.nodes.bullet_list && (
          <Button
            variant={isNodeActive(schema.nodes.bullet_list) ? "default" : "ghost"}
            size="sm"
            onClick={() => toggleList(schema.nodes.bullet_list)}
            className="h-7 w-7 p-0"
          >
            <List className="h-3 w-3" />
          </Button>
        )}

        {schema.nodes.ordered_list && (
          <Button
            variant={isNodeActive(schema.nodes.ordered_list) ? "default" : "ghost"}
            size="sm"
            onClick={() => toggleList(schema.nodes.ordered_list)}
            className="h-7 w-7 p-0"
          >
            <ListOrdered className="h-3 w-3" />
          </Button>
        )}
      </div>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* History */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand(undo)}
          className="h-7 w-7 p-0"
        >
          <Undo className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand(redo)}
          className="h-7 w-7 p-0"
        >
          <Redo className="h-3 w-3" />
        </Button>
      </div>
        </div>
        <div className="">
          <Button
            onClick={() => {
              const content = editorView.state.doc.textContent;
              send({ type: 'GENERATE', input: { existingText: content } });
            }}
            disabled={isGenerating}
          >
            {isGenerating ? (
              'Generating…'
            ) : (
              <span className="flex items-center gap-2">
                <span>Continue Writing</span>
                <span className="ml-2 text-[15px] leading-none ">⇧ + ↵</span>
              </span>
            )}
          </Button>
        </div>
      </div>
      
    </div>
  );
};