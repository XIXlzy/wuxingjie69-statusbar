// 吴兴街69号 · MVU 变量结构定义（Zod 4）
// 运行时已注入全局 z（Zod 4）与 _（lodash），本文件不含任何 import。
// 解析保持幂等：Schema.parse(Schema.parse(x)) 与 Schema.parse(x) 等价。
// 数值越界统一用 transform + _.clamp 收敛，而不是直接丢弃更新。

export const Schema = z
  .object({
    // ── 世界 ──
    世界: z
      .object({
        // 故事内日期，统一成 YYYY/MM/DD
        日期: z
          .string()
          .transform(value => value.trim().replace(/[-.]/g, '/'))
          .prefault('2007/05/06'),
        // 清晨/上午/中午/下午/傍晚/夜里/深夜
        时段: z
          .enum(['清晨', '上午', '中午', '下午', '傍晚', '夜里', '深夜'])
          .prefault('清晨'),
        // 吴兴街69号/小吃街/比比火工作室/台北街头/上海
        当前地点: z
          .enum(['吴兴街69号', '小吃街', '比比火工作室', '台北街头', '上海'])
          .prefault('吴兴街69号'),
        // 落脚/扎根/承诺，只前进不后退（推进条件由变量更新规则约束）
        阶段: z.enum(['落脚', '扎根', '承诺']).prefault('落脚'),
        天气: z.string().prefault('梅雨'),
      })
      .prefault({}),

    // ── 心蕾 ──
    心蕾: z
      .object({
        // 0~100，她对秦朗的亲近程度
        好感度: z
          .coerce.number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(45),
        // 0~100，她敢不敢把难处交给秦朗（与好感度独立）
        信任度: z
          .coerce.number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(30),
        心情: z.string().prefault('绷着，客气，正在心里给这个家立规矩'),
      })
      .prefault({}),

    // ── 秦朗（<user> 的状态，只记录客观事实） ──
    秦朗: z
      .object({
        // 手头现金，单位新台币
        存款: z
          .coerce.number()
          .transform(value => _.clamp(value, 0, 999999))
          .prefault(3800),
        // 正常出摊/歇业/被人顶替/暂交他人
        摊子: z
          .enum(['正常出摊', '歇业', '被人顶替', '暂交他人'])
          .prefault('歇业'),
        // 停笔/画自己的/接商稿/谈出版
        插画: z
          .enum(['停笔', '画自己的', '接商稿', '谈出版'])
          .prefault('画自己的'),
        // 没人注意/被看上/洽谈中/没有下文/量产
        球鞋: z
          .enum(['没人注意', '被看上', '洽谈中', '没有下文', '量产'])
          .prefault('没人注意'),
      })
      .prefault({}),

    // ── 认可 ──
    阿嬷: z
      .object({
        // 0~100，牡丹婆对心蕾的接受程度
        认可度: z
          .coerce.number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(35),
      })
      .prefault({}),

    街坊: z
      .object({
        // 0~100，小吃街对这对情侣的态度
        认可度: z
          .coerce.number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(40),
      })
      .prefault({}),

    // ── 暗流 ──
    秦海: z
      .object({
        // 未相认/知道他在台北/见过面/说开了，只由玩家行动推进，不自动跳级
        相认: z
          .enum(['未相认', '知道他在台北', '见过面', '说开了'])
          .prefault('未相认'),
      })
      .prefault({}),

    // ── 事务 ──
    近期事务: z.array(z.string()).prefault([]),
  })
  .prefault({});