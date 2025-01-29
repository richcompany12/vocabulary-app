'use client';
import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

const QuizBasic = ({ words, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [hint, setHint] = useState('');

  // 현재 단어의 일부를 가린 힌트 생성
  useEffect(() => {
    if (currentQuestion < words.length) {
      const word = words[currentQuestion].word;
      // 단어의 30~50%를 _로 변경
      const hideCount = Math.floor(word.length * (Math.random() * 0.2 + 0.3));
      const positions = [];
      while (positions.length < hideCount) {
        const pos = Math.floor(Math.random() * word.length);
        if (!positions.includes(pos)) {
          positions.push(pos);
        }
      }
      
      let hintWord = word.split('');
      positions.forEach(pos => {
        hintWord[pos] = '_';
      });
      setHint(hintWord.join(''));
    }
  }, [currentQuestion, words]);

  // 발음 재생
  const playPronunciation = (word) => {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  // 답안 제출
  const submitAnswer = () => {
    const currentWord = words[currentQuestion];
    const isCorrect = userInput.toLowerCase() === currentWord.word.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('정답입니다! 👏');
    } else {
      setWrongAnswers([...wrongAnswers, currentWord]);
      setFeedback(`틀렸습니다. 정답은 ${currentWord.word} 입니다.`);
    }

    // 잠시 후 다음 문제로
    setTimeout(() => {
      if (currentQuestion < words.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserInput('');
        setFeedback('');
      } else {
        onComplete({ score, wrongAnswers: [...wrongAnswers, currentWord] });
      }
    }, 2000);
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

        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 mb-2">{words[currentQuestion].meaning}</p>
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-2xl font-mono font-bold">{hint}</h3>
            <button
              onClick={() => playPronunciation(words[currentQuestion].word)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
            placeholder="답을 입력하세요"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!feedback}
          />
          <button
            onClick={submitAnswer}
            disabled={!userInput || !!feedback}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            제출
          </button>
        </div>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            feedback.includes('정답') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBasic;