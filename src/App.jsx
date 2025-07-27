import React, { useState } from 'react';
import jsPDF from 'jspdf';
import emailjs from 'emailjs-com';

const servicesList = [
  { name: 'Sodyba šventei - Mini', price: 350 },
  { name: 'Sodyba šventei - Midi', price: 700 },
  { name: 'Sodyba šventei - Maxi', price: 1000 },
  { name: 'Papildoma para (+50%)', price: 0 },
  { name: 'Sodybos nuoma poilsiui (žmogui)', price: 40 },
  { name: 'Apgyvendinimas (žmogui)', price: 5 },
  { name: 'Maisto serviravimo paslauga (val., 1 žmogus)', price: 25 },
  { name: 'Lėkštės, šakutės, peiliai, taurės (vnt)', price: 1.5 },
  { name: 'Staltiesės (vnt)', price: 10 },
  { name: 'Kėdžių užvalkalai (vnt)', price: 2 },
  { name: 'Indų plovimas - Mini', price: 50 },
  { name: 'Indų plovimas - Midi', price: 100 },
  { name: 'Indų plovimas - Maxi', price: 150 },
  { name: 'Maisto/meniu organizavimas (vnt)', price: 35 },
  { name: 'Žvakidės, žvakės, girliandos', price: 50 },
  { name: 'Teminis salės puošimas - Mini', price: 50 },
  { name: 'Teminis salės puošimas - Midi', price: 100 },
  { name: 'Teminis salės puošimas - Maxi', price: 200 },
  { name: 'Gėlių dekoras (stalas, arka)', price: 20 },
  { name: 'Kubilas', price: 70 },
  { name: 'Džakuzi', price: 100 },
  { name: 'Pirtis', price: 50 },
  { name: 'Valymas po šventės - Mini', price: 50 },
  { name: 'Valymas po šventės - Midi', price: 75 },
  { name: 'Valymas po šventės - Maxi', price: 100 },
];

export default function App() {
  const [services, setServices] = useState(
    servicesList.map(service => ({ ...service, selected: false, quantity: 0 }))
  );
  const [name, setName] = useState('');

  const handleChange = (index, field, value) => {
    const newServices = [...services];
    if (field === 'selected') {
      newServices[index].selected = value;
      if (value && newServices[index].quantity === 0) {
        newServices[index].quantity = 1;
      }
    } else {
      newServices[index][field] = Number(value);
    }
    setServices(newServices);
  };

  const calculateTotal = () => {
    let baseTotal = 0;
    let sodybaSum = 0;

    services.forEach((s, i) => {
      if (s.selected) {
        const subtotal = s.price * s.quantity;
        baseTotal += subtotal;
        if (s.name.includes('Sodyba šventei')) sodybaSum += subtotal;
      }
    });

    const extraIndex = services.findIndex(s => s.name.includes('Papildoma para'));
    if (extraIndex !== -1 && services[extraIndex].selected) {
      const extraCost = 0.5 * sodybaSum;
      baseTotal += extraCost;
    }

    return baseTotal;
  };

  const total = calculateTotal();

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Užsakymo skaičiuokle`, 10, 10);
    doc.setFontSize(10);
    doc.text(`Vardas: ${name}`, 10, 18);

    let y = 28;
    services.forEach(service => {
      if (service.selected && service.quantity > 0) {
        const line = `${service.name} – Kiekis: ${service.quantity}, Suma: €${(service.price * service.quantity).toFixed(2)}`;
        doc.text(line, 10, y);
        y += 7;
      }
    });

    const sodybaTotal = services
      .filter(s => s.selected && s.name.includes('Sodyba šventei'))
      .reduce((sum, s) => sum + s.price * s.quantity, 0);

    const papildoma = services.find(s => s.name.includes('Papildoma para'));
    if (papildoma && papildoma.selected) {
      const extra = sodybaTotal * 0.5;
      doc.text(`Papildoma para: €${extra.toFixed(2)}`, 10, y);
      y += 7;
    }

    doc.setFontSize(12);
    doc.text(`Iš viso: €${total.toFixed(2)}`, 10, y + 5);
    doc.save(`sodybos-skaiciuokle_${new Date().toLocaleDateString()}.pdf`);
  };

  const sendEmail = () => {
    const selected = services.filter(s => s.selected && s.quantity > 0);
    const list = selected.map(s => `${s.name} (x${s.quantity}) – €${(s.price * s.quantity).toFixed(2)}`).join('\n');

    const sodybaTotal = services
      .filter(s => s.selected && s.name.includes('Sodyba šventei'))
      .reduce((sum, s) => sum + s.price * s.quantity, 0);

    const papildoma = services.find(s => s.name.includes('Papildoma para'));
    const extra = papildoma && papildoma.selected ? `Papildoma para: €${(sodybaTotal * 0.5).toFixed(2)}\n` : '';

    const params = {
      name,
      email: 'sodybapriemiesto@gmail.com',
      title: `Naujas užsakymas`,
      message: `Užsakovas: ${name}\n\nPaslaugos:\n${list}\n${extra}\nBendra suma: €${total.toFixed(2)}`
    };

    emailjs.send('service_c85w6vd', 'template_6cb20kh', params, 'S19YpEwjGDkGRc_Kh')
      .then(() => alert('Išsiųsta sėkmingai!'))
      .catch(err => alert('Klaida siunčiant: ' + err.text));
  };

  return (
    <div style={{ padding: '20px', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px' }}>Sodybos skaičiuoklė</h1>

      <label>Jūsų vardas:<br />
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </label>

      {services.map((service, index) => (
        <div key={index} style={{ border: '1px solid #ccc', marginBottom: '8px', padding: '8px' }}>
          <label>
            <input
              type="checkbox"
              checked={service.selected}
              onChange={e => handleChange(index, 'selected', e.target.checked)}
            />{' '}
            {service.name} – {service.price} € / vnt
          </label>

          {service.selected && (
            <div style={{ marginTop: '5px' }}>
              <div>Kiekis:
                <input
                  type="number"
                  min="0"
                  value={service.quantity}
                  onChange={e => handleChange(index, 'quantity', e.target.value)}
                  style={{ width: '60px', marginLeft: '8px' }}
                />
              </div>
              <div>Suma: <strong>€{(service.price * service.quantity).toFixed(2)}</strong></div>
            </div>
          )}
        </div>
      ))}

      <h2 style={{ fontSize: '16px' }}>Iš viso: €{total.toFixed(2)}</h2>

      <button onClick={downloadPDF} style={{ marginRight: '10px' }}>📄 Atsisiųsti PDF</button>
      <button onClick={sendEmail}>✉️ Siųsti el. paštu</button>
    </div>
  );
}
