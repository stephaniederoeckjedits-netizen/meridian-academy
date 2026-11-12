type SoundsStore = {
  ctx: AudioContext | null
  unlocked: boolean
}

function getStore(): SoundsStore {
  if (typeof window === 'undefined') {
    return { ctx: null, unlocked: false }
  }
  const w = window as unknown as { __meridianSounds?: SoundsStore }
  if (!w.__meridianSounds) {
    w.__meridianSounds = { ctx: null, unlocked: false }
  }
  return w.__meridianSounds
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const store = getStore()
  if (!store.ctx) {
    const w = window as unknown as {
      AudioContext?: typeof AudioContext
      webkitAudioContext?: typeof AudioContext
    }
    const Ctor = w.AudioContext || w.webkitAudioContext
    if (!Ctor) return null
    store.ctx = new Ctor()
  }
  if (store.ctx.state === 'suspended') {
    store.ctx.resume().catch(() => {})
  }
  return store.ctx
}

export function unlockAudio() {
  const store = getStore()
  if (store.unlocked) return
  const ctx = getCtx()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => { store.unlocked = true }).catch(() => {})
  } else {
    store.unlocked = true
  }
}

export function isAudioUnlocked() {
  const store = getStore()
  return store.unlocked && store.ctx !== null && store.ctx.state === 'running'
}

export function playInitializingSound(durationMs = 2200) {
  const ctx = getCtx()
  if (!ctx) return
  const dur = durationMs / 1000
  const t0 = ctx.currentTime

  const noiseLen = Math.floor(ctx.sampleRate * dur)
  const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < noiseLen; i++) data[i] = Math.random() * 2 - 1
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.Q.value = 6
  noiseFilter.frequency.setValueAtTime(180, t0)
  noiseFilter.frequency.exponentialRampToValueAtTime(2800, t0 + dur)
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.0001, t0)
  noiseGain.gain.exponentialRampToValueAtTime(0.10, t0 + 0.6)
  noiseGain.gain.setValueAtTime(0.10, t0 + dur - 0.5)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noise.start(t0)
  noise.stop(t0 + dur)

  const sweep = ctx.createOscillator()
  const sweepGain = ctx.createGain()
  sweep.connect(sweepGain)
  sweepGain.connect(ctx.destination)
  sweep.type = 'sine'
  sweep.frequency.setValueAtTime(180, t0)
  sweep.frequency.exponentialRampToValueAtTime(720, t0 + dur)
  sweepGain.gain.setValueAtTime(0.0001, t0)
  sweepGain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.5)
  sweepGain.gain.setValueAtTime(0.08, t0 + dur - 0.4)
  sweepGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  sweep.start(t0)
  sweep.stop(t0 + dur)

  const sub = ctx.createOscillator()
  const subGain = ctx.createGain()
  sub.connect(subGain)
  subGain.connect(ctx.destination)
  sub.type = 'sine'
  sub.frequency.setValueAtTime(40, t0)
  sub.frequency.exponentialRampToValueAtTime(90, t0 + dur)
  subGain.gain.setValueAtTime(0.0001, t0)
  subGain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.4)
  subGain.gain.setValueAtTime(0.09, t0 + dur - 0.4)
  subGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  sub.start(t0)
  sub.stop(t0 + dur)

  const bell = ctx.createOscillator()
  const bellGain = ctx.createGain()
  bell.connect(bellGain)
  bellGain.connect(ctx.destination)
  bell.type = 'sine'
  bell.frequency.value = 1568
  const bellStart = t0 + dur - 0.3
  bellGain.gain.setValueAtTime(0.0001, bellStart)
  bellGain.gain.exponentialRampToValueAtTime(0.18, bellStart + 0.03)
  bellGain.gain.exponentialRampToValueAtTime(0.0001, bellStart + 0.75)
  bell.start(bellStart)
  bell.stop(bellStart + 0.85)
}

export function playTransitionSound(durationMs = 1400) {
  const ctx = getCtx()
  if (!ctx) return
  const dur = durationMs / 1000
  const t0 = ctx.currentTime

  const noiseLen = Math.floor(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < noiseLen; i++) d[i] = Math.random() * 2 - 1
  const noise = ctx.createBufferSource()
  noise.buffer = buf
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 4
  filter.frequency.setValueAtTime(2400, t0)
  filter.frequency.exponentialRampToValueAtTime(400, t0 + dur)
  const nGain = ctx.createGain()
  nGain.gain.setValueAtTime(0.0001, t0)
  nGain.gain.exponentialRampToValueAtTime(0.06, t0 + 0.15)
  nGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  noise.connect(filter)
  filter.connect(nGain)
  nGain.connect(ctx.destination)
  noise.start(t0)
  noise.stop(t0 + dur)

  const notes = [
    { freq: 880, delay: 0.05, gain: 0.09 },
    { freq: 1318.5, delay: 0.35, gain: 0.08 },
  ]
  notes.forEach(({ freq, delay, gain: peak }) => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g)
    g.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    const t = t0 + delay
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
    osc.start(t)
    osc.stop(t + 1.0)
  })
}

