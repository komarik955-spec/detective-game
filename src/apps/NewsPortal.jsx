import React, { useState } from 'react'
import './NewsPortal.css'
import { horoscopeData } from '../constants/horoscopeData'

const NAV_PRIMARY = [
  'Происшествия',
  'Культура',
  'Город',
  'Экономика',
  'Общество',
  'Погода',
]

const NAV_SECONDARY = [
  'Лента',
  'Темы',
  'В фокусе',
  'Интервью',
  'Расследования',
  'Архив',
]

const NEWS_HERO_IMAGE = `${import.meta.env.BASE_URL}assets/news/selena_black_hero.jpg`

const IN_THIS_ISSUE = [
  { title: 'Трагедия в Старом Городе: Селена Блэк', section: 'Главное' },
  { title: 'Итоги фестиваля талантов в Ривертоне', section: 'Культура' },
  { title: 'Латте «Карамельный холст» в «Мечтателях»', section: 'Город' },
  { title: 'Реконструкция набережной под вопросом', section: 'Город' },
  { title: 'Туман на дорогах: предупреждение полиции', section: 'Безопасность' },
]

export default function NewsPortal({ onNavigateToDarkTrace }) {
  const [activeSign, setActiveSign] = useState('РАК')

  const activeHoro = horoscopeData.find(h => h.sign === activeSign)

  return (
    <div className="news-portal">
      <header className="news-masthead">
        <div className="news-alert-bar">
          <span className="news-alert-label">Срочно</span>
          <span className="news-alert-text">
            В Старом Городе найдена мёртвой художница Селена Блэк — следствие продолжается
          </span>
        </div>

        <div className="news-brand-row">
          <div className="news-brand-tools">
            <span className="news-tool-btn" aria-hidden="true">☰</span>
            <span className="news-tool-btn" aria-hidden="true">⌕</span>
          </div>
          <div className="news-logo">
            <h1 className="news-masthead-title">Riverton Chronicles</h1>
            <p className="news-tagline">городской новостной портал Ривертона</p>
          </div>
          <div className="news-brand-meta">
            <span className="news-edition">Выпуск № 142</span>
            <span className="news-current-date">23 июня 2025</span>
          </div>
        </div>

        <nav className="news-primary-nav" aria-label="Разделы">
          {NAV_PRIMARY.map(item => (
            <span key={item} className="news-nav-link">{item}</span>
          ))}
        </nav>

        <nav className="news-secondary-nav" aria-label="Рубрики">
          {NAV_SECONDARY.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span className="news-nav-divider" aria-hidden="true" />}
              <span className="news-nav-sublink">{item}</span>
            </React.Fragment>
          ))}
        </nav>
      </header>

      <div className="news-layout">
        <main className="news-main">
          <div className="news-feed-wrapper">
            <article className="news-featured">
              <div className="news-section-tag news-section-tag--main">Тема недели</div>
              <div className="news-featured-meta">
                <span className="news-category">Происшествия</span>
                <span className="news-meta-dot">·</span>
                <span className="news-rubric">В фокусе</span>
                <span className="news-meta-dot">·</span>
                <time className="news-article-date">22 июня 2025</time>
              </div>
              <h2 className="news-featured-title">
                Трагедия в Старом Городе: художница Селена Блэк найдена мёртвой
              </h2>

              <div className="news-hero">
                <img
                  className="news-hero-img"
                  src={NEWS_HERO_IMAGE}
                  alt="Арт-студия в Старом Городе — место происшествия"
                />
                <div className="news-hero-overlay">
                  <p className="news-hero-lead">
                    В арт-студии на ул. Старых Мастеров обнаружено тело 27-летней художницы.
                    Полиция рассматривает версию передозировки препаратом «Сертофин».
                  </p>
                  <span className="news-hero-credit">Фото: архив редакции / Старый Город</span>
                </div>
              </div>

              <div className="news-featured-content">
                <p className="news-lead">
                  РИВЕРТОН — 21 июня, около 19:45, в арт-студии на ул. Старых Мастеров обнаружено тело
                  известной художницы Селены Блэк. Тело нашли её жених Эван Андервуд и его мать
                  Розалия Андервуд, обеспокоенные длительным отсутствием связи с Селеной.
                </p>
                <p>
                  Полиция Ривертона сообщила, что на месте происшествия найдены пустые упаковки
                  из-под медицинского препарата «Сертофин». По предварительным данным, г-жа Блэк
                  принимала данный препарат по назначению лечащего врача в связи с затяжной
                  депрессией. Основная версия следствия на данный момент — самоубийство путём
                  умышленной передозировки. Признаков насильственной смерти или следов взлома при
                  первичном осмотре студии выявлено не было. Судебно-медицинские экспертизы
                  продолжаются.
                </p>
                <p>
                  Селена Блэк — яркая фигура в культурной жизни города, недавно получившая признание
                  на ежегодном «Фестивале Молодых Талантов Ривертона». В последнее время она активно
                  готовилась к своей первой персональной выставке. Редакция выражает глубокие
                  соболезнования близким и друзьям погибшей.
                </p>
              </div>
            </article>

            <section className="news-list-section">
              <h2 className="news-list-heading">Лента новостей</h2>
              <div className="news-list">
                <article className="news-card">
                  <div className="news-card-header">
                    <span className="news-card-category">Культура</span>
                    <time className="news-article-date">18 июня 2025</time>
                  </div>
                  <h3 className="news-card-title">
                    Искусство молодых: итоги фестиваля талантов в Ривертоне
                  </h3>
                  <p className="news-card-excerpt">
                    РИВЕРТОН — На прошлой неделе в Городском Выставочном Холле торжественно завершился
                    ежегодный «Фестиваль Молодых Талантов Ривертона», собравший сотни ценителей
                    современного искусства.
                  </p>
                  <p className="news-card-excerpt">
                    Специальным призом жюри «За новаторство и эмоциональную глубину» отмечена серия
                    новых работ художницы Селены Блэк. Среди гостей были галеристка Розалия
                    Андервуд и бывший партнёр Селены — Маркус Флинн, который, по словам очевидцев,
                    покинул зал до окончания официальной части.
                  </p>
                </article>

                <article className="news-card">
                  <div className="news-card-header">
                    <span className="news-card-category">Гастрономия</span>
                    <time className="news-article-date">22 июня 2025</time>
                  </div>
                  <h3 className="news-card-title">
                    Новинка в кофейне «Мечтатели»: авторский латте «Карамельный холст»
                  </h3>
                  <p className="news-card-excerpt">
                    РИВЕРТОН — Популярная городская кофейня «Мечтатели» представляет эксклюзивный
                    напиток июня — латте «Карамельный холст» с домашней карамелью и нотками морской
                    соли.
                  </p>
                  <p className="news-card-excerpt">
                    По словам шеф-бариста Алекса Чена, напиток создавался, чтобы согревать в туманные
                    дни и вдохновлять творческих людей города. Адрес: Площадь Искусств, д. 5.
                  </p>
                </article>

                <article className="news-card">
                  <div className="news-card-header">
                    <span className="news-card-category warning">Городская среда</span>
                    <time className="news-article-date">23 июня 2025</time>
                  </div>
                  <h3 className="news-card-title">
                    Реконструкция Старого Города остаётся под вопросом
                  </h3>
                  <p className="news-card-excerpt">
                    План мэрии по реконструкции исторической набережной вновь вызвал дебаты.
                    Архивариус Фредерик Хейл заявил: «Мы рискуем потерять душу Ривертона — некоторые
                    архивы и истории лучше бережно сохранить для потомков».
                  </p>
                </article>

                <article className="news-card">
                  <div className="news-card-header">
                    <span className="news-card-category danger">Безопасность</span>
                    <time className="news-article-date">23 июня 2025</time>
                  </div>
                  <h3 className="news-card-title">
                    Туман на дорогах: полиция предупреждает о росте числа ДТП
                  </h3>
                  <p className="news-card-excerpt">
                    Капитан Майкл Бронсон призвал водителей соблюдать дистанцию на трассах у моста
                    «Блэкуотер» и Ривертон-Хайвей. Многие жители помнят трагические аварии прошлых
                    лет.
                  </p>
                  <p className="news-card-excerpt news-card-excerpt--secondary">
                    <strong>В продолжение темы:</strong> «Ривертон Иншуранс» представила программу
                    «Семейный Щит 1+1» для пар, готовящихся к браку. Комментирует Артур Хендерсон.
                  </p>
                </article>
              </div>
            </section>
          </div>
        </main>

        <aside className="news-sidebar">
          <div className="news-widget news-edition-widget">
            <div className="edition-cover" aria-hidden="true">
              <span className="edition-cover-num">142</span>
            </div>
            <div className="edition-info">
              <span className="edition-label">Текущий выпуск</span>
              <span className="edition-title">Июнь 2025</span>
              <span className="edition-date">23 июня 2025</span>
              <button type="button" className="edition-download">Скачать PDF</button>
            </div>
          </div>

          <div className="news-widget news-toc-widget">
            <h3 className="widget-title">В номере</h3>
            <ul className="news-toc-list">
              {IN_THIS_ISSUE.map(item => (
                <li key={item.title} className="news-toc-item">
                  <span className="news-toc-section">{item.section}</span>
                  <a href="#!" className="news-toc-link" onClick={e => e.preventDefault()}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="news-widget weather-widget">
            <h3 className="widget-title">Погода в Ривертоне</h3>
            <div className="widget-date">23 июня 2025</div>
            <div className="weather-current">
              <div className="weather-icon">🌫️</div>
              <div>
                <div className="weather-temp">+12°C</div>
                <div className="weather-desc">Густой туман</div>
              </div>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Давление</span>
              <span className="detail-value">748 мм рт. ст.</span>
            </div>
            <div className="weather-forecast">
              <div className="forecast-item">
                <span className="forecast-time">Утро</span>
                <span className="forecast-desc">Туман, +10…+12°C</span>
              </div>
              <div className="forecast-item">
                <span className="forecast-time">День</span>
                <span className="forecast-desc">Облачно, +15…+17°C</span>
              </div>
              <div className="forecast-item">
                <span className="forecast-time">Вечер</span>
                <span className="forecast-desc">Морось, +12…+14°C</span>
              </div>
            </div>
          </div>

          <div className="news-widget horoscope-widget">
            <h3 className="widget-title">Гороскоп</h3>
            <div className="widget-subtitle">Звёзды над Ривертоном</div>
            <div className="horoscope-tabs">
              {horoscopeData.map(h => (
                <button
                  key={h.sign}
                  type="button"
                  className={`horoscope-tab ${activeSign === h.sign ? 'active' : ''}`}
                  onClick={() => setActiveSign(h.sign)}
                >
                  {h.sign}
                </button>
              ))}
            </div>
            {activeHoro && (
              <div className="horoscope-panel">
                <div className="horoscope-sign">{activeHoro.sign}</div>
                <div className="horoscope-dates">{activeHoro.dates}</div>
                <div className="horoscope-text">{activeHoro.text}</div>
              </div>
            )}
          </div>

          <div className="news-widget classifieds-widget">
            <h3 className="widget-title">Объявления</h3>
            <div className="widget-subtitle">Городская барахолка</div>
            <div className="classifieds-list">
              <div className="classified-item">
                <div className="classified-type">Барахолка</div>
                <div className="classified-text">
                  Срочно продам часы Breitling Navitimer. $3 500. Только наличные.
                </div>
                <div className="classified-contact">555-8-EVAN-26</div>
              </div>
              <div className="classified-item">
                <div className="classified-type">Работа</div>
                <div className="classified-text">
                  Требуется модель для портретов в стиле «ривертонский нуар». Переулок Гравёров, 8.
                </div>
              </div>
              <div className="classified-item">
                <div className="classified-type">Потери</div>
                <div className="classified-text">
                  Пропал кот «Тень» у набережной Блэкуотер. Вознаграждение гарантировано.
                </div>
                <div className="classified-contact">555-57678</div>
              </div>
            </div>

            <button
              type="button"
              className="dark-trace-banner"
              onClick={onNavigateToDarkTrace}
            >
              <span className="banner-label">Реклама</span>
              <span className="banner-title">Услуги детектива</span>
              <span className="banner-subtitle">Агентство Dark Trace</span>
              <span className="banner-cta">Перейти на сайт →</span>
            </button>
          </div>
        </aside>
      </div>

      <footer className="news-footer">
        <p>© 2025 Riverton Chronicles Digital · Городской новостной портал Ривертона</p>
        <p className="news-footer-note">Материалы могут содержать художественный вымысел.</p>
      </footer>
    </div>
  )
}
