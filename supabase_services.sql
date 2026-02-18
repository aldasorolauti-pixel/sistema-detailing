-- Crear tabla services si no existe
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null,
  duration integer not null, -- en minutos
  active boolean default true,
  icon text default '✨'
);

-- Habilitar RLS
alter table public.services enable row level security;

-- Políticas de seguridad (RLS)
-- Permitir lectura pública de servicios activos
create policy "Servicios son visibles para todos"
  on public.services for select
  using ( true );

-- Permitir inserción/actualización solo a usuarios autenticados (o anon si es desarrollo laxo)
-- Asumiendo que usas key anon publica para todo por ahora, permitimos todo.
-- Idealmente restringir a rol service_role o admin para escrituras.
create policy "Cualquiera puede insertar servicios"
  on public.services for insert
  with check ( true );

create policy "Cualquiera puede actualizar servicios"
  on public.services for update
  using ( true );

-- Insertar datos iniciales si la tabla está vacía
insert into public.services (name, description, price, duration, active, icon)
select 'Lavado Premium', 'Interior/Exterior completo', 5000, 90, true, '✨'
where not exists (select 1 from public.services where name = 'Lavado Premium');

insert into public.services (name, description, price, duration, active, icon)
select 'Tratamiento de Cueros', 'Limpieza y acondicionamiento', 3000, 60, true, '🪑'
where not exists (select 1 from public.services where name = 'Tratamiento de Cueros');

insert into public.services (name, description, price, duration, active, icon)
select 'Pulido de Pintura', 'Corrección de pintura profesional', 8000, 180, true, '💎'
where not exists (select 1 from public.services where name = 'Pulido de Pintura');

insert into public.services (name, description, price, duration, active, icon)
select 'Tratamiento Cerámico', 'Protección cerámica de larga duración', 15000, 240, true, '🛡️'
where not exists (select 1 from public.services where name = 'Tratamiento Cerámico');

insert into public.services (name, description, price, duration, active, icon)
select 'Limpieza de Motor', 'Desengrase y limpieza profunda', 2500, 45, true, '⚙️'
where not exists (select 1 from public.services where name = 'Limpieza de Motor');

insert into public.services (name, description, price, duration, active, icon)
select 'Sanitización con Ozono', 'Eliminación de olores y bacterias', 2000, 30, true, '🌬️'
where not exists (select 1 from public.services where name = 'Sanitización con Ozono');
