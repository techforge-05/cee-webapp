-- Create calendar_events table for storing school events
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  event_type VARCHAR(50) NOT NULL, -- 'holiday', 'exam', 'event', 'no_school', 'parent_meeting', etc.
  location TEXT,
  all_day BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  color VARCHAR(20), -- optional custom color for the event
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on start_date for efficient date range queries
CREATE INDEX idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX idx_calendar_events_event_type ON calendar_events(event_type);

-- Enable Row Level Security
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can read calendar events (public access)
CREATE POLICY "Public read access for calendar_events"
  ON calendar_events
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Only authenticated users can insert events
CREATE POLICY "Authenticated users can insert calendar_events"
  ON calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Only authenticated users can update events
CREATE POLICY "Authenticated users can update calendar_events"
  ON calendar_events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy: Only authenticated users can delete events
CREATE POLICY "Authenticated users can delete calendar_events"
  ON calendar_events
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_calendar_events_timestamp
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();

-- Insert some sample events for demonstration
INSERT INTO calendar_events (title_en, title_es, description_en, description_es, start_date, end_date, event_type, all_day) VALUES
  ('New School Year Begins', 'Inicio del Año Escolar', 'First day of classes for all students', 'Primer día de clases para todos los estudiantes', '2025-02-03', '2025-02-03', 'event', true),
  ('Spring Break', 'Vacaciones de Primavera', 'School closed for spring break', 'Escuela cerrada por vacaciones de primavera', '2025-04-07', '2025-04-11', 'holiday', true),
  ('Parent-Teacher Conferences', 'Conferencias de Padres y Maestros', 'Schedule your appointment with teachers', 'Programe su cita con los maestros', '2025-03-15', '2025-03-15', 'parent_meeting', true),
  ('Easter Holiday', 'Vacaciones de Semana Santa', 'School closed for Easter', 'Escuela cerrada por Semana Santa', '2025-04-17', '2025-04-21', 'holiday', true),
  ('First Semester Exams', 'Exámenes del Primer Semestre', 'Final exams for first semester', 'Exámenes finales del primer semestre', '2025-06-09', '2025-06-13', 'exam', true),
  ('Independence Day Holiday', 'Día de la Independencia', 'School closed for Independence Day celebration', 'Escuela cerrada por celebración del Día de la Independencia', '2025-09-15', '2025-09-15', 'holiday', true),
  ('Second Semester Begins', 'Inicio del Segundo Semestre', 'First day of second semester', 'Primer día del segundo semestre', '2025-07-14', '2025-07-14', 'event', true),
  ('Thanksgiving Break', 'Vacaciones de Acción de Gracias', 'School closed for Thanksgiving', 'Escuela cerrada por Acción de Gracias', '2025-11-27', '2025-11-28', 'holiday', true),
  ('Christmas Break Begins', 'Inicio de Vacaciones de Navidad', 'Last day before Christmas break', 'Último día antes de las vacaciones de Navidad', '2025-12-19', '2025-12-19', 'event', true),
  ('School Resumes', 'Regreso a Clases', 'Classes resume after Christmas break', 'Las clases se reanudan después de las vacaciones de Navidad', '2026-01-05', '2026-01-05', 'event', true);
