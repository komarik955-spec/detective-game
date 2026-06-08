import './styles/desktop.css'

import { useState, useEffect } from 'react'

import LoginScreen from './components/LoginScreen'
import Loader from './components/Loader'
import Desktop from './components/Desktop'
import RegistrationScreen from './components/RegistrationScreen'
import './styles/login.css'
import CallPrototype from './prototype/CallPrototype'
import ForensicCenterPage from './pages/ForensicCenterPage'

function seedEnvelope2DebugState() {
  const defaultPlayerData = {
    firstName: 'Alex',
    lastName: 'Reed',
    fullName: 'Alex Reed',
    employeeId: 'DT-2407',
    avatarPath: '',
  }

  const savedPlayerData = (() => {
    try {
      const raw = localStorage.getItem('dt_playerData')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()

  const playerData =
    savedPlayerData?.fullName && savedPlayerData?.employeeId ? savedPlayerData : defaultPlayerData

  const starterReviewed = [
    'selena_black_dossier',
    'evan_underwood_dossier',
    'vesper_wainwright_dossier',
    'marcus_flynn_dossier',
    'alaric_ravenwood_dossier',
    'rosalia_underwood_dossier',
    'michael_elliot_dossier',
    'arthur_payne_dossier',
    'INT-001',
    'INT-002',
    'INT-003',
    'INT-004',
    'INT-005',
    'crime_scene_photo',
    'gallery_archive_page',
    'diary_page_07',
    'diary_page_08',
  ]

  const envelope1Reviewed = [
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

  const envelope2New = [
    'it_report',
    'creditor_note',
    'raven_chat_1',
    'raven_chat_2',
    'alaric_selena_chat',
    'diary_page_envelope2',
    'alaric_interrogation_transcript',
    'phone_call_transcript_2',
  ]

  const viewedEvidence = [
    'pharmacy_receipt',
    'newspaper_obituary',
    'bank_statement',
    'selena_diary',
    'luxe_restaurant_chat',
    'shadows_of_riverton_chat',
    'curator_card',
  ]

  const progress = {
    currentStageId: 'envelope_2',
    reviewedFiles: [...starterReviewed, ...envelope1Reviewed],
    completedStages: ['starter_folder', 'envelope_1'],
    interimReportSent: true,
    slateCallCompleted: true,
    envelope1Unlocked: true,
    rivertonInsuranceCompleted: true,
    newMaterialIds: envelope2New,
    workspacePhotoCallTriggered: false,
    workspacePhotoCallCompleted: false,
    unlockedWorkspacePhotoIds: [],
  }

  localStorage.setItem('dt_playerData', JSON.stringify(playerData))
  localStorage.setItem('dt_investigation_progress', JSON.stringify(progress))
  localStorage.setItem('dt_current_envelope', '2')
  localStorage.setItem('dt_visited_telecom', 'true')
  localStorage.setItem('dt_riverton_insurance_complete', 'true')
  localStorage.setItem('dt_insurance_success_mail', 'true')
  localStorage.setItem('dt_slate_court_order_mail', 'true')
  localStorage.setItem('dt_slate_evidence_mail', 'true')
  localStorage.setItem('dt_miller_alibi_memo_mail', 'true')
  localStorage.setItem('dt_vesper_insurance_hint_mail', 'true')
  localStorage.setItem('chosen_suspect', 'alaric_ravenwood')
  localStorage.setItem('dt_viewed_evidence', JSON.stringify(viewedEvidence))
  localStorage.removeItem('dt_rpd_gallery_report_unlocked')
  localStorage.removeItem('dt_workspace_photo_call_requested')
  localStorage.removeItem('pendingInvestigationEmail')

  sessionStorage.removeItem('mailApp_mails')
  sessionStorage.removeItem('secondMailShown')

  return playerData
}

export default function App() {
  const [stage, setStage] = useState('loading')
  const [playerData, setPlayerData] = useState(null)
  const [isPrototype, setIsPrototype] = useState(false)
  const [pathname, setPathname] = useState(window.location.pathname)


  useEffect(() => {
    const debounce = (fn, delay) => {
      let timer;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    };

    const handleResize = () => {
      const baseWidth = 1920;
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // Масштаб по ширине
      const widthScale = Math.min(Math.max(currentWidth / baseWidth, 0.6), 1.5);
      
      // Дополнительная проверка по высоте (если нужно)
      const baseHeight = 1080; // Full HD height
      const heightScale = Math.min(Math.max(currentHeight / baseHeight, 0.6), 1.5);
      
      // Используем меньший масштаб из двух
      const scale = Math.min(widthScale, heightScale);
      
      document.documentElement.style.setProperty('--app-scale', scale.toString());
      document.documentElement.style.setProperty('--app-font-scale', scale.toString());
    };

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    handleResize();

    return () => window.removeEventListener('resize', debouncedResize);
  }, []);



  useEffect(() => {
    const handlePathChange = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePathChange)
    return () => window.removeEventListener('popstate', handlePathChange)
  }, [])

  useEffect(() => {
    // Check for prototype mode via URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('prototype') === 'call') {
      setIsPrototype(true)
      return
    }

    if (urlParams.get('debug') === 'envelope2') {
      const debugPlayerData = seedEnvelope2DebugState()
      setPlayerData(debugPlayerData)
      setStage('desktop')
      return
    }



    setTimeout(() => {

      const saved = localStorage.getItem('dt_playerData')

      if (saved) {

        try {

          const parsed = JSON.parse(saved)

          if (parsed?.fullName && parsed?.employeeId) {

            setPlayerData(parsed)

            setStage('login')

            return

          }

        } catch {}

      }



      setStage('registration')

    }, 2000)

  }, [])



  const handleRegistration = (data) => {

    setPlayerData(data)

    try {

      localStorage.setItem('dt_playerData', JSON.stringify(data))

    } catch {}

    setStage('login')

  }



  // Render prototype if activated
  if (isPrototype) {
    return <CallPrototype />
  }

  if (pathname === '/forensic-lab') {
    return <ForensicCenterPage />
  }

  if (stage === 'loading') return <Loader />


  if (stage === 'registration') {

    return <RegistrationScreen onRegistration={handleRegistration} />

  }



  if (stage === 'login') {

    return <LoginScreen onLogin={() => setStage('desktop')} />

  }



  return <Desktop playerData={playerData} />

}

