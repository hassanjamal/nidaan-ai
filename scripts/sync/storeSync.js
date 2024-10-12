import PouchDB from "pouchdb";
import { centralDb } from "../db/dbConfig.js";

export const storeSync = async (storeId) => {
  const localStoreDb = new PouchDB("local_store_db");
  const remoteStoreDb = new PouchDB(`${process.env.COUCHDB_URL}/${storeId}`);

  localStoreDb.sync(remoteStoreDb, {
    live: true,
    retry: true,
  }).on("change", (info) => {
    console.log("Store data synced:", info);
  }).on("paused", (err) => {
    console.log("Store sync paused:", err);
  }).on("active", () => {
    console.log("Store sync resumed.");
  }).on("error", (err) => {
    console.error("Store sync error:", err);
  });
};
