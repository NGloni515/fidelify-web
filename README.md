# fidelify-web

Página pública de **Fidelify**. El cliente escanea el QR del mostrador, llega a `/join/:slug`, se inscribe y agrega su tarjeta a Apple Wallet o Google Wallet.

Stack: React 19 · Vite · TypeScript · React Router.

## Arranque local

```bash
npm install
npm run dev    # http://localhost:5174/join/heladeria-demo
```

Necesita el backend (`fidelify-backend`) en `http://localhost:3000` con el seed cargado (`npm run db:seed`).
En producción, define `VITE_API_URL` con la URL del backend (ver `.env.example`).

## Estado

- Formulario de inscripción con consentimiento de datos: funcional.
- Botones de Apple/Google Wallet: listos, esperan la implementación del módulo `wallet` del backend.
- Landing de venta de Fidelify: pendiente.
