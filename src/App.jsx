import { useState } from 'react';

export default function App() {
  const [people, setPeople] = useState(1);
  const [cleaning, setCleaning] = useState(false);
  const [serving, setServing] = useState(false);
  const [servingHours, setServingHours] = useState(2);

  const basePricePerPerson = 25;
  const cleaningPrice = 40;
  const servingPricePerHour = 25;

  const total =
    people * basePricePerPerson +
    (cleaning ? cleaningPrice : 0) +
    (serving ? servingHours * servingPricePerHour : 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Sodybos skaičiuoklė</h1>

      <label>
        Žmonių skaičius:{' '}
        <input
          type="number"
          value={people}
          min="1"
          onChange={(e) => setPeople(parseInt(e.target.value) || 1)}
        />
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={cleaning}
          onChange={(e) => setCleaning(e.target.checked)}
        />
        Užsakoma valymo paslauga (+€40)
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={serving}
          onChange={(e) => setServing(e.target.checked)}
        />
        Užsakomas stalo serviravimas (+€25/val.)
      </label>
      <br />

      {serving && (
        <label>
          Valandų skaičius:{' '}
          <input
            type="number"
            value={servingHours}
            min="1"
            onChange={(e) => setServingHours(parseInt(e.target.value) || 1)}
          />
        </label>
      )}
      <br /><br />

      <h2>Iš viso: €{total}</h2>
    </div>
  );
}
