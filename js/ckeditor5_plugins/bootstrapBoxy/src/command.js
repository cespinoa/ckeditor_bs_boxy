import { Command } from "ckeditor5/src/core";
import {
  getClosestSelectedBootstrapBoxyElement,
  isBootstrapBoxy,
} from "./utils";

/**
 * Creates a new BS Boxy
 *
 * @param {module:engine/model/writer~Writer} writer
 *   The model writer.
 * @param {{}} settings
 *   The settings
 * @return {*}
 *   The boxy.
 */
function createBsBoxy(writer, settings) {

    const boxyAttributes = {
        class: "ckeditor-bsboxy clearfix container-fluid" + (settings.wrapperStyle || '')
    };
    const bsBoxy = writer.createElement("bsBoxy", boxyAttributes);

    const containerAttributes = {
        class: 'ckeditor-bsboxy-container ' + settings.containerClass + ' ' + settings.containerStyle,
        'data-wrapper-style-id': settings.wrapperStyleId,
        'data-container-class': settings.containerClass,
        'data-container-style-id': settings.containerStyleId
    };
    const bsBoxyContainer = writer.createElement("bsBoxyContainer", containerAttributes);

    const contentAttributes = {
        class: 'ckeditor-bsboxy-content'
    };
    const bsBoxyContent = writer.createElement('bsBoxyContent', contentAttributes);
    const bsBoxyParagraph = writer.createElement("paragraph");
    writer.insertText(`Content`, bsBoxyParagraph);
    writer.append(bsBoxyParagraph, bsBoxyContent)

    writer.append(bsBoxyContent, bsBoxyContainer);
    writer.append(bsBoxyContainer, bsBoxy);

    return bsBoxy;
}


/**
 * Updates an existing BS Boxy
 *
 * @param {module:engine/model/writer~Writer} writer
 *   The model writer.
 * @param {module:engine/view/element~Element|null} existingBoxy
 * @param {{}} settings
 *   The settings
 */
function updateExisting(writer, existingBoxy, settings) {
  // Boxy.
  
  const boxyAttributes = { class: "ckeditor-bsboxy clearfix container-fluid" + settings.wrapperStyle };
  writer.setAttributes(boxyAttributes, existingBoxy);

  const bsBoxyContainer = existingBoxy.getChild(0);
  
  const containerAttributes = {
    class: 'ckeditor-bsboxy-container ' + settings.containerClass + ' ' + settings.containerStyle,
    'data-wrapper-style-id': settings.wrapperStyleId,
    'data-container-class': settings.containerClass,
    'data-container-style-id': settings.containerStyleId
  };
  
  writer.setAttributes(containerAttributes, bsBoxyContainer);
}

/**
 * Inserts a boxy or updates a new one.
 */
export default class InsertBootstrapBoxyCommand extends Command {
  execute(settings) {
    const { model } = this.editor;
    const existingBoxy = getClosestSelectedBootstrapBoxyElement(
      model.document.selection
    );

    model.change((writer) => {
      if (existingBoxy) {
        updateExisting(writer, existingBoxy, settings);
      } else {
        model.insertContent(createBsBoxy(writer, settings));
      }
    });
  }

  refresh() {
    const { model } = this.editor;
    const { selection } = model.document;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      "bsBoxy"
    );
    this.isEnabled = allowedIn !== null;
  }
}
