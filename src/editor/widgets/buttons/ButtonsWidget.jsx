import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

import './ButtonsWidget.scss';

const getDraftTag = existingDraft =>
    existingDraft ? existingDraft : {
        type: 'TextualBody',
        value: '',
        purpose: 'commenting',
        draft: true
    };

/** The Alfons widget **/
const TagWidget = props => {

    const markerStyles = [{
            title: "Kommentti",
            isComment: true,
            color: "rgba(230, 57, 57, 0.62)",
            main: true,
        },
        {
            title: "pilkku",
            color: "rgba(230, 120, 57, 0.62)",
            main: true,
        },
        {
            title: "alkukirjain",
            color: "rgba(60, 0, 110, 0.47)",
            main: true,
        },
        {
            title: "yhdyssana",
            color: "rgba(204, 255, 20, 0.47)",
            main: true,
        },

        {
            title: "pronominien käyttö",
            color: "rgba(0, 161, 176, 0.47)",
            main: true,
        },

        {
            title: "omistusliite",
            color: "rgba(255, 140, 0, 0.47)",
            main: true,
        },
        {
            title: "oikeinkirjoitus",
            color: "rgba(27, 200, 22, 0.47)",
            main: true,
        },
        {
            title: "lause-/virkerakenne",
            color: "rgba(27, 200, 22, 0.47)",
            main: true,
        },
        {
            title: "verbimuoto",
            color: "rgba(173, 121, 121, 0.47)",
            main: true,
        },
        {
            title: "sijamuotojen käyttö",
            color: "rgba(173, 148, 121, 0.47)",
            main: true,
        },
        {
            title: "sanan tai ilmauksen valinta",
            color: "rgba(220, 227, 23, 0.47)",
            main: true,
        },
        {
            title: "viittaustekniikka",
            color: "rgba(112, 45, 86, 0.47)",
            main: true,
        },
    ];

    const colors = [
        "rgba(50, 168, 82, 0.47)",
        "rgba(126, 209, 31, 0.47)",
        "rgba(204, 255, 20, 0.47)",
        "rgba(220, 227, 23, 0.47)",
        "rgba(121, 173, 172, 0.47)",
        "rgba(160, 166, 5, 0.47)",
        "rgba(255, 200, 0, 0.47)",
        "rgba(255, 140, 0, 0.47)",
        "rgba(255, 72, 0, 0.47)",
        "rgba(212, 0, 0, 0.47)",
        "rgba(0, 234, 255, 0.47)",
        "rgba(0, 161, 176, 0.47)",
        "rgba(0, 174, 255, 0.47)",
        "rgba(0, 72, 255, 0.47)",
        "rgba(140, 0, 255, 0.47)",
        "rgba(198, 131, 252, 0.47)",
        "rgba(154, 120, 255, 0.47)",
        "rgba(191, 0, 255, 0.47)",
        "rgba(255, 0, 238, 0.47)",
        "rgba(255, 133, 247, 0.47)",
        "rgba(255, 133, 180, 0.47)",
        "rgba(121, 173, 135, 0.47)",
        "rgba(170, 173, 121, 0.47)",
        "rgba(173, 148, 121, 0.47)",
        "rgba(173, 121, 121, 0.47)",
        "rgba(121, 144, 173, 0.47)",
        "rgba(138, 121, 173, 0.47)",
        "rgba(173, 121, 151, 0.47)",
        "rgba(45, 112, 110, 0.47)",
        "rgba(112, 45, 86, 0.47)",
    ];


    // All tags (draft + non-draft)
    const all = props.annotation ?
        props.annotation.bodies.filter(b => b.type === 'TextualBody' && b.purpose === 'commenting') : [];

    // Last draft tag goes into the input field
    const draftTag = getDraftTag(all.slice().reverse().find(b => b.draft));

    // All except draft tag
    const tags = all.filter(b => b != draftTag);

    const [showDelete, setShowDelete] = useState(false);

    const selectMarker = (marker) => {

        const prev = draftTag.value.trim();
        const updated = marker.title;

        const doUpdate = props.annotation.underlying.body.length > 0;
        let tagToUpdate = null;
        if (doUpdate) {
            tagToUpdate = props.annotation.underlying.body;
        }

        const bodies = [
            { type: 'TextualBody', value: marker.title, purpose: 'commenting' },
            { type: 'TextualBody', value: marker.color, purpose: 'highlighting' },
        ];

        let saveOnSelect = true;
        if (marker.title.toLowerCase() === "kommentti") {
            let ta = document.querySelectorAll(".r6o-editable-text")[0];
            ta.focus();
            saveOnSelect = false;
        }

        if (!doUpdate && updated.length > 0) {
            props.onAppendBody(bodies, saveOnSelect);
        } else {
            props.onUpdateBody(tagToUpdate, bodies, saveOnSelect);
        }

    }

    const buttonClick = marker => {
        console.log("MARKER", marker);
        selectMarker(marker);
        selectedMarker = marker;
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
        if (draftTag.value.trim().length === 0) {
            props.onAppendBody(toSubmit);
        } else {
            props.onUpdateBody(draftTag, toSubmit);
        }
    }

    const selectColor = color => {
        selectedColor = color;
        alert(selectedColor);
    }

    const toggleAddForm = () => {
        props.showAddForm = !props.showAddForm;
    }

    let selectedMarker = null;
    props.showAddForm = false;
    let markerTitle = "";
    let selectedColor;

    return (
        <div className="r6o-widget r6o-button r6o-nodrag">

      { markerStyles.length > 0 && 
        <div class="r6o-widget-button-list">
        { markerStyles.map(marker => 

            <button className={tags.length && tags[0].value == marker.title ? 'selected' : 'not-selected'} type="button" onClick={() => {buttonClick(marker)}}>
              <span>{marker.title}</span>
              <span class="marker-circle" style={'background-color:' + marker.color}></span>
            </button>

        )}
        </div>
      }

      <div class="r6o-add-new-marker">

        <button onClick={() => toggleAddForm() }type="button">Lisää oma tyyli</button>

        { props.showAddForm && 
        <div class="r6o-marker-form">

            <input type="text" value={markerTitle} placeholder="Merkintä" />

          { colors.length > 0 && 
            <div class="r6o-widget-color-list">
            { colors.map(color => 

                <div class="r6o-button-color-box" style={'background-color:' + color} onClick={() => {selectColor(color)}}>
                    Valitse
                </div>

            )}
            </div>
          }

        </div>
        }

      </div>

    </div>
    )

};

export default TagWidget;