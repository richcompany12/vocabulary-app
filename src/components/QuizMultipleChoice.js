'use client';
import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

const QuizMultipleChoice = ({ words, onComplete, mode = 'engToKor' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // 객관식 보기 생성
  const generateOptions = (correctAnswer) => {
    const otherWords = words.filter(w => 
      mode === 'engToKor' 
        ? w.meaning !== correctAnswer 
        : w.word !== correctAnswer
    );
    const shuffledWords = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledWords.slice(0, 3);
    const allOptions = [...wrongOptions, words[currentQuestion]];
    return allOptions
      .sort(() => Math.random() - 0.5)
      .map(w => mode === 'engToKor' ? w.meaning : w.word);
  };

  // 새로운 문제 설정
  useEffect(() => {
    if (currentQuestion < words.length) {
      const correctAnswer = mode === 'engToKor' 
        ? words[currentQuestion].meaning 
        : words[currentQuestion].word;
      setOptions(generateOptions(correctAnswer));
    }
  }, [currentQuestion, words, mode]);

  // 답안 체크
  const checkAnswer = (selectedOption) => {
    const currentWord = words[currentQuestion];
    const correctAnswer = mode === 'engToKor' ? currentWord.meaning : currentWord.word;
    const isAnswerCorrect = selectedOption === correctAnswer;

    setSelectedAnswer(selectedOption);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, currentWord]);
    }

    // 잠시 후 다음 문제로
    setTimeout(() => {
      if (currentQuestion < words.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        onComplete({ score, wrongAnswers: [...wrongAnswers, currentWord] });
      }
    }, 1500);
  };

  if (currentQuestion >= words.length) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">퀴즈 완료!</h3>
        <p className="text-xl">
          점수: {score} / {words.length}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            문제 {currentQuestion + 1} / {words.length}
          </span>
          <span className="text-sm text-gray-500">
            점수: {score}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold mb-6 text-center">
          {mode === 'engToKor' 
            ? words[currentQuestion].word
            : words[currentQuestion].meaning}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => !selectedAnswer && checkAnswer(option)}
              className={`p-4 text-lg rounded-lg border transition-colors
                ${selectedAnswer
                  ? option === (mode === 'engToKor' ? words[currentQuestion].meaning : words[currentQuestion].word)
                    ? 'bg-green-100 border-green-500'
                    : option === selectedAnswer
                      ? 'bg-red-100 border-red-500'
                      : 'bg-gray-50 border-gray-200'
                  : 'hover:bg-gray-50 border-gray-200'
                }
              `}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizMultipleChoice;