# Project TODO — Consolidación AstroNexo

- [x] Auditar las rutas, pantallas, cálculos y pruebas existentes del proyecto recuperado.
- [x] Auditar la portada, la biblioteca editorial, la fuente de referencias y las herramientas de carta natal.
- [x] Confirmar la carta natal de ejemplo con 15/06/1991, 14:30, Montevideo, Uruguay.
- [x] Confirmar el flujo de búsqueda y selección de localidad con Montevideo y America/Montevideo.
- [x] Confirmar el cálculo de ascendente, posiciones planetarias, casas iguales, aspectos y dominantes.
- [x] Añadir Ascendente a la navegación global de escritorio y móvil sin quitar enlaces existentes.
- [x] Añadir interpretación personalizada con IA usando el contexto calculado de la carta.
- [x] Reutilizar AIChatBox y conservar la rueda, posiciones, aspectos, dominantes, referencias y navegación actuales.
- [x] Añadir estados de carga y error en el chat de interpretación.
- [x] Añadir prueba unitaria para ai.interpretChart.
- [x] Ejecutar pnpm test: 3 archivos y 5 pruebas correctas.
- [x] Ejecutar pnpm check sin errores de TypeScript.
- [x] Verificar en navegador la carta completa y la respuesta real de interpretación con IA.
- [x] Verificar visualmente portada, carta natal, ascendente y guía en viewport móvil de 390x844.
- [x] Guardar checkpoint consolidado de esta versión.
- [x] Presentar el resumen de información preservada y funciones añadidas.

## Alcance preservado

Se conserva la portada cósmica, las cinco calculadoras, el buscador de localidades, las posiciones planetarias, las doce casas iguales, la rueda interactiva, los aspectos destacados, los planetas dominantes, la sinastría, los tránsitos, el retorno solar, el ascendente, la biblioteca de seis capas, las referencias externas, los textos editoriales originales, los estados de error y la navegación existente. No se añadió publicidad.

## Alcance añadido

Se incorporó una guía de IA en la carta natal que conversa en español, recibe solamente el contexto calculado de la carta, mantiene el historial del chat durante la sesión y muestra una advertencia interpretativa no determinista. También se incorporó la herramienta Ascendente a la navegación global.

## Nueva solicitud: conexión con GitHub

- [x] Verificar acceso al repositorio `https://github.com/aleotromundo/prueba.git`.
- [x] Comparar rama principal, commits y estructura remota con AstroNexo antes de sincronizar.
- [x] Confirmar con el usuario cualquier conflicto o diferencia de proyecto antes de hacer pull.
- [x] Configurar el remoto únicamente si corresponde y sincronizar sin sobrescribir cambios.
- [x] Verificar el estado final del proyecto después de la sincronización.

## Nueva solicitud: carpeta aislada `prueba`

- [x] Mantener todo el contenido del repositorio `aleotromundo/prueba` dentro de una sola carpeta `prueba`.
- [x] No mezclar archivos de `prueba` con AstroNexo ni mover contenido entre ambos proyectos.
- [x] Definir cuál será la raíz del sitio que se seguirá editando después de la separación.
- [x] Verificar que el repositorio GitHub permanezca identificable y completo dentro de `prueba`.
- [x] Confirmar la estructura final y el estado del sitio al usuario.

## Nueva arquitectura solicitada: GitHub como AstroNexo principal

- [x] Preservar íntegramente el proyecto original de `aleotromundo/prueba` dentro de una carpeta aislada y claramente identificada.
- [x] No borrar ni mezclar los archivos originales de prueba con AstroNexo.
- [x] Preparar el repositorio GitHub para que AstroNexo sea la aplicación principal y única aplicación desplegable.
- [x] Copiar la versión consolidada de AstroNexo al repositorio principal respetando su estructura y dependencias.
- [x] Configurar el remoto GitHub como origen del nuevo AstroNexo sin publicar ni sobrescribir hasta verificar el árbol final.
- [x] Ejecutar build, pruebas y verificación de separación antes de confirmar la sincronización.
- [x] Crear checkpoint de la migración y documentar la estructura final del repositorio.

## Controles adicionales de aislamiento

- [x] Limpiar del root del repositorio GitHub los archivos heredados del proyecto original que no pertenezcan a AstroNexo.
- [x] Verificar explícitamente que no queden entrypoints, servicios o configuraciones heredadas en la raíz.
- [x] Guardar un checkpoint nuevo posterior a la migración y presentar la estructura final y el commit resultante.

