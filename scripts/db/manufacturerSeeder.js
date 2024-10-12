import { centralDb, generateId } from "./dbConfig.js";

export const seedManufacturersAndProducts = async () => {
  const createManufacturer = async (
    name,
    gstNumber,
    panNumber,
    drugLicenseNumber
  ) => {
    try {
      const existingManufacturer = await centralDb.find({
        selector: {
          type: "manufacturer",
          $or: [
            { gst_number: gstNumber },
            { pan_number: panNumber },
            { drug_license_number: drugLicenseNumber },
          ],
        },
      });

      if (existingManufacturer.docs.length > 0) {
        console.log(
          `Manufacturer with GST: ${gstNumber} or PAN: ${panNumber} or Drug License: ${drugLicenseNumber} already exists.`
        );
        return existingManufacturer.docs[0]._id;
      }

      const manufacturer = {
        _id: generateId("manufacturer_"),
        type: "manufacturer",
        name: name,
        gst_number: gstNumber,
        pan_number: panNumber,
        drug_license_number: drugLicenseNumber,
      };

      const response = await centralDb.put(manufacturer);
      if (response.ok) {
        console.log(`Manufacturer ${name} created successfully.`);
        return manufacturer._id;
      }
    } catch (error) {
      console.error(`Error creating/finding Manufacturer ${name}:`, error);
    }
    return null;
  };

  const createProduct = async (
    manufacturerId,
    name,
    category,
    dosageForm,
    strength,
    mrp,
    hsncode,
    drugSchedule
  ) => {
    try {
      const existingProduct = await centralDb.find({
        selector: {
          type: "product",
          manufacturer_id: manufacturerId,
          name: name,
          strength: strength,
        },
      });

      if (existingProduct.docs.length > 0) {
        console.log(
          `Product ${name} ${strength} for manufacturer ${manufacturerId} already exists.`
        );
        return existingProduct.docs[0]._id;
      }

      const product = {
        _id: generateId("product_"),
        type: "product",
        manufacturer_id: manufacturerId,
        name: name,
        category: category,
        dosage_form: dosageForm,
        strength: strength,
        mrp: mrp,
        hsncode: hsncode,
        drug_schedule: drugSchedule,
      };

      const response = await centralDb.put(product);
      if (response.ok) {
        console.log(`Product ${name} created successfully.`);
        return product._id;
      }
    } catch (error) {
      console.error(`Error creating/finding Product ${name}:`, error);
    }
    return null;
  };

  const manufacturers = [
    {
      name: "Sanofi India Ltd",
      gst: "27AADCS3999Q1ZX",
      pan: "AADCS3999Q",
      drugLicense: "MH-MUM-123456",
    },
    {
      name: "Sun Pharmaceutical Industries Ltd",
      gst: "24AADCS3124K1ZX",
      pan: "AADCS3124K",
      drugLicense: "GJ-VAD-234567",
    },
    {
      name: "Cipla Ltd",
      gst: "27AADCC1645C1ZD",
      pan: "AADCC1645C",
      drugLicense: "MH-MUM-345678",
    },
    {
      name: "Zydus Lifesciences Ltd",
      gst: "24AAACZ1368A1ZG",
      pan: "AAACZ1368A",
      drugLicense: "GJ-AHM-456789",
    },
    {
      name: "Mankind Pharma Ltd",
      gst: "07AAACM1117A1ZN",
      pan: "AAACM1117A",
      drugLicense: "DL-DEL-567890",
    },
  ];

  const products = [
    // Sanofi India Ltd Products
    {
      name: "Combiflam Tablet",
      manufacturer: "Sanofi India Ltd",
      saltComposition: "Ibuprofen (400mg) + Paracetamol (325mg)",
      category: "Analgesic",
      dosageForm: "Tablet",
      strength: "400mg+325mg",
      mrp: 32.7,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Allegra 120mg Tablet",
      manufacturer: "Sanofi India Ltd",
      saltComposition: "Fexofenadine (120mg)",
      category: "Antiallergic",
      dosageForm: "Tablet",
      strength: "120mg",
      mrp: 149,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Lantus 100IU/ml Injection",
      manufacturer: "Sanofi India Ltd",
      saltComposition: "Insulin Glargine (100IU/ml)",
      category: "Antidiabetic",
      dosageForm: "Injection",
      strength: "100IU/ml",
      mrp: 1941.46,
      hsncode: "30049099",
      drugSchedule: "H",
    },

    // Sun Pharmaceutical Industries Ltd Products
    {
      name: "Pantocid 40 Tablet",
      manufacturer: "Sun Pharmaceutical Industries Ltd",
      saltComposition: "Pantoprazole (40mg)",
      category: "Antacid",
      dosageForm: "Tablet",
      strength: "40mg",
      mrp: 131.04,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Rozucor 10 Tablet",
      manufacturer: "Sun Pharmaceutical Industries Ltd",
      saltComposition: "Rosuvastatin (10mg)",
      category: "Lipid Lowering",
      dosageForm: "Tablet",
      strength: "10mg",
      mrp: 106.26,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Volini Gel",
      manufacturer: "Sun Pharmaceutical Industries Ltd",
      saltComposition: "Diclofenac (1% w/w)",
      category: "Topical Analgesic",
      dosageForm: "Gel",
      strength: "30g",
      mrp: 105,
      hsncode: "30049099",
      drugSchedule: "OTC",
    },

    // Cipla Ltd Products
    {
      name: "Azee 500 Tablet",
      manufacturer: "Cipla Ltd",
      saltComposition: "Azithromycin (500mg)",
      category: "Antibiotic",
      dosageForm: "Tablet",
      strength: "500mg",
      mrp: 105.36,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Foracort 200 Inhaler",
      manufacturer: "Cipla Ltd",
      saltComposition: "Budesonide (200mcg) + Formoterol (6mcg)",
      category: "Respiratory",
      dosageForm: "Inhaler",
      strength: "200mcg+6mcg",
      mrp: 351,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Seroflo 250 Inhaler",
      manufacturer: "Cipla Ltd",
      saltComposition: "Fluticasone (250mcg) + Salmeterol (25mcg)",
      category: "Respiratory",
      dosageForm: "Inhaler",
      strength: "250mcg+25mcg",
      mrp: 461.04,
      hsncode: "30049099",
      drugSchedule: "H",
    },

    // Zydus Lifesciences Ltd Products
    {
      name: "Zedex Syrup",
      manufacturer: "Zydus Lifesciences Ltd",
      saltComposition:
        "Terbutaline (1.25mg) + Bromhexine (4mg) + Guaifenesin (50mg) + Menthol (2.5mg)",
      category: "Respiratory",
      dosageForm: "Syrup",
      strength: "100ml",
      mrp: 108,
      hsncode: "30049099",
      drugSchedule: "OTC",
    },
    {
      name: "Atorva 20 Tablet",
      manufacturer: "Zydus Lifesciences Ltd",
      saltComposition: "Atorvastatin (20mg)",
      category: "Lipid Lowering",
      dosageForm: "Tablet",
      strength: "20mg",
      mrp: 81.9,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Aciloc 150 Tablet",
      manufacturer: "Zydus Lifesciences Ltd",
      saltComposition: "Ranitidine (150mg)",
      category: "Antacid",
      dosageForm: "Tablet",
      strength: "150mg",
      mrp: 16.12,
      hsncode: "30049099",
      drugSchedule: "H",
    },

    // Mankind Pharma Ltd Products
    {
      name: "Manforce 50 Tablet",
      manufacturer: "Mankind Pharma Ltd",
      saltComposition: "Sildenafil (50mg)",
      category: "Erectile Dysfunction",
      dosageForm: "Tablet",
      strength: "50mg",
      mrp: 60,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Unwanted 72 Tablet",
      manufacturer: "Mankind Pharma Ltd",
      saltComposition: "Levonorgestrel (1.5mg)",
      category: "Contraceptive",
      dosageForm: "Tablet",
      strength: "1.5mg",
      mrp: 80,
      hsncode: "30049099",
      drugSchedule: "H",
    },
    {
      name: "Prega News",
      manufacturer: "Mankind Pharma Ltd",
      saltComposition: "Pregnancy Test Kit",
      category: "Diagnostic",
      dosageForm: "Kit",
      strength: "1 Test",
      mrp: 55,
      hsncode: "38220090",
      drugSchedule: "OTC",
    },
  ];

  // Object to store manufacturer name to ID mapping
  const manufacturerIds = {};

  // Create manufacturers and map their IDs
  for (const manufacturer of manufacturers) {
    const manufacturerId = await createManufacturer(
      manufacturer.name,
      manufacturer.gst,
      manufacturer.pan,
      manufacturer.drugLicense
    );
    if (manufacturerId) {
      manufacturerIds[manufacturer.name] = manufacturerId; // Map name to ID
    }
  }

  // Create products using manufacturer names to find IDs
  for (const product of products) {
    const manufacturerId = manufacturerIds[product.manufacturer]; // Get ID using name
    if (manufacturerId) {
      await createProduct(
        manufacturerId,
        product.name,
        product.saltComposition, // Pass the saltComposition to createProduct
        product.category,
        product.dosageForm,
        product.strength,
        product.mrp,
        product.hsncode,
        product.drugSchedule
      );
    } else {
      console.error(`Manufacturer not found for product: ${product.name}`);
    }
  }

  return Object.values(manufacturerIds);
};
