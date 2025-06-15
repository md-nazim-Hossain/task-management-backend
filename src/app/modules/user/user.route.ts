import express from "express";
import { UserController } from "./user.controller";
import { ENUM_USER_ROLE } from "../../../types/enum";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth.middleware";
import { UserValidation } from "./user.validation";
const { ADMIN, USER, SUPER_ADMIN } = ENUM_USER_ROLE;

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createdUser
);

router.get("/my-profile", auth(USER), UserController.getMyProfile);

router.get("/", auth(ADMIN, USER, SUPER_ADMIN), UserController.getAllUsers);

router.get(
  "/:id",
  auth(ADMIN, USER, SUPER_ADMIN),
  UserController.getSingleUser
);

router.patch(
  "/:id",
  validateRequest(UserValidation.createUserZodSchema),
  auth(ADMIN, USER, SUPER_ADMIN),
  UserController.updateUser
);

router.delete("/:id", auth(ADMIN, SUPER_ADMIN), UserController.deleteUser);

export const UserRoutes = router;
