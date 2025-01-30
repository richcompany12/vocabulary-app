import { useState, useEffect } from 'react';

const useVocabulary = () => {
  const [words, setWords] = useState([]);
  const [showMeaning, setShowMeaning] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'noun', 'verb', 'adjective', 'adverb'];

  useEffect(() => {
    // 초기 단어 목록을 랜덤으로 섞기
    const initialWords = [
      { id: 1, word: 'apple', meaning: '사과', category: 'noun', isFavorite: false },
      { id: 2, word: 'run', meaning: '달리다', category: 'verb', isFavorite: false },
      // 추가 단어들...
    ];
    const shuffledWords = initialWords.sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
  }, []);

  const addWord = (word, meaning) => {
    const newWord = {
      id: words.length + 1,
      word,
      meaning,
      category: selectedCategory,
      isFavorite: false,
    };
    setWords([...words, newWord]);
  };

  const deleteWord = (id) => {
    setWords(words.filter((word) => word.id !== id));
  };

  const toggleFavorite = (id) => {
    setWords(
      words.map((word) =>
        word.id === id ? { ...word, isFavorite: !word.isFavorite } : word
      )
    );
  };

  const toggleMeaning = (id) => {
    setShowMeaning({
      ...showMeaning,
      [id]: !showMeaning[id],
    });
  };

  return {
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
  };
};

export default useVocabulary;