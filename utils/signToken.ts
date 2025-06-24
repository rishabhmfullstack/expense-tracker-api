import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_EXPIRES_IN || "1d";

if (!jwtSecret) {
  throw new Error("JWT_SECRET not defined in environment variables");
}

export const signToken = (id: string): string => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiry });
};

