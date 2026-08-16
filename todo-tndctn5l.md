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

- [ ] Verificar acceso al repositorio `https://github.com/aleotromundo/prueba.git`.
- [ ] Comparar rama principal, commits y estructura remota con AstroNexo antes de sincronizar.
- [ ] Confirmar con el usuario cualquier conflicto o diferencia de proyecto antes de hacer pull.
- [ ] Configurar el remoto únicamente si corresponde y sincronizar sin sobrescribir cambios.
- [ ] Verificar el estado final del proyecto después de la sincronización.

## Nueva solicitud: carpeta aislada `prueba`

- [ ] Mantener todo el contenido del repositorio `aleotromundo/prueba` dentro de una sola carpeta `prueba`.
- [ ] No mezclar archivos de `prueba` con AstroNexo ni mover contenido entre ambos proyectos.
- [ ] Definir cuál será la raíz del sitio que se seguirá editando después de la separación.
- [ ] Verificar que el repositorio GitHub permanezca identificable y completo dentro de `prueba`.
- [ ] Confirmar la estructura final y el estado del sitio al usuario.

## Nueva arquitectura solicitada: GitHub como AstroNexo principal

- [ ] Preservar íntegramente el proyecto original de `aleotromundo/prueba` dentro de una carpeta aislada y claramente identificada.
- [ ] No borrar ni mezclar los archivos originales de prueba con AstroNexo.
- [ ] Preparar el repositorio GitHub para que AstroNexo sea la aplicación principal y única aplicación desplegable.
- [ ] Copiar la versión consolidada de AstroNexo al repositorio principal respetando su estructura y dependencias.
- [ ] Configurar el remoto GitHub como origen del nuevo AstroNexo sin publicar ni sobrescribir hasta verificar el árbol final.
- [ ] Ejecutar build, pruebas y verificación de separación antes de confirmar la sincronización.
- [ ] Crear checkpoint de la migración y documentar la estructura final del repositorio.
