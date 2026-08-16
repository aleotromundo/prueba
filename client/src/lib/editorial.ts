export const signGuides = [
  ["Aries", "Iniciativa", "Fuego", "Cardinal", "La chispa que abre camino. Aries explora el deseo de comenzar, actuar y afirmar una identidad propia."],
  ["Tauro", "Sostén", "Tierra", "Fijo", "Tauro observa la relación con los recursos, el cuerpo y la capacidad de cultivar lo que tiene valor."],
  ["Géminis", "Intercambio", "Aire", "Mutable", "Géminis representa curiosidad, lenguaje y la habilidad de tejer conexiones entre ideas y personas."],
  ["Cáncer", "Raíz", "Agua", "Cardinal", "Cáncer explora memoria, cuidado y la necesidad de construir un espacio emocionalmente seguro."],
  ["Leo", "Expresión", "Fuego", "Fijo", "Leo habla de la voluntad creativa, el juego y el valor de hacer visible una voz propia."],
  ["Virgo", "Discernimiento", "Tierra", "Mutable", "Virgo orienta la atención hacia el oficio, los hábitos y los pequeños ajustes que mejoran la vida diaria."],
  ["Libra", "Vínculo", "Aire", "Cardinal", "Libra investiga el arte del encuentro, la reciprocidad y la búsqueda de equilibrio en las relaciones."],
  ["Escorpio", "Profundidad", "Agua", "Fijo", "Escorpio trata transformación, intimidad y la valentía de mirar lo que necesita renovarse."],
  ["Sagitario", "Sentido", "Fuego", "Mutable", "Sagitario contempla visión, aprendizaje y el impulso de ampliar horizontes físicos o mentales."],
  ["Capricornio", "Estructura", "Tierra", "Cardinal", "Capricornio aborda responsabilidad, tiempo y la construcción paciente de una meta significativa."],
  ["Acuario", "Perspectiva", "Aire", "Fijo", "Acuario pone el foco en comunidad, innovación y la distancia necesaria para imaginar futuros distintos."],
  ["Piscis", "Sensibilidad", "Agua", "Mutable", "Piscis explora intuición, imaginación y la apertura a aquello que trasciende lo estrictamente racional."],
].map(([name, keyword, element, modality, description]) => ({ name, keyword, element, modality, description }));

export const planetaryGuides = [
  ["☉", "Sol", "Vitalidad, identidad y dirección consciente."],
  ["☽", "Luna", "Necesidades emocionales, hábitos y memoria."],
  ["☿", "Mercurio", "Lenguaje, pensamiento y formas de aprendizaje."],
  ["♀", "Venus", "Afecto, gusto, placer y valores personales."],
  ["♂", "Marte", "Deseo, iniciativa y modo de defender límites."],
  ["♃", "Júpiter", "Expansión, confianza y marcos de sentido."],
  ["♄", "Saturno", "Límites, compromiso, práctica y maduración."],
  ["♅", "Urano", "Cambio, independencia e innovación."],
  ["♆", "Neptuno", "Imaginación, empatía e ideales."],
  ["♇", "Plutón", "Poder, profundidad y procesos de transformación."],
].map(([symbol, name, description]) => ({ symbol, name, description }));

export const housesGuide = [
  "Presencia e iniciativa", "Recursos y valores", "Comunicación y entorno", "Raíces y pertenencia", "Creatividad y disfrute", "Hábitos y servicio",
  "Vínculos y acuerdos", "Intimidad y transformación", "Sentido y exploración", "Vocación y proyección", "Comunidad y futuro", "Mundo interior y cierre",
].map((topic, index) => ({ number: index + 1, topic }));

export const aspectsGuide = [
  ["☌", "Conjunción", "Fusión de dos funciones en el mismo punto del zodíaco."],
  ["⚹", "Sextil", "Puente de 60° que facilita colaboración y aprendizaje."],
  ["□", "Cuadratura", "Tensión de 90° que pide acción y reajuste."],
  ["△", "Trígono", "Fluidez de 120° entre energías de un mismo elemento."],
  ["⚻", "Quincuncio", "Ángulo de 150° que señala la necesidad de adaptación."],
  ["☍", "Oposición", "Polaridad de 180° que se expresa a través de vínculos o contrastes."],
].map(([symbol, name, description]) => ({ symbol, name, description }));

