-- ============================================================
-- TABLA BUSINESS_HOURS - Ejecutar en Supabase SQL Editor
-- ============================================================
-- Representa el horario semanal del negocio.
-- Un registro por día de la semana (0=Domingo ... 6=Sábado).
-- Las excepciones (feriados) se guardan en business_exceptions.

CREATE TABLE IF NOT EXISTS public.business_hours (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL UNIQUE, -- 0=Dom, 1=Lun, ..., 6=Sáb
  is_open BOOLEAN DEFAULT true,
  open_time TEXT DEFAULT '09:00',      -- 'HH:MM'
  close_time TEXT DEFAULT '18:00'      -- 'HH:MM'
);

-- Habilitar RLS
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Horarios visibles para todos"
  ON public.business_hours FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Cualquiera puede actualizar horarios"
  ON public.business_hours FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Cualquiera puede insertar horarios"
  ON public.business_hours FOR INSERT WITH CHECK (true);

-- Insertar horario por defecto (Lunes a Viernes 09:00-18:00, finde cerrado)
INSERT INTO public.business_hours (day_of_week, is_open, open_time, close_time)
VALUES
  (0, false, '09:00', '18:00'), -- Domingo
  (1, true,  '09:00', '18:00'), -- Lunes
  (2, true,  '09:00', '18:00'), -- Martes
  (3, true,  '09:00', '18:00'), -- Miércoles
  (4, true,  '09:00', '18:00'), -- Jueves
  (5, true,  '09:00', '18:00'), -- Viernes
  (6, false, '09:00', '18:00')  -- Sábado
ON CONFLICT (day_of_week) DO NOTHING;

-- ============================================================
-- TABLA BUSINESS_EXCEPTIONS - Feriados y días especiales
-- ============================================================
CREATE TABLE IF NOT EXISTS public.business_exceptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  date DATE,           -- día exacto (si no es rango)
  start_date DATE,     -- inicio del rango
  end_date DATE,       -- fin del rango
  closed BOOLEAN DEFAULT true,
  reason TEXT
);

ALTER TABLE public.business_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Excepciones visibles para todos"
  ON public.business_exceptions FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Cualquiera puede insertar excepciones"
  ON public.business_exceptions FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Cualquiera puede eliminar excepciones"
  ON public.business_exceptions FOR DELETE USING (true);
