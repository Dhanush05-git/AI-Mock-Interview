 
  import { GoogleGenAI } from '@google/genai';

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY, // Expose carefully in client if needed
  });
  
  export const chatSession = {
    sendMessage: async (prompt) => {
      const config = {
        responseMimeType: 'text/plain',
      };
      const model = 'gemini-1.5-flash';
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];
  
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });
  
      let fullResponse = '';
      for await (const chunk of response) {
        fullResponse += chunk.text;
      }
  
      return {
        response: {
          text: () => fullResponse,
        },
      };
    },
  };
  