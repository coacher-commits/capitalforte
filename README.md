# Capital Forte — Sitio web

Sitio estático (HTML + CSS) listo para desplegar en Vercel.

## Estructura
```
index.html                            → /                (home)
blog.html                             → /blog
para-empresas.html                    → /para-empresas
empezar-a-invertir-desde-cero.html    → /empezar-a-invertir-desde-cero  (artículo de ejemplo)
cf.css                                → estilos compartidos
assets/founder.jpg                    → foto del asesor
vercel.json                           → URLs limpias (sin .html)
```

## Desplegar con Git + Vercel

### Opción A — desde la web de Vercel (la más fácil)
1. Crea un repositorio en GitHub y sube esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Capital Forte — primera versión"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/capital-forte-web.git
   git push -u origin main
   ```
2. Entra en https://vercel.com → **Add New… → Project** → importa el repo.
3. Framework Preset: **Other** (es estático, no hace falta build). Deja todo por defecto y pulsa **Deploy**.
4. Listo. Cada `git push` a `main` vuelve a desplegar automáticamente.

### Opción B — desde la terminal
```bash
npm i -g vercel
vercel          # primer deploy (preview)
vercel --prod   # a producción
```

## Dominio propio
En el proyecto de Vercel → **Settings → Domains** → añade `capitalforte.es` y sigue las instrucciones de DNS.

## Añadir un artículo nuevo al blog
1. Duplica `empezar-a-invertir-desde-cero.html` con un nombre nuevo (ej. `pension-publica-no-basta.html`).
2. Cambia el `<title>`, la `<meta name="description">`, el `<h1>`, el JSON-LD y el cuerpo.
3. Añade una tarjeta enlazando al nuevo archivo en `blog.html`.
4. `git add . && git commit -m "Nuevo artículo" && git push`.

## Notas
- Las cotizaciones **cripto** del ticker son reales (CoinGecko, sin clave). Los **índices** (IBEX, S&P 500, etc.) son valores de ejemplo: para datos reales se necesita una API de pago con clave.
- Sustituye `[Entidad]` en `para-empresas.html` por el nombre real de la entidad cuando lo tengas.
- Las fuentes (Spectral, etc.) se cargan desde Google Fonts; requieren conexión.
