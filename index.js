export default {
  async fetch(request) {
    // --- CONFIGURACIÓN DE SEGURIDAD ---
    // 1. Cambia esto por el dominio real donde está tu WordPress (sin barra al final)
    const DOMINIO_PERMITIDO = "https://testapp.byarqin.com"; 

    const origin = request.headers.get("Origin");

    const corsHeaders = {
      "Access-Control-Allow-Origin": DOMINIO_PERMITIDO,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Manejar la verificación del navegador (Preflight - OPTIONS)
    if (request.method === "OPTIONS") {
      if (origin !== DOMINIO_PERMITIDO) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { headers: corsHeaders });
    }

    // 3. Bloquear intentos de acceso desde otros lugares
    if (origin !== DOMINIO_PERMITIDO) {
      return new Response(JSON.stringify({ error: "Acceso denegado" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- MOTOR DE SIMULACIÓN ---
    if (request.method === "POST") {
      try {
        const presion = 990 + Math.random() * (1030 - 990);
        const temperatura = 10 + Math.random() * (35 - 10);
        
        let factorTormenta = (1030 - presion) / 40; 
        const olasBase = 0.2 + Math.random() * 2.0; 
        const olasTotales = olasBase + (factorTormenta * 1.5); 

        const datosSensores = {
          temperatura: temperatura.toFixed(1), 
          presion: Math.round(presion),         
          olas: olasTotales.toFixed(2),        
          timestamp: new Date().toISOString() 
        };

        return new Response(JSON.stringify(datosSensores), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: "Error simulando datos" }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        });
      }
    }

    return new Response("Método no permitido", { headers: corsHeaders, status: 405 });
  }
};
