/* =========================================================================
   Lógica del sitio. Normalmente no necesitas tocar este archivo.
   ========================================================================= */

/* ---------- Almacenamiento tolerante a fallos ---------- */

const memoria = {};

const guardar = (clave, valor) => {
  memoria[clave] = valor;
  try { localStorage.setItem(clave, valor); } catch (e) { /* sin persistencia */ }
};

const leer = (clave) => {
  try { return localStorage.getItem(clave) ?? memoria[clave] ?? null; }
  catch (e) { return memoria[clave] ?? null; }
};

/* ---------- Estado de acceso ---------- */

const esEditor = () => leer("acceso_privado") === SITIO.codigoPrivado;

const esAlumno = () => SITIO.codigosAlumno.includes(leer("acceso_alumno")) || esEditor();

const sitioAbierto = () => SITIO.modo === "publico" || esEditor();

const accesoDeLeccion = (curso, leccion) => leccion.acceso || curso.acceso || "libre";

const cursosVisibles = () =>
  CURSOS.filter((c) => esEditor() || c.estado !== "borrador");

/* ---------- Utilidades ---------- */

const q = (nombre) => new URLSearchParams(location.search).get(nombre);

const buscarCurso = (id) => CURSOS.find((c) => c.id === id);

const listaPlana = (curso) =>
  (curso.modulos || []).flatMap((m) => m.lecciones.map((l) => ({ ...l, modulo: m.titulo })));

/* Convierte una liga de YouTube o Vimeo en un video insertado. */
function marcoVideo(url) {
  if (!url) return "";
  let inc = url;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (yt) inc = `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  else if (vm) inc = `https://player.vimeo.com/video/${vm[1]}`;
  return `<div class="video-marco"><iframe src="${inc}" title="Video de la lección"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowfullscreen loading="lazy"></iframe></div>`;
}

/* Lista de archivos descargables. */
function bloqueRecursos(recursos, titulo = "Material de apoyo") {
  if (!recursos || !recursos.length) return "";
  return `
    <section class="recursos">
      <h3 class="recursos__titulo">${escapar(titulo)}</h3>
      ${recursos.map((r) => `
        <a class="recurso" href="material/${encodeURI(r.archivo)}" download>
          <span class="recurso__ext">${escapar((r.archivo.split(".").pop() || "").toUpperCase())}</span>
          <span class="recurso__nombre">${escapar(r.titulo)}</span>
          <span class="recurso__accion">Descargar</span>
        </a>`).join("")}
    </section>`;
}

const ETIQUETA_TIPO = {
  teoria: { texto: "Teoría", clase: "tipo--teoria" },
  practica: { texto: "Práctica", clase: "tipo--practica" },
  video: { texto: "Video", clase: "tipo--video" },
};

const marcaTipo = (t) => {
  const e = ETIQUETA_TIPO[t];
  return e ? `<span class="insignia ${e.clase}">${e.texto}</span>` : "";
};

const escapar = (t) =>
  String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Cabecera y pie compartidos ---------- */

