# Tuerca y Perno RC - Frontend Web

Sistema web e infraestructura de autenticación con **Next.js (App Router)** y **Tailwind CSS** para la ferretería y corralón **"Tuerca y Perno RC"**.

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router, estructura `src/app`)
- **Estilos**: Tailwind CSS con paleta industrial temática
- **Formularios & Validación**: React Hook Form + Zod (`@hookform/resolvers`)
- **Estado Global**: Context API (`AuthContext` y `AuthProvider`)
- **Persistencia de Sesión**: Cookies vía `js-cookie` (compatible con `middleware.ts` en servidor/Edge)
- **Seguridad**: Next.js Middleware para protección de rutas privadas (`/admin/*`)

---

## 🚀 Instalación y Puesta en Marcha

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno** (opcional):
   Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Ajusta `NEXT_PUBLIC_API_URL` con la dirección de tu backend Django si ya está corriendo (por defecto: `http://127.0.0.1:8000`).

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔐 Infraestructura de Autenticación

### 1. Integración con Django SimpleJWT
- **Endpoint**: `POST /api/token/`
- **Payload**:
  ```json
  {
    "username": "usuario",
    "password": "password123"
  }
  ```
- **Respuesta 200**:
  ```json
  {
    "access": "eyJ...",
    "refresh": "eyJ..."
  }
  ```
- **Roles Soportados**: `ADMIN`, `VENDEDOR`, `DEPOSITO`.

### 2. Modo Simulado Inteligente (Offline/Dev)
Si el backend Django no está encendido, el frontend activa automáticamente un fallback simulado que emite un token JWT válido con roles según el nombre de usuario:
- Usuario: `admin` (Contraseña: cualquier texto ej. `admin123`) -> Rol **ADMIN**
- Usuario: `vendedor` (Contraseña: cualquier texto ej. `vendedor123`) -> Rol **VENDEDOR**
- Usuario: `deposito` (Contraseña: cualquier texto ej. `deposito123`) -> Rol **DEPOSITO**

### 3. Protección de Rutas (`middleware.ts`)
Toda petición a `/admin/*` es evaluada por el middleware de Next.js antes de llegar a la página. Si no existe la cookie `auth_token` o el token ha expirado, redirige a `/login?callbackUrl=...`.

---

## 📁 Estructura del Proyecto

```text
├── middleware.ts                 # Middleware para protección de rutas privadas
├── src/
│   ├── app/
│   │   ├── globals.css           # Estilos base y directivas Tailwind
│   │   ├── layout.tsx            # Root layout con AuthProvider y Navbar
│   │   ├── page.tsx              # Landing Page institucional
│   │   ├── login/
│   │   │   └── page.tsx          # Pantalla de Login con React Hook Form + Zod
│   │   └── admin/
│   │       └── page.tsx          # Panel de administración protegido
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx        # Barra de navegación con usuario y rol
│   │   └── ui/
│   │       ├── Button.tsx        # Botón reutilizable con isLoading y variantes
│   │       └── InputField.tsx    # Input con soporte React Hook Form y errores Zod
│   ├── context/
│   │   └── AuthContext.tsx       # Context API y Hook useAuth()
│   ├── lib/
│   │   ├── auth-service.ts       # Cliente API para /api/token/ y fallback
│   │   ├── jwt.ts                # Decodificador seguro y extractor de roles
│   │   └── validations/
│   │       └── auth.ts           # Esquemas Zod (loginSchema)
│   └── types/
│       └── auth.ts               # Tipado TypeScript (User, Role, Token)
```
