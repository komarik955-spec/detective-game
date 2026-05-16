import { useState, useEffect, useRef } from 'react'
import './VesperCallSystem.css'
import dialogueScriptRaw from '../assets/dialogue/vesper_call_script.txt?raw'

// Raw dialogue script in [SPEAKER] format
const DIALOGUE_SCRIPT = dialogueScriptRaw

// Parse dialogue script to dialogue objects
function fixMojibake(text) {
  try {
    if (typeof text !== 'string' || text.length === 0) return text
    const bytes = new Uint8Array(text.length)
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i)
      let b = null

      if (code <= 0x7f) b = code
      else if (code >= 0x0410 && code <= 0x044f) b = code - 0x0410 + 0xc0 // А-я
      else if (code === 0x0401) b = 0xa8 // Ё
      else if (code === 0x0451) b = 0xb8 // ё
      else if (code >= 0x0402 && code <= 0x040f) b = code - 0x0402 + 0x80
      else if (code >= 0x0452 && code <= 0x045f) b = code - 0x0452 + 0x90
      else if (code === 0x0490) b = 0xa5 // Ґ
      else if (code === 0x0491) b = 0xb4 // ґ
      else if (code === 0x0404) b = 0xaa // Є
      else if (code === 0x0454) b = 0xba // є
      else if (code === 0x0406) b = 0xb2 // І
      else if (code === 0x0456) b = 0xb3 // і
      else if (code === 0x0407) b = 0xaf // Ї
      else if (code === 0x0457) b = 0xbf // ї
      else if (code === 0x040e) b = 0xa1 // Ў
      else if (code === 0x045e) b = 0xa2 // ў
      else if (code === 0x2116) b = 0xb9 // №
      else if (code === 0x00a0) b = 0xa0 // NBSP

      if (b == null) return text
      bytes[i] = b
    }

    return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  } catch {
    return text
  }
}

function parseDialogueScript(script) {
  const normalizedScript = fixMojibake(script).replace(/^\uFEFF/, '')
  const lines = normalizedScript.trim().split('\n')
  const dialogue = []
  let currentSpeaker = null
  let currentText = ''
  let audioIndex = 1

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Check for speaker marker
    const speakerMatch = trimmedLine.match(/^\[(VESPER|PLAYER)\]/)
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

export default function VesperCallSystem({ onCallComplete }) {
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
  const isCallActiveRef = useRef(false)
  const dialogueTimeoutsRef = useRef([])
  const dialogueIndexRef = useRef(0)
  const advanceTokenRef = useRef(0)

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
  const advanceDialogue = ({ immediate = false } = {}) => {
    console.log('[DIALOGUE] Advancing dialogue')
    
    if (callCompleted) return // Block if call already completed
    if (!isCallActiveRef.current) return // Block if call not active
    
    const nextIndex = dialogueIndexRef.current + 1
    dialogueIndexRef.current = nextIndex
    setDialogueIndex(nextIndex)
    console.log('[REF] dialogueIndexRef:', dialogueIndexRef.current)
    setShowSubtitle(false)

    const token = ++advanceTokenRef.current
    const delayMs = immediate ? 0 : 500 // Keep existing fade timing by default
    const timeoutId = setTimeout(() => {
      if (isCallActiveRef.current && advanceTokenRef.current === token) {
        playDialogueLine(nextIndex)
      }
    }, delayMs)
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

  const handleSkipDialogue = () => {
    if (callCompleted) return
    if (!isCallActiveRef.current) return

    const line = DIALOGUE_SEQUENCE[dialogueIndexRef.current]
    const isSkippableVesperLine = line?.speaker === 'vesper' && !waitingForPlayer
    if (!isSkippableVesperLine) return

    console.log('[DIALOGUE] Skip clicked - stopping audio and advancing immediately')

    // Cancel any pending dialogue timers to avoid duplication/races
    dialogueTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
    dialogueTimeoutsRef.current = []

    // Stop and detach any current audio listeners
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''

        const newAudio = audioRef.current.cloneNode(true)
        audioRef.current.parentNode.replaceChild(newAudio, audioRef.current)
        audioRef.current = newAudio
      } catch (err) {
        console.error('[AUDIO] Skip cleanup error:', err)
      }
    }

    advanceDialogue({ immediate: true })
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
    const disconnectAudio = new Audio('/assets/audio/disconnect.mp3')
    disconnectAudio.play().catch(console.error)
    
    // Notify parent component after cleanup
    if (onCallComplete) {
      onCallComplete()
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

  const currentDialogue = DIALOGUE_SEQUENCE[dialogueIndex]
  const shouldShowNextButton =
    callState === 'connected' &&
    showSubtitle &&
    !waitingForPlayer &&
    currentDialogue?.speaker === 'vesper'

  return (
    <div className="vesper-call-system">
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

          {/* Subtitle UI is rendered outside the call window */}

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

      {/* Cinematic subtitles / dialogue interaction (outside call window) */}
      {callState === 'connected' && currentDialogue && (
        <div className="call-subtitles" aria-live="polite">
          <div
            className={`subtitle-content ${waitingForPlayer ? 'is-choice' : ''} ${showSubtitle ? 'is-visible' : 'is-hidden'}`}
          >
            <span className="subtitle-speaker">
              {currentDialogue.speaker === 'vesper' ? 'Vesper:' : 'ВЫ:'}
            </span>
            {waitingForPlayer ? (
              <button
                type="button"
                className="subtitle-choice"
                onClick={handlePlayerResponse}
              >
                {currentDialogue.text}
              </button>
            ) : (
              <span className="subtitle-text">{currentDialogue.text}</span>
            )}
            {shouldShowNextButton && (
              <button
                type="button"
                className="subtitle-next"
                onClick={handleSkipDialogue}
                aria-label="Далее"
              >
                Далее
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
