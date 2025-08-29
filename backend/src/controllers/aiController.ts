

// FIX: Use aliased `Response` from 'express' to avoid conflict with global Response type
// and resolve errors with properties like `json` and `status`.
import type { Response as ExpressResponse } from 'express';
import { GoogleGenAI } from "@google/genai";
import { AuthRequest } from '../middleware/auth';

// FIX: Use API_KEY as per Google GenAI SDK guidelines.
if (!process.env.API_KEY) {
  throw new Error('API_KEY is not set');
}

// FIX: Use API_KEY as per Google GenAI SDK guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithAI = async (req: AuthRequest, res: ExpressResponse) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const model = 'gemini-2.5-flash';
    // FIX: Correctly initialize chat with history for conversation context.
    const chat = ai.chats.create({ 
      model,
      history: history || [] 
    });
    
    const result = await chat.sendMessage({ message });

    res.json({ reply: result.text });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ message: 'Failed to get response from AI' });
  }
};

export const generateImage = async (req: AuthRequest, res: ExpressResponse) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'A text prompt is required' });
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        // FIX: Safely access the image data using optional chaining to prevent a runtime error
        // if the API response does not include an image, resolving the TS2532 error.
        const base64Image = response.generatedImages?.[0]?.image?.imageBytes;

        if (base64Image) {
            res.json({ image: base64Image });
        } else {
            res.status(500).json({ message: 'Image generation failed' });
        }
    } catch (error) {
        console.error('Error with Gemini Image API:', error);
        res.status(500).json({ message: 'Failed to generate image' });
    }
};