"use server";

import OpenAI from 'openai';

const prompt = `
Generate a small joke to be used as a caption for the image. This would be similar to a meme.
`;

async function sendImage() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });


    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    {
                        type: "image_url",
                        image_url:
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    },
                ],
            },
        ],
    });
    console.log(response.choices[0]);
};

export default sendImage;
