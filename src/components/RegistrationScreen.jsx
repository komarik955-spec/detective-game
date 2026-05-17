import React, { useState } from 'react'
import './RegistrationScreen.css'
import { detectGender, getAgentAvatarPath } from '../utils/agentProfile'

export default function RegistrationScreen({ onRegistration }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    setIsProcessing(true)
    
    // Генерируем employee ID
    const employeeId = `DT-${Math.floor(Math.random() * 9000) + 1000}`
    
    // Создаем объект с данными игрока
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`
    const gender = detectGender(fullName)
    const avatarPath = getAgentAvatarPath(fullName)
    const playerData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName,
      employeeId,
      gender,
      avatarPath,
    }

    // Имитируем обработку
    setTimeout(() => {
      onRegistration(playerData)
    }, 1000)
  }

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className="registration-screen">
      {/* Scanlines effect */}
      <div className="scanlines"></div>
      
      <div className="registration-container">
        <div className="registration-header">
          <div className="dt-logo">
            <div className="dt-logo-text">DARK TRACE</div>
            <div className="dt-logo-subtitle">СЛЕДСТВЕННОЕ АГЕНТСТВО</div>
          </div>
          <div className="system-status">
            <span className="status-indicator active"></span>
            <span className="status-text">СИСТЕМА АКТИВНА</span>
          </div>
        </div>

        <div className="registration-content">
          <h1 className="registration-title">РЕГИСТРАЦИЯ СОТРУДНИКА</h1>
          <p className="registration-subtitle">Введите ваши данные для доступа к системе</p>

          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">ИМЯ</label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                placeholder="Иван"
                className="form-input"
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">ФАМИЛИЯ</label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                placeholder="Иванов"
                className="form-input"
                autoComplete="off"
              />
            </div>

            <button 
              type="submit" 
              className="registration-btn"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  ОБРАБОТКА...
                </span>
              ) : (
                'ПРОДОЛЖИТЬ'
              )}
            </button>
          </form>

          <div className="registration-footer">
            <div className="warning-text">
              ⚠️ ВВЕДЕННЫЕ ДАННЫЕ БУДУТ ИСПОЛЬЗОВАНЫ ДЛЯ АВТОРИЗАЦИИ В СИСТЕМЕ
            </div>
          </div>
        </div>

        {/* Blinking cursor effect */}
        <div className="cursor-blink"></div>
      </div>
    </div>
  )
}
