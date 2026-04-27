import mongoose from "mongoose";
import Product from "../models/Product.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/merch4change";

const brandId = "69dd13f5afde655c22cac674";

const products = [
  {
    name: "Eco Tote Bag",
    description: "Reusable organic cotton tote bag. Perfect for everyday use.",
    price: 1200,
    stock: 50,
    brandId,
    isLimitedEdition: false,
  },
  {
    name: "Bamboo Water Bottle",
    description: "Sustainable bamboo water bottle. Keeps drinks cold for 24hrs.",
    price: 2500,
    stock: 30,
    brandId,
    isLimitedEdition: false,
  },
  {
    name: "Organic Cotton Tee",
    description: "Fair-trade certified organic cotton t-shirt.",
    price: 1800,
    stock: 40,
    brandId,
    isLimitedEdition: false,
  },
  {
    name: "Recycled Notebook",
    description: "100% recycled paper notebook. 200 pages.",
    price: 800,
    stock: 100,
    brandId,
    isLimitedEdition: false,
  },
  {
    name: "Solar Lantern",
    description: "Portable solar-powered lantern. Charges in 6 hours.",
    price: 3500,
    stock: 20,
    brandId,
    isLimitedEdition: true,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  console.log("Cleared existing products");

  const created = await Product.insertMany(products);
  console.log(`✅ Seeded ${created.length} products`);

  await mongoose.disconnect();
  console.log("🎉 Done!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});