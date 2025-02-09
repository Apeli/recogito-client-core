import React, { Component, createRef } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import i18n from '../../../i18n';

/** 
 * A basic text entry field, for reuse in different widgets.
 */
export default class TextEntryField extends Component {

  constructor(props) {
    super(props);

    this.element = createRef();
  }

  // CTRL+Enter functions as Ok
  onKeyDown = evt => {
    if (evt.which === 13 && evt.ctrlKey)
      this.props.onSaveAndClose();
  }

  componentDidMount() {
    if (this.props.focus && this.element.current) {
      this.element.current.focus({ preventScroll: true });
    }
  }

  render() {
    return (
      <TextareaAutosize
        ref={this.element}
        className={this.props.editable ? 'r6o-editable-text r6o-nodrag' : 'r6o-editable-text'} 
        value={this.props.content}
        placeholder={this.props.placeholder || i18n.t('Add a comment...')}
        disabled={!this.props.editable}
        onChange={this.props.onChange}
        onKeyDown={this.onKeyDown} />
    )
  }

} 