import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
console.log('Testing Groq Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NONE');

const groq = new Groq({ apiKey });

async function test() {
  const modelsToTest = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b'
  ];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello! Respond with OK.' }
        ]
      });
      console.log(`SUCCESS with ${model}:`, res.choices[0]?.message?.content);
      return;
    } catch (err) {
      console.error(`FAILED with ${model}:`, err.status || err.message, err.error || err);
    }
  }
}

test();
