# AI Interaction Guidelines

## Comunicación

- Conciso y directo. Explicar lo no obvio, no lo evidente.
- Preguntar antes de refactors grandes o cambios de arquitectura.
- No agregar features que nadie pidió. **Tampoco campos al formulario**: cada
  uno le cuesta inscritos al negocio.
- Nunca borrar archivos sin confirmar.

## Flujo por cambio

1. **Rama** desde `origin/main`: `feat/<algo>` o `fix/<algo>`.
2. **Implementar**.
3. **Verificar**: `npm run build`, `npm run lint`.
4. **Probar en el navegador de verdad**, a ancho de celular. Ver abajo.
5. **Commit** solo cuando todo lo anterior pasa, y solo con permiso.
6. **PR** con las secciones **¿Qué?** y **¿Por qué?**.

## Commits

- Mensajes convencionales (`feat:`, `fix:`, `chore:`, `docs:`).
- Uno por cambio lógico.
- **Preguntar antes de commitear.** No auto-commitear.

## Verificar de verdad

Esta página es lo primero que un cliente ve de un negocio, y nadie va a avisar
si falla: el cliente simplemente guarda el celular.

Con el backend en `localhost:3000` (base arriba y seed cargado) y la página en
`localhost:5174`, **a ancho de celular**:

- `/join/heladeria-demo`: la cabecera sale con los colores del negocio y dice
  cuántos sellos pide y cuál es el premio.
- `/join/no-existe`: dice que no encuentra el negocio, sin pantalla en blanco.
- Enviar sin marcar el consentimiento: no deja.
- Inscribirse: aparecen los dos botones de la billetera y el código `FL-…`.
- Inscribirse otra vez con el **mismo teléfono**: el código es el **mismo**.
- Un teléfono inválido (`123`): se lee el mensaje del backend y lo que estaba
  escrito sigue ahí.
- **Con el backend apagado**: se ve un error, nunca la pantalla de "¡Listo!".

En local, sin credenciales de Wallet en el backend, los botones de la billetera
llevan a un 501: es lo esperado.

## Orden de despliegue

**Backend primero, siempre.** Usa `ValidationPipe` con
`forbidNonWhitelisted: true`: cualquier campo que el DTO no declare se rechaza
con 400 (`"property X should not exist"`). Un campo nuevo en el formulario
requiere el DTO desplegado antes; si no, **nadie puede inscribirse**.

## Cuando algo no sale

- Si tras 2-3 intentos no funciona, parar y explicar el problema.
- No probar arreglos al azar.
- **El stack es muy reciente** (React 19, React Router 8, Vite 8,
  TypeScript 6): lo que se recuerda de versiones anteriores puede ya no ser
  cierto. Se consulta la documentación actual antes de escribir contra estas
  APIs, y si algo no se puede verificar ahí, no se improvisa.
