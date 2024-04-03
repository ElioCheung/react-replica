import { updateContainer } from '../../react-reconciler/ReactFiberReconciler.js';

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  if (root === null) {
    throw new Error('Cannot update an unmounted root.');
  }

  updateContainer(children, root);
}

export default ReactDOMRoot