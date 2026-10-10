# Módulo Inscripción

La página que abre el cliente al escanear el QR del mostrador.

Contraparte de `fidelify-backend/agent/features/modulo_inscripcion.md`, que
tiene el **contrato completo de los dos endpoints** y las reglas. Este documento
describe solo el lado de la página.

---

## Archivos

| Archivo | Qué |
|---|---|
| `src/pages/JoinPage.tsx` | La página, y el componente `Shell` |
| `src/api/client.ts` | `publicApi` (`getProgram`, `join`), `apiUrl()` y los tipos |
| `src/main.tsx` | Registra `/join/:slug` |

---

## Estados de la página

| Estado | Qué se ve |
|---|---|
| Cargando | "Cargando…" |
| El negocio no carga | "No encontramos este negocio." |
| Listo | Cabecera del negocio + formulario |
| Inscrito | Cabecera del negocio + botones de la billetera + código de la tarjeta |

Los cuatro llevan el pie "Tarjeta digital por Fidelify".

---

## Flujo

### 1. Cargar el negocio

`GET /public/businesses/:slug` al entrar, con el `slug` de la URL. De la
respuesta salen:

- el nombre y el logo del negocio, para la cabecera;
- sus colores, que se aplican a toda la página como variables CSS;
- `stampsRequired` y `rewardText`, para la frase "Junta 8 sellos y llévate 1
  helado gratis";
- `consentText`, el texto junto a la casilla de consentimiento.

### 2. El formulario

| Campo | Obligatorio | Notas |
|---|---|---|
| Nombre | sí | 2 a 80 caracteres |
| Celular | sí | abre el teclado de teléfono; ejemplo `0991234567` |
| Correo | no | |
| Cumpleaños | no | "para un regalo" |
| Consentimiento | sí | casilla con el texto que manda el backend |

Es un formulario **no controlado**: los valores se leen con `FormData` al
enviar. Antes de mandar:

- nombre y correo se recortan;
- al celular se le quitan **espacios y guiones**, nada más;
- correo y cumpleaños vacíos no se mandan (el backend rechaza una cadena vacía
  como correo inválido).

Mientras se envía, el botón se deshabilita y dice "Creando tu tarjeta…".

### 3. Inscrito

`POST /public/businesses/:slug/join` devuelve el código de la tarjeta y las dos
URLs de la billetera. La página cambia el formulario por:

- "Agregar a Apple Wallet" y "Agregar a Google Wallet", dos enlaces a esas URLs;
- el código de la tarjeta (`FL-…`), como respaldo.

Se muestran **los dos botones siempre**, sin detectar si el celular es iPhone o
Android.

---

## Reglas

- **Los colores son del negocio.** `business.colors.background` y `.foreground`
  se vuelven `--brand` y `--brand-text` en el contenedor de la página. Si el
  negocio no definió colores, se usa el acento de Fidelify.
- **El texto de consentimiento se pinta tal como llega.**
- **La casilla de consentimiento es obligatoria** en el navegador (`required`)
  y otra vez en el backend, que es el que manda.
- **Un error no borra el formulario.** Se muestra el mensaje del backend debajo
  de los campos y el cliente corrige sobre lo que ya escribió.
- **Las URLs de la billetera son rutas de la API**, no de esta página: pasan por
  `apiUrl()`, que les antepone `VITE_API_URL`.

---

## Lo que NO hace esta página

- No guarda nada en el navegador. Recargar después de inscribirse vuelve al
  formulario; llenarlo otra vez con el mismo teléfono devuelve la misma tarjeta.
- No muestra los sellos que el cliente ya tiene. Eso lo dice la tarjeta en la
  billetera.
- No tiene sesión ni cuenta.

---

## Sin resolver

- **Sin credenciales de Wallet en el backend, el botón lleva a un 501** en
  JSON crudo, sin una página que le explique nada al cliente.
- **Se muestran los dos botones a cualquier celular**: un iPhone ve también el
  de Google, y un Android el de Apple.
- **Cualquier fallo al cargar dice "No encontramos este negocio."**, también si
  es la red o el servidor. Un cliente sin señal cree que el QR está mal.
- **El teléfono no se normaliza.** `0991234567` y `+593991234567` terminan
  siendo dos clientes con dos tarjetas. Pendiente también en el backend.
- **El campo de celular no valida formato** en el navegador: un número corto
  viaja al backend y vuelve como error.
- **El título de la pestaña es siempre "Fidelify"**, no el nombre del negocio.
- **La landing de venta no existe**: cualquier ruta que no sea `/join/:slug`
  muestra un marcador.
