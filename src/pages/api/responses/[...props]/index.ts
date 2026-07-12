import { connectToMongoDB } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import SurveyResult from "../../../../../models/surveyResultModel";
import { requireSession } from "@/lib/apiAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToMongoDB();

    const session = await requireSession(req, res);
    if (!session) return;

    const { surveyId, userId } = req.query;

    const isSelf = session.user._id?.toString() === userId;
    const isAdmin = session.user.role === "admin" && session.user.verified;

    if (!isSelf && !isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const responses = await SurveyResult.findOne({ surveyId, userId });

        if (!responses) res.status(200);

        res.status(200).json(responses);
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: 'Internal server error' });
    }

}