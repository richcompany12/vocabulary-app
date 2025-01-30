'use client';
import { useState, useEffect } from 'react';
import { vocabData } from '../data/vocab-data';

export const useVocabulary = () => {
  // 단어장 데이터 상태
const [words, setWords] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('vocabulary');
    const initialWords = saved ? JSON.parse(saved) : vocabData;
    // 초기 로드 시에만 랜덤으로 섞기
    return [...initialWords].sort(() => Math.random() - 0.5);
  }
  return [...vocabData].sort(() => Math.random() - 0.5);
});

  // 단어 뜻 보이기/숨기기 상태
  const [showMeaning, setShowMeaning] = useState({});
  
  // 검색어와 카테고리 필터
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(words));
  }, [words]);

  // 단어 추가
  const addWord = (newWord, meaning, category = '사용자 추가') => {
    const word = {
      id: Date.now(),
      word: newWord,
      meaning,
      category,
      isFavorite: false,
    };
    setWords([...words, word]);
  };

  // 단어 삭제
  const deleteWord = (id) => {
    setWords(words.filter(word => word.id !== id));
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

  // 필터링된 단어 목록
  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.includes(searchTerm);
    const matchesCategory = selectedCategory === '전체' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 카테고리 목록
  const categories = ['전체', ...new Set(words.map(word => word.category))].sort();

  return {
    words: filteredWords,
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
  };
};