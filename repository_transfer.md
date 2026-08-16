# Compatibilidad y aislamiento del repositorio de destino

La copia del repositorio `aleotromundo/prueba` se mantiene de forma aislada en `/home/ubuntu/prueba`. Se descargó únicamente para preservar el contenido preexistente y revisar su estructura; no se ejecutaron sus dependencias, scripts ni servicios.

| Aspecto | Copia aislada `prueba` | AstroNexo | Decisión |
| --- | --- | --- | --- |
| Estado revisado | Rama `main`, revisión `83bc87d` | Aplicación fullstack con tRPC, base de datos y autenticación | Mantener repositorios separados |
| Estructura | React/Vite simple, `components/`, `services/`, `App.tsx` | React/Vite, servidor Express, tRPC, Drizzle y rutas de producto | No fusionar estructuras |
| Dependencias declaradas | React, Vite y `@google/genai` | Motor astronómico, Three.js, tRPC y servicios propios | No reutilizar ni ejecutar dependencias externas |
| Licencia visible | No se detectó un archivo `LICENSE` en la raíz | Código desarrollado para AstroNexo | No copiar componentes ni contenido del repositorio aislado |

El repositorio remoto autorizado se utilizará exclusivamente como **destino del código de AstroNexo**. Antes de la transferencia se conserva esta copia local de respaldo. La transferencia reemplazará el contenido de la rama remota por el proyecto AstroNexo y no ejecutará ningún archivo proveniente de `prueba`.