export function startAmbientHum(): () => void {
  const ctx = getCtx()
  if (!ctx) return () => {}

  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const osc3 = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc1.type = 'sine'
  osc1.frequency.value = 55
  osc2.type = 'sine'
  osc2.frequency.value = 82.5
  osc3.type = 'triangle'
  osc3.frequency.value = 165

  filter.type = 'lowpass'
  filter.frequency.value = 320
  filter.Q.value = 0.7

  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2.5)

  osc1.connect(filter)
  osc2.connect(filter)
  osc3.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc1.start()
  osc2.start()
  osc3.start()

  return () => {
    const t = ctx.currentTime
    gain.gain.cancelScheduledValues(t)
    gain.gain.setValueAtTime(gain.gain.value, t)
    gain.gain.linearRampToValueAtTime(0.0001, t + 0.6)
    setTimeout(() => {
      try {
        osc1.stop()
        osc2.stop()
        osc3.stop()
      } catch {
        /* already stopped */
      }
    }, 800)
  }
}

export function playTickSound(progress = 0) {
  const ctx = getCtx()
  if (!ctx) return
  const baseFreq = 1200 + (progress / 100) * 1400
  const t = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(baseFreq, t)
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, t + 0.05)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.035, t + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
  osc.start(t)
  osc.stop(t + 0.1)

  const sheen = ctx.createOscillator()
  const sheenGain = ctx.createGain()
  sheen.connect(sheenGain)
  sheenGain.connect(ctx.destination)
  sheen.type = 'sine'
  sheen.frequency.value = baseFreq * 2
  sheenGain.gain.setValueAtTime(0.0001, t)
  sheenGain.gain.exponentialRampToValueAtTime(0.012, t + 0.003)
  sheenGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
  sheen.start(t)
  sheen.stop(t + 0.08)
}

export function playSelectSound() {
  const ctx = getCtx()
  if (!ctx) return
  const t = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1480, t)
  osc.frequency.exponentialRampToValueAtTime(1720, t + 0.06)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.05, t + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11)
  osc.start(t)
  osc.stop(t + 0.12)

  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.type = 'triangle'
  osc2.frequency.value = 2960
  gain2.gain.setValueAtTime(0.0001, t)
  gain2.gain.exponentialRampToValueAtTime(0.015, t + 0.004)
  gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
  osc2.start(t)
  osc2.stop(t + 0.09)
}

export function playConfirmSound() {
  const ctx = getCtx()
  if (!ctx) return
  const t = ctx.currentTime

  const o1 = ctx.createOscillator()
  const g1 = ctx.createGain()
  o1.connect(g1)
  g1.connect(ctx.destination)
  o1.type = 'triangle'
  o1.frequency.setValueAtTime(660, t)
  o1.frequency.exponentialRampToValueAtTime(990, t + 0.08)
  g1.gain.setValueAtTime(0.0001, t)
  g1.gain.exponentialRampToValueAtTime(0.11, t + 0.01)
  g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
  o1.start(t)
  o1.stop(t + 0.18)

  const o2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  o2.connect(g2)
  g2.connect(ctx.destination)
  o2.type = 'triangle'
  o2.frequency.setValueAtTime(990, t + 0.09)
  o2.frequency.exponentialRampToValueAtTime(1480, t + 0.19)
  g2.gain.setValueAtTime(0.0001, t + 0.09)
  g2.gain.exponentialRampToValueAtTime(0.10, t + 0.10)
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
  o2.start(t + 0.09)
  o2.stop(t + 0.28)
}

export function playPassSound() {
  const ctx = getCtx()
  if (!ctx) return
  const t0 = ctx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.value = freq
    const t = t0 + i * 0.09
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
    osc.start(t)
    osc.stop(t + 0.6)

    const sh = ctx.createOscillator()
    const shG = ctx.createGain()
    sh.connect(shG)
    shG.connect(ctx.destination)
    sh.type = 'sine'
    sh.frequency.value = freq * 2
    shG.gain.setValueAtTime(0.0001, t)
    shG.gain.exponentialRampToValueAtTime(0.04, t + 0.02)
    shG.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
    sh.start(t)
    sh.stop(t + 0.45)
  })
}

export function playFailSound() {
  const ctx = getCtx()
  if (!ctx) return
  const t0 = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(300, t0)
  osc.frequency.exponentialRampToValueAtTime(70, t0 + 1.0)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.13, t0 + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1)
  osc.start(t0)
  osc.stop(t0 + 1.2)

  const rumble = ctx.createOscillator()
  const rumbleGain = ctx.createGain()
  rumble.connect(rumbleGain)
  rumbleGain.connect(ctx.destination)
  rumble.type = 'sine'
  rumble.frequency.value = 55
  rumbleGain.gain.setValueAtTime(0.0001, t0)
  rumbleGain.gain.exponentialRampToValueAtTime(0.10, t0 + 0.02)
  rumbleGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5)
  rumble.start(t0)
  rumble.stop(t0 + 0.55)
}
export function playPageFlipSound() {
  const ctx = getCtx()
  if (!ctx) return

  const dur = 0.4
  const t0 = ctx.currentTime

  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  const noise = ctx.createBufferSource()
  noise.buffer = buf

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1100
  filter.Q.value = 0.6

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start(t0)
  noise.stop(t0 + dur)
}
