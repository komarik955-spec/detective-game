import React, { useState, useEffect, useRef } from 'react';

// База данных перехваченных аудиопотоков
const AUDIO_DATABASE = {
  // === МАРКУС ФЛИНН ===
  "104882": {
    caller: "Маркус Флинн",
    receiver: "Автосервис Ривертона",
    time: "21.06.2025 | 09:12",
    duration: "2:15",
    type: "Исходящий",
    isCritical: false,
    transcript: [
      { speaker: "Маркус", text: "Алло! Я сдавал вам свой Додж три дня назад. Какого черта запчасти всё еще не приехали?" },
      { speaker: "Сервис", text: "Мистер Флинн, мы ждем доставку тормозных дисков из Портленда. Курьер задерживается из-за забастовки на трассе." },
      { speaker: "Маркус", text: "Мне плевать на забастовки! Машина нужна мне прямо сейчас. Если к вечеру колеса не будут готовы, я заберу её без оплаты!" },
      { speaker: "Сервис", text: "Сэр, успокойтесь. Мы делаем всё возможное..." }
    ]
  },
  "508911": {
    caller: "Маркус Флинн",
    receiver: "Элен Флинн (Мать)",
    time: "21.06.2025 | 14:30",
    duration: "4:05",
    type: "Входящий",
    isCritical: false,
    transcript: [
      { speaker: "Элен", text: "Маркус, милый? Ты приедешь на этих выходных на ужин? Отец хотел показать тебе новые чертежи." },
      { speaker: "Маркус", text: "Мам, не сейчас. Я по уши в делах. У меня... возникли серьезные проблемы с деньгами, которые нужно срочно закрыть." },
      { speaker: "Элен", text: "Опять твои авантюры? Господи, Маркус, когда ты уже найдешь нормальную работу?" },
      { speaker: "Маркус", text: "Давай без нотаций, ладно? Я сам разберусь. Всё, мне пора." }
    ]
  },
  "041187": { // КРИТИЧЕСКИЙ СЮЖЕТНЫЙ ЗВОНОК (РАЗОБЛАЧЕНИЕ АЛИБИ)
    caller: "Маркус Флинн",
    receiver: "Селена Блэк",
    time: "21.06.2025 | 22:14",
    duration: "3:40",
    type: "Входящий",
    isCritical: true,
    transcript: [
      { speaker: "Селена", text: "Маркус, я же просила тебя больше никогда мне не звонить. Между нами всё кончено, у меня свадьба с Эваном!" },
      { speaker: "Маркус", text: "Ты действительно думаешь, что этот трус тебя спасет, Селена? Он погряз в долгах своего покойного папаши!" },
      { speaker: "Селена", text: "Эван решает свои проблемы! Оставьте нас в покое!" },
      { speaker: "Маркус", text: "Твоя выставка не состоится, Селена. Я лично об этом позабочусь, если ты не вернешь мне то, что взяла. Ты меня услышала?!" },
      { speaker: "Селена", text: "(Всхлипывает, бросает трубку)" }
    ]
  },
  "774102": {
    caller: "Маркус Флинн",
    receiver: "Пиццерия Луиджи",
    time: "21.06.2025 | 23:45",
    duration: "1:10",
    type: "Исходящий",
    isCritical: false,
    transcript: [
      { speaker: "Оператор", text: "Доставка Луиджи, слушаю вас. Желаете заказать комбо-сет?" },
      { speaker: "Маркус", text: "Да, одну большую пепперони на тонком тесте и банку колы. Адрес — Хилл-стрит, 42." },
      { speaker: "Оператор", text: "Принято, мистер Флинн. Доставка в течение 40 минут. С вас 18 долларов." },
      { speaker: "Маркус", text: "Оставьте у двери. Деньги переведу онлайн." }
    ]
  },

  // === ВЕСПЕР УЭЙНРАЙТ ===
  "330194": {
    caller: "Веспер Уэйнрайт",
    receiver: "Художественный салон Ривертона",
    time: "21.06.2025 | 08:05",
    duration: "1:50",
    type: "Исходящий",
    isCritical: false,
    transcript: [
      { speaker: "Продавец", text: "Арт-Лавка, доброе утро! Чем могу помочь?" },
      { speaker: "Веспер", text: "Здравствуйте. Это Веспер Уэйнрайт из галереи Блэкуотер. Вы получили партию итальянского льняного холста?" },
      { speaker: "Продавец", text: "Да, привезли вчера вечером. Вам отложить рулон?" },
      { speaker: "Веспер", text: "Отложите два рулона и три банки текстурной пасты средней зернистости. Я пришлю курьера к полудню." }
    ]
  },
  "069201": { // КРИТИЧЕСКИЙ СЮЖЕТНЫЙ ЗВОНОК (ОЦЕНКА КАРТИН ДЛЯ СТРАХОВКИ)
    caller: "Веспер Уэйнрайт",
    receiver: "Аларик (Владелец галереи)",
    time: "21.06.2025 | 11:20",
    duration: "5:12",
    type: "Исходящий",
    isCritical: true,
    transcript: [
      { speaker: "Веспер", text: "Аларик, какого черта?! Почему страховые агенты Riverton Insurance осматривали картины Селены прямо в выставочном зале?" },
      { speaker: "Аларик", text: "Успокойся, Веспер. Это был личный запрос Эвана Андервуда. Он оформлял какую-то совместную программу и настоял на оценке стоимости её работ в качестве залога." },
      { speaker: "Веспер", text: "Эван воняет огромными проблемами, Аларик! Он едва сводит концы с концами. Зачем ему оценивать её картины перед самой свадьбой?!" },
      { speaker: "Аларик", text: "Они пара, Веспер. Это их семейные дела. Я не мог отказать Эвану — его семья годами спонсировала нашу галерею." },
      { speaker: "Веспер", text: "Если из-за его махинаций пострадает репутация выставки или имя Селены, я уничтожу вас обоих. Запомни мои слова." }
    ]
  },
  "881204": {
    caller: "Веспер Уэйнрайт",
    receiver: "Спа-салон Лили",
    time: "21.06.2025 | 15:40",
    duration: "0:30",
    type: "Входящий",
    isCritical: false,
    transcript: [
      { speaker: "Ресепшен", text: "Добрый день, мисс Уэйнрайт. Напоминаем, что вы записаны на маникюр сегодня на 17:30. Всё в силе?" },
      { speaker: "Веспер", text: "Да, спасибо, я помню. Буду вовремя." }
    ]
  },
  "441095": {
    caller: "Веспер Уэйнрайт",
    receiver: "Такси Ривертона",
    time: "21.06.2025 | 19:10",
    duration: "2:22",
    type: "Исходящий",
    isCritical: false,
    transcript: [
      { speaker: "Диспетчер", text: "Служба такси. Откуда вас забрать?" },
      { speaker: "Веспер", text: "Галерея Блэкуотер на Парк-авеню. Машину до Озерной улицы, пожалуйста." },
      { speaker: "Диспетчер", text: "Черный Форд прибудет через 7 минут. Стоимость поездки — 12 долларов." }
    ]
  },

  // === РОЗАЛИЯ АНДЕРВУД ===
  "021998": { // КРИТИЧЕСКИЙ СЮЖЕТНЫЙ ЗВОНОК (СГОВОР МАТЕРИ И СЫНА)
    caller: "Розалия Андервуд",
    receiver: "Эван Андервуд (Сын)",
    time: "21.06.2025 | 07:30",
    duration: "10:15",
    type: "Исходящий",
    isCritical: true,
    transcript: [
      { speaker: "Розалия", text: "Эван, юристы 'Ривертон Коммершл Банка' прислали последнее предупреждение. Если до конца месяца мы не закроем дефицит по закрытому счету твоего отца, начнется арест имущества." },
      { speaker: "Эван", text: "Мама, умоляю, не паникуй. Мне нужно еще немного времени. Буквально неделя." },
      { speaker: "Розалия", text: "Какое время, Эван?! Семья Андервуд не станет посмешищем для всей Орегонской элиты!" },
      { speaker: "Эван", text: "Я нашел решение! Слышишь? Полис совместного страхования 'Семейный Щит 1+1' почти оформлен, агент уже одобрил заявку. Сумма выплаты полностью покроет весь долг отца Дэвида... Все 250 тысяч!" },
      { speaker: "Розалия", text: "(Долгая пауза) Надеюсь, у тебя хватит духу довести это решение до конца, Эван. Иначе ты знаешь, что нас ждет." }
    ]
  },
  "115623": {
    caller: "Розалия Андервуд",
    receiver: "Частная кардиоклиника",
    time: "21.06.2025 | 12:00",
    duration: "1:05",
    type: "Входящий",
    isCritical: false,
    transcript: [
      { speaker: "Медсестра", text: "Здравствуйте, миссис Андервуд. Доктор Новак изучил результаты вашей кардиограммы. Показания в пределах возрастной нормы." },
      { speaker: "Розалия", text: "Прекрасно. Мне нужно продлить рецепт на мои успокоительные капли?" },
      { speaker: "Медсестра", text: "Да, доктор оставил рецепт на ресепшене. Можете забрать в любое время." }
    ]
  },
  "654128": {
    caller: "Розалия Андервуд",
    receiver: "Адвокат Грин",
    time: "21.06.2025 | 14:15",
    duration: "3:50",
    type: "Исходящий",
    isCritical: false,
    transcript: [
      { speaker: "Розалия", text: "Артур, вы проверили налоговые декларации за прошлый квартал? Налоговая не докопается до ликвидации активов фонда?" },
      { speaker: "Адвокат Грин", text: "Розалия, там всё чисто, все транзакции проведены как благотворительность. Но главный вопрос с банковским долгом Дэвида всё еще висит в воздухе." },
      { speaker: "Розалия", text: "Эван уверяет, что закроет этот вопрос в ближайшие дни. Займитесь пока текущими бумагами." }
    ]
  },
  "902114": {
    caller: "Розалия Андервуд",
    receiver: "Цветочный салон Веллингтон",
    time: "21.06.2025 | 17:45",
    duration: "0:50",
    type: "Входящий",
    isCritical: false,
    transcript: [
      { speaker: "Флорист", text: "Миссис Андервуд, ваш заказ на оформление званого вечера готов. Белые лилии и гортензии отправлены по адресу вашей резиденции." },
      { speaker: "Розалия", text: "Отлично. Убедитесь, что цветы свежие и увядших бутонов нет. Спасибо." }
    ]
  }
};

