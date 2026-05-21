import React, { useState } from 'react'
import './RivertonInsurance.css'
import {
  validateInsuranceForm,
  completeRivertonInsuranceRequest,
  isRivertonInsuranceComplete,
} from '../utils/rivertonInsuranceQuest'

const AUTH_ERROR =
  'Ошибка авторизации заявителя. Доступ к архиву отклонен. Проверьте правильность введенных данных и код лицензии'

const SUCCESS_MESSAGE =
  'Запрос успешно обработан. Личность идентифицирована. Зашифрованные копии страховых полисов по программе „Семейный Щит 1+1“ успешно отправлены на верифицированный электронный адрес вашего агентства'

const HERO_BG_IMAGE = `${import.meta.env.BASE_URL}assets/images/riverton_night_town.png`

const PRODUCTS = [
  {
    id: 'auto',
    title: 'Страхование автотранспорта',
    desc: 'КАСКО и ОСАГО для частных и корпоративных парков. Круглосуточная эвакуация по округу Блэкуотер.',
    icon: 'auto',
  },
  {
    id: 'property',
    title: 'Защита недвижимости и имущества',
    desc: 'Жилые объекты, коммерческая недвижимость и арт-студии. Оценка рисков по стандартам WA-INS.',
    icon: 'property',
  },
  {
    id: 'business',
    title: 'Корпоративное страхование бизнеса',
    desc: 'Ответственность директоров, перерывы в деятельности и защита активов малого и среднего бизнеса.',
    icon: 'business',
  },
  {
    id: 'life',
    title: 'Программы страхования жизни и здоровья',
    desc: 'Долгосрочные полисы, накопительные программы и семейное покрытие.',
    hint: 'Включая семейные пакеты синхронизированного страхования «Семейный Щит 1+1»',
    icon: 'life',
  },
]

function ProductIcon({ type }) {
  const icons = {
    auto: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2m14-2v2M7 13h10" />
      </svg>
    ),
    property: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
      </svg>
    ),
    business: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 21h18M6 21V7l6-4 6 4v14M9 11h2v4H9v-4zm4 0h2v4h-2v-4z" />
      </svg>
    ),
    life: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z" />
        <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
  }
  return <span className="ri-product-icon">{icons[type]}</span>
}

