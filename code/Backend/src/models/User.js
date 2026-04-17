import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },  

    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    accountType: {
      type: String,
      enum: ["individual", "organization"],
      default: "individual",
    },
    role: {
      type: String,
      enum: ["user", "brand", "charity", "admin"],
      default: "user",
      index: true,
    },
    coinBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", function assignDefaultRole(next) {
  if (this.isNew && this.accountType === "organization") {
    this.role = "brand";
  } else if (this.isModified("accountType")) {
    this.role = this.accountType === "organization" ? "brand" : "user";
  }
  next();
});

userSchema.virtual("fullName").get(function fullNameGetter() {
  return `${this.firstName} ${this.lastName}`.trim();
});

const User = mongoose.model("User", userSchema);

export default User;
