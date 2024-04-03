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