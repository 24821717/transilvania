/*
 * TRANSILVANIA · CONFIGURACIÓN CENTRAL
 * ------------------------------------------------------------
 * Cambia aquí los enlaces externos. Todos los botones del sitio
 * los leen de este archivo.
 *
 * Un enlace vacío ("") se considera PENDIENTE:
 *  - ticketsUrl vacío → los botones "Comprar boletos" llevan a #boletos.
 *  - redes / legales vacíos → el enlace no se muestra en el footer.
 * Antes de publicar, todos deben tener destinos reales y verificados.
 */
window.TRANSILVANIA_CONFIG = {
  // Boletera oficial (TaquillaPlus)
  ticketsUrl: "https://eventos.taquillaplus.com.mx/eventperformances.asp?evt=858",

  // WhatsApp de atención
  whatsappUrl: "https://wa.me/522226614367",

  // Cómo llegar a la sede
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Hacienda+Talavera+de+los+%C3%81ngeles+Puebla",

  // Redes oficiales (vacías = no se muestran)
  social: {
    instagram: "https://www.instagram.com/transilvania.halloweenfest/",
    facebook: "https://www.facebook.com/Transilvania.Halloween",
    whatsapp: "https://wa.me/522226614367",
    tiktok: "",
    youtube: "",
    spotify: "",
  },

  // Legales y contacto (PENDIENTES)
  legal: {
    privacy: "",
    terms: "",
    contact: "https://wa.me/522226614367", // p. ej. "mailto:hola@transilvaniahalloween.com" o una URL
  },
};

/* Medición: empuja eventos a dataLayer (GTM) y gtag (GA4) si existen. */
window.trackEvent = function (name, params) {
  params = params || {};
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params));
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  } catch (e) {}
};
