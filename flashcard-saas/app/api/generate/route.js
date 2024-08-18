import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
    You are a flashcard creator who takes in text and creates 10 flashcards from it. Both front and back should be one sentence long. You should return the following format:

    {
        "flashcards": [
            {
                "front": "Front of the card",
                "back": "Back of the card"
            }
        ]
    }
`;

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    });
    const data = await req.text();

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data }
            ],
            model: 'gpt-3.5-turbo'
        });

        const flashcards = JSON.parse(completion.choices[0].message.content);

        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}
