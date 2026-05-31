import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './SlateCallFlow.css'

const TYPE_SPEED_MS = 40

const REPLICA_1 =
  'Ну что, Шерлок, проверил почту? Поздравляю, твой отчет прилетел. Слушай, я мельком глянул на эти выписки со счетов и чаты у ресторана LUXE… Какая поэзия! Маркус и Селена трутся у дорогого заведения, пока на счетах творится магия покруче, чем в Хогвартсе. А чеки из аптеки? Наша «скорбящая семья» явно закупалась не витаминками. Дэвид Андервуд, упокой господь его душу, определенно мешал слишком многим тратить эти деньги.'

const ENVELOPE_1_REPLICA_1 = REPLICA_1

const ENVELOPE_1_CHOICES = [
  { id: 'sarcastic', label: 'Сарказм засчитан. Что дальше?' },
  { id: 'evidence', label: 'Улики железные. Куда копать теперь?' },
]

const ENVELOPE_1_REPLICA_FINAL =
  'Дальше начинается самое веселое. Пока ты практиковался в чтении чужих писем, я «совершенно легально» перехватил курьера с материалами второго конверта. Там у нас алиби, тайминги и куча гнилых оправданий. Сгрузил всё это добро тебе на терминал. Разгребай, а я пока пойду налью кофе, от которого у меня хотя бы не будет изжоги. На связи.'

const ENVELOPE_2_REPLICA_1 =
  'Ну что, полюбовался на изнанку нашего святого семейства? Твой отчет у меня. Знаешь, после этих документов мне хочется вымыть руки с хлоркой. Наш благородный жених Эван задолжал подпольным букмекерам столько, что скоро начнет учиться писать левой рукой — если кредиторы сдержат обещания насчет пальцев. А Аларик? Великий ценитель искусства оказался банальным воришкой, который обчищал студию Селены, сбывал её картины через «прачечную» Дюбуа и прикрывался юбкой Веспер. Самое забавное, что наша нанимательница сама втянула нас в это, чтобы спасти свою шкуру и перевести стрелки на Флинна. Гниль на гнили.'

const ENVELOPE_2_CHOICES = [
  { id: 'debts', label: 'Но Селену убили не из-за долгов Эвана или кражи картины.' },
  { id: 'raven', label: 'Кто такой этот «Ворон» и при чем тут архив 2017 года?' },
]

const ENVELOPE_2_REPLICA_FINAL =
  'Именно. Пока эти ничтожества тряслись над своими кошельками, девочка копала куда глубже — прямо под фундамент дома Андервудов, в архивное дело о смерти их отца. И нанятый кем-то сталкер по кличке «Ворон» караулил её окна явно не из любви к живописи. Игра пошла по-крупному. Я вскрыл третий конверт. Там перехваченный отчет этого самого «Ворона», поминутные маршруты алиби нашей троицы и повторные допросы, где у Эвана и Веспер наконец-то сдали нервы. Всё уже на твоем терминале. Добивай эту грязь. А я пойду поищу нормальное спиртное, потому что этот город начинает меня утомлять. На связи.'

const REACTIONS = {
  marcus_flynn:
    'Флинн? Ну конечно. Наш уязвенный гений с уязвенным эго. Парень так трясся над своими контрактами, что из него мотив так и прет, согласен. Классика жанра: если бизнес идет к чертям, ищи того, кому выгодна страховка или чужое молчание. Но не думаешь, что он слишком... очевиден?',
  alaric_ravenwood:
    'Равенсвуд, значит? Наш местный ценитель прекрасного. Скользкий тип, тут ты прямо в яблочко. Его алиби шито такими белыми нитками, что удивительно, как местная полиция вообще это схавала. За его одержимостью явно скрывается куча грязного белья. Одобряю, хорошая ищейка всегда чует запах фальши.',
  evan_underwood:
    'О, старина Эван. Решил копнуть в сторону семейных ценностей? Уважаю. Чувак так заигрался в свои азартные игры, что, по-моему, уже сам забыл, кому и сколько должен. Когда у человека долгов выше крыши, он становится очень... непредсказуемым. Логичный вектор, детектив.',
  undecided:
    'Осторожничаешь? Ну, правильная позиция для старта. В Ривертоне если пальцем ткнуть в любого прохожего — точно угадаешь какого-нибудь грешника. Там святых нет, это точно. Селена Блэк умудрилась окружить себя целым серпентарием.',
  sarcastic: 'Ха, люблю с юмором. С таким подходом ты в Ривертоне долго не протянешь, но пока держишься.',
  evidence: 'Сразу к делу. Эффективно, но скучновато. Впрочем, у нас сейчас не время для развлечений.',
  debts: 'Верно. Убийство — это не бизнес-транзакция. И не кража. Это что-то гораздо более личное и древнее.',
  raven: 'А вот это уже правильный вопрос. «Ворон» — это не просто кличка. Это ключ к тому, почему Селена стала опасной.',
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

export default function SlateCallFlow({ onComplete, stage = 'starter_folder' }) {
  const [phase, setPhase] = useState('incoming')
  const [dialogueStep, setDialogueStep] = useState('idle')
  const [displayText, setDisplayText] = useState('')
  const [decryptProgress, setDecryptProgress] = useState(0)
  const ringRef = useRef(null)
  const dialogueRunIdRef = useRef(0)

  const isEnvelope1 = stage === 'envelope_1'
  const isEnvelope2 = stage === 'envelope_2'

  // Force envelope_2 dialogue when stage is envelope_2
  const currentReplica1 = stage === 'envelope_2' ? ENVELOPE_2_REPLICA_1 : isEnvelope1 ? ENVELOPE_1_REPLICA_1 : REPLICA_1
  const currentChoices = stage === 'envelope_2' ? ENVELOPE_2_CHOICES : isEnvelope1 ? ENVELOPE_1_CHOICES : SUSPECT_OPTIONS
  const currentReplicaFinal = stage === 'envelope_2' ? ENVELOPE_2_REPLICA_FINAL : isEnvelope1 ? ENVELOPE_1_REPLICA_FINAL : REPLICA_FINAL

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
    const ok = await typewriter(currentReplica1, setDisplayText, runId, dialogueRunIdRef)
    if (!ok) return
    setDialogueStep('choices')
  }, [currentReplica1])

  const runAfterChoice = useCallback(
    async choiceId => {
      const runId = ++dialogueRunIdRef.current
      setDialogueStep('typing')
      const reaction = stage === 'envelope_2' ? (REACTIONS[choiceId] || REACTIONS.debts) : isEnvelope1 ? (REACTIONS[choiceId] || REACTIONS.sarcastic) : (REACTIONS[choiceId] || REACTIONS.undecided)
      let ok = await typewriter(reaction, setDisplayText, runId, dialogueRunIdRef)
      if (!ok) return
      await delay(1500)
      if (runId !== dialogueRunIdRef.current) return
      ok = await typewriter(currentReplicaFinal, setDisplayText, runId, dialogueRunIdRef)
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
          setTimeout(() => onComplete({ choiceId, stage }), 400)
        }
      }, 120)
    },
    [onComplete, playHangupBeep, isEnvelope1, stage, currentReplicaFinal]
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
          <div className="slate-decrypt-sub">ИДЕТ ДЕШИФРОВКА КОНВЕРТА {stage === 'envelope_2' ? '№3' : isEnvelope1 ? '№2' : '№1'}...</div>
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
                <div className="slate-choices slate-choices--glitch-in" role="group" aria-label={stage === 'envelope_2' || isEnvelope1 ? "Выбор ответа" : "Выбор подозреваемого"}>
                  {currentChoices.map(opt => (
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
