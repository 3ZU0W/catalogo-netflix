import { Controller, Post, Body } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Post()
  async chat(@Body() body: { messages: any[]; systemPrompt: string }) {
    const apiKey = process.env.GROQ_API_KEY;
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: body.systemPrompt },
          ...body.messages,
        ],
        max_tokens: 1000,
      }),
    });
    const data = await res.json();
    console.log('Groq response:', JSON.stringify(data));
    return { text: data.choices?.[0]?.message?.content ?? 'Error' };
  }
}
