# 🛒 FreshBasket Grocery Application

A highly modern, meticulously styled web application designed for a premium grocery shopping experience. FreshBasket is a complete full-stack e-commerce platform built with React, Node.js, Express, and PostgreSQL. It features a modern Emerald Green design scheme utilizing cutting-edge glassmorphism interfaces, extremely smooth animated routing, deep local state integration, and an exhaustive e-commerce shopping pipeline with role-based access for Buyers, Sellers, and Admins.

---

## ✨ Features and Capabilities

### 🎨 Stunning Visual Architecture
*   **Premium Custom Styling**: Built with highly responsive, zero-framework CSS focused strictly on premium design execution alongside Tailwind CSS and Shadcn UI components for complex dashboard layouts.
*   **Intelligent Navigation**: A floating, dynamic navbar featuring custom glass-styled Search inputs, distinct layout spacing, layout grids, and interactive Dropdown interactions replacing native un-styled menus.
*   **Advanced Dashboards**: Distinct, feature-rich dashboards for **Sellers** (inventory management, order tracking, analytics) and **Admins** (platform oversight, vendor management, financial reporting).

### 💳 Complete E-Commerce Flow
*   **Deep Catalog Filtering & Search**: Interactive accordions inside the main Shop view allow layered localized filtering down into specific product variations, Brand Widgets, and dynamic text query tracking. 
*   **Dynamic Cart Management System**: Items map smoothly into an accessible `<CartContext />` wrapper allowing cross-app `addToCart` functions, tracking all variables including complex weight/stock options on single product variants. 
*   **Payment & Order Processing**: Integrated with **Razorpay** for secure online payments alongside Cash on Delivery options. Live order tracking and status updates from placement to delivery.
*   **Authentication & Roles**: Secure JWT-based authentication system supporting distinct User, Seller, and Admin roles with protected application routes.

### 📁 Project Architecture (Modular Split)
The project utilizes a strict separation of concerns for maintainability:
*   `/frontend` — The React application handling all UI logic, components, and state management.
*   `/backend` — The Node/Express server handling APIs, database interactions, auth, and payment webhooks.

---

## 🛠️ Technology Stack

**Frontend**
*   **[React.js](https://reactjs.org/)** - Core state rendering UI execution
*   **[React-Router-DOM v7](https://reactrouter.com/)** - Strict URL structural control 
*   **Tailwind CSS & Shadcn UI** - For rapid, modern UI component styling in enterprise dashboards
*   **Recharts** - For rich, dynamic data visualization in Admin/Seller analytics

**Backend & Infrastructure**
*   **[Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)** - Robust REST API framework
*   **[PostgreSQL](https://www.postgresql.org/) & Sequelize** - Relational database and ORM for complex data modeling
*   **JWT & bcryptjs** - Secure authentication and password hashing protocols
*   **Razorpay API** - Payment gateway integration
*   **Nodemailer & EmailJS** - Transactional email and automated notification systems

---

## 🚀 Installation & Setup

1. **Clone the Repository**
   Ensure you have a modern integration of Node installed. 
   ```bash
   git clone https://github.com/Juthishsan-GMD/Grocery-Application.git
   cd Grocery-Application
   ```

2. **Install Dependencies**
   The project requires dependencies for both the frontend and backend. Use the provided root helper script to install everything simultaneously:
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   You must set up environment variables in both directories. 
   
   **In `frontend/.env`:**
   ```env
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
   ```

   **In `backend/.env`:**
   ```env
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/local_db
   JWT_SECRET=your_jwt_secret
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

4. **Initialize the Database**
   Ensure PostgreSQL is running locally, then initialize the database schema and seed data:
   ```bash
   cd backend
   npm run db:init
   cd ..
   ```

5. **Deploy Development Servers**
   From the **root directory**, you can start the application using the proxy scripts:
   
   Start the Backend Server (runs on Port 5000):
   ```bash
   npm run server
   ```
   
   Start the Frontend App (runs on Port 3000):
   ```bash
   npm start
   ```

---

> *Project actively built and maintained within the Juthishsan-GMD workspace pipelines.*
