// 객관식 보기에서 틀린 보기 생성
export const generateWrongOptions = (correctWord, allWords, isEngToKor = true) => {
  const otherWords = allWords.filter(w => 
    isEngToKor ? w.meaning !== correctWord.meaning : w.word !== correctWord.word
  );
  return [...otherWords]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => isEngToKor ? w.meaning : w.word);
};

// 단어의 일부를 가려서 힌트 만들기
export const createWordHint = (word) => {
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
  return hintWord.join('');
};

// 발음 재생
export const playPronunciation = (word) => {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = 'en-US';
  window.speechSynthesis.speak(speech);
};