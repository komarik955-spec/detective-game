import React, { useState, useRef, useEffect } from 'react'
import './MailApp.css'
import { createPortal } from 'react-dom'


/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const INITIAL_MAILS = [
  {
    id: 1,
    folder: 'inbox',
    tab: 'primary',
    starred: false,
    read: false,
    from: {
      name: 'Дэвид Слейт',
      email: 'd.slate@ashford-pd.gov',
      avatar: '👮'
    },
    subject: 'Инструктаж по делу',
    preview: 'Детектив, все материалы по делу №001 загружены в систему. Ознакомьтесь...',
    date: '09:03',

    body: `Добро пожаловать, детектив.

Вы вошли в систему Dark Trace.

Первое дело уже ожидает вас.
Ознакомьтесь с письмом.

И помните: правда редко лежит на поверхности.`,

    attachments: [
      {
        name: 'Приветственное письмо.jpg',
        size: '2.4 МБ',
        icon: '🖼️',
        url: '/assets/images/case-file.jpg'
      }
    ]
  },


  {
    id: 5, 
    folder: 'inbox', 
    tab: 'primary', 
    starred: false, 
    read: false,
    hidden: true,
    from: { 
      name: 'ДЕПАРТАМЕНТ ПОЛИЦИИ ГОРОДА РИВЕРТОН', 
      email: 'rpd@rivertonpd.gov', 
      avatar: '🏛️' 
    },
    subject: 'ПРЕДВАРИТЕЛЬНЫЙ РАПОРТ О ПРОИСШЕСТВИИ (Дело №0078)',
    preview: 'НОМЕР ДЕЛА: RPD-25-06-21-0078. Обнаружения тела Селены Блэк. Статус: Открыто',
    date: '09:13',
    body: `ДЕПАРТАМЕНТ ПОЛИЦИИ ГОРОДА РИВЕРТОН
Центральный Участок

ПРЕДВАРИТЕЛЬНЫЙ РАПОРТ О ПРОИСШЕСТВИИ

ДАТА СОСТАВЛЕНИЯ: 22 июня 2025 г.
НОМЕР ДЕЛА (ИНЦИДЕНТА): RPD-25-06-21-0078
ВЕДУЩИЙ ДЕТЕКТИВ: Джон Миллер
СТАТУС РАССЛЕДОВАНИЯ: Открыто

ПО ФАКТУ: Обнаружения тела Селены Блэк.

АДРЕС ОБНАРУЖЕНИЯ: г. Ривертон, ул. Старых Мастеров, д. 12/3, Арт-студия.
ДАТА И ВРЕМЯ ОБНАРУЖЕНИЯ: 21.06.2025 г., ~19:45.

1. ОБСТОЯТЕЛЬСТВА ПРОИСШЕСТВИЯ (Первичные данные):

21.06.2025 в 19:47 в Департамент Полиции Ривертона поступил звонок от мистера Артура Пейна (владелец сети книжных магазинов "Читающий Ривертон") об обнаружении им тела Селены Блэк по указанному адресу. По словам Пейна, он прибыл в студию в оговоренное время, чтобы забрать заказанную им картину, и, обнаружив дверь приоткрытой, вошел внутрь, где и нашел тело, после чего немедленно вызвал 911. Прибывшая на место следственно-оперативная группа подтвердила факт смерти. Внешних признаков насилия, характерных для борьбы или нападения, не обнаружено.

2. ОСМОТР МЕСТА ПРОИСШЕСТВИЯ (Основные находки):

Обстановка в арт-студии не нарушена, следы взлома или незаконного проникновения отсутствуют.

Рядом с телом покойной обнаружены пустые упаковки из-под рецептурного препарата «Сертофин».

В мобильном телефоне покойной (Auraphone 17), найденном на столе, в приложении "Заметки" обнаружена запись от 21.06.2025, содержание которой может быть истолковано как предсмертная записка (Приложение №1).

На столе также находился ноутбук AuraBook Pro, несколько эскизных альбомов, набор кистей и красок, недопитая чашка чая и кофейный стаканчик с крышкой с остатками жидкости (изъят для экспертизы).

Личные вещи и ценности покойной (дамская сумочка с кошельком, содержащим ~$500 и банковские карты; наручные часы; обручальное кольцо на пальце) не тронуты. Признаков ограбления не установлено.

3. ПРОВЕДЕННЫЕ СЛЕДСТВЕННЫЕ ДЕЙСТВИЯ:

Проведен опрос заявителя (Артур Пейн) и близкого окружения. Произведен осмотр места происшествия. Заявитель Артур Пейн имеет подтвережденное алиби на предполагаемое время смерти.

4. ПРЕДВАРИТЕЛЬНОЕ ЗАКЛЮЧЕНИЕ И ПЛАНИРУЕМЫЕ ДЕЙСТВИЯ:

На основании первоначального осмотра, обнаруженных вещественных доказательств (упаковки от препарата, предсмертная записка) и первичных опросов, основной рассматриваемой версией является самоубийство путем умышленной передозировки лекарственным препаратом. Назначена судебно-медицинская экспертиза. В случае подтверждения основной версии результатами СМЭ, дело будет закрыто.

Детектив: ______________ /Джон Миллер/

УТВЕРЖДАЮ:
Начальник Центрального Участка РПД ______________ /Капитан Майкл Бронсон/

[Место для печати Департамента Полиции Ривертона]`,
    attachments: [],
  },
]

