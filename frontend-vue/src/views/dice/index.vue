<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// 骰子数量配置
const diceCount = ref(2);
const minDiceCount = 1;
const maxDiceCount = 6;

// 骰子当前点数
const diceValues = ref<number[]>([1, 1]);
// 是否正在滚动
const isRolling = ref(false);
// 音效开关
const soundEnabled = ref(true);
// 音频上下文
let audioContext: AudioContext | null = null;

// 计算总点数
const totalPoints = computed(() => {
  return diceValues.value.reduce((sum, val) => sum + val, 0);
});

// 初始化音频上下文
onMounted(() => {
  // 延迟创建，避免浏览器自动播放策略限制
  audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
});

// 播放骰子滚动音效
const playDiceSound = () => {
  if (!soundEnabled.value || !audioContext) return;

  const duration = 1.5; // 音效持续时间（秒）
  const now = audioContext.currentTime;

  // 创建多个短促的碰撞声，模拟骰子翻滚
  for (let i = 0; i < 15; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // 随机频率模拟骰子碰撞声
    const baseFrequency = 150 + Math.random() * 200;
    oscillator.frequency.setValueAtTime(baseFrequency, now);

    // 音量逐渐衰减
    const startTime = now + (i * duration) / 15;
    const attackTime = 0.01;
    const decayTime = 0.05;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(
      0.15 * (1 - i / 15),
      startTime + attackTime
    );
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + decayTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + decayTime);
  }

  // 添加低频滚动声
  const noiseGain = audioContext.createGain();
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );
  const data = buffer.getChannelData(0);

  // 生成白噪音并过滤
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.1 * (1 - i / bufferSize);
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;

  // 低通滤波器，模拟摩擦声
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + duration);

  noiseGain.gain.setValueAtTime(0.3, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(audioContext.destination);

  noise.start(now);
  noise.stop(now + duration);
};

// 更新骰子数量
const updateDiceCount = (count: number) => {
  if (count < minDiceCount || count > maxDiceCount) return;
  diceCount.value = count;
  diceValues.value = Array(count).fill(1);
};

// 生成随机点数
const getRandomDiceValue = () => Math.floor(Math.random() * 6) + 1;

// 切换音效
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
};

// 滚动骰子
const rollDice = () => {
  if (isRolling.value) return;

  isRolling.value = true;

  // 播放音效
  playDiceSound();

  // 动画效果：快速切换随机数字
  const animationInterval = setInterval(() => {
    diceValues.value = Array(diceCount.value)
      .fill(0)
      .map(() => getRandomDiceValue());
  }, 100);

  // 1.5秒后停止并显示最终结果
  setTimeout(() => {
    clearInterval(animationInterval);
    diceValues.value = Array(diceCount.value)
      .fill(0)
      .map(() => getRandomDiceValue());
    isRolling.value = false;
  }, 1500);
};

// 获取骰子点的位置配置
const getDiceDots = (value: number) => {
  const dots: { x: number; y: number }[] = [];

  switch (value) {
    case 1:
      dots.push({ x: 50, y: 50 });
      break;
    case 2:
      dots.push({ x: 25, y: 25 }, { x: 75, y: 75 });
      break;
    case 3:
      dots.push({ x: 25, y: 25 }, { x: 50, y: 50 }, { x: 75, y: 75 });
      break;
    case 4:
      dots.push(
        { x: 25, y: 25 },
        { x: 75, y: 25 },
        { x: 25, y: 75 },
        { x: 75, y: 75 }
      );
      break;
    case 5:
      dots.push(
        { x: 25, y: 25 },
        { x: 75, y: 25 },
        { x: 50, y: 50 },
        { x: 25, y: 75 },
        { x: 75, y: 75 }
      );
      break;
    case 6:
      dots.push(
        { x: 25, y: 25 },
        { x: 75, y: 25 },
        { x: 25, y: 50 },
        { x: 75, y: 50 },
        { x: 25, y: 75 },
        { x: 75, y: 75 }
      );
      break;
  }

  return dots;
};
</script>

