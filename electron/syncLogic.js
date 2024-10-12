import PouchDB from "pouchdb";

// Start syncing between local PouchDB and remote CouchDB for a specific store
export const startSync = async (storeKey) => {
  const localDb = new PouchDB(storeKey); // Local PouchDB with storeKey as DB name
  const remoteDb = new PouchDB(`${process.env.COUCHDB_URL}/${storeKey}`);

  localDb
    .sync(remoteDb, { live: true, retry: true })
    .on("change", (info) => console.log("Sync change:", info))
    .on("paused", (err) => console.log("Sync paused:", err))
    .on("active", () => console.log("Sync resumed"))
    .on("error", (err) => console.error("Sync error:", err));
};
