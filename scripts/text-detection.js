export function processImages(isChecked) {
    const images = document.getElementsByTagName('img');
    const canvas = document.createElement('canvas');
    const dialog = document.createElement('dialog');
    const msg = document.createElement('p');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { createWorker } = Tesseract;
    let numOfJobs = 0;
    let completedJobs = 0;
    let runningJobs = {};

    dialog.style.width = '15em';
    dialog.style.textAlign = 'center';
    dialog.style.borderRadius = '2em';
    dialog.style.minHeight = '200px';
    msg.style.textTransform = 'Capitalize';
    msg.setAttribute('aria-live', 'polite');

    const dictionaryAsset = chrome.runtime.getURL("deps/dictionary.txt");
    let dictionary;
    fetch(dictionaryAsset)
        .then(response => response.text())
        .then(text => {
            dictionary = new Set(text.toLowerCase().split('\n'));
        });

    if (isChecked) {
        // prevents reinit when the ext is closed and opened
        if(!document.body.classList.contains('equa11y-text-detection')) {  // FIX ME: code stink
            generateDialog();
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                image.setAttribute('crossorigin', 'anonymous');
                toDataURL(image);
            }
            document.body.classList.add('equa11y-text-detection');
        }
    } else {
        document.body.classList.remove('equa11y-text-detection');
        dialog.close();
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            // Remove border and label
            image.style.outline = 'none';
            // revert to colour
            if(image.dataset.src) {
                image.src = image.dataset.src;
                image.removeAttribute('data-src');
            }
    
            const label = image.previousSibling;
            if (label && label.tagName === 'DIV') {
                image.parentNode.removeChild(label);
            }
        }
    }

    function extractTextFromImage(image) {
        return new Promise((resolve, reject) => {
            (async () => {
                const worker = await createWorker('eng', 1, { logger: m => statusLogger(m) });
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

    function extractText(image) {
        msg.textContent = 'Reading image content';
        // Extract text from the image (implementation depends on how text is embedded)
        extractTextFromImage(image).then(resultText => {
            let filteredWords = filterInvalidWordsAndLetters(resultText);
            //console.log('checkWords: org: ', resultText, ' filtered: ', filteredWords );
            if (filteredWords) {
                // Add blue border
                image.style.outline = '2px solid blue';
        
                // Create a label element
                const label = document.createElement('div');
                //label.textContent = 'Embedded text: ' + filteredWords;
                label.textContent = 'Embedded text';
                label.className = 'equa11y-label';
        
                // Add the label to the image or a container
                image.parentNode.insertBefore(label, image); 
            }
        });
    }

    function toDataURL(img) {
        try {
            fetch(img.src)
                .then(response => response.blob())
                .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                }))
                .then(dataURL => {
                    msg.textContent = 'Greyscaling Images';
                    makeGrayscale({ img, dataURL })
                    .then(img => {
                        extractText(img);
                    });
                })
                .catch(err => {
                    console.error("Can't fetch the resource");
                })
        } catch (err) {
            console.warn(`Image could not be converted to dataURI: ${img.src} with error: ${err}`);
        }
    }

    function makeGrayscale(imageData) {
        return new Promise(resolve => {
            const image = new Image();
            const { img, dataURL } = imageData;
        
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;

                ctx.drawImage(image, 0, 0);

                try {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    // grayscale and increase contrast
                    var contrast = 10; 
                    contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
                    var factor = (255 + contrast) / (255.01 - contrast); //add .1 to avoid /0 error

                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = factor * (avg - 128) + 128; // red
                        data[i + 1] = factor * (avg - 128) + 128; // green
                        data[i + 2] = factor * (avg - 128) + 128; // blue  
                    }
                    img.dataset.src = img.src;
                    ctx.putImageData(imageData, 0, 0);
                    if(img.srcset) img.removeAttribute('srcset');
                    img.src = canvas.toDataURL();
                    resolve(img);
                } catch (err) {
                    console.warn(`Image greyscale error: ${err} on image ${img.src}`);
                }
            }
            image.src = dataURL;
        });
    }
    
    function revertToColour() {
        for (let i = 0; i < images.length; i++) {
            // revert to colour
            images[i].src = images[i].dataset.src;
        };
    }

    function statusLogger(obj) {
        const { status, progress, userJobId } = obj;
        runningJobs[userJobId] = { status, progress };
        if(progress === 0) {
            numOfJobs++;
        }

        if(progress === 1) {
            completedJobs++;
        }

        msg.textContent = status;

        if(numOfJobs === completedJobs) {
            msg.textContent = 'Scanning Complete';
            setTimeout(() => {
                dialog.close();
                revertToColour();
            }, 2000);
        }
    }

    function generateDialog() {
        const title = document.createElement('h1');
        title.textContent = 'Scanning';
        title.style.fontSize = '2rem';
        title.style.paddingBottom = '1rem';

        msg.textContent = 'Initializing';

        dialog.append(title);
        dialog.append(msg);

        document.body.appendChild(dialog);
        dialog.showModal();
    }
}
  