export default function AudioArchive() {
  const [code, setCode] = useState('');
  const [activeRecord, setActiveRecord] = useState(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('archive');

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    const targetCode = code.trim();
    if (AUDIO_DATABASE[targetCode]) {
      setActiveRecord(AUDIO_DATABASE[targetCode]);
      setIsPlaying(false);
      setPlaybackProgress(0);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setError("ОШИБКА: Аудиопоток с указанным ID-кодом не обнаружен или защищен шифрованием B2G-Security.");
      setActiveRecord(null);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return 100;
          }
          return prev + 1.5;
        });
      }, 100);
    }
  };

  const resetPlayer = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="dt-terminal-wrapper">
      <style>{`
        .dt-terminal-wrapper {
          background-color: #0c0f1d;
          color: #d1d5db;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 24px;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .dt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1f293d;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .dt-logo-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dt-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9c7b41, #cda052);
          color: #0b0f19;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .dt-title-text h1 {
          font-size: 18px;
          font-weight: 700;
          color: #cda052;
          margin: 0;
          letter-spacing: 1px;
        }
        .dt-title-text p {
          font-size: 10px;
          color: #9ca3af;
          margin: 2px 0 0 0;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .dt-status-indicator {
          background-color: #162235;
          border: 1px solid #253248;
          color: #10b981;
          font-family: monospace;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: bold;
        }
        .dt-tabs {
          display: flex;
          background-color: #111827;
          border: 1px solid #1f293d;
          padding: 4px;
          border-radius: 8px;
          max-width: 400px;
          margin-bottom: 24px;
          gap: 4px;
        }
        .dt-tab-btn {
          flex: 1;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .dt-tab-btn.active {
          background-color: #cda052;
          color: #0c0f1d;
        }
        .dt-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 992px) {
          .dt-grid {
            grid-template-columns: 5fr 7fr;
          }
        }
        .dt-panel {
          background-color: #131a26;
          border: 1px solid #1f293d;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .dt-panel-header {
          margin-bottom: 16px;
        }
        .dt-panel-subheader {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: #cda052;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .dt-panel-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }
        .dt-panel-desc {
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.5;
          margin: 6px 0 0 0;
        }
        .dt-input-group {
          margin-bottom: 16px;
        }
        .dt-label {
          display: block;
          font-size: 10px;
          font-family: monospace;
          color: #9ca3af;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .dt-input-flex {
          display: flex;
          gap: 8px;
        }
        .dt-input {
          flex: 1;
          background-color: #090d16;
          border: 1px solid #2d3f5a;
          border-radius: 8px;
          color: #ffffff;
          font-family: monospace;
          font-size: 18px;
          text-align: center;
          padding: 10px;
          letter-spacing: 4px;
          outline: none;
          transition: border-color 0.2s;
        }
        .dt-input:focus {
          border-color: #cda052;
        }
        .dt-submit-btn {
          background-color: #cda052;
          color: #0c0f1d;
          border: none;
          font-weight: 700;
          font-size: 12px;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: background-color 0.2s;
        }
        .dt-submit-btn:hover {
          background-color: #b08842;
        }
        .dt-error {
          background-color: rgba(127, 29, 29, 0.2);
          border: 1px solid rgba(220, 38, 38, 0.5);
          color: #fca5a5;
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.4;
          font-family: monospace;
        }
        .dt-hint {
          background-color: #090d16;
          border: 1px solid #1b2637;
          border-radius: 8px;
          padding: 12px;
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.5;
        }
        .dt-hint strong {
          color: #ffffff;
        }
        .dt-player-box {
          background-color: #090d16;
          border: 1px solid #1b2637;
          border-radius: 10px;
          padding: 16px;
          margin-top: 16px;
        }
        .dt-player-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .dt-call-badge {
          font-size: 9px;
          background-color: #223147;
          color: #cda052;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          font-family: monospace;
        }
        .dt-caller-names {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          margin: 4px 0 2px 0;
        }
        .dt-call-time {
          font-size: 10px;
          font-family: monospace;
          color: #9ca3af;
          margin: 0;
        }
        .dt-call-duration {
          font-family: monospace;
          font-size: 12px;
          color: #cda052;
        }
        .dt-wave-container {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
          background-color: #080c14;
          border: 1px solid #1c273a;
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
          gap: 2px;
        }
        .dt-wave-bar {
          width: 3px;
          border-radius: 10px;
          background-color: #4b5563;
          transition: height 0.1s ease;
        }
        .dt-wave-bar.active {
          background: linear-gradient(to top, #9c7b41, #cda052);
        }
        .dt-player-controls {
          display: flex;
          gap: 12px;
        }
        .dt-play-btn {
          flex: 1;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          padding: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .dt-play-btn.play {
          background-color: #cda052;
          color: #0c0f1d;
        }
        .dt-play-btn.play:hover {
          background-color: #b08842;
        }
        .dt-play-btn.pause {
          background-color: rgba(127, 29, 29, 0.3);
          border: 1px solid rgba(220, 38, 38, 0.4);
          color: #fca5a5;
        }
        .dt-reset-btn {
          background-color: #182335;
          border: 1px solid #293b54;
          color: #d1d5db;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 11px;
          transition: background-color 0.2s;
        }
        .dt-reset-btn:hover {
          background-color: #202e46;
        }
        .dt-progress-bar-bg {
          height: 6px;
          background-color: #131c2d;
          border-radius: 10px;
          margin-top: 12px;
          overflow: hidden;
        }
        .dt-progress-bar-fill {
          height: 100%;
          background: linear-gradient(to right, #9c7b41, #cda052);
          transition: width 0.1s linear;
        }
        .dt-transcript-container {
          border-bottom: 1px solid #1f293d;
          padding-bottom: 12px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dt-critical-badge {
          font-size: 9px;
          background-color: rgba(146, 64, 14, 0.3);
          border: 1px solid rgba(217, 119, 6, 0.4);
          color: #fcd34d;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .dt-transcript-list {
          flex: 1;
          overflow-y: auto;
          max-height: 400px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 4px;
        }
        .dt-transcript-list::-webkit-scrollbar {
          width: 6px;
        }
        .dt-transcript-list::-webkit-scrollbar-track {
          background: #1a2335;
          border-radius: 3px;
        }
        .dt-transcript-list::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .dt-bubble {
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid #182337;
          background-color: #0a0f19;
          font-size: 13px;
          line-height: 1.5;
        }
        .dt-bubble.target {
          background-color: #152037;
          border-color: #2c3d5a;
        }
        .dt-bubble-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .dt-bubble-sender {
          font-size: 11px;
          font-weight: 700;
          font-family: monospace;
          color: #9ca3af;
        }
        .dt-bubble-sender.target {
          color: #cda052;
        }
        .dt-bubble-ch {
          font-size: 9px;
          color: #4b5563;
          font-family: monospace;
        }
        .dt-bubble-text {
          margin: 0;
          color: #e5e7eb;
        }
        .dt-empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border: 1px dashed #1f293d;
          border-radius: 12px;
          background-color: #090d16;
          color: #6b7280;
        }
        .dt-empty-icon {
          font-size: 24px;
          margin-bottom: 12px;
        }
        .dt-empty-text {
          font-size: 12px;
          text-align: center;
          line-height: 1.5;
          max-width: 280px;
          margin: 0;
        }
        .dt-doc-view {
          background-color: #131a26;
          border: 1px solid #1f293d;
          border-radius: 12px;
          padding: 24px;
          max-width: 680px;
        }
        .dt-doc-title {
          font-size: 18px;
          font-weight: 700;
          color: #cda052;
          margin: 0 0 12px 0;
        }
        .dt-doc-text {
          font-size: 13px;
          color: #d1d5db;
          line-height: 1.6;
        }
        .dt-doc-list {
          padding-left: 16px;
          margin: 12px 0;
        }
        .dt-doc-list li {
          margin-bottom: 8px;
        }
        .dt-doc-warning {
          background-color: #1e293b;
          border: 1px solid #2b3c54;
          border-radius: 8px;
          padding: 12px 14px;
          margin-top: 16px;
          font-size: 12px;
          line-height: 1.5;
        }
      `}</style>

      <header className="dt-header">
        <div className="dt-logo-group">
          <div className="dt-badge">DT</div>
          <div className="dt-title-text">
            <h1>DARK TRACE • TERMINAL</h1>
            <p>Агентство расследований и криминального анализа</p>
          </div>
        </div>
        <div className="dt-status-indicator">
          SECURE LINK ACTIVE
        </div>
      </header>

      <div className="dt-tabs">
        <button
          onClick={() => setActiveTab('archive')}
          className={`dt-tab-btn ${activeTab === 'archive' ? 'active' : ''}`}
        >
          📂 [06] ДЕШИФРАТОР АУДИО
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`dt-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
        >
          📋 ИНСТРУКЦИЯ СУДА
        </button>
      </div>

      {activeTab === 'archive' ? (
        <div className="dt-grid">
          <div className="dt-panel">
            <div>
              <div className="dt-panel-header">
                <span className="dt-panel-subheader">Служба прослушки</span>
                <h2 className="dt-panel-title">Запрос аудиодешифровки</h2>
                <p className="dt-panel-desc">
                  Введите шестизначный ID-код аудиопотока, выданный оператором связи <strong style={{color:'#cda052'}}>Riverton Telecom</strong> на основании судебного разрешения № 404-А.
                </p>
              </div>

              <form onSubmit={handleSearch} className="dt-input-group">
                <label className="dt-label">
                  ID-код аудиозаписи (6 цифр)
                </label>
                <div className="dt-input-flex">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Например: 041187"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="dt-input"
                  />
                  <button type="submit" className="dt-submit-btn">
                    ПОДКЛЮЧИТЬ
                  </button>
                </div>
              </form>

              {error && (
                <div className="dt-error">
                  ⚠️ {error}
                </div>
              )}

              {!activeRecord && !error && (
                <div className="dt-hint">
                  💡 <strong>Где взять код?</strong> Сначала изучите ордер Слейта в почте, выпишите телефоны фигурантов, отправьте запрос на сайте провайдера Riverton Telecom за дату <strong>21.06.2025</strong> и скопируйте выданные коды записей.
                </div>
              )}
            </div>

            {activeRecord && (
              <div style={{ marginTop: '24px', borderTop: '1px solid #1f293d', paddingTop: '20px' }}>
                <div className="dt-player-box">
                  <div className="dt-player-header">
                    <div>
                      <span className="dt-call-badge">{activeRecord.type}</span>
                      <h3 className="dt-caller-names">{activeRecord.caller} ➡️ {activeRecord.receiver}</h3>
                      <p className="dt-call-time">{activeRecord.time}</p>
                    </div>
                    <span className="dt-call-duration">{activeRecord.duration}</span>
                  </div>

                  <div className="dt-wave-container">
                    {[...Array(32)].map((_, i) => {
                      const baseHeight = 12 + Math.sin(i * 0.4) * 15 + Math.cos(i * 0.25) * 8;
                      const barHeight = isPlaying
                        ? `${Math.max(4, Math.min(48, baseHeight + (Math.random() - 0.5) * 20))}px`
                        : `${Math.max(4, baseHeight * 0.15)}px`;

                      return (
                        <div
                          key={i}
                          style={{ height: barHeight }}
                          className={`dt-wave-bar ${isPlaying ? 'active' : ''}`}
                        />
                      );
                    })}
                  </div>

                  <div className="dt-player-controls">
                    <button
                      onClick={togglePlay}
                      className={`dt-play-btn ${isPlaying ? 'pause' : 'play'}`}
                    >
                      {isPlaying ? (
                        <>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#fca5a5', borderRadius: '1px' }} />
                          ПАУЗА
                        </>
                      ) : (
                        <>
                          <span style={{ display: 'inline-block', width: '0', height: '0', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #0b0f19' }} />
                          СЛУШАТЬ ЗАПИСЬ
                        </>
                      )}
                    </button>
                    <button onClick={resetPlayer} className="dt-reset-btn">
                      🔄 СБРОС
                    </button>
                  </div>

                  <div className="dt-progress-bar-bg">
                    <div
                      className="dt-progress-bar-fill"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="dt-panel" style={{ minHeight: '480px' }}>
            <div className="dt-transcript-container">
              <div>
                <h2 className="dt-panel-title">Стенограмма переговоров</h2>
                <p className="dt-panel-desc" style={{ fontFamily: 'monospace', fontSize: '9px', textTransform: 'uppercase' }}>
                  Голосовой поток декодирован ИИ Dark Trace
                </p>
              </div>
              {activeRecord && activeRecord.isCritical && (
                <span className="dt-critical-badge">
                  ⚠️ Критическая улика
                </span>
              )}
            </div>

            {activeRecord ? (
              <div className="dt-transcript-list">
                {activeRecord.transcript.map((line, index) => {
                  const isTarget = line.speaker === "Маркус" || line.speaker === "Розалия" || line.speaker === "Веспер" || line.speaker === "Селена";

                  return (
                    <div
                      key={index}
                      className={`dt-bubble ${isTarget ? 'target' : ''}`}
                    >
                      <div className="dt-bubble-header">
                        <span className={`dt-bubble-sender ${isTarget ? 'target' : ''}`}>
                          {line.speaker}
                        </span>
                        <span className="dt-bubble-ch">Ch.{index + 1}</span>
                      </div>
                      <p className="dt-bubble-text">{line.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="dt-empty-state">
                <div className="dt-empty-icon">🎙️</div>
                <p className="dt-empty-text">
                  Нет активного потока. Введите валидный шестизначный идентификатор записи в левой панели для начала дешифровки стенограммы.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="dt-doc-view">
          <h2 className="dt-doc-title">Официальные предписания суда по ведению прослушивания</h2>
          <div className="dt-doc-text">
            <p>
              Согласно федеральному протоколу верификации и судебному разрешению <strong>№ 404-А</strong>, детективное агентство <strong>Dark Trace</strong> уполномочено запрашивать записи соединений сотовой вышки округа Блэкуотер.
            </p>
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '1px', marginTop: '20px', borderBottom: '1px solid #1f293d', paddingBottom: '6px' }}>
              Алгоритм работы аналитика:
            </h3>
            <ol className="dt-doc-list">
              <li>Откройте скан судебного ордера в почтовом клиенте OneMail.</li>
              <li>Скопируйте телефонные номера фигурантов дела (Маркус Флинн, Веспер Уэйнрайт, Розалия Андервуд).</li>
              <li>Запустите браузер и перейдите на страницу провайдера <strong>Riverton Telecom</strong>.</li>
              <li>Введите номер ордера, номер целевого абонента и укажите дату преступления: <strong style={{ color: '#cda052' }}>21.06.2025</strong>.</li>
              <li>Используйте полученные ID-коды в левой панели дешифратора для прослушивания записей разговоров.</li>
            </ol>
            <div className="dt-doc-warning">
              <strong>Внимание!</strong> Архивные записи за смежные или нецелевые даты могут содержать бытовой спам, не относящийся к делу. Задача детектива — отсеять ложные диалоги и выявить критически важные зацепки (мотивы, угрозы, алиби).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
