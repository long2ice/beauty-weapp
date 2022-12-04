import { SEARCH } from "../constants";
import { getStorage, setStorage } from "@tarojs/taro";

export async function addKeyword(keyword: string) {
  keyword = keyword.trim();
  if (keyword === "") {
    return;
  }
  let keywords = await getKeywords();
  if (keywords.includes(keyword)) {
    return;
  }
  keywords.push(keyword);
  return await setStorage({
    key: SEARCH,
    data: keywords,
  });
}

export async function getKeywords() {
  return await getStorage({
    key: SEARCH,
  })
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return [];
    });
}

export async function clearKeywords() {
  return await setStorage({
    key: SEARCH,
    data: [],
  });
}
