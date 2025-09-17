# WorkWise - Employee Management System  

![WorkWise Logo](./frontend/WorkWise/src/assets/logo3.png) <!-- Replace with your logo path -->

---

## 📖 Overview  
**WorkWise** is a modern **Employee Management System** built with **React, Bootstrap CSS, and Supabase**.  
It is designed to simplify managing employees, departments, attendance, and company events while providing admins with a user-friendly dashboard and powerful features.  

---

## 🚀 Features  

### 🔐 Authentication & Profile  
- Secure login system.  
- User profile management:
  - Edit name.  
  - Update profile picture.  
  - Change password.  

### 📊 Dashboard  
- Sidebar navigation.  
- Four summary cards:  
  - Total employees.  
  - Total departments.  
  - Present employees count.  
  - Admins count.  
- Upcoming company events section:  
  - Add, edit, and remove events.  

### 👩‍💼 Admin Section  
- View all authenticated user details.  
- Add new users to the system.  

### 👨‍👩‍👧 Employee Section  
- View all employees in the company.  
- Powerful search bar and filters:
  - Filter by department.  
  - Filter by status (active/inactive).  
- Add new employees via a dedicated form.  

### 🏢 Department Section  
- Two overview cards:
  - Total employees.  
  - Total departments.  
- List of departments with respective employee counts.  

### 🕒 Attendance Section  
- Four summary cards:
  - Today’s present percentage.  
  - Present employees count.  
  - Absent employees count.  
  - Checkout time.  
- View departments and their present employee counts.  
- Mark attendance by department:
  - Displays employees of the selected department.  
  - Attendance status updates automatically.  

### 🚪 Logout  
- Secure logout functionality for all users.  

---

## 🛠️ Tech Stack  
- **Frontend:** React, Bootstrap CSS  
- **Backend / Database:** Supabase  

---

## 📂 Project Structure

WorkWise/
│-- public/                 # Static assets (logo, demo thumbnail, etc.)  
│-- src/  
│   │-- components/          # Reusable React components  
│   │-- pages/               # Main pages (Dashboard, Employees, Admins, etc.)  
│   │-- supabaseClient.js    # Supabase client configuration  
│   │-- index.css            # Global styles  
│   │-- main.jsx             # App entry point  
│-- .env                     # Environment variables (not pushed to GitHub)  
│-- .gitignore               # Ignore sensitive files  
│-- package.json  
│-- vite.config.js  
│-- README.md  

---

---

## ⚡ Getting Started  

### Prerequisites  
- Node.js (v16 or later)  
- Supabase account & project  

### Installation  

### Clone repository
git clone https://github.com/Rashmitharaka1/workwise.git

### Navigate to project folder
cd workwise

### Install dependencies
npm install

### Start development server
npm run dev

---
### 👨‍💻 Author

Developed by Rashmi Tharaka

📧 Contact: rashmitharaka509@gmail.com
