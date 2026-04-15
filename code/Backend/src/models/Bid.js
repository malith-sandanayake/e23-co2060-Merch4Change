import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

const Bid = mongoose.model("Bid", bidSchema);

export default Bid;
