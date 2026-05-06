# DRO Renovaties website

Production-ready Next.js website voor DRO Renovaties.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Reusable components

## Lokaal openen

```bash
npm install
npm run dev
```

Open daarna:

```text
http://localhost:3000
```

## Klaarmaken voor deploy

```bash
npm run build
```

Als dit zonder fouten klaar is, kan de site live gezet worden.

## Deploy advies

De makkelijkste route is Vercel:

1. Zet deze map in een GitHub repository.
2. Importeer de repository in Vercel.
3. Vercel herkent automatisch Next.js.
4. Build command: `npm run build`
5. Output blijft standaard `.next`.

## Waar pas je content aan?

- Diensten overzicht: `components/siteContent.ts`
- Projecten: `components/projectData.ts`
- Homepage: `app/page.tsx`
- Over ons: `app/over-ons/page.tsx`
- Contactformulier: `components/LeadForm.tsx`
- Logo's en foto's: `public/`

Nieuwe projectfoto's zet je in `public/` en daarna koppel je ze in `components/projectData.ts`.

## Belangrijk

`preview.html` is alleen voor snelle lokale preview. Voor echte deploy gebruik je de Next.js code in `app/`, `components/` en `public/`.

