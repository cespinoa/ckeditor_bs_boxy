/**
 * @file registers the boxy toolbar button and binds functionality to it.
 */
import { Plugin } from "ckeditor5/src/core";
import { ButtonView } from "ckeditor5/src/ui";
import icon from "../../../../icons/boxy.svg";

export default class BootstrapBoxyUI extends Plugin {
  init() {
    const { editor } = this;
    const options = editor.config.get("bootstrapBoxy");
    if (!options) {
      return;
    }

    const { dialogURL, openDialog, dialogSettings = {} } = options;

    if (!dialogURL || typeof openDialog !== "function") {
      return;
    }

    // This will register the boxy toolbar button.
    editor.ui.componentFactory.add("bootstrapBoxy", (locale) => {
      const command = editor.commands.get("insertBootstrapBoxy");
      const buttonView = new ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: editor.t("Bootstrap Boxy"),
        icon,
        tooltip: true,
      });

      // Bind the state of the button to the command.
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");
      this.listenTo(buttonView, "execute", () => {
        openDialog(
          dialogURL,
          ({ settings }) => {
            editor.execute("insertBootstrapBoxy", settings);
          },
          dialogSettings
        );
      });

      return buttonView;
    });
  }
}
