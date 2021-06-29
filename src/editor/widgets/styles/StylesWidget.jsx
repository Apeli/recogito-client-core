import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

import './StylesWidget.scss';

const getDraftTag = existingDraft =>
    existingDraft ? existingDraft : {
        type: 'TextualBody',
        value: '',
        purpose: 'visualization',
        draft: true
    };

/** The Alfons widget **/
const StylesWidget = props => {

    const styles = [{
            title: "Korostus",
            type: "highlight",
        },
        {
            title: "Ympyröinti",
            type: "circle",
        },
        {
            title: "Alleviivaus",
            type: "underline",
        },
        {
            title: "Yliviivaus",
            type: "strikethrough",
        },
    ];

    // All tags (draft + non-draft)
    const all = props.annotation ?
        props.annotation.bodies.filter(b => b.type === 'TextualBody' && b.purpose === 'visualization') : [];

    // Last draft tag goes into the input field
    const draftTag = getDraftTag(all.slice().reverse().find(b => b.draft));

    // All except draft tag
    const tags = all.filter(b => b != draftTag);

    const [showDelete, setShowDelete] = useState(false);

    const selectStyle = (style) => {

        const prev = draftTag.value.trim();
        const updated = style.type.trim();

        if (prev.length === 0 && updated.length > 0) {
            props.onAppendBody({ ...draftTag, value: updated });
        } else if (prev.length > 0 && updated.length === 0) {
            props.onRemoveBody(draftTag);
        } else {
            props.onUpdateBody(draftTag, { ...draftTag, value: updated });
        }


    }

    const buttonClick = style => {
        selectStyle(style);
    }

    const toggle = tag => _ => {
        if (showDelete === tag) // Removes delete button
            setShowDelete(false);
        else
            setShowDelete(tag); // Sets delete button on a different tag
    }

    const onDelete = tag => evt => {
        evt.stopPropagation();
        props.onRemoveBody(tag);
    }

    const onDraftChange = value => {
        const prev = draftTag.value.trim();
        const updated = value.trim();

        if (prev.length === 0 && updated.length > 0) {
            props.onAppendBody({ ...draftTag, value: updated });
        } else if (prev.length > 0 && updated.length === 0) {
            props.onRemoveBody(draftTag);
        } else {
            props.onUpdateBody(draftTag, { ...draftTag, value: updated });
        }
    }

    const onSubmit = tag => {
        const { draft, ...toSubmit } = { ...draftTag, value: tag };

        console.log("onSubmit", toSubmit, selectedMarker);

        if (draftTag.value.trim().length === 0) {
            props.onAppendBody(toSubmit);
        } else {
            props.onUpdateBody(draftTag, toSubmit);
        }
    }

    let selectedMarker = null;

    return (
        <div className="r6o-widget r6o-button r6o-nodrag">

      { styles.length > 0 && 
        <div class="button-list">
        { styles.map(marker => 

            <button className={tags.length && tags[0].value == marker.title ? 'selected' : 'not-selected'} type="button" onClick={() => {buttonClick(marker)}}>
              <span>{marker.title}</span>
            </button>

        )}
        </div>
      }

      {/*{ tags.length > 0 &&
        <ul className="r6o-taglist">
          { tags.map(tag =>
            <li key={tag.value} onClick={toggle(tag.value)}>
              <span className="r6o-label">{tag.value}</span>

              {!props.readOnly &&
                <CSSTransition in={showDelete === tag.value} timeout={200} classNames="r6o-delete">
                  <span className="r6o-delete-wrapper" onClick={onDelete(tag)}>
                    <span className="r6o-delete">
                      <CloseIcon width={12} />
                    </span>
                  </span>
                </CSSTransition>
              }
            </li>
          )}
        </ul>
      }*/}
    </div>
    )

};

export default StylesWidget;