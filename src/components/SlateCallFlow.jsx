import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './SlateCallFlow.css'

const TYPE_SPEED_MS = 40

const REPLICA_1 =
  'Ну привет, детектив. Живой там еще среди этих гор макулатуры? Я посмотрел логи — ты, я гляжу, заперся в системе и до дыр затер файлы из стартовой папки. Похвально, похвально. Думал, ты сдашься еще на отчете судмедэксперта.\n' +
  'Ладно, шутки в сторону. Избавь меня от официальных рапортов, у меня от них уже изжога. Скажи мне как детектив детективу: у тебя глаз на кого-то уже намылился? Кто у нас лидирует в номинации „Главное подозрение Ривертона"?'

const REACTIONS = {
  marcus_flynn:
    'Флинн? Ну конечно. Наш уязвленный гений с уязвленным эго. Парень так трясся над своими контрактами, что из него мотив так и прет, согласен. Классика жанра: если бизнес идет к чертям, ищи того, кому выгодна страховка или чужое молчание. Но не думаешь, что он слишком... очевиден?',
  alaric_ravenwood:
    'Равенсвуд, значит? Наш местный ценитель прекрасного. Скользкий тип, тут ты прямо в яблочко. Его алиби шито такими белыми нитками, что удивительно, как местная полиция вообще это схавала. За его одержимостью явно скрывается куча грязного белья. Одобряю, хорошая ищейка всегда чует запах фальши.',
  evan_underwood:
    'О, старина Эван. Решил копнуть в сторону семейных ценностей? Уважаю. Чувак так заигрался в свои азартные игры, что, по-моему, уже сам забыл, кому и сколько должен. Когда у человека долгов выше крыши, он становится очень... непредсказуемым. Логичный вектор, детектив.',
  undecided:
    'Осторожничаешь? Ну, правильная позиция для старта. В Ривертоне если пальцем ткнуть в любого прохожего — точно угадаешь какого-нибудь грешника. Там святых нет, это точно. Селена Блэк умудрилась окружить себя целым серпентарием.',
}

const REPLICA_FINAL =
  'В общем, твои мысли мне понятны. Радует, что ты не просто картинки кликаешь, а головой думаешь.\n' +
  'Короче, портить тебе аппетит не хочу, но у меня тут на столе лежит свежая порция „радости" из оперативного отдела. Ребята перехватили еще кое-какие материалы. Там новые протоколы, переписки и детали, от которых у нашей Веспер, думаю, задергается глаз.\n' +
  'Я только что закинул всё это в твой терминал — проверяй Конверт №1, доступ открыт. Изучай внимательно. И... детектив? Постарайся не упустить детали. Город не любит, когда копают слишком медленно. На связи.'

const SUSPECT_OPTIONS = [
  { id: 'marcus_flynn', label: 'Выбрать: Маркус Флинн' },
  { id: 'alaric_ravenwood', label: 'Выбрать: Аларик Равенсвуд' },
  { id: 'evan_underwood', label: 'Выбрать: Эван Андервуд' },
  { id: 'undecided', label: 'Выбрать: Пока сложно сказать, все хороши' },
]

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function typewriter(text, setText, runId, activeRunIdRef, speed = TYPE_SPEED_MS) {
  setText('')
  for (let i = 0; i < text.length; i++) {
    if (runId !== activeRunIdRef.current) return false
    setText(text.slice(0, i + 1))
    await delay(speed)
  }
  return runId === activeRunIdRef.current
}

