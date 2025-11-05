// ========================================
// CONFIGURACIÓN DE SUPABASE
// ========================================
const SUPABASE_URL = 'https://vbcuppeweraucngxzoeq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiY3VwcGV3ZXJhdWNuZ3h6b2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODQ5NDcsImV4cCI6MjA3Nzg2MDk0N30.Hfcl-nLF8wElCWJ1etGL5pfDTQ2946gYUJ81mIyxEO4';

// ========================================
// FUNCIÓN PARA OBTENER FECHA/HORA EN URUGUAY
// ========================================
function getUruguayTimestamp() {
  const formatter = new Intl.DateTimeFormat('es-UY', {
    timeZone: 'America/Montevideo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(new Date());
  const data = {};
  
  parts.forEach(({ type, value }) => {
    data[type] = value;
  });
  
  const timestamp = `${data.year}-${data.month}-${data.day}T${data.hour}:${data.minute}:${data.second}.${Date.now().toString().slice(-3)}Z`;
  
  return timestamp;
}

// ========================================
// FUNCIÓN PARA ENVIAR DATOS A SUPABASE
// ========================================
async function sendToSupabase(table, data) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error('Error al enviar a Supabase:', response.statusText);
    }
  } catch (error) {
    console.error('Error de conexión con Supabase:', error);
  }
}

// ========================================
// FUNCIÓN PARA OBTENER DATOS DEL NAVEGADOR
// ========================================
function getBrowserData() {
  return {
    user_agent: navigator.userAgent,
    language: navigator.language,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    referrer: document.referrer || null,
    page_url: window.location.href,
    page_title: document.title
  };
}

// ========================================
// REGISTRAR VISITA A LA PÁGINA
// ========================================
async function trackPageVisit() {
  const visitData = {
    ...getBrowserData(),
    visited_at: getUruguayTimestamp(),
    session_id: getOrCreateSessionId()
  };
  
  await sendToSupabase('page_visits', visitData);
  
  // Mantener Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
}

// ========================================
// REGISTRAR CLICKS DE CONTACTO (WhatsApp/Facebook empresa)
// ========================================
async function trackContactClick(contactType, buttonLocation, targetUrl) {
  const clickData = {
    contact_type: contactType, // 'whatsapp' o 'facebook'
    button_location: buttonLocation,
    target_url: targetUrl,
    clicked_at: getUruguayTimestamp(),
    session_id: getOrCreateSessionId(),
    page_url: window.location.href,
    ...getBrowserData()
  };
  
  console.log('📞 Registrando click de CONTACTO:', clickData);
  await sendToSupabase('contact_clicks', clickData);
  
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'contact_click', {
      contact_type: contactType,
      button_location: buttonLocation
    });
  }
}

// ========================================
// REGISTRAR CLICKS DE COMPARTIR
// ========================================
async function trackShareClick(sharePlatform, buttonLocation) {
  const shareData = {
    share_platform: sharePlatform, // 'whatsapp', 'facebook', 'copy_link'
    button_location: buttonLocation,
    shared_at: getUruguayTimestamp(),
    session_id: getOrCreateSessionId(),
    page_url: window.location.href,
    ...getBrowserData()
  };
  
  console.log('🔄 Registrando COMPARTIR en:', shareData);
  await sendToSupabase('share_clicks', shareData);
  
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      method: sharePlatform,
      content_type: 'website'
    });
  }
}

// ========================================
// GESTIÓN DE SESSION ID
// ========================================
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// ========================================
// INTERCEPTAR CLICKS DE WHATSAPP DE CONTACTO
// ========================================
function setupWhatsAppContactTracking() {
  console.log('📱 Configurando tracking de WhatsApp CONTACTO...');
  
  document.addEventListener('click', async function(e) {
    // Solo enlaces de WhatsApp que NO sean de compartir
    const target = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (target && !target.closest('.share-buttons-header') && !target.hasAttribute('onclick')) {
      const href = target.getAttribute('href');
      let location = 'unknown';
      
      // Detectar ubicación del botón
      if (target.closest('.floating-buttons')) {
        location = 'floating_button';
      } else if (target.closest('footer')) {
        location = 'footer';
      } else if (target.closest('.cta-section')) {
        location = 'cta_section';
      } else if (target.closest('header')) {
        location = 'header_cta';
      } else if (target.closest('#contacto')) {
        location = 'contact_section';
      }
      
      console.log('✅ Click en WhatsApp CONTACTO detectado:', location);
      await trackContactClick('whatsapp', location, href);
    }
  });
}

