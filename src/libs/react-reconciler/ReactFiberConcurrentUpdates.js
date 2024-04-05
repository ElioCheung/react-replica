import { HostRoot } from './ReactWorkTags';

const concurrentQueues = [];
let concurrentQueuesIndex = 0;
let hasForceUpdate = false;

function enqueueUpdate(fiber, queue, update) {
  concurrentQueues[concurrentQueuesIndex++] = fiber;
  concurrentQueues[concurrentQueuesIndex++] = queue;
  concurrentQueues[concurrentQueuesIndex++] = update;
  // concurrentQueues[concurrentQueuesIndex++] = lane;

  // TODO: lane
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
  enqueueUpdate(fiber, queue, update);
  return getRootForUpdateFiber(fiber);
}
