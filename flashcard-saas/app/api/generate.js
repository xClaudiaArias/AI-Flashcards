import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
    you are a flashcard creator who takes in text and creates 10 flahscards from it. Both front and back and each should be one sentence long. You should return the the following format:

    {
        "flashcards": [
            {
                "front": "Front of the card",
                "back": "Back of the card"
            }
        ]
    }

`

// post fn 
export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data }
        ],
        model: 'gpt-3.5-turbo',
        response_format: { type: 'json_object'}
    })

    const flahscards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flahscards.flahscards)

}