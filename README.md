# NoCode NoCry 🚀
**Generate professional, high-performance websites from a single prompt.**

[**Live Demo »**](https://no-code-no-cry.vercel.app/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/aadityadhanwate)

---

## 📝 Project Description
**NoCode NoCry** is an AI-powered website builder designed to bridge the gap between imagination and implementation. By simply describing what you want, our intelligent system generates fully functional, responsive, and visually stunning websites in seconds.

- **The Problem:** Building a website usually requires either deep coding knowledge or hours of wrestling with complex "drag-and-drop" builders.
- **The Solution:** We use advanced LLMs (Gemini/OpenRouter) to write clean, modern code based on your natural language input.
- **Who is it for?** Startups needing MVPs, developers wanting a head start, and students learning web structure.

---

## ✨ Features
- 🤖 **Prompt-to-Site:** Turn a sentence into a complete landing page or web app.
- 💬 **Interactive Revisions:** Chat with the AI to change colors, add sections, or tweak layouts in real-time.
- 🕒 **Version Control:** Save different versions of your project and roll back to any point in time.
- 💳 **Credit System:** Seamless credit-based generation powered by **Razorpay** integration.
- 🔑 **Secure Authentication:** Robust user management using **Better Auth**.
- 📱 **Mobile Responsive:** All generated sites are optimized for every screen size out of the box.
- 🌐 **One-Click Publishing:** Toggle your project between "Draft" and "Live" status effortlessly.

---

## 🛠 Tech Stack
**Frontend:**
- [React.js](https://reactjs.org/) (Vite)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.steveney.com/) (UI/UX)
- [Axios](https://axios-http.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) (PostgreSQL)
- [Better Auth](https://better-auth.com/)

**AI & Payments:**
- [Google Gemini API](https://ai.google.dev/) / [OpenRouter](https://openrouter.ai/)
- [Razorpay SDK](https://razorpay.com/docs/payments/server-side-sdk/nodejs/)

---

## ⚙️ Configuration
You will need to create `.env` files in both the `client` and `server` directories.

**Server (`/server/.env`):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
BETTER_AUTH_SECRET="your_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your_google_ai_key"
RAZORPAY_KEY_ID="your_razorpay_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

**Client (`/client/.env`):**
```env
VITE_BASEURL="http://localhost:3000"
VITE_RAZORPAY_KEY_ID="your_razorpay_id"
```

---

## 📥 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aadityadhanwate/NoCode-NoCry.git
   cd NoCode-NoCry
   ```

2. **Setup the Server:**
   ```bash
   cd server
   npm install
   npx prisma generate
   npx prisma db push
   npm run server
   ```

3. **Setup the Client:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## 🚀 Usage
1. Open your browser to [https://no-code-no-cry.vercel.app/](https://no-code-no-cry.vercel.app/).
2. Sign up or login to receive your initial credits.
3. Type a prompt (e.g., *"Create a coffee shop website with a dark theme and animation"*).
4. Use the sidebar chat to request changes (e.g., *"Change the hero button to red"*).
5. Click **Publish** to make your site live!

---

## 📂 Project Structure
```text
NoCode NoCry
├── client                # React + Vite Frontend
│   ├── src/assets        # Images and Static Data
│   ├── src/components    # Reusable UI Components
│   ├── src/pages         # Main view pages (Pricing, MyProjects, etc.)
│   └── src/configs       # Axios and Auth configurations
├── server                # Express + Prisma Backend
│   ├── controllers       # Business Logic (User, AI, Payment)
│   ├── routes            # API Endpoints
│   ├── prisma/schema     # Database Schema
│   └── lib               # AI Service and Auth helpers
└── README.md             # You are here!
```

---

## 🗺 Roadmap
- [ ] **Custom Domains:** Allow users to point their own domains to published sites.
- [ ] **Export Code:** Download the generated code as a ZIP file.
- [ ] **More Templates:** Add pre-defined AI personality styles (SaaS, Minimal, Corporate).
- [ ] **Drag & Drop:** Hybrid mode combining AI and manual editing.

---

## 🤝 Contributing
Contributions are welcome! 
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact
**Author:** Aaditya Dhanwate  
**GitHub:** [aadityadhanwate](https://github.com/aadityadhanwate)  
**Email:** aadityadhanwate830@gmail.com  

---
*Developed with ❤️ for the No-Code community.*
