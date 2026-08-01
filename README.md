# Nurvia - Musulmon uchun kerakli barcha narsalar

Nurvia - musulmonlar uchun barcha kerakli narsalarni bitta joyda jamlaydigan mobil ilova. Namoz vaqtlari, Qur'on, Duolar, Qibla, Tasbeh va boshqa vositalar.

## 🌟 Xususiyatlar

- **Namoz vaqtlari** - Kunlik namoz vaqtlari va qoldiq vaqtlari
- **Qur'on** - Suralar va oyatlar bilan audio qo'llab-quvvatlash
- **Duolar** - Har xil vaziyatlar uchun duolar
- **Qibla** - Kompas orqali Qibla yo'nalishi
- **Tasbeh** - Digital tasbeh hisoblagich
- **Masjidlar** - Eng yaqin masidlarni topish
- **Multi-language** - O'zbek (lotin/krill), Rus tili
- **Audio player** - Qur'on va duolar uchun audio pleyer

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: UmmahAPI, Aladhan API

## 📦 O'rnatish

### Talablar

- Node.js 18.0.0 yoki yuqori
- npm yoki yarn

### Qadamlar

1. Repositoryni kloning:
```bash
git clone <your-repo-url>
cd nur.uz
```

2. Dependencies o'rnating:
```bash
npm install
```

3. Development serverni ishga tushuring:
```bash
npm run dev
```

4. Browserda oching: `http://localhost:3000`

## 🏗️ Build

Production build uchun:

```bash
npm run build
```

Build natijasi `.next` papkasida hosil bo'ladi.

## 🌐 Deploy

### Cloudflare Pages (GitHub orqali)

1. GitHubga repository yaratish va kodni push qilish
2. Cloudflare Pages → "Create a project"
3. GitHubni tanlash va repositoryni tanlash
4. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Node.js version**: `18`

### Vercel

1. Vercelga import qiling
2. Build settings avtomatik sozlanadi

### Netlify

1. Netlifyga import qiling
2. Build command: `npm run build`
3. Publish directory: `.next`

## 📁 Loyiha tuzilishi

```
nur.uz/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── asboblar/    # Vositalar sahifasi
│   │   ├── duolar/      # Duolar sahifasi
│   │   ├── namoz/       # Namoz sahifasi
│   │   ├── quran/       # Qur'on sahifasi
│   │   └── page.tsx     # Bosh sahifa
│   ├── components/      # React komponentlar
│   ├── contexts/        # React Contexts
│   └── config/          # Konfiguratsiya fayllari
├── public/              # Static fayllar
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔧 Konfiguratsiya

API kalitlari `src/config/api.ts` faylida joylashgan.

## 🌍 Tillar

- O'zbek (Lotin)
- O'zbek (Krill)
- Rus

## 📄 Litsenziya

Bu loyiha Nurvia uchun maxsus yaratilgan.

## 🤝 Hamkorlik

Hamkorlik qilish uchun pull request yuboring.

## 📞 Aloqa

Savollar uchun: support@nurvia.uz

---

Versiya: 1.02.0
