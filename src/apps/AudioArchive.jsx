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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans p-6 selection:bg-[#cda052] selection:text-[#0b0f19]">
      <header className="border-b border-[#253248] pb-4 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9c7b41] to-[#cda052] flex items-center justify-center text-[#0b0f19] font-bold">
            DT
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-[#cda052]">DARK TRACE • TERMINAL</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Агентство расследований и криминального анализа</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs bg-[#162235] px-3 py-1.5 rounded-md border border-[#253248] font-mono text-emerald-400">
            SECURE LINK ACTIVE
          </span>
        </div>
      </header>

      <div className="flex space-x-1 bg-[#121b2d] p-1 rounded-lg border border-[#1e2a3e] max-w-md mb-6">
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'archive' ? 'bg-[#cda052] text-[#0b0f19]' : 'text-slate-400 hover:text-slate-100'}`}
        >
          📂 [06] ДЕШИФРАТОР АУДИО
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'info' ? 'bg-[#cda052] text-[#0b0f19]' : 'text-slate-400 hover:text-slate-100'}`}
        >
          📋 ИНСТРУКЦИЯ СУДА
        </button>
      </div>

      {activeTab === 'archive' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#111a2e] border border-[#1f2d44] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#cda052] block mb-1">Служба прослушки</span>
                <h2 className="text-lg font-bold">Запрос аудиодешифровки</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Введите шестизначный ID-код аудиопотока, выданный оператором связи <span className="text-[#cda052]">Riverton Telecom</span> на основании судебного разрешения № 404-А.
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4 mb-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                    ID-код аудиозаписи (6 цифр)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="Например: 041187"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-[#090d16] border border-[#2d3f5a] rounded-lg px-4 py-3 text-slate-100 font-mono text-center text-lg tracking-widest focus:outline-none focus:border-[#cda052] transition-colors"
                    />
                    <button
                      type="submit"
                      className="bg-[#cda052] hover:bg-[#b08842] text-[#0b0f19] px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#cda052]/10"
                    >
                      ПОДКЛЮЧИТЬ
                    </button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-400 leading-relaxed font-mono">
                  ⚠️ {error}
                </div>
              )}

              {!activeRecord && !error && (
                <div className="p-4 bg-[#090d16] border border-[#1b2637] rounded-lg text-xs text-slate-400 leading-relaxed">
                  💡 <span className="text-slate-200">Где взять код?</span> Сначала изучите ордер Слейта в почте, выпишите телефоны фигурантов, отправьте запрос на сайте провайдера Riverton Telecom за дату <strong className="text-slate-200">21.06.2025</strong> и скопируйте выданные коды записей.
                </div>
              )}
            </div>

            {activeRecord && (
              <div className="mt-6 border-t border-[#1e2c41] pt-5">
                <div className="bg-[#090d16] border border-[#1b2637] rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[9px] bg-[#223147] text-[#cda052] font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                        {activeRecord.type}
                      </span>
                      <h3 className="font-bold text-sm mt-1">{activeRecord.caller} ➡️ {activeRecord.receiver}</h3>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{activeRecord.time}</p>
                    </div>
                    <span className="text-xs font-mono text-[#cda052]">{activeRecord.duration}</span>
                  </div>

                  <div className="h-14 flex items-center justify-between px-2 gap-0.5 bg-[#0e1423] rounded-lg mb-4 overflow-hidden border border-[#1c273a]">
                    {[...Array(32)].map((_, i) => {
                      const baseHeight = 15 + Math.sin(i * 0.4) * 15 + Math.cos(i * 0.25) * 10;
                      const animationHeight = isPlaying
                        ? `${Math.max(4, Math.min(48, baseHeight + (Math.random() - 0.5) * 20))}px`
                        : `${Math.max(4, baseHeight * 0.15)}px`;

                      return (
                        <div
                          key={i}
                          style={{ height: animationHeight }}
                          className={`w-[3px] rounded-full transition-all duration-100 ${isPlaying ? 'bg-gradient-to-t from-[#9c7b41] to-[#cda052]' : 'bg-slate-600'}`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={togglePlay}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isPlaying ? 'bg-red-900/40 border border-red-700/60 text-red-200 hover:bg-red-900/60' : 'bg-[#cda052] hover:bg-[#b08842] text-[#0b0f19]'}`}
                    >
                      {isPlaying ? (
                        <>
                          <span className="inline-block w-2.5 h-2.5 bg-red-400 rounded-sm animate-pulse" />
                          ПАУЗА
                        </>
                      ) : (
                        <>
                          <span className="inline-block border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#0b0f19]" />
                          СЛУШАТЬ ЗАПИСЬ
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetPlayer}
                      className="bg-[#182335] hover:bg-[#202e46] text-slate-300 border border-[#293b54] p-2.5 rounded-lg text-xs"
                    >
                      🔄 СБРОС
                    </button>
                  </div>

                  <div className="mt-3 bg-[#131c2d] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#9c7b41] to-[#cda052] h-full transition-all duration-100"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-[#111a2e] border border-[#1f2d44] rounded-xl p-5 flex flex-col min-h-[480px]">
            <div className="border-b border-[#1e2c41] pb-3 mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Стенограмма переговоров</h2>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Голосовой поток декодирован ИИ Dark Trace</p>
              </div>
              {activeRecord && activeRecord.isCritical && (
                <span className="text-[9px] bg-amber-950/40 border border-amber-600/50 text-amber-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  ⚠️ Критическая улика
                </span>
              )}
            </div>

            {activeRecord ? (
              <div className="flex-1 overflow-y-auto space-y-4 max-h-[380px] pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {activeRecord.transcript.map((line, index) => {
                  const isTarget = line.speaker === "Маркус" || line.speaker === "Розалия" || line.speaker === "Веспер" || line.speaker === "Селена";

                  return (
                    <div
                      key={index}
                      className={`p-3.5 rounded-lg border leading-relaxed ${isTarget ? 'bg-[#152037] border-[#2c3d5a]' : 'bg-[#0a0f19] border-[#182337]'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold font-mono tracking-wide ${isTarget ? 'text-[#cda052]' : 'text-slate-300'}`}>
                          {line.speaker}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">Ch.{index + 1}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans">{line.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 border border-dashed border-[#1f2d44] rounded-xl bg-[#090d16]">
                <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-xl mb-3">
                  🎙️
                </div>
                <p className="text-xs text-center leading-relaxed">
                  Нет активного потока. Введите валидный шестизначный идентификатор записи в левой панели для начала дешифровки стенограммы.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#111a2e] border border-[#1f2d44] rounded-xl p-6 max-w-3xl">
          <h2 className="text-lg font-bold text-[#cda052] mb-3">Официальные предписания суда по ведению прослушивания</h2>
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <p>
              Согласно федеральному протоколу верификации и судебному разрешению <strong>№ 404-А</strong>, детективное агентство <strong>Dark Trace</strong> уполномочено запрашивать записи соединений сотовой вышки округа Блэкуотер.
            </p>
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[10px] border-b border-[#1e2c41] pb-1.5 pt-2">Алгоритм работы аналитика:</h3>
            <ol className="list-decimal list-inside space-y-2 pl-1">
              <li>Откройте скан судебного ордера в почтовом клиенте OneMail.</li>
              <li>Скопируйте телефонные номера фигурантов дела (Маркус Флинн, Веспер Уэйнрайт, Розалия Андервуд).</li>
              <li>Запустите браузер и перейдите на страницу провайдера <strong>Riverton Telecom</strong>.</li>
              <li>Введите номер ордера, номер целевого абонента и укажите дату преступления: <strong className="text-amber-400">21.06.2025</strong>.</li>
              <li>Используйте полученные ID-коды в левой панели дешифратора для прослушивания записей разговоров.</li>
            </ol>
            <div className="p-3.5 bg-[#1a2335] border border-[#2b3c54] rounded-lg mt-4 text-slate-300 leading-relaxed">
              <strong>Внимание!</strong> Архивные записи за смежные или нецелевые даты могут содержать бытовой спам, не относящийся к делу. Задача детектива — отсеять ложные диалоги и выявить критически важные зацепки (мотивы, угрозы, алиби).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
