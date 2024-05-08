import { Client, Databases } from "node-appwrite";
import { getCNNMMI, getTickerTapeMMI } from "./scrape-mmi";

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
