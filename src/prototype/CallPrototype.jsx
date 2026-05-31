import { useState, useEffect, useRef } from 'react'
import './CallPrototype.css'

// Raw dialogue script in [SPEAKER] format
const DIALOGUE_SCRIPT = `[VESPER] 
Здравствуйте... Я... меня зовут Веспер Уэйнрайт. Я звоню по поводу Селены Блэк. Моей... подруги.
Ее нашли мертвой. В пятницу. Полиция говорит, это самоубийство. Они... они почти готовы закрыть дело. Но это не может быть правдой!

[PLAYER]
Продолжайте, мисс Уэйнрайт.

[VESPER] 

Да, у нее был тяжелый период, она была в терапии... Но все налаживалось! У нее была помолвка с Эваном, выставка... Она бы не... не сделала этого. Понимайте, у нее были... проблемы. Внешние. Не только внутренние.

[PLAYER]

Что вы имеете в виду под "внешними проблемами"? Были конкретные угрозы?

[VESPER] 

Я... я не знаю, угрозы ли это, но... ее бывший, Маркус Флинн. Он... он не оставлял ее в покое. Постоянно писал, звонил... Селена была так напугана, что иногда пересылала мне скриншоты его сообщений, просто чтобы кто-то еще был в курсе. Они были... ужасны. Полны злости. Я не знаю, мог ли он что-то сделать, но... полиция должна это проверить!

[PLAYER]

Вы сообщили об этих сообщениях в полицию Ривертона?


[VESPER] 

Я пыталась! Но они зацепились за ее депрессию, за таблетки... Они не хотят сложного дела! Я боюсь, что они просто закроют его как суицид, и никто не будет разбираться, кто ее довел или... или что-то хуже. Поэтому я вам и звоню!
Пожалуйста, вы должны взяться за это. У меня есть все, что я знаю, какие-то ее заметки... и те самые скриншоты переписки с Маркусом, которые она мне присылала. Я их сохранила. Я все вам передам. Только начните расследование, пока не стало слишком поздно.


[PLAYER]

Хорошо, мисс Уэйнрайт. Присылайте все материалы, которые у вас есть. Мы изучим их.

[VESPER]

Спасибо! Огромное спасибо! Я сейчас же все отправлю.
`

// Parse dialogue script to dialogue objects
function parseDialogueScript(script) {
  const lines = script.trim().split('\n')
  const dialogue = []
  let currentSpeaker = null
  let currentText = ''
  let audioIndex = 1

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Check for speaker marker
    const speakerMatch = trimmedLine.match(/^\[(VESPER|PLAYER)\]$/)
    if (speakerMatch) {
      // Save previous dialogue if exists
      if (currentSpeaker && currentText.trim()) {
        dialogue.push({
          speaker: currentSpeaker.toLowerCase(),
          text: currentText.trim(),
          audio: currentSpeaker === 'VESPER' ? `vesper_${String(audioIndex).padStart(2, '0')}.mp3` : null
        })
        if (currentSpeaker === 'VESPER') audioIndex++
      }
      
      currentSpeaker = speakerMatch[1]
      currentText = ''
    } else if (trimmedLine && currentSpeaker) {
      currentText += (currentText ? ' ' : '') + trimmedLine
    }
  }

  // Don't forget the last dialogue
  if (currentSpeaker && currentText.trim()) {
    dialogue.push({
      speaker: currentSpeaker.toLowerCase(),
      text: currentText.trim(),
      audio: currentSpeaker === 'VESPER' ? `vesper_${String(audioIndex).padStart(2, '0')}.mp3` : null
    })
  }

  console.log('Parsed dialogue sequence:', dialogue)
  return dialogue
}

// Parse the script
const DIALOGUE_SEQUENCE = parseDialogueScript(DIALOGUE_SCRIPT)

