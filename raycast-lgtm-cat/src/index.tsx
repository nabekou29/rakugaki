import React, { useState } from "react";
import { ActionPanel, Action, Icon, Grid, Color } from "@raycast/api";
import { useFetchImage, useFetchToken } from "./api";

export default function Command() {
  const [itemSize, setItemSize] = useState<Grid.ItemSize>(Grid.ItemSize.Medium);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: isLoadingCats, data: cats, revalidate: reload } = useFetchImage();

  console.log(cats);


  return (
    <Grid
      itemSize={itemSize}
      isLoading={isLoading}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Grid Item Size"
          storeValue
          onChange={(newValue) => {
            setItemSize(newValue as Grid.ItemSize);
            setIsLoading(false);
          }}
        >
          <Grid.Dropdown.Item title="Large" value={Grid.ItemSize.Large} />
          <Grid.Dropdown.Item title="Medium" value={Grid.ItemSize.Medium} />
          <Grid.Dropdown.Item title="Small" value={Grid.ItemSize.Small} />
        </Grid.Dropdown>
      }
    >
      {!(isLoading || isLoadingCats) &&
        cats?.lgtmImages.map((cat) => (
          <Grid.Item
            key={cat.id}
            content={cat.url}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={`[![LGTMeow](${cat.url})](https://lgtmeow.com)`} />
                <Action title="Reload" onAction={() => reload() } shortcut={{ modifiers: ["cmd"], key: "r" }} />
              </ActionPanel>
            }
          />
        ))}
    </Grid>
  );
}
