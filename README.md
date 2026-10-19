# Blood Donation & Event Management Portal (3rd Sem CEP)

A clean, simple information portal for **Blood Donation & Event Management**.

---

## 🎨 Theme & Design

- **Theme Palette**: Clean slate & white medical palette (`#f8fafc` background, `#ffffff` cards, `#0f172a` typography, `#dc2626` crimson red accents).
- **Scope**: Clean first landing page giving basic, essential information about the platform and nothing else.

---

## 📋 Core Information Covered

1. **What is the Platform?**:
   - A unified system connecting voluntary blood donors with hospitals, managing urgent blood needs and community donation camps.
2. **For Donors**:
   - Donors register their blood group and city to receive urgent alerts when hospitals face critical shortages.
3. **For Hospitals**:
   - Hospitals and blood banks request units for surgeries, emergency trauma care, and treatment centers.
4. **Donation Camps**:
   - Information about community-driven blood donation drives organized by civic bodies and colleges.
5. **How It Works**:
   - Simple 3-step lifecycle: **Request Posted &rarr; Donor Matched &rarr; Life Saved**.

---

## 🏗️ Backend

- **Spring Boot Backend**: In-memory Class-Object models (`User`, `Hospital`, `BloodRequest`, `DonationEvent`) running on `http://localhost:8080`.

---

## 🚀 How to Run

### Spring Boot Backend
```bash
cd backend
./run.sh
```
Runs at: **`http://localhost:8080`**

### React Frontend
```bash
cd frontend
npm run dev
```
Runs at: **`http://localhost:5173`**
