import { Request } from "express";
import multer from "multer";

type FileFilterCallback = (error: Error | null, path: string) => void;
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