const FOLDERS = [
  { id: 'inbox',   label: 'Входящие',     icon: InboxIcon },
  { id: 'starred', label: 'Помеченные',   icon: StarIcon },
  { id: 'snoozed', label: 'Отложенные',   icon: ClockIcon },
  { id: 'sent',    label: 'Отправленные', icon: SendIcon },
  { id: 'drafts',  label: 'Черновики',    icon: DraftIcon },
  { id: 'trash',   label: 'Корзина',      icon: TrashIcon },
]

const TABS = [
  { id: 'primary', label: 'Несортированные', icon: '📥' },
  { id: 'promos',  label: 'Промоакции',      icon: '🏷️',  },
  { id: 'social',  label: 'Соцсети',         icon: '👥' },
]

/* ═══════════════════════════════════════
   SVG ICONS (inline, no dependencies)
═══════════════════════════════════════ */
function InboxIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
}
function StarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function ClockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function SendIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
}
function DraftIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
}
function TrashIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function SettingsIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
}
function ExpandIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
}
function EmojiIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
}
function ReplyIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
}
function ForwardIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 014-4h12"/></svg>
}
function MoreIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
}
function AttachIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
}
function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
}
function PenIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
}

/* ═══════════════════════════════════════
   AVATAR COMPONENT
═══════════════════════════════════════ */
const AVATAR_COLORS = [
  '#e94560','#4f8ef7','#34a853','#fbbc04',
  '#ea4335','#673ab7','#ff6d00','#00bcd4',
]

function Avatar({ name, emoji, size = 36 }) {
  if (emoji) return (
    <div className="mail-avatar-emoji" style={{ width: size, height: size, fontSize: size * 0.5 }}>
      {emoji}
    </div>
  )
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="mail-avatar-letter" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {initials}
    </div>
  )
}

