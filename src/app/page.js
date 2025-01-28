'use client';
import { useState, useEffect } from 'react';
import { Star, Volume2, Search, Trash2, Book, PenTool, XCircle } from 'lucide-react';
import { vocabData } from '../data/vocab-data';

export default function Home() {
  // 기본 상태 관리
  const [words, setWords] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vocabulary');
      return saved ? JSON.parse(saved) : vocabData;
    }
    return vocabData;
  });

  const [activeTab, setActiveTab] = useState('vocabulary');  // 탭 상태 추가
  const [showMeaning, setShowMeaning] = useState({});
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 퀴즈 관련 상태
  const [quizWords, setQuizWords] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wrongAnswers');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
  }, [wrongAnswers]);

  // 카테고리 목록 생성
  const categories = ['전체', ...new Set(words.map(word => word.category))].sort();

  // 단어 필터링
  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.includes(searchTerm);
    const matchesCategory = selectedCategory === '전체' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 단어 추가
  const addWord = () => {
    if (newWord && newMeaning) {
      setWords([
        ...words,
        {
          id: Date.now(),
          word: newWord,
          meaning: newMeaning,
          category: '사용자 추가',
          isFavorite: false,
        },
      ]);
      setNewWord('');
      setNewMeaning('');
    }
  };

  // 단어 삭제
  const deleteWord = (id) => {
    if (confirm('이 단어를 삭제하시겠습니까?')) {
      setWords(words.filter(word => word.id !== id));
    }
  };

  // 즐겨찾기 토글
  const toggleFavorite = (id) => {
    setWords(words.map(word =>
      word.id === id ? { ...word, isFavorite: !word.isFavorite } : word
    ));
  };

  // 뜻 보기/숨기기 토글
  const toggleMeaning = (id) => {
    setShowMeaning(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 발음 재생
  const playPronunciation = (word) => {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  // 퀴즈 시작
  const startQuiz = () => {
    const shuffled = [...words]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setQuizWords(shuffled);
    setCurrentQuiz(0);
    setUserAnswer('');
  };

  // 답안 제출
  const submitAnswer = () => {
    const currentWord = quizWords[currentQuiz];
    const isCorrect = userAnswer.toLowerCase() === currentWord.word.toLowerCase();
    
    if (!isCorrect && !wrongAnswers.find(w => w.id === currentWord.id)) {
      setWrongAnswers([...wrongAnswers, currentWord]);
    }

    setUserAnswer('');
    
    if (currentQuiz < quizWords.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      setCurrentQuiz(null);
      setQuizWords([]);
      alert('퀴즈가 종료되었습니다!');
    }
  };

  // 오답 노트에서 제거
  const removeFromWrongAnswers = (id) => {
    setWrongAnswers(wrongAnswers.filter(word => word.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">초등 영어 단어장 📚</h1>

      {/* 탭 메뉴 */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`py-2 px-4 ${activeTab === 'vocabulary' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <Book className="w-5 h-5 inline-block mr-2" />
            단어장
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-2 px-4 ${activeTab === 'quiz' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <PenTool className="w-5 h-5 inline-block mr-2" />
            학습하기
          </button>
          <button
            onClick={() => setActiveTab('wrongnotes')}
            className={`py-2 px-4 ${activeTab === 'wrongnotes' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <XCircle className="w-5 h-5 inline-block mr-2" />
            오답 노트 ({wrongAnswers.length})
          </button>
        </div>
      </div>

      {/* 단어장 모드 */}
      {activeTab === 'vocabulary' && (
        <>
          {/* 검색 바 */}
          <div className="w-full max-w-2xl mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="단어 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="w-full max-w-2xl mb-6 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 새 단어 추가 폼 */}
          <div className="w-full max-w-2xl mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="새로운 단어"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="뜻"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={addWord}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                추가
              </button>
            </div>
          </div>

          {/* 단어 목록 */}
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            {filteredWords.map((word) => (
              <div key={word.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{word.word}</h3>
                    <button
                      onClick={() => toggleFavorite(word.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Star
                        className="w-5 h-5"
                        fill={word.isFavorite ? "gold" : "none"}
                        color={word.isFavorite ? "gold" : "gray"}
                      />
                    </button>
                    <button
                      onClick={() => playPronunciation(word.word)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleMeaning(word.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {showMeaning[word.id] ? '뜻 숨기기' : '뜻 보기'}
                    </button>
                    <button
                      onClick={() => deleteWord(word.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {showMeaning[word.id] && (
                  <p className="text-gray-600 mt-2">{word.meaning}</p>
                )}
                <span className="text-xs text-gray-500 mt-1">{word.category}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 학습 모드 */}
      {activeTab === 'quiz' && (
        <div className="w-full max-w-2xl">
          {!currentQuiz && (
            <div className="text-center">
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                퀴즈 시작하기
              </button>
              <p className="mt-4 text-gray-600">10개의 랜덤 단어로 퀴즈가 출제됩니다.</p>
            </div>
          )}

          {currentQuiz !== null && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl mb-4">
                문제 {currentQuiz + 1}/{quizWords.length}
              </h3>
              <p className="text-2xl font-bold mb-4">{quizWords[currentQuiz].meaning}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                  placeholder="영어 단어를 입력하세요"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={submitAnswer}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  제출
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 오답 노트 */}
      {activeTab === 'wrongnotes' && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">오답 노트</h2>
          {wrongAnswers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">아직 오답이 없습니다!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {wrongAnswers.map((word) => (
                <div key={word.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{word.word}</h3>
                      <p className="text-gray-600">{word.meaning}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => playPronunciation(word.word)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeFromWrongAnswers(word.id)}
                        className="p-1 hover:bg-gray-100 rounded text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}