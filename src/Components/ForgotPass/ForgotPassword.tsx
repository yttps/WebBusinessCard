// import React ,{ useState } from 'react';
// import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
// import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
// import { initializeApp } from 'firebase/app';
// import bcrypt from 'bcryptjs';

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: 'AIzaSyDEcFmGXakjXsXh24eqDMoQDzE0KWEfwKc',
//   authDomain: 'https://accounts.google.com/o/oauth2/auth',
//   projectId: 'business-137ec',
//   storageBucket: 'business-137ec.appspot.com',
//   messagingSenderId: '276514418663-661hprdiuirsftbs90gnrd9dvm92jn0i.apps.googleusercontent.com',
// };

// initializeApp(firebaseConfig);
// const db = getFirestore();

// const sendOtpToEmail = (email: string, otp: string) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.REACT_APP_EMAIL_USER,
//       pass: process.env.REACT_APP_EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.REACT_APP_EMAIL_USER,
//     to: email,
//     subject: 'Your OTP Code',
//     text: `Your OTP code is ${otp}`,
//   };

//   transporter.sendMail(mailOptions, (error: Error | null) => {
//     if (error) {
//       console.error('Error sending email:', error);
//     } else {
//       console.log('Email sent:');
//       //console.log('Email sent:', info.response);
//     }
//   });
// };

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [generatedOtp, setGeneratedOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const handleSendOtp = async () => {
//     // Check if the email exists in the 'companies' collection
//     const companiesRef = collection(db, 'companies');
//     const q = query(companiesRef, where('email', '==', email));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       // Generate OTP
//       const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//       setGeneratedOtp(otpCode);

//       // Send OTP to email
//       sendOtpToEmail(email, otpCode);
//       setOtpSent(true);
//     } else {
//       alert('Email not found');
//     }
//   };

//   const handleVerifyOtp = () => {
//     if (otp === generatedOtp) {
//       setOtpVerified(true);
//     } else {
//       alert('Incorrect OTP');
//     }
//   };

//   const handleResetPassword = async () => {
//     if (otpVerified) {
//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       // Update the password in the 'users' collection
//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where('email', '==', email));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const userDoc = querySnapshot.docs[0];
//         await updateDoc(doc(db, 'users', userDoc.id), { password: hashedPassword });
//         alert('Password updated successfully');
//       } else {
//         alert('User not found');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Forgot Password</h2>
//       {!otpSent ? (
//         <div>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <button onClick={handleSendOtp}>Send OTP</button>
//         </div>
//       ) : !otpVerified ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <button onClick={handleVerifyOtp}>Verify OTP</button>
//         </div>
//       ) : (
//         <div>
//           <input
//             type="password"
//             placeholder="Enter new password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />
//           <button onClick={handleResetPassword}>Reset Password</button>
//         </div>
//       )}
//     </div>
//   );
// }

import React from 'react'
export default function ForgotPassword() {
  return (
    <div>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
          />
          <button>Send OTP</button>
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter new password"
          />
          <button>Reset Password</button>
        </div>
    </div>
  );
}