## Bug reportado: publicación muestra README en lugar del sitio

- [x] Inspeccionar la configuración de build y el entrypoint del repositorio GitHub.
- [x] Confirmar si el usuario está viendo GitHub/README o una URL de despliegue real.
- [x] Corregir la configuración de publicación para que sirva el build de AstroNexo.
- [x] Verificar visualmente la página real publicada o en preview.
- [x] Documentar la URL y el siguiente paso de publicación si la plataforma aún no está desplegada.

## Nueva solicitud: guía profunda y datos corroborados

- [x] Auditar todo el contenido actual de signos, planetas, casas, aspectos, lecturas y fuentes antes de editar.
- [x] Investigar fuentes primarias o institucionales para historia del zodíaco, astronomía de las constelaciones y marcos astrológicos y de cálculo.
- [x] Diseñar un patrón de modal accesible para abrir el detalle de cada signo y reutilizarlo en planetas, casas y aspectos.
- [x] Ampliar el contenido de los doce signos con elementos, modalidad, regencia tradicional/moderna cuando corresponda, polaridad, fortalezas, tensiones y preguntas de reflexión.
- [x] Ampliar planetas, casas, aspectos y lecturas profundas sin eliminar el contenido existente.
- [x] Añadir referencias visibles y trazables a cada bloque de información relevante.
- [x] Auditar la exactitud de los datos estáticos y del motor de cálculo astrológico, documentando supuestos como zodíaco tropical y casas iguales.
- [x] Verificar modales, foco, cierre con Escape, navegación por teclado, responsive y ausencia de errores de consola.
- [x] Ejecutar pruebas, guardar checkpoint y entregar un resumen de fuentes, cambios y límites interpretativos.

## Controles pendientes de evidencia

- [x] Contrastar una muestra reproducible de posiciones de AstroNexo con JPL Horizons o Swiss Ephemeris y documentar la configuración comparada.
- [x] Verificar explícitamente foco inicial, cierre con Escape, navegación por teclado y consola del modal.
- [x] Guardar un checkpoint nuevo posterior a esta ampliación y presentar el resumen final al usuario.

## Evidencia adicional de accesibilidad

- [x] Verificar explícitamente foco inicial, trap y retorno de foco del modal, navegación por teclado y consola sin errores.
- [x] Guardar un checkpoint posterior a la guía profunda y entregar el resumen final de fuentes, modales, correcciones del motor y límites interpretativos.

## Última verificación de foco

- [x] Verificar el focus trap completo del modal y el retorno de foco al trigger al cerrar, dejando evidencia en la sesión.
- [x] Guardar el checkpoint nuevo de la ampliación profunda y enviar el resumen final al usuario.

## Entrega final de la ampliación

- [x] Guardar un checkpoint nuevo después de la ampliación profunda, las correcciones de accesibilidad y los ajustes del motor.
- [x] Enviar al usuario un resumen final de las fuentes añadidas, modales profundos, validación JPL, correcciones del motor y límites interpretativos.

## Verificación dirigida de publicación

- [x] Documentar la diferencia entre la URL del repositorio GitHub y la URL de preview/publicación real.
- [x] Confirmar visualmente la URL de preview real después del checkpoint y registrar que carga AstroNexo, no README.
- [x] Documentar que no hace falta Vercel para la publicación integrada y especificar el paso de Publish si se requiere una URL pública.
- [x] Guardar un checkpoint final con esta evidencia de publicación.

## Cierre verificable de publicación

- [x] Verificar la URL de preview real con navegación inspeccionable sobre `/` y documentar el contenido visible de AstroNexo.
- [x] Guardar un checkpoint posterior a esa verificación dirigida de publicación.

## Cierre de publicación final

- [x] Guardar un nuevo checkpoint después de la verificación final de la URL de preview.
- [x] Entregar la URL válida de AstroNexo y aclarar la diferencia entre GitHub/README y la aplicación publicada.

## Nuevo bloqueo: despliegue en Vercel

