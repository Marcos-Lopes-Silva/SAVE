import { connectToMongoDB } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import Survey from "../../../../models/surveyModel";
import { requireAdmin } from "@/lib/apiAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToMongoDB();

    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const session = await requireAdmin(req, res);
    if (!session) return;

    const body = { ...req.body, author: session.user._id };

    try {
        const survey = await Survey.create(body);

        return res.status(201).json(survey);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}