import React, { useState, useRef, useEffect } from 'react'

import './MailApp.css'

import { createPortal } from 'react-dom'

import { saveFileToDesktop } from '../utils/fileActions'
import { INSURANCE_POLICIES_DOCUMENT } from '../data/insurancePolicyContent'
import { isRivertonInsuranceComplete } from '../utils/rivertonInsuranceQuest'
import {
  createVesperInsuranceHintMail,
  isVesperInsuranceHintMailUnlocked,
  VESPER_INSURANCE_HINT_MAIL_ID,
} from '../utils/vesperInsuranceHintMail'
import {
  createMillerAlibiMemoMail,
  createSlateCourtOrderMail,
  createSlateEvidenceMail,
  unlockMillerAlibiMemoMail,
  unlockSlateEvidenceMail,
  SLATE_EVIDENCE_MAIL_ID,
} from '../utils/insuranceSuccessMail'
import { useInvestigation } from '../utils/investigationSystem'





/* ═══════════════════════════════════════

   DATA

═══════════════════════════════════════ */

const getInitialMails = (playerData) => [
  {
    id: 1,
    folder: 'inbox',
    tab: 'primary',
    starred: false,
    read: false,
    from: {
      name: 'Дэвид Слейт',
      email: 'd.slate@ashford-pd.gov',
      avatar: '👮'
    },
    subject: 'Инструктаж по делу',
    preview: `${playerData?.firstName || 'Детектив'}, все материалы по делу №DT-2025-06-21-SB загружены в систему. Ознакомьтесь...`,
    date: '09:03',

    body: `Добро пожаловать, детектив ${playerData?.fullName || ''}.

Вы вошли в систему Dark Trace.

Первое дело уже ожидает вас.
Ознакомьтесь с письмом.

И помните: правда редко лежит на поверхности.


Данные для доступа к системе:
Username: agent
Password: 12345


— Дэвид Слейт
`,

    attachments: [
      {
        id: 'mail-att-001',
        name: 'Приветственное письмо.jpg',
        type: 'image',

        size: '2.4 МБ',

        icon: '🖼️',

        url: '/assets/images/case-file.jpg',

        downloadable: true,

        saveToDesktop: true

      }

    ]

  },

  {
    id: 999,
    folder: 'inbox', 
    tab: 'primary', 
    starred: false, 
    read: false,
    hidden: true,
    triggerStage: 'starter_folder',
    from: { 
      name: 'Дэвид Слейт',
      email: 'd.slate@ashford-pd.gov',
      avatar: '👮' 
    },
    subject: 'НОВЫЕ МАТЕРИАЛЫ: Улики и показания',
    preview: 'Детектив, отличная работа с досье. Я разблокировал доступ к новым материалам...',
    date: '10:15',
    body: `Детектив,

Отличная работа с анализом личного состава. Это дало нам необходимую базу.

Как и обещал, я разблокировал доступ к новым материалам дела. В системе Dark Trace теперь доступны:
- Фотографии с места происшествия (Раздел "Улики")
- Первичные протоколы допросов (Раздел "Показания")
- Дополнительные отчеты экспертов

Ваша следующая задача:
1. Изучить все новые фотографии в архиве улик.
2. Сопоставить их с показаниями свидетелей.

Старые файлы остаются доступны в архиве. Продолжайте копать.

— Дэвид Слейт
Шеф-детектив`,
    attachments: []
  },






  {
    id: 10,
    folder: 'inbox',
    tab: 'primary',
    starred: false,
    read: false,
    hidden: true,
    triggerStage: 'envelope_2',
    envelope: 2,
    from: {
      name: 'ОТЧЕТ IT-ОТДЕЛА',
      email: 'it-dept@dark-trace.gov',
      avatar: '💻'
    },
    subject: 'Анализ сетевой активности Эвана Андервуда (период: 01.01.2025 - 21.06.2025)',
    preview: 'РЕЗЮМЕ: Анализ данных, полученных из нескольких анонимных источников в даркнете, показал регулярную и нарастающую активность Э. Андервуда...',
    date: '14:30',
    body: `ДЕЛО №: DT-2025-06-21-SB
ОТЧЕТ IT-ОТДЕЛА
Анализ сетевой активности Эвана Андервуда
Период: 01.01.2025 - 21.06.2025

РЕЗЮМЕ:
Анализ данных, полученных из нескольких анонимных источников в даркнете, показал регулярную и нарастающую активность Э. Андервуда на нелицензированных платформах для онлайн-гемблинга (онлайн-покер, ставки на спорт).

КЛЮЧЕВЫЕ НАХОДКИ:
- Общая сумма проигрыша: За указанный период превышает $100,000.
- Динамика: Активность резко возросла в последние три месяца, зафиксированы множественные попытки взять краткосрочные онлайн-кредиты на сомнительных ресурсах под высокий процент.

ВЫВОД:
Субъект находится в состоянии острой лудомании и испытывает серьезные финансовые трудности, о которых, предположительно, не осведомлена его семья.

ОТЧЕТ ПОДГОТОВЛЕН: IT-отдел Dark Trace
ДАТА: 22.06.2025`,
    attachments: []
  },

  {
    id: 11,
    folder: 'inbox',
    tab: 'primary',
    starred: false,
    read: false,
    hidden: true,
    triggerStage: 'envelope_3',
    envelope: 3,
    from: {
      name: 'ГАЛЕРЕЯ "ХРАНИЛИЩЕ" Искусство Конфиденциальности',
      email: 'archive@hранилище-gallery.ru',
      avatar: '🏛️'
    },
    subject: 'АКТ ПРИЕМА-ПЕРЕДАЧИ № 734',
    preview: 'г. Ривертон, Переулок Коллекционеров, д. 1 | Дата: 21 июня 2025 г.',
    date: '17:00',
    body: `ГАЛЕРЕЯ "ХРАНИЛИЩЕ" Искусство Конфиденциальности
г. Ривертон, Переулок Коллекционеров, д. 1

АКТ ПРИЕМА-ПЕРЕДАЧИ № 734
ДАТА: 21 июня 2025 г.

Настоящим подтверждается передача следующих ценностей:

ПРИНЯЛ:
- Аларик Равенсвуд (представитель частной коллекции "Феникс")

ПЕРЕДАЛ:
- Галерея "Хранилище" (официальный архив хранения)

ПРЕДМЕТ ТРАНЗАКЦИИ:
- Коллекция живописных работ (детали в приложении)
- Документы о праве временного хранения
- Сертификаты подлинности

УСЛОВИЯ ХРАНЕНИЯ:
- Срок: до дальнейшего уведомления
- Место хранения: Сектор 7, Хранилище уровня А
- Страхование: по полной рыночной стоимости

Подписи сторон:
_____________________
Аларик Равенсвуд

_____________________
Администратор галереи

Печать: ГАЛЕРЕЯ "ХРАНИЛИЩЕ"`,
    attachments: [
      {
        id: 'mail-att-gallery-734',
        fileId: 'gallery_transfer_record',
        name: 'Gallery_Transfer_Record_734.png',
        type: 'image',
        size: '2.1 МБ',
        icon: '🖼️',
        url: '/assets/evidence/Gallery_Transfer_Record_734.png',
        downloadable: true,
        saveToDesktop: true
      }
    ]
  },

  {

    id: 5, 

    folder: 'inbox', 

    tab: 'primary', 

    starred: false, 

    read: false,

    hidden: true,

    from: { 

      name: 'Детектив Джон Миллер', 

      email: 'jmiller@rivertonpd.gov', 

      avatar: '👮' 

    },

    subject: 'ПРЕДВАРИТЕЛЬНЫЙ РАПОРТ О ПРОИСШЕСТВИИ (Дело №DT-2025-06-21-SB)',

    preview: 'Детектив, направляю вам скан предварительного рапорта о происшествии по делу №DT-2025...',

    date: '09:13',

    body: `Детектив,



Направляю вам скан предварительного рапорта о происшествии по делу №DT-2025-06-21-SB для ознакомления.



Все материалы, полученные на данный момент, приложены к письму.



— Детектив Джон Миллер

Департамент полиции города Ривертон`,

    attachments: [

      {

        id: 'mail-att-002',

        name: 'Riverton_PD_Incident_Report_0078.pdf',

        type: 'pdf',

        size: '2.4 МБ',

        icon: '📄',

        url: '/assets/images/Riverton_PD_Incident_Report_0078.jpg',

        downloadable: true,

        saveToDesktop: true

      },

      {

        id: 'mail-att-003',

        name: 'Заметка с телефона.jpg',

        type: 'image',

        size: '1.8 МБ',

        icon: '🖼️',

        url: '/assets/images/phone_note_final.jpg',

        downloadable: true,

        saveToDesktop: true

      }

    ],

  },

  {
    id: 7,
    folder: 'inbox',
    tab: 'primary',
    starred: false,
    read: false,
    hidden: true,
    from: {
      name: 'Архив Riverton Insurance',
      email: 'archive@riverton-insurance.com',
      avatar: '🏛️',
    },
    subject: 'RE: Официальный запрос документов [ID-991026]',
    preview:
      'В ответ на ваш официальный запрос от лица Детективного агентства Dark Trace направляем архивные материалы…',
    date: '15:14',
    body: `Уважаемый детектив,

В ответ на ваш официальный запрос от лица Детективного агентства Dark Trace (код авторизации DT-78823) направляем затребованные архивные материалы.

Системой были обнаружены синхронизированные копии договоров по программе страхования жизни „Семейный Щит 1+1“ на имя Блэк С. и Андервуда Э., оформленные 15 июня 2025 года.

Электронные копии документов прикреплены к данному письму во вложении.

С уважением,
Отдел комплаенса и архивного учета Riverton Insurance`,
    attachments: [
      {
        id: 'riverton-att-policy-selena',
        name: 'insurance_policy_selena.png',
        type: 'image',
        size: '1.2 МБ',
        icon: '🖼️',
        url: '/assets/images/documents/insurance_policy_selena.png',
        downloadable: true,
        saveToDesktop: true
      },
      {
        id: 'riverton-att-policy-evan',
        name: 'insurance_policy_evan.png',
        type: 'image',
        size: '1.2 МБ',
        icon: '🖼️',
        url: '/assets/images/documents/insurance_policy_evan.png',
        downloadable: true,
        saveToDesktop: true
      },
    ],
  },

  {

    id: 6,

    folder: 'inbox',

    tab: 'primary',

    starred: false,

    read: false,

    hidden: true,

    from: {

      name: 'Веспер Уэйнрайт',

      email: 'v.wainright@ashford-witness.onion',

      avatar: '👥'

    },

    subject: 'ВАЖНО: Дополнительные улики. Скриншоты переписки.',

    preview: 'Высылаю все материалы, которые есть у меня на данный момент',

    date: '15:15',

    body: `Детектив,

высылаю все материалы, которые есть у меня на данный момент.

Вложения содержат скриншоты переписки Селены и Эвана. После ее смерти я перечитала сообщения снова… некоторые из них теперь выглядят совсем иначе.

Спасибо, что согласились расследовать это дело.
Надеюсь, вы найдете того, кто сделал это.

— Веспер Уэйнрайт
`,

    attachments: [

      {

        id: 'vesper-att-001',

        name: 'Переписка_2025-06-20_01.jpg',

        type: 'image',

        size: '1.2 МБ',

        icon: '🖼️',

        url: '/assets/mail/vesper/vesper_chat_01.jpg',

        downloadable: true,

        saveToDesktop: true

      },

      {

        id: 'vesper-att-002',

        name: 'Переписка_2025-06-20_02.jpg',

        type: 'image',

        size: '1.1 МБ',

        icon: '🖼️',

        url: '/assets/mail/vesper/vesper_chat_02.jpg',

        downloadable: true,

        saveToDesktop: true

      },

      {

        id: 'vesper-att-003',

        name: 'Переписка_2025-06-20_03.jpg',

        type: 'image',

        size: '1.3 МБ',

        icon: '🖼️',

        url: '/assets/mail/vesper/vesper_chat_03.jpg',

        downloadable: true,

        saveToDesktop: true

      },

      {

        id: 'vesper-att-004',

        name: 'Переписка_2025-06-20_04.jpg',

        type: 'image',

        size: '1.0 МБ',

        icon: '🖼️',

        url: '/assets/mail/vesper/vesper_chat_04.jpg',

        downloadable: true,

        saveToDesktop: true

      }

    ]

  },

  createVesperInsuranceHintMail(),

]



