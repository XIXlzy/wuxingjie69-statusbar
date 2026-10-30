import assert from 'node:assert/strict';
import { PATHS, relationship, toView } from '../statusbar/model.ts';

const valid = {
  世界: { 日期: '2007/05/06', 时段: '清晨', 当前地点: '吴兴街69号', 天气: '梅雨', 阶段: '落脚' },
  心蕾: { 好感度: 45, 信任度: 30, 心情: '绷着，客气，正在心里给这个家立规矩' },
  秦朗: { 存款: 3800, 摊子: '歇业', 插画: '画自己的', 球鞋: '被看上' },
  阿嬷: { 认可度: 35 }, 街坊: { 认可度: 40 }, 秦海: { 相认: '未相认' },
  近期事务: ['早饭谁做，房租怎么算'],
};
const expected = ['date', 'period', 'location', 'weather', 'stage', 'affection', 'trust', 'mood', 'savings', 'stall', 'illustration', 'shoes', 'grandma', 'neighbours', 'father', 'affairs'];
let checks = 0;
for (const [score, phase] of [[0, '客居期'], [59.999, '客居期'], [60, '磨合期'], [74.999, '磨合期'], [75, '过日子期'], [87.999, '过日子期'], [88, '谈承诺期'], [100, '谈承诺期']]) {
  assert.equal(relationship(score), phase); checks++;
}
for (const score of [null, undefined, '80', NaN, Infinity, -1, 101, {}, []]) {
  assert.equal(relationship(score), '—'); checks++;
}
assert.equal(toView(valid).savings, '3,800'); checks++;
const original = JSON.stringify(valid);
const emptyView = toView(undefined);
PATHS.forEach((path, index) => {
  for (const invalid of [undefined, null, { unexpected: true }]) {
    const data = structuredClone(valid);
    const parts = path.split('.');
    const owner = parts.length === 1 ? data : data[parts[0]];
    if (invalid === undefined) delete owner[parts.at(-1)]; else owner[parts.at(-1)] = invalid;
    const result = toView(data);
    assert.deepEqual(result[expected[index]], emptyView[expected[index]], `${path} must degrade independently`);
    assert.equal(result[index === 8 ? 'date' : 'savings'], index === 8 ? valid.世界.日期 : '3,800');
    checks++;
  }
});
for (const root of [undefined, null, [], 'bad', 42, false, {}]) { assert.doesNotThrow(() => toView(root)); checks++; }
for (const value of ['2007/02/29', '2007/05/32', '2007/13/01', '2007-05-06', 20070506]) { assert.equal(toView({ 世界: { 日期: value } }).date, '—'); checks++; }
assert.equal(toView({ 世界: { 日期: '2008/02/29' } }).date, '2008/02/29'); checks++;
for (const value of ['3800', 3.8, -1, NaN, Infinity]) { assert.equal(toView({ 秦朗: { 存款: value } }).savings, '—'); checks++; }
assert.equal(toView({ 秦朗: { 存款: 0 } }).savings, '0'); checks++;
assert.deepEqual(toView({ 近期事务: [] }).affairs, []); checks++;
assert.equal(toView({ 近期事务: ['ok', null] }).affairs, null); checks++;
const markup = '<img src=x onerror=alert(1)>';
assert.equal(toView({ 心蕾: { 心情: markup } }).mood, markup); checks++;
assert.equal(JSON.stringify(valid), original); checks++;
console.log(`PASS: ${checks} assertions — 16 paths, phase boundaries, malformed values, empty affairs, no mutation.`);
