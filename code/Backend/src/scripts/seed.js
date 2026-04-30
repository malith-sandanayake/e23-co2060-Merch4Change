import mongoose from "mongoose";
import Product from "../models/Product.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/merch4change";
const brandId = "69dd13f5afde655c22cac674";

const products = [
  {
    name: "Aventador Carbon Chronograph",
    description: "Hand-crafted carbon fiber chronograph inspired by the Lamborghini Aventador SVJ. Each piece is individually numbered.",
    price: 8500,
    stock: 5,
    brandId,
    isLimitedEdition: true,
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",
  },
  {
    name: "Submariner Midnight Edition",
    description: "Rolex Submariner collaboration piece. Deep black dial, ceramic bezel, Oystersteel bracelet. Only 50 produced worldwide.",
    price: 12000,
    stock: 3,
    brandId,
    isLimitedEdition: true,
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600",
  },
  {
    name: "Chiron Heritage Leather Wallet",
    description: "Full-grain Nappa leather wallet crafted in Bugatti's Molsheim atelier. Carbon fiber inlay, hand-stitched edges.",
    price: 3200,
    stock: 25,
    brandId,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
  },
  {
    name: "Prancing Horse Silk Scarf",
    description: "Ferrari-licensed 100% Mulberry silk scarf. Features the iconic Prancing Horse motif woven in 24-karat gold thread.",
    price: 1800,
    stock: 40,
    brandId,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600",
  },
  {
    name: "Continental GT Cufflinks",
    description: "Sterling silver cufflinks featuring the Bentley B emblem. Hand-polished finish, presented in a bentley walnut veneer box.",
    price: 2400,
    stock: 30,
    brandId,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
  },
  {
    name: "Phantom Cashmere Throw",
    description: "Rolls-Royce commissioned cashmere throw. Double-woven Scottish cashmere, Ghost White colorway, monogrammed RR corner badge.",
    price: 6500,
    stock: 8,
    brandId,
    isLimitedEdition: true,
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600",
  },
  {
    name: "F1 Pit Lane Race Jacket",
    description: "Mercedes-AMG Petronas F1 Team official pit lane jacket. Worn by the crew at the 2024 Monaco Grand Prix. Individually certified.",
    price: 4200,
    stock: 15,
    brandId,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
  },
  {
    name: "911 Turbo Titanium Pen",
    description: "Porsche Design titanium fountain pen. Inspired by the 911 Turbo S engine. Comes with Porsche Design leather case.",
    price: 950,
    stock: 50,
    brandId,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600",
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  console.log("Cleared existing products");

  const created = await Product.insertMany(products);
  console.log(`✅ Seeded ${created.length} luxury products`);

  await mongoose.disconnect();
  console.log("🎉 Done!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});