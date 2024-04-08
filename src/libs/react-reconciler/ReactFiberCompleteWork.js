import { NoFlags, Snapshot, Update, ForceClientRender } from './ReactFiberFlags';
import { IndeterminateComponent, LazyComponent, SimpleMemoComponent, FunctionComponent, ForwardRef, Fragment, Mode, Profiler, ContextConsumer, MemoComponent, HostRoot, HostComponent } from './ReactWorkTags';
import { getRootHostContainer } from './ReactFiberHostContext';
import { appendAllChildren, createInstance, finalizeInitialChildren } from '../react-dom/client/ReactDOMHostConfig';

export function completeWork(current, wip) {
  const props = wip.pendingProps;

  switch (wip.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      bubbleProperties(wip);
      return null;
    case HostRoot:
      // if (current === null || current.child === null) {
      //   if (current !== null) {
      //     const prevState = current.memoizedState;
      //     if (!prevState.isDehydrated || (wip.flags & ForceClientRender) !== NoFlags) {
      //       wip.flags |= Snapshot;
      //     }
      //   }
      // }
      bubbleProperties(wip);
      return null;
    case HostComponent:
      const rootContainerInstance = getRootHostContainer();
      const type = wip.type;
      if (current !== null && wip.stateNode != null) {
        // TODO: Update
      } else {
        const instance = createInstance(type, props, rootContainerInstance, null, wip);
        appendAllChildren(instance, wip, false, false);
        wip.stateNode = instance;
        if (finalizeInitialChildren(instance, type, props, rootContainerInstance)) {
          // Tag the fiber with an update effect. This turns a Placement into
          // a PlacementAndUpdate.
          wip.flags |= Update;
        }
      }

      bubbleProperties(wip);
      return null;
  }
}

function bubbleProperties(completedWork) {
  const didBailout = completedWork.alternate !== null && completedWork.alternate.child === completedWork;
  let subtreeFlags = NoFlags;
  if (!didBailout) {
    let child = completedWork.child;
    while (child !== null) {
      subtreeFlags |= child.subtreeFlags;
      subtreeFlags |= child.flags;

      child.return = completedWork;
      child = child.sibling;
    }
    completedWork.subtreeFlags |= subtreeFlags;
  }

  return didBailout;
}