- [x] Inspeccionar la configuración actual del repositorio y los entrypoints que Vercel está interpretando.
- [x] Confirmar si el error proviene de Root Directory, Framework Preset, Output Directory o del modelo full-stack de Vercel.
- [x] Determinar si se necesita una configuración específica para ejecutar el servidor Node/tRPC de AstroNexo.
- [x] Preparar una corrección compatible sin romper el despliegue integrado de Manus ni mezclar `prueba/`.
- [x] Verificar la URL de Vercel o documentar exactamente qué configuración debe cambiarse allí.

## Confirmación de configuración Vercel

- [x] Inspeccionar en Vercel Settings → General el Root Directory, Framework Preset y Output Directory, y documentar cuál estaba causando el despliegue incorrecto de AstroNexo.

## Confirmación final de Vercel

- [x] Inspeccionar explícitamente en Vercel Settings → Build and Deployment/General el valor visible de Framework Preset y documentar junto con Root Directory y Output Directory cuáles eran antes/después de la corrección.
- [x] Registrar de forma inequívoca qué ajuste concreto de Vercel causaba el despliegue incorrecto inicial, o dejar asentado que el problema no provenía de esos campos sino de la falta de adaptación del proyecto full-stack a Vercel.

## Nueva solicitud: sincronizar Manus con GitHub

- [x] Comparar el checkpoint publicado en Manus con `aleotromundo/prueba` en su commit actual.
- [x] Identificar diferencias de código, contenido profundo, fuentes, IA, pruebas y configuración Vercel.
- [x] Aplicar al repo la versión de Manus sin borrar ni mezclar la carpeta `prueba/`.
- [x] Conservar `vercel.json`, `server.ts`, el adaptador Express y el build `public/` necesarios para Vercel.
- [x] Ejecutar tipos, pruebas y build del repo sincronizado; el build Vercel también genera seis fallbacks estáticos.
- [x] Verificar que Vercel despliegue el contenido actualizado y guardar un checkpoint de la sincronización; deployment eeb5a5b Ready.

## Hallazgo posterior a la sincronización

- [x] Corregir el 404 de rutas profundas como `/guia` en Vercel mediante rewrite hacia `index.html`, sin afectar API ni assets; se añadió además fallback físico por ruta.
- [x] Revalidar `/`, `/guia` y una herramienta interna en el dominio de producción; `/guia` y `/carta-natal` cargan AstroNexo con HTTP 200.
- [x] Publicar el fix de rutas y guardar el checkpoint actualizado; commits GitHub `3dad668`, `9d841a5` y `5d83186`, último deployment Ready.

- [x] Corregir el fallback de rutas SPA en Vercel: el rewrite explícito no se aplicó, por lo que se añadió un rewrite global y páginas físicas `route/index.html`; producción verificada.
- [x] Validar en producción que la configuración final preserve assets y no convierta `/api/*` en HTML; el asset responde 200 y `/api/trpc/auth.me` responde 404 plano, no HTML.
- [x] Revalidar la portada después del deployment definitivo y guardar el checkpoint final posterior al arreglo de Vercel; la portada responde 200 y el checkpoint final queda registrado.

## Bug visual reportado: íconos zodiacales desincronizados

- [x] Comparar la guía de Manus con la guía publicada desde GitHub/Vercel y localizar la fuente de los íconos coloreados; ambas versiones se verificaron y se reemplazó el glifo monocromático por una variante explícitamente coloreada por elemento.
- [x] Sincronizar en GitHub/Vercel los íconos zodiacales coloreados sin perder el contenido profundo ni la accesibilidad de las tarjetas.
- [x] Validar visualmente `/guia` en Manus y Vercel, ejecutar pruebas y publicar un checkpoint actualizado.

## Solicitud ampliada: paridad total Manus–GitHub–Vercel

- [x] Inventariar rutas, componentes, datos editoriales, fuentes, estilos, assets, cálculos, IA, pruebas y configuración de la referencia actual de Manus; se compararon árboles `client/src`, `server`, `drizzle`, `shared`, `scripts` y archivos de configuración.
- [x] Comparar ese inventario con el checkout de GitHub y la salida efectiva de Vercel, identificando cualquier divergencia adicional a los íconos zodiacales; el código funcional coincide y las diferencias restantes están limitadas al framework `_core` y configuración de proyecto.
- [x] Sincronizar todas las divergencias confirmadas sin perder funcionalidades, contenido profundo, accesibilidad ni la carpeta `prueba/`; GitHub queda en `1e688d8` con los fixes posteriores incluidos.
- [x] Validar visual y técnicamente todas las rutas principales en Manus y Vercel, incluyendo assets, calculadoras, guía y configuración de producción; las ocho rutas principales y el asset JavaScript responden HTTP 200.
- [x] Publicar un checkpoint con el estado completamente sincronizado y documentar las diferencias corregidas y cualquier limitación restante; se documentan los runtimes deliberadamente distintos y la ausencia de API tRPC en Vercel se compensa con fallback local.

