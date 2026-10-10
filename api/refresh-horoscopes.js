import { refreshDailyHoroscopes } from '../lib/daily-horoscopes.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel Cron sends CRON_SECRET as a Bearer token. Keep supporting
  // the dedicated job token for manual or external refresh requests.
  const authorization = req.headers.authorization;
  const validTokens = [process.env.HOROSCOPE_JOB_TOKEN, process.env.CRON_SECRET]
    .filter(Boolean);
  if (!validTokens.some((token) => authorization === `Bearer ${token}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await refreshDailyHoroscopes();
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error('Daily horoscopes refresh failed:', error.message);
    return res.status(error.statusCode || 500).json({ ok: false, error: error.message || 'Daily horoscope refresh failed' });
  }
};
