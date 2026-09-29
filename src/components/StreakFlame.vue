<template>
  <span class="flame-container" :style="{ width: size + 'px', height: size + 'px' }">
    <svg class="streak-flame" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" :style="{ width: size + 'px', height: size + 'px' }">
      <defs>
        <linearGradient :id="'outer-' + id" x1="0" x2="0" y1="64" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ef4444" />
          <stop offset="0.55" stop-color="#f97316" />
          <stop offset="1" stop-color="#facc15" />
        </linearGradient>
        <linearGradient :id="'inner-' + id" x1="0" x2="0" y1="58" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset="0.45" stop-color="#fde68a" />
          <stop offset="1" stop-color="#fb923c" />
        </linearGradient>
      </defs>
      <path class="flame-tip flame-tip-left" :fill="'url(#outer-' + id + ')'" d="M22 31C18 24 22 16 29 10C27 20 34 22 35 31C36 39 30 45 24 45C18 45 15 39 17 34C18 36 20 36 22 31Z" opacity="0.9" />
      <path class="flame-tip flame-tip-right" :fill="'url(#outer-' + id + ')'" d="M39 32C44 25 41 17 34 7C35 20 27 24 27 36C27 46 35 53 43 49C50 46 51 37 47 31C45 36 42 37 39 32Z" opacity="0.95" />
      <path class="flame-body" :fill="'url(#outer-' + id + ')'" d="M32 4C20 16 15 27 16 38C17 51 26 60 37 59C49 58 56 47 52 35C49 25 40 20 38 10C35 17 29 21 28 30C27 37 33 40 29 47C23 41 24 33 32 4Z" />
      <path class="flame-inner" :fill="'url(#inner-' + id + ')'" d="M33 28C26 36 24 43 27 50C30 57 41 57 44 49C47 42 42 37 39 32C39 39 35 40 34 45C31 41 31 36 33 28Z" />
    </svg>
  </span>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ size: { type: [Number, String], default: 20 } })
const id = ref(Math.random().toString(36).substring(2, 9))
</script>

<style scoped>
.flame-container { display:inline-flex; align-items:center; justify-content:center; vertical-align:middle; line-height:0; }
.streak-flame { transform-origin:center bottom; filter: drop-shadow(0 3px 8px rgba(249, 115, 22, .28)); animation: flame-sway 1.8s ease-in-out infinite; overflow: visible; }
.flame-body { transform-origin:center bottom; animation: body-breathe 1.5s ease-in-out infinite; }
.flame-inner { transform-origin:center bottom; animation: inner-dance 1s ease-in-out infinite; }
.flame-tip { transform-origin:center bottom; }
.flame-tip-left { animation: tip-left 1.15s ease-in-out infinite; }
.flame-tip-right { animation: tip-right 1.3s ease-in-out infinite reverse; }
@keyframes flame-sway { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
@keyframes body-breathe { 0%,100% { transform: scaleY(.98) scaleX(1); } 50% { transform: scaleY(1.04) scaleX(.98); } }
@keyframes inner-dance { 0%,100% { transform: translateY(1px) scale(.96); opacity:.86; } 50% { transform: translateY(-2px) scale(1.04); opacity:1; } }
@keyframes tip-left { 0%,100% { transform: translateY(1px) rotate(-2deg) scale(.97); } 50% { transform: translateY(-4px) rotate(3deg) scale(1.05); } }
@keyframes tip-right { 0%,100% { transform: translateY(0) rotate(2deg) scale(.98); } 50% { transform: translateY(-5px) rotate(-3deg) scale(1.06); } }
</style>
