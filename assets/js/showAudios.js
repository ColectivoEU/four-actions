import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bjztoqqouyygsrvrffre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqenRvcXFvdXl5Z3NydnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjA4NjEsImV4cCI6MjA3MTEzNjg2MX0.mUC-8oflihBXXO6InM0UHIFLWcCDNPuRUZ_OUwnoX3g';
const supabase = createClient(supabaseUrl, supabaseKey);

window.addEventListener('DOMContentLoaded', async () => {
  const audioListDiv = document.getElementById('audioList');
  audioListDiv.innerHTML = 'Cargando audios...';

  // Obtener audios activos
  const { data, error } = await supabase
    .from('audios')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: false });

  if (error) {
    audioListDiv.textContent = 'Error al cargar audios.';
    console.error(error);
    return;
  }

  // Mezclar aleatoriamente y tomar los primeros 10
  const shuffled = data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);

  audioListDiv.innerHTML = ''; // limpiar mensaje de carga

  selected.forEach(audio => {
    const { data: publicUrlData } = supabase.storage.from('audios').getPublicUrl(audio.filename);
    const audioURL = publicUrlData.publicUrl;

    const div = document.createElement('div');
    div.className = 'audio-item';
    div.innerHTML = `
      <audio controls src="${audioURL}"></audio>
      <p>Usuario: ${audio.user_id} | Duración: ${Math.round(audio.duration)}s</p>
    `;
    audioListDiv.appendChild(div);
  });
});
