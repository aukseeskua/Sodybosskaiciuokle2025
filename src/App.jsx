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
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = field === 'selected' ? value : Number(value);
    setServices(newServices);
  };

  const calculateTotal = () => {
    let baseTotal = 0;
    let additionalNight = 0;
    let additionalNightSelected = false;

    services.forEach(service => {
      if (service.selected && service.name.includes('Sodyba šventei')) {
        baseTotal += service.price * service.quantity;
      }
    });

    services.forEach(service => {
      if (service.name === 'Papildoma para (+50%)') {
        additionalNightSelected = service.selected;
      }
    });

    const total = services.reduce((sum, service) => {
      if (!service.selected) return sum;
      if (service.name === 'Papildoma para (+50%)') return sum; // skip for now
      return sum + service.price * service.quantity;
    }, 0);

    if (additionalNightSelected) {
      additionalNight = baseTotal * 0.5;
    }

    return total + additionalNight;
  };

  const total = calculateTotal();

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(`Užsakymo skaičiuoklė - ${name}`, 10, 10);
    let y = 20;
    services.forEach(service => {
      if (service.selected && service.name !== 'Papildoma para (+50%)') {
        doc.text(`${service.name} – Kiekis: ${service.quantity}, Suma: €${(service.price * service.quantity).toFixed(2)}`, 10, y);
        y += 6;
      }
    });
    if (services.find(s => s.name === 'Papildoma para (+50%)' && s.selected)) {
      doc.text(`Papildoma para – €${(calculateTotal() - total).toFixed(2)}`, 10, y);
      y += 6;
    }
    doc.text(`\nIš viso: €${calculateTotal().toFixed(2)}`, 10, y + 5);
    const fileName = `sodybos-skaiciuokle_${name}_${new Date().toLocaleDateString()}.pdf`;
    doc.save(fileName);
  };

  const sendEmail = () => {
    if (!name.trim()) {
      alert('Įrašykite savo vardą.');
      return;
    }

    const selectedServices = services.filter(s => s.selected && s.name !== 'Papildoma para (+50%)');
    const details = selectedServices.map(s => `${s.name} (x${s.quantity}) – €${(s.quantity * s.price).toFixed(2)}`).join('\n');

    let extra = '';
    if (services.find(s => s.name === 'Papildoma para (+50%)' && s.selected)) {
      const base = services.filter(s => s.selected && s.name.includes('Sodyba šventei')).reduce((sum, s) => sum + s.price * s.quantity, 0);
      extra = `\nPapildoma para: €${(base * 0.5).toFixed(2)}`;
    }

    const templateParams = {
      name,
      email: userEmail || 'nenurodyta',
      title: `Naujas užsakymas`,
      message: `Užsakovas: ${name} (${userEmail || 'el. paštas nenurodytas'})\n\nPaslaugos:\n${details}${extra}\n\nBendra suma: €${calculateTotal().toFixed(2)}`
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

      <label>Jūsų el. paštas (neprivaloma):<br />
        <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
      </label>

      {services.map((service, index) => (
        <div key={index} style={{ border: '1px solid #ccc', marginBottom: '8px', padding: '8px' }}>
          <label>
            <input
              type="checkbox"
              checked={service.selected}
              onChange={e => handleChange(index, 'selected', e.target.checked)}
            />{' '}
            {service.name} – {service.price > 0 ? `${service.price} € / vnt` : 'skaičiuojama automatiškai'}
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

      <h2 style={{ fontSize: '16px' }}>Iš viso: €{calculateTotal().toFixed(2)}</h2>

      <button onClick={downloadPDF} style={{ marginRight: '10px' }}>📄 Atsisiųsti PDF</button>
      <button onClick={sendEmail}>✉️ Siųsti el. paštu</button>
    </div>
  );
}
