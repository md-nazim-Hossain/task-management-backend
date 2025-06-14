import express from "express";
import { ENUM_USER_ROLE } from "../../../types/enum";
import auth from "../../middlewares/auth.middleware";
import { Request, Response } from "express";

const { ADMIN, FACULTY, SUPER_ADMIN } = ENUM_USER_ROLE;

const router = express.Router();

router.get(
  "/me",
  auth(ADMIN, FACULTY, SUPER_ADMIN),
  async (req: Request, res: Response) => {
    const user = (req as Request & { user: { id: string; role: string } }).user;

    console.log(user.id, user.role); // ✅ Safe to access
    res.send({ user });
  }
);

export const UserRoutes = router;
