'use client';
import { useState, useEffect } from 'react';

export const useQuiz = () => {
  // 오답 노트 상태 관리
  const [wrongAnswers, setWrongAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wrongAnswers');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 퀴즈 상태
  const [quizMode, setQuizMode] = useState('basic'); // 'basic', 'multiple-eng', 'multiple-kor', 'writing'
  const [quizWords, setQuizWords] = useState([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  // 오답 노트 저장
  useEffect(() => {
    localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
  }, [wrongAnswers]);

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
    if (result.wrongAnswers.length > 0) {
      // 중복 제거하면서 오답 추가
      const newWrongAnswers = [...wrongAnswers];
      result.wrongAnswers.forEach(wrongWord => {
        if (!newWrongAnswers.find(w => w.id === wrongWord.id)) {
          newWrongAnswers.push(wrongWord);
        }
      });
      setWrongAnswers(newWrongAnswers);
    }
    setIsQuizStarted(false);
    setQuizWords([]);
  };

  // 오답 노트에서 단어 제거
  const removeFromWrongAnswers = (id) => {
    setWrongAnswers(wrongAnswers.filter(word => word.id !== id));
  };

  return {
    quizMode,
    setQuizMode,
    quizWords,
    isQuizStarted,
    wrongAnswers,
    startQuiz,
    endQuiz,
    removeFromWrongAnswers,
  };
};