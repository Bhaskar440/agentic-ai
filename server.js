import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateArticle, generateBlog, getDummyContent } from './generator.js';
import schedule from 'node-schedule';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let contents = getDummyContent();

app.get('/api/content', (req, res) => {
  res.json(contents);
});

schedule.scheduleJob('*/10 * * * *', async () => {
  console.log('Generating fresh content...');
  const article = await generateArticle();
  const blog = await generateBlog();
  if (article) contents.unshift(article);
  if (blog) contents.unshift(blog);
  contents = contents.slice(0, 20); // Limit to latest 20 entries
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
