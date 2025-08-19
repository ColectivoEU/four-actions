import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bjztoqqouyygsrvrffre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqenRvcXFvdXl5Z3NydnJmZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjA4NjEsImV4cCI6MjA3MTEzNjg2MX0.mUC-8oflihBXXO6InM0UHIFLWcCDNPuRUZ_OUwnoX3g';
const supabase = createClient(supabaseUrl, supabaseKey);

// ----------------------------
// Función central para traer audios
// ----------------------------
export async function fetchAudios({ filter = 'all', random = false, limit = 10 } = {}) {
  let query = supabase.from('audios').select('*').eq('is_active', true);

  // Aplicar filtros de tiempo
  const now = new Date();
  if (filter === 'day') {
    const lastWeek = new Date(now.setDate(now.getDate() - 1));
    query = query.gte('created_at', lastWeek.toISOString());
  } else if(filter === 'week') {
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    query = query.gte('created_at', lastWeek.toISOString());
  } else if (filter === 'month') {
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    query = query.gte('created_at', lastMonth.toISOString());
  } else if (filter === 'year') {
    const lastYear = new Date(now.setFullYear(now.getFullYear() - 1));
    query = query.gte('created_at', lastYear.toISOString());
  }

  query = query.order('id', { ascending: false });

  const { data: audios, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }

  // Mezclar si se requiere random
  let result = audios;
  if (random) {
    result = audios.sort(() => 0.5 - Math.random());
  }

  // Limitar cantidad
  return result.slice(0, limit);
}

// ----------------------------
// Función para renderizar un audio
// ----------------------------
export async function renderAudioList(audios, container) {
  container.innerHTML = '';
  for (const audio of audios) {
    let audioURL;

    const { data: publicData } = supabase.storage.from('audios').getPublicUrl(audio.filename);
    if (publicData?.publicUrl) {
      audioURL = publicData.publicUrl;
    } else {
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from('audios')
        .createSignedUrl(audio.filename, 60);
      if (signedError) {
        console.warn('No se pudo generar URL para:', audio.filename, signedError);
        continue;
      }
      audioURL = signedData.signedUrl;
    }

    const div = document.createElement('div');
    div.className = 'audio-item';
    div.innerHTML = `
      <audio controls src="${audioURL}"></audio>
      <p>Usuario: ${audio.user_id} | Duración: ${Math.round(audio.duration)}s</p>
    `;
    container.appendChild(div);
  }
}

// ----------------------------
// Función para Answers: 10 aleatorios
// ----------------------------
export async function showRandomAnswers(container) {
  const audios = await fetchAudios({ random: true, limit: 10 });
  await renderAudioList(audios, container);
}

// ----------------------------
// Función para More: lista filtrable
// ----------------------------
export async function showFilteredAudios(container, filter = 'all') {
  const audios = await fetchAudios({ filter, limit: 50 });
  await renderAudioList(audios, container);
}
