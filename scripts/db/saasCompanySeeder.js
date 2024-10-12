import { centralDb, generateId } from "./dbConfig.js";
import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const createSaasAdmin = async () => {
  const adminEmail = "admin@saas.com";

  try {
    // Check if an admin with this email already exists
    const existingAdmin = await centralDb.find({
      selector: {
        type: "saas_user",
        email: adminEmail,
      },
    });

    if (existingAdmin.docs.length > 0) {
      console.log("SaaS admin already exists.");
      return existingAdmin.docs[0]._id;
    }

    const saasAdmin = {
      _id: generateId("saas_user_"),
      type: "saas_user",
      username: "admin",
      email: adminEmail,
      password: await hashPassword("admin_password"),
      role: "admin",
    };

    console.log("Attempting to create SaaS admin:", saasAdmin);
    const response = await centralDb.put(saasAdmin);
    console.log("PouchDB put response:", response);

    if (response.ok) {
      console.log("SaaS admin created successfully.");
      const createdDoc = await centralDb.get(saasAdmin._id);
      console.log("Fetched SaaS admin:", createdDoc);
      return createdDoc._id;
    } else {
      console.error("Failed to create SaaS admin. Response not OK:", response);
      throw new Error("Failed to create SaaS admin.");
    }
  } catch (error) {
    console.error("Error creating SaaS admin:", error);
    throw error;
  }
};

export const seedSaasCompany = async () => {
  try {
    const saasAdminId = await createSaasAdmin();
    console.log("SaaS admin created or found with ID:", saasAdminId);
    return saasAdminId;
  } catch (error) {
    console.error("Error seeding SaaS company:", error);
    return null;
  }
};
