# CLAUDE.md

Guía para Claude Code (claude.ai/code) al trabajar en este repo.

## Qué es esto

**Página pública de Fidelify.** El cliente final escanea el QR del mostrador,
llega a `/join/:slug`, deja su nombre y su teléfono, y agrega la tarjeta del
negocio a la billetera de su celular.

Quien la usa es **anónimo**, está **parado en la fila de una heladería**, con el
celular en la mano y datos móviles. Tiene que terminar en menos de un minuto.
No hay sesión, ni cuenta, ni nada que recordar.

La página lleva **la marca del negocio**, no la de Fidelify.

La inscripción es funcional. Los botones de Apple Wallet y Google Wallet llevan
a la tarjeta cuando el backend tiene credenciales de Wallet; sin ellas responde
501.

## La lógica de negocio vive en el backend

**Esta página captura y muestra; el backend calcula y valida.**

- Lo que se muestra del programa (cuántos sellos, cuál es el premio) sale de la
  API. Nada de eso se escribe acá.
- **El texto de consentimiento viene de la API y se pinta tal cual.** Es el
  mismo texto que queda guardado como evidencia legal: una copia redactada acá
  rompe esa correspondencia.
- La validación del formulario es feedback. La que manda es la del backend, y
  su mensaje es el que se muestra.

Detalle en [`agent/coding-standards.md`](agent/coding-standards.md).

## Design system

Antes de escribir UI se leen **dos** archivos: [`design-system.md`](design-system.md)
de este repo y el general, en la carpeta que agrupa los repos
(`../design-system.md`).

## Archivos de contexto

- @agent/project-overview.md
- @agent/coding-standards.md
- @agent/ai-interaction.md

Detalle de la inscripción: `agent/features/modulo_inscripcion.md`. El contrato
de los endpoints está del lado del backend, en
`../fidelify-backend/agent/features/modulo_inscripcion.md`.

## Comandos

```bash
npm run dev        # servidor de desarrollo (puerto 5174)
npm run build      # tsc -b && vite build
npm run preview    # sirve el build
npm run lint       # oxlint
```

No hay tests ni runner de tests instalado.

## Verificación

```bash
npm run build
npm run lint
```

## Probar de verdad

```bash
npm --prefix ../fidelify-backend run db:up
npm --prefix ../fidelify-backend run db:migrate
npm --prefix ../fidelify-backend run db:seed
npm --prefix ../fidelify-backend run start:dev   # :3000
npm run dev                                      # :5174
```

Y abrir `http://localhost:5174/join/heladeria-demo` **a ancho de celular**.

En desarrollo no hace falta `VITE_API_URL`: Vite reenvía `/api` a
`localhost:3000` (`vite.config.ts`), y por eso el CORS no interviene.

## Arquitectura

| Pieza | Qué |
|---|---|
| Build | Vite 8, salida estática. Sin SSR |
| UI | React 19. **Sin librería de componentes**: CSS propio en `src/index.css` |
| Rutas | React Router 8, declaradas a mano en `src/main.tsx` |
| Datos | `fetch` + `useEffect`. **Sin TanStack Query** |
| HTTP | envoltorio en `src/api/client.ts`. Sin axios |
| Lint | oxlint. Sin Prettier ni ESLint |

Tres dependencias de runtime: `react`, `react-dom`, `react-router`. Cada una que
se agregue la descarga un cliente con datos móviles, en una fila.

```
src/main.tsx            rutas
src/api/client.ts       api(), tipos de las respuestas, publicApi, apiUrl()
src/pages/JoinPage.tsx  la página de inscripción
src/index.css           tokens y estilos
```

## Variables de entorno

`VITE_API_URL` — URL del backend en producción. Vacía en desarrollo. Ver
`.env.example`. Vite la incrusta **al compilar**: cambiarla exige un build nuevo.

## Despliegue

Corre en **Vercel**, con la configuración de Vite que detecta sola.

- **`vercel.json` devuelve `index.html` para cualquier ruta.** La puerta de
  entrada de todo cliente es `/join/<slug>`, abierta directo desde un QR: sin
  ese respaldo, cada cliente nuevo ve un 404.
- **`VITE_API_URL`** es la URL del backend, sin `/api` al final. Vite la
  incrusta al compilar: cambiarla exige un deploy nuevo.
- Esta página llama directo al backend, desde otro dominio: su origen tiene que
  estar en `CORS_ORIGINS` del backend. No hay cookies de por medio, así que no
  necesita el proxy que usa el panel.
- **La URL pública va impresa en el QR del mostrador de cada negocio.** Cambiar
  el dominio o la forma de la ruta `/join/:slug` rompe todos los letreros.
- **Backend primero, siempre.** Usa `ValidationPipe` con
  `forbidNonWhitelisted: true`: un campo nuevo en el formulario se rechaza con
  400 hasta que el DTO esté desplegado.

## Convención de PRs

- Rama nueva desde **`origin/main`**: `feat/<algo>` o `fix/<algo>`.
- Cuerpo con **¿Qué?** y **¿Por qué?** (+ Verificación).
