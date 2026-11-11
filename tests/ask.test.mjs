// 問 Orbit (public/lib/ask.mjs): the cards for a question, picked by code from the structure tree.
import test from 'node:test';
import assert from 'node:assert/strict';
import { cardsFor, cardOf, wordsOf } from '../public/lib/ask.mjs';

test('ask: a question finds the cards that share its words, best first', () => {
  assert.equal(cardsFor('怎麼做到不花錢')[0].id, 'cheap');
  assert.equal(cardsFor('Jay 會寫程式嗎')[0].id, 'team');
  assert.ok(cardsFor('how does it stay free', { en: true }).length > 0);
  assert.deepEqual(cardsFor('？？'), []);
});

test('ask: a card as the AI reads it holds no technical names', () => {
  const c = cardOf('kit');
  assert.ok(c.title && c.text);
  assert.ok(!/orbit\.css|import map|\.mjs/.test(c.text));
  assert.ok(wordsOf('AI 做了什麼').has('ai'));
});
