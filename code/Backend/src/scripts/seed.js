import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import OrganizationProfile from "../models/OrganizationProfile.js";
import Brand from "../models/Brand.js";
import Charity from "../models/Charity.js";
import Product from "../models/Product.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/merch4change";

const luxuryProductsData = [
  {
    name: "Aventador Carbon Chronograph",
    description: "Hand-crafted carbon fiber chronograph inspired by the Lamborghini Aventador SVJ. Each piece is individually numbered.",
    price: 8500,
    stock: 5,
    isLimitedEdition: true,
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",
  },
  {
    name: "Submariner Midnight Edition",
    description: "Rolex Submariner collaboration piece. Deep black dial, ceramic bezel, Oystersteel bracelet. Only 50 produced worldwide.",
    price: 12000,
    stock: 3,
    isLimitedEdition: true,
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600",
  },
  {
    name: "Chiron Heritage Leather Wallet",
    description: "Full-grain Nappa leather wallet crafted in Bugatti's Molsheim atelier. Carbon fiber inlay, hand-stitched edges.",
    price: 3200,
    stock: 25,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
  },
  {
    name: "Prancing Horse Silk Scarf",
    description: "Ferrari-licensed 100% Mulberry silk scarf. Features the iconic Prancing Horse motif woven in 24-karat gold thread.",
    price: 1800,
    stock: 40,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600",
  },
  {
    name: "Continental GT Cufflinks",
    description: "Sterling silver cufflinks featuring the Bentley B emblem. Hand-polished finish, presented in a bentley walnut veneer box.",
    price: 2400,
    stock: 30,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
  },
  {
    name: "Phantom Cashmere Throw",
    description: "Rolls-Royce commissioned cashmere throw. Double-woven Scottish cashmere, Ghost White colorway, monogrammed RR corner badge.",
    price: 6500,
    stock: 8,
    isLimitedEdition: true,
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600",
  },
  {
    name: "F1 Pit Lane Race Jacket",
    description: "Mercedes-AMG Petronas F1 Team official pit lane jacket. Worn by the crew at the 2024 Monaco Grand Prix. Individually certified.",
    price: 4200,
    stock: 15,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
  },
  {
    name: "911 Turbo Titanium Pen",
    description: "Porsche Design titanium fountain pen. Inspired by the 911 Turbo S engine. Comes with Porsche Design leather case.",
    price: 950,
    stock: 50,
    isLimitedEdition: false,
    imageUrl: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Clear existing collections
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await OrganizationProfile.deleteMany({});
    await Brand.deleteMany({});
    await Charity.deleteMany({});
    await Product.deleteMany({});
    console.log("Existing data cleared.");

    // 2. Hash standard password
    const standardPassword = await bcrypt.hash("Password123!", 10);

    // 3. Seed Individual Users
    console.log("Seeding individual users...");
    const individuals = await User.insertMany([
      {
        firstName: "Sasha",
        lastName: "Kim",
        userName: "sashakim",
        email: "sasha@example.com",
        password: standardPassword,
        accountType: "individual",
        role: "user",
      },
      {
        firstName: "Aiden",
        lastName: "Silva",
        userName: "aidensilva",
        email: "aiden@example.com",
        password: standardPassword,
        accountType: "individual",
        role: "user",
      },
      {
        firstName: "Priya",
        lastName: "Nair",
        userName: "priyanair",
        email: "priya@example.com",
        password: standardPassword,
        accountType: "individual",
        role: "user",
      }
    ]);
    console.log(`✅ Seeded ${individuals.length} individual users.`);

    // 4. Seed Organizations (Users + Profiles + Brands)
    console.log("Seeding organizations...");
    const orgDataList = [
      { orgName: "Green Future Org", email: "contact@greenfuture.org", isCharity: true },
      { orgName: "EcoWear Brand", email: "hello@ecowear.com", isCharity: false },
      { orgName: "OceanSave Org", email: "support@oceansave.org", isCharity: true }
    ];

    const createdBrands = [];

    for (const org of orgDataList) {
      // Create User
      const orgUser = await User.create({
        firstName: org.orgName,
        lastName: "Organization",
        userName: org.orgName.toLowerCase().replace(/\s+/g, ""),
        email: org.email,
        password: standardPassword,
        accountType: "organization",
        role: org.isCharity ? "charity" : "brand",
      });

      // Create Organization Profile
      await OrganizationProfile.create({
        userId: orgUser._id,
        orgName: org.orgName,
        phone: "+1234567890",
        address: "123 Impact Street",
        website: `https://www.${orgUser.userName}.com`,
      });

      // Create Brand or Charity Record
      if (org.isCharity) {
        await Charity.create({
          ownerUserId: orgUser._id,
          publicName: org.orgName,
          verificationStatus: "verified",
        });
      } else {
        const brand = await Brand.create({
          ownerUserId: orgUser._id,
          brandName: org.orgName,
        });
        createdBrands.push(brand);
      }
    }
    console.log(`✅ Seeded ${createdBrands.length} organizations.`);

    // 5. Seed Products (assigned to EcoWear Brand)
    console.log("Seeding products...");
    const targetBrand = createdBrands.find(b => b.brandName === "EcoWear Brand") || createdBrands[0];
    
    const productsToInsert = luxuryProductsData.map(product => ({
      ...product,
      brandId: targetBrand._id
    }));

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ Seeded ${createdProducts.length} luxury products linked to ${targetBrand.brandName}.`);

    await mongoose.disconnect();
    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();