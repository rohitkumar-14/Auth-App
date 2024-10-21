

import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  generatedText?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const textPrompt = req.body.prompt;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.API_KEY}`;
  
  const requestBody = {
    contents: [
      {
        parts: [{ text: textPrompt }],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2)); 
    const generatedText = data.candidates[0]?.content.parts.map((part: { text: string }) => part.text).join('\n') || '';

    res.status(200).json({ generatedText });
  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}
