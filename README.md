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
- [Recent Updates & Implementations](#-recent-updates--implementations)
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
- **(NEW)** Add your own products dynamically to your profile.
- **(NEW)** Engage with the community by **Liking** and **Commenting** on posts.

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
- **(NEW)** Dynamic mapping using Leaflet and Geocoding to show organization HQ.

### 🔧 For Admins
- Verify and manage charity profiles
- Oversee platform activity and reporting
- Manage user levels and ranking systems

---

## 🆕 Recent Updates & Implementations

1. **Dynamic User Products:** The `Product` schema has been updated so that individual users (`ownerUserId`) can directly own products. A beautiful modal allows users to add a product (name, description, price, and images).
2. **Post Engagement:** The post viewer modal now supports dynamic interactions. Users can click the heart to "like" a post (with color animations) and leave comments using a built-in text input. 
3. **Optimized Profile Page UI:** Both Organizations and Individuals share the `/profile/:username` routing structure. Premium styling such as glassmorphism, hover animations, and gradient cards are used extensively.
4. **Dynamic Maps via OpenStreetMap API:** Replaced static map pins with live map markers pinpointing an organization's headquarters based on their registered country.
5. **Real-time Seeding:** Our comprehensive `seed.js` script provisions fully functional admin users, standard users, organizations, luxury products, and rich charitable project campaigns dynamically to allow rapid prototyping.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Payments** | Stripe |
| **Mapping** | React-Leaflet (OpenStreetMap) |
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
   cd code/Frontend
   npm install
   ```

3. **Set up the Backend**
   ```bash
   cd code/Backend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `code/Backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/merch4change
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```
   
   Create a `.env` file in the `code/Frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Run the Application & Seed Data**

   First, seed your database with our script to test functionalities:
   ```bash
   cd code/Backend
   node src/scripts/seed.js
   ```

   Start the backend:
   ```bash
   npm run dev
   ```

   Start the frontend (in a new terminal):
   ```bash
   cd code/Frontend
   npm run dev
   ```

6. **Open your browser** at `http://localhost:5173`

---

## 📁 Folder Structure

```
e23-co2060-Merch4Change/
│
├── code/
│   ├── Frontend/
│   │   ├── public/               # Public assets
│   │   └── src/
│   │       ├── api/              # API Service classes (Client layer)
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
│   │       ├── context/          # Context API Providers
│   │       ├── App.jsx           # Main application routing
│   │       ├── index.css         # Global styles
│   │       └── main.jsx          # React entry point
│   │
│   └── Backend/                  # API server
│       ├── controllers/          # Route handler logic
│       ├── models/               # MongoDB Mongoose schemas
│       ├── routes/               # Express route definitions
│       ├── middlewares/          # Auth, error handling, file upload etc.
│       ├── scripts/              # Database seeding scripts
│       └── server.js             # Main server entrypoint
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

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/products/user/:username` | List products by user |
| `POST` | `/products` | Create a product |
| `GET` | `/charities` | List all verified charities |
| `POST` | `/donations` | Donate coins to a charity |
| `GET` | `/profile/:username` | Get user profile (Handles both individuals and organizations) |
| `POST` | `/posts/:postId/like` | Like or unlike a post |
| `POST` | `/posts/:postId/comment`| Comment on a post |

> Full API documentation coming soon.

---

## 🔐 Environment Variables

Create a `.env` file in `code/Backend/` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

NODE_ENV=development
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 🗺 Roadmap

### Semester 3
- [x] Project proposal and system design
- [x] Folder structure and developer guide
- [x] Frontend scaffolding with React
- [x] Vercel deployment pipeline
- [x] User authentication (JWT login/register)
- [x] Product listing and browsing
- [x] Basic user profiles
- [x] Cloudinary Media Upload integration
- [x] Seed data population
- [x] Unified Profile Architecture

### Semester 4 (Planned)
- [x] Coin earning and donation system (core feature)
- [x] Real-time interactivity (Post likes, Comments, Maps)
- [x] Product listing for all individual accounts
- [ ] Charity verification flow (admin panel)
- [ ] Real-time messaging notifications (Socket.io)
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
| R.A.J.C. Adhikari | Tech Lead | 
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
- [React Leaflet Docs](https://react-leaflet.js.org/)

---

<div align="center">

Made with ❤️ by Team Antigravity · University of Peradeniya · E23 Batch

*"Shop with purpose. Give with every purchase."*

</div>
