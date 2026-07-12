import { connectToMongoDB } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import Survey from "../../../../models/surveyModel";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToMongoDB();

    const { id } = req.query;

    const objectId = new mongoose.Types.ObjectId(id as string);

    switch (req.method) {
        case "GET":
            // Public: survey structure (title/pages/questions) is used by the
            // public /researches filter panel and results page for anonymous
            // visitors, in addition to logged-in dashboards. No PII here.
            try {
                return res.status(200).json(await Survey.findById(objectId));
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        case "PATCH":
            if (!(await requireAdmin(req, res))) return;
            try {
                return res.status(200).json(await Survey.findByIdAndUpdate(objectId, { $set: req.body }, { returnOriginal: false, upsert: true }));
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        case "DELETE":
            if (!(await requireAdmin(req, res))) return;
            try {
                return res.status(200).json(await Survey.findByIdAndDelete(objectId));
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}