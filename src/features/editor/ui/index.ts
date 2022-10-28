import { createEvent } from 'effector';

export const konnakolChanged = createEvent<string>()
export const editCompositionNameButtonClicked = createEvent()
export const saveCompositionNameButtonClicked = createEvent()
export const compositionNameChanged = createEvent<string>();
export const saveCompositionButtonClicked = createEvent();
