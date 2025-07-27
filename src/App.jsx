import React, { useState } from 'react';

const servicesList = [
  { name: "Sodyba šventei – Mini", price: 350 },
  { name: "Sodyba šventei – Midi", price: 700 },
  { name: "Sodyba šventei – Maxi", price: 1000 },
  { name: "Sodybos nuoma poilsiui (žmogui)", price: 40 },
  { name: "Papildoma para (+50%)", price: 0.5 },
  { name: "Apgyvendinimas (žmogui)", price: 5 },
  { name: "Stalo serviravimo paslauga (valanda, 1 žmogus)", price: 25 },
  { name: "Lėkštės, šakutės, peiliai, taurės (vnt)", price: 1.5 },
  { name: "Staltiesės (vnt)", price: 5 },
  { name: "Kėdžių užvalkalai (vnt)", price: 10 },
  { name: "Indų plovimas – Mini", price: 50 },
  { name: "Indų plovimas – Midi", price: 100 },
  { name: "Indų plovimas – Maxi", price: 150 },
  { name: "Maisto/meniu organizavimas (vnt)", price: 35 },
  { name: "Žvakidės, žvakės, girliandos", price: 50 },
  { name: "Teminis salės puošimas – Mini", price: 50 },
  { name: "Teminis salės puošimas – Midi", price: 100 },
  { name: "Teminis salės puošimas – Maxi", price: 200 },
  { name: "Gėlių dekoras (stalas, arka)", price: 0 },
  { name: "Kubilas", price: 70 },
  { name: "Džiakuzi", price: 100 },
  { name: "Pirtis", price: 50 },
  { name: "Valymas po šventės – Mini", price: 50 },
  { name: "Valymas po šventės – Midi", price: 75 },
  { name: "Valymas po šventės – Maxi", price: 100 }
];

export default function App() {
  const [services, setServices] = useState(
    servicesList.map(service => ({
      ...service,
      selected: false,
      quantity: 1
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = field === "selected" ? value : parseFloat(value);
    setServices(updated);
  };

  const total = services.reduce((sum, service) => {
    if (service.selected) {
      return sum + service.price * service.quantity;
    }
    return sum;
  }, 0);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Sodybos skaičiuoklė</h1>
      {services.map((service, index) => (
        <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={service.selected}
              onChange={e => handleChange(index, "selected", e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            {service.name} – {service.price} € / vnt.
          </label>
          {service.selected && (
            <div style={{ marginTop: "5px" }}>
              Kiekis:
              <input
                type="number"
                value={service.quantity}
                min="1"
                onChange={e => handleChange(index, "quantity", e.target.value)}
                style={{ marginLeft: "10px", width: "60px" }}
              />
              <span style={{ marginLeft: "15px" }}>
                Suma: <strong>{(service.price * service.quantity).toFixed(2)} €</strong>
              </span>
            </div>
          )}
        </div>
      ))}
      <h2>Iš viso: {total.toFixed(2)} €</h2>
    </div>
  );
}
