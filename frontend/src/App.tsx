import { useState, useEffect } from 'react';

interface AnalysisResult {
  skills: string[];
  frameworks: string[];
  soft_skills: string[];
  common_words: string[];
}

interface HistoryItem {
  text: string;
  result: AnalysisResult;
}

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const analyzeJob = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Ошибка анализа');
      }

      const data: AnalysisResult = await res.json();
      setResult(data);

      const updatedHistory = [{ text, result: data }, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('history', JSON.stringify(updatedHistory));
    } catch (e) {
      setError((e as Error).message || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Job JD Analyzer</h1>

      <textarea
        rows={10}
        style={{ width: '100%' }}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Вставьте описание вакансии..."
      />

      <button onClick={analyzeJob} disabled={loading}>
        {loading ? 'Анализ...' : 'Проанализировать'}
      </button>

      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Ключевые навыки:</h2>
          <ul>{result.skills.map((skill, idx) => <li key={idx}>{skill}</li>)}</ul>

          <h3>Фреймворки:</h3>
          <ul>{result.frameworks.map((fw, idx) => <li key={idx}>{fw}</li>)}</ul>

          <h3>Soft skills:</h3>
          <ul>{result.soft_skills.map((s, idx) => <li key={idx}>{s}</li>)}</ul>

          <h3>Повторяющиеся слова:</h3>
          <ul>{result.common_words.map((w, idx) => <li key={idx}>{w}</li>)}</ul>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2>История анализов (последние 5):</h2>
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>
                <strong>Текст:</strong> {item.text.slice(0, 50)}...
                <br />
                <strong>Навыки:</strong> {item.result.skills.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
