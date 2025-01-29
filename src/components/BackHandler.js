'use client';
import { useEffect } from 'react';

const BackHandler = ({ activeTab, setActiveTab }) => {
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      
      if (activeTab === 'vocabulary') {
        // 홈 화면에서 뒤로가기
        if (window.confirm('어플을 종료하시겠습니까?')) {
          window.close();
        }
      } else {
        // 다른 화면에서 뒤로가기
        if (window.confirm('현재 단계를 종료하고 홈화면으로 이동하시겠습니까?')) {
          setActiveTab('vocabulary');
        }
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [activeTab, setActiveTab]);

  return null;
};

export default BackHandler;