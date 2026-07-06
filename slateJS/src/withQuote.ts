import { Editor, Element as SlateElement, Transforms } from 'slate'

export interface QuoteEditor {
  toggleQuote: (format: string) => void
  isBlockActive: (format: string) => boolean
}

export function withQuote<T extends Editor>(editor: T): T & QuoteEditor {
  const e = editor as T & QuoteEditor

  e.isBlockActive = (format: string) => {
    const { selection } = e
    if (!selection) return false

    const [match] = Array.from(
      Editor.nodes(e, {
        at: Editor.unhangRange(e, selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n as any).type === format,
      })
    )

    return !!match
  }

  e.toggleQuote = (format: string) => {
    if (!e.selection) return

    Transforms.setNodes(e as any, {
      type: e.isBlockActive(format) ? 'paragraph' : format,
    } as any)
  }

  return e
}
