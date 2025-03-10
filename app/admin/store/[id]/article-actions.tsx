"use server";
import { Content } from "@/app/(standard)/s/[path]/content";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Readability } from "@mozilla/readability";
import { Store } from "@prisma/client";
import { Buffer } from "buffer";
import { randomUUID } from "crypto";
import { JSDOM } from "jsdom";
import mine from "mime-types";
import { NodeHtmlMarkdown } from "node-html-markdown";
import OpenAI from "openai";
import { fetchDetail } from "./actions";
import { client } from "../../../../model/s3";

/**
 *
 * https://developers.google.com/maps/documentation/places/web-service/search-find-place
 * @param name
 * @returns
 */

export async function googlePlaceSearch(name: string) {
  const fields = [
    "formatted_address",
    "geometry",
    "name",
    "place_id",
    "photos",
  ];
  const params = new URLSearchParams({
    key: process.env.GOOGLE_API_KEY!,
    inputtype: "textquery",
    input: name,
    language: "zh-TW",
    locationbias: "rectangle:21.9155,119.3129|25.9757,124.5657",
    fields: fields.join(","),
  });

  const r = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params.toString()}`,
    { cache: "no-store" }
  );
  const res = await r.json();
  if (res.status === "OK") {
    res.candidates = await Promise.all(
      res.candidates.map((x: { place_id: string }) => fetchDetail(x.place_id))
    );
  }

  return res;
}

/**
 * @returns content (markdown string)
 */
export async function renderContent(
  store: Partial<Pick<Store, "content" | "content_ref" | "content_ref_url">>
) {
  // workaround: dynamic import is required to get it work
  // https://github.com/vercel/next.js/issues/43810#issuecomment-1341136525
  const ReactDOMServer = (await import("react-dom/server")).default;
  return ReactDOMServer.renderToStaticMarkup(<Content data={store}></Content>);
}

export async function fetchArticle(url: string) {
  const res = await fetch(url, { redirect: "follow" });

  if (!res.ok) throw new Error("unable to fetch");
  const body = await res.text();

  var doc = new JSDOM(body);
  let reader = new Readability(doc.window.document);
  let article = reader.parse();
  if (!article) return null;

  article.content = NodeHtmlMarkdown.translate(article.content);
  try {
    article.content = await toCdnImg(article.content);
  } catch (e) {}

  return article;
}

export async function fetchArticleAI(url: string) {
  const openai = new OpenAI();
  const res = await fetch(url, { redirect: "follow" });

  if (!res.ok) throw new Error("unable to fetch");
  const body = await res.text();

  const prompt = `
  ${body}

  ---

  Above is the HTML of an article web page. Extract the article content of this page and return a clean markdown string.
  The text of article content should be kept exactly as it is and also Make sure image elements are capture as well.
  Use # for the main article title. And use ## for the sub section heading.
  The return markdown should only consist of: text, first heading, second heading, link, and image.
  Please only reply with markdown string of the full article content and no other string. Don't enclose the content in '''
  `;

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-1106-preview",
  });

  return chatCompletion.choices[0].message.content;
}

export async function toCdnImg(content: string) {
  const srcUrls = extractImgUrl(content);
  const cdnUrls = await Promise.all(srcUrls.map(toCdn));

  for (let i = 0; i < srcUrls.length; i++) {
    content = content.replace(srcUrls[i], cdnUrls[i]);
  }
  return content;
}

async function toCdn(url: string) {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let type = response.headers.get("Content-Type");
  if (!type) throw new Error("Unknown content type: " + url);
  if (type === "image/jpg") {
    type = "image/jpeg";
  }

  const key = `${randomUUID()}.${mine.extension(type)}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: type,
  });
  await client.send(command);

  return `https://file.reads.tw/${key}`;
}

const extractImgUrl = (markdown: string): string[] => {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const urls = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};
