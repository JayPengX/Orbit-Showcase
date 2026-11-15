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

test('ask: a card as the AI reads it: plain words first, how it is built after', () => {
  const c = cardOf('kit');
  assert.ok(c.title && c.text);
  const [plain, how] = c.text.split(' (How: ');
  assert.ok(!/orbit\.css|import map|\.mjs/.test(plain));
  assert.ok(/import map/.test(how), 'the 技術細節 too: 問 Orbit knows how it is built');
  assert.ok(wordsOf('AI 做了什麼').has('ai'));
});

test('ask: a plural meets its singular, the same form on both sides', () => {
  const one = w => [...wordsOf(w)][0];
  for (const [a, b] of [['buses', 'bus'], ['stories', 'story'], ['times', 'time'], ['phones', 'phone'], ['games', 'game'], ['classes', 'class'], ['matches', 'match'], ['statuses', 'status']]) assert.equal(one(a), one(b), `${a} / ${b}`);
  assert.equal(wordsOf('what was it').size, 0);
  assert.ok(wordsOf('單').has('單'));
  assert.equal(cardsFor('how do the buses work', { en: true })[0].id.startsWith('transit'), true);
});

test('ask: what the repos say (features, Jay\'s rules, the numbers) is found beside the tree (Jay 11-15: "deeper than myself")', async () => {
  const { knowOf, plainLine, bullets } = await import('../scripts/know.mjs');
  assert.equal(plainLine('Read marks: a story opened is dimmed — `public/lib/reading.mjs`: `export function markRead`'), 'Read marks: a story opened is dimmed');
  assert.deepEqual(bullets('# x\n## Rules\n- 11-15 one\n  more\n- 11-14 two\n## Next\n- no', 'Rules'), ['11-15 one more', '11-14 two']);
  const know = knowOf(new URL('../..', import.meta.url).pathname, { at: '2026-11-15', commits: 9000, claude: 8800, days: { '2026-11-14': 400 }, first: '2026-08-26', lines: 1, added: 1, removed: 1, reverts: 1, tests: 1, rules: 1, repos: [] });
  const facts = know.cards.find(c => c.id === 'facts');
  assert.match(facts.text, /9000 commits/);
  const more = [...know.cards, { id: 'r:x', kind: 'rule', app: 'Weather', title: 'Weather rule, 2026-11-01', text: '11-01 颱風假的機率 shown per county' }];
  assert.ok(cardsFor('颱風假的機率', { more, most: 12 }).some(c => c.id === 'r:x'));
});
