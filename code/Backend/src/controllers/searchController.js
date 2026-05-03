import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/apiResponse.js";
import User from "../models/User.js";
import Charity from "../models/Charity.js";
import Project from "../models/Project.js";
import Product from "../models/Product.js";
import Donation from "../models/Donation.js";
import Brand from "../models/Brand.js";

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchAll = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (q.length < 2) throw new AppError("Query must be at least 2 characters.", 400, "VALIDATION_ERROR");

  const regex = new RegExp(escapeRegex(q), "i");
  const isAdmin = !!(req.user && req.user.role === "admin");

  // run queries in parallel
  const userFilters = [{ userName: regex }];
  if (isAdmin) userFilters.push({ email: regex });
  const userPromise = User.find({
    $or: userFilters,
  })
    .limit(4)
    .select("firstName lastName userName email role");

  const charitiesPromise = Charity.find({
    $or: [{ publicName: regex }, { contactEmail: regex }],
  })
    .limit(4)
    .select("publicName contactEmail website ownerUserId");

  const projectsPromise = Project.find({
    $or: [{ title: regex }, { description: regex }],
  })
    .limit(4)
    .select("title charityId collectedAmount goalAmount");

  const productsPromise = Product.find({
    $or: [{ name: regex }, { description: regex }],
  })
    .limit(4)
    .select("name price brandId");

  const [users, charities, projects, products] = await Promise.all([
    userPromise,
    charitiesPromise,
    projectsPromise,
    productsPromise,
  ]);

  // compute totalRaised for charities (sum donations)
  const charityIds = (charities || []).map((c) => c._id);
  let charityTotals = {};
  if (charityIds.length) {
    const agg = await Donation.aggregate([
      { $match: { charityId: { $in: charityIds } } },
      { $group: { _id: "$charityId", total: { $sum: "$coinAmount" } } },
    ]);
    agg.forEach((a) => { charityTotals[String(a._id)] = a.total; });
  }

  // populate charity and owner usernames for profile routing
  const charityMap = {};
  const charityOwnerMap = {};
  const charityOwnerUserIds = [];
  (charities || []).forEach((c) => {
    charityMap[String(c._id)] = c.publicName;
    if (c.ownerUserId) charityOwnerUserIds.push(c.ownerUserId);
  });

  if (charityOwnerUserIds.length) {
    const ownerUsers = await User.find({ _id: { $in: charityOwnerUserIds } }).select("userName");
    const ownerById = {};
    ownerUsers.forEach((u) => {
      ownerById[String(u._id)] = u.userName;
    });
    (charities || []).forEach((c) => {
      charityOwnerMap[String(c._id)] = ownerById[String(c.ownerUserId)] || "";
    });
  }

  // populate project charity name
  if (projects && projects.length) {
    const charityIdsForProjects = projects.map((p) => p.charityId).filter(Boolean);
    const charityDocs = await Charity.find({ _id: { $in: charityIdsForProjects } }).select("publicName ownerUserId");
    charityDocs.forEach((c) => { charityMap[String(c._id)] = c.publicName; });

    const missingOwnerUserIds = charityDocs.map((c) => c.ownerUserId).filter(Boolean);
    if (missingOwnerUserIds.length) {
      const ownerUsers = await User.find({ _id: { $in: missingOwnerUserIds } }).select("userName");
      const ownerById = {};
      ownerUsers.forEach((u) => {
        ownerById[String(u._id)] = u.userName;
      });
      charityDocs.forEach((c) => {
        charityOwnerMap[String(c._id)] = ownerById[String(c.ownerUserId)] || charityOwnerMap[String(c._id)] || "";
      });
    }
  }

  // populate product vendor (brand) names
  const brandIds = (products || []).map((p) => p.brandId).filter(Boolean);
  const brandMap = {};
  if (brandIds.length) {
    const brands = await Brand.find({ _id: { $in: brandIds } }).select("brandName");
    brands.forEach((b) => { brandMap[String(b._id)] = b.brandName; });
  }

  // shape results
  const shapedUsers = (users || []).map((u) => ({
    id: String(u._id),
    userName: u.userName,
    email: isAdmin ? u.email : "",
    role: u.role,
    firstName: u.firstName,
    lastName: u.lastName,
  }));

  const shapedCharities = (charities || []).map((c) => ({
    id: String(c._id),
    name: c.publicName,
    userName: charityOwnerMap[String(c._id)] || "",
    contactEmail: c.contactEmail,
    website: c.website,
    totalRaised: charityTotals[String(c._id)] || 0,
  }));

  const shapedProjects = (projects || []).map((p) => ({
    id: String(p._id),
    name: p.title,
    charityName: charityMap[String(p.charityId)] || "",
    charityUserName: charityOwnerMap[String(p.charityId)] || "",
    progress: p.goalAmount ? Math.round((p.collectedAmount / p.goalAmount) * 100) : 0,
  }));

  const shapedProducts = (products || []).map((p) => ({
    id: String(p._id),
    name: p.name,
    price: p.price,
    vendor: brandMap[String(p.brandId)] || "",
  }));

  const results = {
    users: shapedUsers,
    charities: shapedCharities,
    projects: shapedProjects,
    products: shapedProducts,
    totalCount: (shapedUsers.length + shapedCharities.length + shapedProjects.length + shapedProducts.length),
  };

  return successResponse(res, 200, "Search results fetched.", { query: q, results });
});

export default { searchAll };
