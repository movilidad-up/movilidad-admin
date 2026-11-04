# Movilidad UP · Panel de administración

Cliente SPA con React, TypeScript, Vite, Tailwind CSS, Firebase Web SDK, TanStack Query, React Router, Lucide y Recharts.

## Inicio

1. Instala Node.js LTS.
2. Ejecuta `npm install` en esta carpeta.
3. Copia `.env.example` a `.env.local` y completa las credenciales de tu proyecto Firebase.
4. Activa Email/Password en Firebase Authentication y concede el custom claim `admin: true` a las cuentas autorizadas.
5. Ejecuta `npm run dev`.

La lectura de asistencias usa una consulta `collectionGroup` sobre `records` y ordena por `attendanceSentDate` descendente. Firestore puede solicitar un índice para esa consulta. Las reglas de seguridad de Firestore deben proteger los datos; el guard de cliente no sustituye esas reglas.

El repositorio de beacons espera documentos en `/beacons/{MAC_EN_MAYUSCULAS}` con los campos `name`, `macAddress`, `routeName`, `busName` y `active`. Ajusta el mapeo si tu esquema existente difiere.

Las vistas Rutas y Configuración tienen navegación y estado de presentación inicial; aún no implementan CRUD porque el contexto no especifica el esquema Firestore de esas colecciones.
