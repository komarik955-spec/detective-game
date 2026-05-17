import React, { useState } from 'react';
import './PharmaNet.css';

export default function PharmaNet() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (searchQuery.toLowerCase().trim() === 'сертофин') {
      setSearchResult({
        name: 'Сертофин (Sertofin)',
        activeIngredient: 'Солацетин',
        group: 'Антидепрессант. Селективный ингибитор обратного захвата серотонина (СИОЗС).',
        indications: 'Депрессивные эпизоды различной степени тяжести, Обсессивно-компульсивное расстройство (ОКР), Паническое расстройство, Посттравматическое стрессовое расстройство (ПТСР).',
        dosage: 'Стандартная терапевтическая доза составляет 50-100 мг в сутки. Максимальная суточная доза — 100 мг. Препарат отпускается строго по рецепту врача.',
        overdose: 'Симптомы: Сонливость, тошнота, тахикардия, тремор, ажитация. В редких случаях — судороги, серотониновый синдром.',
        lethality: 'Изолированная передозировка солацетина редко приводит к летальному исходу. Однако, при комбинации с другими веществами (алкоголь, бензодиазепины, другие антидепрессанты) токсичность резко возрастает, что может привести к угнетению ЦНС, остановке дыхания и смерти.',
        investigationNote: 'При подозрении на умышленную передозировку необходимо проводить токсикологический анализ не только на солацетин, но и на сопутствующие вещества, которые могли быть использованы для усиления эффекта.'
      });
    } else {
      setSearchResult(null);
    }
  };

  return (
    <div className="pharma-net">
      <header className="pharma-header">
        <div className="pharma-logo">
          <span className="pharma-icon">💊</span>
          <span className="pharma-name">PharmaNet <small>Online</small></span>
        </div>
        <nav className="pharma-nav">
          <span>Каталог</span>
          <span>Доставка</span>
          <span>Аптеки</span>
          <span className="pharma-login">Личный кабинет</span>
        </nav>
      </header>

      <main className="pharma-content">
        <section className="pharma-hero">
          <h1>Единая справочная служба лекарственных средств</h1>
          <p>Поиск по базе данных сертифицированных препаратов</p>
          
          <form className="pharma-search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Введите название препарата..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">НАЙТИ</button>
          </form>
        </section>

        <div className="pharma-results-area">
          {hasSearched ? (
            searchResult ? (
              <div className="pharma-card">
                {/* ... existing card code ... */}
                <div className="pharma-card-header">
                  <h2>{searchResult.name}</h2>
                  <span className="pharma-prescription-tag">По рецепту</span>
                </div>
                
                <div className="pharma-card-body">
                  <div className="pharma-image-placeholder">
                    <div className="pharma-photo-frame">
                      <span>ФОТО ПРЕПАРАТА</span>
                    </div>
                  </div>

                  <div className="pharma-details">
                    <div className="pharma-detail-item">
                      <strong>Действующее вещество:</strong> {searchResult.activeIngredient}
                    </div>
                    <div className="pharma-detail-item">
                      <strong>Фармакологическая группа:</strong> {searchResult.group}
                    </div>
                    <div className="pharma-detail-item">
                      <strong>Показания к применению:</strong>
                      <p>{searchResult.indications}</p>
                    </div>
                    <div className="pharma-detail-item">
                      <strong>Способ применения и дозы:</strong>
                      <p>{searchResult.dosage}</p>
                    </div>
                  </div>
                </div>

                <div className="pharma-warning-section">
                  <div className="pharma-warning-box">
                    <h3>⚠️ Передозировка и Токсичность:</h3>
                    <p><strong>Симптомы:</strong> {searchResult.overdose}</p>
                    <p><strong>Летальность:</strong> {searchResult.lethality}</p>
                  </div>
                  
                  <div className="pharma-investigation-box">
                    <h3>📁 Заметка для следствия:</h3>
                    <p>{searchResult.investigationNote}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pharma-no-results">
                По запросу "{searchQuery}" ничего не найдено. Проверьте правильность написания.
              </div>
            )
          ) : (
            <div className="pharma-featured">
              <h3>Популярные товары</h3>
              <div className="pharma-grid">
                <div className="pharma-item-card">
                  <div className="pharma-item-img">💊</div>
                  <h4>Аспирин-Ультра</h4>
                  <p>Обезболивающее и жаропонижающее</p>
                  <span className="pharma-price">249 ₽</span>
                </div>
                <div className="pharma-item-card">
                  <div className="pharma-item-img">🧪</div>
                  <h4>Линекс Форте</h4>
                  <p>Нормализация микрофлоры кишечника</p>
                  <span className="pharma-price">580 ₽</span>
                </div>
                <div className="pharma-item-card">
                  <div className="pharma-item-img">🌿</div>
                  <h4>Валериана Экстракт</h4>
                  <p>Седативное средство растительного происхождения</p>
                  <span className="pharma-price">120 ₽</span>
                </div>
                <div className="pharma-item-card">
                  <div className="pharma-item-img">🧊</div>
                  <h4>Терафлю</h4>
                  <p>Для облегчения симптомов гриппа и простуды</p>
                  <span className="pharma-price">450 ₽</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="pharma-footer">
        <p>© 2025 PharmaNet. Все права защищены. Информация на сайте носит ознакомительный характер.</p>
      </footer>
    </div>
  );
}
