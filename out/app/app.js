// GTA VI trophy guide + tracker: loads app/data/trophies.json, renders the 55 trophies,
// saves earned ticks in localStorage, exports/imports progress, filters by kind/grade,
// hides story spoilers until earned, and shows a roadmap to the Platinum.
// Query params: ?view=roadmap, ?trophy=<id>, ?demo=1 (demo ticks a few trophies for screenshots).
const KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';
const params = new URLSearchParams(location.search);
const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const showEl = document.getElementById('show');
const spoilerEl = document.getElementById('spoilers');
const noteEl = document.getElementById('filterNote');

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
if (params.get('demo') === '1') earned = new Set(['Vice Got a Price!', 'Just Like Paradise', 'Paradise Lost', 'Cunning Stunts', 'Master of None', 'In The Beginning…', 'Positive Mental Attitude']);
spoilerEl.checked = localStorage.getItem(SPOILER_KEY) === '1' || params.get('spoilers') === '1';
if (params.get('kind')) kindEl.value = params.get('kind');
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('show')) showEl.value = params.get('show');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

const ROADMAP = [
  { stage: 1, title: 'Stage 1 — Play the story', text: 'Finish Gone Fishing, Chapters 1–4 and the final mission (trophies 2–13). Named story missions: Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory. Save manually at the start of every chapter — no mission replay.' },
  { stage: 2, title: 'Stage 2 — Side strands', text: 'Finish the final mission for Andy, Kenton, Billy, Randy and Tyrone, plus 8 stranger strands across Leonida. These unlock as the story progresses — check back between chapters.' },
  { stage: 3, title: 'Stage 3 — Activities', text: 'Try all 9 activity types, gold all 42 Shooting Range challenges, win drone races at all 14 locations and 20 different races, beat Cal at fishing, finish an arcade game, bowl at Kolt & Associates, meditate, hunt for Bret, and complete 50 challenges.' },
  { stage: 4, title: 'Stage 4 — Collectibles & exploration', text: 'Meditate at all 18 spots (do Chapter 1 spots first — one is reported missable), complete 3 card sets, WAiNK It at 100 locations, discover 100 vehicles, explore all 52 areas, register 10 vehicles in Scooter Bros, and buy all 8 garages.' },
  { stage: 5, title: 'Stage 5 — Robberies & money', text: 'Rob 5 bank vaults, an armored truck, a jewelry store undetected, 3 shops back-to-back with your partner, one illegal operation per gang (9 gangs), lose a 4-star wanted level with your partner, and launder $250,000 of Marked Bills.' },
  { stage: 6, title: 'Stage 6 — Cleanup & Platinum', text: 'Spend $100,000 in shops, finish the 500 tracked choices and the odd one-offs, then reach 100% completion (A Long Road, Gold) — the Platinum pops with the last trophy.' },
];

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function isStory(t) { return t.kind === 'story'; }

function displayName(t) {
  if (spoilerEl.checked && isStory(t) && !earned.has(t.name)) return 'Hidden story trophy — earn it to reveal';
  return t.name;
}

function displayDesc(t) {
  if (spoilerEl.checked && isStory(t) && !earned.has(t.name)) return 'Spoiler hidden until earned.';
  return t.description;
}

function gradeCount(g) {
  return trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.name)).length;
  document.getElementById('barFill').style.width = `${(done / total) * 100}%`;
  document.getElementById('progressText').textContent = `${done} / ${total} earned (${Math.round((done / total) * 100)}%)`;
  document.getElementById('gradeCounts').textContent =
    `Platinum ${gradeCount('platinum')}/1 · Gold ${gradeCount('gold')}/2 · Silver ${gradeCount('silver')}/6 · Bronze ${gradeCount('bronze')}/46`;
}

