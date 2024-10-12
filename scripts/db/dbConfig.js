import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import dotenv from "dotenv";

dotenv.config();
PouchDB.plugin(PouchFind);

const couchDbUrl = process.env.COUCHDB_URL || "http://localhost:5984";
const dbName = "med_erp_central";
const centralDbUrl = `${couchDbUrl}/${dbName}`;

export const centralDb = new PouchDB(centralDbUrl);

export const generateId = (prefix) => {
  return `${prefix}${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`.replace(":", "_");
};

export const checkDbConnection = async () => {
  try {
    await centralDb.info();
    console.log(`Connected to database at ${centralDbUrl} successfully.`);
    return true;
  } catch (error) {
    console.error(`Failed to connect to database at ${centralDbUrl}:`, error);
    return false;
  }
};

export const createDatabase = async () => {
  try {
    await centralDb.info();
    console.log(`Database ${dbName} already exists.`);
  } catch (error) {
    if (error.status === 404) {
      try {
        await centralDb.put({
          _id: "_design/my_design_doc",
          views: {
            by_type: {
              map: function (doc) {
                emit(doc.type);
              }.toString(),
            },
          },
        });
        console.log(`Database ${dbName} created successfully.`);
      } catch (createError) {
        console.error(`Error creating database ${dbName}:`, createError);
        throw createError;
      }
    } else {
      console.error(`Error checking database ${dbName}:`, error);
      throw error;
    }
  }
};
