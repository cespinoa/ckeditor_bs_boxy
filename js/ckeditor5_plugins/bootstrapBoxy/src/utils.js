import { isWidget } from "ckeditor5/src/widget";

/**
 * Checks if the provided model element is `bsBoxy`.
 *
 * @param {module:engine/model/element~Element} modelElement
 *   The model element to be checked.
 * @return {boolean}
 *   A boolean indicating if the element is a bsBoxy element.
 *
 * @private
 */
export function isBootstrapBoxy(modelElement) {
  return !!modelElement && modelElement.is("element", "bsBoxy");
}

/**
 * Checks if view element is <bsBoxy> element.
 *
 * @param {module:engine/view/element~Element} viewElement
 *   The view element.
 * @return {boolean}
 *   A boolean indicating if the element is a <bsBoxy> element.
 *
 * @private
 */
export function isBootstrapBoxyWidget(viewElement) {
  return isWidget(viewElement) && !!viewElement.getCustomProperty("bsBoxy");
}

/**
 * Gets `bsBoxy` element from selection.
 *
 * @param {module:engine/model/selection~Selection|module:engine/model/documentselection~DocumentSelection} selection
 *   The current selection.
 * @return {module:engine/model/element~Element|null}
 *   The `bsBoxy` element which could be either the current selected an
 *   ancestor of the selection. Returns null if the selection has no Boxy
 *   element.
 *
 * @private
 */
export function getClosestSelectedBootstrapBoxyElement(selection) {
  const selectedElement = selection.getSelectedElement();

  return isBootstrapBoxy(selectedElement)
    ? selectedElement
    : selection.getFirstPosition().findAncestor("bsBoxy");
}

/**
 * Gets selected BsBoxy widget if only BsBoxy is currently selected.
 *
 * @param {module:engine/model/selection~Selection} selection
 *   The current selection.
 * @return {module:engine/view/element~Element|null}
 *   The currently selected Boxy widget or null.
 *
 * @private
 */
export function getClosestSelectedBootstrapBoxyWidget(selection) {
  const viewElement = selection.getSelectedElement();
  if (viewElement && isBootstrapBoxyWidget(viewElement)) {
    return viewElement;
  }

  // Perhaps nothing is selected.
  if (selection.getFirstPosition() === null) {
    return null;
  }

  let { parent } = selection.getFirstPosition();
  while (parent) {
    if (parent.is("element") && isBootstrapBoxyWidget(parent)) {
      return parent;
    }
    parent = parent.parent;
  }
  return null;
}

/**
 * Converts a boxy into a settings object.
 *
 * When we create or modify the editor, we save the variables of interest
 * in bsBoxyContainer as data Attributes
 *
 * @param {module:engine/view/element~Element|null} boxy
 *   The current boxy.
 * @return {{}}
 *   The settings.
 */
export function convertBoxyToSettings(bsBoxy) {
  const settings = {};

  const bsBoxyContainer = bsBoxy.getChild(0);

  settings.wrapperStyleId = bsBoxyContainer.getAttribute("data-wrapper-style-id");
  settings.containerClass = bsBoxyContainer.getAttribute("data-container-class");
  settings.containerStyleId = bsBoxyContainer.getAttribute("data-container-style-id");

  return settings;
}
