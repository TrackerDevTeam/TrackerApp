const randomBetween = (min, max) => Math.random() * (max - min) + min;

const INTERVAL = 5; // toutes les 5 minutes

export const simulateRawSleepData = () => {
  const raw = [];

  // 🕒 Heure de début entre 22h30 et 01h00
  const bedtimeHour = Math.floor(randomBetween(22, 27)) % 24;
  const bedtimeMinute = Math.random() < 0.5 ? 0 : 30;

  const date = new Date();
  date.setHours(bedtimeHour, bedtimeMinute, 0, 0);
  let ts = date.getTime();

  // ⏱ Durée aléatoire entre 5h30 et 8h
  const TOTAL_MINUTES = Math.floor(randomBetween(300, 600));
  const NB_POINTS = Math.floor(TOTAL_MINUTES / INTERVAL);

  const phases = ['wake', 'light', 'deep'];
  let currentPhase = 'light';
  let phaseDuration = 30; // phase dure au moins 30 min
  let counter = 0;

  for (let i = 0; i < NB_POINTS; i++) {
    if (counter >= phaseDuration / INTERVAL) {
      currentPhase = phases[Math.floor(Math.random() * phases.length)];
      phaseDuration = randomBetween(30, 60); // phase entre 30 et 60 minutes
      counter = 0;
    }

    let gx, gy, gz, ax, ay, az, bpm, spo2;

    if (currentPhase === 'wake') {
      gx = randomBetween(3, 6);
      gy = randomBetween(3, 6);
      gz = randomBetween(3, 6);
      ax = randomBetween(1, 3);
      ay = randomBetween(1, 3);
      az = randomBetween(1, 3);
      bpm = randomBetween(75, 90);
      spo2 = randomBetween(97, 100);
    } else if (currentPhase === 'light') {
      gx = randomBetween(0.5, 1.5);
      gy = randomBetween(0.5, 1.5);
      gz = randomBetween(0.5, 1.5);
      ax = randomBetween(0.2, 0.8);
      ay = randomBetween(0.2, 0.8);
      az = randomBetween(0.2, 0.8);
      bpm = randomBetween(65, 75);
      spo2 = randomBetween(95, 99);
    } else {
      gx = randomBetween(0.1, 0.3);
      gy = randomBetween(0.1, 0.3);
      gz = randomBetween(0.1, 0.3);
      ax = randomBetween(0.1, 0.3);
      ay = randomBetween(0.1, 0.3);
      az = randomBetween(0.1, 0.3);
      bpm = randomBetween(55, 65);
      spo2 = randomBetween(94, 98);
    }

    raw.push({
      timestamp: ts,
      gx, gy, gz,
      ax, ay, az,
      bpm: Math.round(bpm),
      spo2: Math.round(spo2),
    });

    ts += INTERVAL * 60 * 1000; // avance de 5 min
    counter++;
  }

  return raw;
};
