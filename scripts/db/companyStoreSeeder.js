import { centralDb, generateId } from "./dbConfig.js";
import crypto from "crypto";

// Generate a unique key for each store
const generateStoreKey = () => crypto.randomBytes(16).toString("hex");

// Function to create a company in the central CouchDB
const createCompany = async (name, gstNumber, panNumber) => {
  try {
    const existingCompany = await centralDb.find({
      selector: {
        type: "company",
        $or: [{ gst_number: gstNumber }, { pan_number: panNumber }],
      },
    });

    if (existingCompany.docs.length > 0) {
      console.log(
        `Company with GST: ${gstNumber} or PAN: ${panNumber} already exists.`
      );
      return existingCompany.docs[0]._id;
    }

    const company = {
      _id: generateId("company_"),
      type: "company",
      name: name,
      gst_number: gstNumber,
      pan_number: panNumber,
    };

    const response = await centralDb.put(company);
    if (response.ok) {
      console.log(`Company ${name} created successfully.`);
      return company._id;
    }
  } catch (error) {
    console.error(`Error creating/finding Company ${name}:`, error);
  }
  return null;
};

// Function to create a store associated with a company
const createStore = async (
  companyId,
  name,
  address,
  gstNumber,
  drugLicenseNumber
) => {
  try {
    const existingStore = await centralDb.find({
      selector: {
        type: "store",
        $or: [
          { gst_number: gstNumber },
          { drug_license_number: drugLicenseNumber },
        ],
      },
    });

    if (existingStore.docs.length > 0) {
      console.log(
        `Store with GST: ${gstNumber} or Drug License: ${drugLicenseNumber} already exists.`
      );
      return existingStore.docs[0];
    }

    const storeKey = generateStoreKey(); // Generate a unique store key

    const store = {
      _id: generateId("store_"),
      type: "store",
      company_id: companyId,
      name: name,
      address: address,
      gst_number: gstNumber,
      drug_license_number: drugLicenseNumber,
      key: storeKey, // Store the unique key
    };

    const response = await centralDb.put(store);
    if (response.ok) {
      console.log(`Store ${name} created successfully.`);
      return store;
    }
  } catch (error) {
    console.error(`Error creating/finding Store ${name}:`, error);
  }
  return null;
};

// Seeder function to populate companies and stores
export const seedCompanyAndStores = async () => {
  const companies = [
    {
      name: "MedAll Distributors Pvt Ltd",
      gst: "10AABCM1234C1ZX",
      pan: "AABCM1234C",
      stores: [
        {
          name: "MedAll City Center",
          address: "123 Main Road, Purnia, Bihar",
          gst: "10AABCM1234C1Z1",
          drugLicense: "BR-PUR-123456",
        },
        {
          name: "MedAll Gulabbagh",
          address: "456 Station Road, Gulabbagh, Purnia, Bihar",
          gst: "10AABCM1234C2Z2",
          drugLicense: "BR-PUR-234567",
        },
      ],
    },
    {
      name: "BiharMed Enterprises",
      gst: "10AABCB5678D1ZY",
      pan: "AABCB5678D",
      stores: [
        {
          name: "BiharMed Araria",
          address: "45 Gandhi Chowk, Araria, Bihar",
          gst: "10AABCB5678D1Z1",
          drugLicense: "BR-ARA-123456",
        },
        {
          name: "BiharMed Katihar",
          address: "78 Station Road, Katihar, Bihar",
          gst: "10AABCB5678D2Z2",
          drugLicense: "BR-KTR-234567",
        },
      ],
    },
  ];

  const companyIds = [];
  const allStoreIds = [];

  for (const company of companies) {
    const companyId = await createCompany(
      company.name,
      company.gst,
      company.pan
    );

    if (companyId) {
      companyIds.push(companyId);

      for (const store of company.stores) {
        const storeInfo = await createStore(
          companyId,
          store.name,
          store.address,
          store.gst,
          store.drugLicense
        );

        if (storeInfo) {
          allStoreIds.push(storeInfo._id);
          console.log(`Store Key for ${storeInfo.name}: ${storeInfo.key}`); // Log the store key
        }
      }
    }
  }

  console.log("Seeding completed. Company and store IDs:");
  console.log({ companyIds, storeIds: allStoreIds });

  return { companyIds, storeIds: allStoreIds };
};
