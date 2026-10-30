/** Display-only contract. Never coerce, default, repair or write MVU data. */
export const EMPTY = '—';
export const PATHS = [
  '世界.日期', '世界.时段', '世界.当前地点', '世界.天气', '世界.阶段',
  '心蕾.好感度', '心蕾.信任度', '心蕾.心情', '秦朗.存款', '秦朗.摊子',
  '秦朗.插画', '秦朗.球鞋', '阿嬷.认可度', '街坊.认可度', '秦海.相认', '近期事务',
] as const;

function read(data: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    return Object.prototype.hasOwnProperty.call(value, key) ? (value as Record<string, unknown>)[key] : undefined;
  }, data);
}
function text(value: unknown): string {
  return typeof value === 'string' && value.trim() !== '' ? value : EMPTY;
}
function choice(value: unknown, choices: readonly string[]): string {
  return typeof value === 'string' && choices.includes(value) ? value : EMPTY;
}
function percentage(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
}
export function relationship(value: unknown): string {
  const score = percentage(value);
  if (score === null) return EMPTY;
  return score < 60 ? '客居期' : score < 75 ? '磨合期' : score < 88 ? '过日子期' : '谈承诺期';
}
function calendar(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}\/\d{2}\/\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('/').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { full: value, day: value.slice(-2), month: `${year} 年 ${month} 月`, weekday: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getUTCDay()] };
}

export function toView(data: unknown) {
  const date = calendar(read(data, PATHS[0]));
  const affection = percentage(read(data, PATHS[5]));
  const trust = percentage(read(data, PATHS[6]));
  const money = read(data, PATHS[8]);
  const affairs = read(data, PATHS[15]);
  return {
    date: date?.full ?? EMPTY, day: date?.day ?? EMPTY, month: date?.month ?? EMPTY, weekday: date?.weekday ?? EMPTY,
    period: choice(read(data, PATHS[1]), ['清晨', '上午', '中午', '下午', '傍晚', '夜里', '深夜']),
    location: choice(read(data, PATHS[2]), ['吴兴街69号', '小吃街', '比比火工作室', '台北街头', '上海']),
    weather: text(read(data, PATHS[3])), stage: choice(read(data, PATHS[4]), ['落脚', '扎根', '承诺']),
    affection, relationship: relationship(affection), trust, mood: text(read(data, PATHS[7])),
    savings: typeof money === 'number' && Number.isSafeInteger(money) && money >= 0 && money <= 999999 ? new Intl.NumberFormat('en-US').format(money) : EMPTY,
    stall: choice(read(data, PATHS[9]), ['正常出摊', '歇业', '被人顶替', '暂交他人']),
    illustration: choice(read(data, PATHS[10]), ['停笔', '画自己的', '接商稿', '谈出版']),
    shoes: choice(read(data, PATHS[11]), ['没人注意', '被看上', '洽谈中', '没有下文', '量产']),
    grandma: percentage(read(data, PATHS[12])), neighbours: percentage(read(data, PATHS[13])),
    father: choice(read(data, PATHS[14]), ['未相认', '知道他在台北', '见过面', '说开了']),
    affairs: Array.isArray(affairs) && affairs.every(item => typeof item === 'string') ? affairs.map(text) : null,
  };
}
