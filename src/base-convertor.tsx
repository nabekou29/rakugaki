import { useState } from "react";
import { Action, ActionPanel, List, getPreferenceValues } from "@raycast/api";

interface Preferences {
  useUppercase: boolean;
}

const basis = [10, 2, 8, 16];

export default function Command() {
  const [input, setInput] = useState<string | undefined>(undefined);
  const preferences = getPreferenceValues<Preferences>();

  const num = inputToNumber(input);

  const toString = (num: bigint, base: number): string =>
    preferences.useUppercase ? num.toString(base).toUpperCase() : num.toString(base);

  return (
    <List searchBarPlaceholder='Input number ... (e.g. "29" "0x3F "16 A2")' onSearchTextChange={setInput}>
      {input?.trim() === "" ? (
        <List.EmptyView title="No result" />
      ) : !num ? (
        <List.EmptyView title="Invalid value" description='e.g. "29" "0x3F "16 A2"' />
      ) : (
        basis.map((base) => (
          <List.Item
            key={base}
            title={toString(num, base)}
            subtitle={`(${base})`}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={toString(num, base)} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

/**
 * 入力された文字列を数値に変換する
 *
 * 入力値は "29" "0x3F "16 A2" など。
 * 空白で区切った場合は "{基数} {数値}" として扱う。"16 A2" の場合は "162"。
 */
const inputToNumber = (input: string | undefined): bigint | undefined => {
  if (!input) {
    return undefined;
  }

  const splitted = input.trim().split(" ");

  try {
    if (splitted.length > 1) {
      const [base, num] = splitted;
      // FIXME: parseIntを挟むので大きい数字は扱えない。StringからBigIntへの変換方法を変える必要がある。
      return BigInt(parseInt(num, Number(base)));
    } else {
      const [num] = splitted;
      return BigInt(num);
    }
  } catch {
    return undefined;
  }
};
