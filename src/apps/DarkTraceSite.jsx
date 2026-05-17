import React, { useState, useEffect } from 'react'
import './DarkTraceSite.css'
import { saveFileToDesktop } from '../utils/fileActions'

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
            <button 
              className={`dt-nav-btn ${currentPage === 'knowledge' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage('knowledge')
                if (onNavigate) onNavigate('knowledge')
              }}
            >
              [06] База Знаний
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
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'urgent', message: 'New evidence uploaded to Case SB-2025-06-21', time: '5 min ago' },
    { id: 2, type: 'info', message: 'System backup completed successfully', time: '1 hour ago' },
    { id: 3, type: 'warning', message: 'Unauthorized access attempt detected', time: '3 hours ago' }
  ])

  const [recentCases] = useState([
    { id: 'SB-2025-06-21', title: 'Missing Person - Sarah Black', status: 'active', priority: 'high' },
    { id: 'DT-2025-05-15', title: 'Warehouse Theft Investigation', status: 'pending', priority: 'medium' },
    { id: 'DT-2025-04-02', title: 'Cybersecurity Breach', status: 'closed', priority: 'low' }
  ])

  const detectiveName = playerData?.fullName?.toUpperCase() || 'DETECTIVE MILLER'
  const employeeId = playerData?.employeeId || 'DT-0000'

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

      <div className="dt-dashboard-grid">
        {/* Quick Stats */}
        <div className="dt-card">
          <h3>SYSTEM STATUS</h3>
          <div className="dt-stats">
            <div className="dt-stat">
              <span className="dt-stat-value">12</span>
              <span className="dt-stat-label">Active Cases</span>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-value">47</span>
              <span className="dt-stat-label">Evidence Items</span>
            </div>
            <div className="dt-stat">
              <span className="dt-stat-value">8</span>
              <span className="dt-stat-label">Pending Reviews</span>
            </div>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="dt-card">
          <h3>RECENT CASES</h3>
          <div className="dt-case-list">
            {recentCases.map(case_ => (
              <div key={case_.id} className="dt-case-item">
                <div className="dt-case-info">
                  <span className="dt-case-id">{case_.id}</span>
                  <span className="dt-case-title">{case_.title}</span>
                </div>
                <span className={`dt-case-status ${case_.status}`}>{case_.status}</span>
              </div>
            ))}
          </div>
          <button className="dt-card-btn" onClick={() => onNavigate('cases')}>
            View All Cases →
          </button>
        </div>

        {/* Notifications */}
        <div className="dt-card">
          <h3>NOTIFICATIONS</h3>
          <div className="dt-notification-list">
            {notifications.map(notif => (
              <div key={notif.id} className={`dt-notification ${notif.type}`}>
                <span className="dt-notification-message">{notif.message}</span>
                <span className="dt-notification-time">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dt-card">
          <h3>QUICK ACTIONS</h3>
          <div className="dt-action-grid">
            <button className="dt-action-btn" onClick={() => onNavigate('cases')}>
              📁 Open Case Database
            </button>
            <button className="dt-action-btn" onClick={() => onNavigate('evidence')}>
              🗂️ View Evidence Archive
            </button>
            <button className="dt-action-btn" onClick={() => onNavigate('messages')}>
              💬 Check Messages
            </button>
            <button className="dt-action-btn" onClick={() => onNavigate('archives')}>
              📚 Browse Archives
            </button>
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
  const evidence = [
    {
      id: 'EVI-001',
      caseId: 'SB-2025-06-21',
      type: 'Фото',
      name: 'Фото пропавшего лица',
      description: 'Недавнее фото Селены Блэк',
      date: '21.06.2025',
      status: 'обработано',
      file: {
        id: 'evi-001',
        name: 'Фото_Селены_Блэк.jpg',
        type: 'image',
        size: '1.8 МБ',
        url: '/assets/images/phone_note_final.jpg',
        downloadable: true,
        saveToDesktop: true
      }
    },
    {
      id: 'EVI-002',
      caseId: 'SB-2025-06-21',
      type: 'Документ',
      name: 'Полицейский отчет',
      description: 'Первоначальный отчет о пропаже лица',
      date: '21.06.2025',
      status: 'обработано',
      file: {
        id: 'evi-002',
        name: 'Полицейский_отчет.pdf',
        type: 'pdf',
        size: '2.4 МБ',
        url: '/assets/images/case-file.jpg',
        downloadable: true,
        saveToDesktop: true
      }
    },
    {
      id: 'EVI-003',
      caseId: 'SB-2025-06-21',
      type: 'Аудио',
      name: 'Запись звонка 911',
      description: 'Экстренный звонок от семьи',
      date: '21.06.2025',
      status: 'обработано',
      file: {
        id: 'evi-003',
        name: 'Звонок_911.mp3',
        type: 'audio',
        size: '3.2 МБ',
        url: '#',
        downloadable: false,
        saveToDesktop: false
      }
    }
  ]

  return (
    <div className="dt-investigative-database">
      <div className="dt-database-sidebar">
        <div className="dt-sidebar-header">
          <h3>УЛИКИ</h3>
        </div>
        <div className="dt-sidebar-evidence">
          {evidence.map(item => (
            <div key={item.id} className="dt-sidebar-evidence-item">
              <span className="dt-evidence-id">{item.id}</span>
              <span className="dt-evidence-type">{item.type}</span>
              <span className={`dt-evidence-status ${item.status === 'обработано' ? 'processed' : 'processing'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dt-database-content">
        <div className="dt-content-header">
          <h2>УЛИКИ</h2>
          <div className="dt-content-meta">
            <span>3 ОБЪЕКТА УЛИК</span>
            <span>ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: 21.06.2025</span>
          </div>
        </div>
        
        <div className="dt-evidence-list">
          {evidence.map(item => (
            <div key={item.id} className="dt-evidence-item">
              <div className="dt-evidence-header">
                <span className="dt-evidence-id">{item.id}</span>
                <span className="dt-evidence-type">{item.type}</span>
                <span className={`dt-evidence-status ${item.status === 'обработано' ? 'processed' : 'processing'}`}>{item.status}</span>
              </div>
              <div className="dt-evidence-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="dt-evidence-meta">
                  <span>Дело: {item.caseId}</span>
                  <span>Дата: {item.date}</span>
                </div>
              </div>
              <div className="dt-evidence-actions">
                <button className="dt-btn-small">ПРОСМОТР</button>
                {item.file?.downloadable && (
                  <button 
                    className="dt-btn-small dt-download-icon"
                    onClick={() => {
                      saveFileToDesktop(item.file, () => {
                        window.dispatchEvent(new Event('savedFilesChanged'))
                      })
                    }}
                    title="Скачать"
                  >
                    ⬇️
                  </button>
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
      portrait: '/assets/characters/selena_black.jpg'
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
      portrait: '/assets/characters/evan_underwood.jpg'
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
      portrait: '/assets/characters/marcus_flynn.jpg'
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
      portrait: '/assets/characters/vesper_wainwright.jpg'
    }
  ]

  const [selectedDossierId, setSelectedDossierId] = useState(dossiers[0]?.id)
  const selectedDossier = dossiers.find(d => d.id === selectedDossierId) || dossiers[0]

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
            <span>4 АКТИВНЫХ ЗАПИСИ</span>
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
                <button className="dt-btn-premium">ПОЛНОЕ ДОСЬЕ</button>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   STATEMENTS DATABASE
═══════════════════════════════════════ */
function StatementsDatabase({ userLevel, onNavigate }) {
  const statements = [
    {
      id: 'ST-001',
      witness: 'ЭВАН АНДЕРВУД',
      date: '21.06.2025',
      time: '19:45',
      location: 'Закусочная Ривертон',
      caseId: 'SB-2025-06-21',
      summary: 'Свидетель видел, как Селена Блэк покинула закусочную одна около 19:30. Необычного поведения не замечено.'
    },
    {
      id: 'ST-002',
      witness: 'ВЕСПЕР УЭЙНРАЙТ',
      date: '21.06.2025', 
      time: '20:15',
      location: 'Закусочная Ривертон',
      caseId: 'SB-2025-06-21',
      summary: 'Свидетель сообщает о подозрительном автомобиле у парковки закусочной. Темный седан, номера не видны.'
    }
  ]

  return (
    <div className="dt-investigative-database">
      <div className="dt-database-sidebar">
        <div className="dt-sidebar-header">
          <h3>СВИДЕТЕЛИ</h3>
        </div>
        <div className="dt-sidebar-witnesses">
          {statements.map(statement => (
            <div key={statement.id} className="dt-sidebar-witness">
              <span className="dt-witness-id">{statement.id}</span>
              <span className="dt-witness-name">{statement.witness}</span>
              <span className="dt-witness-time">{statement.time}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dt-database-content">
        <div className="dt-content-header">
          <h2>ПОКАЗАНИЯ</h2>
          <div className="dt-content-meta">
            <span>2 ЗАПИСАННЫХ ПОКАЗАНИЯ</span>
            <span>ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: 21.06.2025</span>
          </div>
        </div>
        
        <div className="dt-statements-list">
          {statements.map(statement => (
            <div key={statement.id} className="dt-statement-item">
              <div className="dt-statement-header">
                <span className="dt-statement-id">{statement.id}</span>
                <span className="dt-witness">{statement.witness}</span>
                <span className="dt-datetime">{statement.date} {statement.time}</span>
              </div>
              <div className="dt-statement-body">
                <p className="dt-statement-location">Место: {statement.location}</p>
                <p className="dt-statement-summary">{statement.summary}</p>
                <div className="dt-statement-meta">
                  <span>Дело: {statement.caseId}</span>
                </div>
              </div>
              <div className="dt-statement-actions">
                <button className="dt-btn-small">ПОЛНЫЕ ПОКАЗАНИЯ</button>
              </div>
            </div>
          ))}
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
      id: 'KB-001',
      title: 'Протокол по пропавшим лицам',
      category: 'ПРОЦЕДУРЫ',
      lastUpdated: '15.06.2025',
      summary: 'Стандартные операционные процедуры для расследований пропавших лиц в юрисдикции Ривертон.'
    },
    {
      id: 'KB-002',
      title: 'Руководство по сбору улик',
      category: 'ПРОЦЕДУРЫ', 
      lastUpdated: '10.06.2025',
      summary: 'Правильный сбор, сохранение и документация физических улик.'
    },
    {
      id: 'KB-003',
      title: 'Техники допроса свидетелей',
      category: 'ОБУЧЕНИЕ',
      lastUpdated: '01.06.2025',
      summary: 'Лучшие практики проведения эффективных допросов свидетелей.'
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
            <span>3 СТАТЬИ</span>
            <span>ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: 15.06.2025</span>
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
              </div>
              <div className="dt-knowledge-actions">
                <button className="dt-btn-small">ЧИТАТЬ СТАТЬЮ</button>
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
