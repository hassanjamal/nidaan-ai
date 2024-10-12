import PouchDB from "pouchdb";
import { centralDb } from "../db/dbConfig.js";

export const purchaseSync = async (storeId) => {
  const localPurchaseDb = new PouchDB("local_purchase_db");
  const remotePurchaseDb = new PouchDB(`${process.env.COUCHDB_URL}/${storeId}/purchase_orders`);

  localPurchaseDb.sync(remotePurchaseDb, {
    live: true,
    retry: true,
  }).on("change", (info) => {
    console.log("Purchase order data synced:", info);
  }).on("paused", (err) => {
    console.log("Purchase sync paused:", err);
  }).on("active", () => {
    console.log("Purchase sync resumed.");
  }).on("error", (err) => {
    console.error("Purchase sync error:", err);
  });
};
