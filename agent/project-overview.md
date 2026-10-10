# Fidelify — Página pública (Vite + React)

> Página de inscripción que ve el **cliente final**. Las reglas de negocio son
> **autoritativas del backend** (`fidelify-backend`, NestJS); esta app solo
> presenta y dispara acciones. Para el detalle técnico, ver `agent/features/`.

---

## Qué es esta app

Fidelify son tarjetas de sellos y cupones que viven en la billetera del celular.
Esta página es **la puerta de entrada**: el único contacto del cliente final con
Fidelify antes de tener la tarjeta.

El recorrido completo:

1. El cliente ve un QR en el mostrador de una heladería, o en su Instagram, y lo
   escanea con la cámara.
2. Llega a `/join/<slug-del-negocio>`.
3. Escribe su nombre y su teléfono, y acepta el uso de sus datos.
4. Toca "Agregar a Apple Wallet" o "Agregar a Google Wallet".

De ahí en adelante no vuelve: la tarjeta vive en su billetera y los sellos se
los dan en la caja.

---

## Quién la usa

Alguien que **no eligió usar Fidelify**: vino por un helado. Está parado, con
una mano ocupada, con datos móviles, y no va a leer nada largo ni a crear una
cuenta. Cada campo de más y cada segundo de carga es un cliente que guarda el
celular.

Por eso la página es una sola columna angosta, pide dos datos obligatorios y
carga tres dependencias.

---

## El sistema más amplio

| Repo | Para quién | Identidad |
|---|---|---|
| `fidelify-backend` | todos | — |
| **`fidelify-web`** (este) | **el cliente final, anónimo** | **ninguna: el `slug` del negocio en la URL** |
| `fidelify-backoffice` | dueño y cajeras del negocio | `StaffUser` |

Esta página es **multi-negocio por URL**: el mismo código sirve a todos los
negocios, y el `slug` decide cuál se muestra y con qué colores.

---

## Mapa de rutas (`src/main.tsx`)

| Ruta | Qué | Estado |
|---|---|---|
| `/join/:slug` | Inscripción al programa de un negocio | funcional |
| cualquier otra | Cabecera con el nombre de Fidelify y una frase | marcador: la landing de venta no existe |

---

## La marca es del negocio

La cabecera y el botón principal se tiñen con los colores del negocio, que
llegan en la respuesta de la API (`business.colors`). Fidelify aparece una sola
vez, en el pie: "Tarjeta digital por Fidelify".

Detalle en `design-system.md`.

---

## Arquitectura técnica

| Pieza | Qué |
|---|---|
| Build | Vite 8, salida estática. Sin SSR |
| UI | React 19, CSS propio con variables en `src/index.css`. Sin librería de componentes |
| Rutas | React Router 8 (`createBrowserRouter`), declaradas en código |
| Datos | **`fetch` nativo** + `useEffect`. Sin TanStack Query, sin axios |
| Lint | oxlint |

En desarrollo, Vite reenvía `/api` a `http://localhost:3000`. En producción la
página llama a `VITE_API_URL`.

**No guarda nada en el navegador**: ni `localStorage`, ni cookies. Recargar
después de inscribirse vuelve al formulario; inscribirse otra vez con el mismo
teléfono devuelve la misma tarjeta.

---

## Documentación relacionada

- Inscripción: [`modulo_inscripcion`](features/modulo_inscripcion.md)
- Backend de la inscripción: `fidelify-backend/agent/features/modulo_inscripcion.md`
  (contrato de los endpoints y reglas)
- Billetera: `fidelify-backend/agent/features/modulo_wallet.md`
- Design system: `design-system.md` de este repo + `../design-system.md` (general)
