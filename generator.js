import axios from 'axios';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const subtopics = [
  'Latest advancements in IVF technology',
  'Lifestyle factors impacting fertility and IVF success',
  'Nutritional strategies to boost fertility for IVF',
  'Emotional and psychological aspects of IVF',
  'Cost and accessibility of IVF treatments globally',
  'Natural fertility enhancement techniques alongside IVF'
];

const dummyData = [
  { type: 'article', content: 'Dummy Article Content 1', timestamp: '2025-05-20' },
  { type: 'article', content: 'Dummy Article Content 2', timestamp: '2025-05-20' },
  { type: 'blog', content: 'Dummy Blog Content 1', timestamp: '2025-05-20' },
  { type: 'blog', content: 'Dummy Blog Content 2', timestamp: '2025-05-20' }
];

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});

async function generateContent(prompt) {
  try {
    const response = await openai.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    });
    return response.data.choices[0]?.message?.content || null;
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    return null;
  }
}

async function saveContent(content, type, index, timestamp) {
  const fileName = `${type}-fertility-ivf-${index}-${timestamp}.md`;
  const filePath = join(__dirname, '..', 'content', fileName);
  await fs.writeFile(filePath, content);
  return fileName;
}

export async function generateArticle() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const i = Math.floor(Math.random() * subtopics.length);
  const prompt = `Write a unique, 200-word article on ${subtopics[i]} related to fertility and IVF. Add timestamp ${timestamp}.`;
  const content = await generateContent(prompt);
  if (!content) return null;
  const file = await saveContent(content, 'article', i + 1, timestamp);
  return { content, file, type: 'article', timestamp };
}

export async function generateBlog() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const i = Math.floor(Math.random() * subtopics.length);
  const prompt = `Write a unique, 200-word blog post on ${subtopics[i]} related to fertility and IVF. Add timestamp ${timestamp}.`;
  const content = await generateContent(prompt);
  if (!content) return null;
  const file = await saveContent(content, 'blog', i + 1, timestamp);
  return { content, file, type: 'blog', timestamp };
}

export function getDummyContent() {
  return dummyData;
}