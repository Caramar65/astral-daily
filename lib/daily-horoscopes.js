const SIGNS = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
];

function colombiaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function requireServerConfig() {
  const missing = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"].filter(
    (key) => !process.env[key]
  );
  if (missing.length) {
    const error = new Error(`Missing environment variables: ${missing.join(", ")}`);
    error.statusCode = 503;
    throw error;
  }
}

async function supabaseRequest(path, options = {}) {
  requireServerConfig();
  const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${details.slice(0, 500)}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function getDailyHoroscopes(date = colombiaDate()) {
  const rows = await supabaseRequest(
    `daily_horoscopes?select=sign,content,generated_at&horoscope_date=eq.${date}`
  );
  const horoscopes = {};
  for (const row of rows || []) horoscopes[row.sign] = row.content;
  return { date, horoscopes, count: Object.keys(horoscopes).length };
}

async function refreshDailyHoroscopes() {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("Missing environment variable: OPENAI_API_KEY");
    error.statusCode = 503;
    throw error;
  }

  const date = colombiaDate();
  const existing = await getDailyHoroscopes(date);
  if (existing.count === SIGNS.length) {
    return { date, count: existing.count, skipped: true };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Eres el redactor de Astral Daily, una aplicación de entretenimiento astrológico en español natural de Colombia. Escribe horóscopos diarios originales, cálidos, útiles y variados. No afirmes que predicen hechos con certeza ni des consejos médicos, legales o financieros profesionales. Devuelve únicamente JSON válido con una propiedad horoscopes que sea un arreglo de exactamente 12 objetos. Cada objeto debe incluir sign, energy, love, money, wellness, advice, color, number y mood. Usa exactamente estos nombres de signo: Aries, Tauro, Géminis, Cáncer, Leo, Virgo, Libra, Escorpio, Sagitario, Capricornio, Acuario, Piscis. Cada texto debe ser distinto y específico para la fecha; energy, love, money, wellness y advice deben tener entre 1 y 3 frases. color debe ser un nombre breve en español, number un entero de 1 a 99 y mood un entero entre 50 y 99. No incluyas Markdown."
        },
        {
          role: "user",
          content: `Genera los 12 horóscopos originales para hoy ${date} en la zona horaria America/Bogota. Deben ser distintos de mensajes genéricos repetidos y cubrir el día actual. Devuelve JSON con la forma {"horoscopes":[{"sign":"Aries","energy":"...","love":"...","money":"...","wellness":"...","advice":"...","color":"...","number":7,"mood":85}]}.`
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${details.slice(0, 500)}`);
  }

  const payload = await response.json();
  const raw = payload.choices?.[0]?.message?.content;
  if (!raw) throw new Error("OpenAI returned an empty horoscope response");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI returned invalid JSON for daily horoscopes");
  }

  const items = parsed.horoscopes;
  if (!Array.isArray(items) || items.length !== SIGNS.length) {
    throw new Error("Expected exactly 12 daily horoscopes");
  }

  const bySign = new Map(items.map((item) => [item.sign, item]));
  const rows = SIGNS.map((sign) => {
    const item = bySign.get(sign);
    if (!item || ["energy", "love", "money", "wellness", "advice", "color"].some(
      (field) => typeof item[field] !== "string" || !item[field].trim()
    )) {
      throw new Error(`Invalid horoscope content for ${sign}`);
    }
    const number = Number(item.number);
    const mood = Number(item.mood);
    if (!Number.isInteger(number) || number < 1 || number > 99 ||
        !Number.isInteger(mood) || mood < 50 || mood > 99) {
      throw new Error(`Invalid number or mood for ${sign}`);
    }
    return {
      horoscope_date: date,
      sign,
      content: {
        energy: item.energy.trim(),
        love: item.love.trim(),
        money: item.money.trim(),
        wellness: item.wellness.trim(),
        advice: item.advice.trim(),
        color: item.color.trim(),
        number,
        mood,
      },
      generated_at: new Date().toISOString(),
    };
  });

  await supabaseRequest("daily_horoscopes?on_conflict=horoscope_date,sign", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });

  return { date, count: rows.length, skipped: false };
}

module.exports = { getDailyHoroscopes, refreshDailyHoroscopes, colombiaDate };
