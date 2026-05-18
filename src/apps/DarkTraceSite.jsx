import React, { useState, useEffect } from 'react'
import './DarkTraceSite.css'
import { saveFileToDesktop } from '../utils/fileActions'
import { getAgentAvatarPath } from '../utils/agentProfile'
import { useInvestigation } from '../utils/investigationSystem'



/* ═══════════════════════════════════════
   DARK TRACE INVESTIGATION AGENCY
   INTERNAL PORTAL SYSTEM
═══════════════════════════════════════ */




export default function DarkTraceSite({ onClose, darkTraceState, onNavigate, playerData }) {

  // Use props as single source of truth - no internal state duplication

  const currentPage = darkTraceState?.currentPage || 'login'

  const isLoggedIn = darkTraceState?.isLoggedIn || false

  const userLevel = darkTraceState?.userLevel || 'guest'

  

  const [loading, setLoading] = useState(false)

  const [systemTime, setSystemTime] = useState(new Date())

  const [sessionId, setSessionId] = useState(null)



  

  useEffect(() => {

    const timer = setInterval(() => {

      setSystemTime(new Date())

    }, 1000)

    return () => clearInterval(timer)

  }, [])



  useEffect(() => {

    // Generate session ID on mount

    setSessionId(`DT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)

  }, [])



  const handleLogin = (credentials) => {

    setLoading(true)



    // Simulate authentication with Dark Trace internal system

    setTimeout(() => {

      if (credentials.username === 'agent' && credentials.password === '12345') {

        setLoading(false)

        // Update parent state with new login info and page

        if (onNavigate) {

          onNavigate('dashboard', { isLoggedIn: true, userLevel: 'detective' })

        }

      } else if (credentials.username === 'admin.slate' && credentials.password === 'DT-ADMIN-2024') {

        setLoading(false)

        // Update parent state with new login info and page

        if (onNavigate) {

          onNavigate('dashboard', { isLoggedIn: true, userLevel: 'admin' })

        }

      } else {

        setLoading(false)

        alert('Authentication failed. Access denied.')

      }

    }, 2000)

  }



  const handleLogout = () => {

    if (onNavigate) {

      onNavigate('login', { isLoggedIn: false, userLevel: 'guest' })

    }

  }



  const renderPage = () => {

    switch (currentPage) {

      case 'login':

        return <LoginPage onLogin={handleLogin} loading={loading} />

      case 'dashboard':

        return <DashboardPage userLevel={userLevel} onNavigate={onNavigate} onLogout={handleLogout} playerData={playerData} />

      case 'dossiers':

        return <DossiersDatabase userLevel={userLevel} onNavigate={onNavigate} />

      case 'statements':

        return <StatementsDatabase userLevel={userLevel} onNavigate={onNavigate} />

      case 'evidence':
        return <EvidenceArchive userLevel={userLevel} onNavigate={onNavigate} />
      case 'knowledge':


        return <KnowledgeBase userLevel={userLevel} onNavigate={onNavigate} />


      case 'internal':

        return <InternalMessages userLevel={userLevel} onNavigate={onNavigate} />

      case 'archives':

        return <ArchivedCases userLevel={userLevel} onNavigate={onNavigate} />

      case 'classified':

        return userLevel === 'admin' ? <ClassifiedFiles onNavigate={onNavigate} /> : <AccessDenied />

      default:

        return <LoginPage onLogin={handleLogin} loading={loading} />

    }

  }



  return (

    <div className="dark-trace-site">

      {/* System Header */}

      <header className="dt-header">

        <div className="dt-header-top">

          <div className="dt-logo">

            <img 

              src="/assets/images/darktrace-logo-v2.png" 

              alt="Dark Trace Agency" 

              className="dt-logo-img"

            />

          </div>

          <div className="dt-system-info">

            <div className="dt-status-indicator">

              <span className="dt-status-dot"></span>

              <span className="dt-status-text">СИСТЕМА АКТИВНА</span>

            </div>

            <div className="dt-time">{systemTime.toLocaleTimeString()}</div>

            <div className="dt-session">СЕССИЯ: {sessionId}</div>

          </div>

        </div>

              </header>



      {/* Navigation */}

      {isLoggedIn && (

        <nav className="dt-nav">

          <div className="dt-nav-left">

            <button

              className={`dt-nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}

              onClick={() => {

                if (onNavigate) onNavigate('dashboard')

              }}

            >

              🏠 ГЛАВНАЯ

            </button>

            <button

              className={`dt-nav-btn ${currentPage === 'dossiers' ? 'active' : ''}`}

              onClick={() => {

                if (onNavigate) onNavigate('dossiers')

              }}

            >

              [03] Досье

            </button>

            <button

              className={`dt-nav-btn ${currentPage === 'statements' ? 'active' : ''}`}

              onClick={() => {

                if (onNavigate) onNavigate('statements')

              }}

            >

              [04] Показания

            </button>

            <button
              className={`dt-nav-btn ${currentPage === 'evidence' ? 'active' : ''}`}
              onClick={() => {
                if (onNavigate) onNavigate('evidence')
              }}
            >
              [05] Улики
            </button>






            {userLevel === 'admin' && (

              <button 

                className={`dt-nav-btn ${currentPage === 'classified' ? 'active' : ''}`}

                onClick={() => {

                  setCurrentPage('classified')

                  if (onNavigate) onNavigate('classified')

                }}

              >

                🔒 СЕКРЕТНО

              </button>

            )}

          </div>

          <div className="dt-nav-right">

            <button className="dt-logout-btn" onClick={handleLogout}>

              ВЫЙТИ

            </button>

          </div>

        </nav>

      )}



      {/* Main Content */}

      <main className={`dt-main ${currentPage === 'login' ? 'login' : ''}`}>

        <div className="dt-content">

          {renderPage()}

        </div>

      </main>



      {/* System Footer */}

      <footer className="dt-footer">

        <div className="dt-footer-left">

          2024 DARK TRACE СЛЕДСТВЕННОЕ АГЕНТСТВО | РИВЕРТОН, WA

        </div>

        <div className="dt-footer-center">

          ТОЛЬКО ДЛЯ ВНУТРЕННЕГО ИСПОЛЬЗОВАНИЯ | НЕСАНКЦИОНИРОВАННЫЙ ДОСТУП НАКАЗУЕМ ПО RCW 9A.52.030

        </div>

        <div className="dt-footer-right">

          ВЕРСИЯ 2.4.1 | СБОРКА 20240621

        </div>

      </footer>

    </div>

  )

}



