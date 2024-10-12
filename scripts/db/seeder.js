import { seedManufacturersAndProducts } from "./manufacturerSeeder.js";
import { seedCompanyAndStores } from "./companyStoreSeeder.js";
import { seedInventory } from "./inventorySeeder.js";
import { seedSaasCompany } from "./saasCompanySeeder.js";
import { seedPurchases } from "./purchaseSeeder.js";
import { seedChartOfAccounts } from "./chartOfAccountsSeeder.js";
import { seedLedger } from "./ledgerSeeder.js";
import { centralDb, checkDbConnection, createDatabase } from "./dbConfig.js";

const runSeeder = async () => {
  try {
    console.log("Starting seeder...");

    // Check database connection
    const isDbConnected = await checkDbConnection();
    if (!isDbConnected) {
      console.error("Database connection failed. Seeder will not run.");
      return;
    }

    // Create database if it doesn't exist
    await createDatabase();

    // Seed SaaS company
    const saasAdminId = await seedSaasCompany();
    if (!saasAdminId) {
      console.error("Failed to create SaaS admin. Aborting seeding process.");
      return;
    }

    // Seed manufacturers and products
    await seedManufacturersAndProducts();

    // Seed companies and stores
    const { companyIds, storeIds } = await seedCompanyAndStores();

    // Seed inventory for each store
    if (storeIds && storeIds.length > 0) {
      await seedInventory(storeIds);
    } else {
      console.log("No stores created, skipping inventory seeding.");
      return;
    }

    // Seed purchases for the first store of the first company from all stores of the second company
    const firstCompanyStores = storeIds.slice(0, 5); // Assuming first 5 stores belong to the first company
    const secondCompanyStores = storeIds.slice(5); // Remaining stores belong to the second company
    await seedPurchases(firstCompanyStores[0], secondCompanyStores);

    // Seed Chart of Accounts
    await seedChartOfAccounts();

    // Seed Ledger entries for all stores
    await seedLedger(storeIds);

    console.log("Seeding completed successfully.");

    // Verify database contents
    const allDocs = await centralDb.allDocs({ include_docs: true });
    console.log("Total documents in the database:", allDocs.rows.length);

    // Log counts of each document type
    const docCounts = allDocs.rows.reduce((acc, row) => {
      const type = row.doc.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    console.log("Document counts by type:", docCounts);
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    try {
      await centralDb.close();
      console.log("Database connection closed.");
    } catch (closeError) {
      console.error("Error closing database connection:", closeError);
    }
  }
};

runSeeder();