function montarEstructura() {
  const cintillo = esEditor() && SITIO.modo === "privado"
    ? `<div class="cintillo">Modo privado · solo tú ves este sitio · <a href="#" id="salir" style="color:#fff">salir</a></div>`
    : "";

  document.body.insertAdjacentHTML("afterbegin", `
    ${cintillo}
    <header class="barra">
      <div class="barra__fila">
        <a class="marca" href="index.html">
          <img class="marca__logo" src="img/logo.png" alt=""
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <span class="marca__barras" style="display:none"><span></span><span></span><span></span></span>
          <span class="marca__texto">${escapar(SITIO.nombre)}</span>
        </a>
        <nav>
          <a href="index.html#cursos">Cursos</a>
          <a href="index.html#autor">Quién imparte</a>
          <a href="mailto:${escapar(SITIO.correo)}">Contacto</a>
        </nav>
      </div>
    </header>
  `);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="pie">
      <div class="envoltura pie__fila">
        <span>${escapar(SITIO.autor)} · ${escapar(SITIO.puesto)}</span>
        <span class="etiqueta">${new Date().getFullYear()}</span>
      </div>
    </footer>
  `);

  const salir = document.getElementById("salir");
  if (salir) salir.addEventListener("click", (e) => {
    e.preventDefault();
    guardar("acceso_privado", "");
    location.reload();
  });
}

/* ---------- Puerta del sitio en modo privado ---------- */

function pedirCodigoDelSitio() {
  document.body.innerHTML = `
    <main class="envoltura" style="max-width:560px;padding-top:100px">
      <div class="candado">
        <p class="etiqueta">Sitio en construcción</p>
        <h2>Acceso restringido</h2>
        <p>Este sitio todavía no abre al público. Si tienes un código, escríbelo aquí.</p>
        <form class="candado__forma" id="forma-sitio">
          <input id="codigo-sitio" type="password" placeholder="Código de acceso"
                 autocomplete="off" aria-label="Código de acceso">
          <button class="boton" type="submit">Entrar</button>
        </form>
        <p class="aviso-error" id="error-sitio" role="alert"></p>
      </div>
    </main>
  `;
  document.getElementById("forma-sitio").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = document.getElementById("codigo-sitio").value.trim();
    if (v === SITIO.codigoPrivado) {
      guardar("acceso_privado", v);
      location.reload();
    } else {
      document.getElementById("error-sitio").textContent = "Ese código no es válido.";
    }
  });
}

/* ---------- Página de inicio ---------- */

function pintarCatalogo() {
  const cont = document.getElementById("catalogo");
  if (!cont) return;

  const cursos = cursosVisibles();
  if (!cursos.length) {
    cont.innerHTML = `<div class="vacio">Todavía no hay cursos publicados. Agrega el primero en <code>js/contenido.js</code>.</div>`;
    return;
  }

  cont.innerHTML = cursos.map((c) => {
    const total = listaPlana(c).length;
    const insignias = [
      c.estado === "borrador" ? `<span class="insignia insignia--borrador">Borrador</span>` : "",
      c.estado === "proximo" ? `<span class="insignia insignia--proximo">Próximamente</span>` : "",
      c.acceso === "libre" ? `<span class="insignia insignia--libre">Acceso libre</span>` : "",
    ].filter(Boolean).join(" ");

    return `
      <a class="curso" data-fase="${c.fase || "a"}" href="curso.html?curso=${encodeURIComponent(c.id)}">
        <p class="etiqueta">${total ? total + " lecciones" : "En preparación"}</p>
        <h3 class="curso__titulo">${escapar(c.titulo)}</h3>
        <p class="curso__resumen">${escapar(c.resumen)}</p>
        <div class="curso__pie">
          <span class="etiqueta">${escapar(c.duracion || "")}</span>
          ${insignias}
        </div>
      </a>`;
  }).join("");
}

/* ---------- Página de curso ---------- */

function pintarCurso() {
  const cont = document.getElementById("curso");
  if (!cont) return;

  const curso = buscarCurso(q("curso"));
  if (!curso || (curso.estado === "borrador" && !esEditor())) {
    cont.innerHTML = `<div class="vacio">No encontramos ese curso. <a href="index.html">Ver el catálogo</a>.</div>`;
    return;
  }

  document.title = `${curso.titulo} · ${SITIO.nombre}`;

  const modulos = (curso.modulos || []).map((m) => `
    <section class="modulo">
      <h3 class="modulo__titulo">${escapar(m.titulo)}</h3>
      ${m.lecciones.map((l, i) => {
        const abierta = accesoDeLeccion(curso, l) === "libre" || esAlumno();
        return `
          <a class="leccion ${abierta ? "" : "leccion--bloqueada"}"
             href="leccion.html?curso=${encodeURIComponent(curso.id)}&leccion=${encodeURIComponent(l.id)}">
            <span class="leccion__num">${String(i + 1).padStart(2, "0")}</span>
            <span class="leccion__nombre">${escapar(l.titulo)}</span>
            ${marcaTipo(l.tipo)}
            ${abierta ? "" : `<span class="insignia insignia--pago">Con acceso</span>`}
            <span class="leccion__dur">${escapar(l.duracion || "")}</span>
          </a>`;
      }).join("")}
    </section>`).join("");

  cont.innerHTML = `
    <div class="seccion__encabezado">
      <h2 class="placa">${escapar(curso.titulo)}</h2>
      <span class="etiqueta">${escapar(curso.duracion || "")}</span>
    </div>
    <p style="max-width:60ch;color:var(--tinta-media)">${escapar(curso.resumen)}</p>
    ${curso.dirigidoA ? `<p style="max-width:60ch"><strong>Dirigido a:</strong> ${escapar(curso.dirigidoA)}</p>` : ""}
    <div style="margin-top:36px">
      ${modulos || `<div class="vacio">Las lecciones de este curso aún se están grabando.</div>`}
      ${esAlumno() ? bloqueRecursos(curso.recursos, "Material del curso") : ""}
    </div>`;
}

/* ---------- Página de lección ---------- */

async function pintarLeccion() {
  const cont = document.getElementById("leccion");
  if (!cont) return;

  const curso = buscarCurso(q("curso"));
  const lecciones = curso ? listaPlana(curso) : [];
  const indice = lecciones.findIndex((l) => l.id === q("leccion"));
  const leccion = lecciones[indice];

  if (!curso || !leccion) {
    cont.innerHTML = `<div class="vacio">No encontramos esa lección. <a href="index.html">Ver el catálogo</a>.</div>`;
    return;
  }

  document.title = `${leccion.titulo} · ${curso.titulo}`;

  const migas = `
    <p class="lector__migas">
      <a href="curso.html?curso=${encodeURIComponent(curso.id)}">${escapar(curso.titulo)}</a>
      &nbsp;/&nbsp; ${escapar(leccion.modulo || "")}
    </p>`;

  if (accesoDeLeccion(curso, leccion) === "pago" && !esAlumno()) {
    cont.innerHTML = `
      ${migas}
      <div class="candado">
        <p class="etiqueta">${escapar(leccion.titulo)}</p>
        <h2>${escapar(SITIO.ventaTitulo)}</h2>
        <p>${escapar(SITIO.ventaTexto)}</p>
        <p><a class="boton" href="${SITIO.ventaEnlace}">${escapar(SITIO.ventaBoton)}</a></p>
        <form class="candado__forma" id="forma-alumno" style="margin-top:24px">
          <input id="codigo-alumno" type="text" placeholder="Ya tengo un código"
                 autocomplete="off" aria-label="Código de alumno">
          <button class="boton boton--linea" type="submit">Abrir lección</button>
        </form>
        <p class="aviso-error" id="error-alumno" role="alert"></p>
      </div>`;

    document.getElementById("forma-alumno").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = document.getElementById("codigo-alumno").value.trim().toUpperCase();
      if (SITIO.codigosAlumno.includes(v)) {
        guardar("acceso_alumno", v);
        location.reload();
      } else {
        document.getElementById("error-alumno").textContent = "Ese código no corresponde a este curso.";
      }
    });
    return;
  }

  let cuerpo = "";
  try {
    if (!leccion.archivo) throw new Error("sin archivo");
    const r = await fetch(`lecciones/${leccion.archivo}`);
    if (!r.ok) throw new Error(r.status);
    cuerpo = marked.parse(await r.text());
  } catch (e) {
    cuerpo = leccion.video && !leccion.archivo
      ? `<h1>${escapar(leccion.titulo)}</h1>`
      : `<h1>${escapar(leccion.titulo)}</h1>
      <p>No se pudo cargar <code>lecciones/${escapar(leccion.archivo || "")}</code>.</p>
      <p>Si estás probando en tu computadora, abre el sitio con un servidor local
      (<code>python3 -m http.server</code>) en lugar de dar doble clic al archivo.</p>`;
  }

  const previa = lecciones[indice - 1];
  const siguiente = lecciones[indice + 1];
  const enlace = (l) => `leccion.html?curso=${encodeURIComponent(curso.id)}&leccion=${encodeURIComponent(l.id)}`;

  cont.innerHTML = `
    ${migas}
    ${marcoVideo(leccion.video)}
    <article class="contenido">
      ${cuerpo}
      ${bloqueRecursos(leccion.recursos, leccion.tipo === "practica" ? "Ejercicios y hojas de trabajo" : "Material de apoyo")}
    </article>
    <nav class="lector__nav">
      ${previa ? `<a class="boton boton--linea" href="${enlace(previa)}">← Anterior</a>` : "<span></span>"}
      ${siguiente ? `<a class="boton" href="${enlace(siguiente)}">Siguiente →</a>`
                  : `<a class="boton boton--linea" href="curso.html?curso=${encodeURIComponent(curso.id)}">Volver al índice</a>`}
    </nav>`;
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", () => {
  if (!sitioAbierto()) { pedirCodigoDelSitio(); return; }
  montarEstructura();
  pintarCatalogo();
  pintarCurso();
  pintarLeccion();
});
