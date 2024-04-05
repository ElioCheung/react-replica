import { cloneUpdateQueue, processUpdateQueue } from './ReactFiberClassUpdateQueue';

export function beginWork(current, wip) {
  if (current !== null) {
    // TODO: Update
  }

  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(current, wip);
    default:
      console.warn('Not yet implemented');
      break;
  }
}

function updateHostRoot(current, wip) {
  const nextProps = wip.pendingProps;
  const prevState = wip.memoizedState;
  const prevChildren = prevState.element;
  
  cloneUpdateQueue(current, wip);
  // Transform the processUpdateQueue function, only applicable to the first rendering
  processUpdateQueue(wip, nextProps, null);

  const nextState = wip.memoizedState;

  const nextChildren = nextState.element;
  reconcileChildren(current, wip, nextChildren);
  return wip.child;
}

export function reconcileChildren(current, wip, nextChildren) {
  if (current === null) {

  } else {

  }
}