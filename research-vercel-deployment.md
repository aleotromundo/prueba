# Diagnóstico de despliegue Vercel

## Fuentes oficiales consultadas

- Express on Vercel: https://vercel.com/docs/frameworks/backend/express
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Node.js Runtime on Vercel: https://vercel.com/docs/functions/runtimes/node-js

## Conclusiones

Vercel puede desplegar Express, pero espera un entrypoint reconocible (`app.ts`, `index.ts`, `server.ts`, `src/...`) que exporte la aplicación Express o use `listen()`. En Vercel, Express se convierte en una única función y `express.static()` no sirve los assets; los archivos estáticos deben estar en `public/**`. Para una SPA Vite, Vercel recomienda configurar un `vercel.json` raíz con rewrite de `/(.*)` a `/index.html` para deep links.

AstroNexo actualmente inicia Express desde `server/_core/index.ts`, crea el servidor HTTP internamente, registra OAuth, tRPC y proxy de storage, y en producción sirve `dist/public`. El root del repositorio tiene `client/index.html`, `vite.config.ts` y un build que genera `dist/index.js` y `dist/public`, pero no tiene un entrypoint Vercel raíz que exporte el app Express ni una estrategia de assets `public/**`. La carpeta `prueba/` conserva su antiguo `vercel.json` y configuración de Vite, aislada del sitio principal.

La pantalla negra con texto de `server/_core/index.ts` es compatible con una configuración de Vercel que está tratando el árbol o un entrypoint de servidor como contenido mostrado, no con la aplicación compilada. Antes de modificar el repo hay que conocer la URL de Vercel y su Root Directory; si el despliegue apunta a `prueba/`, estará intentando desplegar el proyecto antiguo, no AstroNexo. La ruta segura inmediata es usar el hosting integrado de Manus, que ya entrega AstroNexo en `https://astronexo-npserjdx.manus.space`. Adaptar Vercel requeriría un entrypoint Express exportable, reglas de assets, rewrites y variables de entorno completas.

## Confirmación directa en Vercel

En `Settings → Build and Deployment` del proyecto `astronexo51` se confirmó que el deployment actual tiene `Root Directory: ./`, `Build Command: pnpm build:vercel` y `Output Directory: public`. La pantalla también indica que la configuración del deployment de producción está overrideada respecto de la configuración del proyecto. El deployment nuevo `bfc8c19` quedó `Ready` y el dominio `https://astronexo51.vercel.app` ahora entrega el título `AstroNexo — Tu mapa del cielo`, la navegación y las tarjetas de herramientas.

La causa operativa quedó confirmada: el proyecto estaba detectando Vite, pero la configuración de build/servidor no estaba preparada para el frontend en `client/` y el servidor Express/tRPC. La corrección agregó `vercel.json`, `server.ts`, una app Express compartida, assets en `public/` y el script `build:vercel`.

## Valores base y override confirmados

La configuración base de Vercel muestra `Framework Preset: Vite`, `Root Directory: ./`, `Build Command: npm run build or vite build`, `Output Directory: dist`, `Install Command: yarn install, pnpm install, npm install, or bun install` y `Development Command: vite`. El deployment de producción tiene un override explícito mediante `vercel.json`: `Build Command: pnpm build:vercel` y `Output Directory: public`. El Framework Preset no fue la causa aislada; el problema inicial fue que la configuración Vite predeterminada (`dist`) no correspondía al build full-stack de AstroNexo, que necesita generar `public/` y exponer un entrypoint Express reconocible por Vercel. `Root Directory: ./` era correcto.
