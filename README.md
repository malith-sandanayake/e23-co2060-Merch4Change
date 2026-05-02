<div align="center">

<img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

# 🛍️ Merch4Change

### *Shop with purpose. Give with every purchase.*

A full-stack web platform that bridges **brands**, **charities**, and **communities** — where buying merchandise drives real-world social impact through an innovative coin-based donation system.

**[🌐 Live Demo](https://e23-co2060-merch4-change-9mp9.vercel.app/)** · **[📋 Proposal](./Documentation/)** · **[🐛 Report Bug](https://github.com/cepdnaclk/e23-co2060-Merch4Change/issues)** · **[💡 Request Feature](https://github.com/cepdnaclk/e23-co2060-Merch4Change/issues)**

---

</div>

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Folder Structure](#-folder-structure)
- [User Roles](#-user-roles)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Team](#-team)
- [Acknowledgements](#-acknowledgements)

---

## 🌟 About the Project

**Merch4Change** is a responsive web platform built for the **Dev{thon} 3.0** competition by Team Antigravity (DEV-0207) from the University of Peradeniya, and continued as a 2nd Year Project (2YP) for CO2060.

The platform solves three real problems:

1. **Fans & followers** have no centralized, trusted place to track new product launches from their favourite brands and celebrities.
2. **Charities & NGOs** lack a verified, discoverable space to present their work and receive direct or indirect donations.
3. **Social workers and individuals** have nowhere to publicly showcase their contributions and build a reputation.

> **The Core Idea:** Every time a user purchases merchandise, they earn **in-app coins**. Those coins can be donated to verified charities — turning every commercial transaction into a social good moment.

---

## ✨ Key Features

### 👤 For Normal Users
- Secure authentication (Sign Up / Login via JWT)
- Follow favourite brands, celebrities, and charities
- Real-time notifications on new product launches
- Earn **Merch Coins** with every purchase
- Donate coins to verified charities
- Collect badges and climb leaderboards
- Customizable profile with activity history

### 🏢 For Brands & Companies
- Dedicated company profiles
- General product listings and **auction-based** rare item sales
- Exclusive drops for premium community members
- Receive product reviews and build follower base
- Display CSR/social work activity on company profile

### 🤝 For Charities & NGOs
- Admin-verified profiles with registration proof
- Post ongoing, upcoming, and completed projects
- Receive coin-based and direct donations
- Issue digital certificates and badges to donors
- Field-based categorization (health, education, environment, etc.)
- Connect with users who need assistance

### 🔧 For Admins
- Verify and manage charity profiles
- Oversee platform activity and reporting
- Manage user levels and ranking systems

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Payments** | Stripe |
| **Version Control** | Git & GitHub |
| **Deployment** | Vercel (Frontend) |

> **Note:** Technologies are subject to change during the development process.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                       │
│              React.js  ·  Vercel Hosted                 │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST API
┌────────────────────────▼────────────────────────────────┐
│                    SERVER LAYER                         │
│           Node.js + Express.js  ·  JWT Auth             │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │  Auth Routes│  │Product Routes│  │Charity Routes │   │
│  └─────────────┘  └──────────────┘  └───────────────┘   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │  User Routes│  │ Coin/Donation│  │ Admin Routes  │   │
│  └─────────────┘  └──────────────┘  └───────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose ODM
┌────────────────────────▼────────────────────────────────┐
│                    DATA LAYER                           │
│                      MongoDB                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud instance)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cepdnaclk/e23-co2060-Merch4Change.git
   cd e23-co2060-Merch4Change
   ```

2. **Set up the Frontend**
   ```bash
   cd code/frontend
   npm install
   ```

3. **Set up the Backend**
   ```bash
   cd code/backend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables) below).
   
   Create a `.env` file in the `frontend/` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Run the application**

   Start the backend:
   ```bash
   cd code/backend
   npm run dev
   ```

   Start the frontend (in a new terminal):
   ```bash
   cd code/frontend
   npm start
   ```

6. **Open your browser** at `http://localhost:3000`

---

## 📁 Folder Structure

