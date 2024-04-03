import { createHostRootFiber } from './ReactFiber';
import { initializeUpdateQueue } from './ReactFiberClassUpdateQueue';

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;

  this.cancelPendingCommit = null;
  this.next = null;
}

export function createFiberRoot(
  container,
  tag,
  hydrate,
  hydrationCallbacks,
  initialChildren,
  isStrictMode,
) {
  const root = new FiberRootNode(container, tag, hydrate);

  const uninitializedFiber = createHostRootFiber(
    tag,
    isStrictMode,
  );

  // Reference root and uninitializedFiber through properties
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  const initialState = {
    element: initialChildren,
    isDehydrated: hydrate,
    cache: null,
    transitions: null,
    pendingSuspenseBoundaries: null,
  }

  uninitializedFiber.memoizedState = initialState;
  initializeUpdateQueue(uninitializedFiber);

  return root;
}