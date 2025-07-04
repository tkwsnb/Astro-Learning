import fs from 'fs/promises'
import path from 'path'

const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || ''

export const createObsidianNote = async (
  todoId: string,
  title: string,
  description?: string,
  dueDate?: Date,
  priority?: string
) => {
  if (!VAULT_PATH) {
    console.warn('Obsidian vault path not configured')
    return null
  }

  const noteName = `todo-${todoId}.md`
  const notePath = path.join(VAULT_PATH, 'todos', noteName)
  
  // Create todos directory if it doesn't exist
  const todosDir = path.dirname(notePath)
  try {
    await fs.mkdir(todosDir, { recursive: true })
  } catch (error) {
    console.error('Failed to create todos directory:', error)
  }

  const noteContent = `# ${title}

## 詳細
${description || '詳細なし'}

## 期日
${dueDate ? dueDate.toLocaleDateString('ja-JP') : '未設定'}

## 優先度
${priority || 'MEDIUM'}

## ステータス
- [ ] 未完了

## 作成日
${new Date().toLocaleDateString('ja-JP')}

---

*このノートはSlack-Obsidian Todo アプリによって自動生成されました。*
`

  try {
    await fs.writeFile(notePath, noteContent, 'utf8')
    return notePath
  } catch (error) {
    console.error('Failed to create Obsidian note:', error)
    return null
  }
}

export const updateObsidianNote = async (
  notePath: string,
  completed: boolean
) => {
  if (!notePath || !VAULT_PATH) return

  try {
    const content = await fs.readFile(notePath, 'utf8')
    const updatedContent = completed
      ? content.replace('- [ ] 未完了', '- [x] 完了')
      : content.replace('- [x] 完了', '- [ ] 未完了')
    
    await fs.writeFile(notePath, updatedContent, 'utf8')
  } catch (error) {
    console.error('Failed to update Obsidian note:', error)
  }
}

export const deleteObsidianNote = async (notePath: string) => {
  if (!notePath || !VAULT_PATH) return

  try {
    await fs.unlink(notePath)
  } catch (error) {
    console.error('Failed to delete Obsidian note:', error)
  }
}