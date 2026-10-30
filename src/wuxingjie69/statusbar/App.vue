<script setup lang="ts">
import Meter from './components/Meter.vue';
import { useStatusStore } from './store';
const { view: v } = useStatusStore();
</script>

<template>
  <article class="house-sheet" aria-label="吴兴街69号楼内状态栏">
    <header class="sheet-header">
      <div class="calendar" data-field="世界.日期" :aria-label="v.date">
        <span class="calendar-month">{{ v.month }}</span><strong>{{ v.day }}</strong><span class="calendar-weekday">{{ v.weekday }}</span>
      </div>
      <div class="house-heading">
        <div class="eyebrow"><span class="roof-mark" aria-hidden="true">⌂</span> 吴兴街 · 生活簿</div>
        <h1>一屋，两个人的日常。</h1>
        <div class="scene-line"><span data-field="世界.时段">{{ v.period }}</span><span class="sep" aria-hidden="true">／</span><span data-field="世界.天气">{{ v.weather }}</span></div>
        <div class="place-line"><span class="place" data-field="世界.当前地点">{{ v.location }}</span><span class="stage" data-field="世界.阶段">{{ v.stage }}</span></div>
      </div>
      <div class="house-stamp" aria-label="吴兴街69号"><span>吴兴街</span><b>69</b><span>号</span></div>
    </header>

    <div class="daily-columns">
      <section class="xinlei" aria-labelledby="xinlei-title">
        <div class="section-heading"><h2 id="xinlei-title">心蕾的近况</h2><span class="relationship" data-field="心蕾.好感度">{{ v.relationship }}</span></div>
        <p class="mood" data-field="心蕾.心情">{{ v.mood }}</p>
        <div class="relationship-meters">
          <Meter label="好感度" :value="v.affection" path="心蕾.好感度" />
          <Meter label="信任度" :value="v.trust" tone="trust" path="心蕾.信任度" />
        </div>
      </section>
      <section class="livelihood" aria-labelledby="livelihood-title">
        <div class="section-heading"><h2 id="livelihood-title">秦朗的生计</h2><span class="section-note">手头存款</span></div>
        <div class="savings" data-field="秦朗.存款"><span class="currency">NT$</span><strong>{{ v.savings }}</strong><span class="unit">新台币</span></div>
        <dl class="ledger">
          <div data-field="秦朗.摊子"><dt>摊子</dt><dd>{{ v.stall }}</dd></div>
          <div data-field="秦朗.插画"><dt>插画</dt><dd>{{ v.illustration }}</dd></div>
          <div data-field="秦朗.球鞋"><dt>球鞋</dt><dd>{{ v.shoes }}</dd></div>
        </dl>
      </section>
    </div>

    <section class="people" aria-labelledby="people-title">
      <div class="section-heading"><h2 id="people-title">家里，街坊，还有他</h2></div>
      <div class="people-grid">
        <Meter label="阿嬷认可度" :value="v.grandma" tone="approval" path="阿嬷.认可度" />
        <Meter label="街坊认可度" :value="v.neighbours" tone="approval" path="街坊.认可度" />
        <div class="father" data-field="秦海.相认"><span>秦海 · 相认</span><strong>{{ v.father }}</strong></div>
      </div>
    </section>

    <section class="affairs" aria-labelledby="affairs-title" data-field="近期事务">
      <div class="section-heading"><h2 id="affairs-title">最近记着的事</h2><span class="section-note">近期事务</span></div>
      <p v-if="v.affairs === null" class="affair-empty">—</p>
      <p v-else-if="v.affairs.length === 0" class="affair-empty">暂无近期事务</p>
      <ul v-else><li v-for="(item, index) in v.affairs" :key="index"><span class="note-square" aria-hidden="true"></span><span>{{ item }}</span></li></ul>
    </section>
    <footer class="sheet-footer"><span>吴兴街 69 号</span><span data-date>{{ v.date }}</span></footer>
  </article>
</template>
