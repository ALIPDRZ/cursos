# Empieza aquí — 6 pasos para dejar el sitio en línea

Marca cada uno conforme lo hagas.

---

## [ ] 1. Tus datos

Abre `js/contenido.js` con el Bloc de notas y cambia estas líneas:

```js
correo: "tucorreo@ejemplo.com",          →  tu correo real
codigoPrivado: "CAMBIA-ESTE-CODIGO",     →  invéntate uno, no lo compartas
ventaEnlace: "mailto:tucorreo@..."       →  tu correo real
```

Abre también `index.html` y reemplaza el `tucorreo@ejemplo.com` que aparece al final de la sección "Quién imparte".

Guarda los dos archivos con Ctrl+S.

---

## [ ] 2. El logo

Necesitas dos archivos dentro de la carpeta `img/`, los dos con fondo
transparente (quítalo en remove.bg si hace falta):

| Archivo | Qué es | Tamaño sugerido |
|---|---|---|
| `logo.png` | Solo el monograma PRZ, recortado cuadrado | 200 × 200 px |
| `logo-completo.png` | El logo con tu nombre en arco | 800 px de ancho |
| `icono.png` | El monograma, cuadrado (para la pestaña) | 128 × 128 px |

Si todavía no los tienes, no pasa nada: el sitio funciona igual y muestra
las tres barras de colores en su lugar.

---

## [ ] 3. El nombre del sitio

En `js/contenido.js`, la línea `nombre:` es lo que aparece en la barra
superior. Cámbiala si quieres algo distinto a "Ingeniería Eléctrica Aplicada".

---

## [ ] 4. Revisa el texto de la portada

En `index.html` está el título grande y la sección "Quién imparte".
Léelos y ajústalos a como tú lo dirías.

---

## [ ] 5. Sube a GitHub

1. github.com → botón **+** → **New repository**
2. Nombre: `cursos` · **Public** · sin marcar ninguna casilla
3. **Create repository**
4. Clic en **uploading an existing file**
5. Selecciona TODO lo que está dentro de esta carpeta (Ctrl+A) y arrástralo
6. Mensaje: "Primera versión" → **Commit changes**

---

## [ ] 6. Enciende el sitio

**Settings** → **Pages** → Source: **Deploy from a branch** →
Branch `main`, carpeta `/ (root)` → **Save**

Espera dos minutos y recarga: ahí aparece tu dirección.

---

## Después de esto

El sitio queda abierto con tus tres cursos anunciados. Para agregar una
lección, revisa `LEEME.md`.

Recuerda: los videos van a YouTube como **"No listado"**, nunca públicos.
