<?php

namespace Drupal\ckeditor_bs_boxy\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefinition;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Url;
use Drupal\editor\EditorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Bootstrap Boxy Config for CKE5.
 */
class BsBoxy extends CKEditor5PluginDefault implements ContainerFactoryPluginInterface, CKEditor5PluginConfigurableInterface {

  use CKEditor5PluginConfigurableTrait;

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected ConfigFactoryInterface $configFactory;

  /**
   * {@inheritDoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('config.factory'));
  }

  /**
   * Boxy Config constructor.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param \Drupal\ckeditor5\Plugin\CKEditor5PluginDefinition $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $configFactory
   *   The config factory.
   */
  public function __construct(array $configuration, string $plugin_id, CKEditor5PluginDefinition $plugin_definition, ConfigFactoryInterface $configFactory) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->configFactory = $configFactory;
  }

  /**
   * {@inheritDoc}
   */
  public function defaultConfiguration() {
    return [];
  }

/**
   * {@inheritdoc}
   */
  public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
    $dynamicPluginConfig = $static_plugin_config;
    
    $filter_format = $editor->getFilterFormat();
    
    if ($filter_format !== null) {
      $dynamicPluginConfig['bootstrapBoxy']['dialogURL'] = Url::fromRoute('ckeditor_bs_boxy.dialog')
        ->setRouteParameter('editor', $filter_format->id())
        ->toString(TRUE)
        ->getGeneratedUrl();
    }

    $dynamicPluginConfig['bootstrapBoxy'] = array_merge(
      $dynamicPluginConfig['bootstrapBoxy'],
      $this->getConfiguration()
    );

    return $dynamicPluginConfig;
  }


  /**
   * {@inheritDoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {



    $form['use_cdn'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use BS CDN'),
      '#description' => $this->t('If your theme utilizing CKEditor does not include bootstrap boxy classes, or pass them via "ckeditor_stylesheets" then you can include it here. This will ONLY include it for ckeditor.'),
      '#default_value' => $this->configuration['use_cdn'],
    ];

    $form['cdn_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('CDN URL'),
      '#description' => $this->t('The URL to your Bootstrap CDN, default is for boxy-only.'),
      '#default_value' => $this->configuration['cdn_url'],
    ];
    

    return $form;
  }

  /**
   * {@inheritDoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $form_state->setValue('use_cdn', (bool) $form_state->getValue('use_cdn'));
    $form_state->setValue('cdn_url', (string) $form_state->getValue('cdn_url'));
  }

  /**
   * {@inheritDoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['use_cdn'] = $form_state->getValue('use_cdn');
    $this->configuration['cdn_url'] = $form_state->getValue('cdn_url');
  }

}
