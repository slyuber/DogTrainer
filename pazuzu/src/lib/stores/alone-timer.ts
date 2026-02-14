import { writable, get } from 'svelte/store';
import { appData, updateData } from './app';
import { uid } from '../utils/uid';

export const aloneElapsed = writable(0);
export const aloneRunning = writable(false);

let intervalId: ReturnType<typeof setInterval> | null = null;

export function initAloneTimer() {
  const data = get(appData);
  if (data.aloneTimerState.running && data.aloneTimerState.startTime > 0) {
    const elapsed = Math.floor((Date.now() - data.aloneTimerState.startTime) / 1000);
    aloneElapsed.set(elapsed);
    aloneRunning.set(true);
    startTicking();
  }

  // Persist on visibility change and beforeunload
  document.addEventListener('visibilitychange', persistTimerState);
  window.addEventListener('beforeunload', persistTimerState);
}

function persistTimerState() {
  const running = get(aloneRunning);
  if (running) {
    const data = get(appData);
    updateData(d => {
      d.aloneTimerState = {
        running: true,
        startTime: data.aloneTimerState.startTime,
        elapsed: get(aloneElapsed),
      };
    });
  }
}

function startTicking() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    const data = get(appData);
    if (data.aloneTimerState.startTime > 0) {
      const elapsed = Math.floor((Date.now() - data.aloneTimerState.startTime) / 1000);
      aloneElapsed.set(elapsed);
    }
  }, 1000);
}

export function startAloneTimer() {
  const now = Date.now();
  aloneRunning.set(true);
  aloneElapsed.set(0);
  updateData(d => {
    d.aloneTimerState = { running: true, startTime: now, elapsed: 0 };
  });
  startTicking();
}

export function stopAloneTimer() {
  const elapsed = get(aloneElapsed);
  aloneRunning.set(false);
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  // Log the alone session
  updateData(d => {
    d.aloneLogs.push({
      id: uid(),
      dt: new Date().toISOString(),
      duration: elapsed,
    });
    d.activityLog.push({
      id: uid(),
      dt: new Date().toISOString(),
      type: 'alone',
      subtype: 'alone',
      duration: Math.round(elapsed / 60),
    });
    d.aloneTimerState = { running: false, startTime: 0, elapsed: 0 };
  });

  aloneElapsed.set(0);
  return elapsed;
}
