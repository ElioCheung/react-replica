import { HostRoot } from './ReactWorkTags';

let concurrentQueues = [];
let concurrentQueuesIndex = 0;
let hasForceUpdate = false;

function pushConcurrentUpdateQueue(update) {
  if (concurrentQueues === null) {
    concurrentQueues = [update];
  } else {
    concurrentQueues.push(update);
  }
}

function getRootForUpdateFiber(fiber) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }

  return node.tag === HostRoot ? node.stateNode : null;
}

export function enqueueConcurrentClassUpdate(fiber, queue, update) {
  const interleaved = queue.interleaved;
  if (interleaved === null) {
    // This is the first update. Create a circular list
    update.next = update;
    // At the end of the current render, this queue's interleaved updates will
    // be transferred to the pending queue.
    pushConcurrentUpdateQueue(queue);
  } else {
    update.next = interleaved.next;
    interleaved.next = update;
  }

  queue.interleaved = update;;
  return getRootForUpdateFiber(fiber);
}

export function finishQueueingConcurrentUpdates() {
  if (concurrentQueues !== null) {
    for (let i = 0; i < concurrentQueues.length; i++) {
      const queue = concurrentQueues[i];
      const lastInterleavedUpdate = queue.interleaved;
      if (lastInterleavedUpdate !== null) {
        // Transfer the interleaved updates to the pending queue.
        queue.interleaved = null;
        const firstInterleavedUpdate = lastInterleavedUpdate.next;
        const lastPendingUpdate = queue.pending;

        if (lastPendingUpdate !== null) {
          const firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = firstInterleavedUpdate;
          lastInterleavedUpdate.next = firstPendingUpdate;
        }
        
        // Set the pending queue to the interleaved updates.
        queue.pending = lastInterleavedUpdate;
      }
    }
    // reset concurrentQueues
    concurrentQueues = null;
  }
}