## Nueva sesión solicitada: cielo en vivo con sensores del dispositivo

- [x] Definir el alcance verificable del visor celeste local: hora, ubicación, orientación, objetos visibles y límites de precisión.
- [x] Auditar compatibilidad de APIs nativas del navegador y del motor astronómico local, sin incorporar APIs astronómicas externas; se documentaron DeviceOrientationEvent, Geolocation API y Astronomy Engine.
- [x] Implementar una sesión de cielo en vivo con brújula/orientación, geolocalización, cálculo local de Sol/Luna/planetas/estrellas y modo manual de respaldo.
- [x] Validar permisos, HTTPS, precisión, accesibilidad, responsive, rendimiento y funcionamiento sin sensores; se probó desktop/móvil, selección de objetos, modo manual y producción HTTPS.
- [x] Sincronizar la sesión con GitHub/Vercel y verificar producción; commit inicial `26016a6`, refinamiento de permisos `b884d9d`, commit final `1e688d8`, ruta `/cielo-en-vivo` HTTP 200 y siete fallbacks físicos.

## Diferencias de infraestructura aceptadas

La auditoría encontró diferencias en `server/_core/index.ts`, `server/_core/vite.ts`, la presencia de `server/_core/app.ts` únicamente en GitHub y algunos metadatos de `package.json`. Se conservan deliberadamente: pertenecen al scaffolding/runtime de Manus y a la adaptación estática de Vercel, mientras que `client/src`, el motor astronómico, el contenido editorial, las rutas, los estilos y los scripts de build funcionales están sincronizados. El deployment Vercel usa el build `build:vercel`, fallbacks físicos y no depende de esos entrypoints internos de Manus.

- [x] Resolver o documentar las diferencias restantes entre Manus y GitHub; quedaron documentadas como diferencias deliberadas de scaffolding/runtime por plataforma, no de la aplicación funcional.
- [x] Revalidar una calculadora principal en Manus y Vercel después de `b884d9d` y el fix de geocodificación: Carta natal renderiza, busca Montevideo, selecciona la localidad y genera resultados completos en ambos entornos.

## Regresión detectada en verificación final de Vercel

- [x] Corregir la búsqueda de localidades en Vercel: `/api/trpc` sigue sin estar disponible en el deployment estático, pero la UI ya no falla y utiliza un catálogo local verificable.
- [x] Añadir fallback local verificable para localidades frecuentes y manejo de respuesta no JSON sin romper el flujo Manus/tRPC; se normalizan comas, acentos y puntuación.
- [x] Revalidar en Vercel la selección de Montevideo y la generación de Carta natal después del fix; la carta completa se generó correctamente en producción.

## Nueva solicitud: inmersión espacial y responsive integral

- [x] Auditar fondo cósmico, capas de estrellas, navegación, transiciones, animaciones existentes y puntos de desborde en móvil/PC.
- [x] Añadir movimiento lento y elegante a estrellas/nebulosas y sensación de viaje espacial sin distraer ni ocultar contenido.
- [x] Respetar `prefers-reduced-motion`, foco, contraste, rendimiento y accesibilidad en todas las animaciones; las capas son no interactivas, no cubren contenido, se desactivan con movimiento reducido y se verificó legibilidad en 390x844/1280x720.
- [x] Optimizar responsive de portada, navegación, calculadoras, guía, modales y cielo en vivo para móvil y escritorio; se revisaron `/`, `/guia`, `/carta-natal`, `/cielo-en-vivo`, `/sinastria`, `/transitos`, `/retorno-solar` y `/ascendente` en ambos tamaños.
- [x] Guardar el checkpoint posterior a la mejora inmersiva/responsive y documentar la validación final de producción; código y pruebas están completos en `6ccdeb3`, y la publicación responde HTTP 200 en las rutas principales.

## Rediseño solicitado: motor visual de Cielo en vivo

