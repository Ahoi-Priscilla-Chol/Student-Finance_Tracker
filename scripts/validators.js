export function checkDescription(text) {
    return /^\S(?:*\S)?$/.test(text)
}
export function checkAmount(text) {
    return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(text);
}

export function checkData(text) {
    return /^(0|[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(text);
}
export function checkCategory(text) {
    return /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(text);
}

export function hasRepeatedWord(text) {
    return /\b(w+)\s+\b/i.test(text);
}
