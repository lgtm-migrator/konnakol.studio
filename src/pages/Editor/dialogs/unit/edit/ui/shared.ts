import { createStore, createEvent, sample } from 'effector';

export const $isOpen = createStore(false);

export const open = createEvent<number>();
export const close = createEvent();
export const save = createEvent();

$isOpen.on(open, () => true).on(close, () => false);
