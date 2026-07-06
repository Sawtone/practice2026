import { Editor, Element as SlateElement, Transforms } from 'slate'

export function isBlockActive(editor: Editor, format: string) {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any).type === format,
    })
  )

  return !!match
}

export function toggleBlock(editor: Editor, format: string) {
  if (!editor.selection) return

  const isActive = isBlockActive(editor, format)

  Transforms.setNodes(editor as any, {
    type: isActive ? 'paragraph' : format,
  } as any)
}
