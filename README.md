# E-Government MIS Portal

A modern web application that simulates a Local Government Portal where citizens can request government services, make payments, and receive E-Certificates.

## Features

- User authentication with Firebase
- Service request management
- Payment processing with Paystack
- PDF certificate generation
- Certificate storage and download
- User dashboard

## Tech Stack

- Frontend: React.js with functional components
- Backend/Database: Firebase Firestore
- Authentication: Firebase Authentication
- Payments: Paystack
- Certificate Generation: jsPDF
- File Storage: Firebase Storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Paystack account

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd e-gov-mis
```

2. Install dependencies:

```bash
npm install
```

3. Create a Firebase project and enable:

   - Authentication (Email/Password)
   - Firestore Database
   - Storage

4. Update Firebase configuration:

   - Open `src/firebase/config.js`
   - Replace the placeholder config with your Firebase project config

5. Update Paystack configuration:

   - Open `src/pages/ServiceForm.jsx`
   - Replace `YOUR_PAYSTACK_PUBLIC_KEY` with your Paystack public key

6. Start the development server:

```bash
npm run dev
```

## Project Structure

```
src/
  ├── pages/
  │   ├── LoginPage.jsx
  │   ├── RegisterPage.jsx
  │   ├── HomePage.jsx
  │   ├── ServiceForm.jsx
  │   └── Dashboard.jsx
  ├── firebase/
  │   └── config.js
  ├── App.jsx
  └── main.jsx
```

## Usage

1. Register a new account or login
2. Choose a service from the home page
3. Fill out the service form
4. Make payment via Paystack
5. Download your certificate from the dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
