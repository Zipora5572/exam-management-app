import Tesseract from 'tesseract.js';

const analyzeImage = async (image: string): Promise<string> => {
    const result = await Tesseract.recognize(
        image,
        'eng',
        {
            logger: (info) => console.log(info) 
        }
    );
    return result.data.text; 
};

const text = await analyzeImage("C:\\Users\\user1\\Pictures\\Screenshots\\demo.png");
console.log(text);