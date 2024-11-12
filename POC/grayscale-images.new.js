export function grayscaleImages(isChecked) {
    const images = document.getElementsByTagName('img');
    const canvas = document.createElement('canvas');

    // pre-process all images

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if(isChecked) {
            preprocessImage(image)
                .then(img => { makeGrayscale(img) } )
                //.catch(err => console.warn(`Error with image: ${image.src}, ${err}`))
        } 
        // else {
        //     image.src = image.dataset.src;
        //     image.removeAttribute('data-src');
        // }
    }

    // function getImageData(image) {
    //     return new Promise((resolve, reject) => {
    //       const img = new Image();
    //       img.onload = function() {
    //         let width = this.width;
    //         let height = this.height;
      
    //         if (width === 0 || height === 0) {
    //           // Try alternative method for SVGs or other problematic images
    //           const svg = document.createElement('img');
    //           svg.src = image.src;
    //           document.body.appendChild(svg); // Temporarily add to DOM for measurement
    //           width = svg.width || svg.clientWidth || 0; // Try different properties
    //           height = svg.height || svg.clientHeight || 0;
    //           document.body.removeChild(svg); // Remove from DOM
    //         }
      
    //         if (width !== 0 && height !== 0) {
    //           resolve({ width, height, orgImg: image });
    //         } else {
    //           reject("Image dimensions could not be determined.");
    //         }
    //       };
    //       img.onerror = function() {
    //         reject("Failed to load image.");
    //       };
    //       img.src = image.src;
    //     });
    //   }

    function preprocessImage(image) {
        return new Promise((resolve, reject) => {
            const excludeExt = ['svg'];
            let imgData = { image };
            // check the ext of the image
            let ext = image.src.split('.').pop();
            // don't process certain types (e.g - svg)
            if(!excludeExt.includes(ext)) {
                // get the images width and height
                imgData.width = image.naturalWidth;
                imgData.height = image.naturalHeight;
                
                // return image width, height, and image
                resolve(imgData);
            }
        }).then(result => {
            console.log('retry: ', result);
            return new Promise((resolve, reject) => {
                let { width, height, image } = result;
                if(width === 0 || height === 0) {
                    const img = new Image();
                    img.setAttribute('anonymous', '');
                    img.onload = function() {
                        //console.log('retry: ', img.width , ' height: ', img.height);
                        image.width = img.width;
                        image.width = img.height;
                    }
                    img.src = image.src;
    
                    // if still 0, ignore it
                    if(img.width === 0 || img.height === 0) {
                        reject("Image dimensions could not be determined.");
                    } else {
                        // return image width, height, and image
                        resolve(image);
                    }
                } else {
                    resolve(result);
                }
            })
        });
    }

   
    function makeGrayscale(img) {
        console.log('img: ', img);
        return;
        //let imgSrc = image.currentSrc || image.src;
              
        // // Handle srcset attribute (same logic as before)
        // if (image.srcset) {
        //     const srcset = image.srcset;
        //     const currentWidth = image.offsetWidth;
        //     const candidates = srcset.split(',').map(item => item.trim().split(' '));
            
        //     // Find the best match for the current image width
        //     let bestCandidate = candidates[0][0]; // Default to the first candidate
        //     let bestWidth = parseInt(candidates[0][1], 10) || Infinity; // Default to the first candidate's width or infinity if no width is specified
        
        //     for (const candidate of candidates) {
        //         const candidateSrc = candidate[0];
        //         const candidateWidth = parseInt(candidate[1], 10) || Infinity; // Parse width or set to infinity if not specified
        
        //         if (candidateWidth <= currentWidth && candidateWidth > bestWidth) {
        //             bestCandidate = candidateSrc;
        //             bestWidth = candidateWidth;
        //         }
        //     }
            
        //     imgSrc = bestCandidate;
        // }
        
        if(img) {
            const ctx = canvas.getContext('2d');
            ctx.willReadFrequently = true;
            console.log('img: ', img.imgOrg);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img.orgImg, 0, 0);

           // try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg; // red
                    data[i + 1] = avg; // green
                    data[i + 2] = avg; // blue   
                }

                img.dataset.src = img.orgImg.src;
                ctx.putImageData(imageData, 0, 0);
                if(img.orgImg.srcset)  img.removeAttribute('srcset');
                console.log('canvas: ', canvas);
                img.orgImg.src = canvas.toDataURL();
            // } catch (err) {
            //     console.warn(`Image error: ${err} on image ${img.orgImg.src}`);
            // }
        }
        
        // const img = new Image();
        // console.log('src: ', imgSrc);

        // img.onload = function() {
        //     canvas.width = img.width;
        //     canvas.height = img.height;
        //     ctx.drawImage(img, 0, 0);

        //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //     const data = imageData.data;

        //     for (let i = 0; i < data.length; i += 4) {
        //         const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        //         data[i] = avg;      // Red
        //         data[i + 1] = avg;  // Green
        //         data[i + 2] = avg;  // Blue
        //     }

        //     ctx.putImageData(imageData, 0, 0);
        //     image.src = canvas.toDataURL();
        // };

        // image.dataset.src = imgSrc;
        // image.setAttribute('anonymous', '');
       
        // //if(image.src.toString().includes(window.origin)) {
        //     img.src = imgSrc + '?' + new Date().getTime();
        // //}
    }
}