import { Client, Databases } from "node-appwrite";

// SCRAPE CODE

import axios from "axios";
import { load } from "cheerio";

async function scrapePage(url, selector) {
  try {
    // Fetch the HTML content of the page
    const response = await axios.get(url);
    const html = response.data;

    // Parse the HTML
    const $ = load(html);

    // Find and extract the content you want
    const content = $(selector).text().trim();

    return content;
  } catch (error) {
    console.error("Error fetching or parsing page:", error);
    return null;
  }
}

export async function getTickerTapeMMI(log) {
  try {
    const mmi = await scrapePage(
      "https://www.tickertape.in/market-mood-index",
      "div.mmi-value > span.number"
    );

    return parseInt(mmi);
  } catch (error) {
    console.error("Error fetching or parsing page:", error);
    return null;
  }
}

export async function getCNNMMI(log) {
  try {
    const mmi = await scrapePage(
      "https://edition.cnn.com/markets/fear-and-greed",
      "div.market-fng-gauge__dial > span.market-fng-gauge__dial-number-value"
    );

    return parseInt(mmi);
  } catch (error) {
    console.error("Error fetching or parsing page:", error);
    return null;
  }
}

// =================================================================================================
// =================================================================================================
// =================================================================================================
// =================================================================================================

async function updateMMI(log, databases, DOCUMENT_ID, score) {
  const res = await databases.updateDocument(
    process.env.DATABASE_ID,
    process.env.COLLECTION_ID,
    DOCUMENT_ID,
    { score: score }
  );

  if (DOCUMENT_ID == res.$id) log("[MMI UPDATED] ID: " + res.$id);
}

async function update_CNN_MMI(log, databases) {
  let score = (await getCNNMMI(log)) || 0;

  await updateMMI(log, databases, process.env.CNN_DOCUMENT_ID, score);
}

async function update_TICKERTAPE_MMI(log, databases) {
  let score = (await getTickerTapeMMI(log)) || 0;

  await updateMMI(log, databases, process.env.TICKERTAPE_DOCUMENT_ID, score);
}

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  // Why not try the Appwrite SDK?
  //
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  await update_CNN_MMI(log, databases);
  await update_TICKERTAPE_MMI(log, databases);

  return res.send("DATABASE_QUERY_EXECTUED");
};
