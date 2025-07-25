'use strict';

module.exports = {
    rules: {
        'annotation-no-unknown': true,
        'at-rule-descriptor-no-unknown': true,
        'at-rule-descriptor-value-no-unknown': true,
        'at-rule-no-deprecated': true,
        'at-rule-no-unknown': true,
        'at-rule-prelude-no-invalid': [true, { ignoreAtRules: ['media'] }],
        'block-no-empty': true,
        'comment-no-empty': true,
        'custom-property-no-missing-var-function': true,
        'declaration-block-no-duplicate-custom-properties': true,
        'declaration-block-no-duplicate-properties': [
            true,
            {
                ignore: ['consecutive-duplicates-with-different-syntaxes'],
            },
        ],
        'declaration-block-no-shorthand-property-overrides': true,
        'declaration-property-value-keyword-no-deprecated': true,
        'declaration-property-value-no-unknown': true,
        'font-family-no-duplicate-names': true,
        'font-family-no-missing-generic-family-keyword': true,
        'function-calc-no-unspaced-operator': true,
        'keyframe-block-no-duplicate-selectors': true,
        'keyframe-declaration-no-important': true,
        'media-feature-name-no-unknown': true,
        'media-feature-name-value-no-unknown': true,
        'media-query-no-invalid': true,
        'named-grid-areas-no-invalid': true,
        'no-descending-specificity': true,
        'no-duplicate-at-import-rules': true,
        'no-duplicate-selectors': true,
        'no-empty-source': true,
        'no-invalid-double-slash-comments': true,
        'no-invalid-position-at-import-rule': true,
        'no-irregular-whitespace': true,
        'property-no-unknown': true,
        'selector-anb-no-unmatchable': true,
        'selector-pseudo-class-no-unknown': true,
        'selector-pseudo-element-no-unknown': true,
        'selector-type-no-unknown': [
            true,
            {
                ignore: ['custom-elements'],
            },
        ],
        'string-no-newline': [true, { ignore: ['at-rule-preludes', 'declaration-values'] }],
        'syntax-string-no-invalid': true,
        'alpha-value-notation': [
      'percentage',
      {
        exceptProperties: [
          'opacity',
          'fill-opacity',
          'flood-opacity',
          'stop-opacity',
          'stroke-opacity',
        ],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-no-vendor-prefix': true,
    'color-function-alias-notation': 'without-alpha',
    'color-function-notation': 'modern',
    'color-hex-length': 'short',
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    'comment-whitespace-inside': 'always',
    'container-name-pattern': [
      '^(--)?([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (name) => `Expected container name "${name}" to be kebab-case`,
      },
    ],
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'custom-media-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (name) => `Expected custom media query name "${name}" to be kebab-case`,
      },
    ],
    'custom-property-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (name) => `Expected custom property name "${name}" to be kebab-case`,
      },
    ],
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-single-line-max-declarations': 1,
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'font-family-name-quotes': 'always-where-recommended',
    'function-name-case': 'lower',
    'function-url-quotes': 'always',
    'hue-degree-notation': 'angle',
    'import-notation': 'url',
    'keyframe-selector-notation': 'percentage-unless-within-keyword-only-block',
    'keyframes-name-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (name) => `Expected keyframe name "${name}" to be kebab-case`,
      },
    ],
    'layer-name-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (name) => `Expected layer name "${name}" to be kebab-case`,
      },
    ],
    'length-zero-no-unit': [
      true,
      {
        ignore: ['custom-properties'],
      },
    ],
    'lightness-notation': 'percentage',
    'media-feature-name-no-vendor-prefix': true,
    'media-feature-range-notation': 'context',
    'number-max-precision': 4,
    'property-no-vendor-prefix': true,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (selector) => `Expected class selector "${selector}" to be kebab-case`,
      },
    ],
    'selector-id-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: (selector) => `Expected id selector "${selector}" to be kebab-case`,
      },
    ],
    'selector-no-vendor-prefix': true,
    'selector-not-notation': 'complex',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-type-case': 'lower',
    'shorthand-property-no-redundant-values': true,
    'value-keyword-case': 'lower',
    'value-no-vendor-prefix': [
      true,
      {
        // `-webkit-box` is allowed as standard. See https://www.w3.org/TR/css-overflow-3/#webkit-line-clamp
        ignoreValues: ['box', 'inline-box'],
      },
    ],
    },
};
