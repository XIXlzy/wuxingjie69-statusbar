# 吴兴街69号 · 楼内状态栏

只读展示当前消息楼层的16个 MVU 变量，简体中文，旧日历/生活记账簿风格。

## 使用

```html
<body><script>
$('body').load('https://testingcf.jsdelivr.net/gh/XIXlzy/wuxingjie69-statusbar/dist/wuxingjie69/statusbar/index.html')
</script></body>
```

需 SillyTavern + Tavern Helper + 已注册 MVU。该页面依赖酒馆助手预注入的 Vue、jQuery 和酒馆接口，直接在普通浏览器打开生产页面不是有效的运行环境。

通过 `getVariables({ type: 'message', message_id: getCurrentMessageId() }).stat_data` 读取本消息楼层；初始化两道等待，2秒轮询和更新事件只读刷新。没有变量写接口，不自动修改剧情或分数。缺失、null、错误类型独立显示“—”；空事务数组显示“暂无近期事务”。好感关系阈值60/75/88。

## 构建

基于 [StageDog/tavern_helper_template](https://github.com/StageDog/tavern_helper_template)，基线commit `2a6d5c0d5200986ce6636a49ac7890ffa01c801a`。本仓库提供项目源文件与编译HTML，模板共享文件保持上游原样。

1. 克隆上述模板，将本仓库的 `src/wuxingjie69` 放进模板 `src/`。
2. Node.js 24，`pnpm install --frozen-lockfile`，`pnpm build`。
3. 产物为 `dist/wuxingjie69/statusbar/index.html`，CSS/JS已内联，仅依赖宿主预注入的库。
4. 数据断言：`node src/wuxingjie69/qa/model.test.mjs`。本地预览：`python3 src/wuxingjie69/qa/serve.py`，打开 `http://127.0.0.1:8769/src/wuxingjie69/qa/preview.html`。预览fixture仅测试使用，不进入生产包。

类型检查：在模板根执行 `pnpm --dir src/wuxingjie69/qa install --ignore-workspace`，再执行 `node src/wuxingjie69/qa/node_modules/vue-tsc/bin/vue-tsc.js --noEmit --project tsconfig.json`。上游示例/第三方类型的基线问题单列；本项目src无错误。

## 边界

不包含角色卡PNG、头像、世界书、开场白或卡片state。schema.ts仅为变量契约副本，不参与生产读取和补默认值。设计与数据降级说明见 `src/wuxingjie69/DESIGN.md`。

模板许可保留见 LICENSE（PolyForm Noncommercial 1.0.0）。
