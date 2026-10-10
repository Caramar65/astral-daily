const { getDailyHoroscopes } = require("../lib/daily-horoscopes.js");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await getDailyHoroscopes();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to load daily horoscopes:", error.message);
    return res.status(error.statusCode || 500).json({
      error: "No se pudieron cargar los horóscopos diarios.",
      code: error.statusCode === 503 ? "CONFIGURATION_REQUIRED" : "HOROSCOPES_UNAVAILABLE",
    });
  }
};
