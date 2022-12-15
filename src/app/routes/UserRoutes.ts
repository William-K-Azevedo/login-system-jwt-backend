import {
  AddUser,
  DeleteUser,
  GetUsers,
  Login,
} from "../controllers/UserController";
import { Router } from "express";
import VerifyToken from "../controllers/VerifyTokenController";

const arquivoRouter = Router();

arquivoRouter.get("/get-users", VerifyToken, GetUsers);
arquivoRouter.delete("/delete-user", DeleteUser);
arquivoRouter.post("/register", AddUser);
arquivoRouter.post("/login", Login);

export default arquivoRouter;
