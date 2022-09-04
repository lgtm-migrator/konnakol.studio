import { createEffect, createStore, sample } from 'effector';
import { buffer } from 'stream/consumers';
import { Pitcher } from './pitcher';
import { initializeWebAudioApi, IWebAudioAPI } from './web-audio';

export interface DetectPitchInBackgroundFxParams {
  webAudio: IWebAudioAPI;
  pitcher: Pitcher;
}

export const $webAudio = createStore<IWebAudioAPI | null>(null)

export const initializeWebAudioApiFx = createEffect((webAudio: IWebAudioAPI | null) => {
  return webAudio || initializeWebAudioApi()
})

export const detectPitchInBackgroundFx = createEffect(({
  webAudio: { analyserAudioNode, buffer },
  pitcher
}: DetectPitchInBackgroundFxParams) => {
  analyserAudioNode.getFloatTimeDomainData(buffer)
  return pitcher.detect(buffer)
})

sample({
  clock: initializeWebAudioApiFx.doneData,
  source: $webAudio,
  fn: (_, webAudio) => webAudio,
  target: $webAudio
})