export const deepDiveGuides = [
  {
    number: "01",
    title: "La gramática de una carta",
    subtitle: "Planeta · signo · casa · aspecto",
    body: "Una lectura integrada comienza por distinguir cuatro preguntas. El planeta señala la función simbólica; el signo, el modo en que se expresa; la casa, el ámbito donde gana protagonismo; y el aspecto, la relación geométrica con otros puntos. Ninguna pieza se interpreta de forma aislada: una Luna en un signo no dice lo mismo si cambia de casa o forma una oposición estrecha.",
    note: "Sugerencia de lectura: empieza por Sol, Luna, Ascendente y regentes de las casas angulares antes de recorrer todos los detalles.",
  },
  {
    number: "02",
    title: "El zodíaco como mapa",
    subtitle: "Doce sectores de treinta grados",
    body: "El zodíaco tropical organiza una franja de la eclíptica en doce segmentos iguales. Es una convención geométrica e histórica: los signos funcionan como divisiones de 30°, mientras las constelaciones visibles ocupan extensiones desiguales. Esta diferencia ayuda a leer los símbolos con precisión y evita confundir lenguaje astrológico con cartografía estelar.",
    note: "La historia de esta división enlaza observación celeste, calendario y cálculo mesopotámico; por eso una carta se basa en grados y no en la forma aparente de una constelación.",
  },
  {
    number: "03",
    title: "Casas y horizonte",
    subtitle: "Por qué importan la hora y el lugar",
    body: "Las casas convierten la posición celeste en una perspectiva local. El ascendente marca el punto que emerge por el horizonte oriental y organiza los sectores posteriores. En AstroNexo se usa una división de casas iguales: cada casa abarca 30° desde el ascendente. Esta elección ofrece una lectura consistente y transparente, aunque existan otros sistemas de casas en la práctica astrológica.",
    note: "Si la hora de nacimiento es aproximada, el ascendente y las casas pueden variar de manera significativa. Es mejor tratar esos resultados como hipótesis de trabajo.",
  },
  {
    number: "04",
    title: "Aspectos: la geometría del diálogo",
    subtitle: "Orbe, distancia y contexto",
    body: "Un aspecto describe una separación angular entre dos puntos. Conjunción, sextil, cuadratura, trígono y oposición no son etiquetas buenas o malas: muestran estilos distintos de integración, fricción, apoyo o polaridad. El orbe mide qué tan cerca está la distancia real del ángulo exacto; cuanto más estrecho, mayor es el énfasis que AstroNexo da al contacto dentro de la visualización.",
    note: "La cualidad de un aspecto cambia según los planetas, casas y signos implicados. Una cuadratura puede movilizar una decisión; un trígono puede mostrar una facilidad que necesita dirección consciente.",
  },
  {
    number: "05",
    title: "Tránsitos y movimiento aparente",
    subtitle: "El cielo actual frente a la carta natal",
    body: "Un tránsito compara las longitudes de los cuerpos en el presente con las posiciones de nacimiento. En términos astronómicos, las posiciones se calculan para una fecha, una hora y un punto de observación; en términos astrológicos, el contacto se utiliza como lenguaje simbólico para observar ritmos, temas y cambios de foco. No es una predicción cerrada ni una instrucción.",
    note: "Conviene observar duración y repetición: los planetas personales cambian rápido, mientras los lentos sostienen climas más extensos y suelen tocar a una generación completa.",
  },
  {
    number: "06",
    title: "Retornos, ciclos y comparación",
    subtitle: "Técnicas para una lectura responsable",
    body: "El retorno solar busca el instante en que el Sol alcanza nuevamente la longitud eclíptica natal. La sinastría, en cambio, coloca dos cartas en diálogo y revisa contactos entre ambas. Son técnicas diferentes: el retorno ofrece una imagen simbólica anual; la sinastría observa patrones relacionales. En ambos casos, el contexto humano y la autonomía de las personas pesan más que una puntuación o una frase aislada.",
    note: "Usa las herramientas para formular preguntas y reconocer ritmos. Evita convertirlas en diagnósticos, certezas o sustitutos de decisiones informadas.",
  },
];

export const sourceGuides = [
  {
    title: "Freie Universität Berlin",
    category: "Historia del conocimiento",
    text: "Contexto académico sobre la construcción babilónica del zodíaco y el desarrollo de prácticas de cálculo celeste.",
    href: "https://www.fu-berlin.de/en/featured-stories/research/2022/zodiac/index.html",
  },
  {
    title: "NASA JPL Horizons",
    category: "Efemérides astronómicas",
    text: "Referencia institucional para posiciones, movimiento y observabilidad de cuerpos del sistema solar.",
    href: "https://ssd.jpl.nasa.gov/horizons/manual.html",
  },
  {
    title: "Astronomy Engine",
    category: "Método de cálculo",
    text: "Documentación del motor usado por AstroNexo para las posiciones planetarias y conversiones de coordenadas.",
    href: "https://github.com/cosinekitty/astronomy",
  },
  {
    title: "Swiss Ephemeris",
    category: "Contexto de efemérides",
    text: "Consulta de tablas de efemérides y cuerpos considerados por una de las referencias técnicas del campo.",
    href: "https://www.astro.com/swisseph/swepha_e.htm",
  },
];
