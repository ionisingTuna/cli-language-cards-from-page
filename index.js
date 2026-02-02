#!/usr/bin/env node
import readline from 'readline';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const levels = { a1: 500, a2: 1000, b1: 2000, b2: 3000, c1: 5000, c2: 10000 };
const commonWords = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(r => rl.question(q, r));

const level = await ask('Level (a1/a2/b1/b2/c1/c2): ');
const url = await ask('URL: ');
rl.close();

const res = await fetch(url);
const html = await res.text();
const $ = cheerio.load(html);
const text = $('body').text();
const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
const freq = {};
words.forEach(w => freq[w] = (freq[w] || 0) + 1);

const threshold = levels[level.toLowerCase()] || 1000;
const advanced = Object.entries(freq)
  .filter(([w]) => !commonWords.has(w))
  .sort((a, b) => b[1] - a[1])
  .slice(threshold / 100);

console.log('\nAdvanced words:');
advanced.slice(0, 50).forEach(([w, c]) => console.log(`${w} (${c})`));
