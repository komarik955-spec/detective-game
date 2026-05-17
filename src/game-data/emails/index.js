import { deepTemplate, indexById, loadJsonCollectionEager } from '../_utils'

const emailModules = import.meta.glob('./*.json', { eager: true })
const emails = loadJsonCollectionEager(emailModules)
const emailsById = indexById(emails)

function buildPlayerCtx(playerData) {
  const firstName = playerData?.firstName || 'Детектив'
  const fullName = playerData?.fullName || ''
  return {
    player: {
      firstName,
      fullName,
      firstNameLower: String(firstName).toLowerCase()
    }
  }
}

export function getAllEmails(playerData) {
  const ctx = buildPlayerCtx(playerData)
  return emails.map(m => deepTemplate(m, ctx))
}

export function getEmailById(id, playerData) {
  const mail = emailsById.get(id)
  if (!mail) return null
  return deepTemplate(mail, buildPlayerCtx(playerData))
}

