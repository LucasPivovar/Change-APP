<template>
  <div class="modal-backdrop" @click.self="$emit('goBack')">
    <transition name="slide-up" appear>
      <div class="mode-container">
        <!-- Header Bar -->
        <div class="header-bar" :class="{ 'with-back': step === 'camaleao' }">
          <button v-if="step === 'camaleao'" class="back-btn-header" @click="step = 'main'" aria-label="Voltar">
            <ChevronLeftIcon size="20" stroke-width="2.5" />
            <span>Voltar</span>
          </button>
          <button class="close-btn" @click="$emit('goBack')" aria-label="Fechar">
            <XIcon size="28" stroke-width="2.5" />
          </button>
        </div>

        <div class="mode-content">
          <transition name="step-fade" mode="out-in">
            <!-- PASSO 1: Menu Principal da Modalidade (Pratique com o Camaleão / Chat em tempo real) -->
            <div v-if="step === 'main'" key="main-step" class="step-wrapper">
              <div class="mascot-header-row">
                <div class="text-col">
                  <h2>Prática do Idioma</h2>
                  <p class="subtitle-text">Escolha como prefere praticar seu idioma hoje.</p>
                </div>
                <div class="img-col">
                  <img src="../assets/camaleao.png" class="peeking-mascot" alt="Camaleão" />
                </div>
              </div>

              <div class="options-list">
                <!-- 1. Pratique com o Camaleão -->
                <div class="option-card mascot-card" @click="step = 'camaleao'">
                  <div class="icon-wrapper mascot-icon-wrapper" style="overflow: hidden; padding: 0;">
                    <img src="../assets/2.png" style="width: 100%; height: 100%; object-fit: cover;" class="main-icon" alt="Camaleão" />
                  </div>
                  <div class="option-text">
                    <h3>Pratique com o Camaleão</h3>
                    <p>Prática diária por cenários, call de voz ao vivo ou chat livre com IA.</p>
                  </div>
                  <ChevronRightIcon class="arrow-icon" size="24" stroke-width="2.5" />
                </div>

                <!-- 2. Chat em tempo real -->
                <div class="option-card student-card" @click="selectMode('student')">
                  <div class="icon-wrapper student-icon-wrapper">
                    <UsersIcon size="28" stroke-width="2.5" />
                  </div>
                  <div class="option-text">
                    <h3>Chat em tempo real</h3>
                    <p>Encontre outro aluno da mesma modalidade para conversar por 5 minutos.</p>
                  </div>
                  <ChevronRightIcon class="arrow-icon" size="24" stroke-width="2.5" />
                </div>
              </div>
            </div>

            <!-- PASSO 2: Dentro do Pratique com o Camaleão (Prática Diária, Call com o Camaleão, Chat Livre) -->
            <div v-else key="camaleao-step" class="step-wrapper">
              <div class="mascot-header-row">
                <div class="text-col">
                  <h2>Pratique com o Camaleão</h2>
                  <p class="subtitle-text">Escolha como prefere praticar com o Camaleão:</p>
                </div>
                <div class="img-col">
                  <img src="../assets/camaleao.png" class="peeking-mascot" alt="Camaleão" />
                </div>
              </div>

              <div class="options-list">
                <!-- 1. Prática Diária (Cenários do dia a dia) -->
                <div class="option-card mascot-card" @click="selectMode('daily-practice')">
                  <div class="icon-wrapper mascot-icon-wrapper" style="overflow: hidden; padding: 0;">
                    <img src="../assets/2.png" style="width: 100%; height: 100%; object-fit: cover;" class="main-icon" alt="Camaleão" />
                  </div>
                  <div class="option-text">
                    <h3>Prática Diária</h3>
                    <p>Cenários do dia a dia com roteiro e objetivo (ex: Lanche na escola, Compras).</p>
                  </div>
                  <ChevronRightIcon class="arrow-icon" size="24" stroke-width="2.5" />
                </div>

                <!-- 2. Call com o Camaleão (Voz ao vivo) -->
                <div class="option-card call-card" @click="selectMode('call')">
                  <div class="icon-wrapper call-icon-wrapper">
                    <PhoneIcon size="26" stroke-width="2.5" />
                  </div>
                  <div class="option-text">
                    <h3>Call com o Camaleão</h3>
                    <p>Chamada por voz ao vivo com o Camaleão 3D. Pratique sua fala sem digitar!</p>
                  </div>
                  <ChevronRightIcon class="arrow-icon" size="24" stroke-width="2.5" />
                </div>

                <!-- 3. Chat Livre com o Camaleão (Conversa aberta sem roteiro) -->
                <div class="option-card free-chat-card" @click="selectMode('free-chat')">
                  <div class="icon-wrapper free-chat-icon-wrapper">
                    <MessageSquareIcon size="26" stroke-width="2.5" />
                  </div>
                  <div class="option-text">
                    <h3>Chat Livre com o Camaleão</h3>
                    <p>Conversa aberta e sem roteiro pré-determinado. Fale sobre o que quiser!</p>
                  </div>
                  <ChevronRightIcon class="arrow-icon" size="24" stroke-width="2.5" />
                </div>
              </div>
            </div>
          </transition>

          <div class="bottom-banner-wrapper">
            <div class="bottom-banner-pill">
              <img src="../assets/dica-hero.png" class="banner-mascot" alt="" />
              <span class="banner-text">Escolha e vamos<br>praticar juntos!</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X as XIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Users as UsersIcon, Phone as PhoneIcon, MessageSquare as MessageSquareIcon } from '@lucide/vue'

