export default {
  async fetch(request) {
    // 1. Define tu dominio autorizado estrictamente
    const DOMINIO_PERMITIDO = "https://app.byvoxel.com"; // <-- CAMBIA ESTO

    // 2. Leer desde dónde viene la petición
    const origin = request.headers.get("Origin");

    // 3. Configurar CORS solo para tu dominio
    const corsHeaders = {
      "Access-Control-Allow-Origin": DOMINIO_PERMITIDO,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 4. Responder a la verificación del navegador (Preflight)
    if (request.method === "OPTIONS") {
      // Si el origen no es tu web, no devolvemos los headers CORS
      if (origin !== DOMINIO_PERMITIDO) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { headers: corsHeaders });
    }

    // 5. Validación de seguridad principal para la petición POST
    if (origin !== DOMINIO_PERMITIDO) {
      return new Response(JSON.stringify({ error: "Acceso denegado." }), {
        status: 403,
        headers: { "Content-Type": "application/json" } // Sin CORS headers aquí para bloquear lectura
      });
    }

    // 6. Procesar el cálculo si pasó la seguridad
    if (request.method === "POST") {
      try {
        const { largo, ancho, grosor } = await request.json();
        const volumen = largo * ancho * grosor;

        return new Response(JSON.stringify({ volumen: volumen.toFixed(2) }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Error procesando datos" }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        });
      }
    }

    return new Response("Método no permitido", { headers: corsHeaders, status: 405 });
  }
};
