import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

let mediaRecorder;
let audioChunks = [];

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.ondataavailable = e => {
    audioChunks.push(e.data);
  };
  
  mediaRecorder.start();
  console.log("Grabando...");
}

async function stopRecording(user_id = 'user123', question_id = 1) {
  return new Promise(resolve => {
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      audioChunks = [];
      
      // Nombre único para el archivo
      const filename = `audio_${Date.now()}.mp3`;
      
      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('audios')
        .upload(filename, audioBlob);

      if (error) console.error('Error subiendo audio:', error);
      else console.log('Audio subido:', data);

      // Guardar metadata
      const duration = audioBlob.size; // simple ejemplo
      const { data: dbData, error: dbError } = await supabase
        .from('audios')
        .insert([{
          filename,
          duration,
          user_id,
          question_id,
          is_active: true,
          location: 'desconocida',
          language: 'es'
        }]);
      
      if (dbError) console.error('Error guardando metadata:', dbError);
      else console.log('Metadata guardada:', dbData);
      
      resolve(audioBlob);
    };
    
    mediaRecorder.stop();
  });
}

