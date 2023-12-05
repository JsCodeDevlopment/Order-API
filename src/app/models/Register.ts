import { model, Schema } from "mongoose";
import { IRegister } from "../../interfaces/IRegister";

export const Register = model<IRegister>(
  "Register",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    rule: {
      type: String,
      enum: ["ADM", "USER"],
      default: "USER",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: String,
      default: null,
    },
  })
);
