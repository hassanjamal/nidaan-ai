import { centralDb, generateId } from "./dbConfig.js";

const createLedger = async (storeId, name, type) => {
  const ledger = {
    _id: generateId("ledger_"),
    type: "ledger",
    store_id: storeId,
    name: name,
    ledger_type: type,
  };

  try {
    const response = await centralDb.put(ledger);
    if (response.ok) {
      console.log(`Ledger created: ${name}`);
      return ledger._id;
    }
  } catch (error) {
    console.error(`Error creating Ledger ${name}:`, error);
  }
  return null;
};

const createLedgerEntry = async (
  ledgerId,
  transactionType,
  referenceId,
  entryDate,
  debitAmount,
  creditAmount,
  narration
) => {
  const ledgerEntry = {
    _id: generateId("ledger_entry_"),
    type: "ledger_entry",
    ledger_id: ledgerId,
    transaction_type: transactionType,
    reference_id: referenceId,
    entry_date: entryDate,
    debit_amount: debitAmount,
    credit_amount: creditAmount,
    narration: narration,
  };

  try {
    const response = await centralDb.put(ledgerEntry);
    if (response.ok) {
      console.log(`Ledger entry created for ${transactionType}`);
      return ledgerEntry._id;
    }
  } catch (error) {
    console.error(`Error creating Ledger entry:`, error);
  }
  return null;
};

export const seedLedger = async (storeIds) => {
  for (const storeId of storeIds) {
    // Create basic ledgers for each store
    const purchaseLedgerId = await createLedger(
      storeId,
      "Purchases",
      "Expense"
    );
    const inventoryLedgerId = await createLedger(storeId, "Inventory", "Asset");
    const accountsPayableLedgerId = await createLedger(
      storeId,
      "Accounts Payable",
      "Liability"
    );

    // Fetch purchases for this store
    const purchases = await centralDb.find({
      selector: {
        type: "purchase",
        store_id: storeId,
      },
    });

    for (const purchase of purchases.docs) {
      const entryDate = purchase.purchase_date;
      const amount = purchase.total_amount;

      // Create ledger entries for each purchase
      await createLedgerEntry(
        purchaseLedgerId,
        "Purchase",
        purchase._id,
        entryDate,
        amount,
        0,
        `Purchase from supplier ${purchase.supplier_store_id}`
      );
      await createLedgerEntry(
        inventoryLedgerId,
        "Purchase",
        purchase._id,
        entryDate,
        amount,
        0,
        `Inventory received from supplier ${purchase.supplier_store_id}`
      );
      await createLedgerEntry(
        accountsPayableLedgerId,
        "Purchase",
        purchase._id,
        entryDate,
        0,
        amount,
        `Amount payable for purchase from supplier ${purchase.supplier_store_id}`
      );
    }
  }
};
