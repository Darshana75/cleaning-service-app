# 🧹 Cleaning Service Management System

A Full-Stack CRUD Web Application for Cleaning Service Management System with Admin Panel and User Authentication.
---

## 🚀 Features

### 👤 User Functionality
- Register and login with secure password hashing
- Book a cleaning service
- View, edit or cancel your own bookings
- Select service type from a dropdown

### 🛠 Admin Ready (Backend)
- Admins can be manually flagged in DB 
- View all bookings 

---

## 🖥 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Deployment**: Vercel  

---

## 📦 Installation Guide

### 1 Clone the Repository 
```bash
git clone https://github.com/Darshana75/cleaning-service-app.git 
cd cleaning-service-app
```

### 2 Backend Setup

```bash
cd backend
npm install
node server.js
```

> Ensure MongoDB is running locally on `mongodb://localhost:27017/cleaningdb`.

### 3 Frontend Setup

```bash
cd frontend
npm install
npm start
```

> App will run at: [http://localhost:3000](http://localhost:3000)

---

## ✅ API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Bookings
- `GET /bookings` 
- `POST /bookings` 
- `PUT /bookings/:id`
- `DELETE /bookings/:id`

### Services
- `GET /services`

---

## 📷 UI Design

>
![Login Page](<Login Page.png>)
Admin Login 
User Name - admin
Password - 5764 
![Admin Panel](<Admin Panel.png>)
![User Panel](<User Panel.png>)
---

💻 Made by Darshana Prabath 