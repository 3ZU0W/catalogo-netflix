import { Controller, Post, Body } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Post()
  async chat(@Body() body: { messages: any[]; systemPrompt: string }) {
    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: body.systemPrompt }] },
          contents: body.messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        }),
      }
    );
    const data = await res.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Error' };
  }
}