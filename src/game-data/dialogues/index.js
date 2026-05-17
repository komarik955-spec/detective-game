import { indexById, loadJsonCollectionEager } from '../_utils'

const dialogueModules = import.meta.glob('./*.json', { eager: true })
const dialogues = loadJsonCollectionEager(dialogueModules)
const dialoguesById = indexById(dialogues)

export function getDialogueIds() {
  return dialogues.map(d => d.id)
}

export function getDialogueLines(id) {
  const item = dialoguesById.get(id)
  if (!item) return null
  if (Array.isArray(item)) return item
  if (Array.isArray(item.lines)) return item.lines
  return null
}

