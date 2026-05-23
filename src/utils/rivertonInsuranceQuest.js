const STORAGE_KEY = 'dt_riverton_insurance_complete'

export function isRivertonInsuranceComplete() {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function validateInsuranceForm({ organization, insuredName, authCode }) {
  const orgOk = organization === 'dark_trace'
  
  const nameNormalized = String(insuredName ?? '')
    .toLowerCase()
    .trim()
    .replace(/ё/g, 'е')
    
  /* ИЗМЕНЕНИЕ ЗДЕСЬ: Теперь проверяем совпадение либо с Селеной Блэк, либо с Эваном Андервудом */
  const nameOk = nameNormalized === 'селена блэк'.replace(/ё/g, 'е') || 
                 nameNormalized === 'эван андервуд'.replace(/ё/g, 'е')
                 
  const codeOk = String(authCode ?? '').trim().toUpperCase() === 'DT-78823'
  
  return orgOk && nameOk && codeOk
}
export function completeRivertonInsuranceRequest() {
  if (isRivertonInsuranceComplete()) return false
  localStorage.setItem(STORAGE_KEY, 'true')
  window.dispatchEvent(new CustomEvent('dt_riverton_insurance_complete'))
  return true
}
