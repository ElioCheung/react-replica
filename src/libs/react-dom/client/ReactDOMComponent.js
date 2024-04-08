import { setTextContent } from './setTextContent';

const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
const SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
const AUTOFOCUS = 'autoFocus';
const CHILDREN = 'children';
const STYLE = 'style';
const HTML = '__html';


export function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
  let props;
  switch (tag) {
    // TODO: To be realized
    // case 'dialog':
    //   listenToNonDelegatedEvent('cancel', domElement);
    //   listenToNonDelegatedEvent('close', domElement);
    //   props = rawProps;
    //   break;
    // case 'iframe':
    // case 'object':
    // case 'embed':
    //   // We listen to this event in case to ensure emulated bubble
    //   // listeners still fire for the load event.
    //   listenToNonDelegatedEvent('load', domElement);
    //   props = rawProps;
    //   break;
    // case 'video':
    // case 'audio':
    //   // We listen to these events in case to ensure emulated bubble
    //   // listeners still fire for all the media events.
    //   for (let i = 0; i < mediaEventTypes.length; i++) {
    //     listenToNonDelegatedEvent(mediaEventTypes[i], domElement);
    //   }
    //   props = rawProps;
    //   break;
    // case 'source':
    //   // We listen to this event in case to ensure emulated bubble
    //   // listeners still fire for the error event.
    //   listenToNonDelegatedEvent('error', domElement);
    //   props = rawProps;
    //   break;
    // case 'img':
    // case 'image':
    // case 'link':
    //   // We listen to these events in case to ensure emulated bubble
    //   // listeners still fire for error and load events.
    //   listenToNonDelegatedEvent('error', domElement);
    //   listenToNonDelegatedEvent('load', domElement);
    //   props = rawProps;
    //   break;
    // case 'details':
    //   // We listen to this event in case to ensure emulated bubble
    //   // listeners still fire for the toggle event.
    //   listenToNonDelegatedEvent('toggle', domElement);
    //   props = rawProps;
    //   break;
    // case 'input':
    //   ReactDOMInputInitWrapperState(domElement, rawProps);
    //   props = ReactDOMInputGetHostProps(domElement, rawProps);
    //   // We listen to this event in case to ensure emulated bubble
    //   // listeners still fire for the invalid event.
    //   listenToNonDelegatedEvent('invalid', domElement);
    //   break;
    // case 'option':
    //   ReactDOMOptionValidateProps(domElement, rawProps);
    //   props = rawProps;
    //   break;
    // case 'select':
    //   ReactDOMSelectInitWrapperState(domElement, rawProps);
    //   props = ReactDOMSelectGetHostProps(domElement, rawProps);
    //   // We listen to this event in case to ensure emulated bubble
    //   // listeners still fire for the invalid event.
    //   listenToNonDelegatedEvent('invalid', domElement);
    //   break;
    // case 'textarea':
    //   ReactDOMTextareaInitWrapperState(domElement, rawProps);
    //   props = ReactDOMTextareaGetHostProps(domElement, rawProps);
    //   // We listen to this event in case to ensure emulated bubble
    //   // listeners still fire for the invalid event.
    //   listenToNonDelegatedEvent('invalid', domElement);
    //   break;
    default:
      props = rawProps;
  }

  setInitialDOMProperties(
    tag,
    domElement,
    rootContainerElement,
    props,
    false,
  );
}


function setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag) {
  for (const propKey in props) {
    if (!props.hasOwnProperty(propKey)) {
      continue;
    }

    const prop = props[propKey];
    if (propKey === STYLE) {
      // TODO： set inline style
      // setValueForStyles(domElement, prop);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      // TODO: set innerHTML
      // const html = prop ? prop[HTML] : undefined;
      // if (html != null) {
      //   setInnerHTML(domElement, html);
      // }
    } else if (propKey === CHILDREN) {
      if (typeof prop === 'string') {
        const canSetTextContent = tag !== 'textarea' || prop !== '';
        if (canSetTextContent) {
          setTextContent(domElement, prop);
        }
      } else if (typeof prop === 'number') {
        setTextContent(domElement, String(prop));
      }
    } else if (
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING
    ) {

    } else if (propKey === AUTOFOCUS) {

    } 
    // TODO: Event handler
    // else if (registrationNameDependencies.hasOwnProperty(propKey)) {
    //   if (prop != null) {
    //     if (propKey === 'onScroll') {
    //       listenToNonDelegatedEvent('scroll', domElement);
    //     }
    //   }
    // }
    else if (prop !== null) {
      // setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag);
    }
  }
}