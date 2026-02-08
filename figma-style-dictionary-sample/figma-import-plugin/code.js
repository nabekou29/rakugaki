console.clear();

figma.ui.onmessage = async (e) => {
  console.log("code received message", e);
  if (e.type === "IMPORT") {
    const { fileName, body } = e;
    await importJSONFile({ fileName, body });
  }
};
if (figma.command === "import") {
  figma.showUI(__uiFiles__.import, {
    width: 500,
    height: 500,
    themeColors: true,
  });
}

async function importJSONFile({ fileName, body }) {
  const json = JSON.parse(body);

  const { collection, modeId } = await createCollection(fileName);

  const variables = {};

  for (const variableSource of json.variables) {
    const variable = await createVariable(
      collection,
      modeId,
      variableSource,
      variables,
    ).catch((e) => {
      console.error("error", e);
    });
    variables[variableSource.name] = variable;
  }

  for (const styleSource of json.styles) {
    switch (styleSource.type) {
      case "TEXT":
        await createTextStyle(styleSource, variables).catch((e) => {
          console.error("error", e.message, e);
        });
        break;
      default:
        console.warn("unsupported type", styleSource.type, styleSource);
        break;
    }
  }

  figma.notify("インポートが完了しました！");
}

/** コレクションを作成する */
async function createCollection(name) {
  const localVariableCollections =
    await figma.variables.getLocalVariableCollectionsAsync();

  const currentCollection = localVariableCollections.find(
    (e) => e.name === name,
  );

  const collection =
    currentCollection || figma.variables.createVariableCollection(name);
  const modeId = collection.modes[0].modeId;

  return { collection, modeId };
}

/** バリアブルを作成する */
async function createVariable(collection, modeId, variableSource, variables) {
  const { name, type, $value, $description, scopes } = variableSource;

  const localVariables = await figma.variables.getLocalVariablesAsync();
  const currentVariable = localVariables.find(
    (e) => e.name === name && e.variableCollectionId === collection.id,
  );

  const variable =
    currentVariable || figma.variables.createVariable(name, collection, type);

  if ($description) {
    variable.description = $description;
  }
  if (scopes) {
    variable.scopes = scopes;
  }

  if (isAlias($value)) {
    variable.setValueForMode(modeId, {
      type: "VARIABLE_ALIAS",
      id: variables[refToKey($value)].id,
    });
  } else {
    variable.setValueForMode(modeId, $value);
  }

  return variable;
}

/** テキストスタイルを作成する */
async function createTextStyle(styleSource, variables) {
  const { name, $value, $description } = styleSource;

  const localTextStyles = await figma.getLocalTextStylesAsync();
  const currentTextStyle = localTextStyles.find((e) => e.name === name);

  const textStyle = currentTextStyle || figma.createTextStyle();
  textStyle.name = name;

  if ($description) {
    token.description = $description;
  }

  const { fontFamily, fontSize, fontWeight, lineHeight } = $value;

  if (isAlias(fontFamily)) {
    textStyle.setBoundVariable("fontFamily", variables[refToKey(fontFamily)]);
  } else {
    // INFO: fontFamily は事前に読み込みが必要なので、多分動かない
    textStyle.fontFamily = fontFamily;
  }

  if (isAlias(fontSize)) {
    textStyle.setBoundVariable("fontSize", variables[refToKey(fontSize)]);
  } else {
    textStyle.fontSize = fontSize;
  }

  if (isAlias(fontWeight)) {
    textStyle.setBoundVariable("fontWeight", variables[refToKey(fontWeight)]);
  } else {
    textStyle.fontWeight = fontWeight;
  }

  if (isAlias(lineHeight)) {
    textStyle.setBoundVariable("lineHeight", variables[refToKey(lineHeight)]);
  } else {
    textStyle.lineHeight = lineHeight;
  }

  return textStyle;
}

function isAlias(value) {
  return typeof value === "string" && value.startsWith("{");
}

function refToKey(ref) {
  return ref.slice(1, -1);
}
