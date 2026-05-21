export const VESPER_INSURANCE_HINT_MAIL_KEY = 'dt_vesper_insurance_hint_mail'

export function isVesperInsuranceHintMailUnlocked() {
  return localStorage.getItem(VESPER_INSURANCE_HINT_MAIL_KEY) === 'true'
}

export function unlockVesperInsuranceHintMail() {
  if (isVesperInsuranceHintMailUnlocked()) return false
  localStorage.setItem(VESPER_INSURANCE_HINT_MAIL_KEY, 'true')
  return true
}

export const VESPER_INSURANCE_HINT_MAIL_ID = 8

export function createVesperInsuranceHintMail() {
  return {
    id: VESPER_INSURANCE_HINT_MAIL_ID,
    folder: 'inbox',
    tab: 'primary',
    starred: false,
    read: false,
    hidden: true,
    from: {
      name: 'Веспер Уэйнрайт',
      email: 'v.wainwright@riverton-art.com',
      avatar: '👥',
    },
    subject: 'Дополнение к моим показаниям / Важная деталь',
    preview:
      'Просматривая утренние новости, я вспомнила разговор Селены о страховой компании и совместных документах с Эваном…',
    date: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    body: `Уважаемый детектив,

Я пишу вам, потому что не могу перестать думать о случившемся с Селеной. Просматривая сегодня утренние новости Ривертона, я наткнулась на статью о безопасности и страховании, и у меня в голове буквально вспыхнуло одно воспоминание.

Примерно за неделю до трагедии мы с Селеной пили кофе в „Мечтателях“. Она выглядела очень воодушевленной, но в то же время слегка взволнованной. Она обмолвилась, что они с Эваном подписали какие-то важные совместные документы в местной страховой компании. Селена тогда еще грустно пошутила: „Ну вот, теперь в случае чего мы хотя бы обеспечим друг другу безбедную жизнь“. Я тогда не придала этому значения — мало ли какие бумаги подписывают пары перед свадьбой?

Но сейчас, зная, в каком отчаянии из-за долгов был Эван (весь город шепчется, что он готов распродавать личные вещи за бесценок), эта её фраза кажется мне пугающей. Если Эван заставил её оформить полис прямо перед смертью, всё это самоубийство выглядит совершенно иначе.

Я не знаю, как устроена ваша работа, но у такого серьезного агентства, как Dark Trace, наверняка есть официальные каналы или доступ к архивным базам данных таких контор, чтобы затребовать их документы и проверить мою догадку? Пожалуйста, не оставляйте это просто так.

С надеждой на справедливость,
Веспер Уэйнрайт`,
    attachments: [],
  }
}
