-- ============================================================
-- TABLA TURNOS - Ejecutar en Supabase SQL Editor
-- ============================================================

-- Crear tabla turnos si no existe
CREATE TABLE IF NOT EXISTS public.turnos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  vehicle TEXT,
  services JSONB,          -- array de IDs de servicios
  date DATE,               -- 'YYYY-MM-DD'
  time TEXT,               -- 'HH:MM'
  client JSONB,            -- { name, phone, plate, brand, model }
  price NUMERIC DEFAULT 0,
  duration INTEGER DEFAULT 0,  -- en minutos
  status TEXT DEFAULT 'pending',
  source TEXT DEFAULT 'online', -- 'online' | 'walkin'
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Si la tabla ya existe, agregar columnas faltantes:
ALTER TABLE public.turnos ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'online';
ALTER TABLE public.turnos ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.turnos ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0;
ALTER TABLE public.turnos ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;

-- Habilitar RLS
ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;

-- Políticas (permisivas para desarrollo con anon key)
CREATE POLICY IF NOT EXISTS "Turnos visibles para todos"
  ON public.turnos FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Cualquiera puede insertar turnos"
  ON public.turnos FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Cualquiera puede actualizar turnos"
  ON public.turnos FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Cualquiera puede eliminar turnos"
  ON public.turnos FOR DELETE USING (true);
