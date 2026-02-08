import yaml from 'yaml';

import StyleDictionary from 'style-dictionary';
import type {
  Dictionary,
  Format,
  OutputReferences,
  Parser,
  TransformedToken,
  ValueTransform,
} from 'style-dictionary/types';
import { sortByReference, usesReferences } from 'style-dictionary/utils';

import type {
  Effect,
  StyleType,
  VariableResolvedDataType,
  VariableScope,
} from '@figma/plugin-typings/plugin-api-standalone.js';
import { parseToRgba } from 'color2k';

// --- Register Parser ---

const yamlParser: Parser = {
  name: 'yaml-parser',
  pattern: /\.yaml$/,
  parser: ({ contents }) => yaml.parse(contents),
};
StyleDictionary.registerParser(yamlParser);

// --- For Figma ---

type FigmaTokenBase = {
  name: string;
  $value: unknown;
  $description?: string;
};

/** Figma向けのトークン */
export type FigmaToken = FigmaTokenBase &
  (
    | {
        tokenType: 'variable';
        type: VariableResolvedDataType;
        name: string;
        scopes?: VariableScope[];
      }
    | {
        tokenType: 'style';
        type: StyleType;
        effectType?: Effect['type'];
      }
  );

/** 参考: https://github.com/amzn/style-dictionary/blob/v4.2.0/lib/common/formatHelpers/formattedVariables.js */
export const formattedFigmaToken = ({
  dictionary,
  outputReferences,
  usesDtcg = false,
}: {
  dictionary: Dictionary;
  outputReferences?: OutputReferences;
  usesDtcg?: boolean;
}) => {
  const tokens = dictionary.tokens;

  const allTokens = outputReferences
    ? dictionary.allTokens.toSorted(
        sortByReference(tokens, {
          unfilteredTokens: dictionary.unfilteredTokens,
          usesDtcg,
        }),
      )
    : dictionary.allTokens;

  const result = allTokens.map(
    createFigmaToken({ dictionary, outputReferences, usesDtcg }),
  );

  const [variables, styles] = result.reduce(
    (acc, token) => {
      if (!token) return acc;

      if (token.tokenType === 'variable') {
        acc[0].push(token);
      } else {
        acc[1].push(token);
      }
      return acc;
    },
    [[], []] as [FigmaToken[], FigmaToken[]],
  );

  return {
    variables,
    styles,
  };
};

const createFigmaToken =
  ({
    outputReferences,
    dictionary,
    usesDtcg,
  }: {
    outputReferences?: OutputReferences;
    dictionary: Dictionary;
    usesDtcg?: boolean;
  }) =>
  (token: TransformedToken): FigmaToken | null => {
    let figmaToken: FigmaToken | null = null;

    const type = usesDtcg ? token.$type : token.type;
    const name = token.path.join('/');
    const description = token.$description ?? token.comment;

    let value = usesDtcg ? token.$value : token.value;
    const originalValue = usesDtcg
      ? token.original.$value
      : token.original.value;

    const shouldOutputRef =
      usesReferences(originalValue) &&
      (typeof outputReferences === 'function'
        ? outputReferences(token, { dictionary, usesDtcg })
        : outputReferences);

    /*
     * 参照を残すようにする
     *
     * transform 時点でオブジェクトの構造が変わってしまっている場合は、うまく機能しないことに注意。
     *
     * 例:
     *  val: { color: { value: "#fff" } }, originalVal: { color: { value: "{color.background.primary.value}" } }
     *  => { color: { value: "{color/background/primary/value}" } }
     *
     *  val: { bgColor: { value: "#fff" } }, originalVal: { color: "{color.background.primary.value}" }
     *  => { bgColor: { value: "#fff" } }
     */
    if (shouldOutputRef) {
      const originalIsObject =
        typeof originalValue === 'object' && originalValue !== null;

      if (originalIsObject) {
        const replaceRefsRecursive = (val: any, originalVal: any) => {
          if (typeof val !== 'object' || typeof originalVal !== 'object') {
            return;
          }

          for (const key in val) {
            if (!originalVal[key]) {
              continue;
            }

            if (typeof originalVal[key] === 'object') {
              replaceRefsRecursive(val[key], originalVal[key]);
            } else {
              if (
                typeof originalVal[key] === 'string' &&
                originalVal[key].startsWith('{')
              ) {
                val[key] = originalVal[key].replaceAll('.', '/');
              }
            }
          }
        };
        replaceRefsRecursive(value, originalValue);
      } else {
        value = originalValue.replaceAll('.', '/');
      }
    }

    if (
      type === 'color' ||
      type === 'number' ||
      type === 'dimension' ||
      type === 'fontFamily'
    ) {
      let variableType: VariableResolvedDataType = 'STRING';
      switch (type) {
        case 'color':
          variableType = 'COLOR';
          break;
        case 'number':
          variableType = 'FLOAT';
          break;
        case 'dimension':
          variableType = 'FLOAT';
          break;
        case 'fontFamily':
          variableType = 'STRING';
          break;
      }

      figmaToken = {
        tokenType: 'variable',
        type: variableType,
        name,
        $value: value,
        $description: description,
        scopes: getVariableScopes(token),
      };
    } else if (
      type === 'typography'
      // || type === 'shadow'
    ) {
      let styleType: StyleType = 'TEXT';

      switch (type) {
        case 'typography':
          styleType = 'TEXT';
          break;
        // case 'shadow':
      }

      figmaToken = {
        tokenType: 'style',
        type: styleType,
        name,
        $value: value,
        $description: description,
      };
    }

    return figmaToken;
  };

