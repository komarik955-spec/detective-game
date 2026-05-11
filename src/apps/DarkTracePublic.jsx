import React, { useState } from 'react'
import './DarkTracePublic.css'

export default function DarkTracePublic() {
  const [showLogin, setShowLogin] = useState(false)

  // Editable data arrays
  const navigation = [
    { name: 'Услуги', href: '#services' },
    { name: 'Кейсы', href: '#cases' },
    { name: 'О нас', href: '#about' },
    { name: 'Отзывы', href: '#testimonials' },
    { name: 'Контакты', href: '#contact' }
  ]

  const heroData = {
    title: 'DARK TRACE',
    subtitle: 'Элитное детективное агентство',
    description: 'Конфиденциальные расследования. Безупречная репутация. Результаты, которые говорят сами за себя.',
    ctaPrimary: 'Начать расследование',
    ctaSecondary: 'Войти в систему'
  }

  const services = [
    {
      icon: '🔍',
      title: 'Частные расследования',
      description: 'Деликатное решение личных вопросов с полной конфиденциальностью'
    },
    {
      icon: '💼',
      title: 'Корпоративная безопасность',
      description: 'Защита бизнес-интересов и коммерческой тайны'
    },
    {
      icon: '🕵️',
      title: 'Поиск пропавших лиц',
      description: 'Профессиональный поиск и розыск людей по всей стране'
    },
    {
      icon: '📊',
      title: 'Финансовые расследования',
      description: 'Выявление мошенничества и финансовых преступлений'
    }
  ]

  const cases = [
    {
      id: 'DT-2024-001',
      title: 'Дело о пропавшем наследнике',
      description: 'Успешное розыскание наследника крупной корпорации после 5 лет поисков',
      outcome: 'Найден за 72 часа',
      category: 'Поиск лиц'
    },
    {
      id: 'DT-2024-002',
      title: 'Корпоративный шпионаж',
      description: 'Выявление и пресечение утечки конфиденциальной информации в IT-компании',
      outcome: 'Преступники задержаны',
      category: 'Безопасность'
    },
    {
      id: 'DT-2024-003',
      title: 'Страховое мошенничество',
      description: 'Доказательство фиктивного страхового случая на сумму 2.5 млн рублей',
      outcome: 'Дело выиграно',
      category: 'Финансы'
    }
  ]

  const testimonials = [
    {
      name: 'Александр К.',
      role: 'CEO, Технологическая компания',
      content: 'Профессионализм высочайшего уровня. Dark Trace решили проблему, с которой не справились ни полиция, ни другие агентства.',
      rating: 5
    },
    {
      name: 'Елена М.',
      role: 'Частный клиент',
      content: 'Благодарю за деликатность и внимание к деталям. Помогли найти пропавшего брата, когда уже потеряли надежду.',
      rating: 5
    },
    {
      name: 'Михаил В.',
      role: 'Управляющий партнер, Юридическая фирма',
      content: 'Надежный партнер для самых сложных дел. Всегда на связи, всегда результат.',
      rating: 5
    }
  ]

  const contact = {
    address: 'г. Ривертон, ул. Теневая, 42',
    phone: '+7 (495) 123-45-67',
    email: 'contact@darktrace.agency',
    hours: 'Пн-Пт: 9:00-21:00, Сб: 10:00-18:00'
  }

  const handleLoginClick = () => {
    setShowLogin(true)
  }

  const renderStars = (rating) => {
    return Array(rating).fill('⭐').join('')
  }

  if (showLogin) {
    // Import and render the internal portal
    const DarkTraceSite = require('./DarkTraceSite').default
    return <DarkTraceSite />
  }

  return (
    <div className="dark-trace-public">
      {/* Hero Section with Integrated Navigation */}
      <section className="hero-section">
        {/* Integrated Navigation */}
        <nav className="hero-nav">
          <div className="nav-container">
            <div className="nav-brand">
              <div className="brand-icon">🔍</div>
              <div className="brand-text">DARK TRACE</div>
            </div>
            <div className="nav-menu">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="nav-link">
                  {item.name}
                </a>
              ))}
            </div>
            <div className="nav-actions">
              <button className="login-btn" onClick={handleLoginClick}>
                Вход в личный кабинет
              </button>
            </div>
          </div>
        </nav>
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-atmosphere"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-cinematic">
                <div className="hero-tagline">ПРАВДА ГДЕ-ТО РЯДОМ.</div>
                <h1 className="hero-headline">МЫ НАХОДИМ ЕЁ.</h1>
                <div className="hero-divider"></div>
                <p className="hero-description">
                  Частное детективное агентство Dark Trace — профессиональные расследования, конфиденциальность и результат.
                </p>
                <div className="hero-actions-row">
                  <button className="hero-cta-cinematic" onClick={handleLoginClick}>
                    ОСТАВИТЬ ЗАЯВКУ
                  </button>
                  <div className="hero-badge">
                    <div className="badge-icon">🔒</div>
                    <div className="badge-content">
                      <span className="badge-text">ПОЛНАЯ</span>
                      <span className="badge-text">КОНФИДЕНЦИАЛЬНОСТЬ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hero-right">
              {/* Empty space for cinematic composition */}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Наши услуги</h2>
            <p className="section-subtitle">Комплексные решения для самых сложных задач</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-cta">
                  <button className="service-btn">Подробнее</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cases Section */}
      <section id="cases" className="featured-cases-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Избранные дела</h2>
            <p className="section-subtitle">Истории успеха, которые мы можем рассказать</p>
          </div>
          
          <div className="cases-showcase">
            {cases.slice(0, 2).map((case_, index) => (
              <div key={index} className="featured-case">
                <div className="case-visual">
                  <div className="case-number">{case_.id}</div>
                  <div className="case-category-badge">{case_.category}</div>
                </div>
                <div className="case-content">
                  <h3 className="case-title">{case_.title}</h3>
                  <p className="case-description">{case_.description}</p>
                  <div className="case-outcome">
                    <span className="outcome-label">Результат:</span>
                    <span className="outcome-text">{case_.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="cases-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Решенные дела</h2>
            <p className="section-subtitle">Истории успеха, которые мы можем рассказать</p>
          </div>
          
          <div className="cases-grid">
            {cases.map((case_, index) => (
              <div key={index} className="case-card">
                <div className="case-header">
                  <span className="case-id">{case_.id}</span>
                  <span className="case-category">{case_.category}</span>
                </div>
                <h3 className="case-title">{case_.title}</h3>
                <p className="case-description">{case_.description}</p>
                <div className="case-outcome">
                  <span className="outcome-label">Результат:</span>
                  <span className="outcome-text">{case_.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Отзывы клиентов</h2>
            <p className="section-subtitle">Что говорят о нас те, кому мы помогли</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <span className="author-name">{testimonial.name}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Свяжитесь с нами</h2>
            <p className="section-subtitle">Конфиденциальная консультация в течение 24 часов</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span className="contact-text">{contact.address}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-text">{contact.phone}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span className="contact-text">{contact.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕐</span>
                <span className="contact-text">{contact.hours}</span>
              </div>
            </div>
            
            <div className="contact-form">
              <form className="form">
                <div className="form-group">
                  <input type="text" placeholder="Ваше имя" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Телефон" className="form-input" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Опишите вашу ситуацию" className="form-textarea" rows="4"></textarea>
                </div>
                <button type="submit" className="form-submit">Отправить запрос</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-icon">🔍</span>
            <span className="brand-text">DARK TRACE</span>
          </div>
          <div className="footer-info">
            <p>© 2024 Dark Trace. Все права защищены.</p>
            <p>Лицензия на детективную деятельность №123456</p>
          </div>
          <div className="footer-disclaimer">
            <p>Полная конфиденциальность гарантируется.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
