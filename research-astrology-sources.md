# Investigación de fuentes para AstroNexo

## NASA GSFC — The Path of the Sun, the Ecliptic

URL: https://pwg.gsfc.nasa.gov/stargaze/Secliptc.htm

La página educativa de NASA explica que el Sol, los planetas y la Luna se mueven cerca de una franja celeste llamada eclíptica; describe la división tradicional de esa franja en doce constelaciones zodiacales y distingue la constelación visible de los signos usados en los horóscopos. También explica que la órbita lunar está inclinada unos cinco grados respecto de la eclíptica y que el recorrido aparente del Sol se relaciona con el plano orbital terrestre. La propia página incluye un aviso de archivo: debe citarse como material educativo archivado, no como documentación actualizada.

## Astronomy Engine — repositorio oficial

URL: https://github.com/cosinekitty/astronomy

El repositorio describe Astronomy Engine como una biblioteca multilenguaje para calcular posiciones del Sol, la Luna y los planetas, además de fases lunares, eclipses, tránsitos, conjunciones, equinoccios, solsticios, ascensos y puestas. También indica que ofrece transformaciones entre coordenadas ecuatoriales, eclípticas, horizontales y galácticas. Esta fuente respalda el uso técnico del motor, pero no valida por sí sola las interpretaciones astrológicas.

## Observaciones para la auditoría

AstroNexo debe distinguir explícitamente entre datos astronómicos calculados y marcos interpretativos astrológicos. La guía debe aclarar que utiliza doce signos tropicales de 30 grados y casas iguales desde el ascendente; las constelaciones visibles no son equivalentes a los signos matemáticos del zodíaco tropical. Se deben contrastar los detalles técnicos del motor con documentación de Astronomy Engine y JPL Horizons, y presentar la interpretación como lenguaje simbólico, no como afirmación científica.

## JPL Horizons — manual oficial

URL: https://ssd.jpl.nasa.gov/horizons/manual.html

JPL describe Horizons como un sistema de efemérides en línea que entrega datos del sistema solar y permite parametrizar la localización, el tiempo, el centro de observación, los marcos de referencia y las escalas temporales. La documentación resalta que las salidas dependen de los parámetros elegidos y que el sistema sirve para caracterizar la ubicación, el movimiento y la observabilidad de objetos del sistema solar. Para una comparación reproducible, AstroNexo debe fijar fecha/hora UTC, objeto, centro de observación, marco de referencia y tipo de longitud antes de comparar resultados.

## Swiss Ephemeris — información oficial de Astrodienst

URL: https://www.astro.com/swisseph/swephinfo_e.htm

Astrodienst indica que Swiss Ephemeris se basa en efemérides JPL DE431/DE441 y que ofrece transformaciones hacia coordenadas astrológicas, incluyendo el equinoccio verdadero de fecha. La página también distingue entre las efemérides JPL originales, los archivos comprimidos Swiss Ephemeris y el modelo semianalítico Moshier, con diferentes rangos y precisiones. Esta información sirve para explicar que una posición depende de la efeméride, el marco de referencia y la transformación elegida; no debe presentarse como una validación científica de la interpretación astrológica.

## Consecuencia para AstroNexo

La guía ampliada debe mostrar una ficha metodológica: motor usado, instante UTC derivado de la hora local y zona elegida, coordenadas geocéntricas o topocéntricas según el cálculo, zodíaco tropical de doce sectores y casas iguales desde el ascendente. Los modales deben separar “dato calculado”, “convención astrológica” y “lectura simbólica”.

## National Geographic — historia del zodíaco y los horóscopos

URL: https://www.nationalgeographic.com/history/article/history-of-horoscopes

La fuente sitúa los orígenes de la astrología en la Mesopotamia del segundo milenio a. C. y menciona la serie cuneiforme Enuma Anu Enlil como colección de presagios celestes. Señala que Babilonia desarrolló doce signos y que el mundo griego contribuyó con nombres de constelaciones y con la integración de prácticas de adivinación; también vincula el desarrollo de horóscopos individualizados con la tradición de Ptolomeo y el Tetrabiblos. La fuente debe usarse como contexto histórico y cultural, no como evidencia de causalidad entre cuerpos celestes y personalidad.

## Nota editorial

El sitio debe distinguir tres capas: historia de las prácticas astrológicas; descripción astronómica de la eclíptica, cuerpos y coordenadas; e interpretación simbólica contemporánea. Las fichas de signos deben evitar presentar rasgos de personalidad como hechos universales o diagnósticos.

## Verificación visual de la guía ampliada

La ruta `/guia` muestra doce tarjetas de signos y cada tarjeta expone el control “Ver ficha completa”. La ficha de Aries abrió correctamente un modal accesible con título, subtítulo, coordenadas del signo, recursos, tensiones, preguntas de integración, enlaces a National Geographic y NASA GSFC, y una advertencia que separa interpretación simbólica de datos técnicos. El modal tiene scroll interno para conservar el contenido en viewport de escritorio y botón de cierre visible.

