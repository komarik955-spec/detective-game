import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ShieldCheck,
  FileSearch,
  Scale,
  ChevronRight,
  Cpu,
  Fingerprint,
  Lock,
  X,
  BadgeCheck,
  BadgeX,
  Loader2
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/forensic-lab' },
  { label: 'О центре', href: '/forensic-lab' },
  { label: 'Эксперты', href: '/forensic-lab' },
  { label: 'Контакты', href: '/forensic-lab' }
]

const CASE_FIGURANTS = [
  'Эван Андервуд',
  'Селена Блэк',
  'Маркус Флинн',
  'Аларик Равенсвуд',
  'Розалия Андервуд'
]

function ResultModal({ open, onClose, result, researchObject, initiatorAgency }) {
  if (!open) return null

  const positive = !!result?.positive
  const header = positive ? 'Криминалистическое заключение (AFIS)' : 'Заключение по результатам сверки (AFIS)'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Криминалистическое заключение"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#0b1624] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#08101a]/80">
          <div className="flex items-center gap-3">
            {positive ? (
              <BadgeCheck className="text-emerald-400" size={20} />
            ) : (
              <BadgeX className="text-rose-400" size={20} />
            )}
            <div className="text-white font-bold">{header}</div>
          </div>
          <button
            className="text-slate-400 hover:text-white transition p-1 rounded"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Инициатор</div>
              <div className="text-white font-semibold">{initiatorAgency}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Объект исследования</div>
              <div className="text-white font-semibold">{researchObject}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#08101a] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Фигурант</div>
                <div className="text-white text-lg font-bold">{result?.figurant}</div>
              </div>
              <div
                className={[
                  'px-3 py-1 rounded-full text-xs font-bold tracking-wider border',
                  positive
                    ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-rose-300 border-rose-500/30 bg-rose-500/10'
                ].join(' ')}
              >
                {positive ? 'MATCH: 100%' : 'MATCH: 0%'}
              </div>
            </div>

            <div className="mt-4 text-slate-200 leading-relaxed">{result?.text}</div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs text-slate-500">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="uppercase tracking-wider">Протокол</div>
                <div className="text-slate-300 font-mono mt-1">EKC-AFIS-{String(result?.protocolId || '').slice(-6)}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="uppercase tracking-wider">Хэш пакета</div>
                <div className="text-slate-300 font-mono mt-1">SHA-256: 8c1a…f0d2</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="uppercase tracking-wider">Статус</div>
                <div className="text-slate-300 font-semibold mt-1">
                  {positive ? 'Подтверждено' : 'Совпадений нет'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded font-bold transition"
              onClick={onClose}
            >
              Закрыть заключение
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ForensicCenterPage({ embedded = false } = {}) {
  const [researchObject, setResearchObject] = useState('Кофейная крышка')
  const [initiatorAgency, setInitiatorAgency] = useState('Dark Trace')
  const [suspect, setSuspect] = useState('Розалия Андервуд')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const orderRef = useRef(null)

  useEffect(() => {
    if (embedded) return
    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('root')

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      rootOverflow: root?.style.overflow,
      rootHeight: root?.style.height
    }

    html.style.overflow = 'auto'
    body.style.overflow = 'auto'
    if (root) {
      root.style.overflow = 'auto'
      root.style.height = 'auto'
    }

    return () => {
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      if (root) {
        root.style.overflow = prev.rootOverflow || ''
        root.style.height = prev.rootHeight || ''
      }
    }
  }, [embedded])

  const servicesGrid = useMemo(
    () => [
      { icon: Cpu, title: 'Компьютерно‑техническая', desc: 'Восстановление данных и анализ носителей.' },
      { icon: FileSearch, title: 'Документарная', desc: 'Проверка подлинности и анализ документов.' },
      { icon: Fingerprint, title: 'Дактилоскопическая', desc: 'Идентификация следов пальцев рук.' },
      { icon: Lock, title: 'Анализ переписок', desc: 'Исследование данных в мессенджерах и почте.' },
      { icon: Scale, title: 'Фоноскопическая', desc: 'Анализ аудиозаписей и идентификация голоса.' },
      { icon: ShieldCheck, title: 'OSINT‑анализ', desc: 'Сбор и анализ данных из открытых источников.' }
    ],
    []
  )

  const containerClass = embedded ? 'w-full px-6' : 'max-w-7xl mx-auto px-6'

  const scrollToOrder = () => {
    setLoading(false)
    setResult(null)
    orderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setLoading(false)

      if (suspect === 'Розалия Андервуд') {
        setResult(
          "Внимание! Обнаружено 100% дактилоскопическое совпадение латентного следа с объекта 'Кофейная крышка' с картой подозреваемого: Розалия Андервуд. Данные занесены в протокол"
        )
      } else {
        setResult('Анализ завершен. Совпадений в базе данных ЭКЦ-ПРО для выбранного фигуранта не обнаружено')
      }
    }, 2500)
  }

  return (
    <div
      className={[
        embedded ? 'h-full overflow-y-auto' : 'min-h-screen',
        'bg-[#050b14] text-slate-300 font-sans selection:bg-blue-900 selection:text-white'
      ].join(' ')}
    >
      <header className="border-b border-slate-800 bg-[#08101a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className={`${containerClass} py-4 flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-500" size={28} />
            <span className="text-xl font-bold text-white tracking-tight">ЭКЦ‑ПРО</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-blue-400 transition">
                {item.label}
              </a>
            ))}
          </nav>
          <button
            onClick={scrollToOrder}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded text-sm font-semibold transition shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            Заявка на экспертизу
          </button>
        </div>
      </header>

      <main className={`${containerClass} py-16`}>
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Независимая экспертиза.
              <br />
              <span className="text-blue-500">Доказательства, которым доверяют.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg">
              Проводим судебные и внесудебные экспертизы цифровых данных, аудио, видео, документов и переписок.
            </p>
            <div className="flex gap-4">
              <button
                onClick={scrollToOrder}
                className="bg-blue-600 text-white px-8 py-4 rounded font-bold hover:bg-blue-500 transition"
              >
                Заказать экспертизу
              </button>
              <button className="border border-slate-700 px-8 py-4 rounded font-bold hover:bg-slate-800 transition">
                Скачать презентацию
              </button>
            </div>
          </div>
          <div className="bg-[#0b1624] border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl"></div>
            <div className="relative">
              <div className="text-xs text-slate-500 mb-3">Интерфейс лабораторного анализа</div>
              <img
                src="/assets/evidence/forensic-lab-analysis-interface.png"
                alt="Forensic lab analysis interface"
                className="w-full h-auto rounded-xl border border-slate-800"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-800 mb-24">
          {[
            { label: 'экспертов в штате', value: '45+' },
            { label: 'опыта работы', value: '15 лет' },
            { label: 'экспертиз проведено', value: '1200+' },
            { label: 'юридическая чистота', value: '100%' }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12">Наши экспертизы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {servicesGrid.map((service, index) => (
              <div
                key={index}
                className="bg-[#0b1624] border border-slate-800 p-8 rounded-xl hover:border-blue-500/50 transition group"
              >
                <service.icon className="text-blue-500 mb-6 group-hover:scale-110 transition" size={32} />
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{service.desc}</p>
                <a href="#" className="text-blue-400 flex items-center gap-2 text-sm font-bold">
                  Подробнее <ChevronRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>

        <section ref={orderRef} className="mb-24 scroll-mt-24">
          <div
            className={`${embedded ? 'w-full' : 'max-w-2xl mx-auto'} bg-[#0b1624] p-10 border border-slate-800 rounded-2xl shadow-xl`}
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-white">Оставить заявку</h2>
              {loading && (
                <div className="text-xs text-slate-400 border border-slate-800 bg-slate-900/40 rounded-full px-3 py-1">
                  Анализ в процессе…
                </div>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                placeholder="Объект исследования"
                value={researchObject}
                onChange={(e) => setResearchObject(e.target.value)}
              />
              <input
                className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                placeholder="Инициатор (Агентство)"
                value={initiatorAgency}
                onChange={(e) => setInitiatorAgency(e.target.value)}
              />
              <select
                className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                value={suspect}
                onChange={(e) => setSuspect(e.target.value)}
              >
                {CASE_FIGURANTS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <textarea
                className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded h-32 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                placeholder="Краткое описание задачи (опционально)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              {loading && (
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-4">
                  <div className="flex items-center gap-3 text-blue-200 font-semibold">
                    <Loader2 className="animate-spin" size={18} />
                    Запущена дактилоскопическая сверка AFIS…
                  </div>
                  <div className="mt-2 text-sm text-slate-300/90 animate-pulse">
                    Идет спектральный анализ улик
                    <span className="inline-block w-6">…</span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-blue-600 to-cyan-400 animate-pulse" />
                  </div>
                </div>
              )}

              <button
                disabled={loading}
                className={[
                  'w-full text-white p-4 font-bold rounded transition',
                  loading
                    ? 'bg-blue-600/60 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500'
                ].join(' ')}
              >
                ОТПРАВИТЬ ЗАЯВКУ
              </button>

              {!loading && result !== null && (
                <div className="mt-6 p-4 bg-slate-900 border border-blue-500/30 rounded text-sm">
                  {result}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-[#08101a] py-12">
        <div className={`${containerClass} text-sm text-slate-600 flex justify-between`}>
          <p>© 2026 Экспертно-криминалистический центр «ЭКЦ‑ПРО»</p>
          <p>Лицензия ФСБ № ЛСЗ-2025-00871</p>
        </div>
      </footer>

    </div>
  )
}
