import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ----------------------------
// Configuración Supabase
// ----------------------------
const supabaseUrl = 'https://bjztoqqouyygsrvrffre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqenRvcXFvdXl5Z3NydnJmZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjA4NjEsImV4cCI6MjA3MTEzNjg2MX0.mUC-8oflihBXXO6InM0UHIFLWcCDNPuRUZ_OUwnoX3g';
const supabase = createClient(supabaseUrl, supabaseKey);

const audioListDiv = document.getElementById('audioList');

async function fetchRandomAudios() {
  try {
    // Obtener todos los audios activos
    const { data, error } = await supabase
      .from('audios')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error al obtener audios:', error);
      audioListDiv.textContent = 'Error al cargar audios.';
      return;
    }

    if (!data || data.length === 0) {
      audioListDiv.textContent = 'No hay audios disponibles.';
      return;
    }

    // Mezclar aleatoriamente y tomar los primeros 10
    const shuffled = data.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    // Mostrar cada audio
    selected.forEach(audio => {
      const { publicUrl } = supabase.storage.from('audios').getPublicUrl(audio.filename);

      const div = document.createElement('div');
      div.className = 'audio-item';
      div.innerHTML = `
        <audio controls src="${publicUrl}"></audio>
        <p>Usuario: ${audio.user_id} | Duración: ${Math.round(audio.duration)}s</p>
      `;
      audioListDiv.appendChild(div);
    });

  } catch (err) {
    console.error('Error general al cargar audios:', err);
    audioListDiv.textContent = 'Error al cargar audios.';
  }
}

// Ejecutar al cargar
fetchRandomAudios();
