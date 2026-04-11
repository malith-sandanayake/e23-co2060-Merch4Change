import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
<<<<<<< HEAD
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 60,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 60,
    },
    fullName: {
=======
>>>>>>> backend
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
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
