import { createFiberRoot } from './ReactFiberRoot';

export function createContainer(container, tag, hydrationCallbacks, isStrictMode) {
  const hydrate = false;
  const initialChildren = null;

  return createFiberRoot(
    container,
    tag,
    hydrate,
    hydrationCallbacks,
    initialChildren,
    isStrictMode,
  )
}

export function updateContainer() {

}