/** 変数のスコープを取得する */
function getVariableScopes(token: TransformedToken): VariableScope[] {
  const attr = token.attributes;

  if (attr?.category) {
    switch (attr.category) {
      case 'font-size':
        return ['FONT_SIZE'];
      case 'font-family':
        return ['FONT_FAMILY'];
      case 'font-weight':
        return ['FONT_WEIGHT'];
    }
  }

  return ['ALL_SCOPES'];
}

// --- Transform ---

const transformColorValue = (val: any) => {
  if (typeof val === 'string') {
    const [r, g, b, a] = parseToRgba(val);
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }
  if (typeof val === 'object' && val.rgb) {
    const { r, g, b } = val.rgb;
    return {
      r: r / 255,
      g: g / 255,
      b: b / 255,
      a: val.alpha ?? val.a,
    };
  }

  return val;
};

const transformColor: ValueTransform = {
  name: 'color/figma',
  type: 'value',
  transitive: true,
  filter: (token, options) =>
    options.usesDtcg ? token.$type === 'color' : token.type === 'color',
  transform: (token, _, options) => {
    const val = options.usesDtcg ? token.$value : token.value;
    return transformColorValue(val);
  },
};

const transformFontFamily: ValueTransform = {
  name: 'fontFamily/figma',
  type: 'value',
  transitive: true,
  filter: (token, options) =>
    options.usesDtcg
      ? token.$type === 'fontFamily'
      : token.type === 'fontFamily',
  transform: (token, _, options) => {
    const val = options.usesDtcg ? token.$value : token.value;
    if (Array.isArray(val)) {
      return val[0];
    }
    return val;
  },
};

const figmaFormat: Format = {
  name: 'figma',
  format: ({ dictionary, options = {} }) => {
    const { outputReferences, usesDtcg } = options;

    return JSON.stringify(
      formattedFigmaToken({ dictionary, outputReferences, usesDtcg }),
      null,
      2,
    );
  },
};

StyleDictionary.registerTransform(transformColor);
StyleDictionary.registerTransform(transformFontFamily);

StyleDictionary.registerTransformGroup({
  name: 'figma',
  transforms: ['attribute/cti', 'color/figma', 'fontFamily/figma'],
});

StyleDictionary.registerFormat(figmaFormat);

// --- Config ---

const sd = new StyleDictionary({
  parsers: ['yaml-parser'],
  source: ['tokens.yaml'],
  platforms: {
    css: {
      transformGroup: 'css',
      transforms: ['size/px'],
      files: [
        {
          destination: 'build/variables.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
    figma: {
      transformGroup: 'figma',
      files: [
        {
          destination: 'build/figma-tokens.json',
          format: 'figma',
          options: { outputReferences: true },
        },
      ],
    },
  },
});

// --- Build ---

await sd.hasInitialized;

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
