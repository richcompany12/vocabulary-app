'use client';
import React, { useState } from 'react';
import { Star, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

const VocabularyList = ({ words, onToggleFavorite, onToggleMeaning, showMeaning }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const wordsPerPage = 5;

  // 현재 페이지의 단어들만 선택
  const currentWords = words.slice(
    currentPage * wordsPerPage,
    (currentPage + 1) * wordsPerPage
  );

  // 발음 재생
  const playPronunciation = (word) => {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  // 이전 페이지로 이동
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const nextPage = () => {
    if ((currentPage + 1) * wordsPerPage < words.length) {
      setCurrentPage(currentPage + 1);
    }
  };

return (
  <div className="w-full max-w-2xl">
    {/* 단어 목록 */}
    <div className="space-y-4 mb-4">
      {currentWords.map((word) => (
        // 기존 단어 카드 코드...
      ))}
    </div>

    {/* 페이지 네비게이션 */}
    <div className="flex justify-center items-center gap-4 mt-6">
      <button 
        onClick={prevPage}
        disabled={currentPage === 0}
        className={`px-4 py-2 rounded-lg ${
          currentPage === 0 
            ? 'bg-gray-200 text-gray-400' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        이전 페이지
      </button>
      <span className="text-sm text-gray-600">
        {currentPage * wordsPerPage + 1} - {Math.min((currentPage + 1) * wordsPerPage, words.length)} / {words.length}
      </span>
      <button 
        onClick={nextPage}
        disabled={(currentPage + 1) * wordsPerPage >= words.length}
        className={`px-4 py-2 rounded-lg ${
          (currentPage + 1) * wordsPerPage >= words.length 
            ? 'bg-gray-200 text-gray-400' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        다음 페이지
      </button>
    </div>
  </div>
);
      <div className="space-y-4">
        {currentWords.map((word) => (
          <div key={word.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{word.word}</h3>
                <button
                  onClick={() => onToggleFavorite(word.id)}
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
              <button 
                onClick={() => onToggleMeaning(word.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {showMeaning[word.id] ? '뜻 숨기기' : '뜻 보기'}
              </button>
            </div>
            {showMeaning[word.id] && (
              <p className="text-gray-600 mt-2">{word.meaning}</p>
            )}
            <span className="text-xs text-gray-500 mt-1">{word.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyList;