const imageUpload = document.getElementById('imageUpload');
imageUpload.addEventListener('change', setImageOnCanvas, false);

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const virtualCanvas = document.createElement('canvas');
virtualCanvas.height = canvas.height;
virtualCanvas.width = canvas.width;
const virtualCanvasContext = virtualCanvas.getContext('2d');

const prevCanvas = document.createElement('canvas');
prevCanvas.height = canvas.height;
prevCanvas.width = canvas.width;
const prevCanvasContext = prevCanvas.getContext('2d');

let isBrightnessChange = false;
let isContrastChange = false;

const img = new Image();

function setImageOnCanvas(event){
    const fileReader = new FileReader();

    img.onload = ()=>{
        virtualCanvasContext.drawImage(img,0,0,canvas.height, canvas.width);
        prevCanvasContext.drawImage(img,0,0,canvas.height, canvas.width);
        canvasContext.drawImage(img,0,0,canvas.height, canvas.width);
    }

    fileReader.onload = (fileEvent)=>{
        img.src = fileEvent.target.result
    }
    fileReader.readAsDataURL(event.target.files[0]);
}

function manipulateCanvas(filterType){
    let filteredImageData = prevCanvasContext.getImageData(0,0,canvas.height,canvas.width);

    if(filterType === 'contrast'){
        const contrast = document.getElementById('contrast').value;
        if(isBrightnessChange){
            const currentCanvasState = canvasContext.getImageData(0,0,canvas.height,canvas.width);
            prevCanvasContext.putImageData(currentCanvasState,0,0);
            filteredImageData = currentCanvasState;
            isBrightnessChange = false;
        }
        document.getElementById('contrastValue').innerText = contrast;
        adjustContrast(filteredImageData,contrast/100);
        isContrastChange = true;
    }
    else if(filterType === 'brightness'){
        const brightness = document.getElementById('brightness').value;
        if(isContrastChange){
            const currentCanvasState = canvasContext.getImageData(0,0,canvas.height,canvas.width);
            prevCanvasContext.putImageData(currentCanvasState,0,0);
            filteredImageData = currentCanvasState;
            isContrastChange = false;
        }
        document.getElementById('brightnessValue').innerText = brightness;
        adjustBrightness(filteredImageData, brightness/100);
        isBrightnessChange = true
    }
    canvasContext.putImageData(filteredImageData,0,0);
    
}

function adjustContrast(imageData, contrast){
    const data = imageData.data;  
    contrast *= 255;
    const factor = (contrast + 255) / (255.01 - contrast);  

    for(let i=0; i < data.length; i+= 4)
    {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }
    return imageData;
}

function adjustBrightness(imageData, brightness){
    const data = imageData.data;  
    
    for (var i = 0; i < data.length; i+= 4) {
        data[i] += 255 * (brightness);
        data[i + 1] += 255 * (brightness);
        data[i + 2] += 255 * (brightness);
    }
    return imageData;
}

function resetImage(){
    const originalImageData = virtualCanvasContext.getImageData(0,0,canvas.height,canvas.width);
    canvasContext.putImageData(originalImageData,0,0);
    prevCanvasContext.putImageData(originalImageData,0,0);
}