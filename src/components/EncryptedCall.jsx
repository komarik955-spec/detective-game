import React, { useState, useEffect } from 'react'
import './EncryptedCall.css'

const DETECTIVE_MESSAGE = `Ты копаешь в правильном направлении. Деньги Андервуда, странные контакты в галерее... Пазл начинает складываться, но картинка мне совсем не нравится. В Ривертоне пахнет крупным заговором, и смерть Дэвида — лишь верхушка айсберга.

На твоём дашборде теперь доступен Конверт №2. Там файлы, которые полиция пыталась похоронить в архиве. Логи связи, которые ты нашёл, помогут открыть их. Будь осторожнее, не оставляй следов в сети. Скоро свяжусь. Конец связи.`

export default function EncryptedCall({ onComplete }) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    let index = 0
    const text = DETECTIVE_MESSAGE
    
    const typeWriter = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
        setTimeout(typeWriter, 30)
      } else {
        setIsComplete(true)
        setTimeout(() => setShowButton(true), 500)
      }
    }

    typeWriter()
  }, [])

  const handleAccept = () => {
    onComplete()
  }

  return (
    <div className="encrypted-call-overlay">
      <div className="encrypted-call-container">
        <div className="encrypted-call-header">
          <div className="call-indicator">
            <span className="indicator-dot"></span>
            <span className="indicator-text">ВХОДЯЩИЙ ЗАШИФРОВАННЫЙ ВЫЗОВ...</span>
          </div>
        </div>

        <div className="encrypted-call-content">
          <div className="audio-visualization">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>

          <div className="message-container">
            <pre className="typewriter-text">{displayText}</pre>
            {!isComplete && <span className="cursor">|</span>}
          </div>
        </div>

        {showButton && (
          <div className="encrypted-call-footer">
            <button className="accept-button" onClick={handleAccept}>
              ПРИНЯТЬ ФАЙЛЫ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
