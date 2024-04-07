import { cloneUpdateQueue, processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { reconcileChildFibers } from './ReactChildFiber';
import { HostRoot } from './ReactWorkTags';

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
  // fixme: wip's updateQueue is assigned from HostRootFiber, why does it need to be cloned?
  // cloneUpdateQueue(current, wip);

  // Simplify the processUpdateQueue function. Its function when rendering for the first time is to take out the updateQueue.shared.pending value and copy it to memoizedState
  processUpdateQueue(wip, nextProps, null);

  const nextState = wip.memoizedState;

  const nextChildren = nextState.element;
  reconcileChildren(current, wip, nextChildren);
  return wip.child;
}

export function reconcileChildren(current, wip, nextChildren) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    wip.child = reconcileChildFibers(wip, current.child, nextChildren);
  }
}