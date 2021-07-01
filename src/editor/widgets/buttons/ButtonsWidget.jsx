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
            style: "highlight",
        },
        {
            title: "pilkku",
            color: "rgba(230, 120, 57, 0.62)",
            main: true,
            style: "highlight",
        },
        {
            title: "alkukirjain",
            color: "rgba(60, 0, 110, 0.47)",
            main: true,
            style: "highlight",
        },
        {
            title: "yhdyssana",
            color: "rgba(204, 255, 20, 0.47)",
            main: true,
            style: "highlight",
        },

        {
            title: "pronominien käyttö",
            color: "rgba(0, 161, 176, 0.47)",
            main: true,
            style: "highlight",
        },

        {
            title: "omistusliite",
            color: "rgba(255, 140, 0, 0.47)",
            main: true,
            style: "highlight",
        },
        {
            title: "oikeinkirjoitus",
            color: "rgba(27, 200, 22, 0.47)",
            main: true,
            style: "highlight",
        },
        {
            title: "lause-/virkerakenne",
            color: "rgba(27, 200, 22, 0.47)",
            main: true,
            style: "highlight",
        },
        {
            title: "verbimuoto",
            color: "rgba(173, 121, 121, 0.47)",
            main: true,
            style: "highlight",
        },
        {
            title: "sijamuotojen käyttö",
            color: "rgba(173, 148, 121, 0.47)",
            main: true,
            style: "highlight",
        },
        {
            title: "sanan tai ilmauksen valinta",
            color: "rgba(220, 227, 23, 0.47)",
            main: true,
            style: "highlight",
        },
        {
            title: "viittaustekniikka",
            color: "rgba(112, 45, 86, 0.47)",
            main: true,
            style: "highlight",
        },
    ];

    const userAnnotations = localStorage.getItem("user-annotations") ? JSON.parse(localStorage.getItem("user-annotations")) : [];
    const allMarkers = [...markerStyles, ...userAnnotations];

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
            { type: 'TextualBody', value: marker.style ? marker.style : "highlight", purpose: 'styling' },
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
        selectMarker(marker);
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
        setSelectedColor(color);
    }

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    }

    const saveMarkerStyle = () => {
        const obj = {
            title: markerTitle,
            color: selectedColor,
            style: markerStyle,
        };

        const newList = [...markerList, obj]
        setMarkerList(newList);
        
        let list = localStorage.getItem("user-annotations");
        if (list) {
            list = JSON.parse(list);
            list.push(obj)
        } else {
            list = [obj];
        }

        localStorage.setItem("user-annotations", JSON.stringify(list));

    }

    const removeMarker = (e, marker) => {

        e.stopPropagation();

        let list = localStorage.getItem("user-annotations");
        list = JSON.parse(list);
        list = list.filter(item => {
            return item.title != marker.title
        })

        const newList = [...markerStyles, ...list]
        setMarkerList(newList);

        localStorage.setItem("user-annotations", JSON.stringify(list));
    }

    const [showAddForm, setShowAddForm] = React.useState(false)
    const [markerList, setMarkerList] = React.useState(allMarkers);
    const [selectedColor, setSelectedColor] = React.useState(null);
    const [markerTitle, setMarkerTitle] = React.useState("");
    const [markerStyle, setMarkerStyle] = React.useState("highlight");
    

    return (
        <div className="r6o-widget r6o-button r6o-nodrag">

      { markerList.length > 0 && 
        <div class="r6o-widget-button-list">
        { markerList.map(marker => 

            <button className={tags.length && tags[0].value == marker.title ? 'selected' : 'not-selected'} type="button" onClick={() => {buttonClick(marker)}}>
              {
                !marker.main && 
                <span class="r6o-button-list-remove" onClick={(e) => {removeMarker(e, marker)}}>&times;</span>
              }
              <span class="no-pointer">{marker.title}</span>
              <span class="marker-circle no-pointer" style={'background-color:' + marker.color}></span>
            </button>

        )}
        </div>
      }

      <div class="r6o-add-new-marker">

        <button onClick={() => toggleAddForm() }type="button">Lisää oma vakiomerkintä</button>

        { showAddForm && 
        <div class="r6o-marker-form">

            <input type="text" onKeyUp={(e) => {setMarkerTitle(e.target.value)}} placeholder="Merkintä" />

          { colors.length > 0 && 
            <div class="r6o-widget-color-list">
            { colors.map(color => 

                <div class="r6o-button-color-box" className={selectedColor == color ? 'r6o-button-color-box selected' : 'r6o-button-color-box not-selected'} style={'background-color:' + color} onClick={() => {selectColor(color)}}>
                    Valitse
                </div>

            )}
            </div>
          }

          <div class="r6o-widget-marker-styles">
            <button type="button" className={markerStyle == "highlight" ? 'selected' : 'not-selected'} onClick={() => {setMarkerStyle("highlight")}}>Korostus</button>
            <button type="button" className={markerStyle == "underline" ? 'selected' : 'not-selected'} onClick={() => {setMarkerStyle("underline")}}>Alleviivaus</button>
            <button type="button" className={markerStyle == "strikethrough" ? 'selected' : 'not-selected'} onClick={() => {setMarkerStyle("strikethrough")}}>Yliviivaus</button>
          </div>

          <button type="button" class="saveNew" onClick={() => {saveMarkerStyle()}}>Tallenna merkintä</button>

        </div>
        }

      </div>

    </div>
    )

};

export default TagWidget;