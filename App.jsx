// Astral Daily Premium Horoscope App
import React, { useEffect, useMemo, useState } from 'react';

const zodiacSigns = [
  {
    id: 'aries',
    name: 'Aries',
    emoji: '♈',
    gradient: 'from-red-500 via-orange-400 to-amber-300',
    compatibility: 'Leo',
  },
  {
    id: 'tauro',
    name: 'Tauro',
    emoji: '♉',
    gradient: 'from-green-500 via-emerald-400 to-lime-300',
    compatibility: 'Virgo',
  },
  {
    id: 'geminis',
    name: 'Géminis',
    emoji: '♊',
    gradient: 'from-yellow-400 via-amber-300 to-orange-300',
    compatibility: 'Libra',
  },
  {
    id: 'cancer',
    name: 'Cáncer',
    emoji: '♋',
    gradient: 'from-cyan-500 via-sky-400 to-blue-300',
    compatibility: 'Piscis',
  },
  {
    id: 'leo',
    name: 'Leo',
    emoji: '♌',
    gradient: 'from-orange-500 via-yellow-400 to-amber-300',
    compatibility: 'Aries',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    emoji: '♍',
    gradient: 'from-lime-500 via-green-400 to-emerald-300',
    compatibility: 'Tauro',
  },
  {
    id: 'libra',
    name: 'Libra',
    emoji: '♎',
    gradient: 'from-pink-500 via-rose-400 to-fuchsia-300',
    compatibility: 'Géminis',
  },
  {
    id: 'escorpio',
    name: 'Escorpio',
    emoji: '♏',
    gradient: 'from-purple-600 via-fuchsia-500 to-pink-400',
    compatibility: 'Cáncer',
  },
  {
    id: 'sagitario',
    name: 'Sagitario',
    emoji: '♐',
    gradient: 'from-indigo-500 via-violet-400 to-purple-300',
    compatibility: 'Acuario',
  },
  {
    id: 'capricornio',
    name: 'Capricornio',
    emoji: '♑',
    gradient: 'from-stone-500 via-zinc-400 to-slate-300',
    compatibility: 'Virgo',
  },
  {
    id: 'acuario',
    name: 'Acuario',
    emoji: '♒',
    gradient: 'from-sky-500 via-cyan-400 to-teal-300',
    compatibility: 'Sagitario',
  },
  {
    id: 'piscis',
    name: 'Piscis',
    emoji: '♓',
    gradient: 'from-violet-500 via-indigo-400 to-blue-300',
    compatibility: 'Cáncer',
  },
];

const horoscopeDatabase = {
  Aries: {
    energy: 'Tu energía está en expansión. Hoy sentirás el deseo de avanzar sin pedir permiso.',
    love: 'Una conversación intensa podría acercarte a alguien inesperadamente.',
    money: 'Es momento de tomar decisiones rápidas pero inteligentes.',
    wellness: 'Necesitas liberar tensión acumulada y descansar más.',
    advice: 'No confundas impulso con destino.',
    color: 'Rojo solar',
    number: 9,
    mood: 92,
  },
  Tauro: {
    energy: 'La estabilidad que buscas empieza a tomar forma esta semana.',
    love: 'Alguien cercano quiere más atención emocional de tu parte.',
    money: 'Un cambio financiero positivo se aproxima.',
    wellness: 'Tu cuerpo necesita más descanso y menos preocupaciones.',
    advice: 'La paciencia sigue siendo tu mejor herramienta.',
    color: 'Verde jade',
    number: 4,
    mood: 82,
  },
  Géminis: {
    energy: 'Tu mente estará llena de ideas y nuevas posibilidades.',
    love: 'Una conversación inesperada despertará emociones intensas.',
    money: 'Evita decisiones impulsivas relacionadas con compras.',
    wellness: 'Necesitas desconectarte un poco del ruido digital.',
    advice: 'No ignores lo que tu intuición ya sabe.',
    color: 'Amarillo astral',
    number: 5,
    mood: 88,
  },
  Cáncer: {
    energy: 'Las emociones estarán muy sensibles hoy, pero también más profundas.',
    love: 'Una conexión emocional podría fortalecerse.',
    money: 'Es momento de organizar prioridades financieras.',
    wellness: 'Necesitas más tranquilidad mental.',
    advice: 'No cargues emociones que no te pertenecen.',
    color: 'Azul océano',
    number: 2,
    mood: 79,
  },
  Leo: {
    energy: 'Tu presencia atraerá atención y oportunidades importantes.',
    love: 'Tu magnetismo estará más fuerte que nunca.',
    money: 'Una propuesta interesante podría llegar pronto.',
    wellness: 'Debes encontrar equilibrio entre descanso y productividad.',
    advice: 'Brillar también significa saber cuándo detenerte.',
    color: 'Dorado solar',
    number: 7,
    mood: 95,
  },
  Virgo: {
    energy: 'El orden mental te ayudará a tomar mejores decisiones.',
    love: 'Alguien aprecia mucho tu manera de cuidar a los demás.',
    money: 'Buen momento para organizar gastos y ahorrar.',
    wellness: 'Evita sobrecargarte de responsabilidades.',
    advice: 'No todo necesita perfección absoluta.',
    color: 'Verde oliva',
    number: 6,
    mood: 84,
  },
  Libra: {
    energy: 'Hoy buscarás armonía y equilibrio en todo lo que hagas.',
    love: 'Una nueva energía romántica podría aparecer.',
    money: 'Se acercan noticias positivas relacionadas con trabajo.',
    wellness: 'Necesitas tiempo para reconectar contigo.',
    advice: 'Elige siempre lo que te dé paz.',
    color: 'Rosa astral',
    number: 3,
    mood: 86,
  },
  Escorpio: {
    energy: 'Tu intuición estará más fuerte de lo habitual.',
    love: 'Sentimientos ocultos podrían salir a la luz.',
    money: 'Evita tomar riesgos innecesarios hoy.',
    wellness: 'Necesitas liberar emociones acumuladas.',
    advice: 'Tu transformación ya comenzó.',
    color: 'Morado eclipse',
    number: 8,
    mood: 90,
  },
  Sagitario: {
    energy: 'Tu deseo de aventura crecerá durante el día.',
    love: 'Alguien podría despertar emociones intensas e inesperadas.',
    money: 'Una nueva idea podría generar oportunidades.',
    wellness: 'Tu cuerpo necesita movimiento y actividad.',
    advice: 'Atrévete a romper la rutina.',
    color: 'Índigo cósmico',
    number: 1,
    mood: 89,
  },
  Capricornio: {
    energy: 'Tu disciplina dará resultados importantes esta semana.',
    love: 'Necesitas abrir un poco más tus emociones.',
    money: 'El trabajo constante empezará a dar frutos.',
    wellness: 'Tu mente necesita más pausas.',
    advice: 'Descansar también es avanzar.',
    color: 'Gris lunar',
    number: 10,
    mood: 81,
  },
  Acuario: {
    energy: 'Tu creatividad estará en uno de sus puntos más altos.',
    love: 'Podrías conectar con alguien totalmente diferente a ti.',
    money: 'Una idea innovadora podría traer beneficios.',
    wellness: 'Necesitas rodearte de personas positivas.',
    advice: 'No escondas quién eres realmente.',
    color: 'Turquesa cósmico',
    number: 11,
    mood: 91,
  },
  Piscis: {
    energy: 'Tu sensibilidad será una gran ventaja hoy.',
    love: 'Hay alguien pensando mucho más en ti de lo que imaginas.',
    money: 'Evita tomar decisiones emocionales con dinero.',
    wellness: 'Busca momentos de calma y tranquilidad.',
    advice: 'Tu intuición rara vez se equivoca.',
    color: 'Azul galáctico',
    number: 12,
    mood: 87,
  },
};

function EnergyBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-zinc-300">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>

      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function AstralDailyApp() {
  const [selectedSign, setSelectedSign] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    );
  }, []);

  const currentHoroscope = useMemo(() => {
    if (!selectedSign) return null;
    return horoscopeDatabase[selectedSign.name] || horoscopeDatabase.Aries;
  }, [selectedSign]);

  if (!selectedSign) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Astral Daily
        </h1>

        <p className="text-zinc-400 mb-10 text-center max-w-lg">
          Descubre tu energía astral diaria y recibe mensajes personalizados del universo.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
          {zodiacSigns.map((sign) => (
            <button
              key={sign.id}
              onClick={() => setSelectedSign(sign)}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="text-5xl mb-3">{sign.emoji}</div>
              <div className="font-bold text-lg">{sign.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-[32px] p-8">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setSelectedSign(null)}
            className="text-zinc-400 hover:text-white bg-white/5 border border-white/10 px-5 py-3 rounded-2xl transition-all"
          >
            ← Cambiar signo
          </button>

          <button
            onClick={() => setSelectedSign(null)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition-all"
          >
            🏠 Inicio
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-5xl font-black mb-2">{selectedSign.name}</h2>
            <p className="text-zinc-400 capitalize">{currentTime}</p>
          </div>

          <div className="text-7xl">{selectedSign.emoji}</div>
        </div>

        <div className="space-y-5">
          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <h3 className="text-xl font-bold mb-3">✨ Energía</h3>
            <p>{currentHoroscope.energy}</p>
          </div>

          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <h3 className="text-xl font-bold mb-3">❤️ Amor</h3>
            <p>{currentHoroscope.love}</p>
          </div>

          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <h3 className="text-xl font-bold mb-3">💰 Dinero</h3>
            <p>{currentHoroscope.money}</p>
          </div>

          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <h3 className="text-xl font-bold mb-3">🌿 Bienestar</h3>
            <p>{currentHoroscope.wellness}</p>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-6">
            <h3 className="text-2xl font-bold mb-3">🔮 Consejo Astral</h3>
            <p className="text-xl italic">“{currentHoroscope.advice}”</p>
          </div>

          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-zinc-400 mb-2">Número de suerte</div>
                <div className="text-4xl font-black">{currentHoroscope.number}</div>
              </div>

              <div>
                <div className="text-zinc-400 mb-2">Color astral</div>
                <div className="text-2xl font-bold">{currentHoroscope.color}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <h3 className="text-xl font-bold mb-5">📈 Nivel Energético</h3>
            <EnergyBar label="Ánimo" value={currentHoroscope.mood} />
          </div>
        </div>
      </div>
    </div>
  );
}
