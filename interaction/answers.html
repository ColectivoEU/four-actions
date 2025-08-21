// assets/js/showAudios.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bjztoqqouyygsrvrffre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqenRvcXFvdXl5Z3NydnJmZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjA4NjEsImV4cCI6MjA3MTEzNjg2MX0.mUC-8oflihBXXO6InM0UHIFLWcCDNPuRUZ_OUwnoX3g';
const supabase = createClient(supabaseUrl, supabaseKey);

// Utilidad: esperar metadata de un <audio> antes de mostrarlo
function waitForMetadata(audioEl, timeoutMs = 4000) {
  return new Promise((resolve) => {
    let done = false;
    const clean = () => {
      audioEl.removeEventListener('loadedmetadata', onMeta);
      audioEl.removeEventListener('durationchange', onMeta);
    };
    const onMeta = () => {
      if (done) return;
      done = true;
      // asegúrate que la barra arranque en 0
      try { audioEl.currentTime = 0; } catch (_) {}
      clean();
      resolve();
    };
    const t = setTimeout(() => {
      if (done) return;
      done = true;
      clean();
      resolve(); // fallback si el navegador no dispara a tiempo
    }, timeoutMs);

    audioEl.addEventListener('loadedmetadata', () => { clearTimeout(t); onMeta(); }, { once: true });
    audioEl.addEventListener('durationchange', () => { clearTimeout(t); onMeta(); }, { once: true });

    // forzar carga de metadata
    try { audioEl.load(); } catch (_) {}
  });
}

// Obtener URL reproducible (pública o firmada)
async function getPlayableUrl(filename) {
  // Primero intenta pública
  const pub = supabase.storage.from('audios').getPublicUrl(filename);
  if (pub?.data?.publicUrl) return pub.data.publicUrl;

  // Si el bucket es privado, usa URL firmada
  const { data, error } = await supabase.storage.from('audios').createSignedUrl(filename, 60);
  if (error) throw error;
  return data.signedUrl;
}

// Render de una tarjeta de audio, esperando metadata antes de insertarla
async function renderAudioItem(container, audioRow) {
  let url;
  try {
    url = await getPlayableUrl(audioRow.filename);
  } catch (e) {
    console.warn('No se pudo obtener URL para', audioRow.filename, e);
    return;
  }

  // Crea el contenedor pero NO lo insertes aún
  const wrapper = document.createElement('div');
  wrapper.className = 'audio-item';

  const audio = document.createElement('audio');
  audio.setAttribute('controls', '');
  audio.setAttribute('preload', 'metadata');
  audio.setAttribute('playsinline', ''); // iOS
  audio.src = url;

  // Espera metadata para que la barra y 0:00 se vean bien
  await waitForMetadata(audio);

  wrapper.appendChild(audio);
  container.appendChild(wrapper);
}

// API pública: muestra 10 audios aleatorios (como antes), con fix de metadata
export async function showRandomAnswers(container /*, opts = {} */) {
  const { data: audios, error } = await supabase
    .from('audios')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: false });

  if (error) throw error;

  // Mezclar y tomar 10
  const shuffled = [...audios].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);

  // Limpia contenedor
  container.innerHTML = '';

  // Render secuencial (más estable para móviles)
  for (const row of selected) {
    await renderAudioItem(container, row);
  }
}

/* Opcional: si usas filtros en /more.html puedes exponer otra función aquí, 
   reutilizando renderAudioItem() para que los audios siempre carguen su metadata
   antes de mostrarse.
*/
