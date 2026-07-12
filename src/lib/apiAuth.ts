import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Any authenticated user. Writes a 401 and returns null if there's no session.
export async function requireSession(req: NextApiRequest, res: NextApiResponse): Promise<Session | null> {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return null;
    }

    return session;
}

// Admin role AND approved by a real admin (session.user.role can be
// self-selected at login, so role alone isn't enough — see /authenticate).
export async function requireAdmin(req: NextApiRequest, res: NextApiResponse): Promise<Session | null> {
    const session = await requireSession(req, res);
    if (!session) return null;

    if (session.user.role !== "admin" || !session.user.verified) {
        res.status(403).json({ message: "Forbidden" });
        return null;
    }

    return session;
}
