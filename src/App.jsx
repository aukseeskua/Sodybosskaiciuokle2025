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
  { name: 'Lėkštės, šakutės, peiliai, taurės (vnt)', price: 1.5 },
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
    if (field === 'selected') {
      newServices[index][field] = value;
      if (value) newServices[index].quantity = 1;
      else newServices[index].quantity = 0;
    } else {
      newServices[index][field] = Number(value);
    }
    setServices(newServices);
  };

  const getSodybaPrice = () => {
    const sodyba = services.find(
      s => s.selected && s.name.startsWith('Sodyba šventei')
    );
    return sodyba ? sodyba.price : 0;
  };

  const total = services.reduce((sum, service) => {
    if (service.selected) {
      if (service.name === 'Papildoma para (+50%)') {
        return sum + 0.5 * getSodybaPrice();
      }
      return sum + service.price * service.quantity;
    }
    return sum;
  }, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Užsakymo suvestin', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Užsakovas: ${name}`, 20, 35);
    let y = 50;

    const selected = services.filter(s => s.selected);

    doc.setFont('helvetica', 'bold');
    doc.text('Paslauga', 20, y);
    doc.text('Kiekis', 105, y);
    doc.text('Suma (€)', 150, y);
    doc.setLineWidth(0.5);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    doc.setFont('helvetica', 'normal');
    selected.forEach(s => {
      const sum =
        s.name === 'Papildoma para (+50%)'
          ? 0.5 * getSodybaPrice()
          : s.price * s.quantity;
      doc.text(s.name, 20, y);
      doc.text(`${s.quantity}`, 105, y, { align: 'right' });
      doc.text(`€${sum.toFixed(2)}`, 190, y, { align: 'right' });
      y += 8;
    });

    doc.line(20, y, 190, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`Iš viso: €${total.toFixed(2)}`, 190, y + 10, { align: 'right' });
    doc.save(`sodybos-skaiciuokle_${new Date().toISOString().split('T')[0]}.pdf`);
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

          {service.selected && service.name !== 'Papildoma para (+50%)' && (
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
    </div>
  );
}
