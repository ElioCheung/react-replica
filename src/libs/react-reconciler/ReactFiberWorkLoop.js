import { finishQueueingConcurrentUpdates } from './ReactFiberConcurrentUpdates';
import { beginWork } from './ReactFIberBeginWork';
import { FiberNode } from './ReactFiber';
import { Incomplete, NoFlags, StaticMask } from './ReactFiberFlags';
import { completeWork } from './ReactFiberCompleteWork';

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
      break;
    } catch (error) {
      console.error(error);
      workInProgress = null;
    }
  } while (true);
}

function prepareFreshStack(fiberRoot) {
  fiberRoot.finishedWork = null;
  resetWorkInProgressStack();

  workInProgressRoot = fiberRoot;
  const wip = createWorkInProgress(fiberRoot.current, null);
  workInProgress = wip;

  finishQueueingConcurrentUpdates();

  return wip;
}

function resetWorkInProgressStack() {
  if (workInProgress === null) return;
  // TODO: reset others

  workInProgress = null;
}

function createWorkInProgress(current, pendingProps) {
  let wip = current.alternate;
  if (wip === null) {
    wip = new FiberNode(current.tag, pendingProps, current.key, current.mode);
    wip.elementType = current.elementType;
    wip.type = current.type;
    wip.stateNode = current.stateNode;

    wip.alternate = current;
    current.alternate = wip;
  } else {
    wip.pendingProps = pendingProps;
    // Needed because Blocks store data on type.
    wip.type = current.type;

    // We already have an alternate.
    // Reset the effect tag.
    wip.flags = NoFlags;

    // The effects are no longer valid.
    wip.subtreeFlags = NoFlags;
    wip.deletions = null;
  }

  // Reset all effects except static ones.
  // Static effects are not specific to a render.
  wip.flags = current.flags & StaticMask;
  // wip.childLanes = current.childLanes;
  // wip.lanes = current.lanes;

  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  wip.updateQueue = current.updateQueue;

  // These will be overridden during the parent's reconciliation
  wip.sibling = current.sibling;
  wip.index = current.index;

  // finishQueueingConcurrentUpdates();
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
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(wip);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(completedWork) {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.

  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;

    if ((completedWork.flags & Incomplete) === NoFlags) {
      const next = completeWork(current, completedWork);
      if (next !== null) {
        workInProgress = next;
        return;
      } else {
        // TODO: ohter 
      }

      const siblingFiber = completedWork.sibling;
      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        workInProgress = siblingFiber;
        return;
      }

      // Otherwise, return to the parent
      completedWork = returnFiber;
      // Update the next thing we're working on in case something throws.
      workInProgress = completedWork;
    }
  } while (completedWork !== null);
}