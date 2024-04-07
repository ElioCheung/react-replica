import { cloneUpdateQueue, processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { reconcileChildFibers, mountChildFibers } from './ReactChildFiber';
import { HostRoot, FunctionComponent, IndeterminateComponent, HostComponent } from './ReactWorkTags';
import { shouldSetTextContent } from '../react-dom/client/ReactDOMHostConfig';
import { ContentReset } from './ReactFiberFlags';

export function beginWork(current, wip) {
  if (current !== null) {
    // TODO: Update
  }

  switch (wip.tag) {
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, wip, wip.type);
    case HostRoot:
      // return App node, but the tag is IndeterminateComponent
      return updateHostRoot(current, wip);
    case FunctionComponent:
      console.log('FunctionComponent');
      break;
    case HostComponent:
      return updateHostComponent(current, wip);
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

function mountIndeterminateComponent(current, wip, Component) {
  const props = wip.pendingProps;
  // Only works with functional components
  // Simplify the implementation and do not add the renderWithHooks function for the time being.
  // renderWithHooks(wip, Component, props, null);
  wip.memoizedState = null;
  wip.updateQueue = null;
  let children = null;
  if (typeof Component === 'function') {
    children = Component(props);
  }
  wip.tag = FunctionComponent;
  reconcileChildren(null, wip, children);
  return wip.child;
}

function updateHostComponent(current, wip) {
  const type = wip.type;
  const prevProps = current !== null ? current.memoizedProps : null;
  const nextProps = wip.pendingProps;

  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.flags |= ContentReset;
  }

  reconcileChildren(current, wip, nextChildren);
  return wip.child;
}

export function reconcileChildren(current, wip, nextChildren) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    wip.child = mountChildFibers(wip, null, nextChildren);
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    wip.child = reconcileChildFibers(wip, current.child, nextChildren);
  }
}