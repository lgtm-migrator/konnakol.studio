import { createEffect, createStore, sample } from 'effector';
import { initializeWebAudioApi, IWebAudioAPI } from './web-audio';

export const $webAudio = createStore<IWebAudioAPI | null>(null)

export const initializeWebAudioApiFx = createEffect(initializeWebAudioApi)

sample({
  clock: initializeWebAudioApiFx.doneData,
  target: $webAudio
})
