export function grayscaleImages(isChecked) {
    const images = document.getElementsByTagName('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if(isChecked) {
            if(!document.body.classList.contains('aid-grayscale')) makeGrayscale(image);
        } else {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        }
    }

    if(isChecked) {
        document.body.classList.add('aid-grayscale');
    } else {
        document.body.classList.remove('aid-grayscale');
    }
    

    function makeGrayscale(img) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue   
            }

            img.dataset.src = img.src;
            ctx.putImageData(imageData, 0, 0);
            if(img.srcset)  img.removeAttribute('srcset');
            img.src = canvas.toDataURL();
        } catch (err) {
            console.warn(`Image error: ${err} on image ${img.src}`);
        }
    }
}