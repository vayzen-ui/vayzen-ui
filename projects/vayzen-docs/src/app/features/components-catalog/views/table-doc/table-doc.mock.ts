import type { VzTableQuery } from 'vayzen-ui';

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  salary: number;
  hiredAt: string;
}

const NAMES = ['Ángela Pérez', 'Luis Hernández', 'María García', 'Carlos Ramírez', 'Sofía Torres', 'Jorge Sánchez', 'Lucía Flores', 'Diego Morales', 'Valeria Cruz', 'Andrés Ortiz'];
const DEPARTMENTS = ['Ventas', 'Ingeniería', 'Soporte', 'Finanzas', 'Marketing'];
const STATUSES: Employee['status'][] = ['Activo', 'Activo', 'Pendiente', 'Inactivo'];

/** Genera 87 registros deterministas para las demos. */
export const EMPLOYEES: Employee[] = Array.from({ length: 87 }, (_, i) => {
  const name = `${NAMES[i % NAMES.length]} ${i >= NAMES.length ? Math.floor(i / NAMES.length) + 1 : ''}`.trim();
  const month = String((i % 12) + 1).padStart(2, '0');
  const day = String((i % 27) + 1).padStart(2, '0');
  return {
    id: i + 1,
    name,
    email: `${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.')}@vayzen.dev`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    status: STATUSES[i % STATUSES.length],
    salary: 12000 + ((i * 3719) % 38000),
    hiredAt: `${2018 + (i % 8)}-${month}-${day}`,
  };
});

const normalize = (v: unknown) =>
  String(v ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Simula un endpoint REST: recibe el `VzTableQuery` que emite la tabla y devuelve
 * únicamente la página solicitada junto con el total (con latencia artificial).
 */
export function fakeEmployeesApi(query: VzTableQuery, delayMs = 600): Promise<{ rows: Employee[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = [...EMPLOYEES];

      for (const [key, value] of Object.entries(query.filters)) {
        rows = rows.filter((r) => String((r as any)[key]) === String(value));
      }

      const tokens = normalize(query.search).split(/\s+/).filter(Boolean);
      if (tokens.length) {
        rows = rows.filter((r) => {
          const haystack = normalize(`${r.name} ${r.email} ${r.department} ${r.status} ${r.salary} ${r.hiredAt}`);
          return tokens.every((t) => haystack.includes(t));
        });
      }

      for (const s of [...query.sort].reverse()) {
        rows.sort((a: any, b: any) => {
          const cmp = typeof a[s.key] === 'number' ? a[s.key] - b[s.key] : String(a[s.key]).localeCompare(String(b[s.key]), 'es', { numeric: true });
          return s.direction === 'asc' ? cmp : -cmp;
        });
      }

      const start = (query.page - 1) * query.pageSize;
      resolve({ rows: rows.slice(start, start + query.pageSize), total: rows.length });
    }, delayMs);
  });
}

