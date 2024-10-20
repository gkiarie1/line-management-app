import React, { useState } from 'react';
import { AwesomeQR } from 'awesome-qr';

const QRCodeGenerator = ({ employeeId }) => {
  const [qrCodeSrc, setQrCodeSrc] = useState(null);
  const [loginStatus, setLoginStatus] = useState(null);

  const handleClockIn = async () => {
    const attendanceLink = `http://localhost:5000/clock-in/${employeeId}`;
    const currentDate = new Date().toISOString().slice(0, 10);
    const password = prompt('Please enter your password to log in');

    try {
      const response = await fetch(attendanceLink, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, date: currentDate })
      });

      const data = await response.json();
      if (response.ok) {
        setLoginStatus(data.message);
      } else {
        setLoginStatus(data.message || 'Error clocking in');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginStatus('Failed to log in or clock in');
    }
  };

  const generateQRCode = async () => {
    const attendanceLink = `http://localhost:5000/clock-in/${employeeId}`;

    try {
      const qrCode = await new AwesomeQR({
        text: attendanceLink,
        size: 256,
        margin: 20,
        backgroundColor: '#ffffff',
        colorDark: '#000000',
        colorLight: '#ffffff'
      }).draw();

      setQrCodeSrc(qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  useState(() => {
    generateQRCode();
  }, [employeeId]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Attendance QR Code</h2>
      {qrCodeSrc ? (
        <img src={qrCodeSrc} alt="QR Code" onClick={handleClockIn} style={{ cursor: 'pointer' }} />
      ) : (
        <p>Generating QR code...</p>
      )}
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
};

export default QRCodeGenerator;
