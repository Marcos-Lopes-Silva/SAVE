import { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongoDB } from '@/lib/db';
import Group from '../../../../models/groupModel';
import { hashNewMembersCpf } from '@/lib/groupMembers';
import { requireAdmin } from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToMongoDB();

    if (!(await requireAdmin(req, res))) return;

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        switch (req.method) {
            case "GET":
                const group = await Group.findById(id);
                return res.status(200).json(group);

            case "PATCH":
                const patchBody = { ...req.body };

                if (Array.isArray(patchBody.members)) {
                    patchBody.members = await hashNewMembersCpf(patchBody.members);
                }

                const updatedGroup = await Group.findByIdAndUpdate(
                    id,
                    { $set: patchBody },
                    { new: true }
                );

                return res.status(200).json(updatedGroup);

            case "DELETE":
                await Group.findByIdAndDelete(id);
                return res.status(204).end();

            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}