export default {
  async fetch(request) {
    // --- CONFIGURACIÓN DE SEGURIDAD ---
    // 1. Define tu dominio autorizado estrictamente (WordPress)
    const DOMINIO_PERMITIDO = "https://tu-dominio-real.com"; // <-- ¡CAMBIA ESTO!

    const origin = request.headers.get("Origin");

    const corsHeaders = {
      "Access-Control-Allow-Origin": DOMINIO_PERMITIDO,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Manejar Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      if (origin !== DOMINIO_PERMITIDO) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { headers: corsHeaders });
    }

    // 3. Validación de seguridad principal
    if (origin !== DOMINIO_PERMITIDO) {
      return new Response(JSON.stringify({ error: "Acceso denegado" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }


    // --- MOTOR DE CÁLCULO / SIMULACIÓN ---
    if (request.method === "POST") {
      try {
        // Generamos valores base aleatorios pero realistas para una costa
        
        // 1. Presión Atmosférica (hPa): Normal está alrededor de 1013.
        // Simulamos entre 990 (borrasca) y 1030 (anticiclón).
        const presion = 990 + Math.random() * (1030 - 990);

        // 2. Temperatura del Aire (°C): Entre 10°C y 35°C
        const temperatura = 10 + Math.random() * (35 - 10);

        // 3. Altura de las Olas (m): Influenciada ligeramente por la presión.
        // Si la presión es baja (mal tiempo), las olas tienden a ser más altas.
        let factorTormenta = (1030 - presion) / 40; // Da un valor entre 0 y 1
        const olasBase = 0.2 + Math.random() * 2.0; // Olas normales entre 0.2m y 2.2m
        const olasTotales = olasBase + (factorTormenta * 1.5); // Añadimos hasta 1.5m extra si hay baja presión

        // Estructuramos la respuesta JSON
        const datosSensores = {
          temperatura: temperatura.toFixed(1), // 1 decimal (ej: 24.5)
          presion: Math.round(presion),         // Número entero (ej: 1012)
          olas: olasTotales.toFixed(2),        // 2 decimales (ej: 1.25)
          timestamp: new Date().toISOString() // Hora de la medición
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
