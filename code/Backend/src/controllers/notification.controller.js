import Notification from "../models/Notification.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  return successResponse(res, 200, "Notifications fetched successfully.", { notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found.", 404, "NOTIFICATION_NOT_FOUND");
  }

  notification.isRead = true;
  await notification.save();

  return successResponse(res, 200, "Notification marked as read.", { notification });
});
