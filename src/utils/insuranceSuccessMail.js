export const INSURANCE_SUCCESS_MAIL_KEY = 'dt_insurance_success_mail'
export const SLATE_COURT_ORDER_MAIL_KEY = 'dt_slate_court_order_mail'

export function isInsuranceSuccessMailUnlocked() {
  return localStorage.getItem(INSURANCE_SUCCESS_MAIL_KEY) === 'true'
}

export function unlockInsuranceSuccessMail() {
  if (isInsuranceSuccessMailUnlocked()) return false
  localStorage.setItem(INSURANCE_SUCCESS_MAIL_KEY, 'true')
  return true
}

export function isSlateCourtOrderMailUnlocked() {
  return localStorage.getItem(SLATE_COURT_ORDER_MAIL_KEY) === 'true'
}

export function unlockSlateCourtOrderMail() {
  if (isSlateCourtOrderMailUnlocked()) return false
  localStorage.setItem(SLATE_COURT_ORDER_MAIL_KEY, 'true')
  return true
}

export const SLATE_COURT_ORDER_MAIL_ID = 'slate_court_order'

export function createSlateCourtOrderMail() {
  return {
    id: SLATE_COURT_ORDER_MAIL_ID,
    folder: 'inbox',
    tab: 'primary',
    starred: false,
    read: false,
    hidden: true,
    from: {
      name: 'Джон Слейт',
      email: 'j.slate@darktrace-agency.com',
      avatar: '👮',
    },
    subject: 'Кое-что горячее / Ордер на прослушку',
    preview: 'Слушай, я тут знатно попотеть успел, пока обивал пороги суда, но бумажка у нас...',
    date: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    body: `Слушай, я тут знатно попотеть успел, пока обивал пороги суда, но бумажка у нас. Старик-судья Харпер подписал-таки разрешение на архив вышки «Riverton Telecom». Доступ открыли к логам за июнь 2025-го.

Эти связисты из Телекома — те еще бюрократы, они заставляют заполнять формы под каждый чих. Прямой доступ к базе они нам не дадут, выдают только временные коды записей. Короче, план такой: открываешь прикрепленный скан ордера, забираешь оттуда мобильные номера наших голубчиков и идешь на сайт www.riverton-telecom.com в спецраздел для официационных запросов ведомств.

Вбиваешь туда номер нашего судебного решения — 404-А, телефон и дату, когда Селену нашли (21 июня 2025). Проверь всех троих из списка: Маркуса, Веспер и мамашу Эвана (Розалию). Провайдер вывалит тебе список звонков за эти сутки. Нам нужны только те разговоры, которые напрямую относятся к делу. Выуживай коды записей и прогоняй их через наш «Аудиоархив» прямо на рабочем столе.

Включай голову и ищи зацепки. Конец связи.

— Джон Слейт`,
    attachments: [
      {
        id: 'att_court_order',
        name: 'court_order_404_a.jpg',
        type: 'image',
        size: '1.8 МБ',
        icon: '🖼️',
        url: '/assets/images/documents/court_order_404_a.jpg',
        downloadable: true,
        saveToDesktop: true
      }
    ],
  }
}

// Функция, которая вызывается при успешном получении документов от страховой
export function triggerInsuranceSuccess() {
  console.log('[triggerInsuranceSuccess] Запуск последовательности писем')
  
  // 1. Сразу разблокируем письмо от страховой (письмо id:7 уже существует)
  unlockInsuranceSuccessMail()
  
  // Письмо от Слейта появится через 5 секунд после клика на письмо id:7
  // Поэтому таймер здесь больше не нужен
}

// Проверка, нужно ли показать письма при загрузке MailApp
export function checkAndShowInsuranceMails(emailSystem) {
  if (!emailSystem || typeof emailSystem.addEmail !== 'function') {
    console.log('[checkAndShowInsuranceMails] Почтовая система не доступна')
    return
  }
  
  // Письмо от страховой (id:7) обрабатывается отдельно в MailApp
  // Если письмо от Слейта разблокировано, но еще не показано
  if (isSlateCourtOrderMailUnlocked()) {
    const hasMail = emailSystem.mails?.some(m => m.id === SLATE_COURT_ORDER_MAIL_ID)
    if (!hasMail) {
      console.log('[checkAndShowInsuranceMails] Добавляем письмо от Слейта при инициализации')
      emailSystem.addEmail({ ...createSlateCourtOrderMail(), hidden: false })
    }
  }
}
