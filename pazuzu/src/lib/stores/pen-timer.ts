import { writable, get } from 'svelte/store';
import { appData, updateData } from './app';
import { uid } from '../utils/uid';

export const penElapsed = writable(0);
export const penRunning = writable(false);

let intervalId: ReturnType<typeof setInterval> | null = null;

export function initPenTimer() {
  const data = get(appData);
  const state = data.penTimerState;
  if (state && state.running && state.startTime > 0) {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    penElapsed.set(elapsed);
    penRunning.set(true);
    startTicking();
  }

  document.addEventListener('visibilitychange', persistTimerState);
  window.addEventListener('beforeunload', persistTimerState);
}

function persistTimerState() {
  const running = get(penRunning);
  if (running) {
    const data = get(appData);
    updateData(d => {
      d.penTimerState = {
        running: true,
        startTime: data.penTimerState.startTime,
        elapsed: get(penElapsed),
      };
    });
  }
}

function startTicking() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    const data = get(appData);
    if (data.penTimerState.startTime > 0) {
      const elapsed = Math.floor((Date.now() - data.penTimerState.startTime) / 1000);
      penElapsed.set(elapsed);
    }
  }, 1000);
}

export function startPenTimer() {
  const now = Date.now();
  penRunning.set(true);
  penElapsed.set(0);
  updateData(d => {
    d.penTimerState = { running: true, startTime: now, elapsed: 0 };
  });
  startTicking();
}

export function stopPenTimer() {
  const elapsed = get(penElapsed);
  penRunning.set(false);
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  updateData(d => {
    d.activityLog.push({
      id: uid(),
      dt: new Date().toISOString(),
      type: 'pen',
      subtype: 'pen',
      duration: Math.round(elapsed / 60),
    });
    d.penTimerState = { running: false, startTime: 0, elapsed: 0 };
  });

  penElapsed.set(0);
  return elapsed;
}