export default function SlateCallFlow({ onComplete }) {
  const [phase, setPhase] = useState('incoming')
  const [dialogueStep, setDialogueStep] = useState('idle')
  const [displayText, setDisplayText] = useState('')
  const [decryptProgress, setDecryptProgress] = useState(0)
  const ringRef = useRef(null)
  const dialogueRunIdRef = useRef(0)

  const playRing = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = 880
      gain.gain.value = 0.04
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      ringRef.current = { ctx, osc, gain }
      const pulse = setInterval(() => {
        osc.frequency.value = osc.frequency.value === 880 ? 660 : 880
      }, 450)
      ringRef.current.pulse = pulse
    } catch {
      /* no audio */
    }
  }, [])

  const stopRing = useCallback(() => {
    if (!ringRef.current) return
    clearInterval(ringRef.current.pulse)
    try {
      ringRef.current.osc.stop()
      ringRef.current.ctx.close()
    } catch {
      /* ignore */
    }
    ringRef.current = null
  }, [])

  const playHangupBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 520
      gain.gain.value = 0.08
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      setTimeout(() => {
        osc.stop()
        ctx.close()
      }, 120)
    } catch {
      /* no audio */
    }
  }, [])

  useEffect(() => {
    playRing()
    return () => {
      dialogueRunIdRef.current += 1
      stopRing()
    }
  }, [playRing, stopRing])

  const runIntro = useCallback(async () => {
    const runId = ++dialogueRunIdRef.current
    setDialogueStep('typing')
    const ok = await typewriter(REPLICA_1, setDisplayText, runId, dialogueRunIdRef)
    if (!ok) return
    setDialogueStep('choices')
  }, [])

  const runAfterChoice = useCallback(
    async suspectId => {
      const runId = ++dialogueRunIdRef.current
      setDialogueStep('typing')
      const reaction = REACTIONS[suspectId] || REACTIONS.undecided
      let ok = await typewriter(reaction, setDisplayText, runId, dialogueRunIdRef)
      if (!ok) return
      await delay(1500)
      if (runId !== dialogueRunIdRef.current) return
      ok = await typewriter(REPLICA_FINAL, setDisplayText, runId, dialogueRunIdRef)
      if (!ok) return
      setDialogueStep('done')

      await delay(400)
      playHangupBeep()
      setPhase('decrypt')
      setDisplayText('')

      let p = 0
      const tick = setInterval(() => {
        p += 4
        setDecryptProgress(Math.min(p, 100))
        if (p >= 100) {
          clearInterval(tick)
          setTimeout(() => onComplete(suspectId), 400)
        }
      }, 120)
    },
    [onComplete, playHangupBeep]
  )

  const handleAccept = () => {
    stopRing()
    setPhase('connected')
    runIntro()
  }

  const handleSuspect = id => {
    localStorage.setItem('chosen_suspect', id)
    runAfterChoice(id)
  }

  const ui =
    phase === 'decrypt' ? (
      <div className="slate-call-overlay slate-call-overlay--decrypt">
        <div className="slate-decrypt-panel">
          <div className="slate-decrypt-title">
            ПОЛУЧЕНИЕ ДАННЫХ: КАНАЛ ОПЕРАТИВНОГО ОТДЕЛА.
          </div>
          <div className="slate-decrypt-sub">ИДЕТ ДЕШИФРОВКА КОНВЕРТА №1...</div>
          <div className="slate-decrypt-bar-track">
            <div className="slate-decrypt-bar-fill" style={{ width: `${decryptProgress}%` }} />
          </div>
          <span className="slate-decrypt-percent">{decryptProgress}%</span>
        </div>
      </div>
    ) : (
      <div className="slate-call-overlay">
        <div className={`slate-call-window ${phase}`}>
          <div className="slate-call-glow" />
          <header className="slate-call-header">
            <span className="slate-secure-icon">◆</span>
            <span className="slate-secure-label">SECURE CHANNEL</span>
          </header>

          {phase === 'incoming' ? (
            <>
              <h2 className="slate-call-title">ВХОДЯЩИЙ ЗАЩИЩЕННЫЙ ВЫЗОВ</h2>
              <p className="slate-call-caller">Д. СЛЕЙТ</p>
              <button type="button" className="slate-accept-btn" onClick={handleAccept}>
                ПРИНЯТЬ
              </button>
            </>
          ) : (
            <div className="slate-call-body">
              <p className="slate-call-status-label">СВЯЗЬ: Д. СЛЕЙТ</p>
              <div className="slate-waveform" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="slate-wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
              <div className="slate-transcript-wrap">
                <div className="slate-static-noise" aria-hidden="true" />
                <p className="slate-transcript">{displayText}</p>
                {dialogueStep === 'typing' && <span className="slate-cursor">▌</span>}
              </div>
              {dialogueStep === 'choices' && (
                <div className="slate-choices slate-choices--glitch-in" role="group" aria-label="Выбор подозреваемого">
                  {SUSPECT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="slate-choice-btn"
                      onClick={() => handleSuspect(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )

  return createPortal(ui, document.body)
}
