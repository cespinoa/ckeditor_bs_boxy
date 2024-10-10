# CK Editor Boxy

**Maintainer:** [Carlos Espino](https://www.drupal.org/u/carlos-espino)  
**Drupal.org project page:** [Bootstrap Toolbox Parallax](https://www.drupal.org/project/bt_parallax)  
**Description:** This module provides a field formatter for creating parallax image effects in Bootstrap themes.



## Overview

**CK Editor Boxy** is a module that provides a plugin for CKEditor 5. This plugin allows users to insert two nested `div` elements into their content: an outer wrapper `div` and an inner container `div`.

### Features

- **Customizable Wrapper and Container**: Users can select and apply custom styles to both the outer wrapper and the inner container.
- **Container Options**: The inner container can be configured as either a normal `container` or a `container-fluid`. This allows content on full-width pages to have elements that do not stretch the full width of the screen.
- **Integration with Bootstrap**: This module is designed to work seamlessly with the Bootstrap framework, making it ideal for Bootstrap-based themes.

## Requirements

- **Bootstrap Toolbox**: The CK Editor Boxy module depends on the [Bootstrap Toolbox](https://www.drupal.org/project/bootstrap_toolbox) module. Make sure it is installed and enabled before using CK Editor Boxy.

## Installation

1. Download and install the **CK Editor Boxy** module from [Drupal.org](https://www.drupal.org/project/ckeditor_bs_boxy) or via Composer:

    ```bash
    composer require drupal/ckeditor_bs_boxy
    ```

2. Enable the module:

    ```bash
    drush en ckeditor_bs_boxy
    ```

3. Ensure that the **Bootstrap Toolbox** module is installed and enabled.

4. Configure the plugin in the CKEditor settings under **Configuration** > **Content authoring** > **CKEditor**.

## Configuration

1. Navigate to **Configuration** > **Content authoring** > **CKEditor** and select the editor profile where you want to enable the CK Editor Boxy plugin.
2. Drag the **Boxy** button into the active toolbar.
3. Configure the styles and options for the wrapper and container as needed.

## Usage

Once configured, you can use the **Boxy** button in the CKEditor toolbar to insert a custom container. Customize the styles of the outer and inner `div` elements, and choose whether the container should be fluid or standard.

## Customization

The styles applied to the wrapper and container `div` elements can be fully customized using the options provided in the CKEditor plugin interface.


## Maintainers

- **[Carlos Espino](https://www.drupal.org/u/tu-usuario)** - Initial development and ongoing maintenance.


## License

This project is licensed under the GPLv2 or later.

## Contributing

Contributions are welcome! Please submit issues and patches via the [project page](https://www.drupal.org/project/bt_parallax).
