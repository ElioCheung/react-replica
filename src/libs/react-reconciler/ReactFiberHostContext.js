import { createCursor } from './ReactFiberStack';
import { push } from './ReactFiberStack';

const NO_CONTEXT = {};
const rootInstanceStackCursor = createCursor(NO_CONTEXT);

function requiredContext(c) {
  if (c === NO_CONTEXT) {
    throw new Error('Expected host context to exist. This error is likely caused by a bug ' + 'in React. Please file an issue.');
  }

  return c;
}

export function pushHostContainer(fiberRoot, container) {
  push(rootInstanceStackCursor, container, fiberRoot);
}

export function getRootHostContainer() {
  var rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}
