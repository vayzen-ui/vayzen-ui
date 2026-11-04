import type { VzTableQuery } from 'vayzen-ui';

export interface Employee {
  id: number;
  folio: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  performance: number;
  salary: number;
  hiredAt: string;
}

export interface BasicOrder {
  orderId: string;
  customer: string;
  product: string;
  office: string;
  amount: number;
  status: 'Entregado' | 'En proceso' | 'Enviado' | 'Cancelado';
}

export const BASIC_ORDERS: BasicOrder[] = [
  { orderId: '#ORD-7245', customer: 'James Rodríguez', product: 'MacBook Pro 16" M3', office: 'CDMX · Santa Fe', amount: 48990, status: 'Entregado' },
  { orderId: '#ORD-7244', customer: 'Emma Thompson', product: 'Monitor Studio Display 5K', office: 'Monterrey · San Pedro', amount: 34500, status: 'En proceso' },
  { orderId: '#ORD-7243', customer: 'Roberto Kim', product: 'Servidor Rack R650 XS', office: 'Guadalajara · Zapopan', amount: 89200, status: 'Enviado' },
  { orderId: '#ORD-7242', customer: 'Sofía Martínez', product: 'iPad Pro 12.9" + Pencil', office: 'Querétaro · Centro Sur', amount: 26400, status: 'Entregado' },
  { orderId: '#ORD-7241', customer: 'William Brown', product: 'Terminal Biométrica Pro', office: 'Puebla · Angelópolis', amount: 14800, status: 'Cancelado' },
];

const NAMES = [
  'Ángela Pérez',
  'Luis Hernández',
  'María García',
  'Carlos Ramírez',
  'Sofía Torres',
  'Jorge Sánchez',
  'Lucía Flores',
  'Diego Morales',
  'Valeria Cruz',
  'Andrés Ortiz',
];

const ROLES = [
  'Principal Cloud Architect',
  'Product Design Lead',
  'Staff Frontend Engineer',
  'FinOps Controller',
  'Growth Marketing Manager',
  'Site Reliability Engineer',
  'Data Science Director',
  'Enterprise Account Exec',
  'Security Operations Lead',
  'QA Automation Specialist',
];

const AVATARS: (string | undefined)[] = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=80',
  undefined, // Demuestra iniciales automáticas con color semántico
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80',
  undefined,
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
  undefined,
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=80',
];

const DEPARTMENTS = ['Ingeniería', 'Diseño & UX', 'Finanzas', 'Ventas Enterprise', 'Ciberseguridad'];
const STATUSES: Employee['status'][] = ['Activo', 'Activo', 'Pendiente', 'Activo', 'Inactivo'];
const PERFORMANCES = [96, 88, 64, 92, 34, 85, 98, 74, 91, 45];

/** Genera 87 registros deterministas para las demos. */
export const EMPLOYEES: Employee[] = Array.from({ length: 87 }, (_, i) => {
  const name = `${NAMES[i % NAMES.length]} ${i >= NAMES.length ? Math.floor(i / NAMES.length) + 1 : ''}`.trim();
  const month = String((i % 12) + 1).padStart(2, '0');
  const day = String((i % 27) + 1).padStart(2, '0');
  return {
    id: i + 1,
    folio: `#EMP-${String(1040 + i)}`,
    name,
    email: `${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.')}@vayzen.dev`,
    role: ROLES[i % ROLES.length],
    avatar: i < 10 ? AVATARS[i % AVATARS.length] : undefined,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    status: STATUSES[i % STATUSES.length],
    performance: PERFORMANCES[i % PERFORMANCES.length],
    salary: 24000 + ((i * 4350) % 48000),
    hiredAt: `${2019 + (i % 7)}-${month}-${day}`,
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
export function fakeEmployeesApi(query: VzTableQuery, delayMs = 500): Promise<{ rows: Employee[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = [...EMPLOYEES];

      for (const [key, value] of Object.entries(query.filters)) {
        rows = rows.filter((r) => String((r as any)[key]) === String(value));
      }

      const tokens = normalize(query.search).split(/\s+/).filter(Boolean);
      if (tokens.length) {
        rows = rows.filter((r) => {
          const haystack = normalize(`${r.folio} ${r.name} ${r.email} ${r.role} ${r.department} ${r.status} ${r.salary} ${r.hiredAt}`);
          return tokens.every((t) => haystack.includes(t));
        });
      }

      for (const s of [...query.sort].reverse()) {
        rows.sort((a: any, b: any) => {
          const cmp =
            typeof a[s.key] === 'number'
              ? a[s.key] - b[s.key]
              : String(a[s.key]).localeCompare(String(b[s.key]), 'es', { numeric: true });
          return s.direction === 'asc' ? cmp : -cmp;
        });
      }

      const start = (query.page - 1) * query.pageSize;
      resolve({ rows: rows.slice(start, start + query.pageSize), total: rows.length });
    }, delayMs);
  });
}
