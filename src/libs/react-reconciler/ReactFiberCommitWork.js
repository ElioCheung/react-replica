import { HostComponent, HostRoot, HostPortal, FunctionComponent, ForwardRef, MemoComponent, SimpleMemoComponent, HostText } from './ReactWorkTags';
import { ContentReset } from './ReactFiberFlags';
import { appendChild, insertBefore, resetTextContent, appendChildToContainer, insertInContainerBefore } from '../react-dom/client/ReactDOMHostConfig';
import { Placement, MutationMask } from './ReactFiberFlags';

export function commitMutationEffects(fiberRoot, finishedWork) {
  commitMutationEffectsOnFiber(finishedWork, fiberRoot);
}

function recursivelyTraverseMutationEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & MutationMask) {
    let child = parentFiber.child;
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitMutationEffectsOnFiber(finishedWork, fiberRoot) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
    case HostRoot: {
      recursivelyTraverseMutationEffects(fiberRoot, finishedWork);
      commitReconciliationEffects(finishedWork);
      return;
    }
    case HostComponent:
      recursivelyTraverseMutationEffects(fiberRoot, finishedWork);
      commitReconciliationEffects(finishedWork);
      if (flags & ContentReset) {
        const instance = finishedWork.stateNode;
        resetTextContent(instance);
      }
      return;
  }
}

function commitReconciliationEffects(finishedWork) {
  const flags = finishedWork.flags;
  if (flags & Placement) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
}

function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostComponent: {
      const parent = parentFiber.stateNode;
      if (parentFiber.flags & ContentReset) {
        resetTextContent(parent);
        parentFiber.flags &= ~ContentReset;
      }
      // TODO: getHostSibling
      insertOrAppendPlacementNode(finishedWork, null, parent);
      break;
    }
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo;
      // TODO: getHostSibling
      insertOrAppendPlacementNodeIntoContainer(finishedWork, null, parent);
      break;
    } 
  }
}

function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
}

function isHostParent(fiber) {
  return (
    fiber.tag === HostComponent ||
    fiber.tag === HostRoot
  );
}

function insertOrAppendPlacementNode(fiberNode, before, parent) {
  const tag = fiberNode.tag;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const domNode = fiberNode.stateNode;
    if (before) {
      insertBefore(parent, domNode, before);
    } else {
      appendChild(parent, domNode);
    }
  } else if (tag === HostPortal) {

  } else {
    const child = fiberNode.child;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function insertOrAppendPlacementNodeIntoContainer(fiberNode, before, parent) {
  const tag = fiberNode.tag;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const domNode = fiberNode.stateNode;
    if (before) {
      insertInContainerBefore(parent, domNode, before);
    } else {
      appendChildToContainer(parent, domNode);
    }
  } else if (tag === HostPortal) {

  } else {
    const child = fiberNode.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}