export default function RivertonInsurance() {
  const [view, setView] = useState('home')
  const [organization, setOrganization] = useState('')
  const [insuredName, setInsuredName] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(() => isRivertonInsuranceComplete())
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(() => isRivertonInsuranceComplete())

  const handleSubmit = e => {
    e.preventDefault()
    if (submitted || loading) return

    setError('')

    if (!validateInsuranceForm({ organization, insuredName, authCode })) {
      setError(AUTH_ERROR)
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setSuccess(true)
      if (!isRivertonInsuranceComplete()) {
        completeRivertonInsuranceRequest()
      }
    }, 2200)
  }

  return (
    <div className="riverton-site">
      <header className="ri-header">
        <div className="ri-header-inner">
          <div className="ri-logo-block">
            <div className="ri-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 14h16M8 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ri-logo-text">
              <span className="ri-logo-name">Riverton Insurance Group</span>
              <span className="ri-logo-meta">Member FDIC Equivalent · WA License INS-0042</span>
            </div>
          </div>
          <nav className="ri-nav" aria-label="Основное меню">
            <button type="button" className="ri-nav-link">Частным клиентам</button>
            <button type="button" className="ri-nav-link">Бизнесу</button>
            <button type="button" className="ri-nav-link">О компании</button>
            <button type="button" className="ri-nav-link ri-nav-link--cta">Связаться с агентом</button>
          </nav>
        </div>
      </header>

      <main className={`ri-main ${view === 'portal' ? 'ri-main--portal' : ''}`}>
        {view === 'home' ? (
          <>
            <section
              className="ri-hero"
              aria-labelledby="ri-hero-title"
              style={{ '--ri-hero-bg-image': `url("${HERO_BG_IMAGE}")` }}
            >
              <div className="ri-hero-bg" aria-hidden="true" />
              <div className="ri-hero-inner">
                <p className="ri-hero-eyebrow">С 1924 года в Ривертоне и округе Блэкуотер</p>
                <h1 id="ri-hero-title" className="ri-hero-title">
                  Riverton Insurance Group.
                  <span className="ri-hero-title-accent">
                    {' '}
                    Надежная защита вашего будущего с 1924 года
                  </span>
                </h1>
                <p className="ri-hero-subtitle">
                  Индивидуальные программы страхования жизни, имущества и бизнеса в окружении
                  Блэкуотер
                </p>
                <button type="button" className="ri-hero-cta">
                  Рассчитать полис
                </button>
              </div>
            </section>

            <section className="ri-products" aria-labelledby="ri-products-heading">
              <div className="ri-section-head">
                <h2 id="ri-products-heading">Направления страхования</h2>
                <p>Комплексные решения для частных лиц и организаций</p>
              </div>
              <div className="ri-products-grid">
                {PRODUCTS.map(item => (
                  <article key={item.id} className="ri-product-card">
                    <ProductIcon type={item.icon} />
                    <h3>{item.title}</h3>
                    <p className="ri-product-desc">{item.desc}</p>
                    {item.hint && <p className="ri-product-hint">{item.hint}</p>}
                    <span className="ri-product-more">Подробнее</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="ri-trust" aria-label="Показатели компании">
              <div className="ri-trust-item">
                <span className="ri-trust-value">101</span>
                <span className="ri-trust-label">год на рынке</span>
              </div>
              <div className="ri-trust-divider" aria-hidden="true" />
              <div className="ri-trust-item">
                <span className="ri-trust-value">A+</span>
                <span className="ri-trust-label">рейтинг устойчивости</span>
              </div>
              <div className="ri-trust-divider" aria-hidden="true" />
              <div className="ri-trust-item">
                <span className="ri-trust-value">24/7</span>
                <span className="ri-trust-label">линия урегулирования</span>
              </div>
            </section>
          </>
        ) : (
          <div className="ri-form-page">
            <button type="button" className="ri-form-back" onClick={() => setView('home')}>
              ← На главную
            </button>
            <h2 className="ri-form-title">Запрос архивных данных</h2>
            <p className="ri-form-subtitle">
              Официальный доступ к зашифрованным копиям договоров. Требуется код авторизации
              партнёрского агентства.
            </p>

            <form className="ri-form" onSubmit={handleSubmit}>
              <div className="ri-field">
                <label htmlFor="ri-org">Организация-заявитель</label>
                <select
                  id="ri-org"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  required
                  disabled={submitted}
                >
                  <option value="">— Выберите организацию —</option>
                  <option value="police">Департамент полиции Ривертона</option>
                  <option value="city_hall">Мэрия города</option>
                  <option value="dark_trace">Детективное агентство Dark Trace</option>
                </select>
              </div>

              <div className="ri-field">
                <label htmlFor="ri-insured">Объект проверки (Имя застрахованного)</label>
                <input
                  id="ri-insured"
                  type="text"
                  value={insuredName}
                  onChange={e => setInsuredName(e.target.value)}
                  placeholder="Фамилия и имя"
                  required
                  disabled={submitted}
                  autoComplete="off"
                />
              </div>

              <div className="ri-field">
                <label htmlFor="ri-code">Код авторизации агентства</label>
                <input
                  id="ri-code"
                  type="text"
                  value={authCode}
                  onChange={e => setAuthCode(e.target.value)}
                  placeholder="DT-_____"
                  required
                  disabled={submitted}
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="ri-error" role="alert">
                  {error}
                </div>
              )}

              {loading && (
                <div className="ri-loading" aria-live="polite">
                  <div className="ri-loading-bar" />
                  <span>Проверка прав доступа…</span>
                </div>
              )}

              {success && !loading && (
                <div className="ri-success" role="status">
                  {SUCCESS_MESSAGE}
                </div>
              )}

              <button type="submit" className="ri-submit" disabled={submitted || loading}>
                ОТПРАВИТЬ ЗАПРОС
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="ri-footer">
        <div className="ri-footer-inner">
          <div className="ri-footer-legal">
            <span>© 2025 Riverton Insurance Group</span>
            <span className="ri-footer-sep">·</span>
            <span>Лицензия WA-INS-0042</span>
            <span className="ri-footer-sep">·</span>
            <span>Ривертон, штат Вашингтон</span>
            <span className="ri-footer-sep">·</span>
            <button
              type="button"
              className="ri-footer-portal-link"
              onClick={() => setView('portal')}
            >
              Прием официальных запросов ведомств
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
