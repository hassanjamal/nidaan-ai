import PouchDB from "pouchdb";
import { centralDb } from "../db/dbConfig.js";

export const inventorySync = async (storeId) => {
  const localInventoryDb = new PouchDB("local_inventory_db");
  const remoteInventoryDb = new PouchDB(`${process.env.COUCHDB_URL}/${storeId}/inventory`);

  localInventoryDb.sync(remoteInventoryDb, {
    live: true,
    retry: true,
  }).on("change", (info) => {
    console.log("Inventory data synced:", info);
  }).on("paused", (err) => {
    console.log("Inventory sync paused:", err);
  }).on("active", () => {
    console.log("Inventory sync resumed.");
  }).on("error", (err) => {
    console.error("Inventory sync error:", err);
  });
};
