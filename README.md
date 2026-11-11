# Tuerca y Perno RC

**Sistema web de gestión para ferretería industrial y corralón de materiales** — Frontend desarrollado con **Next.js (App Router)**, **TypeScript** y **Tailwind CSS**, conectado a una API REST en **Django REST Framework**.

---

## 📋 Descripción y temática

**Tuerca y Perno RC** es una ferretería industrial y corralón de materiales de construcción que atiende a particulares, talleres metalúrgicos y empresas constructoras. El sistema digitaliza su operación diaria:

- **Catálogo público** de productos (herramientas, bulonería, sanitarios, electricidad, materiales de obra) con búsqueda, filtro por categoría y detalle con stock.
- **Panel de administración** protegido por login, con acceso según el rol del usuario (**Administrador**, **Vendedor** y **Depósito**).
- **Gestión de productos**: alta, edición, baja y control de stock.
- **Gestión de ventas**: resumen de las ventas del día, historial completo y finalización de ventas pendientes.

El frontend puede funcionar **conectado al backend Django** o en **modo simulado (mocks)**, con datos en memoria, para probar toda la interfaz sin levantar el servidor.

---

## 👥 Integrantes

| Integrante | Nombre y apellido | Módulo a cargo |
| :---: | :--- | :--- |
| 1 | Leandro Odetto | Autenticación (AuthContext, login con Zod, middleware), UI base y Navbar |
| 2 | Pablo Abataneo | Catálogo público: listado, filtros, búsqueda y vista de producto |
| 3 | Ulises Cabrera | Gestión de productos (CRUD), DataTable, ConfirmModal e integración con la API |
| 4 | Franco Nicolas Bressan Nadal | Layout administrativo, módulo de ventas, BadgeStatus, testing unitario y documentación |

---

## 🔗 Enlaces del proyecto

| Recurso | Enlace |
| :--- | :--- |
| 🚀 **Deploy en Vercel** | `[PEGAR ENLACE DE VERCEL]` |
| 📌 **Tablero Kanban** | `[PEGAR ENLACE DEL KANBAN]` |
| 🐍 **Repositorio backend (Django)** | `[PEGAR ENLACE DEL REPOSITORIO DE DJANGO]` |
| 💻 **Repositorio frontend** | https://github.com/leandroitec/front_tuerca_y_perno_RC |

---

## 🛠️ Stack tecnológico

| Área | Tecnología |
| :--- | :--- |
| Framework | Next.js 15 (App Router, estructura `src/app`) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 3 |
| Formularios y validación | React Hook Form + Zod (`@hookform/resolvers`) |
| Estado global | Context API (`AuthContext`) |
| Sesión | JWT de Django SimpleJWT guardado en cookies (`js-cookie`) |
| Protección de rutas | Next.js Middleware (`/admin/*`) |
| Íconos | lucide-react |
| Testing | Vitest + Testing Library + jsdom |

---

## 🚀 Ejecución local

### Requisitos previos

- **Node.js 18.18 o superior** (recomendado Node 20 o 22) y **npm**.
- *(Opcional)* El backend Django corriendo en `http://127.0.0.1:8000` para usar datos reales.

### 1. Clonar el repositorio

```bash
git clone https://github.com/leandroitec/front_tuerca_y_perno_RC.git
cd front_tuerca_y_perno_RC
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno (`.env.local`)

Copiar el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Y ajustar los valores en `.env.local`:

```env
# URL base del backend Django REST Framework
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Productos y login: true = datos simulados | false = backend Django
NEXT_PUBLIC_USE_PRODUCT_MOCKS=true

# Ventas: true (o sin definir) = datos simulados | false = backend Django
NEXT_PUBLIC_USE_VENTA_MOCKS=true
```

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL base de la API de Django | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_USE_PRODUCT_MOCKS` | Usa datos simulados para productos y login | `false` |
| `NEXT_PUBLIC_USE_VENTA_MOCKS` | Usa datos simulados para ventas | `true` |

> ⚠️ Las variables `NEXT_PUBLIC_*` se leen al iniciar la aplicación: después de modificarlas hay que reiniciar `npm run dev`.