function renderRoadmap() {
  const list = document.getElementById('roadmapList');
  list.replaceChildren();
  for (const step of ROADMAP) {
    const done = trophies.filter((t) => t.roadmap_stage === step.stage && earned.has(t.name)).length;
    const total = trophies.filter((t) => t.roadmap_stage === step.stage).length;
    const li = document.createElement('li');
    const h = document.createElement('strong');
    h.textContent = `${step.title} — ${done}/${total}`;
    const p = document.createElement('p');
    p.textContent = step.text;
    li.append(h, p);
    list.append(li);
  }
}

function openDetail(t, scroll = true) {
  detailEl.hidden = false;
  detailEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${t.grade} · ${t.kind}${t.missable ? ' · MISSABLE' : ''}${t.count ? ` · count: ${t.count}` : ''} · roadmap stage ${t.roadmap_stage}`;
  const desc = document.createElement('p');
  desc.textContent = displayDesc(t);
  const guide = document.createElement('p');
  guide.textContent = t.guide;
  const srcTitle = document.createElement('p');
  srcTitle.innerHTML = '<strong>Sources:</strong>';
  const ul = document.createElement('ul');
  for (const s of t.sources ?? []) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = `${s.name} — ${s.url}`;
    a.rel = 'noopener';
    li.append(a);
    ul.append(li);
  }
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close guide';
  close.addEventListener('click', () => { detailEl.hidden = true; });
  detailEl.append(h, meta, desc, guide, srcTitle, ul, close);
  if (scroll) detailEl.scrollIntoView({ block: 'nearest' });
}

function render() {
  renderProgress();
  renderRoadmap();
  const q = searchEl.value.trim().toLowerCase();
  const kind = kindEl.value;
  const grade = gradeEl.value;
  const show = showEl.value;
  rowsEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (kind === 'missable' && !t.missable) continue;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) continue;
    if (grade !== 'all' && t.grade !== grade) continue;
    if (show === 'earned' && !earned.has(t.name)) continue;
    if (show === 'todo' && earned.has(t.name)) continue;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) continue;
    shown += 1;
    const li = document.createElement('li');
    li.className = `card ${earned.has(t.name) ? 'earned' : ''}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      save();
      render();
    });
    const body = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = displayName(t);
    const desc = document.createElement('p');
    desc.textContent = displayDesc(t);
    const tags = document.createElement('p');
    tags.className = 'tags';
    tags.textContent = `${t.grade} · ${t.kind}${t.missable ? ' · ⚠ MISSABLE' : ''}${t.count ? ` · ${t.count}` : ''}`;
    body.append(name, desc, tags);
    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';
    guideBtn.textContent = 'Guide & sources';
    guideBtn.addEventListener('click', () => openDetail(t));
    li.append(box, body, guideBtn);
    rowsEl.append(li);
  }
  noteEl.textContent = kind === 'online'
    ? 'No online trophies: the whole list is single-player (Exophase / PSNProfiles).'
    : `Showing ${shown} of ${trophies.length} trophies.`;
}

document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    earned = new Set(names.filter((n) => trophies.some((t) => t.name === n)));
    save();
    render();
  } catch {
    noteEl.textContent = 'Import failed: that file is not a trophy-progress JSON file.';
  }
});
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks?')) return;
  earned = new Set();
  save();
  render();
});
spoilerEl.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, spoilerEl.checked ? '1' : '0');
  render();
});
for (const el of [searchEl, kindEl, gradeEl, showEl]) el.addEventListener('input', render);

for (const btn of document.querySelectorAll('.views button')) {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    document.getElementById('roadmapView').hidden = view !== 'roadmap';
    document.getElementById('checklistView').hidden = view !== 'checklist';
    for (const b of document.querySelectorAll('.views button')) b.classList.toggle('active', b === btn);
  });
}

if (params.get('view') === 'roadmap') document.getElementById('btnRoadmap').click();
const openId = Number(params.get('trophy'));
if (openId) {
  const t = trophies.find((x) => x.id === openId);
  if (t) openDetail(t, false);
}
render();
