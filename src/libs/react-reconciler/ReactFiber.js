import { ConcurrentRoot } from './ReactRootTags';
import { ConcurrentMode, NoMode, StrictEffectsMode, StrictLegacyMode } from './ReactTypeOfMode';
import { HostComponent, HostRoot, HostText, IndeterminateComponent } from './ReactWorkTags';
import { NoFlags } from './ReactFiberFlags';
import { REACT_STRICT_MODE_TYPE } from '../shared/ReactSymbols';
import { Mode } from './ReactWorkTags';

export function FiberNode(
  tag,
  pendingProps,
  key,
  mode,
) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  // this.ref = null;
  // this.refCleanup = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  // this.dependencies = null;

  this.mode = mode;

  // Effects
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  this.alternate = null;
}

function createFiber(
  tag,
  pendingProps,
  key,
  mode,
) {
  return new FiberNode(tag, pendingProps, key, mode);
}

export function createHostRootFiber(tag, isSisStrictMode) {
  let mode;
  if (tag === ConcurrentRoot) {
    mode = ConcurrentRoot;
    if (isSisStrictMode) {
      mode |= StrictLegacyMode | StrictEffectsMode;
    }
  } else {
    mode = NoMode;
  }

  return createFiber(HostRoot, null, null, mode);
}

export function createFiberFromElement(element, mode) {
  let owner = null;
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;

  const fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
  );

  return fiber;
}

export function createFiberFromTypeAndProps(
  type,
  key,
  pendingProps,
  owner,
  mode,
) {
  let fiberFlag = IndeterminateComponent;
  if (typeof type === 'function') {
    // 
  } else if (typeof type === 'string') {
    fiberFlag = HostComponent;
  } else {
    getTag: switch (type) {
      case REACT_STRICT_MODE_TYPE:
        fiberFlag = Mode;
        mode |= StrictLegacyMode;
        if ((mode & ConcurrentMode) !== NoMode) {
          mode |= StrictEffectsMode;
        }
    }
  }

  const fiber = createFiber(fiberFlag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = type;

  return fiber;
}

export function createFIberFormContext(context, mode) {
  return createFiber(HostText, context, null, mode);
}