const valueStack = [];
let fiberStack = null;
let index = -1;

export function createCursor(defaultValue) {
  return {
    current: defaultValue,
  };
}

export function isEmpty() {
  return index === -1;
}

export function pop(cursor, fiber) {
  if (index < 0) return;

  cursor.current = valueStack[index];
  valueStack[index] = null;
  index--;
}

export function push(cursor, value, fiber) {
  index++;
  valueStack[index] = cursor.current;
  cursor.current = value;
}