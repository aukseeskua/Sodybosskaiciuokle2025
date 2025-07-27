import React, { useState } from 'react';
import jsPDF from 'jspdf';
import emailjs from 'emailjs-com';

const servicesList = [
  { name: 'Sodyba šventei - Mini', price: 350 },
  { name: 'Sodyba šventei - Midi', price: 700 },
  { name: 'Sodyba šventei - Maxi', price: 1000 },
  { name: 'Sodybos nuoma poilsiui (žmogui)', price: 40 },
  { name: 'Papildoma para (+50%)', price: 0 },
  { name: 'Apgyvendinimas (žmogui)', price: 5 },
  { name: 'Maisto serviravimo paslauga (val., 1 žmogus)', price: 25 },
  { name: 'Lėkštės, šakutės, peiliai, taurės (vnt)', price: 1.50 },
  { name: 'Staltiesės (vnt)', price: 10 },
  { name: 'Kėdžių užvalkalai (vnt)', price: 2 },
  { name: 'Indų plovimas - Mini', price: 50 },
  { name: 'Indų plovimas - Midi', price: 100 },
  { name: 'Indų plovimas - Maxi', price: 150 },
  { name: 'Maisto/meniu organizavimas (vnt)', price: 35 },
  { name: 'Žavakidės, žvakės, girliandos', price: 50 },
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
    newServices[index][field] = field === 'selected' ? value : Number(value);
    setServices(newServices);
  };

  const baseService = services.find(s => s.name.includes('Sodyba šventei') && s.selected);
  const extra = services.find(s => s.name === 'Papildoma para (+50%)' && s.selected);
  const extraCost = baseService && extra ? baseService.price * 0.5 : 0;

  const total = services.reduce((sum, s) => s.selected && s.name !== 'Papildoma para (+50%)' ? sum + s.price * s.quantity : sum, 0) + extraCost;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Užsakymo suvestinė`, 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Užsakovas: ${name}`, 10, 25);

    let y = 35;
    doc.setFont(undefined, 'bold');
    doc.text('Paslauga', 10, y);
    doc.text('Kiekis', 100, y);
    doc.text('Suma (€)', 150, y);
    doc.setFont(undefined, 'normal');
    y += 7;

    services.forEach(service => {
      if (service.selected && service.name !== 'Papildoma para (+50%)') {
        doc.text(service.name, 10, y);
        doc.text(String(service.quantity), 100, y);
        doc.text(`€${(service.price * service.quantity).toFixed(2)}`, 150, y);
        y += 6;
      }
    });

    if (extra && baseService) {
      doc.text('Papildoma para (50%)', 10, y);
      doc.text('1', 100, y);
      doc.text(`€${extraCost.toFixed(2)}`, 150, y);
      y += 6;
    }

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(10, y + 2, 200, y + 2);
    y += 8;

    doc.setFont(undefined, 'bold');
    doc.text(`Iš viso: €${total.toFixed(2)}`, 150, y);
    doc.save(`sodybos-skaiciuokle_${new Date().toLocaleDateString('lt-LT').replace(/\//g, '_')}.pdf`);
  };

  const sendEmail = () => {
    const selectedServices = services.filter(s => s.selected);
    const details = selectedServices
      .map(s => `${s.name} (x${s.quantity}) – €${(s.quantity * s.price).toFixed(2)}`)
      .join('\n');

    const templateParams = {
      name,
      email: 'sodybapriemiesto@gmail.com',
      title: `Naujas užsakymas`,
      message: `Užsakovas: ${name}\n\nPaslaugos:\n${details}\n\nBendra suma: €${total.toFixed(2)}`
    };

    emailjs.send('service_c85w6vd', 'template_6cb20kh', templateParams, 'S19YpEwjGDkGRc_Kh')
      .then(() => alert('Išsiųsta sėkmingai!'))
      .catch(err => alert('Klaida siunčiant: ' + err.text));
  };

  return (
    <div style={{ padding: '20px', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px' }}>Sodybos skaičiuoklė</h1>

      <label>Jūsų vardas:<br />
        <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
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
      <button onClick={sendEmail}>✉️ Sišsti el. paštu</button>
    </div>
  );
}