const FOLDERS = [

  { id: 'inbox',   label: 'Входящие',     icon: InboxIcon },

  { id: 'starred', label: 'Помеченные',   icon: StarIcon },

  { id: 'snoozed', label: 'Отложенные',   icon: ClockIcon },

  { id: 'sent',    label: 'Отправленные', icon: SendIcon },

  { id: 'drafts',  label: 'Черновики',    icon: DraftIcon },

  { id: 'trash',   label: 'Корзина',      icon: TrashIcon },

]



const TABS = [

  { id: 'primary', label: 'Несортированные', icon: '📥' },

  { id: 'promos',  label: 'Промоакции',      icon: '🏷️',  },

  { id: 'social',  label: 'Соцсети',         icon: '👥' },

]



/* ═══════════════════════════════════════

   SVG ICONS (inline, no dependencies)

═══════════════════════════════════════ */

function InboxIcon() {

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>

}

function StarIcon() {

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>

}

function ClockIcon() {

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

}

function SendIcon() {

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>

}

function DraftIcon() {

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>

}

function TrashIcon() {

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>

}

function SearchIcon() {

  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

}

function SettingsIcon() {

  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>

}

function ExpandIcon() {

  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>

}

function EmojiIcon() {

  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>

}

function ReplyIcon() {

  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>

}

