import { Plugin } from "ckeditor5/src/core";
import { toWidget, toWidgetEditable } from "ckeditor5/src/widget";
import { Widget } from 'ckeditor5/src/widget';
import InsertBootstrapBoxyCommand from "./command";

/**
 * CKEditor 5 plugins do not work directly with the DOM. They are defined as
 * plugin-specific data models that are then converted to markup that
 * is inserted in the DOM.
 *
 * CKEditor 5 internally interacts with boxy as this model:
 * <bsBoxy>
 *    <bsBoxyContainer>
 *      <bsBoxyContent></bsBoxyContent>
 *    </boxyContainer>
 * </bsBoxy>
 *
 * Which is converted for the browser/user as this markup
 * <div class="ckeditor-bsboxy">
 *   <div class="ckeditor-bsboxy-container">
 *    <div class="ckeditor-bsboxy-content"></div
 *   </div>
 * </div>
 *
 * This file has the logic for defining the boxy model, and for how it is
 * converted to standard DOM markup.
 */


/**
 * Defines the editing commands for BS Boxy.
 */
export default class BootstrapBoxyEditing extends Plugin {
  /**
   * @inheritdoc
   */
  static get requires() {
    return [Widget];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return "BootstrapBoxyEditing";
  }

  /**
   * @inheritdoc
   */
  constructor(editor) {
    super(editor);
    this.attrs = {
      class: "class",
      "data-wrapper-style-id": "data-wrapper-style-id",
      "data-container-class": "data-container-class",
      "data-container-style-id": "data-container-style-id",
    };
  }
  
  /**
   * @inheritdoc
   */
  init() {
    const options = this.editor.config.get("bootstrapBoxy");
    if (!options) {
      return;
    }
    
    this._defineSchema();
    this._defineConverters();
    this._defineCommands();
  }

  /**
   * This registers the structure that will be seen by CKEditor 5 as
   * <bsBoxy>
   *    <bsBoxyContainer>
   *      <bsBoxyContent></bsBoxyContent>
   *    </boxyContainer>
   * </bsBoxy>
   *
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('bsBoxy', {
      allowWhere: "$block",
      isLimit: true,
      isObject: true,
      allowAttributes: ["class"],
    });

    schema.register('bsBoxyContainer', {
      isLimit: true,
      allowIn: 'bsBoxy',
      isBlock: true,
      allowAttributes: Object.keys(this.attrs),
    });

    schema.register('bsBoxyContent', {
      allowIn: 'bsBoxyContainer',
      isInline: true,
      allowContentOf: '$root',  
      allowAttributes: ["class"],
    });

  }
  

  /**
   * Converters determine how CKEditor 5 models are converted into markup and
   * vice-versa.
   */
  _defineConverters() {
    const { conversion } = this.editor;

    conversion.for('upcast').elementToElement({
      model: 'bsBoxy',
      view: {
        name: 'div',
        classes: 'ckeditor-bsboxy'
      }
    });

    conversion.for("downcast").elementToElement({
      model: "bsBoxy",
      view: (modelElement, { writer }) => {
        const container = writer.createContainerElement("div", {
          class: "ckeditor-bsboxy",
        });
        writer.setCustomProperty("bsBoxy", true, container);
        return toWidget(container, writer, { label: "BS Boxy" });
      },
    });

    
    conversion.for("upcast").elementToElement({
      view: {
        name: "div",
        classes: ["ckeditor-bsboxy-container"],
      },
      converterPriority: "high",
      model: (viewElement, {writer}) => {
        return writer.createElement("bsBoxyContainer", {
          class: viewElement.getAttribute('class') || "ckeditor-bsboxy-container",
        });
      },
    });

    conversion.for("downcast").elementToElement({
      model: "bsBoxyContainer",
      view: (modelElement, { writer }) => {
        const containerAttributes = {
          "class": modelElement.getAttribute('class'),
          "data-wrapper-style-id": modelElement.getAttribute("data-wrapper-style-id"),
          "data-container-class": modelElement.getAttribute("data-container-class"),
          "data-container-style-id": modelElement.getAttribute("data-container-style-id"),
        };
        const container = writer.createContainerElement("div", containerAttributes);
        writer.setCustomProperty("bsBoxyContainer", true, container);
        return toWidget(container, writer, { label: "BS Boxy Container" });
      },
    });

      
    conversion.for("upcast").elementToElement({
      model: "bsBoxyContent",
      view: {
        name: "div",
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "bsBoxyContent",
      view: (modelElement, { writer }) => {
        const element = writer.createEditableElement("div");
        writer.setCustomProperty("bsBoxyContent", true, element);
        return toWidgetEditable(element, writer);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "bsBoxyContent",
      view: {
        name: "div",
        classes: "",
      },
    });

    // Set attributeToAttribute conversion for all supported attributes.
    Object.keys(this.attrs).forEach((modelKey) => {
      const attributeMapping = {
        model: {
          key: modelKey,
          name: "bsGridRow",
        },
        view: {
          name: "div",
          key: this.attrs[modelKey],
        },
      };
      conversion.for("downcast").attributeToAttribute(attributeMapping);
      conversion.for("upcast").attributeToAttribute(attributeMapping);
    });

    conversion.attributeToAttribute({ model: "class", view: "class" });
    
  }

  /**
   * Defines the BS Boxy commands.
   *
   * @private
   */
  _defineCommands() {
    this.editor.commands.add(
      "insertBootstrapBoxy",
      new InsertBootstrapBoxyCommand(this.editor)
    );
  }
}
