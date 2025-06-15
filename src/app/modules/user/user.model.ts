import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserMethods, UserModel } from "./user.interface";
import config from "../../../config";

const userSchema = new Schema<IUser, Record<string, unknown>, IUserMethods>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      required: [true, "role is required"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.methods.isUserExist = async function (
  email: string
): Promise<Pick<
  IUser,
  "_id" | "password" | "status" | "role" | "email"
> | null> {
  const user = await User.findOne(
    { email },
    { status: 1, _id: 1, password: 1, role: 1, email: 1 }
  ).lean();

  return user;
};

userSchema.methods.isPasswordMatch = async function (
  givenPass: string,
  savePassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPass, savePassword);
};

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.bycrypt_salt));
  next();
});

export const User = model<IUser, UserModel>("User", userSchema);
