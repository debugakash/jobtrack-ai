import { Request, Response } from "express";

import { getAnalytics } from "../services/analytics.service.js";

export async function getAnalyticsController(req: Request, res: Response) {
  const range =
    req.query.range === "all" ? "all" : Number(req.query.range ?? 365);

  const analytics = await getAnalytics(req.user!.userId, range);

  return res.json({
    success: true,
    data: analytics,
  });
}
