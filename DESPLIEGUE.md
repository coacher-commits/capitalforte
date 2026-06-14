# Norte Capital — desplegar en Vercel

La foto founder.jpg YA esta incluida en assets/. No tienes que añadir nada.

## Con Git (recomendado: cada push despliega solo)
1. Crea un repo vacio en GitHub (norte-capital-web), sin README.
2. En esta carpeta, en una terminal:
   git init
   git add .
   git commit -m "Norte Capital — lanzamiento"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/norte-capital-web.git
   git push -u origin main
3. vercel.com -> Add New -> Project -> importa el repo -> Framework "Other" -> Deploy.

## Sin Git (rapido)
   npx vercel        (despliegue de prueba)
   npx vercel --prod (a produccion)

## Dominio
Vercel -> Settings -> Domains -> añade nortecapital.es y configura el DNS.
