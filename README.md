# FantaBike

Fanta-ciclismo para la liga: cada director deportivo elige un corredor por etapa (nunca el mismo dos veces) y la app calcula la general (tiempo − bonificaciones + penalizaciones), el maillot verde y el de lunares.

- **La Vuelta 2026**: resultados reales del Excel de la liga (hasta la etapa 19).
- **Tour de France 2027**: recorrido oficial, listo para elegir.
- Registro con email y contraseña, interfaz en italiano y español, tema claro y oscuro.

## Puesta en marcha (una sola vez, unos 10 minutos)

### 1. Supabase
1. Crea una cuenta en [supabase.com](https://supabase.com) y un proyecto nuevo (plan gratis).
2. Abre **SQL Editor → New query**, pega el contenido de [`supabase/schema.sql`](supabase/schema.sql) y toca **Run**.
3. En **Project Settings → API** copia la **Project URL** y la **anon public key** y pégalas en [`config.js`](config.js).
4. En **Authentication → URL Configuration** pon como **Site URL** `https://josechico94.github.io/FantaBike/` y agrégala también en **Redirect URLs**.

### 2. GitHub Pages
En el repo: **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**. En un par de minutos el sitio queda en `https://josechico94.github.io/FantaBike/`.

### 3. Hazte organizador
Regístrate en el sitio, confirma el email y después ejecuta en el SQL Editor de Supabase (con tu email):

```sql
update public.profiles set is_admin = true
  where id = (select id from auth.users where email = 'joseichico94@gmail.com');
```

Como organizador ves todas las elecciones y cargas los resultados de cada etapa desde la pestaña **Etapas**.

## Cómo funciona la seguridad

Las reglas están en la base de datos (RLS), no solo en la app:

- Solo usuarios registrados ven el sitio y los datos.
- Cada DS lo puede tomar una sola persona; se puede cambiar solo antes de hacer la primera elección.
- Cada uno escribe solo sus propias elecciones y solo antes del cierre (12:00 del día de la etapa).
- Las elecciones de los demás se ven recién después del cierre.
- El mismo corredor no se puede repetir en la misma carrera.
- Solo el organizador carga resultados.

## Estructura

```
index.html            la app (generada desde src/)
config.js             URL y clave pública de Supabase
data/vuelta2026.json  elecciones y resultados extraídos del Excel
supabase/schema.sql   tablas, reglas de seguridad y cierres de cada etapa
src/                  código fuente
  part_head.html      estilos y estructura
  part_data.js        etapas, equipos, textos IT/ES
  part_state.js       estado y formatos
  part_compute.js     cálculo de clasificaciones
  part_ill.js         ilustraciones SVG (maillots, escenas, altimetría)
  part_views.js       pantallas
  part_supa.js        registro, acceso y datos en Supabase
  part_shell.js       navegación
  part_db.js          reglas de juego compartidas (repetidos, cierres, resultados)
  build.py            regenera index.html
```

Para regenerar `index.html` después de un cambio: `cd src && python3 build.py`
