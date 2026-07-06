import { createEditor, Transforms, Editor } from 'slate'
import { isBlockActive, toggleBlock } from './toggleQuote'

function setupEditor(initialValue: any[]) {
  const editor = createEditor()
  editor.children = initialValue
  return editor
}

function makeParagraph(text = 'hello') {
  return { type: 'paragraph', children: [{ text }] }
}

function makeQuote(text = 'hello') {
  return { type: 'blockquote', children: [{ text }] }
}

function selectNode(editor: Editor, path: number[], offset = 0) {
  Transforms.select(editor, { path, offset: offset as any })
}

describe('isBlockActive', () => {
  test('无 selection 时返回 false', () => {
    const editor = setupEditor([makeParagraph()])
    editor.selection = null
    expect(isBlockActive(editor, 'paragraph')).toBe(false)
  })

  test('光标在 paragraph 中，查询 paragraph 返回 true', () => {
    const editor = setupEditor([makeParagraph()])
    selectNode(editor, [0, 0])
    expect(isBlockActive(editor, 'paragraph')).toBe(true)
  })

  test('光标在 paragraph 中，查询 blockquote 返回 false', () => {
    const editor = setupEditor([makeParagraph()])
    selectNode(editor, [0, 0])
    expect(isBlockActive(editor, 'blockquote')).toBe(false)
  })

  test('光标在 blockquote 中，查询 blockquote 返回 true', () => {
    const editor = setupEditor([makeQuote()])
    selectNode(editor, [0, 0])
    expect(isBlockActive(editor, 'blockquote')).toBe(true)
  })

  test('光标在 blockquote 中，查询 paragraph 返回 false', () => {
    const editor = setupEditor([makeQuote()])
    selectNode(editor, [0, 0])
    expect(isBlockActive(editor, 'paragraph')).toBe(false)
  })

  test('多个段落，光标在第一个，只匹配第一个的 type', () => {
    const editor = setupEditor([makeQuote(), makeParagraph()])
    selectNode(editor, [0, 0])
    expect(isBlockActive(editor, 'blockquote')).toBe(true)
  })
})

describe('toggleBlock', () => {
  test('无 selection 时不修改任何节点', () => {
    const editor = setupEditor([makeParagraph('keep')])
    editor.selection = null
    toggleBlock(editor, 'blockquote')
    expect((editor.children[0] as any).type).toBe('paragraph')
  })

  test('paragraph 切换为 blockquote', () => {
    const editor = setupEditor([makeParagraph()])
    selectNode(editor, [0, 0])
    toggleBlock(editor, 'blockquote')
    expect((editor.children[0] as any).type).toBe('blockquote')
  })

  test('blockquote 切换回 paragraph', () => {
    const editor = setupEditor([makeQuote()])
    selectNode(editor, [0, 0])
    toggleBlock(editor, 'blockquote')
    expect((editor.children[0] as any).type).toBe('paragraph')
  })

  test('同类型 toggle 不产生变化（paragraph → paragraph）', () => {
    const editor = setupEditor([makeParagraph()])
    selectNode(editor, [0, 0])
    toggleBlock(editor, 'paragraph')
    expect((editor.children[0] as any).type).toBe('paragraph')
  })

  test('反复 toggle 可正常来回切换', () => {
    const editor = setupEditor([makeParagraph()])
    selectNode(editor, [0, 0])

    toggleBlock(editor, 'blockquote')
    expect((editor.children[0] as any).type).toBe('blockquote')

    toggleBlock(editor, 'blockquote')
    expect((editor.children[0] as any).type).toBe('paragraph')

    toggleBlock(editor, 'blockquote')
    expect((editor.children[0] as any).type).toBe('blockquote')
  })

  test('跨多个块选中时全部切换', () => {
    const editor = setupEditor([
      makeParagraph('a'),
      makeParagraph('b'),
      makeQuote('c'),
    ])

    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [2, 0], offset: 0 },
    })

    toggleBlock(editor, 'blockquote')

    expect((editor.children[0] as any).type).toBe('blockquote')
    expect((editor.children[1] as any).type).toBe('blockquote')
    expect((editor.children[2] as any).type).toBe('blockquote')
  })

  test('跨多个块选中，首块是 blockquote 则全部切为 paragraph', () => {
    const editor = setupEditor([
      makeQuote('a'),
      makeParagraph('b'),
      makeParagraph('c'),
    ])

    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [2, 0], offset: 0 },
    })

    toggleBlock(editor, 'blockquote')

    expect((editor.children[0] as any).type).toBe('paragraph')
    expect((editor.children[1] as any).type).toBe('paragraph')
    expect((editor.children[2] as any).type).toBe('paragraph')
  })
})
