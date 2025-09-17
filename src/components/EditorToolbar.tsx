import React from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { toggleMark, setBlockType } from 'prosemirror-commands';
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

interface EditorToolbarProps {
  editorView: EditorView;
  editorState: EditorState;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editorView,
  editorState,
}) => {
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

  const schema = editorState.schema;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-glass-border/30 bg-muted/20 flex-wrap">
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
          variant="ghost"
          size="sm"
          onClick={() => {
            const command = setBlockType(schema.nodes.blockquote);
            executeCommand(command);
          }}
          className="h-7 w-7 p-0"
        >
          <Quote className="h-3 w-3" />
        </Button>

        {schema.nodes.bullet_list && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand(wrapInList(schema.nodes.bullet_list))}
            className="h-7 w-7 p-0"
          >
            <List className="h-3 w-3" />
          </Button>
        )}

        {schema.nodes.ordered_list && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand(wrapInList(schema.nodes.ordered_list))}
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
  );
};