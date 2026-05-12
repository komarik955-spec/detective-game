/* ═══════════════════════════════════════
   UNIVERSAL FILE ACTIONS UTILITY
   Generic file save/download system
═══════════════════════════════════════ */

export function saveFileToDesktop(file, onSave) {
  if (!file || typeof file !== 'object') {
    console.error('Invalid file object:', file)
    return null
  }

  if (!file.downloadable) {
    console.log('File is not downloadable:', file.name)
    return null
  }

  if (!file.saveToDesktop) {
    console.log('File cannot be saved to desktop:', file.name)
    return null
  }

  const savedFiles = getSavedFiles()

  if (savedFiles.some(f => f.id === file.id)) {
    console.log('File already saved:', file.name)
    return null
  }

  const savedFile = {
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    url: file.url,
    savedAt: new Date().toISOString()
  }

  savedFiles.push(savedFile)
  sessionStorage.setItem('desktop_saved_files', JSON.stringify(savedFiles))
  console.log('File saved to desktop:', file.name)

  if (onSave) {
    onSave(savedFile)
  }

  return savedFile
}

export function getSavedFiles() {
  try {
    const saved = sessionStorage.getItem('desktop_saved_files')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error reading saved files:', error)
    return []
  }
}

export function removeSavedFile(fileId) {
  const savedFiles = getSavedFiles()
  const filtered = savedFiles.filter(f => f.id !== fileId)
  
  if (filtered.length === savedFiles.length) {
    return false
  }

  sessionStorage.setItem('desktop_saved_files', JSON.stringify(filtered))
  console.log('File removed from desktop:', fileId)
  return true
}

export function isFileSaved(fileId) {
  const savedFiles = getSavedFiles()
  return savedFiles.some(f => f.id === fileId)
}

export function clearSavedFiles() {
  sessionStorage.removeItem('desktop_saved_files')
  console.log('All saved files cleared')
}
