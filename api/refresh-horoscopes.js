import { refreshDailyHoroscopes } from '../lib/daily-horoscopes.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const token = process.env.HOROSCOPE_JOB_TOKEN;
  if (!token || req.headers.authorization !== `Bearer ${token}`) {
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
