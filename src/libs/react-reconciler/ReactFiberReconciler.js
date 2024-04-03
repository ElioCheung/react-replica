import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue';
import { createFiberRoot } from './ReactFiberRoot';
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';

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
  );
}

export function updateContainer(children, fiberRootNode) {
  const current = fiberRootNode.current;
  // TODO: Request an update lane

  // create an update object
  const update = createUpdate();
  update.payload = {
    element: children,
  };
  
  const root = enqueueUpdate(current, update);
  if (root !== null) {
    scheduleUpdateOnFiber(root, current);
  }
}