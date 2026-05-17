function normalizeNamePart(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\-'\s]/gu, '')
}

function splitName(fullName) {
  const clean = normalizeNamePart(fullName)
  const parts = clean.split(/\s+/).filter(Boolean)
  return {
    first: parts[0] ?? '',
    last: parts[1] ?? '',
    parts,
  }
}

// Heuristic for Russian names. We intentionally keep this conservative:
// if we can't decide confidently, return 'neutral'.
export function inferGender(fullName) {
  const { first, last } = splitName(fullName)
  if (!first && !last) return 'neutral'

  const maleExceptionsEndingA = new Set([
    'никита',
    'илья',
    'фома',
    'кузьма',
    'савва',
    'лава',
    'слуга', // rare, but keeps heuristic conservative
  ])

  const femaleFirstEndings = ['а', 'я']
  const maleFirstEndings = ['й', 'н', 'р', 'д', 'т', 'с', 'в', 'л', 'м', 'п', 'г', 'к', 'б', 'з', 'х', 'ж', 'ш', 'щ', 'ч', 'ц']

  const firstEnds = first.slice(-1)
  const lastEnds2 = last.slice(-2)
  const lastEnds1 = last.slice(-1)

  // Surname signals (very common in Russian):
  // - женские: Иванова, Петрова, Смирнова, Соколова; также "ая": Кузнецкая
  // - мужские: Иванов, Петров, Смирнов; "ий": Чёрный
  const surnameFemale =
    lastEnds1 === 'а' ||
    lastEnds2 === 'ая'

  const surnameMale =
    ['ов', 'ев', 'ин', 'ый', 'ий', 'ой', 'ов', 'ёв'].includes(lastEnds2) ||
    ['в', 'н', 'й'].includes(lastEnds1)

  // First-name signal
  const firstFemale =
    femaleFirstEndings.includes(firstEnds) && !maleExceptionsEndingA.has(first)

  const firstMale =
    maleFirstEndings.includes(firstEnds) || maleExceptionsEndingA.has(first)

  if (firstFemale && !surnameMale) return 'female'
  if (firstMale && !surnameFemale) return 'male'

  if (surnameFemale && !firstMale) return 'female'
  if (surnameMale && !firstFemale) return 'male'

  return 'neutral'
}

export function getAgentAvatarPath(fullName) {
  const g = inferGender(fullName)
  if (g === 'female') return '/assets/agent-avatars/female_agent.png'
  if (g === 'male') return '/assets/agent-avatars/male_agent.png'
  return '/assets/agent-avatars/neutral_agent.png'
}

// Public API requested by the game scripts.
// Returns: 'male' | 'female' | 'unknown'
export function detectGender(fullName) {
  const g = inferGender(fullName)
  if (g === 'male') return 'male'
  if (g === 'female') return 'female'
  return 'unknown'
}
