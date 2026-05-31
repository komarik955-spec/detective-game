import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isRivertonInsuranceComplete } from './rivertonInsuranceQuest'
import {
  isVesperInsuranceHintMailUnlocked,
  unlockVesperInsuranceHintMail,
} from './vesperInsuranceHintMail'

const STORAGE_KEY = 'dt_investigation_progress'
const SUSPECT_KEY = 'chosen_suspect'

/** Только материалы портала Dark Trace: досье, улики, видеопротоколы */
export const DOSSIER_FILE_IDS = [
  'selena_black_dossier',
  'evan_underwood_dossier',
  'vesper_wainwright_dossier',
  'marcus_flynn_dossier',
  'alaric_ravenwood_dossier',
  'rosalia_underwood_dossier',
  'michael_elliot_dossier',
  'arthur_payne_dossier',
]

export const EVIDENCE_FILE_IDS = [
  'crime_scene_photo',
  'gallery_archive_page',
  'diary_page_07',
  'diary_page_08',
]

export const STATEMENT_FILE_IDS = ['INT-001', 'INT-002', 'INT-003', 'INT-004', 'INT-005']

export const STARTER_FILE_IDS = [
  ...DOSSIER_FILE_IDS,
  ...EVIDENCE_FILE_IDS,
  ...STATEMENT_FILE_IDS,
]
export const STARTER_REQUIRED_FILE_IDS = [...DOSSIER_FILE_IDS]
export const VIDEO_PROTOCOL_FILE_IDS = [...STATEMENT_FILE_IDS]

export const ENVELOPE_FILE_IDS = ['insurance_policies', 'bank', 'chat']
export const ENVELOPE_1_REQUIRED_FILE_IDS = [
  'insurance_policies',
  'bank_statement',
  'luxe_restaurant_chat',
  'shadows_of_riverton_chat',
  'selena_diary',
  'newspaper_obituary',
  'pharmacy_receipt',
  'curator_card',
  'miller_alibi_memo',
]
export const INSURANCE_POLICIES_FILE_ID = 'insurance_policies'

const STAGES = {
  starter_folder: {
    id: 'starter_folder',
    title: 'Стартовая папка',
    objective: 'Изучите все материалы в разделах «Досье».',
    requiredFiles: [...STARTER_REQUIRED_FILE_IDS, ...VIDEO_PROTOCOL_FILE_IDS, 'crime_scene_photo', 'gallery_archive_page', 'diary_page_07', 'diary_page_08'],
    nextStageId: 'envelope_1',
  },
  envelope_1: {
    id: 'envelope_1',
    title: 'Конверт №1',
    objective: 'Изучите копии страховых полисов, полученные по почте.',
    requiredFiles: ENVELOPE_1_REQUIRED_FILE_IDS,
    nextStageId: 'envelope_2',
  },
   envelope_2: {
     id: 'envelope_2',
     title: 'Конверт №2',
     objective: 'Соберите доказательства причастности Аларика Равенсвуда и изучите долги Эвана.',
     requiredFiles: ['it_report', 'creditor_note', 'raven_chat_1', 'raven_chat_2', 'alaric_selena_chat', 'diary_page_envelope2', 'alaric_interrogation_transcript', 'phone_call_transcript_2'],
     nextStageId: null,
   },
}

const DEFAULT_PROGRESS = {
  currentStageId: 'starter_folder',
  reviewedFiles: [],
  completedStages: [],
  interimReportSent: false,
  slateCallCompleted: false,
  envelope1Unlocked: false,
  rivertonInsuranceCompleted: false,
  newMaterialIds: [],
}

function normalizeProgress(raw) {
  const p = { ...DEFAULT_PROGRESS, ...raw }
  if (p.currentStageId === 'initial_analysis') p.currentStageId = 'starter_folder'
  if (p.currentStageId === 'evidence_collection') p.currentStageId = 'envelope_1'
  if (!Array.isArray(p.reviewedFiles)) p.reviewedFiles = []
  if (!Array.isArray(p.completedStages)) p.completedStages = []
  if (!Array.isArray(p.newMaterialIds)) p.newMaterialIds = []
  if (p.envelope1Unlocked && !p.completedStages.includes('starter_folder')) {
    p.completedStages = [...p.completedStages, 'starter_folder']
  }
  if (p.envelope1Unlocked && p.currentStageId === 'starter_folder') {
    p.currentStageId = 'envelope_1'
  }
  if (isRivertonInsuranceComplete()) {
    p.rivertonInsuranceCompleted = true
  }
  if (p.envelope1Unlocked && !isVesperInsuranceHintMailUnlocked()) {
    unlockVesperInsuranceHintMail()
  }
  return p
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...DEFAULT_PROGRESS }
    return normalizeProgress(JSON.parse(saved))
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

const InvestigationContext = createContext(null)

