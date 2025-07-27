import { useState } from "react";

export default function App() {
  const [people, setPeople] = useState(1);
  const [cleaning, setCleaning] = useState(false);
  const [serving, setServing] = useState(false);

  const pricePerPerson = 25; // sodybos nuoma žmogui
  const cleaningPrice = 40;
  const servingPrice = 25; // per valandą
  const servingHours = 2;

  const total =
    people * pricePerPerson +
    (cleaning ? cleaningPrice : 0) +
    (serving ? servingPrice * servingHours : 0);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Sodybos skaičiuoklė</h1>

      <label>
        Žmonių skaičius:{" "}
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          min="1"
        />
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={cleaning}
          onChange={() => setCleaning(!cleaning)}
        />
        Užsakoma valymo paslauga (+€40)
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={serving}
          onChange={() => setServing(!serving)}
        />
        Užsakomas stalo serviravimas (+€25/val., 2 val.)
      </label>

      <h2>Iš viso: €{total}</h2>
    </div>
  );
}
