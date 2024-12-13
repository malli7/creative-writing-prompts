import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { genre, topic, complexity, addTwist } = body;

    const prompt = `Generate a creative writing prompt for a ${genre} story about ${topic}. 
    Complexity: ${complexity}. Twist: ${addTwist ? "Include an unexpected twist." : "No twist."}. The response should not be incomplete within the mentioned tokens`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful creative writing assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
    });

    const generatedPrompt = response.choices[0]?.message?.content?.trim();

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error: any) {
    console.error("Error generating prompt:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
