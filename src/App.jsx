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
        Žmonių skaičius:
        <input
          type="number"
          value={people}
          min="1"
          onChange={(e) => setPeople(parseInt(e.target.value))}
          style={{ marginLeft: '10px' }}
        />
      </label>

      <div style={{ marginTop: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={cleaning}
            onChange={() => setCleaning(!cleaning)}
          />
          Užsakoma valymo paslauga (+€40)
        </label>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={serving}
            onChange={() => setServing(!serving)}
          />
          Užsakomas stalo serviravimas (+€25/val.)
        </label>
        {serving && (
          <div style={{ marginTop: '5px', marginLeft: '20px' }}>
            Valandų skaičius:
            <input
              type="number"
              value={servingHours}
              min="1"
              onChange={(e) => setServingHours(parseInt(e.target.value))}
              style={{ marginLeft: '10px' }}
            />
          </div>
        )}
      </div>

      <h2 style={{ marginTop: '20px' }}>Iš viso: €{total}</h2>
    </div>
  );
}
