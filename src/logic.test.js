import test from 'node:test';
import assert from 'node:assert/strict';
import { makeId, priorityScore, sortReports, toCsv, validateReport, seedReports } from './logic.js';

test('accessibility and high severity affect priority',()=>{
 const basic={severity:'Low',category:'Other',votes:0};
 const urgent={severity:'High',category:'Accessibility',votes:0};
 assert.ok(priorityScore(urgent)>priorityScore(basic));
});
test('sortReports returns a sorted copy',()=>{
 const sorted=sortReports(seedReports);
 assert.notEqual(sorted,seedReports);
 assert.ok(priorityScore(sorted[0])>=priorityScore(sorted[1]));
});
test('report validation catches missing information',()=>{
 assert.equal(validateReport({}).length,5);
});
test('valid report passes validation',()=>{
 assert.deepEqual(validateReport({title:'Loose paving stone',area:'Library path',description:'A paving stone is loose near the public entrance.',category:'Sidewalk & path',severity:'Medium'}),[]);
});
test('new IDs increment safely',()=>assert.equal(makeId(seedReports),'FF-105'));

test('vote ledger prevents repeat support in the same browser',async()=>{
 const {hasVoted}=await import('./logic.js');
 assert.equal(hasVoted(['FF-104'],'FF-104'),true);
 assert.equal(hasVoted(['FF-104'],'FF-103'),false);
 assert.equal(hasVoted(null,'FF-104'),false);
});
test('stored reports are normalized and bounded',async()=>{
 const {normalizeReports}=await import('./logic.js');
 const [r]=normalizeReports([{id:'FF-900',title:'T'.repeat(100),category:'bad',area:'A',description:'D',severity:'Extreme',status:'Unknown',createdAt:'bad',votes:9999}]);
 assert.equal(r.title.length,70); assert.equal(r.category,'Other'); assert.equal(r.severity,'Medium');
 assert.equal(r.status,'Needs review'); assert.equal(r.votes,999);
});
test('invalid stored report payload falls back to seed data',async()=>{
 const {normalizeReports,seedReports}=await import('./logic.js');
 assert.equal(normalizeReports({}).length,seedReports.length);
});


test('CSV export quotes fields and neutralizes spreadsheet formulas',()=>{
 const csv=toCsv([{id:'FF-1',title:'=HYPERLINK("https://example.com")',category:'Other',area:'Library, east side',description:'Line one\nLine two',severity:'Low',status:'Needs review',createdAt:'2026-11-04',votes:3}]);
 assert.ok(csv.startsWith('\uFEFFid,title,category'));
 assert.match(csv, /"'=HYPERLINK\(""https:\/\/example.com""\)"/);
 assert.match(csv, /"Library, east side"/);
 assert.match(csv, /"Line one\nLine two"/);
 assert.match(csv, /,3$/m);
});

// ---- 1.2.0 tests ----
import { priorityBreakdown, findSimilarReports, withStatus, normalizeReports as norm, boardSummary, actionBrief } from './logic.js';

test('priority breakdown explains and matches the score', () => {
  for (const r of seedReports) {
    const b = priorityBreakdown(r);
    assert.equal(b.total, priorityScore(r));
    assert.ok(b.parts.length >= 1);
  }
  const capped = priorityBreakdown({ severity: 'Low', category: 'Other', votes: 50 });
  assert.equal(capped.total, 30);
  assert.match(capped.parts.at(-1).label, /capped/);
});
test('similar open reports are detected for likely duplicates', () => {
  const hits = findSimilarReports(seedReports, { title: 'Broken light on walking path', area: 'East walking loop', category: 'Lighting' });
  assert.equal(hits[0].report.id, 'FF-101');
  assert.deepEqual(findSimilarReports(seedReports, { title: 'Graffiti on bench', area: 'Town square', category: 'Other' }), []);
  assert.deepEqual(findSimilarReports(seedReports, { title: '', area: '' }), []);
});
test('resolved reports are not offered as duplicates', () => {
  const resolved = seedReports.map((r) => (r.id === 'FF-101' ? { ...r, status: 'Resolved' } : r));
  assert.equal(findSimilarReports(resolved, { title: 'Pathway light not working', area: 'East walking loop', category: 'Lighting' }).length, 0);
});
test('status changes are recorded in history and survive normalization', () => {
  const r = withStatus(seedReports[3], 'Assigned', '2026-11-05');
  assert.equal(r.status, 'Assigned');
  assert.deepEqual(r.history.map((h) => h.status), ['Needs review', 'Assigned']);
  assert.equal(withStatus(r, 'Assigned'), r);
  assert.equal(withStatus(r, 'Bogus'), r);
  const [restored] = norm([r]);
  assert.equal(restored.history.length, 2);
  const [bad] = norm([{ ...r, history: [{ status: 'x', date: 'y' }, 'junk'] }]);
  assert.deepEqual(bad.history, []);
});
test('board summary and action brief', () => {
  const list = seedReports.map((r, i) => (i === 0 ? { ...r, status: 'Resolved' } : r));
  const s = boardSummary(list);
  assert.equal(s.resolved, 1); assert.equal(s.resolvedPercent, 25);
  const brief = actionBrief(list, '2026-11-07');
  assert.match(brief, /3 open observations/);
  assert.ok(!brief.includes('FF-104'));
  assert.ok(brief.indexOf('FF-102') < brief.indexOf('FF-101'));
  assert.match(brief, /not an official safety assessment/);
});
