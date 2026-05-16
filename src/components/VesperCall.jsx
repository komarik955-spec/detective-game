import { useState, useEffect, useRef } from 'react'
import './VesperCall.css'

// Dialogue configuration
const DIALOGUE_CONFIG = [
  {
    speaker: 'vesper',
    audio: 'vesper_01.mp3',
    text: 'Здравствуйте... Я... меня зовут Веспер Уэйнрайт. Я звоню по поводу Селены Блэк. Моей... подруги. Ее нашли мертвой. В пятницу. Полиция говорит, это самоубийство. Они... они почти готовы закрыть дело. Но это не может быть правдой!'
  },
  {
    speaker: 'player',
    audio: null,
    text: 'Продолжайте, мисс Уэйнрайт.'
  },
  {
    speaker: 'vesper',
    audio: 'vesper_02.mp3',
    text: 'Да, у нее был тяжелый период, она была в терапии... Но все налаживалось! У нее была помолвка с Эваном, выставка... Она бы не... не сделала этого. Понимайте, у нее были... проблемы. Внешние. Не только внутренние.'
  }
]

export default function VesperCall({ onCallComplete }) {
  const [callState, setCallState] = useState('idle') // idle, incoming, connected, ended
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [callTimer, setCallTimer] = useState(0)
  const [waitingForPlayer, setWaitingForPlayer] = useState(false)
  const [callCompleted, setCallCompleted] = useState(false)
  
  const ringtoneRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const recallTimeoutRef = useRef(null)

  // Start call after 3 seconds
  useEffect(() => {
    if (callCompleted) return
    
    const startTimer = setTimeout(() => {
      setCallState('incoming')
      playRingtone()
    }, 3000)

    return () => clearTimeout(startTimer)
  }, [callCompleted])

  // Play ringtone
  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.loop = true
      ringtoneRef.current.currentTime = 0
      ringtoneRef.current.play().catch(console.error)
    }
  }

  // Stop ringtone
  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause()
      ringtoneRef.current.currentTime = 0
    }
  }

  // Handle decline
  const handleDecline = () => {
    stopRingtone()
    setCallState('idle')
    
    // Re-call after 5 seconds
    recallTimeoutRef.current = setTimeout(() => {
      setCallState('incoming')
      playRingtone()
    }, 5000)
  }

  // Handle answer
  const handleAnswer = () => {
    stopRingtone()
    setCallState('connected')
    setCallTimer(0)
    
    // Start call timer
    timerRef.current = setInterval(() => {
      setCallTimer(prev => prev + 1)
    }, 1000)

    // Start dialogue
    startDialogue()
  }

  // Start dialogue sequence
  const startDialogue = () => {
    if (callCompleted) return
    
    setDialogueIndex(0)
    playDialogueLine(0)
  }

  // Play a single dialogue line
  const playDialogueLine = (index) => {
    if (callCompleted) return
    
    if (index >= DIALOGUE_CONFIG.length) {
      endCall()
      return
    }

    const line = DIALOGUE_CONFIG[index]
    setShowSubtitle(true)

    if (line.speaker === 'player') {
      setWaitingForPlayer(true)
      // Don't play audio for player lines
    } else if (line.audio) {
      setWaitingForPlayer(false)
      // Play audio file
      if (audioRef.current) {
        // Remove any existing onended handler
        audioRef.current.onended = null
        
        audioRef.current.src = `/assets/audio/vesper-call/${line.audio}`
        audioRef.current.currentTime = 0
        audioRef.current.loop = false // Ensure no looping
        
        audioRef.current.play().catch(err => {
          console.error('Audio play error:', err)
          // If audio fails, auto-advance after 3 seconds
          setTimeout(() => advanceDialogue(), 3000)
        })

        audioRef.current.onended = () => {
          // Clean up the handler
          audioRef.current.onended = null
          advanceDialogue()
        }
      }
    }
  }

  // Advance to next dialogue line
  const advanceDialogue = () => {
    if (callCompleted) return
    
    const nextIndex = dialogueIndex + 1
    setDialogueIndex(nextIndex)
    setShowSubtitle(false)
    
    setTimeout(() => {
      playDialogueLine(nextIndex)
    }, 500) // Small delay for subtitle fade
  }

  // Handle player response click
  const handlePlayerResponse = () => {
    if (callCompleted) return
    
    setWaitingForPlayer(false)
    advanceDialogue()
  }

  // Handle skip dialogue (Далее button)
  const handleSkipDialogue = () => {
    if (callCompleted || !audioRef.current) return
    
    // Pause and stop the current audio
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    
    // Clear the onended handler to prevent it from triggering
    if (audioRef.current.onended) {
      audioRef.current.onended = null
    }
    
    // Advance to next dialogue line
    advanceDialogue()
  }

  // End call
  const endCall = () => {
    // Mark call as completed to prevent any restart
    setCallCompleted(true)
    
    // Stop call timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // Stop and cleanup audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
      audioRef.current.onended = null
    }
    
    // Stop ringtone if still playing
    stopRingtone()
    
    // Clear any pending timeouts
    if (recallTimeoutRef.current) {
      clearTimeout(recallTimeoutRef.current)
    }
    
    setCallState('ended')
    setShowSubtitle(false)
    setWaitingForPlayer(false)
    
    // Notify parent component
    if (onCallComplete) {
      setTimeout(() => {
        onCallComplete()
      }, 1000)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recallTimeoutRef.current) clearTimeout(recallTimeoutRef.current)
      stopRingtone()
    }
  }, [])

  // Format call timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentDialogue = DIALOGUE_CONFIG[dialogueIndex]

  // Don't render anything if call is idle or ended
  if (callState === 'idle' || callState === 'ended') {
    return null
  }

  return (
    <div className="vesper-call-overlay">
      {/* Ringtone audio */}
      <audio 
        ref={ringtoneRef}
        src="/assets/audio/ringtone.mp3"
        preload="auto"
      />
      
      {/* Dialogue audio */}
      <audio 
        ref={audioRef}
        preload="auto"
      />

       {/* Call Window */}
       <div className={`vesper-call-window ${callState}`}>
         <div className="call-window-glow"></div>
         
         {/* Header */}
         <div className="call-header">
           <div className="secure-indicator">
             <span className="secure-icon">🔒</span>
             <span className="secure-text">ЗАЩИЩЁННОЕ СОЕДИНЕНИЕ</span>
           </div>
           {callState === 'connected' && (
             <div className="call-timer">{formatTimer(callTimer)}</div>
           )}
         </div>

         {/* Avatar */}
         <div className="call-avatar-container">
           <div className="avatar-glow"></div>
           <div className="call-avatar">
             <img 
               src="/assets/images/vesper-avatar.jpg" 
               alt="Vesper" 
               className="avatar-image-img"
               onError={(e) => {
                 e.target.style.display = 'none'
                 e.target.nextElementSibling.style.display = 'flex'
               }}
             />
             <div className="avatar-image-fallback">V</div>
           </div>
           {callState === 'incoming' && (
             <div className="incoming-pulse"></div>
           )}
         </div>

         {/* Caller Info */}
         <div className="call-info">
           <h2 className="caller-name">Vesper</h2>
           <p className="call-status">
             {callState === 'incoming' ? 'Входящий защищённый звонок...' : 'Соединение установлено'}
           </p>
         </div>

         {/* Player Response Button */}
         {waitingForPlayer && currentDialogue && (
           <button 
             className="player-response-btn"
             onClick={handlePlayerResponse}
           >
             {currentDialogue.text}
           </button>
         )}
       </div>

       {/* Cinematic Subtitle (for Vesper lines only) */}
       {showSubtitle && currentDialogue && currentDialogue.speaker === 'vesper' && (
         <div className="cinematic-subtitle">
           <span className="subtitle-speaker">VESPER:</span>
           <span className="subtitle-text">{currentDialogue.text}</span>
           <button 
             className="subtitle-next-btn"
             onClick={handleSkipDialogue}
             title="Пропустить строку"
           >
             Далее
           </button>
         </div>
       )}

        {/* Action Buttons */}
        {callState === 'incoming' && (
          <div className="call-actions">
            <button 
              className="call-btn decline-btn"
              onClick={handleDecline}
            >
              <span className="btn-icon">✕</span>
              Отклонить
            </button>
            <button 
              className="call-btn answer-btn"
              onClick={handleAnswer}
            >
              <span className="btn-icon">✓</span>
              Ответить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
