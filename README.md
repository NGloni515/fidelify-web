# fidelify-web

Página pública de **Fidelify**. El cliente escanea el QR del mostrador, llega a `/join/:slug`, se inscribe y agrega su tarjeta a Apple Wallet o Google Wallet.

Stack: React 19 · Vite · TypeScript · React Router.

## Arranque local

```bash
npm install
npm run dev    # http://localhost:5174/join/heladeria-demo
```

Necesita el backend (`fidelify-backend`) en `http://localhost:3000` con el seed cargado (`npm run db:seed`).
En producción corre en Vercel: define `VITE_API_URL` con la URL del backend (ver `.env.example`) y agrega el origen de la página a `CORS_ORIGINS` del backend.

## Documentación

| Qué | Dónde |
| --- | --- |
| Guía para agentes | [`CLAUDE.md`](CLAUDE.md) |
| Contexto y arquitectura | [`agent/project-overview.md`](agent/project-overview.md) |
| Estándares de código | [`agent/coding-standards.md`](agent/coding-standards.md) |
| Flujo de trabajo | [`agent/ai-interaction.md`](agent/ai-interaction.md) |
| Inscripción | [`agent/features/modulo_inscripcion.md`](agent/features/modulo_inscripcion.md) |
| Estilos | [`design-system.md`](design-system.md) |

El contrato de los endpoints está del lado del backend, en
`../fidelify-backend/agent/features/modulo_inscripcion.md`.

## Estado

- Formulario de inscripción con consentimiento de datos: funcional.
- Botones de Apple/Google Wallet: llevan a la tarjeta cuando el backend tiene credenciales de Wallet; sin ellas, a un 501.
- Landing de venta de Fidelify: pendiente.
