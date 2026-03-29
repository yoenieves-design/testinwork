export default {
  async fetch(request) {
    // Configuración de CORS para permitir peticiones desde WordPress
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Luego lo restringiremos a tu dominio de WordPress
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Respuesta a la petición de verificación (Preflight) del navegador
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

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