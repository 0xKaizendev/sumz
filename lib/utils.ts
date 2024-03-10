import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale } from "@/config/i18n-config";
import translate from "translate";
import * as cheerio from "cheerio";
import axios from "axios";
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

export async function getURLContent(args: { url: string }) {
  try {
      const request = await axios.get(args.url)
      const $ = cheerio.load(request.data, {
      }, true);
      const unwanTed = ['script', 'meta', 'style', 'svg', 'button', 'img', 'link', 'a', 'figure', 'form', 'picture', 'noscript',]
      unwanTed.forEach(tag => {
          $(tag).remove()
      })
      // let lines = $.html().split('\n');
      let lines = $('body').text().split('\n');
      let nonBlankLines = lines.filter(line => line.trim() !== '');
      let outputString = nonBlankLines.join('\n');
      // remove <p> and </p> from the string
      const regex = /<\/?p[^>]*>/g;
      return outputString.replace(regex, '');
  } catch (error) {
      console.log(error);
      return false
  }
}

export function wordCount(str: string) {
  return str.split(" ").length;
}