<template>
  <div class="dice-container">
    <!-- 标题 -->
    <h1 class="title">小曹棋牌室</h1>

    <!-- 骰子数量配置 -->
    <div class="dice-config">
      <label>骰子数量：</label>
      <div class="count-selector">
        <button
          :disabled="diceCount <= minDiceCount"
          class="count-btn"
          @click="updateDiceCount(diceCount - 1)"
        >
          -
        </button>
        <span class="count-display">{{ diceCount }}</span>
        <button
          :disabled="diceCount >= maxDiceCount"
          class="count-btn"
          @click="updateDiceCount(diceCount + 1)"
        >
          +
        </button>
      </div>

      <!-- 音效开关 -->
      <button
        class="sound-btn"
        :class="{ active: soundEnabled }"
        @click="toggleSound"
      >
        <span v-if="soundEnabled">🔊</span>
        <span v-else>🔇</span>
      </button>
    </div>

    <!-- 骰子显示区域 -->
    <div class="dice-area">
      <div
        v-for="(value, index) in diceValues"
        :key="index"
        class="dice"
        :class="{ rolling: isRolling }"
      >
        <div class="dice-face">
          <div
            v-for="(dot, dotIndex) in getDiceDots(value)"
            :key="dotIndex"
            class="dot"
            :style="{
              left: `${dot.x}%`,
              top: `${dot.y}%`
            }"
          />
        </div>
      </div>
    </div>

    <!-- 滚动按钮 -->
    <button :disabled="isRolling" class="roll-btn" @click="rollDice">
      {{ isRolling ? "投掷中..." : "投掷骰子" }}
    </button>

    <!-- 点数显示 -->
    <div class="result-area">
      <div class="individual-results">
        <div
          v-for="(value, index) in diceValues"
          :key="index"
          class="result-item"
        >
          骰子{{ index + 1 }}: <span class="point">{{ value }}</span
          >点
        </div>
      </div>
      <div class="total-result">
        总点数: <span class="total-point">{{ totalPoints }}</span
        >点
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.title {
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 4px;
}

.dice-config {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  label {
    font-size: 18px;
    color: #fff;
    font-weight: 500;
  }
}

.count-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}

.count-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #fff;
  color: #667eea;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #667eea;
    color: #fff;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.count-display {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  min-width: 40px;
  text-align: center;
}

.sound-btn {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &.active {
    background: rgba(255, 255, 255, 0.3);
    border-color: #fff;
  }
}

.dice-area {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
  padding: 40px;
  min-height: 200px;
}

.dice {
  width: 100px;
  height: 100px;
  perspective: 1000px;

  &.rolling {
    animation: shake 0.3s infinite;
  }
}

.dice-face {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  .dice.rolling & {
    animation: rotate3d 0.5s infinite linear;
  }
}

.dot {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #667eea;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes shake {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(-5deg);
  }
  75% {
    transform: translateY(-5px) rotate(5deg);
  }
}

@keyframes rotate3d {
  0% {
    transform: rotate3d(1, 1, 0, 0deg);
  }
  100% {
    transform: rotate3d(1, 1, 0, 360deg);
  }
}

.roll-btn {
  padding: 15px 60px;
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
  background: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;

  &:hover:not(:disabled) {
    background: #667eea;
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.result-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  min-width: 400px;
}

.individual-results {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.result-item {
  font-size: 18px;
  color: #fff;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;

  .point {
    font-size: 24px;
    font-weight: bold;
    color: #ffd700;
    margin: 0 5px;
  }
}

.total-result {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);

  .total-point {
    font-size: 36px;
    color: #ffd700;
    margin: 0 10px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .title {
    font-size: 32px;
    margin-bottom: 30px;
  }

  .dice-area {
    gap: 20px;
    padding: 20px;
  }

  .dice {
    width: 80px;
    height: 80px;
  }

  .result-area {
    min-width: auto;
    width: 90%;
  }

  .roll-btn {
    padding: 12px 40px;
    font-size: 18px;
  }
}
</style>
