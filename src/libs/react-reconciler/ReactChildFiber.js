import { REACT_FRAGMENT_TYPE, REACT_ELEMENT_TYPE } from '../shared/ReactSymbols';
import { createFiberFromElement } from './ReactFiber';
import { Placement } from './ReactFiberFlags';
import { HostText } from './ReactWorkTags';

function createChildReconciler(shouldTrackSideEffects) {
  function placeSingleChild(fiber) {
    if (shouldTrackSideEffects && fiber.alternate === null) {
      fiber.flags |= Placement ;
    }
    return fiber;
  }

  function reconcileSingleElement(
    returnFiber,
    currentFirstChild,
    element,
  ) {
    const created = createFiberFromElement(element, returnFiber.mode);
    created.return = returnFiber;
    return created;
  }

  function useFiber(fiber, pendingProps) {
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function reconcileSingleTextNode(
    returnFiber,
    currentFirstChild,
    textContent,
  ) {
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      const existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    }

    const created = createFiberFromContext(textContent, returnFiber.mode,);
    created.return = returnFiber;
    return created;
  }

  function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild) {
    const isUnkeyedTopLevelFragment =
      typeof newChild === 'object' &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;

    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
            ),
          );
        }
      }

      // TODO: If the newChild is Array
    }

    if (
      (typeof newChild === 'string' && newChild !== '') ||
      typeof newChild === 'number' 
    ) {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          // $FlowFixMe[unsafe-addition] Flow doesn't want us to use `+` operator with string and bigint
          '' + newChild,
        ),
      );
    }
  }

  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    return reconcileChildFibersImpl(
      returnFiber,
      currentFirstChild,
      newChild,
    );
  }

  return reconcileChildFibers;
}


export const reconcileChildFibers = createChildReconciler(true);
export const mountChildFibers = createChildReconciler(false);