// Главная "виртуальная файловая система" игры.
// Каждый объект ниже - это файл или папка, которую видит игрок в проводнике.
//
// Как добавить файл:
// 1. Создай новый объект, например 'new_note': { type: 'txt', name: 'note.txt', content: '...' }
// 2. Добавь его id ('new_note') в children нужной папки.
//
// Основные типы:
// folder - папка, txt - текстовый документ, image/img - картинка, video - видео.
export const FILE_SYSTEM = {
  '/': {
    type: 'folder',
    name: 'Корневая папка',
    children: ['case001', 'recycle'],
  },

  // =========================
  // 📂 ОСНОВНАЯ ПАПКА
  // =========================
  'case001': {
    type: 'folder',
    name: 'Дело 001 — Ривертон',
    icon: '📁',
    children: ['start', 'profiles', 'interviews', 'evidence', 'database', 'envelope1'],
  },

  // =========================
  // 🧩 СТАРТ
  // =========================
  'start': {
    type: 'folder',
    name: 'Начало',
    icon: '📂',
    children: ['memo', 'police_report', 'autopsy', 'suicide_note'],
  },

  'memo': {
    type: 'txt',
    name: 'служебная_записка.txt',
    icon: '📄',
    content: `ДАТА: 23 июня 2025 г.

Добро пожаловать в "Dark Trace".

Полиция считает смерть Селены Блэк самоубийством.

Наша задача — доказать обратное.

Изучите материалы.`,
  },

  'police_report': {
    type: 'txt',
    name: 'рапорт_полиции.txt',
    icon: '📄',
    content: `ПРЕДВАРИТЕЛЬНЫЙ РАПОРТ

Тело Селены Блэк обнаружено в студии.

Признаков насилия нет.
Найдена записка.
Версия: самоубийство.`,
  },

  'autopsy': {
    type: 'txt',
    name: 'отчёт_СМЭ.txt',
    icon: '📄',
    content: `СМЭ:

Причина смерти: передозировка препаратом "Сертофин".

Летальность маловероятна без дополнительных веществ.`,
  },

  'suicide_note': {
    type: 'txt',
    name: 'предсмертная_записка.txt',
    icon: '📄',
    content: `Я проиграла.
Эван, прости.
С.`,
  },

  // =========================
  // 👤 ДОСЬЕ
  // =========================
  'profiles': {
    type: 'folder',
    name: 'Досье',
    icon: '📂',
    children: [
  'selena_folder', // ← ВОТ ЭТО ВМЕСТО ДВУХ
  'evan',
  'marcus',
  'rosalia',
  'alarik',
  'vesper',
  'eliot',
  'payne'
]
  },

  'selena': {
  type: 'txt',
  name: 'селена_блэк.txt',
  icon: '📄',
  
  
  content: `ID#578947
НОМЕР ДЕЛА: DT-2025-06-21-SB
СТАТУС: Жертва

Имя: Селена Блэк
Пол: Женский
Дата рождения: 22.01.1998
Возраст: 27 лет
Место рождения: г. Ривертон

ФИЗИЧЕСКИЕ ДАННЫЕ
Рост: 170 см
Цвет волос: Каштановые
Цвет глаз: Голубые
Ведущая рука: Правая

КРАТКАЯ СВОДКА:
Родилась и выросла в Ривертоне.
Рано потеряла родителей в автокатастрофе.
Окончила Академию Искусств Ривертона.
Талантливая художница, готовилась к персональной выставке.

По словам близких, была эмоциональной,
но целеустремлённой.
В прошлом имела сложные отношения с Маркусом Флинном.
Проходила курс психотерапии у д-ра Майкла Элиота.

ЗАМЕТКИ ДЕТЕКТИВА:
Официальная версия полиции — самоубийство.
Дело на грани закрытия.
Обращение Веспер Уэйнрайт ставит эту версию под сомнение.

Необходимо тщательно изучить обстоятельства смерти
и окружение покойной.`

},
'selena_img': {
  type: 'image',
  name: 'селена_блэк.jpg',
  icon: '🖼️',
  src: '/assets/selena_black.jpg',
  caption: 'Фото из досье Селены Блэк'
},
'selena_folder': {
  type: 'folder',
  name: 'Селена Блэк',
  icon: '📁',
  children: ['selena', 'selena_img']
},

  'evan': {
    type: 'txt',
    name: 'эван_андервуд.txt',
    icon: '📄',
    content: `Эван Андервуд.

Жених.
Есть финансовые проблемы.`,
  },

  'marcus': {
    type: 'txt',
    name: 'маркус_флинн.txt',
    icon: '📄',
    content: `Маркус Флинн.

Бывший партнёр.
Конфликт.`,
  },

  'rosalia': {
    type: 'txt',
    name: 'розалия.txt',
    icon: '📄',
    content: `Розалия Андервуд.

Мать Эвана.
Влиятельна.`,
  },

  'alarik': {
    type: 'txt',
    name: 'аларик.txt',
    icon: '📄',
    content: `Аларик.

Одержим Селеной.`,
  },

  'vesper': {
    type: 'txt',
    name: 'веспер.txt',
    icon: '📄',
    content: `Веспер.

Подруга.
Считает это убийством.`,
  },

  'eliot': {
    type: 'txt',
    name: 'доктор_элиот.txt',
    icon: '📄',
    content: `Доктор Элиот.

Психотерапевт.`,
  },

  'payne': {
    type: 'txt',
    name: 'артур_пейн.txt',
    icon: '📄',
    content: `Артур Пейн.

Нашёл тело.`,
  },

  // =========================
  // 🎤 ДОПРОСЫ
  // =========================
  'interviews': {
    type: 'folder',
    name: 'Допросы',
    icon: '📂',
    children: [
  'rosalia_i',
  'evan_i',
  'marcus_i',
  'alarik_i',
  'vesper_i',
  'selena_i'
   // ← ВОТ СЮДА
]
  },

  'rosalia_i': {
    type: 'txt',
    name: 'допрос_розалии.txt',
    icon: '📄',
    content: `Обвиняет Аларика.`,
  },

  'evan_i': {
    type: 'txt',
    name: 'допрос_эвана.txt',
    icon: '📄',
    content: `Обвиняет Маркуса.`,
  },

  'marcus_i': {
    type: 'txt',
    name: 'допрос_маркуса.txt',
    icon: '📄',
    content: `Говорит про семью.`,
  },

  'alarik_i': {
    type: 'txt',
    name: 'допрос_аларика.txt',
    icon: '📄',
    content: `Намекает на секреты.`,
  },

  'vesper_i': {
    type: 'txt',
    name: 'допрос_веспер.txt',
    icon: '📄',
    content: `Обвиняет Маркуса.`,
  },

  // =========================
  // 🧪 УЛИКИ
  // =========================
  'evidence': {
    type: 'folder',
    name: 'Улики',
    icon: '📂',
    children: ['diary', 'photo'],
  },

  'diary': {
    type: 'txt',
    name: 'дневник.txt',
    icon: '📄',
    content: `За мной следят...`,
  },

  'photo': {
    type: 'img',
    name: 'место_преступления.jpg',
    icon: '🖼️',
    src: '/assets/images/crime_scene.jpg',
  },

  // =========================
  // 📚 БАЗА ДАННЫХ
  // =========================
  'database': {
    type: 'folder',
    name: 'База данных',
    icon: '📂',
    children: ['sertofin', 'riverton'],
  },

  'sertofin': {
    type: 'txt',
    name: 'сертофин.txt',
    icon: '📄',
    content: `Передозировка редко смертельна.`,
  },

  'riverton': {
    type: 'txt',
    name: 'ривертон.txt',
    icon: '📄',
    content: `Город с тайнами.`,
  },

  // =========================
  // 🔐 КОНВЕРТ 1
  // =========================
  'envelope1': {
    type: 'folder',
    name: 'Конверт 1',
    icon: '📦',
    unlockAfter: ['police_report', 'evan', 'marcus'],
    children: ['insurance', 'bank', 'chat'],
  },

  'insurance': {
    type: 'txt',
    name: 'страховка.txt',
    icon: '📄',
    content: `$500,000 выплата Эвану.`,
  },

  'bank': {
    type: 'txt',
    name: 'банковская_операция.txt',
    icon: '📄',
    content: `$250,000 снятие.`,
  },

  'chat': {
    type: 'txt',
    name: 'переписка.txt',
    icon: '📄',
    content: `The Raven наблюдает.`,
  },

  // =========================
  // 🗑️ КОРЗИНА
  // =========================
  'recycle': {
    type: 'folder',
    name: 'Корзина',
    icon: '🗑️',
    children: [],
  },
}

// =========================
// 🧠 HELPERS
// =========================

export function getFile(id) {
  return FILE_SYSTEM[id] ?? null
}

export function getChildren(folderId) {
  const folder = FILE_SYSTEM[folderId]
  if (!folder || folder.type !== 'folder') return []

  return folder.children
    .map(id => {
      const file = FILE_SYSTEM[id]
      if (!file) return null
      return { id, ...file }
    })
    .filter(Boolean)
}

export function isUnlocked(file, openedFiles = new Set()) {
  if (!file.unlockAfter) return true
  return file.unlockAfter.every(id => openedFiles.has(id))
}
