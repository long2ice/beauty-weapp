import { API_URL } from "../constants";
import { request } from "@tarojs/taro";

const BASE_URL = API_URL + "/picture";

export async function getPicturesByTag(
  tag: string,
  limit: number,
  offset: number,
  favorite: boolean = false
) {
  if (tag == "最新") {
    return await getPictures(limit, offset, favorite);
  } else if (tag == "热门") {
    return await getHotPictures(limit, offset, favorite);
  } else {
    return await searchPictures(tag, limit, offset, favorite);
  }
}

export async function getHotPictures(
  limit: number,
  offset: number,
  favorite: boolean = false
) {
  const { data } = await request({
    url: BASE_URL + "/hot",
    method: "GET",
    data: {
      limit,
      offset,
      favorite,
    },
  });
  return data;
}

export async function getPictures(
  limit: number,
  offset: number,
  favorite: boolean = false
) {
  const { data } = await request({
    url: BASE_URL,
    method: "GET",
    data: {
      limit,
      offset,
      favorite,
    },
  });
  return data;
}

export async function getHotKeywords() {
  const { data } = await request({
    url: BASE_URL + "/keyword",
    method: "GET",
  });
  return data;
}

export async function searchPictures(
  keyword: string,
  limit: number,
  offset: number,
  favorite: boolean = false
) {
  const { data } = await request({
    url: BASE_URL + "/search",
    method: "GET",
    data: {
      keyword,
      limit,
      offset,
      favorite,
    },
  });
  return data;
}

export async function getPictureTag() {
  const { data } = await request({
    url: BASE_URL + "/tag",
    method: "GET",
  });
  return data;
}

export async function favoritePicture(id: number) {
  const { data } = await request({
    url: BASE_URL + `/${id}/favorite`,
    method: "POST",
  });
  return data;
}
