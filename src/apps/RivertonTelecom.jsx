import React, { useState, useEffect } from 'react'
import './RivertonTelecom.css'

// Логика авто-подбора результатов на сайте Riverton Telecom
function getTelecomRecords(order, phone, date) {
  const cleanOrder = order.trim().toUpperCase()
  if (cleanOrder !== '404-А' && cleanOrder !== '404-A') {
    return { success: false, error: 'Неверный номер ордера' }
  }

  const cleanPhone = phone.replace(/\D/g, '')
  const cleanDate = date.trim()

  // 1. Запрос по Маркусу Флинну (0192834)
  if (cleanPhone.includes('0192834')) {
    if (cleanDate !== '21.06.2025') {
      return {
        success: true,
        records: [
          { time: '11:20', duration: '1:05', code: '991023', note: 'Входящий' },
          { time: '16:45', duration: '0:30', code: '991024', note: 'Исходящий' }
        ]
      }
    }
    // Если дата верна — выдаем 4 звонка, включая критический 041187
    return {
      success: true,
      records: [
        { time: '09:12', duration: '2:15', code: '104882', note: 'Исходящий' },
        { time: '14:30', duration: '4:05', code: '508911', note: 'Входящий' },
        { time: '22:14', duration: '3:40', code: '041187', note: 'Входящий' },
        { time: '23:45', duration: '1:10', code: '774102', note: 'Исходящий' }
      ]
    }
  }

  // 2. Запрос по Веспер Уэйнрайт (0147721)
  if (cleanPhone.includes('0147721')) {
    if (cleanDate !== '21.06.2025') {
      return { success: true, records: [] }
    }
    return {
      success: true,
      records: [
        { time: '08:05', duration: '1:50', code: '330194', note: 'Исходящий' },
        { time: '11:20', duration: '5:12', code: '069201', note: 'Исходящий' },
        { time: '15:40', duration: '0:30', code: '881204', note: 'Входящий' },
        { time: '19:10', duration: '2:22', code: '441095', note: 'Исходящий' }
      ]
    }
  }

  // 3. Запрос по Розалии Андервуд (0129909)
  if (cleanPhone.includes('0129909')) {
    if (cleanDate !== '21.06.2025') {
      return { success: true, records: [] }
    }
    return {
      success: true,
      records: [
        { time: '07:30', duration: '10:15', code: '021998', note: 'Исходящий' },
        { time: '12:00', duration: '1:05', code: '115623', note: 'Входящий' },
        { time: '14:15', duration: '3:50', code: '654128', note: 'Исходящий' },
        { time: '17:45', duration: '0:50', code: '902114', note: 'Входящий' }
      ]
    }
  }

  return { success: false, error: 'Абонент с таким номером не найден в базе вышки за указанный период.' }
}

// Функция форматирования номера телефона
function formatPhoneNumber(value) {
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length === 0) return ''
  
  // Если начинается с 1 (код страны США), убираем его для форматирования
  const digits = cleaned.startsWith('1') ? cleaned.slice(1) : cleaned
  
  // Форматируем как +1 (XXX) XXX-XXXX
  if (digits.length <= 3) {
    return `+1 (${digits}`
  } else if (digits.length <= 6) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`
  } else {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
}

export default function RivertonTelecom({ initialState = {}, onStateChange }) {
  const [orderNumber, setOrderNumber] = useState(initialState.orderNumber || '')
  const [phoneNumber, setPhoneNumber] = useState(initialState.phoneNumber || '')
  const [archiveDate, setArchiveDate] = useState(initialState.archiveDate || '')
  const [error, setError] = useState(initialState.error || '')
  const [results, setResults] = useState(initialState.results || null)
  const [showResults, setShowResults] = useState(initialState.showResults || false)

  // Сохраняем состояние при изменении
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        orderNumber,
        phoneNumber,
        archiveDate,
        error,
        results,
        showResults
      })
    }
  }, [orderNumber, phoneNumber, archiveDate, error, results, showResults, onStateChange])

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value
    const formatted = formatPhoneNumber(rawValue)
    setPhoneNumber(formatted)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    const result = getTelecomRecords(orderNumber, phoneNumber, archiveDate)
    
    if (!result.success) {
      setError(result.error)
      setShowResults(false)
      setResults(null)
      return
    }
    
    setResults(result.records)
    setShowResults(true)
  }

  return (
    <div className="riverton-telecom">
      <header className="rt-header">
        <div className="rt-logo">
          <div className="rt-logo-icon">📡</div>
          <div className="rt-logo-text">
            <h1>Riverton Telecom</h1>
            <p>Система архивации вызовов • Доступ по судебному разрешению</p>
          </div>
        </div>
      </header>

      <main className="rt-content">
        <div className="rt-form-section">
          <h2 className="rt-form-title">Запрос архивных данных</h2>
          
          <form className="rt-form" onSubmit={handleSubmit}>
            <div className="rt-form-group">
              <label htmlFor="orderNumber">Номер судебного разрешения</label>
              <input 
                type="text" 
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Введите номер ордера (например: 404-А)"
                required
              />
              <div className="rt-hint">Формат: 404-А или 404-A</div>
            </div>

            <div className="rt-form-group">
              <label htmlFor="phoneNumber">Номер телефона абонента</label>
              <input 
                type="tel" 
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+1 (555) XXX-XXXX"
                required
              />
              <div className="rt-hint">Введите номер: форматирование автоматически</div>
            </div>

            <div className="rt-form-group">
              <label htmlFor="archiveDate">Дата архива</label>
              <input 
                type="text" 
                id="archiveDate"
                value={archiveDate}
                onChange={(e) => setArchiveDate(e.target.value)}
                placeholder="ДД.ММ.ГГГГ"
                required
              />
              <div className="rt-hint">Формат: ДД.ММ.ГГГГ (например: 21.06.2025)</div>
            </div>

            <button type="submit" className="rt-submit-btn">Запросить данные</button>
          </form>

          {error && (
            <div className="rt-error-message">
              {error}
            </div>
          )}
        </div>

        {showResults && (
          <div className="rt-results-section">
            <h2 className="rt-results-title">Результаты поиска</h2>
            
            {results.length === 0 ? (
              <div className="rt-no-results">Записей не найдено за указанный период.</div>
            ) : (
              <table className="rt-results-table">
                <thead>
                  <tr>
                    <th>Время</th>
                    <th>Длительность</th>
                    <th>Код записи</th>
                    <th>Примечание</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((record, index) => (
                    <tr key={index}>
                      <td>{record.time}</td>
                      <td>{record.duration}</td>
                      <td><span className="rt-code">{record.code}</span></td>
                      <td className="rt-note">{record.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      <footer className="rt-footer">
        <p>© 2025 Riverton Telecom. Все права защищены. Система конфиденциальна.</p>
      </footer>
    </div>
  )
}