const props = defineProps({
  initialStep: { type: String, default: 'main' }
})

const emit = defineEmits(['goBack', 'selectMode'])

const step = ref(props.initialStep || 'main')

watch(() => props.initialStep, (newVal) => {
  if (newVal) step.value = newVal
})

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
  height: 92%;
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
  align-items: center;
  padding: 14px 20px 8px;
}

.header-bar.with-back {
  justify-content: space-between;
}

.back-btn-header {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  border: none;
  color: #1c5bf0;
  font-size: 13.5px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn-header:hover {
  background: #e2e8f0;
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
  padding: 0 20px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.step-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.step-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.mascot-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.text-col h2 {
  font-size: 22px;
  color: #1a235c;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

.subtitle-text {
  font-size: 13px;
  color: #64748b;
  margin: 6px 0 0 0;
  font-weight: 600;
  line-height: 1.3;
}

.img-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.peeking-mascot {
  height: 75px;
  object-fit: contain;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.option-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 18px;
  border-radius: 18px;
  border: 2px solid;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  height: auto;
}

.option-card:active {
  transform: scale(0.98);
}

.mascot-card {
  border-color: #0ea5e9;
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.08);
}

.call-card {
  border-color: #22c55e;
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.1);
}

.free-chat-card {
  border-color: #8b5cf6;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.1);
}

.student-card {
  border-color: #2563eb;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.08);
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  position: relative;
  flex-shrink: 0;
}

.mascot-icon-wrapper {
  background: #e0f2fe;
  color: #0284c7;
}

.call-icon-wrapper {
  background: #dcfce7;
  color: #16a34a;
}

.free-chat-icon-wrapper {
  background: #f3e8ff;
  color: #7c3aed;
}

.student-icon-wrapper {
  background: #eef4ff;
  color: #1c5bf0;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.option-text h3 {
  font-size: 15px;
  color: #1a235c;
  margin: 0;
  font-weight: 800;
  line-height: 1.2;
}

.option-text p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.35;
  font-weight: 500;
}

.arrow-icon {
  color: #cbd5e1;
  margin-left: 10px;
}

.bottom-banner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  padding-top: 20px;
  margin-bottom: 12px;
  width: 100%;
}

.bottom-banner-pill {
  position: relative;
  background: #f0f4ff;
  padding: 12px 20px 12px 70px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(28, 91, 240, 0.05);
  margin-left: 20px;
}

.banner-mascot {
  position: absolute;
  left: -40px;
  bottom: -15px;
  width: 100px;
  height: 100px;
  object-fit: contain;
  object-position: bottom left;
  z-index: 5;
}

.banner-text {
  font-size: 13px;
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
