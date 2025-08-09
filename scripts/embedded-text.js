export function toggleEmbeddedTextDetection(isChecked) {
    // This function should only be called when AI is available
    // The routing between AI and Tesseract is handled in home.js
    const images = document.querySelectorAll('img');
    const clsList = ['equa11y-label'];
    const imgCls = ['equa11y-border', 'equa11y-embedded-text'];
    const config = { childList: true, subtree: true };
    
    let processedImages = new Set();
    let isProcessing = false;
    let abortController = null;
    
    // Timeout constants
    const IMAGE_LOAD_TIMEOUT = 5000; // 5 seconds
    const AI_PROCESSING_TIMEOUT = 10000; // 10 seconds
    const MAX_IMAGES_PER_BATCH = 20; // Limit batch size

    isChecked ? embeddedText_checked() : embeddedText_unchecked();

    function embeddedText_checked() {
        if (isProcessing) return;
        
        // Check if labels are already showing to prevent re-initialization
        const existingLabels = document.querySelectorAll('.equa11y-embedded-text-label');
        if (existingLabels.length > 0) {
            console.log('Embedded text detection already active');
            return;
        }
        
        isProcessing = true;
        
        // Show processing dialog
        showProcessingDialog();
        
        processAllImages();
        
        // Create a MutationObserver to watch for changes in the DOM
        if (window.equa11y_embedded_observer) {
            window.equa11y_embedded_observer.disconnect();
        }
        window.equa11y_embedded_observer = new MutationObserver((mutations) => {
            // Prevent infinite loops by checking if mutations are from our own changes
            const hasRelevantMutations = mutations.some(mutation => {
                return Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === Node.ELEMENT_NODE && 
                           node.tagName === 'IMG' && 
                           !node.classList.contains('equa11y-embedded-text');
                });
            });
            
            if (hasRelevantMutations && !isProcessing) {
                // Debounce the processing to avoid rapid successive calls
                clearTimeout(window.equa11y_embedded_debounce);
                window.equa11y_embedded_debounce = setTimeout(() => {
                    processAllImages();
                }, 1000);
            }
        });
        window.equa11y_embedded_observer.observe(document.body, config);
    }

    function embeddedText_unchecked() {
        isProcessing = false;
        
        // Abort any ongoing processing
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        
        // Disconnect observer and clear debounce timer
        if (window.equa11y_embedded_observer) {
            window.equa11y_embedded_observer.disconnect();
        }
        if (window.equa11y_embedded_debounce) {
            clearTimeout(window.equa11y_embedded_debounce);
        }
        
        // Remove all labels and borders
        document.querySelectorAll('.equa11y-embedded-text').forEach(img => {
            img.classList.remove(...imgCls);
        });
        
        document.querySelectorAll('.equa11y-embedded-text-label').forEach(label => {
            label.remove();
        });
        
        // Close processing dialog
        const dialog = document.querySelector('.equa11y-processing-dialog');
        if (dialog) {
            dialog.remove();
        }
        
        processedImages.clear();
    }

    async function processAllImages() {
        // Create abort controller for this processing session
        abortController = new AbortController();
        
        // Limit the number of images to process to prevent hanging
        const imagesToProcess = Array.from(images).slice(0, MAX_IMAGES_PER_BATCH);
        let totalImages = imagesToProcess.length;
        let processedCount = 0;
        
        updateProgress(processedCount, totalImages);
        
        try {
            for (const img of imagesToProcess) {
                // Check if processing was aborted
                if (abortController.signal.aborted) {
                    console.log('Image processing aborted');
                    break;
                }
                
                if (!processedImages.has(img.src) && img.src && !img.src.startsWith('data:')) {
                    try {
                        // Process with timeout
                        const base64 = await Promise.race([
                            convertImageToBase64(img),
                            createTimeout(IMAGE_LOAD_TIMEOUT, 'Image load timeout')
                        ]);
                        
                        if (base64 && !abortController.signal.aborted) {
                            const detectedText = await Promise.race([
                                detectEmbeddedText(base64, img),
                                createTimeout(AI_PROCESSING_TIMEOUT, 'AI processing timeout')
                            ]);
                            
                            if (detectedText && detectedText.trim() && !abortController.signal.aborted) {
                                highlightImageWithText(img, detectedText);
                            }
                        }
                    } catch (error) {
                        if (error.message.includes('timeout')) {
                            console.warn(`Timeout processing image: ${img.src}`);
                        } else {
                            console.warn(`Failed to process image: ${img.src}`, error);
                        }
                    }
                    processedImages.add(img.src);
                }
                
                processedCount++;
                updateProgress(processedCount, totalImages);
                
                // Add small delay to prevent blocking the UI
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        } catch (error) {
            console.error('Error in processAllImages:', error);
        } finally {
            isProcessing = false;
            abortController = null;
            
            // Close the processing dialog when complete
            hideProcessingDialog(true);
        }
    }
    
    function createTimeout(ms, message) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), ms);
        });
    }

    function convertImageToBase64(img) {
        return new Promise((resolve) => {
            try {
                // Skip images that are too large to prevent memory issues
                const maxSize = 2000;
                if (img.naturalWidth > maxSize || img.naturalHeight > maxSize) {
                    console.warn(`Skipping large image: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
                    resolve(null);
                    return;
                }
                
                // Set crossorigin to handle CORS
                const tempImg = new Image();
                tempImg.crossOrigin = 'anonymous';
                
                // Set up timeout for image loading
                const timeoutId = setTimeout(() => {
                    console.warn(`Image load timeout: ${img.src}`);
                    resolve(null);
                }, IMAGE_LOAD_TIMEOUT);
                
                tempImg.onload = function() {
                    clearTimeout(timeoutId);
                    
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Limit canvas size to prevent memory issues
                        const maxCanvasSize = 1000;
                        const width = Math.min(tempImg.naturalWidth || tempImg.width, maxCanvasSize);
                        const height = Math.min(tempImg.naturalHeight || tempImg.height, maxCanvasSize);
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        ctx.drawImage(tempImg, 0, 0, width, height);
                        
                        const dataURL = canvas.toDataURL('image/png');
                        resolve(dataURL);
                    } catch (error) {
                        console.warn('Canvas/CORS issue with image:', img.src, error);
                        resolve(null);
                    }
                };
                
                tempImg.onerror = function(error) {
                    clearTimeout(timeoutId);
                    console.warn('Image load error:', img.src, error);
                    resolve(null);
                };
                
                // Start loading the image
                tempImg.src = img.src;
                
            } catch (error) {
                console.warn('Error setting up image conversion:', error);
                resolve(null);
            }
        });
    }

    async function detectEmbeddedText(base64Image, imgElement) {
        try {
            // Try Chrome's built-in AI first (when available)
            if (typeof LanguageModel !== 'undefined') {
                return await detectWithChromeAI(base64Image, imgElement);
            }
            
            // This script should only run if AI is available.
            return null;
            
        } catch (error) {
            console.warn('Text detection failed:', error);
            return null;
        }
    }

    async function detectWithChromeAI(base64Image, imgElement) {
        try {
            // Check if the Prompt API is available
            const available = await LanguageModel.availability();
            if (available === 'unavailable') {
                console.log('Gemini Nano is not available on this device');
                return null;
            }

            // Wait for model to be ready if it's downloading
            if (available === 'downloadable' || available === 'downloading') {
                console.log('Gemini Nano model is downloading...');
                // You might want to show a different message to users about model download
            }

            // Create session with multimodal support (image input)
            const session = await LanguageModel.create({
                expectedInputs: [{ type: 'image' }],
            });

            // Convert base64 to blob for the API
            const response = await fetch(base64Image);
            const imageBlob = await response.blob();

            // Prompt the model to extract text from the image
            const result = await session.prompt([
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            value: 'Extract all text content from this image. Return only the actual text found in the image, or respond with "No text detected" if no readable text is present. Focus on text that appears to be embedded or overlaid on the image.'
                        },
                        { 
                            type: 'image', 
                            value: imageBlob 
                        }
                    ]
                }
            ]);

            // Clean up the session
            session.destroy();
            
            // Return the result if text was found
            if (result && result.trim() && result !== "No text detected") {
                return `AI detected text: ${result.trim()}`;
            }
            
            return null;
            
        } catch (error) {
            console.warn('Gemini Nano text detection failed:', error);
            // Check if it's a multimodal support issue
            if (error.message && error.message.includes('multimodal')) {
                console.log('This Chrome version may not support multimodal input. Falling back to heuristics.');
            }
            return null;
        }
    }

    function highlightImageWithText(img, text) {
        if (img.classList.contains('equa11y-embedded-text')) {
            return; // Already processed
        }
        
        // Add border to image
        img.classList.add(...imgCls);
        
        // Create label
        const label = document.createElement('div');
        label.textContent = `Embedded text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`;
        label.classList.add(...clsList, 'equa11y-embedded-text-label');
        label.style.cssText = 'position: relative; bottom: 0; left: 0; box-sizing: border-box; z-index: 10000; background-color: #FF6B35 !important; color: white !important;';
        
        // Position the label
        img.parentNode.style.cssText = (img.parentNode.style.cssText ? img.parentNode.style.cssText + '; ' : '') + 'overflow: visible !important; position: relative;';
        img.insertAdjacentElement('afterend', label);
    }

    function showProcessingDialog() {
        const dialog = document.createElement('dialog');
        dialog.className = 'equa11y-processing-dialog';
        dialog.style.cssText = `
            width: 300px;
            text-align: center;
            border-radius: 10px;
            border: 2px solid #007bff;
            background: white;
            padding: 20px;
            z-index: 10001;
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Embedded Text Detection';
        title.style.margin = '0 0 15px 0';
        
        const spinner = document.createElement('div');
        spinner.className = 'lds-ring';
        spinner.innerHTML = '<div></div><div></div><div></div><div></div>';
        
        const progressText = document.createElement('p');
        progressText.className = 'equa11y-progress-text';
        progressText.textContent = 'Initializing AI text detection...';
        progressText.setAttribute('aria-live', 'polite');
        
        const abortButton = document.createElement('button');
        abortButton.textContent = 'Stop Processing';
        abortButton.style.cssText = `
            margin-top: 10px;
            padding: 8px 16px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        abortButton.onclick = () => {
            if (abortController) {
                abortController.abort();
                progressText.textContent = 'Processing stopped by user';
                abortButton.disabled = true;
                
                // Close dialog after a short delay
                setTimeout(() => {
                    isProcessing = false;
                    hideProcessingDialog();
                }, 1500);
            }
        };
        
        dialog.appendChild(title);
        dialog.appendChild(spinner);
        dialog.appendChild(progressText);
        dialog.appendChild(abortButton);
        
        document.body.appendChild(dialog);
        dialog.showModal();
    }

    function updateProgress(processed, total) {
        const progressText = document.querySelector('.equa11y-progress-text');
        if (progressText) {
            if (total === 0) {
                progressText.textContent = 'No images found';
            } else {
                const percentage = Math.round((processed / total) * 100);
                if (percentage === 100) {
                    progressText.textContent = 'Analysis complete!';
                } else {
                    progressText.textContent = `AI analysis: ${processed}/${total} (${percentage}%)`;
                }
            }
        }
    }

    function hideProcessingDialog(immediate = false) {
        const initialDelay = immediate ? 0 : 500;
        const completionDelay = immediate ? 1000 : 2000;
        
        setTimeout(() => {
            const dialog = document.querySelector('.equa11y-processing-dialog');
            if (dialog) {
                const progressText = dialog.querySelector('.equa11y-progress-text');
                if (progressText && !progressText.textContent.includes('stopped')) {
                    progressText.textContent = 'Analysis complete!';
                }
                setTimeout(() => {
                    dialog.close();
                    dialog.remove();
                }, completionDelay);
            }
        }, initialDelay);
    }
}
