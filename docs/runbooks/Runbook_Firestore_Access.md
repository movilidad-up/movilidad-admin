# Runbook de Contingencia: Fallo de Conectividad o Permisos en Cloud Firestore

**Código de Alerta:** `ALERT_FIRESTORE_ACCESS_FAILED`  
**Componente Afectado:** Capa de Datos / Repositorios Frontend (`AttendanceRepository`, `BeaconRepository`)  
**Severidad:** Crítica (P1)  
**Objetivo de Confiabilidad (SLO):** Mantenimiento de disponibilidad de datos ≥ 99.0%  
**Responsable Operativo:** Líder del Equipo / Desarrollador Único (Arquitectura Lean)

---

## 1. Descripción del Incidente
Este procedimiento se activa cuando la SPA administrativamente registra un incremento anómalo de excepciones `permission-denied`, `unavailable` o `unauthenticated` provenientes del SDK de Firebase, bloqueando la lectura/escritura de asistencias o dispositivos BLE en el panel de administración.

---

## 2. Diagnóstico Rápido (Triaje)

1. **Verificar el estado del servicio global de Google Cloud / Firebase:**
   - Consultar la consola de estado: `https://status.firebase.google.com/`
   - Si Google Cloud / Firestore reporta una caída global (*outage*), notificar al equipo y esperar la resolución del proveedor (no modificar código local).

2. **Inspeccionar la consola del navegador o registros de telemetría:**
   - Abrir las DevTools (`F12`) -> Consola.
   - Buscar errores etiquetados por `firestoreError.ts`.
   - **Caso A:** Mensaje incluye `permission-denied`. (Fallo en Reglas de Seguridad o Custom Claims).
   - **Caso B:** Mensaje incluye `failed-precondition` con un enlace web. (Índice compuesto faltante en Firestore).
   - **Caso C:** Mensaje incluye `unavailable`. (Problema de red local o DNS).

---

## 3. Pasos de Mitigación y Solución

### Caso A: Error de Permisos (`permission-denied`)

1. **Verificar asignación de Custom Claims del Administrador:**
   - Ejecutar el script local de gestión de permisos con las credenciales de servicio:
     ```bash
     node setAdmin.js
     ```
   - Confirmar en la salida de consola que el usuario objetivo tiene asignado `{ admin: true }`.

2. **Revisar y desplegar Reglas de Seguridad de Firestore:**
   - Validar que las reglas permitan la lectura del grupo de colecciones `records`:
     ```javascript
     match /{path=**}/records/{recordId} {
       allow read: if request.auth != null && request.auth.token.admin == true;
     }
     ```
   - Desplegar las reglas mediante el CLI de Firebase:
     ```bash
     firebase deploy --only firestore:rules
     ```

---

### Caso B: Índice Faltante (`failed-precondition`)

1. Hacer clic directo en la URL proporcionada en el mensaje de error del componente `<FirestoreErrorNotice />`.
2. Autorizar la creación del índice compuesto requerido en la consola de Firebase.
3. Esperar a que la consola cambie el estado del índice de `Building` a `Enabled` (aproximadamente 3 a 5 minutos).

---

### Caso C: Caída de Red o Inestabilidad de Cliente (`unavailable`)

1. Forzar una recarga limpia del bundle de la SPA en el navegador (`Ctrl + F5` / `Cmd + Shift + R`).
2. Verificar que las variables de entorno de Firebase (`VITE_FIREBASE_API_KEY`, etc.) estén correctamente inyectadas en el entorno de despliegue en Vercel.

---

## 4. Verificación de Restablecimiento del Servicio

1. Iniciar sesión en el panel de administración (`/login`).
2. Navegar a la pestaña de **Registros** (`/registros`) y verificar que la tabla de asistencias cargue los documentos sin desplegar alertas de error.
3. Verificar en la pestaña de **Beacons** (`/beacons`) la capacidad de listar los dispositivos.
4. Confirmar que las métricas de telemetría retomen la tasa normal de peticiones exitosas (HTTP 200 / Firestore OK).

---

## 5. Acciones Post-Incidente

- En caso de haber modificado reglas de seguridad, registrar el cambio en un commit y ejecutar la suite de pruebas locales para prevenir regresiones.
- Registrar el tiempo total de indisponibilidad para descontarlo del **Error Budget** mensual asignado (presupuesto del 1.0%).
