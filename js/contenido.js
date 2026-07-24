/* =========================================================================
   CONTENIDO DEL SITIO
   Este es el único archivo que necesitas editar para publicar material.
   Guarda, haz commit y GitHub Pages se actualiza en 1-2 minutos.
   ========================================================================= */

const SITIO = {
  nombre: "Ingeniería Eléctrica Aplicada",
  autor: "Alí Pedraza García",
  puesto: "Ingeniero Mecanico Electricista & Maestria en Administración Energetica",
  correo: "pdrz900120@gmail.com",

  // "privado"  -> nadie entra sin código. Úsalo mientras construyes.
  // "publico"  -> el sitio se ve libremente; solo se bloquean las lecciones de pago.
  modo: "privado",

  // Tu llave. Con ella ves también los cursos en borrador.
  codigoPrivado: "PILOTO_1",

  // Códigos que abren las lecciones marcadas como "pago".
  codigosAlumno: ["ALUMNO-01", "ALUMNO-02"],

  // Lo que ve quien llega a una lección que aún no puede abrir.
  ventaTitulo: "Este curso aún no está disponible",
  ventaTexto:
    "Estoy preparando el material. Si te interesa, escríbeme y te aviso en cuanto abra la primera generación — así también me ayudas a decidir cuál grabo primero.",
  ventaEnlace: "mailto:pdrz900120@gmail.com?subject=Me%20interesa%20un%20curso",
  ventaBoton: "Avísame cuando abra",
};

/* =========================================================================
   CÓMO SE ARMA UN CURSO

   fase:     "a" negro · "b" rojo · "c" azul · "t" verde  (color del curso)
   estado:   "publicado" · "borrador" (solo tú) · "proximo" (se anuncia, no abre)
   acceso:   "libre" · "pago"   -> valor por omisión de todas sus lecciones

   CADA LECCIÓN PUEDE LLEVAR:

     tipo:     "teoria" · "practica" · "video"   (etiqueta que ve el alumno)
     video:    liga de YouTube o Vimeo (se inserta sola, no necesitas código)
     archivo:  el .md con la teoría, dentro de /lecciones
     recursos: archivos que el alumno descarga, dentro de /material

   Todos los campos son opcionales. Una lección puede ser solo video, solo
   texto, o las tres cosas juntas.
   ========================================================================= */

const CURSOS = [
  {
    id: "teoria-basica",
    titulo: "Teoría eléctrica para personal de mantenimiento",
    fase: "a",
    estado: "proximo",
    acceso: "pago",
    resumen:
      "Las bases que todos damos por sabidas y casi nadie tiene firmes: corriente, tensión, potencia, trifásico y factor de potencia, explicadas con equipo de planta.",
    dirigidoA: "Personal técnico y ayudantes que quieren dejar de trabajar de memoria.",
    duracion: "En preparación",

    // Material que aplica a todo el curso, no a una lección en particular.
    recursos: [],

    modulos: [],
  },

  {
    id: "control-motores",
    titulo: "Control de motores eléctricos",
    fase: "b",
    estado: "borrador",
    acceso: "pago",
    resumen:
      "Arrancadores, contactores, enclavamientos y diagramas de control: leerlos, armarlos y diagnosticarlos cuando el motor no arranca y nadie sabe por qué.",
    dirigidoA: "Electricistas de planta y personal de mantenimiento industrial.",
    duracion: "En preparación",

    recursos: [
      { titulo: "Temario completo del curso", archivo: "temario-control-motores.pdf" },
    ],

    modulos: [
      {
        titulo: "Módulo 1 — El circuito de control",
        lecciones: [
          {
            id: "fuerza-y-control",
            titulo: "Circuito de fuerza y circuito de control: la separación que todo lo explica",
            tipo: "teoria",
            duracion: "16 min",
            acceso: "libre",
            video: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
            archivo: "control-01-fuerza-control.md",
            recursos: [
              { titulo: "Diagrama del arranque directo", archivo: "arranque-directo.pdf" },
              { titulo: "Simbología usada en el curso", archivo: "simbologia.pdf" },
            ],
          },
          {
            id: "practica-arranque-directo",
            titulo: "Práctica: arranque directo con paro de emergencia",
            tipo: "practica",
            duracion: "5 ejercicios",
            archivo: "control-02-practica-arranque.md",
            recursos: [
              { titulo: "Hoja de ejercicios", archivo: "ejercicios-arranque-directo.pdf" },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "mantto-motores",
    titulo: "Mantenimiento a motores de inducción",
    fase: "c",
    estado: "proximo",
    acceso: "pago",
    resumen:
      "Pruebas de aislamiento, alineación, rodamientos y análisis de la causa real por la que se quemó. Qué se revisa antes de mandarlo a rebobinar.",
    dirigidoA: "Personal de mantenimiento eléctrico y mecánico.",
    duracion: "En preparación",
    recursos: [],
    modulos: [],
  },
];
