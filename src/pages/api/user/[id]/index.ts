import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectToMongoDB } from "@/lib/db";
import User from "../../../../../models/userModel";
import { requireSession } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToMongoDB();
  const { id } = req.query;

  const session = await requireSession(req, res);
  if (!session) return;

  const isSelf = mongoose.isValidObjectId(id as string)
    ? session.user._id?.toString() === (id as string)
    : session.user.email === id;
  const isAdmin = session.user.role === "admin" && session.user.verified;

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  switch (req.method) {
    case "GET":
      try {
        const filter = mongoose.isValidObjectId(id as string)
          ? { _id: new mongoose.Types.ObjectId(id as string) }
          : { email: id };

        const user = await User.findOne(filter).lean();

        return res.status(200).json(user);
      } catch (error) {
        console.error("Erro no GET /api/user/[id]:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

    case "PATCH":
      try {
        const { name, email, phone, birthday, course, graduationYear, cpf } = req.body;

        const updateData: any = {
          name,
          email,
          cpf,
          phone: phone ? parseInt(phone, 10) : null,
          birthday,
          course: course?.trim() || "",
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        };

        const user = await User.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(id as string) },
          { $set: updateData },
          {
            new: true,
            runValidators: true,
            context: "query",
          }
        );

        if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado." });
        }
        return res.status(200).json(user);
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }

    case "DELETE":
      try {
        await User.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id as string) });
        return res.status(204).end();
      } catch (error) {
        console.error("Erro no DELETE /api/user/[id]:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

    default:
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
