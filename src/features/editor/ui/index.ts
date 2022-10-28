import { createEvent, createStore, sample } from 'effector';

export const $isSidebarOpen = createStore(true);

export const konnakolChanged = createEvent<string>()
export const editCompositionNameButtonClicked = createEvent()
export const saveCompositionNameButtonClicked = createEvent()
export const compositionNameChanged = createEvent<string>()
export const saveCompositionButtonClicked = createEvent()
export const sidebarToggled = createEvent()

sample({
  clock: sidebarToggled,
  source: $isSidebarOpen,
  fn: prev => !prev,
  target: $isSidebarOpen
})
