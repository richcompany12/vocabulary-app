'use client';
import { useEffect } from 'react';

const BackHandler = ({ activeTab, setActiveTab, resetQuizState }) => {  // resetQuizState 추가
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      
      if (activeTab === 'vocabulary') {
        if (window.confirm('어플을 종료하시겠습니까?')) {
          window.close();
        }
      } else {
        if (window.confirm('현재 단계를 종료하고 홈화면으로 이동하시겠습니까?')) {
          setActiveTab('vocabulary');
          resetQuizState();  // 퀴즈 상태 초기화
        }
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [activeTab, setActiveTab, resetQuizState]);

  return null;
};

export default BackHandler;