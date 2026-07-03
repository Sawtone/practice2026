import { useMemo, useCallback } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react'
import { isBlockActive, toggleBlock } from './toggleQuote'

const initialValue: any[] = [
  { type: 'paragraph', children: [{ text: '这是一段普通的段落文字。' }] },
  { type: 'paragraph', children: [{ text: '选中段落，点击工具栏的 Quote 按钮试试。' }] },
]

function QuoteButton() {
  const editor = useSlate()
  return (
    /*
      e.preventDefault() 和 toggleBlock(editor, 'blockquote') 不可以同时在 mousedown 里触发
      mousedown 触发时浏览器焦点转移已开始，会导致 toggleBlock 执行时 editor.selection 已变成 null
      即按钮点击时编辑器失焦，selection 变为 null
    */
    <button
      onPointerDown={(e: any) => e.preventDefault()}
      onClick={() => {
          if (!ReactEditor.isFocused(editor as ReactEditor)) return
          toggleBlock(editor, 'blockquote')
        }}
      style={{
        fontWeight: isBlockActive(editor, 'blockquote') ? 'bold' : 'normal',
      }}
    >
      Quote
    </button>
  )
}

function App() {
  const editor = useMemo(() => withReact(createEditor()), [])

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'blockquote':
        return <blockquote {...props.attributes}>{props.children}</blockquote>
      default:
        return <p {...props.attributes}>{props.children}</p>
    }
  }, [])

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px' }}>
      <Slate editor={editor} initialValue={initialValue}>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <QuoteButton />
        </div>
        <Editable
          renderElement={renderElement}
          placeholder="开始写作..."
          style={{
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            minHeight: 300,
          }}
        />
      </Slate>
    </div>
  )
}

export default App
