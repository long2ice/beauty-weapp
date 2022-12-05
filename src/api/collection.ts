import { API_URL } from "../constants";
import { request } from "@tarojs/taro";

const BASE_URL = API_URL + "/collection";

export async function searchCollections(
  keyword: string,
  limit: number,
  offset: number
) {
  const { data } = await request({
    url: BASE_URL + "/search",
    method: "GET",
    data: {
      keyword,
      limit,
      offset,
    },
  });
  return data;
}

export async function getCollectionPictures(id: number) {
  const { data } = await request({
    url: BASE_URL + "/" + id + "/picture",
    method: "GET",
  });
  return data;
}
