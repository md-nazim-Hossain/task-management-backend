import express from "express";
import { ENUM_USER_ROLE } from "../../../types/enum";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth.middleware";
import { AuthController } from "./auth.controller";
const { ADMIN, FACULTY, STUDENT, SUPER_ADMIN } = ENUM_USER_ROLE;

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);
router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(STUDENT, SUPER_ADMIN, FACULTY, ADMIN),
  AuthController.changePassword
);

export const AuthRoutes = router;
