import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// 👉 même logique que dans SleepScreen
const getQualityLabel = (eff, wakeups) => {
  const e = parseFloat(eff);
  if (e >= 90 && wakeups <= 1) return 'excellente';
  if (e >= 80 && wakeups <= 3) return 'bonne';
  if (e >= 60) return 'moyenne';
  return 'mauvaise';
};

const calculateDurationInMinutes = (start, end) => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let d1 = new Date(2025, 0, 1, sh, sm);
  let d2 = new Date(2025, 0, 1, eh, em);
  if (d2 < d1) d2.setDate(d2.getDate() + 1);
  return (d2 - d1) / 60000;
};

const transformSleepDataForTraining = (raw) => {
  let rem = 0, leger = 0, profond = 0, reveils = 0;
  const { phases, start, end } = raw;

  phases.forEach(p => {
    const duration = calculateDurationInMinutes(p.start, p.end);
    if (p.type === 'Léger') leger += duration;
    else if (p.type === 'Lourd') profond += duration;
    else if (p.type === 'Réveillé') {
      rem += duration;
      reveils += 1;
    }
  });

  const totalInBed = calculateDurationInMinutes(start, end);
  const totalSleep = leger + profond; // ❌ exclure REM ici
  const efficiency = (totalSleep / totalInBed) * 100;
  const totalFormatted = `${Math.floor(totalInBed / 60)}h${Math.round(totalInBed % 60)}`;

  const qualite = getQualityLabel(efficiency, reveils);

  const phasePercent = (val) => totalInBed === 0 ? 0 : parseFloat(((val / totalInBed) * 100).toFixed(1));
  let phasesPercent = {
    leger: phasePercent(leger),
    profond: phasePercent(profond),
    REM: phasePercent(rem)
  };

  const totalPercent = phasesPercent.leger + phasesPercent.profond + phasesPercent.REM;
  const diff = parseFloat((100 - totalPercent).toFixed(1));
  const maxKey = Object.keys(phasesPercent).reduce((a, b) => phasesPercent[a] > phasesPercent[b] ? a : b);
  phasesPercent[maxKey] = parseFloat((phasesPercent[maxKey] + diff).toFixed(1));

  return {
    sommeil: {
      heure_couche: start,
      heure_leve: end,
      total_heure: totalFormatted,
      qualite,
      phases: phasesPercent,
      reveils
    }
  };
};

export const copySleepSummaryToBilly = async (date) => {
  const formattedDate = date.replace(/-/g, '_');
  const refNico = doc(db, 'users', 'Nico', date, 'sommeil');
  const refBilly = doc(db, 'users', 'Billy', formattedDate, 'sommeil');

  try {
    const snapshot = await getDoc(refNico);
    if (!snapshot.exists()) {
      console.warn(`⚠️ Aucun fichier trouvé dans Nico/${date}/sommeil`);
      return;
    }

    const transformed = transformSleepDataForTraining(snapshot.data());
    await setDoc(refBilly, transformed);
    console.log(`✅ Données résumé envoyées dans Billy/${date}/sommeil`);
  } catch (e) {
    console.error('❌ Erreur de transformation/upload :', e);
  }
};
