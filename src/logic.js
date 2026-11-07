export const categories = ['Accessibility','Park equipment','Litter & recycling','Lighting','Sidewalk & path','Other'];
export const statuses = ['Needs review','Assigned','In progress','Resolved'];
export const seedReports = [
  {id:'FF-104',title:'Uneven path near the community garden',category:'Sidewalk & path',area:'Garden entrance',description:'A raised section may be difficult for wheelchair users and people using strollers.',severity:'High',status:'Needs review',createdAt:'2026-10-29',votes:8},
  {id:'FF-103',title:'Playground swing needs inspection',category:'Park equipment',area:'North playground',description:'A swing seat looks worn and should be checked by the parks team before continued use.',severity:'High',status:'Assigned',createdAt:'2026-10-27',votes:5},
  {id:'FF-102',title:'Recycling bin is overflowing',category:'Litter & recycling',area:'Library courtyard',description:'The public recycling bin is full and loose paper is collecting nearby.',severity:'Medium',status:'In progress',createdAt:'2026-10-25',votes:11},
  {id:'FF-101',title:'Pathway light is not working',category:'Lighting',area:'East walking loop',description:'One light appears to be out. The path is dim after sunset.',severity:'Medium',status:'Needs review',createdAt:'2026-10-22',votes:4}
];
export function priorityScore(report){
  const severity = {High:3,Medium:2,Low:1}[report.severity] ?? 1;
  const categoryBoost = report.category === 'Accessibility' || report.category === 'Sidewalk & path' ? 2 : 0;
  return severity * 10 + categoryBoost + Math.min(Math.max(Number(report.votes)||0,0),20);
}
export function sortReports(reports){ return [...reports].sort((a,b)=>priorityScore(b)-priorityScore(a) || String(b.createdAt).localeCompare(String(a.createdAt))); }
export function validateReport(report={}){
  const errors=[];
  if(!String(report.title||'').trim()) errors.push('Add a short title.');
  if(!String(report.area||'').trim()) errors.push('Add a general public area, not a home address.');
  if(String(report.description||'').trim().length<15) errors.push('Add at least 15 characters describing the observation.');
  if(!categories.includes(report.category)) errors.push('Choose a category.');
  if(!['Low','Medium','High'].includes(report.severity)) errors.push('Choose a severity.');
  return errors;
}
export function makeId(reports){
  const nums=reports.map(r=>Number(String(r.id).replace(/\D/g,''))).filter(Number.isFinite);
  return `FF-${String(Math.max(100,...nums)+1)}`;
}
export function normalizeReports(value){
  if(!Array.isArray(value)) return [...seedReports];
  return value.filter(r=>r&&typeof r==='object'&&typeof r.id==='string'&&typeof r.title==='string')
    .map(r=>({id:r.id,title:r.title.slice(0,70),category:categories.includes(r.category)?r.category:'Other',area:String(r.area||'').slice(0,60),description:String(r.description||'').slice(0,400),severity:['Low','Medium','High'].includes(r.severity)?r.severity:'Medium',status:statuses.includes(r.status)?r.status:'Needs review',createdAt:/^\d{4}-\d{2}-\d{2}$/.test(r.createdAt||'')?r.createdAt:new Date().toISOString().slice(0,10),votes:Math.max(0,Math.min(999,Math.floor(Number(r.votes)||0))),history:normalizeHistory(r.history)}));
}
export function hasVoted(voteLedger,id){return Array.isArray(voteLedger)&&voteLedger.includes(id);}