/* ═══════════════════════════════════════

   LOGIN PAGE

═══════════════════════════════════════ */

function LoginPage({ onLogin, loading }) {

  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const [showHelp, setShowHelp] = useState(false)



  const handleSubmit = (e) => {

    e.preventDefault()

    onLogin(credentials)

  }



  return (

    <div className="dt-login-container">

      <div className="dt-login-card">

        <div className="dt-login-header">

          <div className="dt-login-logo">

            <img 

              src="/assets/images/darktrace-logo-v3.png" 

              alt="Dark Trace Agency" 

              className="dt-login-logo-v3"

            />

          </div>

          <div className="dt-login-warning">

            ⚠️ ОГРАНИЧЕННЫЙ ДОСТУП - ТОЛЬКО ДЛЯ УПОЛНОМОЧЕННЫХ

          </div>

        </div>



        <form className="dt-login-form" onSubmit={handleSubmit}>

          <div className="dt-form-group">

            <label>ИМЯ ПОЛЬЗОВАТЕЛЯ / ID ЖЕТОНА</label>

            <input

              type="text"

              value={credentials.username}

              onChange={(e) => setCredentials({...credentials, username: e.target.value})}

              placeholder="agent"

              required

            />

          </div>



          <div className="dt-form-group">

            <label>ПАРОЛЬ / КОД ДОСТУПА</label>

            <input

              type="password"

              value={credentials.password}

              onChange={(e) => setCredentials({...credentials, password: e.target.value})}

              placeholder="••••••••"

              required

            />

          </div>



          <button type="submit" className="dt-login-btn" disabled={loading}>

            {loading ? 'Аутентификация...' : 'ДОСТУП К СИСТЕМЕ'}

          </button>

        </form>



        <div className="dt-login-footer">

          <div className="dt-system-status">

            <span className="dt-status-dot online"></span>

            Все системы работают

          </div>

          <button 

            className="dt-help-link" 

            onClick={() => setShowHelp(!showHelp)}

          >

            Нужна помощь?

          </button>

          {showHelp && (

            <div className="dt-help-text">

              Связаться с IT поддержкой: доб. 555 | security@darktrace.agency

            </div>

          )}

        </div>

      </div>



      <div className="dt-login-background">

        <div className="dt-scanlines"></div>

        <div className="dt-noise"></div>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   DASHBOARD PAGE

═══════════════════════════════════════ */

function DashboardPage({ userLevel, onNavigate, onLogout, playerData }) {
  const { currentStage, stagePercentage, reviewedCount, totalRequired } = useInvestigation();

  const fullName = playerData?.fullName?.trim() || ''
  const detectiveName = fullName ? fullName.toUpperCase() : 'DETECTIVE'
  const employeeId = playerData?.employeeId || 'DT-0000'
  const registrationStatus = fullName ? 'АКТИВЕН' : 'НЕ ЗАРЕГИСТРИРОВАН'
  const accessLevel = `LEVEL ${String(userLevel || 'guest').toUpperCase()}`
  const assignedCase = 'SB-2025-06-21'
  const avatarSrc = playerData?.avatarPath || getAgentAvatarPath(fullName)

  return (
    <div className="dt-dashboard">
      <div className="dt-dashboard-header">
        <h1>DASHBOARD</h1>
        <div className="dt-user-info">
          <span>{detectiveName}</span>
          <span className="dt-badge">{employeeId}</span>
          <span className="dt-badge">LEVEL {userLevel.toUpperCase()}</span>
        </div>
      </div>

      <div className="dt-dashboard-grid dt-dashboard-no-notifications">
        {/* Agent Profile */}
        <div className="dt-card">
          <h3>ПРОФИЛЬ АГЕНТА</h3>
          <div className="dt-agent-profile">
            <div className="dt-agent-avatar">
              <img src={avatarSrc} alt="Agent avatar" />
              <div className="dt-agent-avatar-scan" />
            </div>
            <div className="dt-agent-fields">
              <div className="dt-agent-row">
                <span className="dt-agent-label">АГЕНТ</span>
                <span className="dt-agent-value">{fullName || 'ДЕТЕКТИВ'}</span>
              </div>
              <div className="dt-agent-row">
                <span className="dt-agent-label">ID</span>
                <span className="dt-agent-value dt-agent-mono">{employeeId}</span>
              </div>
              <div className="dt-agent-row">
                <span className="dt-agent-label">СТАТУС</span>
                <span className={`dt-agent-value ${fullName ? 'dt-agent-ok' : 'dt-agent-warn'}`}>{registrationStatus}</span>
              </div>
              <div className="dt-agent-row">
                <span className="dt-agent-label">УРОВЕНЬ ДОСТУПА</span>
                <span className="dt-agent-value dt-agent-mono">{accessLevel}</span>
              </div>
              <div className="dt-agent-row">
                <span className="dt-agent-label">ТЕКУЩЕЕ ДЕЛО</span>
                <span className="dt-agent-value dt-agent-mono">{assignedCase}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investigation Progress */}
        <div className="dt-card dt-progression-card">
          <h3>INVESTIGATION PROGRESS</h3>
          <div className="dt-progression-content">
            <div className="dt-progress-header">
              <span className="dt-progress-percent">{stagePercentage}%</span>
              <span className="dt-stage-name">STAGE: {currentStage.title}</span>
            </div>

            <div className="dt-progress-bar-container">
              <div
                className="dt-progress-bar-fill" 
                style={{ width: `${stagePercentage}%` }}
              >
                <div className="dt-progress-bar-glow"></div>
              </div>
            </div>

            <div className="dt-objective-box">
              <span className="dt-objective-label">CURRENT OBJECTIVE:</span>
              <p className="dt-objective-text">{currentStage.objective}</p>
              <div className="dt-objective-hint">
                {currentStage.id === 'initial_analysis' ? 
                  "Откройте раздел «Досье» и «Видеопротоколы» и изучите материалы всех фигурантов дела." : 
                  "Изучите новые материалы в архиве улик и показаний."}
              </div>

            </div>


            <div className="dt-stats-row">
              <div className="dt-stat-item">
                <span className="dt-stat-label">FILES REVIEWED</span>
                <span className="dt-stat-value">{reviewedCount} / {totalRequired}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




/* ═══════════════════════════════════════

   CASES DATABASE

═══════════════════════════════════════ */

function CasesDatabase({ userLevel, onNavigate }) {

  const [cases] = useState([

    {

      id: 'SB-2025-06-21',

      title: 'Missing Person - Sarah Black',

      status: 'active',

      priority: 'high',

      assignedTo: 'Detective Miller',

      created: '2025-06-21',

      lastUpdated: '2025-06-21',

      description: 'Sarah Black, age 28, reported missing by family. Last seen at Riverton Diner.',

      evidence: 12,

      notes: 'Family reports unusual behavior prior to disappearance.'

    },

    {

      id: 'DT-2025-05-15',

      title: 'Warehouse Theft Investigation',

      status: 'pending',

      priority: 'medium',

      assignedTo: 'Detective Slate',

      created: '2025-05-15',

      lastUpdated: '2025-05-20',

      description: 'Multiple items stolen from Riverton Warehouse District.',

      evidence: 8,

      notes: 'Security footage partially corrupted.'

    },

    {

      id: 'DT-2025-04-02',

      title: 'Cybersecurity Breach',

      status: 'closed',

      priority: 'low',

      assignedTo: 'Detective Chen',

      created: '2025-04-02',

      lastUpdated: '2025-04-18',

      description: 'Unauthorized access to municipal systems.',

      evidence: 23,

      notes: 'Case closed - perpetrator identified.'

    }

  ])



  return (

    <div className="dt-cases">

      <div className="dt-page-header">

        <h1>CASE DATABASE</h1>

        <div className="dt-page-actions">

          <button className="dt-btn">+ NEW CASE</button>

          <button className="dt-btn">EXPORT DATA</button>

        </div>

      </div>



      <div className="dt-cases-filter">

        <select className="dt-filter-select">

          <option>All Status</option>

          <option>Active</option>

          <option>Pending</option>

          <option>Closed</option>

        </select>

        <select className="dt-filter-select">

          <option>All Priority</option>

          <option>High</option>

          <option>Medium</option>

          <option>Low</option>

        </select>

        <input type="text" className="dt-filter-input" placeholder="Search cases..." />

      </div>



      <div className="dt-cases-table">

        <div className="dt-table-header">

          <div>CASE ID</div>

          <div>TITLE</div>

          <div>STATUS</div>

          <div>PRIORITY</div>

          <div>ASSIGNED TO</div>

          <div>EVIDENCE</div>

          <div>LAST UPDATED</div>

          <div>ACTIONS</div>

        </div>

        {cases.map(case_ => (

          <div key={case_.id} className="dt-table-row">

            <div className="dt-case-id">{case_.id}</div>

            <div className="dt-case-title">{case_.title}</div>

            <div className={`dt-status ${case_.status}`}>{case_.status}</div>

            <div className={`dt-priority ${case_.priority}`}>{case_.priority}</div>

            <div>{case_.assignedTo}</div>

            <div>{case_.evidence}</div>

            <div>{case_.lastUpdated}</div>

            <div>

              <button className="dt-action-small">VIEW</button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   EVIDENCE ARCHIVE

═══════════════════════════════════════ */

function EvidenceArchive({ userLevel, onNavigate }) {
  const { markFileAsReviewed } = useInvestigation()
  const [selectedCategory, setSelectedCategory] = useState('Фото')
  const [previewImage, setPreviewImage] = useState(null)

  const categories = [
    {
      id: 'photo',
      name: 'Фото',
      files: [
        {
          id: 'crime_scene_photo',
          name: 'Место происшествия',
          description: 'Общий вид места обнаружения тела.',
          url: '/assets/evidence/crime_scene_photo.jpg',
          type: 'image'
        }
      ]
    },
    {
      id: 'document',
      name: 'Документ',
      files: [
        {
          id: 'gallery_archive_page',
          name: 'Архивная страница галереи',
          description: 'Каталог выставки из архива галереи "Арт-Модерн".',
          url: '/assets/evidence/gallery_archive_page.jpg',
          type: 'image'
        }
      ]
    },
    {
      id: 'diary',
      name: 'Дневник',
      files: [
        {
          id: 'diary_page_07',
          name: 'Страница дневника №7',
          url: '/assets/evidence/diary_page_07.jpg',
          type: 'image'
        },
        {
          id: 'diary_page_08',
          name: 'Страница дневника №8',
          url: '/assets/evidence/diary_page_08.jpg',
          type: 'image'
        }
      ]
    }
  ]

  const currentCategory = categories.find(c => c.name === selectedCategory)

  useEffect(() => {
    if (currentCategory) {
      currentCategory.files.forEach(file => markFileAsReviewed(file.id))
    }
  }, [selectedCategory])

  const handleDownload = (e, file) => {
    e.stopPropagation()
    const fileData = {
      id: file.id,
      name: file.name.endsWith('.jpg') ? file.name : `${file.name}.jpg`,
      type: 'image',
      url: file.url,
      downloadable: true,
      saveToDesktop: true
    }
    saveFileToDesktop(fileData, () => {
      window.dispatchEvent(new Event('savedFilesChanged'))
    })
  }

  return (
    <div className="dt-investigative-database">
      <div className="dt-database-sidebar">
        <div className="dt-sidebar-header">
          <h3>КАТЕГОРИИ УЛИК</h3>
        </div>
        <div className="dt-sidebar-evidence">
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className={`dt-sidebar-evidence-item ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
              style={{ cursor: 'pointer' }}
            >
              <span className="dt-evidence-type">{cat.name.toUpperCase()}</span>
              <span className="dt-evidence-id">{cat.files.length} ОБЪЕКТ(А)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dt-database-content dt-evidence-viewer-content">
        <div className="dt-content-header">
          <h2>{selectedCategory.toUpperCase()} — МАТЕРИАЛЫ СЛЕДСТВИЯ</h2>
          <div className="dt-content-meta">
            <span>CASE: SB-2025-06-21</span>
            <span>RESTRICTED ACCESS</span>
          </div>
        </div>

        <div className="dt-evidence-display-area">
          {currentCategory?.files.map((file, index) => (
            <div key={file.id} className="dt-evidence-file-wrapper">
              <div className="dt-evidence-file-info">
                <span className="dt-file-index">FILE_{String(index + 1).padStart(2, '0')}</span>
                <div className="dt-file-actions-header">
                  <button 
                    className="dt-btn-mini" 
                    onClick={(e) => handleDownload(e, file)}
                    title="Скачать на рабочий стол"
                  >
                    ⬇️ СКАЧАТЬ
                  </button>
                  <span className="dt-file-name">{file.name}</span>
                </div>
              </div>
              <div 
                className="dt-evidence-image-container clickable"
                onClick={() => setPreviewImage({
                  src: file.url,
                  title: file.name,
                  meta: `EVIDENCE • ${selectedCategory.toUpperCase()} • ${file.id}`
                })}
                title="Нажмите для увеличения"
              >
                <div className="dt-viewer-frame"></div>
                <img 
                  src={file.url} 
                  alt={file.name} 
                  className="dt-evidence-real-image"
                />
                <div className="dt-image-overlay-hint">
                  <span>🔍 НАЖМИТЕ ДЛЯ ОСМОТРА</span>
                </div>
              </div>
              {file.description && (
                <div className="dt-evidence-file-description">
                  <p>{file.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <FullDossierModal
        open={Boolean(previewImage)}
        dossier={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  )
}


/* ═══════════════════════════════════════

   INTERNAL MESSAGES

═══════════════════════════════════════ */

function InternalMessages({ userLevel, onNavigate }) {

  const [messages] = useState([

    {

      id: 1,

      from: 'David Slate',

      subject: 'URGENT: New Evidence in SB-2025-06-21',

      preview: 'Please review the newly uploaded surveillance footage...',

      time: '2 hours ago',

      read: false

    },

    {

      id: 2,

      from: 'System Admin',

      subject: 'Scheduled System Maintenance',

      preview: 'The system will be offline for maintenance tonight...',

      time: '5 hours ago',

      read: true

    }

  ])



  return (

    <div className="dt-messages">

      <div className="dt-page-header">

        <h1>INTERNAL MESSAGES</h1>

        <div className="dt-page-actions">

          <button className="dt-btn">+ COMPOSE</button>

          <button className="dt-btn">REFRESH</button>

        </div>

      </div>



      <div className="dt-message-list">

        {messages.map(msg => (

          <div key={msg.id} className={`dt-message ${msg.read ? 'read' : 'unread'}`}>

            <div className="dt-message-header">

              <span className="dt-message-from">{msg.from}</span>

              <span className="dt-message-time">{msg.time}</span>

            </div>

            <div className="dt-message-subject">{msg.subject}</div>

            <div className="dt-message-preview">{msg.preview}</div>

          </div>

        ))}

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   ARCHIVED CASES

═══════════════════════════════════════ */

function ArchivedCases({ userLevel, onNavigate }) {

  return (

    <div className="dt-archives">

      <div className="dt-page-header">

        <h1>ARCHIVED CASES</h1>

      </div>

      

      <div className="dt-archive-warning">

        ⚠️ RESTRICTED ACCESS - ADMINISTRATIVE PRIVILEGES REQUIRED

      </div>

      

      <div className="dt-archive-content">

        <p>Access to archived cases requires Level 3 security clearance.</p>

        <p>Please contact your system administrator for access requests.</p>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   CLASSIFIED FILES

═══════════════════════════════════════ */

function ClassifiedFiles({ onNavigate }) {

  return (

    <div className="dt-classified">

      <div className="dt-page-header">

        <h1>CLASSIFIED FILES</h1>

      </div>

      

      <div className="dt-classified-warning">

        🔒 TOP SECRET - EYES ONLY

      </div>

      

      <div className="dt-classified-content">

        <p>Access to classified files is restricted to authorized personnel only.</p>

        <p>All access attempts are logged and monitored.</p>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   ACCESS DENIED

═══════════════════════════════════════ */

function AccessDenied() {

  return (

    <div className="dt-access-denied">

      <div className="dt-denied-content">

        <h1>🚫 ACCESS DENIED</h1>

        <p>You do not have sufficient privileges to access this section.</p>

        <p>Please contact your system administrator for access requests.</p>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   DOSSIERS DATABASE

═══════════════════════════════════════ */

function DossiersDatabase({ userLevel, onNavigate }) {
  const { markFileAsReviewed } = useInvestigation()
  const dossiers = [


    {

      id: 'DS-001',

      name: 'СЕЛЕНА БЛЭК',

      status: 'ЖЕРТВА',

      age: 28,

      lastSeen: 'Закусочная Ривертон - 21.06.2025',

      priority: 'ВЫСОКИЙ',

      caseId: 'SB-2025-06-21',

      gender: 'Женский',

      birthDate: '22.01.1998',

      birthPlace: 'г. Ривертон',

      portrait: '/assets/characters/selena_black.jpg',

      fullDossier: '/assets/dossiers/selena_black_dossier.jpg'

    },

    {

      id: 'DS-002',

      name: 'ЭВАН АНДЕРВУД',

      status: 'СВИДЕТЕЛЬ',

      age: 32,

      lastSeen: 'Закусочная Ривертон - 21.06.2025',

      priority: 'СРЕДНИЙ',

      caseId: 'SB-2025-06-21',

      gender: 'Мужской',

      birthDate: '15.08.1993',

      birthPlace: 'г. Ривертон',

      portrait: '/assets/characters/evan_underwood.jpg',

      fullDossier: '/assets/dossiers/evan_underwood_dossier.jpg'

    },

    {

      id: 'DS-003',

      name: 'МАРКУС ФЛИНН',

      status: 'СВИДЕТЕЛЬ',

      age: 35,

      lastSeen: 'Центр города - 20.06.2025',

      priority: 'СРЕДНИЙ',

      caseId: 'SB-2025-06-21',

      gender: 'Мужской',

      birthDate: '03.12.1990',

      birthPlace: 'г. Ривертон',

      portrait: '/assets/characters/marcus_flynn.jpg',

      fullDossier: '/assets/dossiers/marcus_flynn_dossier.jpg'

    },

    {

      id: 'DS-004',

      name: 'ВЕСПЕР УЭЙНРАЙТ',

      status: 'СВИДЕТЕЛЬ',

      age: 29,

      lastSeen: 'Закусочная Ривертон - 21.06.2025',

      priority: 'НИЗКИЙ',

      caseId: 'SB-2025-06-21',

      gender: 'Женский',

      birthDate: '27.04.1996',

      birthPlace: 'г. Ривертон',

      portrait: '/assets/characters/vesper_wainwright.jpg',

      fullDossier: '/assets/dossiers/vesper_wainwright_dossier.jpg'

    },

    {

      id: 'DS-005',

      name: 'АЛАРИК ВИНСЕНТ РАВЕНСВУД',

      status: 'СВИДЕТЕЛЬ',

      age: 28,

      lastSeen: 'г. Ривертон - 21.06.2025',

      priority: 'СРЕДНИЙ',

      caseId: 'SB-2025-06-21',

      gender: 'Мужской',

      birthDate: '11.03.1997',

      birthPlace: 'г. Ривертон',

      portrait: '/assets/characters/alaric_ravenwood.jpg',

      fullDossier: '/assets/dossiers/alaric_ravenswood_dossier.jpg',

      summary:

        'Давний знакомый Селены Блэк со времен университета, позиционировал себя как ее близкий друг и ценитель таланта. Испытывал к ней неразделенные чувства, был категорически против ее помолвки с Эваном Андервудом. Известен своим эксцентричным поведением и саркастическим отношением к окружающим.'

    },

    {

      id: 'DS-006',

      name: 'РОЗАЛИЯ МАРИ АНДЕРВУД',

      status: 'СВИДЕТЕЛЬ',

      age: 49,

      lastSeen: 'г. Оук-Харбор - 21.06.2025',

      priority: 'СРЕДНИЙ',

      caseId: 'SB-2025-06-21',

      gender: 'Женский',

      birthDate: '15.09.1975',

      birthPlace: 'г. Оук-Харбор',

      portrait: '/assets/characters/rosalia_underwood.jpg',

      fullDossier: '/assets/dossiers/rosalia_underwood_dossier.jpg',

      summary:

        'Уважаемая фигура в культурной жизни Ривертона, известная своей благотворительной деятельностью и поддержкой молодых талантов. После смерти мужа успешно управляет галереей "Арт-Модерн". В обществе известна как элегантная женщина с безупречным вкусом и преданная мать.'

    },

    {

      id: 'DS-007',

      name: 'МАЙКЛ ДЖОНАТАН ЭЛИОТ',

      status: 'СВИДЕТЕЛЬ',

      age: 45,

      lastSeen: 'г. Оклэнд - 21.06.2025',

      priority: 'ВЫСОКИЙ',

      caseId: 'SB-2025-06-21',

      gender: 'Мужской',

      birthDate: '12.03.1980',

      birthPlace: 'г. Оклэнд',

      portrait: '/assets/characters/michael_elliot.jpg',

      fullDossier: '/assets/dossiers/michael_elliot_dossier.jpg',

      summary:

        'Доктор Майкл Элиот — высококвалифицированный психотерапевт с более чем 15-летним стажем. Переехал в Ривертон около 10 лет назад, где открыл успешную частную практику. Селена Блэк являлась его пациенткой с весны 2024 года.'

    },

    {
      id: 'DS-008',
      name: 'АРТУР ЛЭНГСТОН ПЕЙН',
      status: 'СВИДЕТЕЛЬ',
      age: 54,
      lastSeen: 'г. Ривертон - 21.06.2025',
      priority: 'ВЫСОКИЙ',
      caseId: 'SB-2025-06-21',
      gender: 'Мужской',
      birthDate: '18.08.1970',
      birthPlace: 'г. Ривертон',
      portrait: '/assets/characters/arthur_payne.jpg',
      fullDossier: '/assets/dossiers/arthur_payne_dossier.jpg',
      summary:
        'Уважаемый ривертонский предприниматель, меценат и коллекционер произведений молодых художников. Именно он обнаружил тело Селены Блэк вечером 21 июня при попытке забрать заказанную картину.'
    }
  ]

  const [selectedDossierId, setSelectedDossierId] = useState(dossiers[0]?.id)


  const selectedDossier = dossiers.find(d => d.id === selectedDossierId) || dossiers[0]

  const [openFullDossier, setOpenFullDossier] = useState(null)



  function openDossierViewer(dossier) {
    const src = dossier?.fullDossier
    if (!src) return

    // Track progression
    const dossierFileId = dossier.id.toLowerCase().replace('ds-', '');
    // Mapping internal DS- IDs to investigation stage IDs
    const dossierMap = {
      '001': 'selena_black_dossier',
      '002': 'evan_underwood_dossier',
      '003': 'marcus_flynn_dossier',
      '004': 'vesper_wainwright_dossier',
      '005': 'alaric_ravenwood_dossier',
      '006': 'rosalia_underwood_dossier',
      '007': 'michael_elliot_dossier',
      '008': 'arthur_payne_dossier'
    };
    
    const trackingId = dossierMap[dossierFileId] || `${dossierFileId}_dossier`;
    markFileAsReviewed(trackingId);

    setOpenFullDossier({
      src,
      title: dossier?.name ?? 'DOSSIER',
      meta: `${dossier?.id ?? ''}${dossier?.caseId ? ` • ${dossier.caseId}` : ''}`.trim(),
    })
  }





  return (

    <div className="dt-investigative-database">

      <div className="dt-database-sidebar">

        <div className="dt-sidebar-header">

          <h3>АКТИВНЫЕ ДЕЛА</h3>

        </div>

        <div className="dt-sidebar-cases">

          {dossiers.map(dossier => {

            const isActive = dossier.id === selectedDossierId

            return (

              <div

                key={dossier.id}

                className={`dt-sidebar-case ${isActive ? 'active' : ''}`}

                role="button"

                tabIndex={0}

                onClick={() => setSelectedDossierId(dossier.id)}

                onKeyDown={(e) => {

                  if (e.key === 'Enter' || e.key === ' ') setSelectedDossierId(dossier.id)

                }}

              >

                <span className="dt-case-id">{dossier.id}</span>

                <span className="dt-case-name">{dossier.name}</span>

                <span className={`dt-case-status ${dossier.status.toLowerCase()}`}>{dossier.status}</span>

              </div>

            )

          })}

        </div>

      </div>

      

      <div className="dt-database-content">

        <div className="dt-content-header">

          <h2>ДОСЬЕ</h2>

          <div className="dt-content-meta">

            <span>{dossiers.length} АКТИВНЫХ ЗАПИСЕЙ</span>

            <span>ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: 21.06.2025</span>

          </div>

        </div>

        

        <div className="dt-dossiers-list dt-dossiers-single">
          {selectedDossier && (
            <div key={selectedDossier.id} className="dt-dossier-item dt-dossier-item-single dt-dossier-swap">




              <div className="dt-dossier-header">

                <span className="dt-dossier-id">{selectedDossier.id}</span>

                <span className={`dt-status ${selectedDossier.status.toLowerCase()}`}>{selectedDossier.status}</span>

              </div>

              <div className="dt-dossier-body">

                <div className="dt-dossier-left">

                  <h3>{selectedDossier.name}</h3>

                  <div className="dt-dossier-fields">

                    <div className="dt-dossier-field">

                      <span className="dt-field-label">Пол</span>

                      <span className="dt-field-value">{selectedDossier.gender}</span>

                    </div>

                    <div className="dt-dossier-field">

                      <span className="dt-field-label">Возраст</span>

                      <span className="dt-field-value">{selectedDossier.age} лет</span>

                    </div>

                    <div className="dt-dossier-field">

                      <span className="dt-field-label">Дата рождения</span>

                      <span className="dt-field-value">{selectedDossier.birthDate}</span>

                    </div>

                  <div className="dt-dossier-field">

                    <span className="dt-field-label">Место рождения</span>

                    <span className="dt-field-value">{selectedDossier.birthPlace}</span>

                  </div>

                  <div className="dt-dossier-field">

                    <span className="dt-field-label">Дело</span>

                    <span className="dt-field-value">{selectedDossier.caseId}</span>

                  </div>

                </div>

                </div>

                <div className="dt-dossier-right">

                  <div className="dt-dossier-portrait">

                    <img 

                      src={selectedDossier.portrait}

                      alt={selectedDossier.name}

                      className="dt-portrait-image"

                    />

                </div>

                <div className="dt-dossier-status-panel">

                  <span className={`dt-status dt-status-stack ${selectedDossier.status.toLowerCase()}`}>{selectedDossier.status}</span>

                </div>

                <button

                  className="dt-btn-premium"

                  onClick={() => openDossierViewer(selectedDossier)}

                  disabled={!selectedDossier?.fullDossier}

                  title={selectedDossier?.fullDossier ? undefined : 'Dossier file missing'}

                >

                  ПОЛНОЕ ДОСЬЕ

                </button>

              </div>

            </div>

            </div>

          )}

        </div>

      </div>



      <FullDossierModal

        open={Boolean(openFullDossier)}

        dossier={openFullDossier}

        onClose={() => setOpenFullDossier(null)}

      />

    </div>

  )

}



function FullDossierModal({ open, dossier, onClose }) {

  const [phase, setPhase] = useState(open ? 'open' : 'closed') // 'open' | 'closing' | 'closed'

  const [zoom, setZoom] = useState(1)

  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const [drag, setDrag] = useState(null) // { startX, startY, originX, originY, pointerId }



  useEffect(() => {

    if (open) {

      setPhase('open')

      setZoom(1)

      setOffset({ x: 0, y: 0 })

      return

    }



    if (phase === 'open') {

      setPhase('closing')

      const t = setTimeout(() => setPhase('closed'), 220)

      return () => clearTimeout(t)

    }

  }, [open])



  useEffect(() => {

    if (!open) return

    function onKeyDown(e) {

      if (e.key === 'Escape') onClose?.()

    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)

  }, [open, onClose])



  useEffect(() => {

    if (!open) return

    document.body.classList.add('dt-full-dossier-open')

    return () => document.body.classList.remove('dt-full-dossier-open')

  }, [open])



  if (phase === 'closed') return null



  const canRender = Boolean(dossier?.src)



  function clampZoom(next) {

    return Math.min(3, Math.max(0.6, next))

  }



  function zoomBy(delta) {

    setZoom(z => clampZoom(z + delta))

  }



  function resetView() {

    setZoom(1)

    setOffset({ x: 0, y: 0 })

  }



  function onPointerDown(e) {

    if (e.button != null && e.button !== 0) return

    e.currentTarget.setPointerCapture?.(e.pointerId)

    setDrag({

      startX: e.clientX,

      startY: e.clientY,

      originX: offset.x,

      originY: offset.y,

      pointerId: e.pointerId,

    })

  }



  function onPointerMove(e) {

    if (!drag) return

    if (drag.pointerId != null && e.pointerId !== drag.pointerId) return

    const dx = e.clientX - drag.startX

    const dy = e.clientY - drag.startY

    setOffset({ x: drag.originX + dx, y: drag.originY + dy })

  }



  function onPointerUp(e) {

    if (!drag) return

    if (drag.pointerId != null && e.pointerId !== drag.pointerId) return

    setDrag(null)

  }



  function onWheel(e) {

    e.preventDefault?.()

    const delta = e.deltaY > 0 ? -0.12 : 0.12

    setZoom(z => clampZoom(z + delta))

  }



  return (

    <div

      className={`dt-full-dossier-overlay ${phase === 'open' && open ? 'open' : ''} ${phase === 'closing' ? 'closing' : ''}`}

      role="dialog"

      aria-modal="true"

      aria-label="Full dossier viewer"

      onMouseDown={(e) => {

        if (e.target === e.currentTarget) onClose?.()

      }}

    >

      <div className="dt-full-dossier-shell">

        <div className="dt-full-dossier-topbar">

          <div className="dt-full-dossier-title">

            <div className="dt-full-dossier-kicker">CLASSIFIED • FULL DOSSIER</div>

            <div className="dt-full-dossier-heading">{dossier?.title ?? 'DOSSIER'}</div>

            {dossier?.meta && <div className="dt-full-dossier-meta">{dossier.meta}</div>}

          </div>



          <div className="dt-full-dossier-tools">

            <button className="dt-dossier-toolbtn" onClick={() => zoomBy(-0.2)} aria-label="Zoom out">-</button>

            <span className="dt-dossier-zoom">{Math.round(zoom * 100)}%</span>

            <button className="dt-dossier-toolbtn" onClick={() => zoomBy(0.2)} aria-label="Zoom in">+</button>

            <button className="dt-dossier-toolbtn" onClick={resetView} aria-label="Reset view">Reset</button>

            <button className="dt-dossier-closebtn" onClick={() => onClose?.()} aria-label="Close dossier">✕</button>

          </div>

        </div>



        <div className="dt-full-dossier-canvas" onWheel={onWheel}>

          <div

            className={`dt-full-dossier-stage ${drag ? 'dragging' : ''}`}

            onPointerDown={onPointerDown}

            onPointerMove={onPointerMove}

            onPointerUp={onPointerUp}

            onPointerCancel={onPointerUp}

          >

            {canRender ? (

              <img

                className="dt-full-dossier-image"

                src={dossier.src}

                alt={dossier.title ?? 'Full dossier'}

                draggable={false}

                style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})` }}

              />

            ) : (

              <div className="dt-full-dossier-missing">

                <div className="dt-full-dossier-missing-title">FILE NOT FOUND</div>

                <div className="dt-full-dossier-missing-sub">This dossier is unavailable in the current build.</div>

              </div>

            )}

          </div>

        </div>



        <div className="dt-full-dossier-hint">Wheel: zoom • Drag: pan • ESC: close</div>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════
   STATEMENTS DATABASE -> VIDEO INTERVIEW ARCHIVE
═══════════════════════════════════════ */
function StatementsDatabase({ userLevel, onNavigate }) {
  const { markFileAsReviewed } = useInvestigation()

  const interviews = [
    {
      id: 'INT-001',
      witness: 'ЭВАН АНДЕРВУД',
      status: 'ЖЕНИХ / ПОДОЗРЕВАЕМЫЙ',
      date: '22.06.2025',
      time: '02:15',
      location: 'Допросная №4',
      video: '/assets/interviews/evan_underwood_interview.mp4',
      
    },
    {
      id: 'INT-002',
      witness: 'ВЕСПЕР УЭЙНРАЙТ',
      status: 'СВИДЕТЕЛЬ',
      date: '21.06.2025', 
      time: '23:40',
      location: 'Ривертон ПД',
      video: '/assets/interviews/vesper_wainwright_interview.mp4',
      thumbnail: '/assets/characters/vesper_wainwright.jpg'
    },
    {
      id: 'INT-003',
      witness: 'РОЗАЛИЯ МАРИ АНДЕРВУД',
      status: 'СВИДЕТЕЛЬ / МАТЬ ПОДОЗРЕВАЕМОГО',
      date: '22.06.2025',
      time: '11:20',
      location: 'Особняк Андервуд',
      video: '/assets/interviews/rosalia_underwood_interview.mp4',
      thumbnail: '/assets/characters/rosalia_underwood.jpg'
    },
    {
      id: 'INT-004',
      witness: 'АЛАРИК ВИНСЕНТ РАВЕНСВУД',
      status: 'СВИДЕТЕЛЬ / ДРУГ ЖЕРТВЫ',
      date: '22.06.2025',
      time: '14:45',
      location: 'Ривертон ПД',
      video: '/assets/interviews/alaric_ravenwood_interview.mp4',
      thumbnail: '/assets/characters/alaric_ravenwood.jpg'
    },
    {
      id: 'INT-005',
      witness: 'МАРКУС ФЛИНН',
      status: 'СВИДЕТЕЛЬ',
      date: '22.06.2025',
      time: '09:00',
      location: 'Допросная №2',
      video: '/assets/interviews/marcus_flynn_interview.mp4',
      thumbnail: '/assets/characters/marcus_flynn.jpg'
    }

  ]

  const [selectedId, setSelectedId] = useState(interviews[0].id)
  const current = interviews.find(i => i.id === selectedId) || interviews[0]

  const handleSelect = (id) => {
    setSelectedId(id)
    markFileAsReviewed(id)
  }

  return (
    <div className="dt-investigative-database dt-interview-archive">
      <div className="dt-database-sidebar">
        <div className="dt-sidebar-header">
          <h3>ВИДЕОПРОТОКОЛЫ</h3>
        </div>
        <div className="dt-sidebar-witnesses">
          {interviews.map(item => (
            <div 
              key={item.id} 
              className={`dt-sidebar-witness ${selectedId === item.id ? 'active' : ''}`}
              onClick={() => handleSelect(item.id)}
            >
              <div className="dt-witness-meta-mini">
                <span className="dt-witness-id">{item.id}</span>
                <span className="dt-witness-name">{item.witness}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="dt-database-content">
        <div className="dt-content-header">
          <h2>ВИДЕОПРОТОКОЛЫ ДОПРОСОВ</h2>
          <div className="dt-content-meta">
            <span>{interviews.length} ЗАПИСЕЙ В АРХИВЕ</span>
            <span>СТАТУС: ДОСТУП РАЗРЕШЕН</span>
          </div>
        </div>

        <div className="dt-interview-viewer">
          <div className="dt-video-container">
            <div className="dt-video-overlay-info">
              <div className="dt-rec-indicator">● REC</div>
              <div className="dt-cam-label">CAM 01 - INTERROGATION ROOM</div>
            </div>
            <video 
              key={current.video}
              controls 
              className="dt-main-video"
              poster={current.thumbnail}
            >
              <source src={current.video} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
            <div className="dt-video-glitch"></div>
          </div>

          <div className="dt-interview-info-panel">
            <div className="dt-info-header">
              <div className="dt-info-title-group">
                <span className="dt-info-label">ФИО ДОПРАШИВАЕМОГО</span>
                <h3 className="dt-info-name">{current.witness}</h3>
              </div>
              <div className="dt-info-status-group">
                <span className="dt-info-label">СТАТУС</span>
                <span className="dt-info-status">{current.status}</span>
              </div>
            </div>

            <div className="dt-info-grid">
              <div className="dt-info-item">
                <span className="dt-info-label">ДАТА ЗАПИСИ</span>
                <span className="dt-info-value">{current.date}</span>
              </div>
              <div className="dt-info-item">
                <span className="dt-info-label">ВРЕМЯ НАЧАЛА</span>
                <span className="dt-info-value">{current.time}</span>
              </div>
              <div className="dt-info-item">
                <span className="dt-info-label">МЕСТО ПРОВЕДЕНИЯ</span>
                <span className="dt-info-value">{current.location}</span>
              </div>
              <div className="dt-info-item">
                <span className="dt-info-label">ID ПРОТОКОЛА</span>
                <span className="dt-info-value">{current.id}</span>
              </div>
            </div>

            <div className="dt-classified-stamp">TOP SECRET - DT INTERNAL USE ONLY</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   KNOWLEDGE BASE
═══════════════════════════════════════ */


function KnowledgeBase({ userLevel, onNavigate }) {
  const articles = [
    {
      id: 'KB-004',
      title: 'ДОСЬЕ: г. Ривертон (Общая Сводка)',
      category: 'АНАЛИТИКА',
      lastUpdated: '21.06.2025',
      summary: 'Справка о городе Ривертон: социальная структура, экономика, локальные риски и оперативные рекомендации для следствия.',
      isCityInfo: true,
      population: '~85,000 жителей',
      economy: 'Исторически — промышленность, лесозаготовка. В настоящее время — банковский сектор ("Ривертон Коммершл Банк"), логистика (речной порт), частное образование (Академия Ривертона).',
      geography: {
        west: 'Западный Берег ("Золотые Холмы", Деловой Квартал): Мир "старых денег", дорогих фасадов и корпоративной власти. Здесь заключаются сделки и хранятся главные секреты города. Жизнь здесь течет медленно и подчинена строгим, неписаным правилам.',
        east: 'Восточный Берег (Старый Город, Промышленные Районы): Мир богемы, рабочих и теней. Узкие, туманные улочки, арт-галереи, антикварные лавки и бары, где можно услышать то, о чем не напишут в "Ривертонских Хрониках". Это место, где кипит настоящая жизнь и проливается настоящая кровь.'
      },
      syndrome: 'Неофициальный термин, описывающий специфический менталитет местных жителей. Характеризуется повышенной скрытностью, недоверием к чужакам и властям. Главный принцип синдрома — "не выносить сор из избы". Проблемы решаются внутри семьи или общины, а обращение в полицию считается последним делом и часто — предательством. Этот "кодекс молчания" делает официальные расследования практически безрезультатными и является основной причиной существования нашего агентства.',
      legends: [
        { title: 'Река Блэкуотер', text: 'Городская легенда гласит, что река "никогда не отдает своих мертвецов". Утопление — удобный способ скрыть следы для тех, кто знает ее течения.' },
        { title: 'Переулок Элайджи', text: 'Небольшой переулок в Старом Городе, где, по слухам, можно купить что угодно: от запрещенных веществ до фальшивых документов. Полиция предпочитает туда не заглядывать.' },
        { title: 'Фестиваль Потерянных Фонарей', text: 'Ежегодный осенний фестиваль, когда жители спускают на воду фонарики в память об ушедших. Считается, что в эту ночь город "говорит" со своими призраками, и можно узнать много старых тайн, если слушать правильных людей.' }
      ],
      recommendation: 'В Ривертоне фасад — это все. Доверяйте только проверенным фактам, ищите противоречия и всегда помните: чем идеальнее картинка, тем страшнее то, что она скрывает.'
    }
  ]

  return (
    <div className="dt-investigative-database">
      <div className="dt-database-sidebar">
        <div className="dt-sidebar-header">
          <h3>КАТЕГОРИИ</h3>
        </div>
        <div className="dt-sidebar-categories">
          {articles.map(article => (
            <div key={article.id} className="dt-sidebar-category">
              <span className="dt-category-id">{article.id}</span>
              <span className="dt-category-name">{article.category}</span>
              <span className="dt-category-updated">{article.lastUpdated}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dt-database-content">
        <div className="dt-content-header">
          <h2>БАЗА ЗНАНИЙ</h2>
          <div className="dt-content-meta">
            <span>{articles.length} СТАТЬЯ</span>
            <span>ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: 21.06.2025</span>
          </div>
        </div>

        <div className="dt-knowledge-list">
          {articles.map(article => (
            <div key={article.id} className="dt-knowledge-item">
              <div className="dt-knowledge-header">
                <span className="dt-knowledge-id">{article.id}</span>
                <span className="dt-category">{article.category}</span>
                <span className="dt-updated">{article.lastUpdated}</span>
              </div>
              <div className="dt-knowledge-body">
                <h3>{article.title}</h3>
                <p>{article.summary}</p>

                {article.isCityInfo && (
                  <div className="dt-kb-city-details">
                    <div className="dt-kb-city-row"><strong>Население:</strong> {article.population}</div>
                    <div className="dt-kb-city-row"><strong>Основа экономики:</strong> {article.economy}</div>

                    <h4>Социальная структура и география</h4>
                    <ul className="dt-kb-city-list">
                      <li>{article.geography.west}</li>
                      <li>{article.geography.east}</li>
                    </ul>

                    <h4>"Ривертонский Синдром" и Кодекс Молчания</h4>
                    <p>{article.syndrome}</p>

                    <h4>Местные легенды и "Красные флаги" для детектива</h4>
                    <div className="dt-kb-city-legends">
                      {article.legends.map((legend, idx) => (
                        <div key={idx} className="dt-kb-city-legend-item">
                          <strong>{legend.title}:</strong> {legend.text}
                        </div>
                      ))}
                    </div>

                    <div className="dt-kb-city-recommendation">
                      <strong>Рекомендация для оперативной работы:</strong>
                      <p>{article.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   DOSSIERS PAGE
═══════════════════════════════════════ */


function DossiersPage({ userLevel, onNavigate }) {

  const dossiers = [

    {

      id: 'DS-001',

      name: 'СЕЛЕНА БЛЭК',

      status: 'ПРОПАЛА',

      age: 28,

      lastSeen: 'Закусочная Ривертон - 21.06.2025',

      priority: 'ВЫСОКИЙ',

      caseId: 'SB-2025-06-21'

    }

  ]



  return (

    <div className="dt-dossiers">

      <div className="dt-page-header">

        <h2>ДОСЬЕ</h2>

        <div className="dt-case-info">Дело №SB-2025-06-21</div>

      </div>

      <div className="dt-dossiers-grid">

        {dossiers.map(dossier => (

          <div key={dossier.id} className="dt-dossier-card">

            <div className="dt-dossier-name">{dossier.name}</div>

            <div className="dt-dossier-info">{dossier.status}</div>

          </div>

        ))}

      </div>

    </div>

  )

}