> 🔄 Para conectar el frontend al backend Django en lugar de los datos simulados, ver la sección [Pasar de datos simulados (mocks) al backend Django](#-pasar-de-datos-simulados-mocks-al-backend-django).

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### 🔑 Usuarios de prueba

Con los mocks activados (`NEXT_PUBLIC_USE_PRODUCT_MOCKS=true`) el login es simulado:

| Usuario | Contraseña | Rol | Acceso en el panel |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | Administrador | Todos los módulos |
| `vendedor` | `vendedor123` | Vendedor | Panel, Catálogo y Ventas |
| `deposito` | `deposito123` | Depósito | Panel, Catálogo y Productos |

Con el backend Django, usar los usuarios creados con `python manage.py poblar_datos` (`admin` / `admin123`, `vendedor` / `vendedor123`).

---

## 🧪 Tests

Los tests unitarios están en `src/__tests__/` y se ejecutan con **Vitest**.

```bash
# Ejecutar todos los tests una vez
npm run test

# Modo vigilancia: vuelve a ejecutar los tests al guardar cambios
npm run test:watch
```

| Archivo | Qué verifica |
| :--- | :--- |
| `loginSchema.test.ts` | Esquema Zod del login: credenciales válidas, campos vacíos, sólo espacios, tipos incorrectos e integración con React Hook Form |
| `productoSchema.test.ts` | Esquema Zod de productos: precio negativo o cero y campos vacíos |
| `BadgeStatus.test.tsx` | Renderizado del componente: texto, colores semánticos (verde, amarillo, rojo, gris) y propiedades |
| `formatCurrency.test.ts` | Formato de moneda argentino: `formatCurrency(1250)` → `$ 1.250,00` |

Resultado esperado:

```text
 Test Files  4 passed (4)
      Tests  42 passed (42)
```

---

## 📜 Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Genera la versión de producción |
| `npm run start` | Sirve la versión de producción (después de `build`) |
| `npm run lint` | Analiza el código con ESLint |
| `npm run test` | Ejecuta los tests unitarios con Vitest |
| `npm run test:watch` | Ejecuta los tests en modo vigilancia |

---

## 🗺️ Rutas principales

| Ruta | Acceso | Descripción |
| :--- | :--- | :--- |
| `/` | Público | Página institucional |
| `/catalogo` | Público | Catálogo con búsqueda, filtro por categoría y paginación |
| `/catalogo/[id]` | Público | Detalle de producto con stock |
| `/login` | Público | Inicio de sesión |
| `/admin` | Autenticado | Panel de control |
| `/admin/productos` | ADMIN, DEPOSITO | Listado, alta, edición y baja de productos |
| `/admin/ventas` | ADMIN, VENDEDOR | Resumen del día, historial y finalización de ventas |

Las rutas `/admin/*` están protegidas por `middleware.ts` (redirige a `/login` si no hay sesión) y por el layout del panel, que bloquea las secciones según el rol.

---

## 🔌 Integración con el backend

| Método | Endpoint | Uso en el frontend |
| :--- | :--- | :--- |
| `POST` | `/api/auth/token/` | Login (JWT) |
| `GET` | `/api/productos/` | Catálogo y gestión de productos |
| `POST` / `PUT` / `DELETE` | `/api/productos/{id}/` | Alta, edición y baja de productos |
| `GET` | `/api/ventas/` | Historial de ventas |
| `GET` | `/api/ventas/ventas-del-dia/` | Resumen de ventas del día |
| `POST` | `/api/ventas/{id}/finalizar-venta/` | Finalizar una venta pendiente |

Todas las peticiones autenticadas envían el header `Authorization: Bearer <token>`.

---

## 🔄 Pasar de datos simulados (mocks) al backend Django

Por defecto el proyecto puede trabajar con **datos simulados**, para probar la interfaz sin el backend. Para usar los **datos reales** de Django hay que cambiar la configuración en 4 pasos.

### ¿Qué controla cada variable?

| Variable | `true` (mocks) | `false` (backend Django) |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_USE_PRODUCT_MOCKS` | Login simulado y productos guardados en el navegador (`localStorage`) | Login con `POST /api/auth/token/` y productos desde `/api/productos/` |
| `NEXT_PUBLIC_USE_VENTA_MOCKS` | Ventas de ejemplo en memoria (se reinician al recargar) | Ventas desde `/api/ventas/` |

### Paso 1 — Levantar el backend

En la carpeta del repositorio de Django:

```bash
source .venv/bin/activate
python manage.py migrate
python manage.py poblar_datos
python manage.py runserver
```

Verificar que responda en [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/) (documentación Swagger).

> El comando `poblar_datos` crea usuarios, categorías, productos y clientes, pero **no crea ventas**: se pueden cargar desde el panel de Django en [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).

### Paso 2 — Cambiar el `.env.local`

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_PRODUCT_MOCKS=false
NEXT_PUBLIC_USE_VENTA_MOCKS=false
```

> Las dos variables de mocks son independientes: por ejemplo, se pueden usar productos reales (`false`) y ventas simuladas (`true`).

### Paso 3 — Reiniciar el servidor de desarrollo

Las variables `NEXT_PUBLIC_*` sólo se leen al arrancar. Cortar el servidor con `Ctrl + C` y volver a iniciarlo:

```bash
npm run dev
```

### Paso 4 — Volver a iniciar sesión

El token del login simulado no es válido para Django (y viceversa). Cerrar sesión, o borrar la cookie `auth_token` desde las herramientas del navegador (F12 → Application → Cookies), e ingresar con un usuario del backend: `admin` / `admin123` o `vendedor` / `vendedor123`.

### ✅ Cómo saber que se están usando datos reales

- En **Gestión de Ventas** desaparece la etiqueta gris **"Datos simulados"**.
- En la pestaña **Network** de las herramientas del navegador (F12) aparecen peticiones a `http://127.0.0.1:8000/api/...`.
- Los productos y ventas que se ven son los cargados en Django.

### ⚠️ Limitaciones conocidas con el backend real

- **Roles:** el token de Django no incluye el rol del usuario, por lo que el frontend toma a todos como **Vendedor** (no se accede a Gestión de Productos). Se resuelve agregando `rol` al token en el backend.
- **Catálogo público:** el backend exige iniciar sesión para listar productos, y el catálogo los pide sin token, por lo que muestra un error.
- **Paginación:** el backend devuelve las ventas de a 10; el historial muestra la primera página.

### ↩️ Volver a los datos simulados

Poner las dos variables en `true`, reiniciar `npm run dev` y volver a iniciar sesión.

---

## 📁 Estructura del proyecto

```text
├── docs/screenshots/              # Capturas usadas en este README
├── middleware.ts                  # Protección de rutas /admin/*
├── vitest.config.ts               # Configuración de Vitest
├── vitest.setup.ts                # Setup de Testing Library
└── src/
    ├── __tests__/                 # Tests unitarios
    ├── app/
    │   ├── layout.tsx             # Layout raíz (AuthProvider, Navbar, footer)
    │   ├── page.tsx               # Página institucional
    │   ├── login/                 # Inicio de sesión
    │   ├── catalogo/              # Catálogo público y detalle de producto
    │   └── admin/
    │       ├── layout.tsx         # Layout anidado del panel (Sidebar + control de acceso)
    │       ├── page.tsx           # Panel de control
    │       ├── productos/         # Gestión de productos (listado, nuevo, editar)
    │       └── ventas/            # Gestión de ventas
    ├── components/
    │   ├── forms/                 # ProductForm
    │   ├── layout/                # Navbar, AdminShell, AdminSidebar
    │   └── ui/                    # Button, InputField, DataTable, ConfirmModal,
    │                              # FilterBar, ProductCard, BadgeStatus
    ├── context/                   # AuthContext
    ├── lib/
    │   ├── mocks/                 # Datos simulados (productos y ventas)
    │   ├── services/              # Clientes de la API (productos y ventas)
    │   ├── validations/           # Esquemas Zod (login y producto)
    │   ├── utils.ts               # Utilidades generales (formatCurrency)
    │   └── ...                    # auth-service, jwt, roles, navegación, ventas
    └── types/                     # Tipos TypeScript (auth, producto, venta)
```

---

## 📸 Capturas de pantalla

### Página principal

![Página principal](docs/screenshots/inicio.png)

### Inicio de sesión

![Inicio de sesión](docs/screenshots/login.png)

### Catálogo público

`[PEGAR CAPTURA: catálogo]`

### Panel de administración

![Panel de administración](docs/screenshots/panel.png)

### Gestión de productos

![Gestión de productos](docs/screenshots/productos.png)

### Gestión de ventas

![Gestión de ventas](docs/screenshots/ventas.png)

### Tests en verde

![Tests en verde](docs/screenshots/tests.png)

---

© Tuerca y Perno RC — Ferretería & Corralón. Proyecto académico.
