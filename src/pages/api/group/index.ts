import { connectToMongoDB } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import Group from '../../../../models/groupModel';
import { hashNewMembersCpf } from '@/lib/groupMembers';
import { requireAdmin } from '@/lib/apiAuth';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToMongoDB();

    if (!(await requireAdmin(req, res))) return;

    switch (req.method) {
        case "POST":
            try {
                const newUsers = await hashNewMembersCpf(req.body.members);

                const group = await Group.create({ ...req.body, members: newUsers });

                return res.status(201).json(group);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        case "GET":
            try {
                const group = await Group.find({});
                return res.status(200).json(group);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}