- [x] Auditar el visor actual y documentar qué dificulta interpretar la posición de planetas, estrellas, horizonte y orientación; la proyección anterior tenía poca jerarquía, color y una lectura ambigua de sus etiquetas.
- [x] Diseñar una representación celeste más profesional, colorida y realista, con jerarquía visual clara y leyenda comprensible.
- [x] Mantener intactos Astronomy Engine, sensores, geolocalización, selección de objetos, datos de azimut/altura y modo manual.
- [x] Implementar el rediseño y revisar varias capturas en móvil y PC, corrigiendo legibilidad, escala, contraste y desbordes; se hizo una segunda ronda para eliminar solapamientos de etiquetas.
- [x] Ejecutar pruebas, sincronizar GitHub/Vercel en `4b57efb`, verificar el deployment Ready y validar `/cielo-en-vivo` en la URL de producción única.

## Nuevo rediseño solicitado: visor tipo planetario/realidad aumentada

- [x] Investigar referentes reales de observación del cielo como Sky Guide, SkyView, Stellarium y el programa que el usuario identifica como SkyWalker Tracking; la coincidencia probable es Star Walk 2/Star Tracker.
- [x] Documentar patrones comprobados de visor, orientación, horizonte, etiquetas, fondo celeste y controles, respetando límites de copyright y sin copiar interfaces literalmente.
- [x] Comparar esos patrones con el motor actual y definir una adaptación fiel que conserve Astronomy Engine, sensores, ubicación, rumbo manual y datos exactos.
- [x] Implementar un visor de cielo más realista, con fondo celeste y objetos posicionados sobre una vista tipo planetario/AR, evitando una carta abstracta inventada; se usa panorama ESO/S. Brunier con crédito CC BY 4.0.
- [x] Revisar varias capturas en móvil y PC, validar objetos y orientación, sincronizar GitHub/Vercel y guardar checkpoint; la selección de Luna mostró azimut 29° y altura 61.4° en la preview. Se corrigió además el 404 del fondo privado usando el CDN público de ESO; commit final `a83e9fc`, deployment Ready y alias `/cielo-en-vivo` HTTP 200.

## Investigación comparativa solicitada: apps de cielo en tiempo real

- [x] Investigar aplicaciones líderes de observación del cielo y recopilar fuentes oficiales, capturas descriptivas y modos de visualización; se revisaron Sky Guide, Star Walk 2, SkyView, Stellarium Web, Night Sky y Star Tracker.
- [x] Comparar qué muestran realmente: estrellas, planetas, constelaciones, horizonte, etiquetas, trayectorias, cámara, brújula, GPS y tiempo.
- [x] Separar los modos de planetario, brújula/sensores, realidad aumentada con cámara y seguimiento de objetos.
- [x] Documentar qué patrones pueden implementarse en AstroNexo sin APIs astronómicas externas y qué requiere capacidades nativas del teléfono.
- [x] Entregar un informe comparativo con referencias y una especificación visual/técnica concreta para el próximo rediseño; informe `/tmp/astronexo-sky-viewer-research-report.md`.

## Evaluación solicitada: APIs astronómicas gratuitas

- [x] Comparar JPL Horizons, SIMBAD/VizieR, Gaia, Stellarium y otros catálogos o servicios abiertos por precisión, límites, latencia, licencia, privacidad y utilidad para tiempo real.
- [x] Determinar qué datos necesita realmente AstroNexo y cuáles ya resuelve Astronomy Engine localmente.
- [x] Recomendar una arquitectura híbrida solo si aporta valor: cálculo local como base y API gratuita opcional para efemérides, objetos o enriquecimiento.
- [x] Documentar riesgos de depender de APIs externas y un plan de fallback verificable para Vercel y móviles.

## Mejoras aprobadas: visor completo tipo app de cielo

- [x] Auditar compatibilidad de cámara, DeviceOrientationEvent, brújula absoluta, geolocalización y permisos en navegadores móviles y de escritorio.
- [x] Implementar modo cámara AR real con fallback transparente al planetario cuando cámara o sensores no estén disponibles.
- [x] Implementar calibración de orientación, indicador de precisión, rumbo manual, modo nocturno y controles de zoom/densidad de etiquetas.
- [x] Mantener el motor local, catálogo local, privacidad, selección de objetos, azimut/altura y funcionamiento sin red.
- [x] Integrar verificación opcional de efemérides con JPL Horizons sin bloquear el visor ni enviar datos personales innecesarios.
- [x] Añadir pruebas unitarias y validaciones de permisos, fallbacks, accesibilidad, responsive y producción.
- [x] Sincronizar GitHub/Vercel, revisar visualmente varias rondas y guardar checkpoint final.

