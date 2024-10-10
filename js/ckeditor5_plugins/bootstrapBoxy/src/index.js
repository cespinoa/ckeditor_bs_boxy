import { Plugin } from "ckeditor5/src/core";
import BootstrapBoxyEditing from "./editing";
import BootstrapBoxyUi from "./ui";
import BootstrapBoxyToolbar from "./toolbar";

class BootstrapBoxy extends Plugin {
  /**
   * @inheritdoc
   */
  static get requires() {
    return [BootstrapBoxyEditing, BootstrapBoxyUi, BootstrapBoxyToolbar];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return "BootstrapBoxy";
  }
}

export default {
  BootstrapBoxy,
};
