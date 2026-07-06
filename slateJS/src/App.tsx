import { useMemo, useCallback } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react'
import type { RenderElementProps } from 'slate-react'
import { isHotkey } from 'is-hotkey'
import { isBlockActive, toggleBlock } from './toggleQuote'

const initialValue = [
  { type: 'paragraph' as const, children: [{ text: '这是一段普通的段落文字。' }] },
  { type: 'paragraph' as const, children: [{ text: '选中段落，点击工具栏的 Quote 按钮试试。快捷键 Cmd+Option+Q。' }] },
]

function Toolbar() {
  const editor = useSlate()

  return (
    <div className="toolbar">
      <button
        className={isBlockActive(editor, 'blockquote') ? 'active' : ''}
        onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => e.preventDefault()}
        onClick={() => {
          if (!ReactEditor.isFocused(editor as ReactEditor)) return
          toggleBlock(editor, 'blockquote')
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>❝</span>
        Quote
      </button>
    </div>
  )
}

function App() {
  const editor = useMemo(() => withReact(createEditor()), [])

  const renderElement = useCallback(({ attributes, children, element }: RenderElementProps) => {
    switch ((element as any).type) {
      case 'blockquote':
        return <blockquote {...attributes}>{children}</blockquote>
      default:
        return <p {...attributes}>{children}</p>
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isHotkey('mod+alt+q', event)) {
        event.preventDefault()
        event.stopPropagation()
        toggleBlock(editor, 'blockquote')
      }
    },
    [editor]
  )

  return (
    <div className="editor-wrapper">
      <Slate editor={editor} initialValue={initialValue}>
        <Toolbar />
        <Editable
          className="editor-body"
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          placeholder="开始写作..."
          autoFocus
        />
      </Slate>
    </div>
  )
}

export default App
