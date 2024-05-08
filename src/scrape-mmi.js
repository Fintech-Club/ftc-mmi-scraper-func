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