## Solicitud de sincronización automática GitHub–Vercel

- [x] Comparar el checkpoint actual de AstroNexo con el checkout local y el commit desplegado en GitHub/Vercel.
- [x] Publicar la versión actual en `aleotromundo/prueba` sin alterar la carpeta aislada `prueba/`.
- [x] Confirmar que Vercel construya el nuevo commit y que el dominio de producción sirva la versión actualizada de Cielo en vivo.
- [x] Documentar el commit, deployment, dominio y cualquier limitación restante sin esperar confirmación adicional.

## Nueva solicitud: WebXR AR auténtico

- [x] Auditar compatibilidad real de WebXR immersive-ar, hit-test, local-floor y tracking en navegadores y dispositivos actuales.
- [x] Implementar una ruta WebXR auténtica cuando el dispositivo la soporte, con sesión XR, cámara passthrough del sistema y escena espacial anclada al espacio local.
- [x] Mantener una separación visible y honesta entre WebXR AR, cámara con overlay de sensores y planetario local.
- [x] Añadir detección de capacidades, permisos, mensajes de compatibilidad y salida segura de la sesión XR.
- [x] Validar que los objetos astronómicos se posicionen usando la orientación espacial disponible y documentar límites de precisión.
- [x] Probar build, accesibilidad, responsive, fallback y producción; sincronizar GitHub/Vercel si el cambio es viable.

## Regla estricta de compatibilidad WebXR

- [x] Detectar al cargar si el navegador expone WebXR y si soporta `immersive-ar`.
- [x] No abrir cámara ni mostrar una superposición AR si la capacidad WebXR AR no está disponible.
- [x] Mostrar un diagnóstico visible y comprensible: dispositivo/navegador no compatible, HTTPS requerido o permisos pendientes.
- [x] Mantener el planetario local como alternativa separada, nunca como simulación de AR.
- [x] Validar estados de compatibilidad en móvil, escritorio, navegadores sin `navigator.xr` y producción.

## Bug reportado: menú hamburguesa móvil

- [x] Auditar el componente de header y los estilos actuales del menú móvil.
- [x] Corregir fondo, z-index, overlay, contraste, anchura y posición del panel hamburguesa.
- [x] Añadir comportamiento accesible de apertura/cierre y evitar que el menú quede debajo del contenido.
- [x] Verificar la interacción en 390×844 y el comportamiento desktop sin regresiones.
- [x] Sincronizar GitHub/Vercel y guardar checkpoint de la corrección.

## Integración de motor de planetario Stellarium Web Engine

- [x] Investigar motores abiertos, precisión, licencia, datasets y estrategia de build reproducible.
- [x] Compilar Stellarium Web Engine y verificar que carga en navegador con WebGL/WASM.
- [x] Integrar el engine en Cielo en vivo con estrellas, constelaciones, objetos profundos, Vía Láctea y Sol/Luna locales.
- [x] Vincular la selección del planetario con el vocabulario de planetas y tarjetas de AstroNexo.
- [x] Añadir pruebas unitarias del mapeo de selecciones y validar responsive, rendimiento y build Vercel.
- [x] Documentar licencia AGPL, fuente upstream y adaptación de compilación.
- [x] Sincronizar GitHub/Vercel y guardar checkpoint después de verificar el resultado final.

## Nuevo requisito: Stellarium único y experiencia en español

- [x] Eliminar el selector de motor y cualquier fallback visual al planetario anterior en Cielo en vivo.
- [x] Mantener Stellarium Web Engine como única escena celeste visible y mostrar un error explícito si no carga.
- [x] Traducir al español las etiquetas, constelaciones y mensajes del engine siempre que el catálogo/sky culture lo permita.
- [x] Traducir la capa de estado, atribución y selección de objetos de AstroNexo.
- [x] Validar visualmente la experiencia única en español, responsive, sin regresiones y en producción.
- [x] Sincronizar GitHub/Vercel y guardar checkpoint final.
