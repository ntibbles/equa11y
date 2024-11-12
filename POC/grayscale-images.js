export function grayscaleImages(isChecked) {
    const images = document.getElementsByTagName('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if(isChecked) {
            if(!document.body.classList.contains('aid-grayscale')) {
                //window.scroll(0, document.body.offsetHeight);
                image.setAttribute('crossorigin', 'anonymous');
                toDataURL(image);
            }
        } else {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        }
    }

    // remove all picture sources
    const pics = document.querySelectorAll('source'); 
    for(let i = 0; i < pics.length; i++) {
        pics[i].remove();
    }

    if(isChecked) {
        document.body.classList.add('aid-grayscale');
    } else {
        document.body.classList.remove('aid-grayscale');
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
                    makeGrayscale({ img, dataURL });
                })
                .catch(err => {
                    console.error("Can't fetch the resource");
                })
        } catch (err) {
            console.warn(`Image could not be converted to dataURI: ${img.src} with error: ${err}`);
        }
    }

    function makeGrayscale(imageData) {
        const image = new Image();
        const { img, dataURL } = imageData;
       
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // grayscale
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg; // red
                    data[i + 1] = avg; // green
                    data[i + 2] = avg; // blue   
                }

                // increase contrast
                for (let i = 0; i < data.length; i += 4) {
                    var contrast = 10;
                    contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
                    var factor = (255 + contrast) / (255.01 - contrast);  //add .1 to avoid /0 error
                
                    data[i] = factor * (data[i] - 128) + 128;     //r value
                    data[i+1] = factor * (data[i+1] - 128) + 128; //g value
                    data[i+2] = factor * (data[i+2] - 128) + 128; //b value
                }

                img.dataset.src = img.src;
                ctx.putImageData(imageData, 0, 0);
                if(img.srcset) img.removeAttribute('srcset');
                img.src = canvas.toDataURL();
            } catch (err) {
                console.warn(`Image greyscale error: ${err} on image ${img.src}`);
            }
        }
        image.src = dataURL;
    }
}