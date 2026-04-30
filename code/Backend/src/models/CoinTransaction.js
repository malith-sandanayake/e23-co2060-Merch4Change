import mongoose from "mongoose";

const coinTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["earn", "donate", "adjust"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    refType: {
      type: String,
      enum: ["order", "donation", "manual"],
      default: "manual",
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

coinTransactionSchema.index({ userId: 1, createdAt: -1 });

const CoinTransaction = mongoose.model("CoinTransaction", coinTransactionSchema);

export default CoinTransaction;
