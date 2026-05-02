import UserDonation from "../models/UserDonation.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const getMyDonations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await UserDonation.countDocuments({ user: req.user._id });
  const donations = await UserDonation.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return successResponse(res, 200, "Donations fetched", {
    donations,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

export const getDonationStats = asyncHandler(async (req, res) => {
  const donations = await UserDonation.find({ user: req.user._id });

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const causesSupported = new Set(donations.map((d) => d.charity)).size;
  const donationCount = donations.length;

  const impactScore = Math.min(
    100,
    Math.round((totalDonated / 1000) * 0.4 + causesSupported * 10 * 0.4 + donationCount * 2 * 0.2)
  );

  // Derive ongoing projects from their donation history for now
  const projectsMap = new Map();
  for (const d of donations) {
    if (!projectsMap.has(d.project)) {
      projectsMap.set(d.project, {
        _id: d.project, // using name as id
        title: d.project,
        description: `Supporting ${d.charity}`,
        goalAmount: 5000000, // mock goal
        collectedAmount: Math.floor(Math.random() * 4000000) + 1000000, // mock progress
        userContribution: d.amount,
      });
    } else {
      projectsMap.get(d.project).userContribution += d.amount;
    }
  }

  // Ensure we at least return some mock ongoing projects if they have no donations
  // but the prompt implies we can just return empty array if no donations.
  const ongoingProjects = Array.from(projectsMap.values());

  return successResponse(res, 200, "Donation stats fetched", {
    totalDonated,
    causesSupported,
    donationCount,
    impactScore,
    ongoingProjects,
  });
});

export const createDonation = asyncHandler(async (req, res) => {
  const { charity, project, amount } = req.body;

  if (typeof charity !== "string" || !charity.trim()) {
    throw new AppError("Charity is required and must be a string.", 400, "VALIDATION_ERROR", [
      { section: "body", message: "charity is required" },
    ]);
  }

  if (typeof project !== "string" || !project.trim()) {
    throw new AppError("Project is required and must be a string.", 400, "VALIDATION_ERROR", [
      { section: "body", message: "project is required" },
    ]);
  }

  if (typeof amount !== "number" || amount < 100) {
    throw new AppError("Amount is required and must be at least 100.", 400, "VALIDATION_ERROR", [
      { section: "body", message: "amount must be at least 100" },
    ]);
  }

  const donation = await UserDonation.create({
    user: req.user._id,
    charity,
    project,
    amount,
    status: "processing", // default is processing per schema
  });

  return successResponse(res, 201, "Donation successful.", donation);
});
