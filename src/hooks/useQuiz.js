'use client';
import { useState, useEffect } from 'react';

export const useQuiz = () => {
  const [quizMode, setQuizMode] = useState(null);  // null로 초기화
  const [quizWords, setQuizWords] = useState([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wrongAnswers');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 탭 변경 시 퀴즈 상태 초기화 함수
  const resetQuizState = () => {
    setQuizMode(null);
    setQuizWords([]);
    setIsQuizStarted(false);
  };

  // 퀴즈 시작
  const startQuiz = (words, count = 10) => {
    const shuffled = [...words]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    setQuizWords(shuffled);
    setIsQuizStarted(true);
  };

  // 퀴즈 종료
  const endQuiz = (result) => {
    if (result?.wrongAnswers?.length > 0) {
      const newWrongAnswers = [...wrongAnswers];
      result.wrongAnswers.forEach(wrongWord => {
        if (!newWrongAnswers.find(w => w.id === wrongWord.id)) {
          newWrongAnswers.push(wrongWord);
        }
      });
      setWrongAnswers(newWrongAnswers);
    }
    resetQuizState();  // 퀴즈 종료 시 상태 초기화
  };

  return {
    quizMode,
    setQuizMode,
    quizWords,
    isQuizStarted,
    wrongAnswers,
    startQuiz,
    endQuiz,
    resetQuizState,  // 새로 추가된 초기화 함수 export
  };
};