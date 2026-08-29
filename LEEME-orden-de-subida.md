# Subida del 30 de agosto — Agente vinculado, EAF o banco

**11 archivos.** Subir por la web de GitHub: `https://github.com/coacher-commits/capitalforte/upload/main` → arrastrar todo → *Commit changes* a `main`. Vercel despliega solo (~40 s).

Se pueden subir todos de una vez. El orden solo importa si prefieres commits separados.

---

## Qué es cada archivo

### Nuevos (2)

| Archivo | URL resultante |
|---|---|
| `agente-vinculado-eaf-banco.html` | `/agente-vinculado-eaf-banco` |
| `agente-vinculado-eaf-banco-gl.html` | `/agente-vinculado-eaf-banco-gl` |

### Compartidos — modificados (3)

| Archivo | Cambio |
|---|---|
| `sitemap.xml` | 41 → **43** URLs |
| `blog.html` | tarjeta nueva la primera, contador 13 → 14, entrada en el JSON-LD `blogPost` |
| `blog-gl.html` | igual + corregido «14 artículos» → «14 **artigos**» (estaba en castellano de antes) |

> Los tres se verificaron **byte a byte idénticos a producción** antes de editarlos, así que no se repite lo del 26 de julio.

### Artículos del clúster — un enlace entrante cada uno (6)

Enlace contextual dentro del texto, no en «Sigue leyendo»:

| Archivo | Texto enlazado |
|---|---|
| `cuanto-cuesta-asesor-financiero.html` | «agentes vinculados» |
| `cuanto-cuesta-asesor-financiero-gl.html` | «axentes vinculados» |
| `merece-la-pena-pagar-asesor-financiero.html` | «asesoramiento independiente y no independiente» |
| `merece-la-pena-pagar-asesor-financiero-gl.html` | «asesoramento independente e non independente» |
| `asesor-financiero-registrado-cnmv.html` | «agente vinculado» |
| `asesor-financiero-registrado-cnmv-gl.html` | «axente vinculado» |

---

## Después de subir

1. **Comprobar que responden** (no 404):
   - `https://nortecapital.es/agente-vinculado-eaf-banco`
   - `https://nortecapital.es/agente-vinculado-eaf-banco-gl`
2. **Solicitar indexación en GSC** de esas dos URLs, solo una vez estén LIVE.
   Inspección de URLs → pegar → Solicitar indexación.
3. Las otras 8 páginas ya están indexadas; no hace falta volver a pedirlo.

---

## Validado antes de empaquetar

- HTML bien formado y cerrado en `</html>`, sin bytes NUL — los 10 archivos
- Los 3 JSON-LD por artículo parsean; **BlogPosting**, nunca Article
- `hreflang` recíproco ES ↔ GL comprobado en ambos sentidos
- Title 60 / 60 caracteres, meta 155 / 148
- Cero URLs internas con `.html`
- Sin mención a cripto
- Anclas del índice lateral sin romper
- Toda `<img>` con `alt`, `width` y `height`
- Los 4 mensajes de WhatsApp son únicos: no se repiten en ninguna de las 46 páginas
- `sitemap.xml` valida como XML y cuadra con los archivos

---

## Pendiente, no bloqueante

**Imagen.** Se reutiliza `assets/blog/coste-asesor.png`, que ya está en el repo — por eso no hay que subir ninguna imagen. Comparte imagen con `/cuanto-cuesta-asesor-financiero`. Cuando tengas una propia, basta con sustituir la ruta en cuatro sitios de cada HTML (`og:image`, `twitter:image`, el JSON-LD y la tarjeta del blog).

**Nombre del autor.** El sitio usa «Álvaro González» de forma consistente y así lo he dejado. Tu correo es *alvarobeltrangf@*, así que si el apellido correcto fuera Beltrán habría que cambiarlo en todo el sitio, no solo aquí.
