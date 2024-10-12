import PouchDB from "pouchdb";
import { centralDb } from "../db/dbConfig.js";

export const manufacturerSync = async () => {
  const localManufacturerDb = new PouchDB("local_manufacturer_db");
  const remoteManufacturerDb = new PouchDB(`${process.env.COUCHDB_URL}/manufacturer`);

  localManufacturerDb.sync(remoteManufacturerDb, {
    live: true,
    retry: true,
  }).on("change", (info) => {
    console.log("Manufacturer data synced:", info);
  }).on("paused", (err) => {
    console.log("Manufacturer sync paused:", err);
  }).on("active", () => {
    console.log("Manufacturer sync resumed.");
  }).on("error", (err) => {
    console.error("Manufacturer sync error:", err);
  });
};
