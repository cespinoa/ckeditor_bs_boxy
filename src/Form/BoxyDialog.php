<?php

namespace Drupal\ckeditor_bs_boxy\Form;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\editor\Ajax\EditorDialogSave;
use Drupal\editor\EditorInterface;
use Drupal\editor\Entity\Editor;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\bootstrap_toolbox\UtilityServiceInterface;

use Symfony\Component\HttpFoundation\Request;

/**
 * Creates a boxy dialog form for use in CKEditor.
 *
 * @package Drupal\ckeditor_bs_boxy\Form
 */
class BoxyDialog extends FormBase {

  /**
   * The utility service.
   *
   * @var \Drupal\bootstrap_toolbox\UtilityServiceInterface
   */
  protected $utilityService;

  /**
   * BoxyDialog class initialize..
   *
   * @param \Drupal\bootstrap_toolbox\UtilityServiceInterface $utility_service
   *   The utility service.
   */
  public function __construct(UtilityServiceInterface $utility_service) {
    $this->utilityService = $utility_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('bootstrap_toolbox.utility_service')
    );
  }

  /**
   * {@inheritDoc}
   */
  public function getFormId() {
    return 'ckeditor_bs_boxy_dialog';
  }

  /**
   * {@inheritDoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, Editor $editor = NULL) {
    $form['#attached']['library'][] = 'editor/drupal.editor.dialog';
    $form['#attached']['library'][] = 'ckeditor_bs_boxy/dialog';

    $input = $form_state->getUserInput();
    
    if (!empty($input['editor_object'])) {
        $settings = $input['editor_object'];
    } else {
        $settings = [
          'wrapperStyleId' => 'none',
          'containerClass' => 'container',
          'containerStyleId' => 'none',
        ];
    }
    
    
    $form['wrapper_style'] = [
      '#type' => 'select',
      '#title' => $this->t('Main container style'),
      '#options' => $this->utilityService->getScopeListFiltered(['text_area_formatters','wrapper_formatters']),
      '#empty_option' => 'None',
      '#default_value' => $settings['wrapperStyleId'],
    ];

    $form['container_class'] = [
      '#type' => 'select',
      '#title' => $this->t('Inner container class'),
      '#options' => [
        'container' => $this->t('Normal container'),
        'container-fluid' => $this->t('Edge to edge container'),
      ],
      '#default_value' => $settings['containerClass'],
    ];

    $form['container_style'] = [
      '#type' => 'select',
      '#title' => $this->t('Inner container style'),
      '#options' => $this->utilityService->getScopeListFiltered(['text_area_formatters']),
      '#empty_option' => 'None',
      '#default_value' => $settings['containerStyleId'],
    ];

    $form_state->set('styles', $this->utilityService->getScopeClassesListFiltered(['text_area_formatters','wrapper_formatters']));
    

    $form['actions']['send'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save'),
      '#button_type' => 'primary',
      // No regular submit-handler. This form only works via JavaScript.
      '#submit' => [],
      '#ajax' => [
        'callback' => '::submitForm',
        'event' => 'click',
      ],
      '#attributes' => [
        'class' => [
          'js-button-send',
        ],
      ],
    ];
    return $form;
  }
 
  /**
   * {@inheritDoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $response = new AjaxResponse();
    
    $styles = $form_state->get('styles');
    
    $settings = [
      'wrapperStyle' => $styles[$form_state->getValue('wrapper_style')] ?? '',
      'wrapperStyleId' => $form_state->getValue('wrapper_style') ?? '',
      'containerClass' => $form_state->getValue('container_class') ?? '',
      'containerStyle' => $styles[$form_state->getValue('container_style')] ?? '',
      'containerStyleId' => $form_state->getValue('container_style') ?? '',
    ];
    
    $values = ['settings' => $settings];

    $response->addCommand(new EditorDialogSave($values));
    
    $response->addCommand(new CloseModalDialogCommand());

    return $response;
  }

}
