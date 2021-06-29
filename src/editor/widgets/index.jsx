import React from 'react';
import ReactDOM from 'react-dom';
import CommentWidget from './comment/CommentWidget'
import TagWidget from './tag/TagWidget';
import ButtonsWidget from './buttons/ButtonsWidget';
import StylesWidget from './buttons/StylesWidget';
import WrappedWidget from './WrappedWidget';

/**
 * We'll add React and ReactDOM to the global window, so that 
 * plugins can use it without re-bundling. Also,
 * without this, hooks won't work!
 */
window.React = React;
window.ReactDOM = ReactDOM;

/** Standard widgets included by default **/
const BUILTIN_WIDGETS = {
  COMMENT: CommentWidget,
  BUTTONS: ButtonsWidget,
  STYLES: StylesWidget
};

/** Defaults to use if there's no overrides from the host app **/
export const DEFAULT_WIDGETS = [
  <CommentWidget />, <ButtonsWidget />, <StylesWidget />
]

// https://stackoverflow.com/questions/33199959/how-to-detect-a-react-component-vs-a-react-element
const isReactComponent = component => {  

  const isClassComponent = component => 
    typeof component === 'function' && !!component.prototype?.isReactComponent;
  
  const isFunctionComponent = component =>
    // There's no good way to match function components (they are just functions), but
    // this RegEx pattern should catch most minified and unminified variants, e.g.:
    // - return React.createElement('div', {
    // - return pe("div",{
    typeof component === 'function' && ( 
      String(component).match(/return .+\(['|"].+['|"],\s*\{/g) ||
      String(component).match(/return .+preact_compat/) ||
      String(component).match(/return .+\.createElement/g)
    );
      
  return isClassComponent(component) || isFunctionComponent(component);
}


/**
 * There are multiple ways in which users can specify widgets:
 * 
 * 1. string -> name of a built-in widget
 * 2. function -> custom JS plugin
 * 3. React component custom JSX plugin
 * 4. an object in the following form: { widget: (...), args }
 * 
 * In case of 4, the 'widget' property may have the same allowed 
 * values (string, function, React component). The remaining parameters
 * are treated as widget configuration, and are passed along to the
 * widget.
 */
export const getWidget = arg => {

  const instantiate = (widget, config) => {
    if (typeof widget === 'string' || widget instanceof String) {
      return React.createElement(BUILTIN_WIDGETS[widget], config);
    } else if (isReactComponent(widget)) {
      return React.createElement(widget, config);
    } else if (typeof widget === 'function' || widget instanceof Function) {
      return <WrappedWidget widget={widget} config={config} />
    } else {
      throw `${widget} is not a valid plugin`
    }
  }

  // First, check 'top-level' vs. 'nested object' case
  if (arg.widget) {
    const { widget, ...config } = arg;
    return instantiate(widget, config);
  } else {
    // No object with args -> instantiate arg directly
    return instantiate(arg);
  }
}