function csvText(value) {
  let text = String(value ?? '');
  // Neutralize spreadsheet formula prefixes in exported text fields.
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(reports) {
  const columns = ['id','title','category','area','description','severity','status','createdAt','votes'];
  const rows = [columns.join(',')];
  for (const report of Array.isArray(reports) ? reports : []) {
    rows.push(columns.map((key) => key === 'votes' ? String(Math.max(0, Math.floor(Number(report?.[key]) || 0))) : csvText(report?.[key])).join(','));
  }
  return `\uFEFF${rows.join('\r\n')}`;
}


// ---- 1.2.0: explainable priority, duplicate detection, status history, action brief ----
export const PRIORITY_RULES = { severity: { High: 30, Medium: 20, Low: 10 }, accessibilityBoost: 2, maxSupport: 20 };

export function priorityBreakdown(report = {}) {
  const parts = [];
  const sev = PRIORITY_RULES.severity[report.severity] ?? PRIORITY_RULES.severity.Low;
  parts.push({ label: `${report.severity || 'Low'} severity`, points: sev });
  if (report.category === 'Accessibility' || report.category === 'Sidewalk & path') parts.push({ label: 'Affects accessibility or walking routes', points: PRIORITY_RULES.accessibilityBoost });
  const support = Math.min(Math.max(Number(report.votes) || 0, 0), PRIORITY_RULES.maxSupport);
  if (support > 0) parts.push({ label: `Community support (${support}${Number(report.votes) > PRIORITY_RULES.maxSupport ? ', capped' : ''})`, points: support });
  return { parts, total: parts.reduce((sum, p) => sum + p.points, 0) };
}

const STOP = new Set(['the','a','an','is','are','of','to','in','on','at','near','by','and','or','for','with','not','it','its','this','that','be','has','was','needs','need','very']);
export function tokens(text) {
  return new Set(String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/(ing|s)$/, '')));
}
function jaccard(a, b) { if (!a.size || !b.size) return 0; let inter = 0; for (const x of a) if (b.has(x)) inter++; return inter / (a.size + b.size - inter); }

/** Returns open reports that look similar to a draft (same category or overlapping words in title + area). */
export function findSimilarReports(reports, draft, threshold = 0.3) {
  const dt = tokens(`${draft?.title} ${draft?.area}`);
  if (!dt.size) return [];
  return (Array.isArray(reports) ? reports : [])
    .filter((r) => r.status !== 'Resolved')
    .map((r) => {
      let score = jaccard(dt, tokens(`${r.title} ${r.area}`));
      if (r.category === draft?.category) score += 0.1;
      if (tokens(r.area).size && jaccard(tokens(r.area), tokens(draft?.area)) >= 0.5) score += 0.15;
      return { report: r, score: Math.round(score * 100) / 100 };
    })
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function normalizeHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((h) => h && statuses.includes(h.status) && /^\d{4}-\d{2}-\d{2}$/.test(h.date || '')).slice(-20).map((h) => ({ status: h.status, date: h.date, note: String(h.note || '').slice(0, 140) }));
}

export function withStatus(report, status, date = new Date().toISOString().slice(0, 10), note = '') {
  if (!statuses.includes(status) || report.status === status) return report;
  const history = normalizeHistory(report.history);
  if (!history.length) history.push({ status: report.status, date: report.createdAt, note: 'Reported' });
  return { ...report, status, history: [...history, { status, date, note: String(note).slice(0, 140) }].slice(-20) };
}

export function boardSummary(reports) {
  const list = Array.isArray(reports) ? reports : [];
  const resolved = list.filter((r) => r.status === 'Resolved').length;
  const byCategory = Object.fromEntries(categories.map((c) => [c, list.filter((r) => r.category === c && r.status !== 'Resolved').length]));
  return { total: list.length, resolved, resolvedPercent: list.length ? Math.round((resolved / list.length) * 100) : 0, byCategory };
}

/** Plain-text action brief a student can hand to a facilities or parks team. */
export function actionBrief(reports, generatedOn = new Date().toISOString().slice(0, 10)) {
  const open = sortReports((Array.isArray(reports) ? reports : []).filter((r) => r.status !== 'Resolved'));
  const lines = [`FixForward action brief — ${generatedOn}`, `${open.length} open observation${open.length === 1 ? '' : 's'}, ordered by transparent priority score.`, ''];
  open.forEach((r, i) => {
    const b = priorityBreakdown(r);
    lines.push(`${i + 1}. [${r.id}] ${r.title}`);
    lines.push(`   Area: ${r.area} | Category: ${r.category} | Status: ${r.status} | Supporters: ${r.votes}`);
    lines.push(`   Priority ${b.total} = ${b.parts.map((p) => `${p.label} (+${p.points})`).join(' + ')}`);
    lines.push(`   ${r.description}`);
    lines.push('');
  });
  lines.push('Priority is a sorting aid, not an official safety assessment. Confirm each report on site. Not an emergency service.');
  return lines.join('\n');
}
