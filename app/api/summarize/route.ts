import { NextRequest, NextResponse } from "next/server";
import { getWebsiteContent } from "@/lib/utils";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from "node-html-markdown";
import TurndownService from "turndown";
export async function POST(req: NextRequest) {
  const json = await req.json();
  const { url } = json;
  const content = await getWebsiteContent(url);
  const test = NodeHtmlMarkdown.translate(/* html */ content);
//   var markdown = turndownService.turndown("<h1>google.com</h1>");
  return NextResponse.json({ test });
}
