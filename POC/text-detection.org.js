export function processImages(isChecked) {
    const images = document.getElementsByTagName('img');
    const { createWorker } = Tesseract;

    const dictionaryAsset = chrome.runtime.getURL("deps/dictionary.txt");
    let dictionary;
    fetch(dictionaryAsset)
        .then(response => response.text())
        .then(text => {
            dictionary = new Set(text.toLowerCase().split('\n'));
        });

    if (isChecked) {
        // prevents reinit when the ext is closed and opened
        if(!document.body.classList.contains('aid-text-detection')) {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                // Extract text from the image (implementation depends on how text is embedded)
                extractTextFromImage(image).then(resultText => {
                    let filteredWords = filterInvalidWordsAndLetters(resultText);
                    //console.log('checkWords: org: ', resultText, ' filtered: ', filteredWords );
                    if (filteredWords) {
                        // Add blue border
                        image.style.outline = '2px solid blue';
                
                        // Create a label element
                        const label = document.createElement('div');
                        label.textContent = 'Embedded text: ' + filteredWords;
                        label.class = 'aid-embed-label';
                        label.style.position = 'relative';
                        label.style.top = '20px';
                        label.style.textAlign= 'left';
                        label.style.color = 'white';
                        label.style.width = (image.width - 10) + 'px';
                        label.style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
                        label.style.padding = '2px 5px';
                        label.style.fontSize = '12px';
                
                        // Add the label to the image or a container
                        image.parentNode.insertBefore(label, image); 
                    }
                }); 
            }
            document.body.classList.add('aid-text-detection');
        }
    } else {
        document.body.classList.remove('aid-text-detection');
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            // Remove border and label
            image.style.outline = 'none';
    
            const label = image.previousSibling;
            if (label && label.tagName === 'DIV') {
                image.parentNode.removeChild(label);
            }
        }
    }

    function extractTextFromImage(image) {
        return new Promise((resolve, reject) => {
            (async () => {
                //const worker = await createWorker('eng');
                const worker = await createWorker('eng', 1, { logger: m => console.log(m) });
                // await worker.setParameters({
                //     tessedit_pageseg_mode: 'PSM_SPARSE_TEXT',
                // });
                const { data: { text } } = await worker.recognize(image);
                resolve(text);
                await worker.terminate();
            })();
        });
    }

    function filterInvalidWordsAndLetters(text) {
        // 1. Convert the text to lowercase and split it into words
        const words = text.toLowerCase().split(/\s+/);
        
        // 3. Filter out invalid words and letters
        const validWords = words.map(word => {
            let validWord = "";
            for (const char of word) {
                if (char.match(/^[\w-_.]*$/i)) { // Check if the character is a letter
                    validWord += char;
                }
            }
            // check if the words are only numbers with two or more digits
            let isNum = /^\d+$/.test(validWord);
            if(isNum && validWord.length > 1) return validWord;
            return dictionary.has(validWord) ? validWord : ""; // Keep only valid words
        }).filter(word => word !== ""); // Remove empty strings
        
        // 4. Join the valid words back into a string
        return validWords.join(" ");
    }
}
  