/* ═══════════════════════════════════════
   COMPOSE WINDOW
═══════════════════════════════════════ */
function ComposeModal({ onClose }) {
  const [to,      setTo]      = useState('')
  const [subject, setSubject] = useState('')
  const [body,    setBody]    = useState('')
  const [sent,    setSent]    = useState(false)
  const [minimized, setMin]   = useState(false)

  function send() {
    if (!to.trim()) return
    setSent(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className={`compose-modal ${minimized ? 'compose-minimized' : ''}`}>
      <div className="compose-topbar" onClick={() => minimized && setMin(false)}>
        <span className="compose-topbar-title">Новое письмо</span>
        <div className="compose-topbar-actions">
          <button onClick={e => { e.stopPropagation(); setMin(m => !m) }}>─</button>
          <button onClick={e => { e.stopPropagation(); /* expand */ }}>⤢</button>
          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {!minimized && (
        <>
          {sent ? (
            <div className="compose-sent-msg">
              <span className="compose-sent-check">✓</span>
              Письмо отправлено
            </div>
          ) : (
            <>
              <div className="compose-field-row">
                <input className="compose-field-input" placeholder="Кому" value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <div className="compose-field-row">
                <input className="compose-field-input" placeholder="Тема" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <textarea
                className="compose-textarea"
                placeholder="Напишите письмо..."
                value={body}
                onChange={e => setBody(e.target.value)}
              />
              <div className="compose-bottom-bar">
                <button className="compose-send-btn" onClick={send}>Отправить</button>
                <div className="compose-bottom-tools">
                  <button className="compose-tool-icon" title="Прикрепить файл"><AttachIcon /></button>
                  <button className="compose-tool-icon" title="Эмодзи"><EmojiIcon /></button>
                </div>
                <button className="compose-delete-btn" onClick={onClose} title="Удалить">🗑</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   READING PANE
═══════════════════════════════════════ */
function ReadingPane({ mail, onStar, onDelete, onBack, onOpenFile }) {
  if (!mail) {
    return (
      <div className="reading-empty">
        <div className="reading-empty-illustration">
          <div className="reading-empty-icon">📭</div>
        </div>
        <p className="reading-empty-text">Выберите письмо для чтения</p>
      </div>
    )
  }

  return (
    <div className="reading-pane">
      {/* Subject */}
      <div className="reading-header">
        <div className="reading-subject-row">
          <h2 className="reading-subject">{mail.subject}</h2>
          <div className="reading-labels">
            {!mail.read && <span className="reading-label new">Новое</span>}
            {mail.from.email.includes('.onion') && <span className="reading-label danger">⚠ Анонимно</span>}
          </div>
        </div>

        {/* Sender row */}
        <div className="reading-sender-row">
          <Avatar name={mail.from.name} emoji={mail.from.avatar} size={40} />
          <div className="reading-sender-info">
            <div className="reading-sender-name-row">
              <span className="reading-sender-name">{mail.from.name}</span>
              <span className="reading-sender-email">&lt;{mail.from.email}&gt;</span>
            </div>
            <div className="reading-sender-to">Кому: я &nbsp;·&nbsp; {mail.date}</div>
          </div>
          <div className="reading-header-actions">
            <button
              className={`reading-action-btn ${mail.starred ? 'starred' : ''}`}
              onClick={() => onStar(mail.id)}
              title="Отметить"
            >★</button>
            <button className="reading-action-btn" onClick={() => onDelete(mail.id)} title="Удалить">🗑</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="reading-body">
        <div className="reading-body-text">{mail.body}</div>

        {/* Attachments */}
        {mail.attachments?.length > 0 && (
          <div className="reading-attachments">
            <div className="reading-attachments-label">Вложения ({mail.attachments.length})</div>
            <div className="reading-attachments-list">
              {mail.attachments.map((att, i) => (
                <div
  key={i}
  className="reading-attachment-chip"
  onClick={() => onOpenFile(att)}
  style={{ cursor: 'pointer' }}
>
                  <span className="att-icon">{att.icon}</span>
                  <div>
                    <div className="att-name">{att.name}</div>
                    <div className="att-size">{att.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply bar */}
      <div className="reading-reply-bar">
        <button className="reading-reply-btn"><ReplyIcon /> Ответить</button>
        <button className="reading-reply-btn"><ForwardIcon /> Переслать</button>
        <button className="reading-reply-btn icon-only"><MoreIcon /></button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function MailApp({ onNotificationRead }) {
  const [openedFile, setOpenedFile] = useState(null);
  const [mails,       setMails]       = useState(INITIAL_MAILS)
  const [folder,      setFolder]      = useState('inbox')
  const [tab,         setTab]         = useState('primary')
  const [selectedId,  setSelectedId]  = useState(null)
  const [search,      setSearch]      = useState('')
  const [compose,     setCompose]     = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const timerRef = useRef(null)

  /* ── Filter ── */
  const folderMails = (() => {
    if (folder === 'starred') return mails.filter(m => m.starred && !m.hidden)
    if (folder === 'trash')   return mails.filter(m => m.folder === 'trash' && !m.hidden)
    if (folder === 'sent')    return mails.filter(m => m.folder === 'sent' && !m.hidden)
    if (folder === 'drafts')  return mails.filter(m => m.folder === 'drafts' && !m.hidden)
    return mails.filter(m => m.folder === 'inbox' && m.tab === tab && !m.hidden)
  })()

  const displayMails = search
    ? folderMails.filter(m =>
        m.from.name.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.preview.toLowerCase().includes(search.toLowerCase())
      )
    : folderMails

  const selectedMail = mails.find(m => m.id === selectedId) ?? null
  const unreadCount  = mails.filter(m => m.folder === 'inbox' && !m.read).length

  /* ── Actions ── */
  function selectMail(mail) {
    setSelectedId(mail.id)
    
    // Если кликнули на письмо #1, запустить таймер для показа рапорта
    if (mail.id === 1) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      timerRef.current = setTimeout(() => {
        setMails(prev => prev.map(m => 
          m.id === 5 ? { ...m, hidden: false } : m
        ))
      }, 10000)
    }
    
    if (!mail.read) {
      setMails(prev => prev.map(m => m.id === mail.id ? { ...m, read: true } : m))
      if (onNotificationRead) onNotificationRead()
    }
  }

  function toggleStar(id) {
    setMails(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }

  function deleteMail(id) {
    setMails(prev => prev.map(m => m.id === id ? { ...m, folder: 'trash' } : m))
    setSelectedId(null)
  }

  function switchFolder(id) {
    setFolder(id)
    setSelectedId(null)
    if (id === 'inbox') setTab('primary')
  }

  /* ── Tab counts ── */
 function tabCount(tabId) {
  return mails.filter(m =>
    m.folder === 'inbox' &&
    m.tab === tabId &&
    !m.read
  ).length || null
}

  return (
    <div className="mail-root">

      {/* ══ TOP BAR ══ */}
      <div className="mail-topbar">
        <div className="mail-topbar-left">
          <button className="mail-menu-btn" onClick={() => setSidebarOpen(s => !s)}>
            <MenuIcon />
          </button>
          <div className="mail-brand">
            <span className="mail-brand-icon">✉</span>
            <span className="mail-brand-name">OneMail</span>
          </div>
        </div>

        <div className="mail-search-wrap">
          <div className="mail-search-box">
            <SearchIcon />
            <input
              className="mail-search-input"
              placeholder="Поиск в почте"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="mail-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        <div className="mail-topbar-right">
          <button className="mail-topbar-btn" title="Настройки"><SettingsIcon /></button>
          <button className="mail-topbar-btn" title="Развернуть"><ExpandIcon /></button>
          <div className="mail-user-avatar">
            <Avatar name="Детектив" size={32} />
          </div>
        </div>
      </div>

      <div className="mail-body">

        {/* ══ SIDEBAR ══ */}
        <aside className={`mail-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {/* Compose */}
          <div className="sidebar-compose-wrap">
            <button className="sidebar-compose-btn" onClick={() => setCompose(true)}>
              <PenIcon />
              {sidebarOpen && <span>Написать</span>}
            </button>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            {FOLDERS.map(f => {
              const isActive = folder === f.id
              const count = f.id === 'inbox' ? unreadCount : null
              return (
                <button
                  key={f.id}
                  className={`sidebar-nav-item ${isActive ? 'sidebar-nav-active' : ''}`}
                  onClick={() => switchFolder(f.id)}
                  title={!sidebarOpen ? f.label : ''}
                >
                  <span className="sidebar-nav-icon"><f.icon /></span>
                  {sidebarOpen && <span className="sidebar-nav-label">{f.label}</span>}
                  {sidebarOpen && count > 0 && (
                    <span className="sidebar-nav-count">{count}</span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* ══ MAIL LIST ══ */}
        <section className="mail-list-section">
          {/* Category tabs (inbox only) */}
          {folder === 'inbox' && (
            <div className="mail-tabs">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`mail-tab-btn ${tab === t.id ? 'mail-tab-active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <span className="mail-tab-icon">{t.icon}</span>
                  <span className="mail-tab-label">{t.label}</span>
                  {t.badge && <span className="mail-tab-badge">{t.badge}</span>}
                </button>
              ))}
            </div>
          )}

          {/* Mail rows */}
          <div className="mail-rows">
            {displayMails.length === 0 && (
              <div className="mail-rows-empty">
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📂</div>
                <p>Писем нет</p>
              </div>
            )}
            {displayMails.map(mail => (
              <MailRow
                key={mail.id}
                mail={mail}
                isSelected={selectedId === mail.id}
                onClick={() => selectMail(mail)}
                onStar={() => toggleStar(mail.id)}
              />
            ))}
          </div>
        </section>

        {/* ══ READING PANE ══ */}
        <section className="mail-reading-section">
      <ReadingPane
  mail={selectedMail}
  onStar={toggleStar}
  onDelete={deleteMail}
  onOpenFile={setOpenedFile}
/>
        </section>
      </div>
{compose && <ComposeModal onClose={() => setCompose(false)} />}
      {/* ══ COMPOSE ══ */}
{openedFile && createPortal(
  <div className="file-window">
    <div className="file-window-header">
      <span>{openedFile.name}</span>
      <button onClick={() => setOpenedFile(null)}>✕</button>
    </div>

    <div className="file-window-body">
      <img src={openedFile.url} alt="file" />
    </div>
  </div>,
  document.body
)}
    </div>
  )
}


/* ── Mail row ── */
function MailRow({ mail, isSelected, onClick, onStar }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`mail-row ${!mail.read ? 'mail-row-unread' : ''} ${isSelected ? 'mail-row-selected' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Unread dot */}
      <div className="mail-row-dot-col">
        {!mail.read && <div className="mail-row-dot" />}
      </div>

      {/* Avatar */}
      <div className="mail-row-avatar-col">
        <Avatar name={mail.from.name} emoji={mail.from.avatar} size={36} />
      </div>

      {/* Content */}
      <div className="mail-row-content">
        <div className="mail-row-top">
          <span className="mail-row-from">{mail.from.name}</span>
          <span className="mail-row-date">{mail.date}</span>
        </div>
        <div className="mail-row-subject">{mail.subject}</div>
        <div className="mail-row-preview">{mail.preview}</div>
        {mail.attachments?.length > 0 && (
          <span className="mail-row-attach"><AttachIcon /> {mail.attachments.length}</span>
        )}
      </div>

      {/* Star */}
      <button
        className={`mail-row-star ${mail.starred ? 'mail-row-star-on' : ''}`}
        onClick={e => { e.stopPropagation(); onStar() }}
        title="Пометить"
      >★</button>
    </div>
  )
}
