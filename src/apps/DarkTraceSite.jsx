import React, { useState, useEffect } from 'react'
import './DarkTraceSite.css'

/* ═══════════════════════════════════════
   DARK TRACE INVESTIGATION AGENCY
   INTERNAL PORTAL SYSTEM
═══════════════════════════════════════ */

export default function DarkTraceSite({ onClose }) {
  const [currentPage, setCurrentPage] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userLevel, setUserLevel] = useState('guest')
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
      if (credentials.username === 'miller' && credentials.password === 'archive22') {
        setIsLoggedIn(true)
        setUserLevel('detective')
        setCurrentPage('dashboard')
        setLoading(false)
      } else if (credentials.username === 'admin.slate' && credentials.password === 'DT-ADMIN-2024') {
        setIsLoggedIn(true)
        setUserLevel('admin')
        setCurrentPage('dashboard')
        setLoading(false)
      } else {
        setLoading(false)
        alert('Authentication failed. Access denied.')
      }
    }, 2000)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserLevel('guest')
    setCurrentPage('login')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} loading={loading} />
      case 'dashboard':
        return <DashboardPage userLevel={userLevel} onNavigate={setCurrentPage} onLogout={handleLogout} />
      case 'cases':
        return <CasesDatabase userLevel={userLevel} onNavigate={setCurrentPage} />
      case 'evidence':
        return <EvidenceArchive userLevel={userLevel} onNavigate={setCurrentPage} />
      case 'messages':
        return <InternalMessages userLevel={userLevel} onNavigate={setCurrentPage} />
      case 'archives':
        return <ArchivedCases userLevel={userLevel} onNavigate={setCurrentPage} />
      case 'classified':
        return userLevel === 'admin' ? <ClassifiedFiles onNavigate={setCurrentPage} /> : <AccessDenied />
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
            <span className="dt-logo-icon">🔍</span>
            <span className="dt-logo-text">DARK TRACE</span>
            <span className="dt-logo-sub">INVESTIGATION AGENCY</span>
          </div>
          <div className="dt-system-info">
            <div className="dt-status-indicator">
              <span className="dt-status-dot"></span>
              <span className="dt-status-text">SYSTEM ONLINE</span>
            </div>
            <div className="dt-time">{systemTime.toLocaleTimeString()}</div>
            <div className="dt-session">SESSION: {sessionId}</div>
          </div>
        </div>
              </header>

      {/* Navigation */}
      {isLoggedIn && (
        <nav className="dt-nav">
          <div className="dt-nav-left">
            <button 
              className={`dt-nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              🏠 DASHBOARD
            </button>
            <button 
              className={`dt-nav-btn ${currentPage === 'cases' ? 'active' : ''}`}
              onClick={() => setCurrentPage('cases')}
            >
              📁 CASES
            </button>
            <button 
              className={`dt-nav-btn ${currentPage === 'evidence' ? 'active' : ''}`}
              onClick={() => setCurrentPage('evidence')}
            >
              🗂️ EVIDENCE
            </button>
            <button 
              className={`dt-nav-btn ${currentPage === 'messages' ? 'active' : ''}`}
              onClick={() => setCurrentPage('messages')}
            >
              💬 MESSAGES
            </button>
            <button 
              className={`dt-nav-btn ${currentPage === 'archives' ? 'active' : ''}`}
              onClick={() => setCurrentPage('archives')}
            >
              📚 ARCHIVES
            </button>
            {userLevel === 'admin' && (
              <button 
                className={`dt-nav-btn ${currentPage === 'classified' ? 'active' : ''}`}
                onClick={() => setCurrentPage('classified')}
              >
                🔒 CLASSIFIED
              </button>
            )}
          </div>
          <div className="dt-nav-right">
            <button className="dt-logout-btn" onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`dt-main ${currentPage === 'login' ? 'login' : ''}`}>
        {renderPage()}
      </main>

      {/* System Footer */}
      <footer className="dt-footer">
        <div className="dt-footer-left">
          © 2024 DARK TRACE INVESTIGATION AGENCY | RIVERTON, WA
        </div>
        <div className="dt-footer-center">
          INTERNAL USE ONLY | UNAUTHORIZED ACCESS PROSECUTABLE UNDER RCW 9A.52.030
        </div>
        <div className="dt-footer-right">
          SYSTEM VERSION 2.4.1 | LAST UPDATED: 2024-06-15
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
            <span className="dt-login-icon">🔍</span>
            <h1>DARK TRACE</h1>
            <p>INTERNAL PORTAL</p>
          </div>
          <div className="dt-login-warning">
            ⚠️ RESTRICTED ACCESS - AUTHORIZED PERSONNEL ONLY
          </div>
        </div>

        <form className="dt-login-form" onSubmit={handleSubmit}>
          <div className="dt-form-group">
            <label>USERNAME / BADGE ID</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="miller"
              required
            />
          </div>

          <div className="dt-form-group">
            <label>PASSWORD / ACCESS CODE</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="dt-login-btn" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
          </button>
        </form>

        <div className="dt-login-footer">
          <div className="dt-system-status">
            <span className="dt-status-dot online"></span>
            All systems operational
          </div>
          <button 
            className="dt-help-link" 
            onClick={() => setShowHelp(!showHelp)}
          >
            Need help?
          </button>
          {showHelp && (
            <div className="dt-help-text">
              Contact IT Support: ext. 555 | security@darktrace.agency
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
function DashboardPage({ userLevel, onNavigate, onLogout }) {
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

  return (
    <div className="dt-dashboard">
      <div className="dt-dashboard-header">
        <h1>DASHBOARD</h1>
        <div className="dt-user-info">
          <span>DETECTIVE MILLER</span>
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
  const [evidence] = useState([
    {
      id: 'EVI-001',
      caseId: 'SB-2025-06-21',
      type: 'Photo',
      name: 'Missing Person Photo',
      description: 'Recent photo of Sarah Black',
      date: '2025-06-21',
      status: 'processed'
    },
    {
      id: 'EVI-002',
      caseId: 'SB-2025-06-21',
      type: 'Document',
      name: 'Police Report',
      description: 'Initial missing person report',
      date: '2025-06-21',
      status: 'processed'
    },
    {
      id: 'EVI-003',
      caseId: 'SB-2025-06-21',
      type: 'Audio',
      name: '911 Call Recording',
      description: 'Emergency call from family',
      date: '2025-06-21',
      status: 'processing'
    }
  ])

  return (
    <div className="dt-evidence">
      <div className="dt-page-header">
        <h1>EVIDENCE ARCHIVE</h1>
        <div className="dt-page-actions">
          <button className="dt-btn">+ UPLOAD EVIDENCE</button>
          <button className="dt-btn">SCAN NEW ITEM</button>
        </div>
      </div>

      <div className="dt-evidence-grid">
        {evidence.map(item => (
          <div key={item.id} className="dt-evidence-card">
            <div className="dt-evidence-header">
              <span className="dt-evidence-type">{item.type}</span>
              <span className="dt-evidence-id">{item.id}</span>
            </div>
            <div className="dt-evidence-body">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <div className="dt-evidence-meta">
                <span>Case: {item.caseId}</span>
                <span>Date: {item.date}</span>
              </div>
            </div>
            <div className="dt-evidence-footer">
              <span className={`dt-status ${item.status}`}>{item.status}</span>
              <button className="dt-btn-small">VIEW</button>
            </div>
          </div>
        ))}
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
