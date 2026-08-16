# AstroNexo

AstroNexo es una aplicación web en español para explorar cartas natales, sinastría, tránsitos, retorno solar y ascendente mediante cálculos locales y una interfaz visual cósmica.

## Aplicación principal

La aplicación desplegable vive en la raíz del repositorio. Utiliza React, Vite, Express, tRPC, Drizzle y la autenticación integrada del entorno. Las herramientas de astrología se encuentran bajo `client/src/pages/` y el cálculo compartido bajo `client/src/lib/astrology.ts`.

Comandos principales:

```bash
pnpm install
pnpm dev
pnpm test
pnpm check
pnpm build
```

## Proyecto original preservado

El contenido original que existía en este repositorio antes de la migración se conserva completo dentro de [`prueba/`](./prueba/). Esa carpeta es únicamente histórica y no forma parte del entrypoint ni del build de AstroNexo.

## Alcance

AstroNexo mantiene la carta natal con rueda interactiva, posiciones, casas iguales, aspectos y planetas dominantes; sinastría; tránsitos; retorno solar; ascendente; biblioteca editorial; referencias; y una interpretación conversacional con IA en la carta natal. La astrología se presenta como un lenguaje simbólico de reflexión y no como diagnóstico o predicción determinista.