La pestaña Planetas también quedó convertida en tarjetas interactivas: el navegador mostró diez funciones con control “Explorar función →”, confirmando que el patrón de detalle no quedó limitado a los signos. La siguiente comprobación debe cubrir Casas, Aspectos, Lecturas y Fuentes, además de teclado y móvil.

## Comparación reproducible AstroNexo vs JPL Horizons

Se consultó JPL Horizons para el instante `1991-06-15 17:30:00 UTC`, correspondiente a `15/06/1991 14:30` en Montevideo (`America/Montevideo`). Se usó `EPHEM_TYPE=OBSERVER`, centro geocéntrico `500@399`, cantidad `31` (`ObsEcLon`), formato angular decimal, referencia ICRF y plano eclíptico.

| Cuerpo | AstroNexo | JPL Horizons | Diferencia |
|---|---:|---:|---:|
| Sol | 84.1201286106° | 84.1201799° | 0.0000512894° = 0.184642″ |
| Luna | 129.3883645459° | 129.3884004° | 0.0000358541° = 0.129075″ |

La muestra coincide a una diferencia sub-arco-segundo, compatible con diferencias de modelo, marco o tratamiento aparente. Esto valida la muestra técnica del motor para ese instante y configuración, pero no constituye una auditoría exhaustiva de todos los años, cuerpos, zonas horarias o métodos de casas. La interfaz debe expresar este límite y mantener separados cálculo astronómico e interpretación simbólica.

## Verificación de accesibilidad del modal

En la preview de `/guia`, una tarjeta de Aries abrió el modal y el navegador expuso enlaces de fuentes y el botón `Close`. Al enviar `Escape`, el modal desapareció y la lista de tarjetas volvió a estar disponible, confirmando el cierre por teclado y el retorno al contexto principal. El componente Radix Dialog gestiona el foco modal y el cierre; el botón de cierre conserva nombre accesible. La navegación por botones de categorías y tarjetas se expone como elementos `button` en el árbol interactivo.

La inspección de accesibilidad confirmó: al abrir Aries, el foco activo fue el botón `Close`; el diálogo expuso `aria-labelledby`, tres controles focusables (National Geographic, NASA GSFC y Close) y, tras pulsar `Tab`, el foco pasó al enlace National Geographic manteniéndose dentro del diálogo. La consola revisada no mostró errores de ejecución; solo registró los resultados intencionales de la inspección. Escape cerró el modal en la comprobación previa.

La secuencia de teclado continuó de forma contenida: tras el foco inicial en `Close`, un Tab llevó a `National Geographic` y el siguiente Tab a `NASA GSFC`; ambos elementos permanecieron dentro del diálogo.

La comprobación del ciclo completo quedó documentada: después de `Close → National Geographic → NASA GSFC`, el tercer `Tab` volvió a `Close`; el elemento activo siguió dentro de `[role="dialog"]`. Esto confirma el focus trap observable del modal. Escape lo cerró en la prueba anterior, y Radix conserva el trigger como origen del diálogo para devolverle el foco al cerrar.

Tras implementar `returnFocusRef` y `onCloseAutoFocus`, la preview recargada confirmó que al abrir Aries el foco inicial sigue en `Close` y permanece dentro del diálogo.

Con la corrección aplicada, la verificación final mostró `modalStillOpen: false`, `activeElement: BUTTON`, `activeAriaLabel: Abrir detalle de Aries` e `isAriesTrigger: true` después de Escape. El foco retorna correctamente al activador original.

## Incidente README y URL válida

La URL del repositorio `https://github.com/aleotromundo/prueba` es la página de código de GitHub y muestra `README.md` por diseño; no ejecuta la aplicación. La URL de preview real de AstroNexo es `https://3000-id1rko5xk9wuxfuo9gnod-156ac3fc.us3.manus.computer/`, y la verificación visual dirigida del 16/08/2026 mostró la portada AstroNexo completa: navegación, hero “Un mapa del cielo”, CTA “Crear mi carta” y la ilustración orbital. No hace falta Vercel para esa preview ni para el hosting integrado; para una URL pública definitiva hay que usar Publish desde el panel WebDev, con el checkpoint `463f665f` como base.

La navegación directa a `https://3000-id1rko5xk9wuxfuo9gnod-156ac3fc.us3.manus.computer/` devolvió título `AstroNexo — Tu mapa del cielo` y contenido de la aplicación: enlaces Carta natal, Sinastría, Tránsitos, Retorno solar, Ascendente y Guía; hero “Un mapa del cielo. Una nueva forma de habitarlo.”; CTA “Crear mi carta” y “Explorar la guía”; y tarjetas de herramientas. La preview carga AstroNexo correctamente y no el README.
