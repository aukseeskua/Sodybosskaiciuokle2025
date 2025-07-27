import React, { useState } from 'react';
import jsPDF from 'jspdf';
import emailjs from 'emailjs-com';

const servicesList = [
  { name: 'Sodyba šventei - Mini', price: 350 },
  { name: 'Sodyba šventei - Midi', price: 700 },
  { name: 'Sodyba šventei - Maxi', price: 1000 },
  { name: 'Sodybos nuoma poilsiui (žmogui)', price: 40 },
  { name: 'Papildoma para (+50%)', price: 0.5 },
  { name: 'Apgyvendinimas (žmogui)', price: 5 },
  { name: 'Stalo serviravimo paslauga (valanda, 1 žmogus)', price: 25 },
  { name: 'Lėkštės, šakutės, peiliai, taurės (vnt)', price: 1.5 },
  { name: 'Staltiesės (vnt)', price: 10 },
  { name: 'Kėdžių užvalkalai (vnt)', price: 1 },
  { name: 'Indų plovimas - Mini', price: 50 },
  { name: 'Indų plovimas - Midi', price: 100 },
  { name: 'Indų plovimas - Maxi', price: 150 },
  { name: 'Maisto/meniu organizavimas vnt', price: 35 },
  { name: 'Žvakidės, žvakės, girliandos', price: 50 },
  { name: 'Teminis salės puošimas - Mini', price: 50 },
  { name: 'Teminis salės puošimas - Midi', price: 100 },
  { name: 'Teminis salės puošimas - Maxi', price: 200 },
  { name: 'Gėlių dekoras (stalas, arka)', price: 20 },
  { name: 'Kubilas', price: 70 },
  { name: 'Džiakuzi', price: 100 },
  { name: 'Pirtis', price: 50 },
  { name: 'Valymas po šventės - Mini', price: 50 },
  { name: 'Valymas po šventės - Midi', price: 75 },
  { name: 'Valymas po šventės - Maxi', price: 100 },
];

export default function App() {
  const [services, setServices] = useState(
    servicesList.map(service => ({ ...service, selected: false, quantity: 1 }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = field === 'quantity' ? parseInt(value) : value;
    setServices(updated);
  };

  const total = services.reduce((sum, service) => {
    if (!service.selected) return sum;
    return sum + service.price * service.quantity;
  }, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text('Sodybos užsakymo skaičiuoklės ataskaita', 10, 10);

    let y = 20;
    services.forEach(service => {
      if (service.selected) {
        doc.text(
          `${service.name} - Kiekis: ${service.quantity}, Suma: €${(
            service.price * service.quantity
          ).toFixed(2)}`,
          10,
          y
        );
        y += 7;
      }
    });

    doc.text(`\nIš viso: €${total.toFixed(2)}`, 10, y + 5);
    doc.save('sodybos-skaiciuokle.pdf');
  };

  const siustiEmail = () => {
    const message = services
      .filter(service => service.selected)
      .map(
        service =>
          `${service.name}: kiekis ${service.quantity}, suma €${(
            service.price * service.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    emailjs
      .send(
        'service_c85w6vd',
        'template_6cb20kh',
        {
          name: 'Sodybos užsakymas',
          email: 'sodybapriemiesto@gmail.com',
          title: 'Naujas užsakymas',
          message: message + `\nIš viso: €${total.toFixed(2)}`,
        },
        'S19YpEwjGDkGRc_Kh'
      )
      .then(() => alert('✅ Užsakymas išsiųstas el. paštu!'))
      .catch(() => alert('❌ Klaida siunčiant el. laišką.'));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', fontSize: '14px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Sodybos skaičiuoklė</h1>

      {services.map((service, index) => (
        <div
          key={index}
          style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}
        >
          <label>
            <input
              type="checkbox"
              checked={service.selected}
              onChange={e => handleChange(index, 'selected', e.target.checked)}
              style={{ marginRight: '6px' }}
            />
            {service.name} ({service.price} € / vnt)
          </label>

          {service.selected && (
            <div style={{ marginTop: '5px' }}>
              Kiekis:{' '}
              <input
                type="number"
                value={service.quantity}
                onChange={e => handleChange(index, 'quantity', e.target.value)}
                style={{ marginLeft: '10px', width: '60px', fontSize: '13px' }}
              />
              <span style={{ marginLeft: '15px' }}>
                Suma: <strong>€{(service.price * service.quantity).toFixed(2)}</strong>
              </span>
            </div>
          )}
        </div>
      ))}

      <h2 style={{ fontSize: '18px' }}>Iš viso: €{total.toFixed(2)}</h2>

      <button onClick={downloadPDF} style={{ fontSize: '14px', padding: '8px 16px', marginRight: '10px' }}>
        📄 Atsisiųsti PDF
      </button>
      <button onClick={siustiEmail} style={{ fontSize: '14px', padding: '8px 16px' }}>
        📧 Siųsti el. paštu
      </button>
    </div>
  );
}
