import { useState, useContext } from 'react'
import MailApp from '../apps/MailApp'
import DarkTraceSite from '../apps/DarkTraceSite'
import DarkTracePublic from '../apps/DarkTracePublic'
import { SecondMailContext } from '../components/Desktop'
let nextId = 2

export default function Browser() {
  // tabs - вкладки браузера. Внутри вкладки page решает, что показывать: home или mail.
  const [loading, setLoading] = useState(false)
  const onSecondMailArrived = useContext(SecondMailContext)
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New tab', url: '', page: 'home', loading: false },
  ])
  const [activeId, setActiveId] = useState(1)

  const activeTab = tabs.find(t => t.id === activeId)

  function newTab() {
    const id = nextId++
    setTabs([...tabs, { id, title: 'New tab', url: '', page: 'home', loading: false }])
    setActiveId(id)
  }

  function closeTab(id) {
    const filtered = tabs.filter(t => t.id !== id)
    setTabs(filtered)
    if (id === activeId && filtered.length) setActiveId(filtered[0].id)
  }

  function updateTab(id, data) {
    setTabs(tabs.map(t => t.id === id ? { ...t, ...data } : t))
  }

  function navigate(value) {
    updateTab(activeId, { loading: true })

    setLoading(true)

    // Фейковая загрузка страницы, чтобы браузер ощущался как настоящий.
    setTimeout(() => {
      if (value.includes('onemail')) {
        updateTab(activeId, {
          page: 'mail',
          url: 'https://onemail.darktrace.agency/inbox',
          title: 'OneMail',
          loading: false
        })
      } else if (value.includes('agency.darktrace') || value.includes('darktrace.agency/public')) {
        updateTab(activeId, {
          page: 'darktrace-public',
          url: 'https://agency.darktrace',
          title: 'Dark Trace Agency',
          loading: false
        })
      } else if (value.includes('darktrace') && !value.includes('agency')) {
        updateTab(activeId, {
          page: 'darktrace',
          url: 'https://darktrace.agency',
          title: 'DARK TRACE',
          loading: false
        })
      } else {
        updateTab(activeId, {
          page: 'home',
          url: value,
          title: 'New tab',
          loading: false
        })
      }

      setLoading(false)
    }, 900)
  }

  return (
    <div className="bhrome">
      {loading && <div className="bhrome-loader" />}
  

      {/* TABS */}
    <div className="bhrome-tabs">
  {tabs.map(tab => (
    <div
      key={tab.id}
      className={`bhrome-tab ${tab.id === activeId ? 'active' : ''}`}
      onClick={() => setActiveId(tab.id)}
    >
      <span className="tab-title">{tab.title}</span>

      <span
        className="tab-close"
        onClick={(e) => {
          e.stopPropagation()
          closeTab(tab.id)
        }}
      >
        x
      </span>
          </div>
        ))}

        <div className="tab-add" onClick={newTab}>+</div>
      </div>

      {/* BAR */}
      <div className="bhrome-bar">
        <div className="nav">&lt;</div>
        <div className="nav">&gt;</div>
        <div className="nav">R</div>

    <input
  className="bhrome-address"
  value={activeTab?.url || ''}
  placeholder="Search or enter address"
  onChange={(e) => updateTab(activeId, { url: e.target.value })}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      navigate(e.target.value)
    }
  }}
/>

<div className="bhrome-menu">в‹®</div>
</div>

{/* LOADING */}
{activeTab?.loading && <div className="bhrome-loader" />}


      {/* PAGE */}
      <div className="bhrome-page">
        {activeTab.page === 'home' && <Home onOpenMail={() => navigate('onemail')} onOpenDarkTrace={() => navigate('darktrace.agency')} navigate={navigate} />}
        {activeTab.page === 'mail' && <MailApp onSecondMailArrived={onSecondMailArrived} />}
        {activeTab.page === 'darktrace' && <DarkTraceSite />}
        {activeTab.page === 'darktrace-public' && <DarkTracePublic />}
      </div>
    </div>
  )
}

/* HOME */
function Home({ onOpenMail, onOpenDarkTrace, navigate }) {
  return (
    <div className="bhrome-home">

      <div className="bhrome-content">

        <div className="bhrome-logo">Googel</div>

        <input
          className="bhrome-search"
          placeholder="Search in Googel"
        />

        <div className="bhrome-sites">
          <div className="site" onClick={onOpenMail}>
            MAIL <span>OneMail</span>
          </div>

          <div className="site" onClick={onOpenDarkTrace}>
            DARK TRACE <span>Investigation Agency</span>
          </div>

          <div className="site" onClick={() => navigate('agency.darktrace')}>
            DARK TRACE <span>Public Agency</span>
          </div>

          <div className="site">
            NEWS <span>News</span>
          </div>

          <div className="site">
            ARCH <span>Archive</span>
          </div>
        </div>

      </div>

    </div>
  )
}
