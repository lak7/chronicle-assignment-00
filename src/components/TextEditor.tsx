import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { EditorToolbar } from './EditorToolbar';
import './EditorStyles.css';

// Create a custom schema with list support
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

interface TextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = '',
  onContentChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create initial document
    const doc = initialContent
      ? DOMParser.fromSchema(mySchema).parse(
          new window.DOMParser().parseFromString(initialContent, 'text/html').body
        )
      : mySchema.nodes.doc.create(
          null,
          mySchema.nodes.paragraph.create()
        );

    // Create editor state
    const state = EditorState.create({
      doc,
      plugins: [
        history(),
        keymap(baseKeymap),
        keymap({
          'Mod-b': (state, dispatch) => {
            const { $from, $to } = state.selection;
            const markType = mySchema.marks.strong;
            if (dispatch) {
              const hasMark = state.doc.rangeHasMark($from.pos, $to.pos, markType);
              if (hasMark) {
                dispatch(state.tr.removeMark($from.pos, $to.pos, markType));
              } else {
                dispatch(state.tr.addMark($from.pos, $to.pos, markType.create()));
              }
            }
            return true;
          },
          'Mod-i': (state, dispatch) => {
            const { $from, $to } = state.selection;
            const markType = mySchema.marks.em;
            if (dispatch) {
              const hasMark = state.doc.rangeHasMark($from.pos, $to.pos, markType);
              if (hasMark) {
                dispatch(state.tr.removeMark($from.pos, $to.pos, markType));
              } else {
                dispatch(state.tr.addMark($from.pos, $to.pos, markType.create()));
              }
            }
            return true;
          },
        }),
      ],
    });

    // Create editor view
    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        setEditorState(newState);
        
        if (onContentChange && transaction.docChanged) {
          const content = newState.doc.textContent;
          onContentChange(content);
        }
      },
    });

    setEditorView(view);
    setEditorState(state);

    return () => {
      view.destroy();
    };
  }, [initialContent, onContentChange]);

  return (
    <div className="cyberpunk-editor w-full h-full flex flex-col overflow-hidden">
      {editorView && editorState && (
        <EditorToolbar editorView={editorView} editorState={editorState} />
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        <div
          ref={editorRef}
          className="prose prose-invert max-w-none focus:outline-none"
          style={{
            fontSize: '15px',
            lineHeight: '1.7',
            color: 'hsl(var(--foreground))',
          }}
        />
      </div>
    </div>
  );
};