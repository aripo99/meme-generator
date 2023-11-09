import OpenAI from 'openai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // organization: process.env.OPENAI_ORGANIZATION,
});

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'), // Limit to 5 requests per 60 seconds
});

const prompt = `
Generate a 10 word joke to be used as a caption for the image. This would be similar to a meme. Don't use emojis.
`;
export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for');

    console.log(ip);
    const { success, limit, reset, remaining } = await ratelimit.limit(ip as string);

    if (!success) {
        return new Response('You have reached your request limit for the day.', {
            status: 429,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
            },
        });
    }

    const base64 = await req.json();

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
                            url: `data:image/jpeg;base64,${base64.base64}`
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

    const messageContent = extractMessageContent(response);

    return new Response(JSON.stringify(messageContent), {
        status: 200,
    });
}

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