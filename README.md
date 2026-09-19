# Wepay

Antes de ejecutar la app, crea un archivo `.env.local` en la raíz del proyecto si no existe. Sin esas variables, el login con MSAL y las llamadas autenticadas no van a funcionar.

Variables necesarias:

```bash
VITE_SPA_CLIENT_ID=...
VITE_ENTRA_TENANT_ID=...
VITE_API_CLIENT_ID=...
VITE_API_BASE_URL=...
VITE_BFF_BASE_URL=...
```

## Qué cambió hoy

- La app dejó de ser una demo genérica y ahora presenta una landing oscura y profesional para Wepay, una tienda gamer.
- Se agregó `react-router-dom` para manejar rutas públicas y protegidas.
- La ruta pública `/` muestra el inicio de sesión con MSAL.
- La ruta protegida `/perfil` usa un guard de ruta y bloquea el acceso si no hay cuenta activa.
- Se creó un cliente centralizado de API en `src/apiClient.ts` que reutiliza `obtenerToken` y agrega el header `Authorization: Bearer`.
- La respuesta de `/api/perfil` ahora se guarda en estado y se usa para mostrar u ocultar UI según el rol.
- El rol puede ser `ADMIN` o `USER`.
- Si el rol es `ADMIN`, se muestra el botón exclusivo de administración.
- Si el rol es `USER`, ese bloque se oculta y se muestra un mensaje contextual.
- Los productos de ejemplo se separaron en `src/data/productos.json` para poder reemplazarlos después por una API real.

## Instalación

```bash
npm install
```

Si todavía no agregaste la dependencia de router en tu entorno actual, instala también:

```bash
npm install react-router-dom
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Estructura relevante

- `src/main.tsx`: monta React dentro de `BrowserRouter` y `MsalProvider`.
- `src/App.tsx`: define las rutas `/` y `/perfil`.
- `src/apiClient.ts`: cliente de fetch autenticado para endpoints protegidos.
- `src/components/RutaProtegida.tsx`: protege la ruta privada.
- `src/data/productos.json`: catálogo de ejemplo de la landing.
- `src/authConfig.ts`: configuración de MSAL y scopes del token.

## Flujo actual

1. La página principal muestra la marca Wepay y el botón de iniciar sesión.
2. MSAL abre el login popup.
3. Si hay sesión, el usuario puede ir a `/perfil`.
4. En `/perfil`, la app consulta `/api/perfil` con token.
5. La respuesta se guarda en estado y se usa para mostrar contenido según el rol.

## Nota sobre el backend

La app espera que `/api/perfil` devuelva un JSON con un campo `rol`.

Ejemplo:

```json
{
  "nombre": "Juan Perez",
  "email": "juan@correo.com",
  "rol": "ADMIN"
}
```

Si el backend devuelve `USER`, la vista sigue funcionando, pero sin el bloque administrativo.
