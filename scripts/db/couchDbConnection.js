import PouchDB from "pouchdb";

const checkDbConnection = async (url) => {
  const db = new PouchDB(url);

  const timeout = new Promise(
    (_, reject) =>
      setTimeout(() => reject(new Error("Connection timed out")), 5000) // Timeout after 5 seconds
  );

  try {
    await Promise.race([db.info(), timeout]); // Race between db.info() and the timeout
    console.log(`Connected to database at ${url} successfully.`);
    return true; // Connection successful
  } catch (error) {
    console.error(`Error connecting to database at ${url}:`, error.message);
    process.exit(1); // Exit the script if connection fails
  } finally {
    db.close(); // Close the database connection
  }
};

export default checkDbConnection;
