// NEXT_X_RAPIDAPI_KEY
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getRapidAPiKey(): { apikey: string } {
  const apikey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  if (!apikey || apikey.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  return { apikey };
}
export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      const rapidApiKey = getRapidAPiKey();
      headers.set("X-RapidAPI-Key", getRapidAPiKey().apikey);
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
