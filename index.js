export default {
  async fetch(request) {
    // 1. CORS abierto: Permite conexión desde cualquier dominio
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Manejar la verificación automática del navegador (Preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 3. Motor de simulación principal
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
