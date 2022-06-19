const ONE_MINUTE = 60_000;

export function bpmToMilliseconds(bpm: number) {
    return ONE_MINUTE / bpm;
}

export function millisecondsToBPM(ms: number) {
    return ONE_MINUTE / ms;
}