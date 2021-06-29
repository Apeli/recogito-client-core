import React, { useState } from 'react';
import TimeAgo from 'timeago-react';
import DropdownMenu from './DropdownMenu';
import TextEntryField from './TextEntryField';
import PurposeSelect from './PurposeSelect';
import { ChevronDownIcon } from '../../../Icons';
import i18n from '../../../i18n';

/** A single comment inside the CommentWidget **/
const Comment = props => {

  const [ setIsEditable ] = useState(false);
  const [ isMenuVisible, setIsMenuVisible ] = useState(false);

  console.log("Comment", isEditable, props.readOnly);

  const isEditable = props.readOnly != true;

  const onMakeEditable = _ => {
    setIsEditable(true);
    setIsMenuVisible(false);
    console.log("Comment#2", isEditable, props.readOnly);
  }

  const onDelete = _ => {
    props.onDelete(props.body);
    setIsMenuVisible(false); 
  }

  const onUpdateComment = evt =>
    props.onUpdate(props.body, { ...props.body, value: evt.target.value });

  const onChangePurpose = evt =>
    props.onUpdate(props.body, { ...props.body, purpose: evt.value });

  const timestamp = props.body.modified || props.body.created;

  const creatorInfo = props.body.creator && 
    <div className="r6o-lastmodified">
      <span className="r6o-lastmodified-by">{props.body.creator.name || props.body.creator.id}</span>
      { props.body.created && 
        <span className="r6o-lastmodified-at">
          <TimeAgo 
            datetime={props.env.toClientTime(timestamp)}
            locale={i18n.locale()} />
        </span> 
      }
    </div>
  
  return props.readOnly ? (
    <div className="r6o-widget comment">
      <div className="r6o-readonly-comment">{props.body.value}</div>
      { creatorInfo }
    </div>
  ) : (
    <div className={ isEditable ? "r6o-widget comment editable" : "r6o-widget comment"}>
      <TextEntryField 
        editable={isEditable}
        content={props.body.value} 
        onChange={onUpdateComment} 
        onSaveAndClose={props.onSaveAndClose}
      />
      { !isEditable && creatorInfo }

      { props.purposeSelector &&
        <PurposeSelect
            editable={isEditable}
            content={props.body.purpose} 
            onChange={onChangePurpose} 
            onSaveAndClose={props.onSaveAndClose}
          /> } 
          
      
    </div>
  )

}

export default Comment;