function ForwardIcon() {

  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 014-4h12"/></svg>

}

function MoreIcon() {

  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>

}

function AttachIcon() {

  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>

}

function MenuIcon() {

  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>

}

function PenIcon() {

  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>

}



/* ═══════════════════════════════════════

   AVATAR COMPONENT

═══════════════════════════════════════ */

const AVATAR_COLORS = [

  '#e94560','#4f8ef7','#34a853','#fbbc04',

  '#ea4335','#673ab7','#ff6d00','#00bcd4',

]



function Avatar({ name, emoji, size = 36 }) {

  if (emoji) return (

    <div className="mail-avatar-emoji" style={{ width: size, height: size, fontSize: size * 0.5 }}>

      {emoji}

    </div>

  )

  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (

    <div className="mail-avatar-letter" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>

      {initials}

    </div>

  )

}



/* ═══════════════════════════════════════

   COMPOSE WINDOW

═══════════════════════════════════════ */

function ComposeModal({ onClose }) {

  const [to,      setTo]      = useState('')

  const [subject, setSubject] = useState('')

  const [body,    setBody]    = useState('')

  const [sent,    setSent]    = useState(false)

  const [minimized, setMin]   = useState(false)



  function send() {

    if (!to.trim()) return

    setSent(true)

    setTimeout(onClose, 1500)

  }



  return (

    <div className={`compose-modal ${minimized ? 'compose-minimized' : ''}`}>

      <div className="compose-topbar" onClick={() => minimized && setMin(false)}>

        <span className="compose-topbar-title">Новое письмо</span>

        <div className="compose-topbar-actions">

          <button onClick={e => { e.stopPropagation(); setMin(m => !m) }}>─</button>

          <button onClick={e => { e.stopPropagation(); /* expand */ }}>⤢</button>

          <button onClick={onClose}>✕</button>

        </div>

      </div>



      {!minimized && (

        <>

          {sent ? (

            <div className="compose-sent-msg">

              <span className="compose-sent-check">✓</span>

              Письмо отправлено

            </div>

          ) : (

            <>

              <div className="compose-field-row">

                <input className="compose-field-input" placeholder="Кому" value={to} onChange={e => setTo(e.target.value)} />

              </div>

              <div className="compose-field-row">

                <input className="compose-field-input" placeholder="Тема" value={subject} onChange={e => setSubject(e.target.value)} />

              </div>

              <textarea

                className="compose-textarea"

                placeholder="Напишите письмо..."

                value={body}

                onChange={e => setBody(e.target.value)}

              />

              <div className="compose-bottom-bar">

                <button className="compose-send-btn" onClick={send}>Отправить</button>

                <div className="compose-bottom-tools">

                  <button className="compose-tool-icon" title="Прикрепить файл"><AttachIcon /></button>

                  <button className="compose-tool-icon" title="Эмодзи"><EmojiIcon /></button>

                </div>

                <button className="compose-delete-btn" onClick={onClose} title="Удалить">🗑</button>

              </div>

            </>

          )}

        </>

      )}

    </div>

  )

}



/* ═══════════════════════════════════════

   READING PANE

═══════════════════════════════════════ */