export default function CallPrototype() {
  const [callState, setCallState] = useState('idle') // idle, incoming, connected, ended
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [callTimer, setCallTimer] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [waitingForPlayer, setWaitingForPlayer] = useState(false)
  const [callCompleted, setCallCompleted] = useState(false)
  
const ringtoneRef = useRef(null)
const audioRef = useRef(null)
const timerRef = useRef(null)
const recallTimeoutRef = useRef(null)
const isCallActiveRef = useRef(false)
const dialogueTimeoutsRef = useRef([])
const dialogueIndexRef = useRef(0)

  // Start call after 3 seconds
  useEffect(() => {
    if (callCompleted) return // Don't start if call already completed
    
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
    console.log('[CALL] Answer pressed - activating call')
    stopRingtone()
    setCallState('connected')
    setCallTimer(0)
    isCallActiveRef.current = true // Activate call
    
    // Start call timer
    timerRef.current = setInterval(() => {
      setCallTimer(prev => prev + 1)
    }, 1000)

    // Start dialogue
    startDialogue()
  }

  // Start dialogue sequence
  const startDialogue = () => {
    console.log('[DIALOGUE] Starting dialogue sequence')
    if (callCompleted) return // Block if call already completed
    if (!isCallActiveRef.current) return // Block if call not active
    
    dialogueIndexRef.current = 0
    setDialogueIndex(0)
    playDialogueLine(0)
  }

  // Play a single dialogue line
  const playDialogueLine = (index) => {
    console.log('[DIALOGUE] Playing dialogue line:', index, 'of', DIALOGUE_SEQUENCE.length)
    
    if (callCompleted) return // Block if call already completed
    if (!isCallActiveRef.current) return // Block if call not active
    
    if (index >= DIALOGUE_SEQUENCE.length) {
      console.log('[DIALOGUE] Dialogue sequence complete, ending call')
      endCall()
      return
    }

    const line = DIALOGUE_SEQUENCE[index]
    console.log('[DIALOGUE] Current line:', line)
    setShowSubtitle(true)

    if (line.speaker === 'player') {
      console.log('[DIALOGUE] Player line - showing response button')
      setWaitingForPlayer(true)
      // Don't play audio for player lines
    } else if (line.audio) {
      console.log('[DIALOGUE] Vesper line - playing audio:', line.audio)
      setWaitingForPlayer(false)
      // Play audio file
      if (audioRef.current) {
        // Remove any existing event listeners
        const newAudio = audioRef.current.cloneNode(true)
        audioRef.current.parentNode.replaceChild(newAudio, audioRef.current)
        audioRef.current = newAudio
        
        const handleAudioEnd = () => {
          console.log('[AUDIO] Audio ended, advancing dialogue')
          if (!isCallActiveRef.current) {
            console.log('[AUDIO] Call not active, ignoring audio end')
            return
          }
          audioRef.current.removeEventListener('ended', handleAudioEnd)
          advanceDialogue()
        }
        
        audioRef.current.addEventListener('ended', handleAudioEnd)
        
        audioRef.current.src = `/assets/audio/vesper-call/${line.audio}`
        audioRef.current.currentTime = 0
        audioRef.current.loop = false // Ensure no looping
        
        audioRef.current.play().catch(err => {
          console.error('[AUDIO] Audio play error:', err)
          audioRef.current.removeEventListener('ended', handleAudioEnd)
          // If audio fails, auto-advance after 3 seconds
          const timeoutId = setTimeout(() => {
            if (isCallActiveRef.current) {
              advanceDialogue()
            }
          }, 3000)
          dialogueTimeoutsRef.current.push(timeoutId)
        })
      }
    }
  }

  // Advance to next dialogue line
  const advanceDialogue = () => {
    console.log('[DIALOGUE] Advancing dialogue')
    
    if (callCompleted) return // Block if call already completed
    if (!isCallActiveRef.current) return // Block if call not active
    
    const nextIndex = dialogueIndexRef.current + 1
    dialogueIndexRef.current = nextIndex
    setDialogueIndex(nextIndex)
    console.log('[REF] dialogueIndexRef:', dialogueIndexRef.current)
    setShowSubtitle(false)
    
    const timeoutId = setTimeout(() => {
      if (isCallActiveRef.current) {
        playDialogueLine(nextIndex)
      }
    }, 500) // Small delay for subtitle fade
    dialogueTimeoutsRef.current.push(timeoutId)
  }

  // Handle player response click
  const handlePlayerResponse = () => {
    console.log('[DIALOGUE] Player response clicked')
    
    if (callCompleted) return // Block if call already completed
    if (!isCallActiveRef.current) return // Block if call not active
    
    setWaitingForPlayer(false)
    advanceDialogue()
  }

  // End call
  const endCall = () => {
    console.log('[CALL] Ending call - hard stop all dialogue')
    
    // HARD STOP: Immediately block all future dialogue execution
    isCallActiveRef.current = false
    
    // Mark call as completed to prevent any restart
    setCallCompleted(true)
    
    // Clear ALL dialogue timeouts
    console.log('[CLEANUP] Clearing dialogue timeouts:', dialogueTimeoutsRef.current.length)
    dialogueTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
    dialogueTimeoutsRef.current = []
    
    // Stop call timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      console.log('[CLEANUP] Cleared call timer')
    }
    
    // Stop and cleanup audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
      console.log('[CLEANUP] Cleared audio')
    }
    
    // Stop ringtone if still playing
    stopRingtone()
    console.log('[CLEANUP] Stopped ringtone')
    
    // Clear any pending timeouts
    if (recallTimeoutRef.current) {
      clearTimeout(recallTimeoutRef.current)
      console.log('[CLEANUP] Cleared recall timeout')
    }
    
    // Force window destroy by setting to idle (not ended)
    setCallState('idle')
    setShowSubtitle(false)
    setWaitingForPlayer(false)
    console.log('[CLEANUP] Window destroyed, state set to idle')

    // Play disconnect sound
    try {
      const disconnectAudio = new Audio('/assets/audio/disconnect.mp3')
      disconnectAudio.play().catch(() => {
        console.log('Disconnect sound failed to play (file may be empty)')
      })
    } catch (e) {
      console.log('Disconnect sound error:', e)
    }
    
    // Show notification after 1 second
    const notifTimeoutId = setTimeout(() => {
      setShowNotification(true)
      console.log('[NOTIFICATION] OneMail notification shown')
    }, 1000)
    dialogueTimeoutsRef.current.push(notifTimeoutId)
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

  const currentDialogue = DIALOGUE_SEQUENCE[dialogueIndex]

  return (
    <div className="call-prototype">
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
      {callState !== 'idle' && callState !== 'ended' && (
        <div className={`call-window ${callState}`}>
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
              {callState === 'incoming' ? 'Входящий защищённый звонок...' : 
               callState === 'ended' ? 'Соединение завершено' : 
               'Соединение установлено'}
            </p>
          </div>



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
      )}

      {/* Subtitle Overlay */}
      {showSubtitle && currentDialogue && (
        <div className="subtitle-overlay">
          <div className="subtitle-content">
            <span className="subtitle-speaker">
              {currentDialogue.speaker === 'vesper' ? 'Vesper:' : 'Вы:'}
            </span>
            <span className="subtitle-text">{currentDialogue.text}</span>
          </div>
        </div>
      )}

      {/* Player Response Button Overlay */}
      {waitingForPlayer && currentDialogue && (
        <div className="player-response-overlay">
          <button 
            className="player-response-btn"
            onClick={handlePlayerResponse}
          >
            {currentDialogue.text}
          </button>
        </div>
      )}

      {/* Fake OneMail Notification */}
      {showNotification && (
        <div className="onemail-notification">
          <div className="notification-icon">📧</div>
          <div className="notification-content">
            <div className="notification-title">OneMail</div>
            <div className="notification-text">Новое сообщение: Инструктаж по делу</div>
          </div>
          <div className="notification-close" onClick={() => setShowNotification(false)}>
            ✕
          </div>
        </div>
      )}

      {/* Background */}
      <div className="prototype-background">
        <div className="background-grid"></div>
      </div>
    </div>
  )
}
