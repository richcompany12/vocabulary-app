'use client';
import { useState } from 'react';
import { Book, PenTool, XCircle, Search } from 'lucide-react';
import VocabularyList from '../components/VocabularyList';
import QuizBasic from '../components/QuizBasic';
import QuizMultipleChoice from '../components/QuizMultipleChoice';
import { useVocabulary } from '../hooks/useVocabulary';
import { useQuiz } from '../hooks/useQuiz';
import BackHandler from '../components/BackHandler';

export default function Home() {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const {
    words,
    showMeaning,
    searchTerm,
    selectedCategory,
    categories,
    setSearchTerm,
    setSelectedCategory,
    addWord,
    deleteWord,
    toggleFavorite,
    toggleMeaning,
  } = useVocabulary();

  const {
    quizMode,
    setQuizMode,
    quizWords,
    isQuizStarted,
    wrongAnswers,
    startQuiz,
    endQuiz,
    removeFromWrongAnswers,
  } = useQuiz();

  // 새 단어 추가 상태
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');

  // 새 단어 추가 핸들러
  const handleAddWord = () => {
    if (newWord && newMeaning) {
      addWord(newWord, newMeaning);
      setNewWord('');
      setNewMeaning('');
    }
  };

return (
  <main className="flex min-h-screen flex-col items-center p-8">
    <BackHandler activeTab={activeTab} setActiveTab={setActiveTab} />
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
  	onClick={() => {
  	  setActiveTab('quiz');
 	   setQuizMode(null);  // 퀴즈 모드 초기화
 	   setIsQuizStarted(false);  // 퀴즈 시작 상태 초기화
	  }}
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
        <div className="w-full max-w-2xl">
          {/* 검색 바 */}
          <div className="mb-4">
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
          <div className="flex flex-wrap gap-2 mb-6">
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
          <div className="flex gap-2 mb-8">
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
              onClick={handleAddWord}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              추가
            </button>
          </div>

          {/* 단어 목록 */}
          <VocabularyList
            words={words}
            onToggleFavorite={toggleFavorite}
            onToggleMeaning={toggleMeaning}
            showMeaning={showMeaning}
          />
        </div>
      )}

      {/* 학습하기 모드 */}
      {activeTab === 'quiz' && (
        <div className="w-full max-w-2xl">
          {!isQuizStarted ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setQuizMode('basic');
                    startQuiz(words);
                  }}
                  className="p-6 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold mb-2">빈칸 채우기</h3>
                  <p className="text-sm text-gray-600">단어의 일부를 보고 완성하세요</p>
                </button>
                <button
                  onClick={() => {
                    setQuizMode('multiple-eng');
                    startQuiz(words);
                  }}
                  className="p-6 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold mb-2">영어 객관식</h3>
                  <p className="text-sm text-gray-600">한글 뜻을 보고 영어 단어를 고르세요</p>
                </button>
                <button
                  onClick={() => {
                    setQuizMode('multiple-kor');
                    startQuiz(words);
                  }}
                  className="p-6 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold mb-2">한글 객관식</h3>
                  <p className="text-sm text-gray-600">영어 단어를 보고 한글 뜻을 고르세요</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {quizMode === 'basic' && (
                <QuizBasic
                  words={quizWords}
                  onComplete={endQuiz}
                />
              )}
              {quizMode === 'multiple-eng' && (
                <QuizMultipleChoice
                  words={quizWords}
                  onComplete={endQuiz}
                  mode="korToEng"
                />
              )}
              {quizMode === 'multiple-kor' && (
                <QuizMultipleChoice
                  words={quizWords}
                  onComplete={endQuiz}
                  mode="engToKor"
                />
              )}
            </>
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
            <VocabularyList
              words={wrongAnswers}
              onToggleFavorite={toggleFavorite}
              onToggleMeaning={toggleMeaning}
              showMeaning={showMeaning}
              onDelete={removeFromWrongAnswers}
            />
          )}
        </div>
      )}
    </main>
  );
}