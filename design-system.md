# Design System — Página pública (CSS con variables)

Traducción del sistema definido en [`../design-system.md`](../design-system.md).
Ese archivo manda; este solo dice **cómo se escribe en este repo**.

Todo el estilo está en un archivo: [`src/index.css`](src/index.css). No hay
librería de componentes, ni CSS-in-JS, ni Tailwind, ni webfonts.

> **Esta página lleva la marca del negocio, no la de Fidelify.** Es la
> diferencia con el panel (`fidelify-backoffice`), que sí lleva la nuestra. No
> se copian estilos de uno al otro, aunque los dos `index.css` se parezcan.

---

## 1. La marca llega por datos

Los colores del negocio vienen en la respuesta de la API y se aplican como
variables CSS sobre el contenedor de la página:

| Variable | Sale de | Respaldo |
|---|---|---|
| `--brand` | `business.colors.background` | acento de Fidelify |
| `--brand-text` | `business.colors.foreground` | blanco |

`business.colors.label` no se usa aquí: es para la tarjeta de la billetera.

**Qué se tiñe y qué no:**

| Con la marca del negocio | Siempre neutro |
|---|---|
| fondo y texto de la cabecera | fondo de página, panel del formulario |
| botón principal | labels, inputs, texto de ayuda |
| | errores |
| | botones de Apple Wallet y Google Wallet |

La razón: el negocio elige cualquier color, y la página tiene que leerse igual
con todos. Lo que el cliente **lee y llena** no depende de la paleta de nadie.

**Los colores del negocio no se corrigen.** No se aclaran, no se oscurecen, no
se armonizan con los neutros.

---

## 2. Reglas de escritura

**Nunca un hex literal en un componente ni en una regla nueva.** Siempre la
variable. Los colores de marca se usan **solo** a través de `--brand` y
`--brand-text`, nunca leyendo `business.colors` en un `style` suelto.

**Los estilos van por clase**, definidos en `index.css`. El único `style` en
línea es el que inyecta las dos variables de marca.

---

## 3. Tokens

Declarados en `:root`:

| Variable | Para |
|---|---|
| `--brand` / `--brand-text` | marca del negocio (ver §1) |
| `--bg` | fondo de página |
| `--surface` | panel del formulario |
| `--text` | texto |
| `--muted` | ayuda, "(opcional)", consentimiento, pie |
| `--border` | bordes del panel y de los inputs |
| `--error` | mensaje de error |

Los valores de los neutros están en [`../design-system.md`](../design-system.md)
§2.1.

---

## 4. Clases que ya existen

| Clase | Qué es |
|---|---|
| `page` | la columna: 460px de ancho máximo, centrada |
| `hero` | cabecera con la marca del negocio |
| `logo` | logo del negocio: 72×72, sin deformar, sobre fondo blanco |
| `panel` | tarjeta del formulario, montada sobre el borde de la cabecera |
| `consent` | la fila de la casilla de consentimiento |
| `wallet apple`, `wallet google` | los dos botones de la billetera |
| `muted`, `small`, `error` | textos |
| `footer` | "Tarjeta digital por Fidelify" |

`label`, `input` y `button` están estilizados por etiqueta.

---

## 5. Componentes

**Una sola columna.** La página se diseña para un celular en vertical y no tiene
variante de escritorio: en una pantalla ancha es la misma columna, centrada.

**Formulario.** Label arriba de cada campo, nunca placeholder como label. Los
opcionales lo dicen en el label ("Correo (opcional)"). Nombre, celular y correo
declaran su `autoComplete`, y el celular `inputMode="tel"`: que el teléfono
ofrezca los datos guardados es media inscripción hecha.

**Un botón principal.** "Obtener mi tarjeta". Mientras se envía se deshabilita y
cambia de texto, para que nadie toque dos veces.

**Botones de la billetera.** Tienen los colores de Apple y de Google, no los
del negocio ni los nuestros: negro con texto blanco, y blanco con borde gris.

**Logo.** Lo sube el negocio y puede tener cualquier proporción: va en una caja
fija con `object-fit: contain`. Lleva `alt=""`, porque el nombre del negocio ya
está escrito al lado.

**Fidelify.** Una sola mención, en el pie, en `--muted`.

---

## 6. Tono

Se tutea, en frases cortas, y se habla del beneficio: "Junta 8 sellos y llévate
1 helado gratis", "¡Listo! Ya eres parte del club". Nada de "registro",
"usuario" ni "cuenta": el cliente no se está registrando en nada, está pidiendo
su tarjeta.

---

## 7. Deuda

| Qué | Dónde |
|---|---|
| Hex literales como respaldo de la marca (`#c2185b`, `#ffffff`) | `src/pages/JoinPage.tsx` |
| Hex literales en los botones de la billetera, el fondo del logo y el de los inputs | `src/index.css` |
| Nadie valida que `--brand-text` se lea sobre `--brand` | ver `../design-system.md` §7 |
| El favicon es el de la plantilla de Vite | `public/favicon.svg` |

---

## 8. Verificación

```bash
npm run build
npm run lint
```

Y **mirar la página a ancho de celular**, con un negocio que tenga colores y con
uno que no.
