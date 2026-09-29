<template>
  <div class="modal-backdrop" @click.self="$emit('goBack')">
    <transition name="slide-up" appear>
      <div class="mode-container">
        <div class="header-bar">
          <button class="close-btn" @click="$emit('goBack')">
            <XIcon size="28" stroke-width="2.5" />
          </button>
        </div>

        <div class="mode-content">
          <div class="mascot-header-row">
            <div class="text-col">
              <h2>Pratique com o Camaleão</h2>
              <p class="subtitle-text">Converse com o Camaleão IA para praticar o idioma escolhido.</p>
            </div>
            <div class="img-col">
              <img src="../assets/camaleao.png" class="peeking-mascot" />
            </div>
          </div>
          
          <div class="options-list">
            <div class="option-card mascot-card" @click="selectMode('mascot')">
              <div class="icon-wrapper mascot-icon-wrapper" style="overflow: hidden; padding: 0;">
                <img src="../assets/2.png" style="width: 100%; height: 100%; object-fit: cover;" class="main-icon" />
              </div>
              <div class="option-text">
                <h3>{{ t('ia_title') }}</h3>
                <p>{{ t('ia_desc') }}</p>
              </div>
              <ChevronRightIcon class="arrow-icon" size="24" stroke-width="2.5" />
            </div>

            <div class="option-card student-card" @click="selectMode('student')">
              <div class="icon-wrapper student-icon-wrapper">
                <UsersIcon size="28" stroke-width="2.5" />
              </div>
              <div class="option-text">
                <h3>Conversar com aluno</h3>
                <p>Faça match com alguém da mesma modalidade por 5 minutos.</p>
              </div>
              <ChevronRightIcon class="arrow-icon" size="24" stroke-width="2.5" />
            </div>
          </div>
          <div class="bottom-banner-wrapper">
            <div class="bottom-banner-pill">
              <img src="../assets/dica-hero.png" class="banner-mascot" />
              <span class="banner-text">Escolha e vamos<br>praticar juntos!</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { X as XIcon, ChevronRight as ChevronRightIcon, Users as UsersIcon } from '@lucide/vue'
import { t } from '../data/translations.js'

const emit = defineEmits(['goBack', 'selectMode'])

const selectMode = (mode) => {
  emit('selectMode', mode)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mode-container {
  width: 100%;
  max-width: 480px;
  height: 90%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
  position: relative;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.header-bar {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
}

.close-btn {
  background: none;
  border: none;
  color: #1a235c;
  cursor: pointer;
  padding: 8px;
}

.mode-content {
  flex: 1;
  padding: 0 24px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mascot-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.text-col h2 {
  font-size: 24px;
  color: #1a235c;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

.subtitle-text {
  font-size: 13px;
  color: #64748b;
  margin: 8px 0 0 0;
  font-weight: 600;
  line-height: 1.3;
}

.img-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.peeking-mascot {
  height: 80px;
  object-fit: contain;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.option-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  border: 2px solid;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  height: auto;
}

.option-card:active {
  transform: scale(0.98);
}

.solo-card {
  border-color: #22c55e;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.1);
}

.mascot-card {
  border-color: #0ea5e9;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.1);
}

.student-card {
  border-color: #2563eb;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  position: relative;
  flex-shrink: 0;
}

.solo-icon-wrapper {
  background: #dcfce7;
  color: #16a34a;
}

.mascot-icon-wrapper {
  background: #e0f2fe;
  color: #0284c7;
}

.student-icon-wrapper {
  background: #eef4ff;
  color: #1c5bf0;
}

.main-icon {
  margin: 0;
}

.badge-icon {
  position: absolute;
  top: -4px;
  right: -4px;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.badge-solo {
  color: #16a34a;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.option-text h3 {
  font-size: 16px;
  color: #1a235c;
  margin: 0;
  font-weight: 800;
  line-height: 1.2;
}

.option-text p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
  font-weight: 500;
}

.arrow-icon {
  color: #cbd5e1;
  margin-left: 12px;
}

.bottom-banner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  padding-top: 32px;
  margin-bottom: 16px;
  width: 100%;
}

.bottom-banner-pill {
  position: relative;
  background: #f0f4ff;
  padding: 16px 24px 16px 80px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(28, 91, 240, 0.05);
  margin-left: 20px;
}

.banner-mascot {
  position: absolute;
  left: -50px;
  bottom: -20px;
  width: 130px;
  height: 130px;
  object-fit: contain;
  object-position: bottom left;
  z-index: 5;
}

.banner-text {
  font-size: 15px;
  color: #1a235c;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
}

@media (max-width: 768px) {
  .bottom-banner-wrapper {
    display: none;
  }
}
</style>

