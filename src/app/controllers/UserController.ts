import prisma from "../../../prisma/prismaInstance";
import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const GetUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export const AddUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    console.log(hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    if (newUser) {
      console.log("new user:" + newUser);

      return res.status(200).json(newUser);
    } else {
      return res.status(401).json({
        message: "Erro ao registrar usuario",
      });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
        return res.status(500).json({
          error: "Email já existe",
        });
      }
    }
    return res.status(500).json(error);
  }
};

export const DeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        email: email,
      },
    });
    console.log(deletedUser);

    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    console.log(user);

    if (user) {
      const checkedPassword = await bcrypt.compare(senha, user.password);
      if (checkedPassword) {
        const token = await jwt.sign(
          {
            userId: user.id,
            userEmail: user.email,
          },
          "RANDON-TOKEN",
          { expiresIn: "24h" }
        );
        return res.status(200).json({
          message: "Login realizado com sucesso!",
          email: user.email,
          token,
        });
      } else {
        return res.status(400).json({
          message: "Senha incorreta!",
        });
      }
    } else {
      return res.status(400).json({
        message: "Email não existe!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
