import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DATABASE_URL,
  student_pass: process.env.DEFAULT_STUDENT_PASSWORD,
  faculty_pass: process.env.DEFAULT_FACULTY_PASSWORD,
  admin_pass: process.env.DEFAULT_ADMIN_PASSWORD,
  bycrypt_salt: process.env.BYCRYPT_SLAT,
  jwt: {
    secret: process.env.JWT_SECRET,
    secret_expire_in: process.env.JWT_EXPIRE_IN,
    refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
    refresh: process.env.JWT_REFRESH_SECRET,
  },
};
