import { precacheFiberNode, updateFiberProps } from '../../react-dom-bindings/src/client/ReactDOMComponentTree.js';
import { setInitialProperties } from './ReactDOMComponent.js';
import { HostComponent, HostPortal, HostText } from '../../react-reconciler/ReactWorkTags.js';
import { setTextContent } from './setTextContent';
import { COMMENT_NODE } from '../../shared/HTMLNodeType.js';

export function shouldSetTextContent(type, props) {
  return (
    type === 'textarea' ||
    type === 'noscript' ||
    typeof props.children === 'string' ||
    typeof props.children === 'number' ||
    (typeof props.dangerouslySetInnerHTML === 'object' &&
      props.dangerouslySetInnerHTML !== null &&
      props.dangerouslySetInnerHTML.__html != null)
  );
}

export function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
  const dom = document.createElement(type);
  if (type === 'select') {
    if (props.multiple) {
      dom.multiple = true;
    } else if (props.size) {
      // Setting a size greater than 1 causes a select to behave like `multiple=true`, where
      // it is possible that no option is selected.
      //
      // This is only necessary when a select in "single selection mode".
      dom.size = props.size;
    }
  }

  precacheFiberNode(internalInstanceHandle, dom);
  updateFiberProps(dom, props);

  return dom;
}

export function appendAllChildren(parent, wip, needsVisibilityToggle, isHidden) {
  const node = wip.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.tag === HostPortal) {
      
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === wip) return;

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finalizeInitialChildren(domElement, type, props, rootContainerInstance) {
  // TODO: Set initial properties to domElement, including event handlers
  setInitialProperties(domElement, type, props, rootContainerInstance);

  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;
    case 'img':
      return true;
    default:
      return false;
  }
}

export function resetTextContent(domElement) {
  setTextContent(domElement, '');
}

export function insertBefore(parent, child, beforeChild) {
  parent.insertBefore(child, beforeChild);
}

export function appendChild(parent, child) {
  parent.appendChild(child);
}

export function insertInContainerBefore(container, child, beforeChild) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.insertBefore(child, beforeChild);
  } else {
    container.insertBefore(child, beforeChild);
  }
}

export function appendChildToContainer(container, child) {
  let parent;
  if (container.nodeType === COMMENT_NODE) {
    parent = container.parentNode;
    parent.insertBefore(child, container);
  } else {
    parent = container;
    parent.appendChild(child);
  }
}