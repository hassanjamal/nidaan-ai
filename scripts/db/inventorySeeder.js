import { centralDb, generateId } from "./dbConfig.js";

const createInventoryItem = async (
  storeId,
  productId,
  quantity,
  expiryDate,
  batchNumber,
  purchasePrice,
  sellingPrice
) => {
  const inventoryItem = {
    _id: generateId("inventory_"),
    type: "inventory",
    store_id: storeId,
    product_id: productId,
    quantity: quantity,
    expiry_date: expiryDate,
    batch_number: batchNumber,
    purchase_price: purchasePrice,
    selling_price: sellingPrice,
  };

  try {
    const response = await centralDb.put(inventoryItem);
    if (response.ok) {
      console.log(
        `Inventory item created for store ${storeId} and product ${productId}`
      );
      return inventoryItem._id;
    }
  } catch (error) {
    console.error(
      `Error creating inventory item for store ${storeId} and product ${productId}:`,
      error
    );
  }
  return null;
};

const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

export const seedInventory = async (storeIds) => {
  // Fetch all products
  const result = await centralDb.find({
    selector: { type: "product" },
    fields: ["_id", "name", "mrp"],
  });
  const products = result.docs;

  for (const storeId of storeIds) {
    // For each store, add inventory for 10-15 random products
    const numberOfProducts = Math.floor(Math.random() * 6) + 10; // Random number between 10 and 15
    const selectedProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfProducts);

    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 100) + 20; // Random quantity between 20 and 119
      const expiryDate = getRandomDate(
        new Date(),
        new Date(new Date().setFullYear(new Date().getFullYear() + 2))
      ); // Random date within next 2 years
      const batchNumber = `BATCH-${Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase()}`;
      const purchasePrice = parseFloat((product.mrp * 0.7).toFixed(2)); // Assume purchase price is 70% of MRP
      const sellingPrice = product.mrp;

      await createInventoryItem(
        storeId,
        product._id,
        quantity,
        expiryDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        batchNumber,
        purchasePrice,
        sellingPrice
      );
    }
    console.log(`Inventory seeding completed for store ${storeId}`);
  }
};
