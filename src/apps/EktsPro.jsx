import { useState } from 'react'
import './EktsPro.css'

export default function EktsPro() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [suspectValue, setSuspectValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null) // null, 'success', 'error'
  const [progress, setProgress] = useState(0)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Reset progress and result
    setProgress(0)
    setSubmitResult(null)
    setIsSubmitting(true)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          // After reaching 100%, evaluate result
            setTimeout(() => {
             if (suspectValue === 'selena_black') {
               setSubmitResult('success')
             } else {
               setSubmitResult('error')
             }
            setIsSubmitting(false)
          }, 200) // small delay after reaching 100%
          return 100
        }
        return newProgress
      })
    }, 150) // update every 150ms for about 1.5 seconds to 100%
  }

  return (
    <div className="ekts-pro">
      {/* Header */}
      <header className="ekts-header">
        <div className="ekts-header-container">
          <div className="ekts-logo">
            <span className="ekts-logo-icon">🛡️</span>
            <span className="ekts-logo-text">ЭКЦ-ПРО</span>
          </div>
          <nav className="ekts-nav">
            <a href="#" className="ekts-nav-link">Услуги</a>
            <a href="#" className="ekts-nav-link">Эксперты</a>
            <a href="#" className="ekts-nav-link">Контакты</a>
          </nav>
          <button className="ekts-cta-btn" onClick={openModal}>Заявка на экспертизу</button>
        </div>
      </header>

      {/* Hero */}
      <main className="ekts-main">
        <section className="ekts-hero">
          <div className="ekts-hero-overlay"></div>
          <div className="ekts-hero-glow"></div>
          <div className="ekts-hero-content">
            <h1 className="ekts-hero-title">
              Независимая экспертиза.<br />
              <span className="ekts-hero-highlight">Доказательства, которым доверяют.</span>
            </h1>
            <p className="ekts-hero-desc">
              Проводим судебные и внесудебные экспертизы цифровых данных, аудио, видео, документов и переписок.
            </p>
            <div className="ekts-hero-buttons">
              <button className="ekts-btn-primary" onClick={openModal}>Заказать экспертизу</button>
              <button className="ekts-btn-secondary">Скачать презентацию</button>
            </div>
          </div>
          <div className="ekts-hero-visual">
            <div className="ekts-visual-card">
              <div className="ekts-visual-glow"></div>
              <div className="ekts-visual-header">
                <div className="ekts-visual-icon">💾</div>
                <div className="ekts-visual-info">
                  <div className="ekts-visual-filename">REC_2025-04-18_19-32-11.wav</div>
                  <div className="ekts-visual-hash">SHA-256: 890a786...ed432</div>
                </div>
              </div>
              <div className="ekts-waveform">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="ekts-wave-bar" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }}></div>
                ))}
              </div>
              <div className="ekts-visual-metadata">
                <div className="ekts-metadata-item">
                  <div>Sample Rate</div>
                  <div className="ekts-metadata-value">48kHz</div>
                </div>
                <div className="ekts-metadata-item">
                  <div>Bit Depth</div>
                  <div className="ekts-metadata-value">24bit</div>
                </div>
                <div className="ekts-metadata-item">
                  <div>Duration</div>
                  <div className="ekts-metadata-value">03:42</div>
                </div>
                <div className="ekts-metadata-item">
                  <div>Channels</div>
                  <div className="ekts-metadata-value">Stereo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="ekts-stats">
          <div className="ekts-stat-item">
            <div className="ekts-stat-value">45+</div>
            <div className="ekts-stat-label">экспертов в штате</div>
          </div>
          <div className="ekts-stat-item">
            <div className="ekts-stat-value">12K+</div>
            <div className="ekts-stat-label">проведенных экспертиз</div>
          </div>
          <div className="ekts-stat-item">
            <div className="ekts-stat-value">98%</div>
            <div className="ekts-stat-label">принятых судом</div>
          </div>
          <div className="ekts-stat-item">
            <div className="ekts-stat-value">24/7</div>
            <div className="ekts-stat-label">поддержка клиентов</div>
          </div>
        </section>

        {/* Services */}
        <section className="ekts-services">
          <h2 className="ekts-section-title">Наши услуги</h2>
          <div className="ekts-services-grid">
            <div className="ekts-service-card">
              <div className="ekts-service-icon">🔍</div>
              <h3 className="ekts-service-title">Компьютерная экспертиза</h3>
              <p className="ekts-service-desc">Анализ цифровых данных, восстановление удаленной информации, исследование компьютерных систем.</p>
              <a href="#" className="ekts-service-link">Подробнее →</a>
            </div>
            <div className="ekts-service-card">
              <div className="ekts-service-icon">🎤</div>
              <h3 className="ekts-service-title">Фонографическая экспертиза</h3>
              <p className="ekts-service-desc">Исследование аудиозаписей, идентификация голоса, анализ цифровых звуковых файлов.</p>
              <a href="#" className="ekts-service-link">Подробнее →</a>
            </div>
            <div className="ekts-service-card">
              <div className="ekts-service-icon">📹</div>
              <h3 className="ekts-service-title">Видеотехническая экспертиза</h3>
              <p className="ekts-service-desc">Анализ видеозаписей, восстановление кадров, определение подлинности видеоматериалов.</p>
              <a href="#" className="ekts-service-link">Подробнее →</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="ekts-footer">
        <div className="ekts-footer-content">
          <div className="ekts-footer-logo">ЭКЦ-ПРО</div>
          <div className="ekts-footer-links">
            <a href="#" className="ekts-footer-link">Политика конфиденциальности</a>
            <a href="#" className="ekts-footer-link">Условия использования</a>
          </div>
          <div className="ekts-footer-copy">© 2025 ЭКЦ-ПРО. Все права защищены.</div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="ekts-modal-overlay" onClick={handleOverlayClick}>
          <div className="ekts-modal">
            <button className="ekts-modal-close" onClick={closeModal} aria-label="Закрыть">×</button>
            <h2 className="ekts-modal-title">Запрос на экспертизу</h2>
            <form className="ekts-modal-form" onSubmit={handleSubmit}>
              <div className="ekts-form-group">
                <label className="ekts-form-label">ОБЪЕКТ ДЛЯ АНАЛИЗА</label>
                <select className="ekts-form-input" id="object">
                  <option value="coffee_lid" selected>Кофейная крышка</option>
                  <option value="audio_record">Аудиозапись REC_2025-04-18</option>
                  <option value="fingerprint_card">Дактилокарта фигуранта</option>
                  <option value="flash_drive">USB-накопитель (поврежденный)</option>
                  <option value="document_scan">Скан документа (контракт №4)</option>
                </select>
              </div>
              <div className="ekts-form-group">
                <label className="ekts-form-label">АГЕНТСТВО</label>
                <input type="text" id="agency" className="ekts-form-input" placeholder="Dark Trace" />
              </div>
               <div className="ekts-form-group">
                 <label className="ekts-form-label">ПОДОЗРЕВАЕМЫЙ</label>
                 <select className="ekts-form-input" id="suspect" value={suspectValue} onChange={(e) => setSuspectValue(e.target.value)}>
                   <option value="" disabled selected>Выберите фигуранта...</option>
                   <option value="rosalia_underwood">Розалия Андервуд</option>
                   <option value="evan_underwood">Эван Андервуд</option>
                   <option value="marcus_flynn">Маркус Флинн</option>
                   <option value="alaric_ravenswood">Аларик Равенсвуд</option>
                   <option value="vesper_wainwright">Веспер Уэйнрайт</option>
                   <option value="arthur_payne">Артур Пейн</option>
                   <option value="selena_black">Селена Блэк</option>
                   <option value="michael_eliot">Доктор Майкл Элиот</option>
                 </select>
               </div>
              <button type="submit" className="ekts-modal-submit" disabled={isSubmitting}>
                {isSubmitting ? 'АНАЛИЗ...' : 'ОТПРАВИТЬ ЗАПРОС'}
              </button>
              
              {/* Status container */}
              {isSubmitting && (
                <div className="ekts-scan-status">
                  Анализ отпечатков пальцев... {progress}%
                </div>
              )}
              {submitResult === 'success' && (
                <div className="ekts-scan-success">
                  АНАЛИЗ ЗАВЕРШЕН: Отпечатки верны. Доступ к материалам дела разрешен.
                </div>
              )}
              {submitResult === 'error' && (
                <div className="ekts-scan-error">
                  ОШИБКА: Отпечатки не совпадают. Личность не идентифицирована.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}