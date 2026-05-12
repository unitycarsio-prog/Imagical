/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function generateImage() {
    if (!prompt) return;
    setIsLoading(true);
    setImage(null);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      // Find the image part in the response
      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
      );

      if (imagePart?.inlineData) {
        const base64 = imagePart.inlineData.data;
        setImage(`data:image/png;base64,${base64}`);
      } else {
        console.error('No image generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">AI Visionary</h1>
        <p className="mt-2 text-gray-600">Turn your ideas into images.</p>
      </header>

      <main className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city in the clouds..."
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
          <button
            onClick={generateImage}
            disabled={isLoading || !prompt}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {image && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <img src={image} alt="Generated" className="w-full h-auto rounded-md" />
          </div>
        )}
      </main>
    </div>
  );
}
