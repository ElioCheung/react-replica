import ReactDOMRoot from './ReactDOMRoot.js';
import { createContainer } from '../../react-reconciler/ReactFiberReconciler.js';
import { ConcurrentRoot } from '../../react-reconciler/ReactRootTags.js';
import { markContainerAsRoot } from '../../react-dom-bindings/src/client/ReactDOMComponentTree.js';

export function createRoot(container) {
  const isSisStrictMode = false;

  const root = createContainer(container, ConcurrentRoot, null, isSisStrictMode);
  markContainerAsRoot(root, container);

  // TODO: Listen to all supported events and attach it to the container

  return new ReactDOMRoot(root);
}