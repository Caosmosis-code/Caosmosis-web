import type { Articulo, Comentario } from "@/lib/tipos";

export type EditorialArticle = Articulo & { excerpt?: string };

export const sampleArticles: EditorialArticle[] = [
  {
    id: 906,
    titulo: "Cuando la ciudad se queda sin sombra: el calor redefine la vida en los barrios",
    categoria: "Actualidad",
    autorNombre: "Lucía Ferreyra",
    autorId: 31,
    fechaPublicacion: "2026-10-11T12:00:00",
    tiempoLectura: 7,
    imagenUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
    contenido: `En una tarde de enero, la parada del colectivo puede convertirse en una habitación sin techo. El asfalto devuelve el calor acumulado, las fachadas proyectan sombras cada vez más cortas y la espera parece durar más que el recorrido. Para quien tiene aire acondicionado en casa y puede elegir cuándo salir, esa escena es una molestia. Para quien trabaja en la calle, acompaña a una persona mayor o espera el transporte con un chico, es una medida concreta de cuánto protege la ciudad a sus habitantes.

El aumento de las temperaturas dejó de ser una cifra lejana en un informe. Se reconoce en noches que no refrescan, en escuelas que reorganizan horarios y en centros de salud que reciben más consultas por deshidratación. También se percibe en decisiones pequeñas: cruzar por la vereda que tiene árboles, caminar unas cuadras más para encontrar una parada cubierta o suspender una actividad al aire libre. El calor modifica el mapa cotidiano antes de que aparezca en los mapas meteorológicos.

La forma urbana tiene mucho que ver con esa experiencia. El cemento, el asfalto y los techos oscuros absorben energía durante el día y la liberan lentamente por la noche. Cuando faltan árboles, patios permeables y espacios de sombra, la temperatura queda atrapada entre edificios. Dos barrios separados por pocas calles pueden ofrecer condiciones muy distintas: uno tiene plazas y arbolado continuo; el otro, avenidas anchas sin refugio y viviendas con escasa ventilación.

## La sombra también es infraestructura

Durante décadas, la infraestructura urbana se midió sobre todo en kilómetros de calles, redes de agua y capacidad de transporte. La sombra suele quedar en una categoría decorativa, como si plantar un árbol fuera un gesto amable pero secundario. Sin embargo, una copa madura reduce la radiación directa, enfría el entorno y hace posible que una plaza o una vereda sigan siendo utilizables en verano. No reemplaza una política de vivienda ni una red de salud, pero puede disminuir la exposición diaria de miles de personas.

La diferencia entre plantar y construir sombra es importante. Un árbol joven necesita años de cuidado antes de ofrecer una copa amplia. Si se lo coloca sin pensar en el suelo disponible, las instalaciones subterráneas, el riego y la especie adecuada, puede secarse antes de crecer. Por eso los programas de arbolado no se evalúan contando plantines entregados, sino siguiendo su supervivencia, el tamaño de las copas y la continuidad de las calles sombreadas.

La misma mirada sirve para las paradas de colectivo, los patios escolares y los recorridos hacia centros de salud. Una cubierta liviana puede resolver parte de la espera, pero su ubicación, orientación y ventilación determinan si protege del sol o concentra aire caliente. Un patio con árboles puede habilitar recreos durante más meses del año. Un centro de salud con agua disponible y un espacio fresco puede orientar a quienes presentan síntomas antes de que la situación se agrave.

## El calor no golpea por igual

La temperatura del aire es solo una parte de la exposición. También importan la humedad, el viento, la radiación del sol y las condiciones del cuerpo. Una persona que trabaja repartiendo mercadería en bicicleta enfrenta un riesgo diferente al de alguien que permanece en una oficina. Una persona mayor que vive sola puede no advertir que necesita tomar agua. Quienes habitan viviendas pequeñas, con techos expuestos y pocas ventanas, tienen menos posibilidades de escapar del calor cuando llega la noche.

La edad, la salud y el tipo de empleo cambian la capacidad de respuesta, pero también lo hace el acceso a recursos. No todos pueden comprar un equipo de refrigeración, pagar la electricidad que consume o dejar de trabajar en las horas más calurosas. La adaptación no debería depender de que cada hogar resuelva por su cuenta una amenaza que atraviesa barrios enteros. Cuando la respuesta se reduce a recomendaciones individuales, la responsabilidad se desplaza hacia quienes tienen menos opciones.

Por eso la conversación sobre calor necesita datos barriales y participación de quienes viven el problema. Los registros de temperatura pueden mostrar zonas críticas, pero no explican por sí solos dónde se acumulan las esperas, qué escuela tiene un patio sin sombra o qué recorrido deben hacer las personas para llegar al agua. Esa información aparece al combinar mediciones con mapas de servicios, recorridos cotidianos y experiencias de residentes, trabajadores, docentes y equipos de salud.

> Una ciudad preparada para el calor no es la que elimina el verano, sino la que evita que protegerse dependa del ingreso de cada hogar.

## De los datos a las decisiones

Un mapa de calor puede ayudar a priorizar obras, siempre que no quede como una imagen técnica difícil de usar. Si muestra temperaturas por manzana y se cruza con escuelas, residencias de personas mayores, paradas de transporte y cobertura vegetal, permite orientar recursos hacia los lugares donde el riesgo es mayor. Pero el mapa debe traducirse en responsabilidades: qué área interviene, en qué plazo, con qué presupuesto y cómo se comprobará que la mejora llegó.

La planificación también tiene que mirar los tiempos largos. Un árbol recién plantado no resuelve la próxima ola de calor, y una cubierta nueva no sustituye la renovación de viviendas mal ventiladas. Se necesitan medidas inmediatas y de fondo: habilitar espacios frescos durante alertas, asegurar agua en lugares de espera, adaptar horarios de tareas expuestas y sostener planes de arbolado con mantenimiento. Cada acción responde a una escala distinta y ninguna funciona aislada del resto.

La comunicación pública es otra parte de esa infraestructura. Una alerta debe explicar qué se espera, quiénes enfrentan mayor riesgo y qué espacios están disponibles para recibir ayuda. Si el mensaje llega solo por una aplicación, deja afuera a quienes no tienen conectividad o no revisan el teléfono durante el trabajo. Radios locales, escuelas, clubes, centros de salud y organizaciones barriales pueden hacer circular la información y detectar a personas que necesitan asistencia.

## Una adaptación cercana

Prepararse no significa cubrir cada superficie con tecnología costosa. Muchas mejoras dependen de decisiones de diseño y mantenimiento: conservar árboles existentes, sumar suelo absorbente, proteger las veredas más transitadas y favorecer ventilación cruzada en edificios públicos. Otras requieren inversión sostenida, como renovar techos, mejorar el transporte y ampliar espacios verdes en sectores densamente construidos. La combinación tiene que responder al clima local y a las necesidades de cada comunidad, no a una receta repetida sin contexto.

Los beneficios de estas medidas se extienden más allá de los días extremos. Una calle arbolada puede ser más caminable, un patio cuidado puede servir para actividades comunitarias y una plaza con agua y sombra puede sostener encuentros durante buena parte del año. La política climática deja entonces de parecer un asunto futuro y se reconoce en lugares concretos, a la altura de la vida diaria.

El desafío es decidir quién aparece primero en el orden de las obras. Si los presupuestos se distribuyen solo donde ya hay más capacidad de reclamar, las desigualdades existentes se vuelven también desigualdades térmicas. Priorizar a quienes tienen menos refugio no es una concesión: es una forma de hacer que la inversión pública reduzca riesgos reales. Esa elección requiere transparencia, seguimiento y canales para que los barrios puedan corregir los planes cuando no responden a lo que ocurre en el terreno.

La sombra no detiene por sí sola el cambio climático, pero sí modifica la exposición inmediata y la calidad de vida. La pregunta para las ciudades ya no es si habrá que adaptarse, sino cómo se distribuye esa adaptación. Una respuesta justa empieza por reconocer que el calor se vive de manera desigual, que el espacio público puede proteger y que la planificación debe incluir a quienes conocen sus calles mejor que cualquier modelo.`,
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "El calor extremo se siente de forma distinta en cada barrio. Árboles, transporte y vivienda muestran quién puede protegerse y qué puede hacer la ciudad.",
  },
  {
    id: 901,
    titulo: "La ciudad también piensa: caminar como forma de leer el mundo",
    categoria: "Cultura",
    autorNombre: "Lucía Ferreyra",
    autorId: 31,
    fechaPublicacion: "2026-10-10T12:00:00",
    tiempoLectura: 8,
    imagenUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
    contenido: "Caminar sin apuro cambia la escala de las cosas. Una avenida deja de ser una línea en el mapa y vuelve a ser una sucesión de fachadas, conversaciones, árboles y decisiones pequeñas.\n\nEn esa atención aparece una forma de conocimiento que no necesita separar al observador de lo observado. La ciudad se entiende con los pies: por sus ritmos, por las distancias que habilita y por los lugares donde invita a quedarse.\n\nQuizás por eso volver a caminarla sea también una manera de reclamarla. No como un decorado que atravesamos, sino como un espacio compartido que podemos cuidar, discutir y transformar.",
    estado: "PUBLICADO",
    esPortada: true,
    comentarioRevision: null,
    excerpt: "Una invitación a mirar las calles como un texto colectivo: sus ritmos, sus pausas y las formas de vida que hacen posibles.",
  },
  {
    id: 902,
    titulo: "Inteligencia artificial y trabajo: más allá del reemplazo",
    categoria: "Tecnología",
    autorNombre: "Tomás Ríos",
    autorId: 32,
    fechaPublicacion: "2026-10-09T09:30:00",
    tiempoLectura: 11,
    imagenUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    contenido: "La conversación sobre inteligencia artificial suele empezar por una pregunta binaria: qué tareas desaparecerán y cuáles sobrevivirán. Pero el trabajo no es una lista de tareas. También es una relación entre personas, instituciones y expectativas.\n\nCuando una herramienta automatiza una parte del proceso, reorganiza el tiempo y el poder alrededor de esa tarea. Entender ese cambio exige preguntar quién define el objetivo, quién conserva el conocimiento y quién recibe los beneficios de la productividad.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "Las herramientas cambian tareas, pero también redistribuyen tiempo, conocimiento y poder.",
  },
  {
    id: 903,
    titulo: "El cielo nocturno como patrimonio común",
    categoria: "Ciencia",
    autorNombre: "Malena Sosa",
    autorId: 33,
    fechaPublicacion: "2026-10-07T15:00:00",
    tiempoLectura: 6,
    imagenUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=85",
    contenido: "Durante siglos, mirar el cielo fue una experiencia cotidiana y compartida. Hoy, la contaminación lumínica borra lentamente esa posibilidad para millones de personas.\n\nProteger la oscuridad no significa renunciar a la ciudad iluminada: significa usar la luz con intención. Una lámpara bien dirigida mejora la seguridad sin tapar las estrellas.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "La oscuridad también es un bien público: cuidar el cielo empieza por decidir cómo iluminamos nuestras ciudades.",
  },
  {
    id: 904,
    titulo: "Leer en comunidad en tiempos de pantallas infinitas",
    categoria: "Opinión",
    autorNombre: "Lucía Ferreyra",
    autorId: 31,
    fechaPublicacion: "2026-10-05T11:00:00",
    tiempoLectura: 7,
    imagenUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85",
    contenido: "La lectura parece una actividad solitaria, pero casi siempre llega acompañada: alguien recomendó el libro, lo editó, lo tradujo, lo prestó o dejó una nota en el margen.\n\nLas comunidades lectoras hacen visible esa trama y abren un espacio para pensar con otras personas, sin reducir cada conversación a una reacción inmediata.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "Cada libro circula dentro de una comunidad. Recuperar esa dimensión cambia la forma de leer y conversar.",
  },
  {
    id: 905,
    titulo: "Pequeñas tecnologías para una vida más lenta",
    categoria: "Actualidad",
    autorNombre: "Tomás Ríos",
    autorId: 32,
    fechaPublicacion: "2026-10-02T10:00:00",
    tiempoLectura: 9,
    imagenUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85",
    contenido: "No toda innovación acelera. Algunas herramientas están diseñadas para quitar pasos, reducir interrupciones y devolvernos un poco de atención.\n\nLa pregunta útil quizá no sea si una tecnología es nueva, sino qué tipo de vida vuelve más fácil. Esa respuesta depende menos de la promesa del producto que del uso que construimos alrededor.",
    estado: "PUBLICADO",
    esPortada: false,
    comentarioRevision: null,
    excerpt: "Una tecnología puede ser valiosa cuando nos devuelve tiempo y atención, en lugar de pedir más de ambos.",
  },
];

export const sampleComments: Comentario[] = [];

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function articleHref(article: Pick<Articulo, "id" | "titulo">): string {
  return `/articulo/${slugify(article.titulo)}-${article.id}`;
}

export function authorHref(author: Pick<Articulo, "autorId" | "autorNombre">): string {
  return `/autor/${slugify(author.autorNombre)}-${author.autorId}`;
}