function ReadingPane({ mail, onStar, onDelete, onBack, onOpenFile }) {

  if (!mail) {

    return (

      <div className="reading-empty">

        <div className="reading-empty-illustration">

          <div className="reading-empty-icon">📭</div>

        </div>

        <p className="reading-empty-text">Выберите письмо для чтения</p>

      </div>

    )

  }



  return (

    <div className="reading-pane">

      {/* Subject */}

      <div className="reading-header">

        <div className="reading-subject-row">

          <h2 className="reading-subject">{mail.subject}</h2>

          <div className="reading-labels">

            {!mail.read && <span className="reading-label new">Новое</span>}

            {mail.from.email.includes('.onion') && <span className="reading-label danger">⚠ Анонимно</span>}

          </div>

        </div>



        {/* Sender row */}

        <div className="reading-sender-row">

          <Avatar name={mail.from.name} emoji={mail.from.avatar} size={40} />

          <div className="reading-sender-info">

            <div className="reading-sender-name-row">

              <span className="reading-sender-name">{mail.from.name}</span>

              <span className="reading-sender-email">&lt;{mail.from.email}&gt;</span>

            </div>

            <div className="reading-sender-to">Кому: я &nbsp;·&nbsp; {mail.date}</div>

          </div>

          <div className="reading-header-actions">

            <button

              className={`reading-action-btn ${mail.starred ? 'starred' : ''}`}

              onClick={() => onStar(mail.id)}

              title="Отметить"

            >★</button>

            <button className="reading-action-btn" onClick={() => onDelete(mail.id)} title="Удалить">🗑</button>

          </div>

        </div>

      </div>



      {/* Body */}

      <div className="reading-body">

        <div className="reading-body-text">{mail.body}</div>



        {/* Attachments */}

        {mail.attachments?.length > 0 && (

          <div className="reading-attachments">

            <div className="reading-attachments-label">Вложения ({mail.attachments.length})</div>

            <div className="reading-attachments-list">

              {mail.attachments.map((att, i) => (

                <div

  key={i}

  className="reading-attachment-chip"

  onClick={() => onOpenFile(att)}

  style={{ cursor: 'pointer' }}

>

                  <span className="att-icon">{att.icon}</span>

                  <div>

                    <div className="att-name">{att.name}</div>

                    <div className="att-size">{att.size}</div>

                  </div>

                  {att.downloadable && (

                    <button 

                      className="att-download-btn"

                      onClick={(e) => {

                        e.stopPropagation()

                        saveFileToDesktop(att, () => {

                          window.dispatchEvent(new Event('savedFilesChanged'))

                        })

                      }}

                      title="Скачать"

                    >

                      ⬇️

                    </button>

                  )}

                </div>

              ))}

            </div>

          </div>

        )}

      </div>



      {/* Reply bar */}

      <div className="reading-reply-bar">

        <button className="reading-reply-btn"><ReplyIcon /> Ответить</button>

        <button className="reading-reply-btn"><ForwardIcon /> Переслать</button>

        <button className="reading-reply-btn icon-only"><MoreIcon /></button>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   LOGIN SCREEN

═══════════════════════════════════════ */

function LoginScreen({ onLogin }) {

  const [login, setLogin] = useState('')

  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const [showLoadingScreen, setShowLoadingScreen] = useState(false)

  const [showPasswordHint, setShowPasswordHint] = useState(false)



  const handleSubmit = async (e) => {

    e.preventDefault()

    setIsLoading(true)

    setError('')



    // Имитация проверки авторизации

    setTimeout(() => {

      if (login === 'Detectiv' && password === '12345') {

        // Показываем LoadingScreen перед переходом к почте

        setShowLoadingScreen(true)

        setTimeout(() => {

          onLogin()

        }, 2000) // 2 секунды показываем загрузку

      } else {

        setError('Неверный логин или пароль')

        setIsLoading(false)

      }

    }, 500)

  }



  if (showLoadingScreen) {

    return <LoadingScreen />

  }



  return (

    <div className="login-screen" style={{

      display: 'flex',

      alignItems: 'center',

      justifyContent: 'center',

      height: '100%',

      background: '#131314'

    }}>

      <div className="login-container" style={{

        background: '#1d1d1f',

        border: '1px solid rgba(255,255,255,0.08)',

        borderRadius: '8px',

        padding: '40px',

        width: '320px',

        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'

      }}>

        <div className="login-header">

          <div className="login-logo">✉</div>

          <h1 className="login-title">OneMail</h1>

          <p className="login-subtitle">Система безопасной почты</p>

        </div>



        <form className="login-form" onSubmit={handleSubmit}>

          <div className="login-field">

            <label className="login-label">Логин</label>

            <input

              type="text"

              className="login-input"

              value={login}

              onChange={(e) => setLogin(e.target.value)}

              placeholder="Введите логин"

              required

            />

          </div>



          <div className="login-field">

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              <label className="login-label">Пароль</label>

              <div 

                className="password-hint-icon" 

                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}

                onMouseEnter={() => setShowPasswordHint(true)}

                onMouseLeave={() => setShowPasswordHint(false)}

              >

                <span style={{ fontSize: '14px' }}>❓</span>

                <span style={{ fontSize: '14px' }}>🔑</span>

                {showPasswordHint && (

                  <div style={{

                    position: 'absolute',

                    bottom: '100%',

                    right: 0,

                    background: '#292a2d',

                    color: '#e8eaed',

                    padding: '8px 12px',

                    borderRadius: '6px',

                    fontSize: '12px',

                    whiteSpace: 'nowrap',

                    marginBottom: '6px',

                    border: '1px solid #3c4043',

                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',

                    zIndex: 10

                  }}>

                    Сохранил в надежном месте

                  </div>

                )}

              </div>

            </div>

            <input

              type="password"

              className="login-input"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              placeholder="Введите пароль"

              required

            />

          </div>



          {error && <div className="login-error">{error}</div>}



          <button 

            type="submit" 

            className="login-button"

            disabled={isLoading}

          >

            {isLoading ? 'Вход...' : 'Войти'}

          </button>

        </form>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   LOADING SCREEN (OneMail Style)

═══════════════════════════════════════ */

function LoadingScreen() {

  return (

    <div className="loading-screen" style={{

      position: 'absolute',

      top: 0,

      left: 0,

      right: 0,

      bottom: 0,

      display: 'flex',

      flexDirection: 'column',

      alignItems: 'center',

      justifyContent: 'center',

      background: '#202124',

      zIndex: 1000

    }}>

      <div className="onemail-loader-container" style={{

        display: 'flex',

        flexDirection: 'column',

        alignItems: 'center',

        gap: '20px'

      }}>

        {/* Анимированный логотип OneMail - красный конверт */}

        <div className="onemail-logo-animated" style={{

          fontSize: '80px',

          color: '#ea4335',

          animation: 'logoPulse 2s ease-in-out infinite',

          filter: 'drop-shadow(0 0 20px rgba(234, 67, 53, 0.5))'

        }}>

          ✉

        </div>

        

        {/* Название OneMail */}

        <h1 style={{

          color: '#e8eaed',

          fontSize: '32px',

          fontWeight: 500,

          fontFamily: "'Googel Sans', 'Segoe UI', sans-serif",

          margin: 0,

          letterSpacing: '-0.5px'

        }}>

          OneMail

        </h1>

        

        {/* Прогресс бар */}

        <div className="loading-progress" style={{

          width: '200px',

          height: '3px',

          background: '#3c4043',

          borderRadius: '2px',

          overflow: 'hidden',

          marginTop: '16px'

        }}>

          <div className="loading-progress-bar" style={{

            height: '100%',

            width: '40%',

            background: '#c2e7ff',

            borderRadius: '2px',

            animation: 'progressMove 1.5s ease-in-out infinite'

          }}/>

        </div>

        

        {/* Текст загрузки */}

        <p style={{

          color: '#9aa0a6',

          fontSize: '14px',

          fontFamily: "'Googel Sans', 'Segoe UI', sans-serif",

          margin: 0,

          marginTop: '12px'

        }}>

          Загрузка почты...

        </p>

      </div>

    </div>

  )

}



/* ═══════════════════════════════════════

   MAIN COMPONENT

═══════════════════════════════════════ */

export default function MailApp({ onNotificationRead, onSecondMailArrived, playerData }) {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {

    return sessionStorage.getItem('mailApp_loggedIn') === 'true'

  })

  const [openedFile, setOpenedFile] = useState(null);

  const [imageDimensions, setImageDimensions] = useState({ width: 700, height: 600 });

  const [zoom, setZoom] = useState(1);

  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);

   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

   const { markFileAsReviewed } = useInvestigation();

   function handleOpenFile(file) {
    setOpenedFile(file)
    setZoom(1)
    setPan({ x: 0, y: 0 })

    // Mark file as reviewed if it has a fileId
    if (file.fileId) {
      markFileAsReviewed(file.fileId)
    }

    if (file.content) {
      setImageDimensions({
        width: Math.min(720, window.innerWidth - 80),
        height: Math.min(560, window.innerHeight - 80),
      })
      return
    }

    const img = new Image()
    img.onload = () => {
      const maxWidth = Math.min(img.width + 40, window.innerWidth - 100)
      const maxHeight = Math.min(img.height + 80, window.innerHeight - 100)
      setImageDimensions({ width: maxWidth, height: maxHeight })
    }
    img.src = file.url
  }



  function handleWheel(e) {

    e.preventDefault()

    const delta = e.deltaY > 0 ? -0.1 : 0.1

    setZoom(prev => Math.max(0.5, Math.min(5, prev + delta)))

  }



  function handleMouseDown(e) {

    if (e.button === 0) { // Левая кнопка мыши

      e.preventDefault()

      setIsDragging(true)

      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })

    }

  }



  function handleMouseMove(e) {

    if (isDragging) {

      e.preventDefault()

      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })

    }

  }



  function handleMouseUp() {

    setIsDragging(false)

  }

  const [mails, setMails] = useState(() => {

    const savedMails = sessionStorage.getItem('mailApp_mails')

    const secondMailShown = sessionStorage.getItem('secondMailShown') === 'true'

    let initialMails = getInitialMails(playerData)

    if (savedMails) {

      const parsed = JSON.parse(savedMails)

      initialMails = parsed.some(m => m.id === VESPER_INSURANCE_HINT_MAIL_ID)
        ? parsed
        : [...parsed, createVesperInsuranceHintMail()]

      initialMails = initialMails.map(mail =>

        mail.id === 5 && secondMailShown ? { ...mail, hidden: false } : mail

      )

    }

    if (isRivertonInsuranceComplete()) {
      const rivertonMailIndex = initialMails.findIndex(mail => mail.id === 7)
      if (rivertonMailIndex !== -1) {
        const rivertonMail = { ...initialMails[rivertonMailIndex], hidden: false }
        initialMails = initialMails.filter(mail => mail.id !== 7)
        initialMails.unshift(rivertonMail)
      }
    }

    if (isVesperInsuranceHintMailUnlocked()) {
      const vesperMailIndex = initialMails.findIndex(mail => mail.id === VESPER_INSURANCE_HINT_MAIL_ID)
      if (vesperMailIndex !== -1) {
        const vesperMail = { ...initialMails[vesperMailIndex], hidden: false }
        initialMails = initialMails.filter(mail => mail.id !== VESPER_INSURANCE_HINT_MAIL_ID)
        initialMails.unshift(vesperMail)
      }
    }

    // Check for pending investigation emails from progression system
    const pendingEmail = localStorage.getItem('pendingInvestigationEmail')
    if (pendingEmail) {
      try {
        const emailData = JSON.parse(pendingEmail)
        // Check if this email hasn't been added yet
        const emailExists = initialMails.some(m => m.subject === emailData.subject && m.from.name === emailData.from.name)
        if (!emailExists) {
          initialMails = [emailData, ...initialMails]
          // Clear the pending email after injecting
          localStorage.removeItem('pendingInvestigationEmail')
        }
      } catch (e) {
        console.error('Failed to parse pending investigation email:', e)
      }
    }

    return initialMails

  })

  const [folder,      setFolder]      = useState('inbox')

  const [tab,         setTab]         = useState('primary')

  const [selectedId,  setSelectedId]  = useState(null)

  const [search,      setSearch]      = useState('')

  const [compose,     setCompose]     = useState(false)

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [isAppLoading, setIsAppLoading] = useState(false)

  const [secondMailShown, setSecondMailShown] = useState(() => {

    return sessionStorage.getItem('secondMailShown') === 'true'

  })

  const timerRef = useRef(null)
  const vesperEmailSent = useRef(false)
  const secondMailOpenedRef = useRef(false)



  // Handle investigation stage completions
  useEffect(() => {
    const handleStageComplete = (e) => {
      const { stageId } = e.detail;

      // Look for hidden mails that should be triggered by this stage
      setMails(prev => {
        const hasTriggeredMail = prev.some(m => m.triggerStage === stageId && m.hidden);
        if (!hasTriggeredMail) return prev;
        
        // Show the notification via callback
        if (onSecondMailArrived) {
          // Small delay for dramatic effect
          setTimeout(() => {
            onSecondMailArrived();
            const audio = new Audio('/assets/sounds/notification.mp3');
            audio.play().catch(() => {});
          }, 1500);
        }
        
        return prev.map(m => 
          m.triggerStage === stageId ? { ...m, hidden: false } : m
        );
      });
    };

    window.addEventListener('dt_stage_completed', handleStageComplete);
    return () => window.removeEventListener('dt_stage_completed', handleStageComplete);
  }, [onSecondMailArrived]);

  useEffect(() => {
    const revealRivertonMail = () => {
      setMails(prev => {
        const hasMail = prev.some(m => m.id === 7)
        if (!hasMail) return prev
        const alreadyVisible = prev.some(m => m.id === 7 && !m.hidden)
        if (alreadyVisible) return prev
        return prev.map(m => (m.id === 7 ? { ...m, hidden: false, read: false } : m))
      })
      if (onSecondMailArrived) {
        setTimeout(() => {
          onSecondMailArrived()
          const audio = new Audio('/assets/sounds/notification.mp3')
          audio.play().catch(() => {})
        }, 400)
      }
    }

    window.addEventListener('dt_riverton_insurance_complete', revealRivertonMail)
    return () => window.removeEventListener('dt_riverton_insurance_complete', revealRivertonMail)
  }, [onSecondMailArrived])

  useEffect(() => {
    const revealVesperInsuranceHint = () => {
      setMails(prev => {
        const hasMail = prev.some(m => m.id === VESPER_INSURANCE_HINT_MAIL_ID)
        if (!hasMail) return prev
        const alreadyVisible = prev.some(
          m => m.id === VESPER_INSURANCE_HINT_MAIL_ID && !m.hidden
        )
        if (alreadyVisible) return prev
        return prev.map(m =>
          m.id === VESPER_INSURANCE_HINT_MAIL_ID ? { ...m, hidden: false, read: false } : m
        )
      })
      if (onSecondMailArrived) {
        setTimeout(() => {
          onSecondMailArrived({
            title: 'OneMail',
            text: 'Новое сообщение: Дополнение к моим показаниям / Важная деталь',
          })
          const audio = new Audio('/assets/sounds/notification.mp3')
          audio.play().catch(() => {})
        }, 500)
      }
    }

    window.addEventListener('dt_envelope1_unlocked', revealVesperInsuranceHint)
    return () => window.removeEventListener('dt_envelope1_unlocked', revealVesperInsuranceHint)
  }, [onSecondMailArrived])

  useEffect(() => {
    const revealITReport = () => {
      setMails(prev => {
        const hasITReport = prev.some(m => m.id === 10)
        if (hasITReport) {
          return prev.map(m => m.id === 10 ? { ...m, hidden: false } : m)
        }
        return prev
      })
      const audio = new Audio('/assets/sounds/notification.mp3')
      audio.play().catch(() => {})
    }

    window.addEventListener('dt_envelope2_unlocked', revealITReport)
    return () => window.removeEventListener('dt_envelope2_unlocked', revealITReport)
  }, [])

  useEffect(() => {
    const revealEnvelope3Mail = () => {
      setMails(prev => {
        const hasEnvelope3Mail = prev.some(m => m.id === 11)
        if (hasEnvelope3Mail) {
          return prev.map(m => m.id === 11 ? { ...m, hidden: false } : m)
        }
        return prev
      })
      const audio = new Audio('/assets/sounds/notification.mp3')
      audio.play().catch(() => {})
    }

    window.addEventListener('dt_envelope3_unlocked', revealEnvelope3Mail)
    return () => window.removeEventListener('dt_envelope3_unlocked', revealEnvelope3Mail)
  }, [])

  useEffect(() => {
    const checkEnvelope2AndReveal = () => {
      try {
        const currentEnvelope = localStorage.getItem('dt_current_envelope')
        if (currentEnvelope === '2') {
          setMails(prev => {
            const hasITReport = prev.some(m => m.id === 10)
            if (hasITReport) {
              return prev.map(m => m.id === 10 ? { ...m, hidden: false } : m)
            }
            return prev
          })
        }
        // Check for envelope 3
        if (currentEnvelope === '3') {
          setMails(prev => {
            const hasEnvelope3Mail = prev.some(m => m.id === 11)
            if (hasEnvelope3Mail) {
              return prev.map(m => m.id === 11 ? { ...m, hidden: false } : m)
            }
            return prev
          })
        }
      } catch {
        // ignore errors
      }
    }

    checkEnvelope2AndReveal()
    const interval = setInterval(checkEnvelope2AndReveal, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const unread = mails.filter(m => m.folder === 'inbox' && !m.read && !m.hidden).length
    window.dispatchEvent(
      new CustomEvent('mailApp_unread_count', { detail: { count: unread } })
    )
  }, [mails])

  // Сохраняем письма в sessionStorage при каждом изменении


  useEffect(() => {

    sessionStorage.setItem('mailApp_mails', JSON.stringify(mails))

  }, [mails])



  // Очищаем sessionStorage только при page reload (F5), не при закрытии браузера

  useEffect(() => {

    const handleBeforeUnload = (e) => {

      // Проверяем тип события - page reload vs browser close

      const performanceEntries = performance.getEntriesByType('navigation')

      const isReload = performanceEntries.length > 0 && 

                       performanceEntries[0].type === 'reload'

      

      if (isReload) {

        // Только при F5/reload очищаем состояние

        sessionStorage.removeItem('mailApp_mails')

        sessionStorage.removeItem('mailApp_loggedIn')

        sessionStorage.removeItem('secondMailShown')

      }

    }



    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {

      window.removeEventListener('beforeunload', handleBeforeUnload)

    }

  }, [])



  if (!isLoggedIn) {

    return <LoginScreen onLogin={() => {

      setIsLoggedIn(true)

      sessionStorage.setItem('mailApp_loggedIn', 'true')

      setIsAppLoading(true)

      setTimeout(() => setIsAppLoading(false), 1500)

    }} />

  }



  // Показываем LoadingScreen при первой загрузке

  if (isAppLoading) {

    return <LoadingScreen />

  }



  /* ── Filter ── */

  const folderMails = (() => {

    if (folder === 'starred') return mails.filter(m => m.starred && !m.hidden)

    if (folder === 'trash')   return mails.filter(m => m.folder === 'trash' && !m.hidden)

    if (folder === 'sent')    return mails.filter(m => m.folder === 'sent' && !m.hidden)

    if (folder === 'drafts')  return mails.filter(m => m.folder === 'drafts' && !m.hidden)

    return mails.filter(m => m.folder === 'inbox' && m.tab === tab && !m.hidden)

  })()



  const displayMails = search

    ? folderMails.filter(m =>

        m.from.name.toLowerCase().includes(search.toLowerCase()) ||

        m.subject.toLowerCase().includes(search.toLowerCase()) ||

        m.preview.toLowerCase().includes(search.toLowerCase())

      ).sort((a, b) => {
        const timeA = a.date
        const timeB = b.date
        return timeB.localeCompare(timeA)
      })

    : folderMails.sort((a, b) => {
        const timeA = a.date
        const timeB = b.date
        return timeB.localeCompare(timeA)
      })



  const selectedMail = mails.find(m => m.id === selectedId) ?? null

  const unreadCount  = mails.filter(m => m.folder === 'inbox' && !m.read).length



  /* ── Actions ── */

  function selectMail(mail) {

    setSelectedId(mail.id)

    // Если кликнули на письмо от Архива страховой (id: 7) — запускаем таймер для письма от Слейта
    if (mail.id === 7) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      // Запуск таймера на 5 секунд для появления письма от Слейта
      timerRef.current = setTimeout(() => {
        // Проверяем, не было ли письмо уже добавлено
        setMails(prev => {
          const hasSlateMail = prev.some(m => m.id === 'slate_court_order')
          if (hasSlateMail) return prev

          // Добавляем новое письмо от Слейта сверху
          const newMail = { ...createSlateCourtOrderMail(), hidden: false }
          console.log('[MailApp] Добавлено письмо от Слейта после клика на письмо #7')

          // Воспроизводим звук уведомления
          const audio = new Audio('/assets/sounds/notification.mp3');
          audio.play().catch(e => console.log('Не удалось воспроизвести звук:', e));

          // Вызываем callback для показа уведомления
          if (onSecondMailArrived) {
            setTimeout(() => onSecondMailArrived(), 200)
          }

          return [newMail, ...prev]
        })
      }, 5000)
    }

    // Если кликнули на письмо от Слейта с ордером (slate_court_order) — запускаем таймер для письма с уликами
    if (mail.id === 'slate_court_order') {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Запуск таймера на 10 секунд для появления письма с уликами
      timerRef.current = setTimeout(() => {
        // Проверяем, не было ли письмо уже добавлено
        setMails(prev => {
          const hasEvidenceMail = prev.some(m => m.id === SLATE_EVIDENCE_MAIL_ID)
          if (hasEvidenceMail) return prev

          // Добавляем новое письмо от Слейта сверху
          const newMail = { ...createSlateEvidenceMail(), hidden: false }
          console.log('[MailApp] Добавлено письмо с уликами от Слейта после клика на ордер')

          // Воспроизводим звук уведомления
          const audio = new Audio('/assets/sounds/notification.mp3');
          audio.play().catch(e => console.log('Не удалось воспроизвести звук:', e));

          // Вызываем callback для показа уведомления
          if (onSecondMailArrived) {
            setTimeout(() => onSecondMailArrived(), 200)
          }

          return [newMail, ...prev]
        })

        // Через 2 секунды после письма Слейта добавляем служебную записку Миллера
        setTimeout(() => {
          setMails(prev => {
            const hasMemoMail = prev.some(m => m.id === 'miller_alibi_memo')
            if (hasMemoMail) return prev
            unlockMillerAlibiMemoMail()
            const memoMail = { ...createMillerAlibiMemoMail(), hidden: false }
            return [memoMail, ...prev]
          })
        }, 2000)
      }, 10000)
    }

    // Если кликнули на письмо с уликами от Слейта (slate_evidence) — разблокируем улики при прочтении
    if (mail.id === SLATE_EVIDENCE_MAIL_ID && !mail.read) {
      unlockSlateEvidenceMail()
      console.log('[MailApp] Улики от Слейта разблокированы')
    }

    // Если кликнули на письмо #1, запустить таймер для показа рапорта (только один раз за игру)
    if (mail.id === 1 && !secondMailShown) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      timerRef.current = setTimeout(() => {
        setMails(prev => {
          const mailIndex = prev.findIndex(m => m.id === 5)
          if (mailIndex !== -1) {
            const mail = { ...prev[mailIndex], hidden: false }
            const filtered = prev.filter(m => m.id !== 5)
            return [mail, ...filtered]
          }
          return prev
        })
        setSecondMailShown(true)
        sessionStorage.setItem('secondMailShown', 'true')
        // Воспроизводим звук уведомления
        const audio = new Audio('/assets/sounds/notification.mp3');
        audio.play().catch(e => console.log('Не удалось воспроизвести звук:', e));
        // Вызываем callback для показа уведомления
        if (onSecondMailArrived) onSecondMailArrived()
      }, 10000)
    }

    // Если кликнули на письмо #5 (второе письмо), запустить таймер для показа письма от Vesper
    if (mail.id === 5 && !secondMailOpenedRef.current && !vesperEmailSent.current) {
      secondMailOpenedRef.current = true
      // Запуск таймера на 4 секунды для появления письма от Vesper
      setTimeout(() => {
        setMails(prev => prev.map(m => 
          m.id === 6 ? { ...m, hidden: false } : m
        ))
        // Воспроизводим звук уведомления
        const audio = new Audio('/assets/sounds/notification.mp3');
        audio.play().catch(e => console.log('Не удалось воспроизвести звук:', e));
        // Вызываем callback для показа уведомления
        if (onSecondMailArrived) onSecondMailArrived()
        vesperEmailSent.current = true
      }, 4000)
    }

      if (!mail.read) {
        setMails(prev => prev.map(m => m.id === mail.id ? { ...m, read: true } : m))
        if (mail.id === 7) {
          markFileAsReviewed('insurance_policies')
        }
        if (mail.id === 'miller_alibi_memo') {
          markFileAsReviewed('miller_alibi_memo')
        }
        if (mail.id === 10) {
          markFileAsReviewed('it_report')
        }
        if (onNotificationRead) onNotificationRead()
      }
  }



  function toggleStar(id) {

    setMails(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))

  }



  function deleteMail(id) {

    setMails(prev => prev.map(m => m.id === id ? { ...m, folder: 'trash' } : m))

    setSelectedId(null)

  }



  function switchFolder(id) {

    setFolder(id)

    setSelectedId(null)

    if (id === 'inbox') setTab('primary')

  }



  /* ── Tab counts ── */

 function tabCount(tabId) {

  return mails.filter(m =>

    m.folder === 'inbox' &&

    m.tab === tabId &&

    !m.read

  ).length || null

}



  return (

    <div className="mail-root">



      {/* ══ TOP BAR ══ */}

      <div className="mail-topbar">

        <div className="mail-topbar-left">

          <button className="mail-menu-btn" onClick={() => setSidebarOpen(s => !s)}>

            <MenuIcon />

          </button>

          <div className="mail-brand">

            <span className="mail-brand-icon">✉</span>

            <span className="mail-brand-name">OneMail</span>

          </div>

        </div>



        <div className="mail-search-wrap">

          <div className="mail-search-box">

            <SearchIcon />

            <input

              className="mail-search-input"

              placeholder="Поиск в почте"

              value={search}

              onChange={e => setSearch(e.target.value)}

            />

            {search && (

              <button className="mail-search-clear" onClick={() => setSearch('')}>✕</button>

            )}

          </div>

        </div>



        <div className="mail-topbar-right">

          <button className="mail-topbar-btn" title="Настройки"><SettingsIcon /></button>

          <button className="mail-topbar-btn" title="Развернуть"><ExpandIcon /></button>

          <div className="mail-user-avatar">

            <Avatar name="Детектив" size={32} />

          </div>

        </div>

      </div>



      <div className="mail-body">



        {/* ══ SIDEBAR ══ */}

        <aside className={`mail-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

          {/* Compose */}

          <div className="sidebar-compose-wrap">

            <button className="sidebar-compose-btn" onClick={() => setCompose(true)}>

              <PenIcon />

              {sidebarOpen && <span>Написать</span>}

            </button>

          </div>



          {/* Nav */}

          <nav className="sidebar-nav">

            {FOLDERS.map(f => {

              const isActive = folder === f.id

              const count = f.id === 'inbox' ? unreadCount : null

              return (

                <button

                  key={f.id}

                  className={`sidebar-nav-item ${isActive ? 'sidebar-nav-active' : ''}`}

                  onClick={() => switchFolder(f.id)}

                  title={!sidebarOpen ? f.label : ''}

                >

                  <span className="sidebar-nav-icon"><f.icon /></span>

                  {sidebarOpen && <span className="sidebar-nav-label">{f.label}</span>}

                  {sidebarOpen && count > 0 && (

                    <span className="sidebar-nav-count">{count}</span>

                  )}

                </button>

              )

            })}

          </nav>

        </aside>



        {/* ══ MAIL LIST ══ */}

        <section className="mail-list-section">

          {/* Category tabs (inbox only) */}

          {folder === 'inbox' && (

            <div className="mail-tabs">

              {TABS.map(t => (

                <button

                  key={t.id}

                  className={`mail-tab-btn ${tab === t.id ? 'mail-tab-active' : ''}`}

                  onClick={() => setTab(t.id)}

                >

                  <span className="mail-tab-icon">{t.icon}</span>

                  <span className="mail-tab-label">{t.label}</span>

                  {t.badge && <span className="mail-tab-badge">{t.badge}</span>}

                </button>

              ))}

            </div>

          )}



          {/* Mail rows */}

          <div className="mail-rows">

            {displayMails.length === 0 && (

              <div className="mail-rows-empty">

                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📂</div>

                <p>Писем нет</p>

              </div>

            )}

            {displayMails.map(mail => (

              <MailRow

                key={mail.id}

                mail={mail}

                isSelected={selectedId === mail.id}

                onClick={() => selectMail(mail)}

                onStar={() => toggleStar(mail.id)}

              />

            ))}

          </div>

        </section>



        {/* ══ READING PANE ══ */}

        <section className="mail-reading-section">

      <ReadingPane

  mail={selectedMail}

  onStar={toggleStar}

  onDelete={deleteMail}

      onOpenFile={handleOpenFile}

/>

        </section>

      </div>

{compose && <ComposeModal onClose={() => setCompose(false)} />}

      {/* ══ COMPOSE ══ */}

{openedFile && createPortal(

  <div className="file-window" style={{

    width: imageDimensions.width + 'px',

    height: imageDimensions.height + 'px'

  }}>

    <div className="file-window-header">

      <span>{openedFile.name}</span>

      <button onClick={() => setOpenedFile(null)}>✕</button>

    </div>



    <div
      className={`file-window-body ${openedFile.content ? 'file-window-body--document' : ''}`}
      onWheel={openedFile.content ? undefined : handleWheel}
      onMouseMove={openedFile.content ? undefined : handleMouseMove}
      onMouseUp={openedFile.content ? undefined : handleMouseUp}
    >
      {openedFile.content ? (
        <pre className="file-window-document">{openedFile.content}</pre>
      ) : (
        <>
          <img
            src={openedFile.url}
            alt="file"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
          />
          <div className="zoom-indicator">{Math.round(zoom * 100)}%</div>
        </>
      )}
    </div>

  </div>,

  document.body

)}

    </div>

  )

}





/* ── Mail row ── */

function MailRow({ mail, isSelected, onClick, onStar }) {

  const [hovered, setHovered] = useState(false)



  return (

    <div

      className={`mail-row ${!mail.read ? 'mail-row-unread' : ''} ${isSelected ? 'mail-row-selected' : ''}`}

      onClick={onClick}

      onMouseEnter={() => setHovered(true)}

      onMouseLeave={() => setHovered(false)}

    >

      {/* Unread dot */}

      <div className="mail-row-dot-col">

        {!mail.read && <div className="mail-row-dot" />}

      </div>



      {/* Avatar */}

      <div className="mail-row-avatar-col">

        <Avatar name={mail.from.name} emoji={mail.from.avatar} size={36} />

      </div>



      {/* Content */}

      <div className="mail-row-content">

        <div className="mail-row-top">

          <span className="mail-row-from">{mail.from.name}</span>

          <span className="mail-row-date">{mail.date}</span>

        </div>

        <div className="mail-row-subject">{mail.subject}</div>

        <div className="mail-row-preview">{mail.preview}</div>

        {mail.attachments?.length > 0 && (

          <span className="mail-row-attach"><AttachIcon /> {mail.attachments.length}</span>

        )}

      </div>



      {/* Star */}

      <button

        className={`mail-row-star ${mail.starred ? 'mail-row-star-on' : ''}`}

        onClick={e => { e.stopPropagation(); onStar() }}

        title="Пометить"

      >★</button>

    </div>

  )

}
