# Norte Capital — desplegar en Vercel

ANTES DE NADA: copia tu foto `founder.jpg` dentro de la carpeta `assets/`
(la web la usa en la home, en para-empresas y en el blog).

## Opcion A — La rapida (sin Git): terminal
1. Instala Node.js si no lo tienes (nodejs.org).
2. Abre una terminal DENTRO de esta carpeta y ejecuta:

   npx vercel

   Te pedira iniciar sesion (se abre el navegador). Acepta los valores
   por defecto. Eso crea un despliegue de prueba.
3. Cuando lo veas bien:

   npx vercel --prod

## Opcion B — La buena (con Git): cada push despliega solo
1. Crea un repositorio en GitHub (ej. norte-capital-web) y sube esta carpeta:

   git init
   git add .
   git commit -m "Norte Capital — lanzamiento"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/norte-capital-web.git
   git push -u origin main

2. En vercel.com → Add New… → Project → importa el repo.
3. Framework Preset: "Other" (es estatico, sin build). Deploy y listo.

## Dominio
En el proyecto de Vercel → Settings → Domains → añade tu dominio
(nortecapital.es) y sigue las instrucciones de DNS de tu registrador.

## Comprobaciones tras el primer deploy
- El boton flotante de WhatsApp abre tu chat (648 004 588) con mensaje precargado.
- El favicon es la rosa de los vientos.
- El ticker arranca en "Datos ilustrativos" y pasa a "Cripto en directo" en segundos.
- Si tu email no es hola@nortecapital.es, avisa y lo cambiamos.
