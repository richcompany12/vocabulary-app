'use client';
import React, { useState, useEffect } from 'react';
import { Star, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

const VocabularyList = ({ words, onToggleFavorite, onToggleMeaning, showMeaning }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const wordsPerPage = 5;
  const [randomizedWords, setRandomizedWords] = useState([]);

  // 필터링된 words가 변경될 때마다 페이지를 리셋하고 새로운 랜덤 순서 생성
  useEffect(() => {
    setCurrentPage(0);  // 페이지 리셋
    const newRandomWords = [...words];
    // 카테고리나 검색어 변경 시에는 랜덤화하지 않음
    if (words.length === newRandomWords.length) {
      newRandomWords.sort(() => Math.random() - 0.5);
    }
    setRandomizedWords(newRandomWords);
  }, [words]);

  // 현재 페이지의 단어들
  const currentWords = randomizedWords.slice(
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
    if ((currentPage + 1) * wordsPerPage < randomizedWords.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 페이지 번호가 전체 페이지 수를 초과하지 않도록
  useEffect(() => {
    const maxPage = Math.ceil(randomizedWords.length / wordsPerPage) - 1;
    if (currentPage > maxPage) {
      setCurrentPage(Math.max(0, maxPage));
    }
  }, [randomizedWords.length, currentPage]);

  return (
    <div className="w-full max-w-2xl">
      {/* 단어 목록 */}
      <div className="space-y-4 mb-4">
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

      {/* 페이지 네비게이션 */}
      {randomizedWords.length > 0 && (
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
            {randomizedWords.length > 0 ? `${currentPage * wordsPerPage + 1} - ${Math.min((currentPage + 1) * wordsPerPage, randomizedWords.length)} / ${randomizedWords.length}` : '0 - 0 / 0'}
          </span>
          <button 
            onClick={nextPage}
            disabled={(currentPage + 1) * wordsPerPage >= randomizedWords.length}
            className={`px-4 py-2 rounded-lg ${
              (currentPage + 1) * wordsPerPage >= randomizedWords.length 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            다음 페이지
          </button>
        </div>
      )}
    </div>
  );
};

export default VocabularyList;