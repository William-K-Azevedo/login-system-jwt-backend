import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await req.headers?.authorization?.split(" ")[1];
    console.log("token:" + token);

    const decodedToken = await jwt.verify(token, "RANDON-TOKEN");
    console.log("decoded token:" + decodedToken);

    const user = await decodedToken;
    req.body.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json(error);
  }
};

export default VerifyToken;
