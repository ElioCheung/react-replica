import { ConcurrentRoot } from './ReactRootTags';
import { NoMode, StrictEffectsMode, StrictLegacyMode } from './ReactTypeOfMode';
import { HostRoot } from './ReactWorkTags';
import { NoFlags } from './ReactFiberFlags';

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