import PouchDB from "pouchdb";
import { centralDb } from "../scripts/db/dbConfig.js";

// Verify the key entered and associate it with the installation ID
export const verifyKeyAndAssociateStore = async (
  enteredKey,
  installationId
) => {
  try {
    const result = await centralDb.find({
      selector: { type: "store", key: enteredKey },
    });

    if (result.docs.length === 0) {
      console.error("Store with the given key not found.");
      return false;
    }

    const store = result.docs[0];
    store.installation_id = installationId;

    await centralDb.put(store);
    console.log(
      `Store ${store.name} associated with installation ID ${installationId}.`
    );
    return true;
  } catch (error) {
    console.error("Key verification failed:", error);
    return false;
  }
};
