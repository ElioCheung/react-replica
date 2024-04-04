import { finishQueueingConcurrentUpdates } from './ReactFiberClassUpdateQueue';
import { beginWork } from './ReactFIberBeginWork';

export const NoContext = /*             */ 0b000;
const BatchedContext = /*               */ 0b001;
export const RenderContext = /*         */ 0b010;
export const CommitContext = /*         */ 0b100;

const RootInProgress = 0;
const RootFatalErrored = 1;
const RootErrored = 2;
const RootSuspended = 3;
const RootSuspendedWithDelay = 4;
const RootCompleted = 5;
const RootDidNotComplete = 6;

// Describes where we are in the React execution stack
let executionContext = NoContext;
// The root we're working on
let workInProgressRoot = null;
// The fiber we're working on
let workInProgress = null;

export function scheduleUpdateOnFiber(root, hostRootFiber) {
  // TODO: when updating, schedule an update on the root

  // Mark that the root has a pending update.
  // markRootUpdated(root, lane);

  // TODO: Schedule an update
  // ensureRootIsScheduled(root);

  performConcurrentWorkOnRoot(root);
}

export function performConcurrentWorkOnRoot(root) {
  // when first rendering, it's a blocking lane, so set shouldTimeSlice to false
  const shouldTimeSlice = false;
  if (!shouldTimeSlice) {
    // legacy render mode
    renderRootSync(root);
  }
}

function renderRootSync(root) {
  if (workInProgressRoot !== root) {
    prepareFreshStack(root);
  }

  do {
    try {
      workLoopSync();
    } catch (error) {
      console.error(error);
    }
  } while (true);
}

function prepareFreshStack(fiberRoot) {
  fiberRoot.finishedWork = null;
  resetWorkInProgressStack();

  workInProgressRoot = fiberRoot;
  const wip = createWorkInProgress(fiberRoot.current, null);
  return wip;
}

function resetWorkInProgressStack() {
  if (workInProgress === null) return;
  // TODO: reset others

  workInProgress = null;
}

function createWorkInProgress(hostRootFiber, pendingProps) {
  let wip = hostRootFiber.alternate;
  if (wip === null) {
    wip = new FiberNode(hostRootFiber.tag, pendingProps, hostRootFiber.key, hostRootFiber.mode);
    wip.elementType = hostRootFiber.elementType;
    wip.type = hostRootFiber.type;
    wip.stateNode = hostRootFiber.stateNode;
  } else {
    // TODO: Update
  }

  // Reset all effects except static ones.
  // Static effects are not specific to a render.
  wip.flags = hostRootFiber.flags & StaticMask;
  wip.childLanes = hostRootFiber.childLanes;
  wip.lanes = hostRootFiber.lanes;

  wip.child = hostRootFiber.child;
  wip.memoizedProps = hostRootFiber.memoizedProps;
  wip.memoizedState = hostRootFiber.memoizedState;
  wip.updateQueue = hostRootFiber.updateQueue;

  // These will be overridden during the parent's reconciliation
  wip.sibling = hostRootFiber.sibling;
  wip.index = hostRootFiber.index;

  finishQueueingConcurrentUpdates();
  return wip;
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(wip) {
  const current = wip.alternate;
  const next = beginWork(current, wip);
  wip.memoizedProps = wip.pendingProps;

  if (next === null) {
    // TODO: complete unit of work
  } else {
    workInProgress = next;
  }
}