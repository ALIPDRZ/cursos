# Sitio educativo — guía de uso

Sitio estático, sin servidor ni base de datos. Vive en GitHub Pages y se
actualiza cada vez que haces commit.

## Estructura

```
index.html            portada y catálogo
curso.html            índice de lecciones de un curso
leccion.html          lector de la lección
css/estilos.css       diseño
js/contenido.js       ← ESTE es el archivo que editas normalmente
js/app.js             lógica (no necesitas tocarlo)
lecciones/*.md        el contenido de cada lección, en Markdown
img/                  imágenes de las lecciones
```

## Publicar por primera vez

1. Crea un repositorio en GitHub y sube esta carpeta.
2. Settings → Pages → Source: `main`, carpeta `/root`. Guarda.
3. En 1–2 minutos queda en `https://usuario.github.io/repositorio/`.
4. Cuando quieras dominio propio: Settings → Pages → Custom domain.

## Probar en tu computadora

No abras los archivos con doble clic: el navegador bloquea la carga de las
lecciones. Desde la carpeta del sitio, en la terminal:

```
python3 -m http.server 8000
```

y abre `http://localhost:8000`.

## Agregar una lección

1. Crea `lecciones/mi-leccion.md` y escribe el contenido.
2. En `js/contenido.js`, dentro del módulo que corresponda, agrega:

```js
{
  id: "mi-leccion",
  titulo: "Título que ve el alumno",
  duracion: "15 min",
  archivo: "mi-leccion.md",
}
```

3. Commit y listo.

## Los tres controles de acceso

En `js/contenido.js`, arriba:

| Ajuste | Para qué sirve |
|---|---|
| `modo: "privado"` | Nadie ve el sitio sin el código. Úsalo mientras construyes. |
| `modo: "publico"` | El sitio abre; solo se bloquean las lecciones de pago. |
| `codigoPrivado` | Tu llave mientras el sitio está privado. |
| `codigosAlumno` | Códigos que abren las lecciones de pago. |

Un curso o una lección con `acceso: "libre"` se ve sin código: úsalo para las
primeras lecciones de cada curso, funcionan como muestra de venta.

Mientras estás en modo privado también ves los cursos marcados como
`estado: "borrador"`. El público no.

## Importante sobre el cobro

El bloqueo por código **no es seguridad real**. Sirve perfectamente para:

- mantener el sitio cerrado mientras lo construyes,
- entregar acceso a un grupo de alumnos que ya te pagaron,
- evitar que el material circule por descuido.

No sirve para impedir que alguien decidido copie el contenido, y si el
repositorio es público, los archivos `.md` se pueden leer directamente en
GitHub. Dos formas de resolverlo cuando ya vendas en serio:

- **Repositorio privado** con GitHub Pages (requiere plan de pago), o
- **el video y los PDF fuera del repositorio**: Vimeo con dominio restringido,
  o el curso alojado en Hotmart mientras la venta vive en este sitio.

Cuando el volumen lo justifique, la ruta natural es Memberstack o
Stripe + Cloudflare Worker para dar y quitar accesos automáticamente después
del pago. La estructura del sitio no cambia.

## Cobro mientras tanto

En `SITIO.ventaEnlace` puedes poner tu correo o directamente un link de pago
de Mercado Pago o Stripe. El flujo funciona bien así: el alumno paga, tú
recibes el aviso y le mandas su código.