```
e23-co2060-Merch4Change/
│
├── code/
│   ├── Frontend/
│   │   ├── public/               # Public assets
│   │   └── src/
│   │       ├── assets/           # Images, icons, static files
│   │       ├── components/       # Reusable UI components
│   │       │   ├── Message/      # Messaging interface
│   │       │   ├── Sidebar/      # Navigation sidebars
│   │       │   └── PublicLayout/ # Layouts for public pages
│   │       ├── pages/            # Main application pages
│   │       │   ├── Home/         # User dashboard and feed
│   │       │   ├── Marketplace/  # Product browsing and buying
│   │       │   ├── Settings/     # User profile settings
│   │       │   ├── SignUp/       # Multi-step authentication flow
│   │       │   ├── UserProfile/  # Public and private user profiles
│   │       │   └── Landing/      # Public landing page
│   │       ├── App.jsx           # Main application routing
│   │       ├── index.css         # Global styles
│   │       └── main.jsx          # React entry point
│   │
│   └── Backend/                  # API server
│       ├── controllers/          # Route handler logic
│       ├── models/               # MongoDB Mongoose schemas
│       ├── routes/               # Express route definitions
│       ├── middleware/           # Auth, error handling, etc.
│       └── server.js
│
├── Documentation/                # Project docs and proposal
└── README.md
```

---

## 👥 User Roles

| Role | Description |
|---|---|
| **Normal User** | Browse products, earn coins via purchases, donate to charities, collect badges, follow profiles |
| **Brand / Company** | List and auction products, build a follower community, post updates and CSR activities |
| **Startup** | Same as brand — accessible to newcomers to compete globally from day one |
| **Celebrity / Influencer** | Follow brands, sell own merchandise, display social works on profile |
| **Charity / NGO** | Admin-verified accounts, post projects, receive donations, issue donor certificates |
| **Admin** | Verify charities, manage platform integrity and user reports |

---

## 🔌 API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/products` | List all products |
| `POST` | `/products` | Create a product (brand only) |
| `GET` | `/charities` | List all verified charities |
| `POST` | `/donations` | Donate coins to a charity |
| `GET` | `/users/:id/profile` | Get user profile |
| `GET` | `/users/:id/coins` | Get user coin balance |

> Full API documentation coming soon.

---

## 🔐 Environment Variables

Create a `.env` file in `code/backend/` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

NODE_ENV=development
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 🗺 Roadmap

### Semester 3 (Current)
- [x] Project proposal and system design
- [x] Folder structure and developer guide
- [x] Frontend scaffolding with React
- [x] Vercel deployment pipeline
- [x] User authentication (JWT login/register)
- [x] Product listing and browsing
- [x] Basic user profiles

### Semester 4 (Planned)
- [ ] Coin earning and donation system (core feature)
- [ ] Charity verification flow (admin panel)
- [ ] Real-time notifications (Socket.io)
- [ ] Auction system for limited-edition products
- [ ] Badge and leaderboard system
- [ ] Stripe payment integration
- [ ] Premium membership tiers
- [ ] Mobile-responsive polish

---

## 👨‍💻 Team

**Team Antigravity** · DEV-0207 · University of Peradeniya, Sri Lanka

| Name | Role | Contact |
|---|---|---|
| R.A.J.C. Adhikari | Teach Lead | 
| M.N.A. Fikry| Scrum Master |
| S.D.M.P. Sandanayake | Team Leader | e23347@eng.pdn.ac.lk |
| S.B.N.S. Samarawickrama | backend-dev | e23343@eng.pdn.ac.lk |
| M.A.S. Dulshara | Database Manager| e23089@eng.pdn.ac.lk |
| G.C. Damsiluni | Frontend-dev | e23050@eng.pdn.ac.lk |

**Institute:** Faculty of Engineering, University of Peradeniya  
**Module:** CO2060 — 2nd Year Project (2YP)  
**Batch:** E23

---

## 🙏 Acknowledgements

- [University of Peradeniya, Dept. of Computer Engineering](https://www.ce.pdn.ac.lk/)
- [React Documentation](https://react.dev/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Stripe Docs](https://stripe.com/docs)

---

<div align="center">

Made with ❤️ by Team Antigravity · University of Peradeniya · E23 Batch

*"Shop with purpose. Give with every purchase."*

</div>
