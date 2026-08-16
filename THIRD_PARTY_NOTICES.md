# Avisos de terceros

## Stellarium Web Engine

AstroNexo incorpora una compilación WebAssembly/JavaScript del **Stellarium Web Engine**, un renderer de planetario WebGL de código abierto del proyecto Stellarium.

- Repositorio fuente: <https://github.com/Stellarium/stellarium-web-engine>
- Licencia del engine: GNU Affero General Public License v3.0, según `LICENSE-AGPL-3.0.txt` del repositorio upstream.
- Funciones utilizadas: catálogo estelar Gaia distribuido por el proyecto, skycultures, constelaciones, objetos de cielo profundo, datasets solares locales y survey de la Vía Láctea.
- Integración: el engine se carga localmente desde `/stellarium/engine/` y sus datasets desde `/stellarium/data/`; el visor no depende de una API remota para el render básico.
- Adaptación de build: el checkout de AstroNexo utiliza una compilación reproducible con Emscripten moderno, separando los flags de compilación y enlace y tolerando warnings heredados del código C upstream. La funcionalidad del engine no fue reescrita.

La interfaz y los datos editoriales de AstroNexo permanecen separados del engine. La selección de cuerpos conocidos se normaliza al vocabulario en español de AstroNexo para enlazar el planetario con las tarjetas y lecturas existentes.
