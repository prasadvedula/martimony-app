# Martmony — Hindu Matrimonial App

## Prerequisites

- **Node.js** 18+ — Install from https://nodejs.org/
- **PostgreSQL** 14+ — Install from https://www.postgresql.org/download/windows/

---

## Quick Setup (Windows)

### 1. Fix Node.js (NVM symlink is broken on this machine)

Open PowerShell as Administrator and run:
```powershell
# Option A: Install Node.js directly (recommended)
# Download the LTS installer from https://nodejs.org/ and run it

# Option B: Re-create NVM symlink if nvm is installed elsewhere
# nvm use 18
```

### 2. Create the database

```sql
-- In psql or pgAdmin:
CREATE DATABASE martmony_db;
```

### 3. Configure environment

```powershell
Copy-Item .env.example .env
# Edit .env with your database credentials and secrets
```

`.env` file:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/martmony_db"
NEXTAUTH_SECRET="change-this-to-a-random-string"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@martmony.com"
ADMIN_PASSWORD="Admin@123"
ADMIN_SECRET="your-admin-registration-secret"
```

### 4. Install dependencies

```powershell
cd c:\Martmony-app
npm install
```

### 5. Generate Prisma client and push schema

```powershell
npm run db:generate
npm run db:push
```

### 6. Seed the database

```powershell
npm run db:seed
```

This creates:
- Admin user (`admin@martmony.com` / `Admin@123`)
- 4 sample profiles

### 7. Start the development server

```powershell
npm run dev
```

Open http://localhost:3000

---

## Features

| Feature | URL | Access |
|---------|-----|--------|
| Landing page | `/` | Public |
| Browse profiles | `/profiles` | Public |
| Profile detail | `/profiles/:id` | Public |
| Register profile | `/profiles/new` | Public |
| Kundali match | `/match` | Public |
| Login | `/login` | Public |
| Register account | `/register` | Public |
| Consent response | `/consent/:token` | Public (token-gated) |
| Admin dashboard | `/admin` | Admin only |
| Bulk PDF upload | `/admin/upload` | Admin only |

---

## PDF Upload Format

Each profile block should be separated by blank lines and use `Label: Value` format:

```
Name: Priya Sharma
Gender: Female
Date of Birth: 1995-03-15
Birth Time: 06:30
Place of Birth: Bangalore, Karnataka
Caste: Brahmin
Sub Caste: Smartha
Gotram: Bharadvaja
Nakshatra: Rohini
Rashi: Vrishabha
Mangal: No
Education: B.Tech Computer Science
Occupation: Software Engineer
Phone: 9876543210
Email: family@example.com

Name: Rajesh Kumar
Gender: Male
...
```

---

## Kundali Matching System

Uses the standard **Ashtakoot (8-koot) system** with a maximum of **36 points**:

| Koot | Points | Tests |
|------|--------|-------|
| Varna | 1 | Spiritual/social compatibility |
| Vasya | 2 | Mutual control |
| Tara | 3 | Health & longevity |
| Yoni | 4 | Physical compatibility |
| Graha Maitri | 5 | Mental compatibility |
| Gana | 6 | Nature/temperament |
| Bhakoot | 7 | Financial/relationship |
| Nadi | 8 | Health & progeny |

Score interpretation:
- 32–36: Excellent
- 27–31: Good
- 18–26: Average
- 12–17: Below Average
- <12: Poor

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **NextAuth.js** (credentials provider)
- **Tailwind CSS**
- **pdf-parse** (bulk upload)
- **bcryptjs** (password hashing)
