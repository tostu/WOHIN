import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'wohin.onboarded';

type State = boolean | null;

let state: State = null;
const listeners = new Set<() => void>();

function setState(next: State) {
  if (state === next) return;
  state = next;
  listeners.forEach((l) => l());
}

let loaded = false;
function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  AsyncStorage.getItem(ONBOARDING_KEY)
    .then((v) => setState(v === null))
    .catch(() => setState(false));
}

function subscribe(l: () => void) {
  ensureLoaded();
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot(): State {
  return state;
}

export function useFirstLaunch() {
  const isFirstLaunch = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
    setState(false);
  };

  return { isFirstLaunch, completeOnboarding };
}
