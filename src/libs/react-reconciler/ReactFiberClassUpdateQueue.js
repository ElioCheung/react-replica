import { enqueueConcurrentClassUpdate } from './ReactFiberConcurrentUpdates';

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

export function initializeUpdateQueue(fiber) {
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      // lanes: NoLanes,
      // hiddenCallbacks: null,
    },
    callbacks: null,
  };

  fiber.updateQueue = queue;
}

export function createUpdate() {
  return {
    // lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
  };
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) return null;

  const sharedQueue = updateQueue.shared;
  return enqueueConcurrentClassUpdate(fiber, sharedQueue, update);
}

export function finishQueueingConcurrentUpdates() {
  const endIndex = concurrentQueuesIndex;
  concurrentQueuesIndex = 0;

  let i = 0;
  while (i < endIndex) {
    const fiber = concurrentQueues[i];
    concurrentQueues[i++] = null;
    const queue = concurrentQueues[i];
    concurrentQueues[i++] = null;
    const update = concurrentQueues[i];
    concurrentQueues[i++] = null;
    // const lane = concurrentQueues[i];
    // concurrentQueues[i++] = null;

    if (queue !== null && update !== null ) {
      const pending = queue.pending;
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      queue.pending = update;
    }
  }
}

export function cloneUpdateQueue(current, wip) {
  const queue = wip.updateQueue;
  const currentQueue = current.updateQueue;
  if (queue === currentQueue) {
    const clone = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      callbacks: null,
    };

    wip.updateQueue = clone;
  }
}

export function processUpdateQueue(wip, props) {
  const queue = wip.updateQueue;
  let newState = queue.baseState;
  newState = getStateFromUpdate(
    workInProgress,
    queue,
    update,
    newState,
    props,
    null,
  );

  wip.memoizedState = newState;
}

function getStateFromUpdate(
  wip,
  queue,
  update,
  prevState,
  nextProps,
  instance,
) {
  switch (update.tag) {
    case UpdateState: {
      const payload = update.payload;
      let partialState;
      if (typeof payload === 'function') {
        partialState = payload.call(instance, prevState, nextProps);
      } else {
        partialState = payload;
      }
      if (partialState === null || partialState === undefined) {
        // Null and undefined are treated as no-ops.
        return prevState;
      }
      // Merge the partial state and the previous state.
      return assign({}, prevState, partialState);
    }
  }

  return prevState;
}