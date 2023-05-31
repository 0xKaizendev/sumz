import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import * as cheerio from 'cheerio'
import { Locale } from "@/config/i18n-config";
import translate from "translate";
import {parse} from 'node-html-parser'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getRapidAPiKey() {
  return process.env.NEXT_RAPIDAPI_KEY;
}

// translate
export const translateArticle = async (article: string, langFrom:Locale,LangTo:Locale) => {
  try {
    const translatedArticle = await translate(article, {
     from:langFrom,
     to:LangTo
    });
    return translatedArticle;
  } catch (error) {
    throw new Error("Translation failed");
  }
};
