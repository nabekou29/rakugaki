import { useFetch, usePromise } from "@raycast/utils";
import { LocalStorage } from "@raycast/api";
import React, { useState } from "react";
import * as t from "io-ts";
import * as J from "fp-ts/Json";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

const FetchTokenResponse = t.type({
  jwtString: t.string,
});
type FetchTokenResponse = t.TypeOf<typeof FetchTokenResponse>;

export const useFetchToken = () => {
  const { isLoading: isLoadingFromLocal, data: localToken } = usePromise(async () =>
    LocalStorage.getItem<string>("token")
  );
  const {
    isLoading: isLoadingFromAPI,
    data: token,
    revalidate,
  } = useFetch("https://lgtmeow.com/api/oidc/token", {
    method: "POST",
    execute: false,
    parseResponse: async (response) => {
      return pipe(
        await response.json(),
        FetchTokenResponse.decode,
        E.map<FetchTokenResponse, string>((res) => res.jwtString),
        E.getOrElse<t.Errors, string | undefined>(() => undefined)
      );
    },
  });

  // ローカルになければ取得
  React.useEffect(() => {
    if (!isLoadingFromLocal && localToken === undefined) {
      revalidate();
    }
  }, [isLoadingFromLocal, localToken]);

  // APIから取得できたらローカルに保存
  React.useEffect(() => {
    if (token) {
      LocalStorage.setItem("token", token);
    }
  }, [token]);

  return { isLoading: !token && (isLoadingFromAPI || isLoadingFromLocal), token: localToken ?? token, revalidate };
};

const FetchImageSuccessResponse = t.type({
  lgtmImages: t.array(
    t.type({
      id: t.string,
      url: t.string,
    })
  ),
});
type FetchImageSuccessResponse = t.TypeOf<typeof FetchImageSuccessResponse>;
const FetchImageErrorResponse = t.type({
  message: t.literal("Unauthorized"),
});
const FetchImageResponse = t.union([FetchImageSuccessResponse, FetchImageErrorResponse]);
type FetchImageResponse = t.TypeOf<typeof FetchImageResponse>;

export const useFetchImage = () => {
  const [retrying, setRetrying] = useState(false);
  const { isLoading: isLoadingToken, token, revalidate: revalidateToken } = useFetchToken();

  const { isLoading: isLoadingFromLocal, data: localData } = usePromise(async () => {
    const item = await LocalStorage.getItem<string>("cats");
    if (!item) {
      return undefined;
    }

    return pipe(
      item,
      J.parse,
      E.chainW(FetchImageSuccessResponse.decode),
      E.getOrElse<unknown, FetchImageSuccessResponse | undefined>(() => undefined)
    );
  });

  const { isLoading, data, revalidate } = useFetch("https://api.lgtmeow.com/lgtm-images", {
    method: "GET",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    execute: false,
    parseResponse: async (response) => {
      return pipe(
        await response.json(),
        FetchImageResponse.decode,
        E.getOrElse<t.Errors, FetchImageResponse | undefined>(() => undefined)
      );
    },
  });

  React.useEffect(() => {
    if (data && "message" in data && data.message === "Unauthorized") {
      setRetrying(true);
      revalidateToken();
    }
  }, [data]);

  // ローカルになければ取得
  React.useEffect(() => {
    if (!isLoadingFromLocal && localData === undefined) {
      revalidate();
    }
  }, [isLoadingFromLocal, localData]);

  // retry処理
  React.useEffect(() => {
    if (token && retrying) {
      setRetrying(false);
      revalidate();
    }
  }, [token, retrying]);

  // APIから取得できたらローカルに保存
  React.useEffect(() => {
    if (data) {
      LocalStorage.setItem("cats", JSON.stringify(data));
    }
  }, [data]);

  const successData = localData ?? (data && "lgtmImages" in data ? data : undefined);

  return { isLoading: !successData && (isLoading || isLoadingFromLocal || isLoadingToken), data: successData, revalidate};
};
