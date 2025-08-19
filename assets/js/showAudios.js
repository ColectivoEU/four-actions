import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bjztoqqouyygsrvrffre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqenRvcXFvdXl5Z3NydnJmZnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjA4NjEsImV4cCI6MjA3MTEzNjg2MX0.mUC-8oflihBXXO6InM0UHIFLWcCDNPuRUZ_OUwnoX3g';
const supabase = createClient(supabaseUrl, supabaseKey);

const audioListDiv = document.getElementById('audioList');

async function fetchRandomAudios() {
  // Obtener todos los audios activos
  const { data: audios, error } = await supabase
    .from('audios')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: false });

  if (error) {
    audioListDiv.textContent = 'Error al cargar audios.';
    console.error(error);
    return;
  }

  // Mezclar y tomar los primeros 10
  const shuffled = audios.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);

  for (const audio of selected) {
    let audioURL;

    // Intentar obtener URL pública
    const { data: publicData } = supabase.storage
      .from('audios')
      .getPublicUrl(audio.filename);

    if (publicData?.publicUrl) {
      audioURL = publicData.publicUrl;
    } else {
      // Si el bucket es privado, crear URL firmada válida por 60 seg
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from('audios')
        .createSignedUrl(audio.filename, 60);

      if (signedError) {
        console.warn('No se pudo generar URL para:', audio.filename, signedError);
        continue; // saltar este audio
      }

      audioURL = signedData.signedUrl;
    }

    // Crear elemento de audio
    const div = document.createElement('div');
    div.className = 'audio-item';
    div.innerHTML = `
      <audio controls src="${audioURL}"></audio>
      <p>Usuario: ${audio.user_id} | Duración: ${Math.round(audio.duration)}s</p>
    `;
    audioListDiv.appendChild(div);
  }
}

// Ejecutar al cargar
fetchRandomAudios();
