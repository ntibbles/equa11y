export function checkWords(sentence) {
    let dictionary;
    fetch('dictionary.txt')
        .then(response => response.text())
        .then(text => {
            dictionary = new Set(text.toLowerCase().split('\n'));
            // Now you can use the 'dictionary' set to check word validity
            filterInvalidWordsAndLetters(sentence);
        });

    function filterInvalidWordsAndLetters(text) {
        // 1. Convert the text to lowercase and split it into words
        const words = text.toLowerCase().split(/\s+/);
      
        // 3. Filter out invalid words and letters
        const validWords = words.map(word => {
          let validWord = "";
          for (const char of word) {
            if (char.match(/[a-z]/i)) { // Check if the character is a letter
              validWord += char;
            }
          }
          return dictionary.has(validWord) ? validWord : ""; // Keep only valid words
        }).filter(word => word !== ""); // Remove empty strings
      
        // 4. Join the valid words back into a string
        return validWords.join(" ");
    }
}