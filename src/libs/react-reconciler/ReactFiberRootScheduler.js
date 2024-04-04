let firstScheduledRoot = null;
let lastScheduledRoot = null;

let mightHavePendingSyncWork = false;
let didScheduleMicrotask = false;

function processRootScheduleInMicrotask() {
  didScheduleMicrotask = false;
  mightHavePendingSyncWork = false;
  let root = firstScheduledRoot;
  while (root !== null) {
    const next = root.next;

    root = next;
  }
}

export function ensureRootIsScheduled(fiberRoot) {
  if (fiberRoot === lastScheduledRoot || fiberRoot.next !==  null) {
    // Fast path. This root is already scheduled.
  } else {
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = fiberRoot;
    } else {
      lastScheduledRoot.next = fiberRoot;
      lastScheduledRoot = fiberRoot;
    }
  }

  mightHavePendingSyncWork = true;

  if (!didScheduleMicrotask) {
    didScheduleMicrotask = true;
    // TODO: Later use the scheduler package to implement the function
    Promise.then(() => {
      processRootScheduleInMicrotask();
    })
  }
}