import { NextApiRequest, NextApiResponse } from "next";
import Group from "../../../../../models/groupModel";
import { createSearchHash } from "@/lib/crypto";
import { requireSession } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!(await requireSession(req, res))) return;

    const { cpf } = req.body;

    if (!cpf || typeof cpf !== "string") {
        return res.status(400).json({ message: "CPF is required" });
    }

    if (cpf.length !== 11) {
        return res.status(400).json({ message: "Invalid CPF" });
    }

    try {
        const cpfSearch = createSearchHash(cpf);

        const group = await Group.findOne(
            { "members.cpf_search": cpfSearch },
            { "members.$": 1 }
        );

        if (!group || !group.members.length) {
            return res.status(404).json({ message: "CPF not found" });
        }

        // Only the hash needed to link the account is returned — no name,
        // email, RG, birth date or group info, since any logged-in user
        // (not just the CPF's owner) can reach this endpoint and none of
        // that belongs to them just because they typed a matching CPF.
        return res.status(200).json({
            message: "CPF found",
            member: { cpf: group.members[0].cpf },
        });
    } catch (error) {
        console.error("Error verifying CPF:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
