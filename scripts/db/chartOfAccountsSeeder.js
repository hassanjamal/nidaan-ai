import { centralDb, generateId } from "./dbConfig.js";

const createChartOfAccount = async (
  parentId,
  name,
  accountType,
  accountCode
) => {
  const account = {
    _id: generateId("coa_"),
    type: "chart_of_accounts",
    parent_id: parentId,
    name: name,
    account_type: accountType,
    account_code: accountCode,
  };

  try {
    const response = await centralDb.put(account);
    if (response.ok) {
      console.log(`Chart of Account created: ${name}`);
      return account._id;
    }
  } catch (error) {
    console.error(`Error creating Chart of Account ${name}:`, error);
  }
  return null;
};

export const seedChartOfAccounts = async () => {
  const accounts = [
    {
      name: "Assets",
      type: "Asset",
      code: "1000",
      children: [
        {
          name: "Current Assets",
          type: "Asset",
          code: "1100",
          children: [
            { name: "Cash", type: "Asset", code: "1110" },
            { name: "Bank", type: "Asset", code: "1120" },
            { name: "Inventory", type: "Asset", code: "1130" },
            { name: "Accounts Receivable", type: "Asset", code: "1140" },
          ],
        },
        {
          name: "Fixed Assets",
          type: "Asset",
          code: "1200",
          children: [
            { name: "Equipment", type: "Asset", code: "1210" },
            { name: "Furniture", type: "Asset", code: "1220" },
          ],
        },
      ],
    },
    {
      name: "Liabilities",
      type: "Liability",
      code: "2000",
      children: [
        {
          name: "Current Liabilities",
          type: "Liability",
          code: "2100",
          children: [
            { name: "Accounts Payable", type: "Liability", code: "2110" },
            { name: "Taxes Payable", type: "Liability", code: "2120" },
          ],
        },
      ],
    },
    {
      name: "Income",
      type: "Income",
      code: "3000",
      children: [{ name: "Sales", type: "Income", code: "3100" }],
    },
    {
      name: "Expenses",
      type: "Expense",
      code: "4000",
      children: [
        { name: "Cost of Goods Sold", type: "Expense", code: "4100" },
        {
          name: "Operating Expenses",
          type: "Expense",
          code: "4200",
          children: [
            { name: "Salaries", type: "Expense", code: "4210" },
            { name: "Rent", type: "Expense", code: "4220" },
            { name: "Utilities", type: "Expense", code: "4230" },
          ],
        },
      ],
    },
  ];

  const createAccountsRecursively = async (accounts, parentId = null) => {
    for (const account of accounts) {
      const accountId = await createChartOfAccount(
        parentId,
        account.name,
        account.type,
        account.code
      );
      if (account.children) {
        await createAccountsRecursively(account.children, accountId);
      }
    }
  };

  await createAccountsRecursively(accounts);
};
