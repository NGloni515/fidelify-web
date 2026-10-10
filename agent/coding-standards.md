# Coding Standards

## TypeScript

- Modo estricto. `tsconfig.app.json` no lo declara: en TypeScript 6 `strict`
  viene activo por defecto. Sin `any` — el tipo real o `unknown`.
- **`erasableSyntaxOnly`** prohíbe las *parameter properties* y los `enum`.
- **`verbatimModuleSyntax`**: lo que se importa solo como tipo lleva `type`
  (`import { useState, type FormEvent } from 'react'`).
- `noUnusedLocals` y `noUnusedParameters` están activos: lo que no se usa rompe
  el build.

## Estructura de carpetas

```
src/
  main.tsx      rutas
  api/          client.ts: api(), tipos de respuesta, publicApi, apiUrl()
  pages/        una página por ruta
  index.css     tokens y estilos
```

Las rutas se declaran **a mano** en `src/main.tsx`.

## El peso importa

Esta página la descarga alguien con datos móviles, parado en una fila.

- **Una dependencia nueva se justifica.** Hoy son tres (`react`, `react-dom`,
  `react-router`). Si algo se resuelve con la plataforma —`fetch`, `FormData`,
  validación nativa del formulario, `<input type="date">`— no se instala una
  librería para eso.
- Sin webfonts, sin librería de componentes, sin librería de formularios.
- Las imágenes del negocio (`logoUrl`) no son nuestras: llevan tamaño fijo en
  CSS para que una imagen enorme no rompa la página.

## React

- Componentes funcionales, sin clases.
- Un componente que solo usa una página vive en el archivo de esa página
  (`Shell` en `JoinPage.tsx`).
- **Estado global: ninguno.** El estado de la página es `useState`.
- Una carga con `useEffect` descarta la respuesta si el componente ya se
  desmontó o cambió el `slug` (la bandera `alive` de `JoinPage`). Sin eso, una
  respuesta lenta del negocio anterior pisa la del actual.

## Datos y HTTP

- Toda petición pasa por `api()` de `src/api/client.ts`. No se llama `fetch`
  suelto.
- `fetch` **no lanza** en 4xx/5xx — por eso `api()` revisa `res.ok` y lanza un
  `Error` con el mensaje del backend.
- Los tipos de cada respuesta viven junto al cliente, en `src/api/client.ts`.
- Los parámetros que van en una ruta pasan por `encodeURIComponent`.
- Las URLs de la billetera llegan del backend como rutas relativas de la API;
  se arman con `apiUrl()`, no concatenando a mano.

## El backend manda

- **Nada del programa se escribe acá.** Cuántos sellos, cuál es el premio, el
  nombre y los colores del negocio: todo viene de la API.
- **El texto de consentimiento se pinta tal como llega.** No se resume, no se
  reescribe, no se le pone un respaldo local.
- Se mandan **insumos** (lo que el cliente escribió), y se muestra lo que el
  backend responde.
- La validación del formulario (`required`, `minLength`, `type="email"`) es
  feedback inmediato y tiene que **coincidir con el DTO del backend**
  (`JoinDto`). El backend valida porque es el que manda.

## Errores

- Se muestra el `message` que devuelve el backend, no uno inventado.
- `api()` ya une los mensajes cuando el backend manda una lista (errores de
  validación).
- Un error al inscribirse **no borra lo que el cliente escribió**.

## Datos personales

Esta página recoge nombre, teléfono, correo y cumpleaños.

- No se guardan en el navegador: ni `localStorage`, ni cookies.
- No viajan en la URL ni se escriben en la consola.
- No se agrega analítica ni scripts de terceros sin decidirlo antes: verían lo
  que el cliente escribe.

## Estilos

- CSS propio en `src/index.css`, con variables. **Nunca un hex literal en un
  componente.** Ver `design-system.md`.
- Los estilos van por clase. `style` en línea solo para las variables de marca
  del negocio, que salen de datos.

## Naming

- Archivos de componente: `PascalCase.tsx`. Todo lo demás: `kebab-case.ts`.
- El código va en inglés; los textos que ve el usuario, en español.

## Tests

No hay runner instalado. El primero que agregue lógica pura —normalizar un
teléfono, por ejemplo— instala Vitest y pone el `*.test.ts` junto al código que
prueba. Los valores esperados se calculan a mano, nunca se pegan de una corrida.

## Verificación

```bash
npm run build
npm run lint
```

## Comentarios

- **Los comentarios se escriben en inglés**, aunque la documentación esté en
  español.
- Escribir el **mínimo**. Por defecto, ninguno.
- Nunca describir *qué* hace el código ni narrar los pasos: el código ya lo dice.
- Comentar solo un **porqué** no obvio: una decisión, un workaround, una
  restricción externa, o algo fácil de romper sin darse cuenta.
- Preferir un nombre claro a un comentario. Ante la duda, no comentar.

## Deuda

Se paga por arrastre: el archivo que se toca por otra razón sale cumpliendo.

| Qué | Dónde |
|---|---|
| Comentarios en español y docstrings que narran | `src/` y `vite.config.ts` |
| Hex literales como respaldo de los colores del negocio | `src/pages/JoinPage.tsx` |

## Documentación de agente

- `agent/features/*.md` describen cómo funciona un módulo *hoy*: reglas, flujos,
  mapa de archivos. Nunca un changelog: nada de "antes de esto…", "se corrigió",
  ni referencias a un PR o a un bug pasado. Si una regla necesita justificarse,
  se explica la restricción, no su historia.
- Una regla que aplica a más de un módulo va en este archivo, no en el doc de
  una feature.
