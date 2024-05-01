import { Client, Databases } from "node-appwrite";

async function updateMMI(log, databases, DOCUMENT_ID, score) {
  const res = await databases.updateDocument(
    process.env.DATABASE_ID,
    process.env.COLLECTION_ID,
    DOCUMENT_ID,
    { score: score }
  );

  log("CNN MMI UPDATED: ", res);
}

async function update_CNN_MMI(log, databases) {
  let score = Math.floor(Math.random() * 101);

  await updateMMI(log, databases, process.env.CNN_DOCUMENT_ID, score);
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

  return res.send("DATABASE_QUERY_EXECTUED");
};
