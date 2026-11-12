// Tracks daily activity flags used by auto-checked Daily Goals
// Every key is prefixed by user email so accounts never leak into each other

function prefix(userEmail?: string) {
  return userEmail ? userEmail + '_' : 'guest_'
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function markCodexOpened(userEmail?: string) {
  try {
    localStorage.setItem(`${prefix(userEmail)}activity_codex_${todayKey()}`, '1')
  } catch (e) {}
}

export function markFlashcardUsed(userEmail?: string) {
  try {
    localStorage.setItem(`${prefix(userEmail)}activity_flashcard_${todayKey()}`, '1')
  } catch (e) {}
}

export function addPracticeSeconds(seconds: number, userEmail?: string) {
  try {
    const key = `${prefix(userEmail)}activity_practice_sec_${todayKey()}`
    const current = parseInt(localStorage.getItem(key) || '0')
    localStorage.setItem(key, String(current + seconds))
  } catch (e) {}
}

export function getPracticeMinutes(userEmail?: string): number {
  try {
    const key = `${prefix(userEmail)}activity_practice_sec_${todayKey()}`
    const seconds = parseInt(localStorage.getItem(key) || '0')
    return Math.floor(seconds / 60)
  } catch (e) { return 0 }
}

export function hasFlag(flag: 'codex' | 'flashcard', userEmail?: string): boolean {
  try {
    return localStorage.getItem(`${prefix(userEmail)}activity_${flag}_${todayKey()}`) === '1'
  } catch (e) { return false }
}