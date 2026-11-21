// Whether the live demos are behind (deploy.yml's hourly look, Jay 11-21: "make
// sure demo catch up the newest version"): each app's main and the kit's last
// change, against what the site's demos were recorded from (_demo/heads.json,
// refresh.mjs). Prints what moved on, and `go=true` when anything did (or the
// site's list can't be read), else `go=false`; with GITHUB_OUTPUT, writes it there.
//   node scripts/demo/stale.mjs
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEMOS } from './apps.mjs';

const LIVE = 'https://jaypengx.com/showcase/demo/_demo/heads.json';
const OWNER = 'JayPengX';

export async function stale({ live = null, mainOf = null, kitNow = null } = {}) {
  const was = live ?? (await fetch(LIVE, { signal: AbortSignal.timeout(20_000) }).then(r => (r.ok ? r.json() : null)).catch(() => null));
  if (!was) return { go: true, why: ['the live demos’ list couldn’t be read'] };
  const main = mainOf ?? (repo => execFileSync('git', ['ls-remote', `https://github.com/${OWNER}/${repo}.git`, 'refs/heads/main'], { encoding: 'utf8', timeout: 30_000 }).split('\t')[0].trim());
  const why = [];
  for (const [id, d] of Object.entries(DEMOS)) {
    let now = '';
    try {
      now = main(d.repo);
    } catch {}
    if (!now) why.push(`${id}: its main couldn’t be read`);
    else if (now !== was[id]) why.push(`${id}: ${String(was[id] || 'none').slice(0, 7)} → ${now.slice(0, 7)}`);
  }
  const kit = kitNow ?? (await kitHead());
  if (!kit) why.push('the kit: its last change couldn’t be read');
  else if (kit !== was.kit) why.push(`the kit: ${String(was.kit || 'none').slice(0, 7)} → ${kit.slice(0, 7)}`);
  return { go: why.length > 0, why };
}

// The kit's last change: Orbit-Core's newest commit that touched kit/ (other pushes there don't count).
async function kitHead() {
  const headers = { accept: 'application/vnd.github+json', ...(process.env.GH_TOKEN ? { authorization: `Bearer ${process.env.GH_TOKEN}` } : {}) };
  const r = await fetch(`https://api.github.com/repos/${OWNER}/Orbit-Core/commits?path=kit&sha=main&per_page=1`, { headers, signal: AbortSignal.timeout(20_000) }).catch(() => null);
  if (r?.ok) return (await r.json())[0]?.sha || '';
  // (The API turned it away, a shared address past its limit: the history itself, without its files.)
  const dir = mkdtempSync(join(tmpdir(), 'orbit-core-'));
  try {
    execFileSync('git', ['clone', '--quiet', '--bare', '--filter=blob:none', '--single-branch', '--branch', 'main', `https://github.com/${OWNER}/Orbit-Core.git`, dir], { timeout: 120_000 });
    return execFileSync('git', ['-C', dir, 'log', '-1', '--format=%H', 'main', '--', 'kit'], { encoding: 'utf8', timeout: 60_000 }).trim();
  } catch {
    return '';
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { go, why } = await stale();
  console.log(go ? `The demos are behind:\n  ${why.join('\n  ')}` : 'The demos are the newest of every app and the kit.');
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `go=${go}\n`);
}
