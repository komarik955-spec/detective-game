import { useState, useContext, useEffect } from 'react'







import MailApp from '../apps/MailApp'

import DarkTraceSite from '../apps/DarkTraceSite'

import DarkTracePublic from '../apps/DarkTracePublic'

import PharmaNet from '../apps/PharmaNet'

import NewsPortal from '../apps/NewsPortal'

import RivertonInsurance from '../apps/RivertonInsurance'

import RivertonTelecom from '../apps/RivertonTelecom'

import EktsPro from '../apps/EktsPro'

import { SecondMailContext } from '../components/Desktop'

import ForensicCenterPage from '../pages/ForensicCenterPage'









let nextId = 2















export default function Browser({ onSecondMailArrived, playerData }) {







  // tabs - вкладки браузера. Внутри вкладки page решает, что показывать: home или mail.







  const [loading, setLoading] = useState(false)

  const [oneMailUnreadBadge, setOneMailUnreadBadge] = useState(0)

  const [telecomState, setTelecomState] = useState({})



  const handleSecondMailArrived = useContext(SecondMailContext)



  useEffect(() => {

    const syncUnread = e => {

      const count = e?.detail?.count

      if (typeof count === 'number') setOneMailUnreadBadge(count)

    }

    window.addEventListener('mailApp_unread_count', syncUnread)

    return () => window.removeEventListener('mailApp_unread_count', syncUnread)

  }, [])







  const [tabs, setTabs] = useState([







    { id: 1, title: 'New tab', url: '', page: 'home', loading: false }







  ])



  useEffect(() => {

    const activeTab = tabs.find(t => t.active)

    if (activeTab && activeTab.page === 'riverton-telecom') {

      localStorage.setItem('dt_visited_telecom', 'true')

    }

  }, [tabs])







  const [activeId, setActiveId] = useState(1)















  











  const activeTab = tabs.find(t => t.id === activeId)















  function newTab() {







    const id = nextId++







    const newTab = { id, title: 'New tab', url: '', page: 'home', loading: false }







    setTabs(prevTabs => [...prevTabs, newTab])







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















  function openDarkTraceLogin() {







    updateTab(activeId, {







      page: 'darktrace',







      url: 'https://darktrace.agency/login',







      title: 'DARK TRACE',







      darkTraceState: {







        currentPage: 'login',







        isLoggedIn: false,







        userLevel: 'guest'







      }







    })







  }















  function navigateInCurrentTab(value) {







    updateTab(activeId, { loading: true })















    setLoading(true)















    // Фейковая загрузка страницы, чтобы браузер ощущался как настоящий.







    setTimeout(() => {
      const v = String(value || '').toLowerCase()







      if (v.includes('ekc-pro') || v.includes('экц') || v.includes('forensic-lab') || v.includes('forensic')) {
        updateTab(activeId, {
          page: 'forensic-lab',
          url: 'https://ekc-pro.lab',
          title: 'ЭКЦ-ПРО',
          loading: false
        })
      } else if (value.includes('onemail')) {







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







      } else if (value.includes('darktrace.agency/login')) {







        updateTab(activeId, {







          page: 'darktrace',







          url: 'https://darktrace.agency/login',







          title: 'DARK TRACE',







          loading: false,







          darkTraceState: {







            currentPage: 'login',







            isLoggedIn: false,







            userLevel: 'guest'







          }







        })







      } else if (value.includes('darktrace.agency/dashboard')) {







        updateTab(activeId, {







          page: 'darktrace',







          url: 'https://darktrace.agency/dashboard',







          title: 'DARK TRACE',







          loading: false,







          darkTraceState: {







            currentPage: 'dashboard',







            isLoggedIn: false,







            userLevel: 'guest'







          }







        })







      } else if (value.includes('darktrace') && !value.includes('agency')) {







        updateTab(activeId, {







          page: 'darktrace',







          url: 'https://darktrace.agency',







          title: 'DARK TRACE',







          loading: false,







          darkTraceState: {







            currentPage: 'login',







            isLoggedIn: false,







            userLevel: 'guest'







          }







        })







      } else if (value.includes('news')) {

        updateTab(activeId, {

          page: 'news',

          url: 'https://news.darktrace.agency',

          title: 'NEWS',

          loading: false

        })

      } else if (value.includes('pharmanet.com') || value.includes('pharma')) {

        updateTab(activeId, {

          page: 'pharma',

          url: 'https://pharmanet.com',

          title: 'PharmaNet Online',

          loading: false

        })

      } else if (value.includes('riverton-insurance') || value.includes('rivertoninsurance')) {

        updateTab(activeId, {

          page: 'riverton',

          url: 'https://www.riverton-insurance.com',

          title: 'Riverton Insurance',

          loading: false

        })

      } else if (value.includes('riverton-telecom') || value.includes('telecom.riverton') || value.includes('rivertontelecom')) {

        updateTab(activeId, {

          page: 'riverton-telecom',

          url: 'https://www.riverton-telecom.com',

          title: 'Riverton Telecom',

          loading: false

        })

      } else if (value.includes('ekts-pro') || value.includes('ektspro') || value.includes('эцц-про') || value.includes('эццпро')) {

        updateTab(activeId, {

          page: 'ekts-pro',

          url: 'https://www.ekts-pro.ru',

          title: 'ЭКЦ-ПРО',

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















  function navigateInNewTab(value) {







    const id = nextId++







    let newTabConfig = {







      id,







      title: 'New tab',







      url: '',







      page: 'home',







      loading: false







    }















    const v = String(value || '').toLowerCase()

    if (v.includes('ekc-pro') || v.includes('экц') || v.includes('forensic-lab') || v.includes('forensic')) {
      newTabConfig = {
        id,
        title: 'ЭКЦ-ПРО',
        url: 'https://ekc-pro.lab',
        page: 'forensic-lab',
        loading: false
      }
    } else if (value.includes('onemail')) {







      newTabConfig = {







        id,







        title: 'OneMail',







        url: 'https://onemail.darktrace.agency/inbox',







        page: 'mail',







        loading: false







      }







    } else if (value.includes('agency.darktrace') || value.includes('darktrace.agency/public')) {







      newTabConfig = {







        id,







        title: 'Dark Trace Agency',







        url: 'https://agency.darktrace',







        page: 'darktrace-public',







        loading: false







      }







    } else if (value.includes('darktrace')) {







      newTabConfig = {







        id,







        title: 'DARK TRACE',







        url: 'https://darktrace.agency/login',







        page: 'darktrace',







        loading: false,







        darkTraceState: {







          currentPage: 'login',







          isLoggedIn: false,







          userLevel: 'guest'







        }







      }







    } else if (value.includes('news')) {

      newTabConfig = {

        id,

        title: 'NEWS',

        url: 'https://news.darktrace.agency',

        page: 'news',

        loading: false

      }

    } else if (value.includes('pharmanet.com') || value.includes('pharma')) {

      newTabConfig = {

        id,

        title: 'PharmaNet Online',

        url: 'https://pharmanet.com',

        page: 'pharma',

        loading: false

      }

    } else if (value.includes('riverton-insurance') || value.includes('rivertoninsurance')) {

      newTabConfig = {

        id,

        title: 'Riverton Insurance',

        url: 'https://www.riverton-insurance.com',

        page: 'riverton',

        loading: false

      }

    } else if (value.includes('riverton-telecom') || value.includes('telecom.riverton') || value.includes('rivertontelecom')) {

      newTabConfig = {

        id,

        title: 'Riverton Telecom',

        url: 'https://www.riverton-telecom.com',

        page: 'riverton-telecom',

        loading: false

      }

    } else if (value.includes('ekts-pro') || value.includes('ektspro') || value.includes('эцц-про') || value.includes('эццпро')) {

      newTabConfig = {

        id,

        title: 'ЭКЦ-ПРО',

        url: 'https://www.ekts-pro.ru',

        page: 'ekts-pro',

        loading: false

      }

    }















    setTabs([...tabs, newTabConfig])







    setActiveId(id)







  }















  function navigate(value) {







    navigateInCurrentTab(value)







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







        {activeTab && activeTab.page === 'home' && (

          <Home navigateInNewTab={navigateInNewTab} oneMailUnreadBadge={oneMailUnreadBadge} />

        )}







        {activeTab && activeTab.page === 'mail' && <MailApp onSecondMailArrived={handleSecondMailArrived} playerData={playerData} />}







        {activeTab && activeTab.page === 'darktrace' && (



          <DarkTraceSite 



            darkTraceState={activeTab.darkTraceState} 



            onNavigate={(page, stateUpdates) => {



              updateTab(activeId, { 



                darkTraceState: {



                  ...activeTab.darkTraceState,



                  currentPage: page,



                  ...(stateUpdates || {})



                }



              })



            }} 



            playerData={playerData}



          />



        )}







        {activeTab && activeTab.page === 'darktrace-public' && <DarkTracePublic onLogin={openDarkTraceLogin} />}

        {activeTab && activeTab.page === 'pharma' && <PharmaNet />}

        {activeTab && activeTab.page === 'riverton' && <RivertonInsurance />}

        {activeTab && activeTab.page === 'forensic-lab' && <ForensicCenterPage embedded />}

        {activeTab && activeTab.page === 'riverton-telecom' && (

          <RivertonTelecom

            initialState={telecomState}

            onStateChange={setTelecomState}

          />

        )}

        {activeTab && activeTab.page === 'news' && (

          <NewsPortal

            onNavigateToDarkTrace={() => {

              updateTab(activeId, {

                page: 'darktrace',

                url: 'https://darktrace.agency/login',

                title: 'DARK TRACE',

                loading: false,

                darkTraceState: {

                  currentPage: 'login',

                  isLoggedIn: false,

                  userLevel: 'guest'

                }

              })

            }}

            onNavigateToRivertonInsurance={() => {

              updateTab(activeId, {

                page: 'riverton',

                url: 'https://www.riverton-insurance.com',

                title: 'Riverton Insurance',

                loading: false

              })

            }}

          />

        )}

        {activeTab && activeTab.page === 'ekts-pro' && <EktsPro />}

      </div>









    </div>







  )







}















/* HOME */







function Home({ navigateInNewTab, oneMailUnreadBadge = 0 }) {







  function openMailInNewTab() {







    navigateInNewTab('onemail')







  }















  function openDarkTraceInNewTab() {







    navigateInNewTab('agency.darktrace')







  }















  function openNewsInNewTab() {







    navigateInNewTab('news')







  }



  function openRivertonTelecomInNewTab() {







    navigateInNewTab('riverton-telecom')







  }

  function openEkcProInNewTab() {
    navigateInNewTab('ekts-pro')
  }















  return (







    <div className="bhrome-home">















      <div className="bhrome-content">















        <div className="bhrome-logo">Googel</div>















        <input







          className="bhrome-search"







          placeholder="Search in Googel"







        />















        <div className="bhrome-sites">







          <div className="site" onClick={openMailInNewTab} title="OneMail" aria-label="OneMail">

            <div className="site-icon-wrap">

              <div className="site-icon" aria-hidden="true">✉</div>

              {oneMailUnreadBadge > 0 && (

                <span className="site-mail-badge" aria-label={`Непрочитанных: ${oneMailUnreadBadge}`}>

                  {oneMailUnreadBadge > 9 ? '9+' : oneMailUnreadBadge}

                </span>

              )}

            </div>

            <div className="site-label">OneMail</div>

          </div>















          <div className="site" onClick={openDarkTraceInNewTab} title="DARK TRACE" aria-label="DARK TRACE">

            <div className="site-icon" aria-hidden="true">🕵</div>

            <div className="site-label">Dark Trace</div>

          </div>















          <div className="site" onClick={openNewsInNewTab} title="News" aria-label="News">

            <div className="site-icon" aria-hidden="true">📰</div>

            <div className="site-label">News</div>

          </div>



          <div className="site" onClick={openRivertonTelecomInNewTab} title="Riverton Telecom" aria-label="Riverton Telecom">

            <div className="site-icon" aria-hidden="true">📡</div>

            <div className="site-label">Riverton Telecom</div>

          </div>

          <div className="site" onClick={openEkcProInNewTab} title="ЭКЦ-ПРО" aria-label="ЭКЦ-ПРО">

            <div className="site-icon" aria-hidden="true">🛡️</div>

            <div className="site-label">ЭКЦ-ПРО</div>

          </div>







        </div>















      </div>















    </div>







  )







}







