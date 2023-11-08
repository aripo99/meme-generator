"use server";

import OpenAI from 'openai';

const prompt = `
Generate a 10 word joke to be used as a caption for the image. This would be similar to a meme. Don't use emojis.
`;

export default async function sendImage(base64String: string) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const data = {
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64String}`
                        }
                    },
                ],
            },
        ],
        max_tokens: 1200,
    };

    const response = await openai.chat.completions.create(data as any);

    if (!response) {
        throw new Error(`API error: ${response}`);
    }

    // If the API call was successful, handle the response accordingly
    return extractMessageContent(response);
};

function extractMessageContent(response: any): string | null {
    if (response && response.choices && Array.isArray(response.choices)) {
        let firstChoice = response.choices[0];

        if (firstChoice && firstChoice.message && firstChoice.message.content) {
            return firstChoice.message.content.trim()
                .replace(/^"|"$/g, '')   // Removes leading and trailing quotes
                .replace(/\.$/, '');     // Removes a trailing period
        }
    }

    return null;
}