export function InvestigationProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setProgress(normalizeProgress(JSON.parse(e.newValue)))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const currentStage = STAGES[progress.currentStageId] || STAGES.starter_folder

  const markFileAsReviewed = useCallback((fileId) => {
    if (!fileId) return
    setProgress(prev => {
      if (prev.reviewedFiles.includes(fileId)) return prev
      const reviewedFiles = [...prev.reviewedFiles, fileId]
      const stage = STAGES[prev.currentStageId] || STAGES.starter_folder
      const allRequiredReviewed = stage.requiredFiles.every(id => reviewedFiles.includes(id))
      const completedStages =
        allRequiredReviewed && !prev.completedStages.includes(stage.id)
          ? [...prev.completedStages, stage.id]
          : prev.completedStages

      if (allRequiredReviewed && stage.id === 'starter_folder') {
        window.dispatchEvent(
          new CustomEvent('dt_stage_completed', { detail: { stageId: stage.id } })
        )
      }

      const newMaterialIds = prev.newMaterialIds.filter(id => id !== fileId)
      return { ...prev, reviewedFiles, completedStages, newMaterialIds }
    })
  }, [])

  const completeRivertonInsurance = useCallback(() => {
    setProgress(prev => {
      if (prev.rivertonInsuranceCompleted) return prev
      return {
        ...prev,
        rivertonInsuranceCompleted: true,
        newMaterialIds: [...new Set([...prev.newMaterialIds, INSURANCE_POLICIES_FILE_ID])],
      }
    })
  }, [])

  useEffect(() => {
    const onInsuranceComplete = () => completeRivertonInsurance()
    window.addEventListener('dt_riverton_insurance_complete', onInsuranceComplete)
    if (isRivertonInsuranceComplete()) completeRivertonInsurance()
    return () => window.removeEventListener('dt_riverton_insurance_complete', onInsuranceComplete)
  }, [completeRivertonInsurance])

  const unlockEnvelope1 = useCallback((chosenSuspect) => {
    if (chosenSuspect) {
      localStorage.setItem(SUSPECT_KEY, chosenSuspect)
    }
    const newMaterialIds = ['envelope1', ...ENVELOPE_FILE_IDS]
    setProgress(prev => ({
      ...prev,
      interimReportSent: true,
      slateCallCompleted: true,
      envelope1Unlocked: true,
      currentStageId: 'envelope_1',
      completedStages: prev.completedStages.includes('starter_folder')
        ? prev.completedStages
        : [...prev.completedStages, 'starter_folder'],
      newMaterialIds: [...new Set([...prev.newMaterialIds, ...newMaterialIds])],
    }))
    unlockVesperInsuranceHintMail()
    window.dispatchEvent(new CustomEvent('dt_envelope1_unlocked'))
  }, [])

   const unlockEnvelope2 = useCallback(() => {
     const envelope2FileIds = ['it_report', 'creditor_note', 'raven_chat_1', 'raven_chat_2', 'alaric_selena_chat', 'diary_page_envelope2', 'alaric_interrogation_transcript', 'phone_call_transcript_2'];
     setProgress(prev => ({
       ...prev,
       currentStageId: 'envelope_2',
       completedStages: prev.completedStages.includes('envelope_1')
         ? prev.completedStages
         : [...prev.completedStages, 'envelope_1'],
       newMaterialIds: [...new Set([...prev.newMaterialIds, ...envelope2FileIds])],
     }))
     localStorage.setItem('dt_current_envelope', '2')
     window.dispatchEvent(new CustomEvent('dt_envelope2_unlocked'))
   }, [])

  const beginInterimReport = useCallback(() => {
    setProgress(prev => ({ ...prev, interimReportSent: true }))
  }, [])

  const stageStats = useMemo(() => {
    const required = currentStage.requiredFiles || []
    const reviewedInStage = required.filter(id => progress.reviewedFiles.includes(id)).length
    const total = required.length || 1
    return {
      reviewedCount: reviewedInStage,
      totalRequired: total,
      stagePercentage: Math.round((reviewedInStage / total) * 100),
    }
  }, [currentStage, progress.reviewedFiles])

  const canSendInterimReport =
    (progress.currentStageId === 'starter_folder' || progress.currentStageId === 'envelope_1') &&
    stageStats.stagePercentage >= 100 &&
    (progress.currentStageId === 'envelope_1' || !progress.slateCallCompleted)

  const value = {
    progress,
    currentStage,
    markFileAsReviewed,
    unlockEnvelope1,
    unlockEnvelope2,
    beginInterimReport,
    canSendInterimReport,
    isFileNew: (fileId) => progress.newMaterialIds.includes(fileId),
    isEnvelopeUnlocked: progress.envelope1Unlocked,
    isRivertonInsuranceCompleted: progress.rivertonInsuranceCompleted,
    chosenSuspect: localStorage.getItem(SUSPECT_KEY),
    ...stageStats,
  }

  return (
    <InvestigationContext.Provider value={value}>{children}</InvestigationContext.Provider>
  )
}

export function useInvestigation() {
  const ctx = useContext(InvestigationContext)
  if (!ctx) {
    throw new Error('useInvestigation must be used within InvestigationProvider')
  }
  return ctx
}
