import { NextApiRequest, NextApiResponse } from "next";
import { connectToMongoDB } from "@/lib/db";
import Group from "../../../../models/groupModel";
import { hashNewMembersCpf, isCpfHashed } from "@/lib/groupMembers";
import { requireAdmin } from "@/lib/apiAuth";

// One-off repair endpoint: backfills cpf hash + cpf_search for members that
// were saved with a plain-text cpf by the group PATCH endpoint before it
// hashed members on update. Safe to run more than once — members that
// already carry a bcrypt hash are left untouched.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await connectToMongoDB();

    if (!(await requireAdmin(req, res))) return;

    try {
        const groups = await Group.find({}).lean();

        let groupsFixed = 0;
        let membersFixed = 0;
        const fixedGroups: { id: string; name: string; members: number }[] = [];

        for (const group of groups) {
            const pendingCount = (group.members || []).filter((m) => !isCpfHashed(m.cpf)).length;
            if (pendingCount === 0) continue;

            const fixedMembers = await hashNewMembersCpf(group.members);

            await Group.findByIdAndUpdate(group._id, { $set: { members: fixedMembers } });

            groupsFixed++;
            membersFixed += pendingCount;
            fixedGroups.push({ id: group._id.toString(), name: group.name, members: pendingCount });
        }

        return res.status(200).json({ message: "OK", groupsFixed, membersFixed, fixedGroups });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
