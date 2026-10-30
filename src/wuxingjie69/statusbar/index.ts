import { createApp } from 'vue';
import App from './App.vue';
import { setSnapshot } from './store';
import './global.css';

$(() => {
  // Mount the empty display first so failed/missing MVU initialization never leaves a blank page.
  const app = createApp(App);
  app.mount('#app');
  let stopped = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let stopEvent: (() => void) | undefined;
  let lastSnapshot = '';
  let readWarning = false;
  const pause = () => new Promise<void>(resolve => setTimeout(resolve, 250));
  const option = { type: 'message' as const, message_id: getCurrentMessageId() };

  function refresh(): boolean {
    try {
      const table = getVariables(option);
      const present = table !== null && typeof table === 'object' && Object.prototype.hasOwnProperty.call(table, 'stat_data');
      const next: unknown = present ? table.stat_data : undefined;
      const serialized = JSON.stringify(next) ?? '';
      if (serialized !== lastSnapshot) {
        lastSnapshot = serialized;
        setSnapshot(next);
      }
      readWarning = false;
      return present;
    } catch (error) {
      lastSnapshot = '';
      setSnapshot(undefined);
      if (!readWarning) console.warn('[吴兴街69号] 本楼层变量暂不可读，显示空值。', error);
      readWarning = true;
      return false;
    }
  }

  async function connect() {
    await waitGlobalInitialized('Mvu');
    // Second readiness gate: wait for stat_data on this exact message, never the latest message.
    while (!stopped && !refresh()) await pause();
    if (stopped) return;
    timer = setInterval(refresh, 2000);
    try {
      const subscription = eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => refresh());
      stopEvent = () => subscription.stop();
    } catch (error) {
      console.warn('[吴兴街69号] 即时事件不可用，继续每2秒只读刷新。', error);
    }
    console.info('[吴兴街69号] 状态栏已连接当前楼层，只读模式。');
  }
  void connect().catch(error => console.warn('[吴兴街69号] MVU尚不可用，保留空值界面。', error));
  $(window).on('pagehide.wuxingjie69', () => {
    stopped = true;
    if (timer) clearInterval(timer);
    stopEvent?.();
    app.unmount();
  });
});
