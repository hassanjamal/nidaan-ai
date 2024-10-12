import { centralDb, generateId } from "./dbConfig.js";

const createPurchase = async (
  storeId,
  supplierStoreId,
  purchaseDate,
  totalAmount,
  invoiceNumber,
  paymentStatus
) => {
  const purchase = {
    _id: generateId("purchase_"),
    type: "purchase",
    store_id: storeId,
    supplier_store_id: supplierStoreId,
    purchase_date: purchaseDate,
    total_amount: totalAmount,
    invoice_number: invoiceNumber,
    payment_status: paymentStatus,
  };

  try {
    const response = await centralDb.put(purchase);
    if (response.ok) {
      console.log(
        `Purchase created successfully for store ${storeId} from supplier ${supplierStoreId}`
      );
      return purchase._id;
    }
  } catch (error) {
    console.error(`Error creating purchase for store ${storeId}:`, error);
  }
  return null;
};

const createPurchaseItem = async (
  purchaseId,
  productId,
  quantity,
  price,
  gstRate,
  batchNumber,
  expiryDate
) => {
  const purchaseItem = {
    _id: generateId("purchase_item_"),
    type: "purchase_item",
    purchase_id: purchaseId,
    product_id: productId,
    quantity: quantity,
    price: price,
    gst_rate: gstRate,
    batch_number: batchNumber,
    expiry_date: expiryDate,
  };

  try {
    const response = await centralDb.put(purchaseItem);
    if (response.ok) {
      console.log(
        `Purchase item created successfully for purchase ${purchaseId}`
      );
      return purchaseItem._id;
    }
  } catch (error) {
    console.error(
      `Error creating purchase item for purchase ${purchaseId}:`,
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

export const seedPurchases = async (buyingStoreId, sellingStoreIds) => {
  // Fetch all products
  const result = await centralDb.find({
    selector: { type: "product" },
    fields: ["_id", "name", "mrp"],
  });
  const products = result.docs;

  for (const sellingStoreId of sellingStoreIds) {
    // Create 2 purchases from each selling store
    for (let i = 0; i < 2; i++) {
      const purchaseDate = getRandomDate(new Date(2023, 0, 1), new Date())
        .toISOString()
        .split("T")[0];
      const invoiceNumber = `INV-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase()}`;
      const paymentStatus = Math.random() > 0.5 ? "Paid" : "Pending";

      let totalAmount = 0;
      const purchaseId = await createPurchase(
        buyingStoreId,
        sellingStoreId,
        purchaseDate,
        totalAmount,
        invoiceNumber,
        paymentStatus
      );

      if (purchaseId) {
        // Add 5-10 random products to each purchase
        const numberOfProducts = Math.floor(Math.random() * 6) + 5;
        const selectedProducts = products
          .sort(() => 0.5 - Math.random())
          .slice(0, numberOfProducts);

        for (const product of selectedProducts) {
          const quantity = Math.floor(Math.random() * 50) + 1; // 1 to 50 items
          const price = parseFloat((product.mrp * 0.8).toFixed(2)); // 80% of MRP as purchase price
          const gstRate = 0.18; // Assuming 18% GST for all products
          const batchNumber = `BATCH-${Math.random()
            .toString(36)
            .substring(7)
            .toUpperCase()}`;
          const expiryDate = getRandomDate(
            new Date(),
            new Date(new Date().setFullYear(new Date().getFullYear() + 2))
          )
            .toISOString()
            .split("T")[0];

          await createPurchaseItem(
            purchaseId,
            product._id,
            quantity,
            price,
            gstRate,
            batchNumber,
            expiryDate
          );

          totalAmount += quantity * price * (1 + gstRate);
        }

        // Update the purchase with the correct total amount
        await centralDb.put({
          ...(await centralDb.get(purchaseId)),
          total_amount: parseFloat(totalAmount.toFixed(2)),
        });
      }
    }
  }
};
