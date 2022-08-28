import { createEffect, createStore, sample } from 'effector';
import { initializeWebAudioApi, IWebAudioAPI } from './web-audio';

export const $webAudio = createStore<IWebAudioAPI | null>(null);

export const initializeWebAudioApiFx = createEffect(initializeWebAudioApi);

sample({
  clock: initializeWebAudioApiFx.doneData,
  source: $webAudio,
  filter: (webAudio) => !webAudio, // must not be initialized yet
  target: $webAudio
})
