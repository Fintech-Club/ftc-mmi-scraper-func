import { Client, Databases } from "node-appwrite";
import puppeteer from "puppeteer";

async function updateMMI(log, databases, DOCUMENT_ID, score) {
  const res = await databases.updateDocument(
    process.env.DATABASE_ID,
    process.env.COLLECTION_ID,
    DOCUMENT_ID,
    { score: score }
  );

  if (DOCUMENT_ID == res.$id) log("[MMI UPDATED] ID: " + res.$id);
}

async function updateMMIFromWeb(log, databases, DOCUMENT_ID, url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector(".market-fng-gauge__dial-number-value");

    const mmiText = await page.$eval(
      ".market-fng-gauge__dial-number-value",
      (element) => element.textContent.trim()
    );

    const mmi = parseFloat(mmiText);

    await updateMMI(log, databases, DOCUMENT_ID, mmi);
    console.log(mmiText);
    console.log(mmi);

    await browser.close();
  } catch (error) {
    log("Error updating MMI from web:", error);
  }
}

async function update_CNN_MMI(log, databases) {
  let score = Math.floor(Math.random() * 101);

  await updateMMIFromWeb(
    log,
    databases,
    process.env.CNN_DOCUMENT_ID,
    "https://edition.cnn.com/markets/fear-and-greed"
  );
}

async function update_TICKERTAPE_MMI(log, databases) {
  let score = Math.floor(Math.random() * 101);

  await updateMMIFromWeb(
    log,
    databases,
    process.env.TICKERTAPE_DOCUMENT_ID,
    "https://www.tickertape.in/market-mood-index"
  );
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
