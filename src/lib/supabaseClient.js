import { createClient } from '@supabase/supabase-js';

// 1. Imprimir variables de entorno para depuración
console.log('--- DEPURACIÓN SUPABASE ---');
console.log('Todas las variables:', import.meta.env);
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('---------------------------');

// 2. Obtener URL y Key (usando prefijo VITE_ porque estamos en Vite, no Next.js)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 3. Validación explícita
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR CRÍTICO: Faltan variables de entorno de Supabase.');
    console.error('Asegúrate de tener un archivo .env.local en la raíz del proyecto con las claves VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
    throw new Error('supabaseUrl is required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
