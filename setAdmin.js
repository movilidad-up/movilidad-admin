import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

// Cargar el JSON de la clave privada
const serviceAccount = JSON.parse(
  readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);

// Inicializar la app usando los submódulos específicos de firebase-admin
initializeApp({
  credential: cert(serviceAccount),
});

async function setAdminClaim(email) {
  try {
    const auth = getAuth();
    const user = await auth.getUserByEmail(email);
    
    await auth.setCustomUserClaims(user.uid, { admin: true });

    console.log(`¡Éxito! El usuario ${email} (UID: ${user.uid}) ahora es administrador.`);
    process.exit(0);
  } catch (error) {
    console.error("Error al asignar el custom claim:", error);
    process.exit(1);
  }
}

// Reemplaza con tu correo
setAdminClaim("youradminemail@example.com");