// ========================================
// INTERCEPTAR CLICKS DE FACEBOOK DE CONTACTO
// ========================================
function setupFacebookContactTracking() {
  console.log('📘 Configurando tracking de Facebook CONTACTO...');
  
  document.addEventListener('click', async function(e) {
    // Solo enlaces de Facebook de la empresa (no de compartir)
    const target = e.target.closest('a[href*="facebook.com/share/1Ccj5wYhuK"]');
    if (target) {
      const href = target.getAttribute('href');
      let location = 'unknown';
      
      if (target.closest('.floating-buttons')) {
        location = 'floating_button';
      } else if (target.closest('footer')) {
        location = 'footer';
      } else if (target.closest('.footer-socials')) {
        location = 'footer_social';
      }
      
      console.log('✅ Click en Facebook CONTACTO detectado:', location);
      await trackContactClick('facebook', location, href);
    }
  });
}

// ========================================
// FUNCIONES DE COMPARTIR (llamadas desde HTML)
// ========================================
window.shareToWhatsApp = async function() {
  console.log('🔄 Compartir en WhatsApp');
  
  // Determinar ubicación
  const caller = event?.target?.closest('.share-buttons-header, footer');
  const location = caller?.closest('.share-buttons-header') ? 'header_share' : 
                   caller?.closest('footer') ? 'footer_share' : 'unknown';
  
  await trackShareClick('whatsapp', location);
  
  const siteUrl = "https://fullaguaservice.vercel.app/";
  const shareText = "Full Agua Service - Especialistas en Detección de Fugas, Goteras y Plomería Urgente en Uruguay. ¡Recomendado! Visita: ";
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + siteUrl)}`, '_blank');
};

window.shareToFacebook = async function() {
  console.log('🔄 Compartir en Facebook');
  
  const caller = event?.target?.closest('.share-buttons-header, footer');
  const location = caller?.closest('.share-buttons-header') ? 'header_share' : 
                   caller?.closest('footer') ? 'footer_share' : 'unknown';
  
  await trackShareClick('facebook', location);
  
  const siteUrl = "https://fullaguaservice.vercel.app/";
  const shareText = "Full Agua Service - Especialistas en Detección de Fugas, Goteras y Plomería Urgente en Uruguay. ¡Recomendado! Visita: ";
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
};

window.copyLink = async function() {
  console.log('🔄 Copiar enlace');
  
  const caller = event?.target?.closest('.share-buttons-header, footer');
  const location = caller?.closest('.share-buttons-header') ? 'header_share' : 
                   caller?.closest('footer') ? 'footer_share' : 'unknown';
  
  await trackShareClick('copy_link', location);
  
  const siteUrl = "https://fullaguaservice.vercel.app/";
  navigator.clipboard.writeText(siteUrl).then(() => {
    alert("¡Enlace copiado al portapapeles!");
  }).catch(err => {
    console.error('Error al copiar el enlace: ', err);
    alert("No se pudo copiar el enlace automáticamente. Por favor, cópialo manualmente: " + siteUrl);
  });
};

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Registrar visita a la página
  trackPageVisit();
  
  // Configurar tracking de botones de CONTACTO
  setupWhatsAppContactTracking();
  setupFacebookContactTracking();
  
  console.log('✅ Sistema de tracking inicializado (Visitas + Contacto + Compartir)');
});

// ========================================
// TRACKING DE EVENTOS ADICIONALES
// ========================================
window.trackCustomEvent = async function(eventName, eventData) {
  const customEventData = {
    event_name: eventName,
    event_data: JSON.stringify(eventData),
    occurred_at: getUruguayTimestamp(),
    session_id: getOrCreateSessionId(),
    page_url: window.location.href,
    ...getBrowserData()
  };
  
  await sendToSupabase('custom_events', customEventData);
  
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
};