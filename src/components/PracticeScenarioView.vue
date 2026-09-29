<template>
  <div class="scenario-container">
    <header class="scenario-header">
      <button class="back-btn" @click="$emit('goBack')"><ChevronLeftIcon size="24" /></button>
      <div class="header-copy">
        <span class="level-pill">{{ levelLabel }}</span>
        <h2>Práticas do dia</h2>
        <p>As situações mudam todos os dias à meia-noite.</p>
        <div class="progress-row">
          <div class="progress-track"><span :style="{ width: progressPercent + '%' }"></span></div>
          <strong>{{ completedCount }} de {{ scenarios.length }}</strong>
        </div>
      </div>
    </header>

    <main class="scenario-content">
      <button v-for="scenario in scenarios" :key="scenario.id" class="scenario-card" @click="$emit('selectScenario', scenario)">
        <div class="scenario-main">
          <span class="level-tag">{{ levelLabel }}</span>
          <div class="scenario-title-row">
            <h3>{{ scenario.title }}</h3>
            <span v-if="scoreFor(scenario.id)" class="stars">{{ stars(scoreFor(scenario.id)) }}</span>
          </div>
          <p>{{ scenario.description }}</p>
        </div>
        <ChevronRightIcon size="22" class="arrow" />
      </button>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'
import { audienceForCourse, scenarioScoreKey, scenariosForCourse } from '../data/practiceScenarios.js'

const props = defineProps({ language: { type: String, default: 'en' }, courseId: { type: String, default: 'general' } })
defineEmits(['goBack', 'selectScenario'])
const scenarios = computed(() => scenariosForCourse(props.courseId, props.language))
const scoreFor = (id) => Number(localStorage.getItem(scenarioScoreKey(props.language, props.courseId, id)) || 0)
const stars = (score) => '★'.repeat(score) + '☆'.repeat(Math.max(0, 5 - score))
const completedCount = computed(() => scenarios.value.filter(item => scoreFor(item.id) > 0).length)
const progressPercent = computed(() => scenarios.value.length ? Math.round((completedCount.value / scenarios.value.length) * 100) : 0)
const levelLabel = computed(() => {
  const audience = audienceForCourse(props.courseId)
  if (audience === 'kids') return 'Kids'
  if (audience === 'teens') return 'Teens'
  if (audience === 'business') return 'Business'
  if (audience === 'researchers') return 'Acadêmico'
  if (audience === '50plus') return '50+'
  return 'Adulto'
})
</script>

<style scoped>
.scenario-container { position:absolute; inset:0; z-index:55; background:#f4f8ff; display:flex; flex-direction:column; }
.scenario-header { background:#fff; border-bottom:1px solid #e2e8f0; padding:18px 20px; display:flex; gap:14px; align-items:flex-start; }
.back-btn { border:0; background:#eef4ff; color:#1c5bf0; width:40px; height:40px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.header-copy { flex:1; min-width:0; }
h2 { margin:4px 0 0; color:#1a235c; font-size:20px; font-weight:900; }
p { margin:4px 0 0; color:#64748b; font-size:13px; font-weight:600; line-height:1.35; }
.level-pill, .level-tag { display:inline-flex; align-items:center; width:max-content; border:1px solid #bfdbfe; background:#eff6ff; color:#1d4ed8; border-radius:999px; padding:4px 10px; font-size:11px; font-weight:900; letter-spacing:.02em; }
.progress-row { display:flex; align-items:center; gap:10px; margin-top:12px; color:#1a235c; font-size:12px; }
.progress-track { flex:1; height:8px; border-radius:999px; background:#dbeafe; overflow:hidden; }
.progress-track span { display:block; height:100%; border-radius:999px; background:#1c5bf0; transition:width .25s ease; }
.scenario-content { flex:1; overflow:auto; padding:20px; display:grid; gap:14px; align-content:start; }
.scenario-card { display:flex; align-items:center; gap:14px; width:100%; border:1px solid #dbeafe; background:#fff; border-radius:22px; padding:16px; text-align:left; box-shadow:0 8px 24px rgba(28,91,240,.06); }
.scenario-main { flex:1; min-width:0; display:flex; flex-direction:column; gap:8px; }
.scenario-title-row { display:flex; justify-content:space-between; gap:8px; align-items:flex-start; }
h3 { margin:0; color:#1a235c; font-size:16px; font-weight:900; }
.stars { color:#f59e0b; font-size:13px; white-space:nowrap; }
.arrow { color:#94a3b8; flex-shrink:0; }
</style>
