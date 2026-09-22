export interface MockCompanyRow {
  id: string;
  name: string;
  brand: string;
  country: string;
  apps: string[];
  status: "Activa" | "Archivada" | "Pendiente";
  createdAt: string;
}

const BASE_COMPANY_ROWS: MockCompanyRow[] = [
  {
    id: "c1",
    name: "Frio Delta",
    brand: "Boreal",
    country: "Chile",
    apps: ["CRM", "Analytics"],
    status: "Activa",
    createdAt: "2026-03-01",
  },
  {
    id: "c2",
    name: "Pack Norte",
    brand: "Arctic",
    country: "Perú",
    apps: ["CRM"],
    status: "Archivada",
    createdAt: "2026-01-15",
  },
  {
    id: "c3",
    name: "Cold South",
    brand: "Boreal",
    country: "México",
    apps: ["Analytics", "Support"],
    status: "Pendiente",
    createdAt: "2024-12-07",
  },
  {
    id: "c4",
    name: "Iceberg Corp",
    brand: "Glacial",
    country: "Argentina",
    apps: ["CRM", "Support"],
    status: "Activa",
    createdAt: "2026-02-20",
  },
  {
    id: "c5",
    name: "Polar Solutions",
    brand: "Boreal",
    country: "Chile",
    apps: ["Analytics"],
    status: "Archivada",
    createdAt: "2026-04-10",
  },
  {
    id: "c6",
    name: "Frosty Inc",
    brand: "Arctic",
    country: "Perú",
    apps: ["CRM", "Analytics"],
    status: "Pendiente",
    createdAt: "2024-11-30",
  },
  {
    id: "c7",
    name: "Glacier Tech",
    brand: "Glacial",
    country: "México",
    apps: ["Support"],
    status: "Activa",
    createdAt: "2026-01-05",
  },
  {
    id: "c8",
    name: "Snowy Systems",
    brand: "Boreal",
    country: "Argentina",
    apps: ["CRM"],
    status: "Archivada",
    createdAt: "2026-03-18",
  },
  {
    id: "c9",
    name: "Chilly Solutions",
    brand: "Arctic",
    country: "Chile",
    apps: ["Analytics", "Support"],
    status: "Pendiente",
    createdAt: "2024-12-22",
  },
  {
    id: "c10",
    name: "Icy Enterprises",
    brand: "Glacial",
    country: "Perú",
    apps: ["CRM"],
    status: "Activa",
    createdAt: "2026-02-14",
  },
  {
    id: "c11",
    name: "Frostbite Co",
    brand: "Boreal",
    country: "México",
    apps: ["Support"],
    status: "Archivada",
    createdAt: "2026-04-01",
  },
  {
    id: "c12",
    name: "Blizzard Corp",
    brand: "Arctic",
    country: "Argentina",
    apps: ["CRM", "Analytics"],
    status: "Pendiente",
    createdAt: "2024-11-10",
  },
  {
    id: "c13",
    name: "Snowflake Inc",
    brand: "Glacial",
    country: "Chile",
    apps: ["Support"],
    status: "Activa",
    createdAt: "2026-01-25",
  },
  {
    id: "c14",
    name: "ChillTech",
    brand: "Boreal",
    country: "Perú",
    apps: ["CRM"],
    status: "Archivada",
    createdAt: "2026-03-05",
  },
  {
    id: "c15",
    name: "IceCap Solutions",
    brand: "Arctic",
    country: "México",
    apps: ["Analytics"],
    status: "Pendiente",
    createdAt: "2024-12-15",
  },
  {
    id: "c16",
    name: "Frosty Systems",
    brand: "Glacial",
    country: "Argentina",
    apps: ["CRM", "Support"],
    status: "Activa",
    createdAt: "2026-02-28",
  },
  {
    id: "c17",
    name: "Snowy Enterprises",
    brand: "Boreal",
    country: "Chile",
    apps: ["Analytics"],
    status: "Archivada",
    createdAt: "2026-04-12",
  },
  {
    id: "c18",
    name: "Chilly Corp",
    brand: "Arctic",
    country: "Perú",
    apps: ["CRM", "Support"],
    status: "Pendiente",
    createdAt: "2024-11-25",
  },
  {
    id: "c19",
    name: "Icy Solutions",
    brand: "Glacial",
    country: "México",
    apps: ["CRM"],
    status: "Activa",
    createdAt: "2026-01-18",
  },
  {
    id: "c20",
    name: "Frostbite Inc",
    brand: "Boreal",
    country: "Argentina",
    apps: ["Support"],
    status: "Archivada",
    createdAt: "2026-03-22",
  },
];

const DEMO_BRANDS = ["Boreal", "Arctic", "Glacial"] as const;
const DEMO_COUNTRIES = ["Chile", "Perú", "México", "Argentina"] as const;
const DEMO_STATUSES: MockCompanyRow["status"][] = [
  "Activa",
  "Archivada",
  "Pendiente",
];
const DEMO_APPS: string[][] = [
  ["CRM"],
  ["Analytics"],
  ["Support"],
  ["CRM", "Analytics"],
  ["CRM", "Support"],
  ["Analytics", "Support"],
];

const generateCompanyRows = (count: number, startId: number): MockCompanyRow[] =>
  Array.from({ length: count }, (_, index) => {
    const sequence = startId + index;
    const month = String((index % 12) + 1).padStart(2, "0");
    const day = String((index % 27) + 1).padStart(2, "0");
    return {
      id: `c${sequence}`,
      name: `Empresa Demo ${sequence}`,
      brand: DEMO_BRANDS[index % DEMO_BRANDS.length],
      country: DEMO_COUNTRIES[index % DEMO_COUNTRIES.length],
      apps: DEMO_APPS[index % DEMO_APPS.length],
      status: DEMO_STATUSES[index % DEMO_STATUSES.length],
      createdAt: `2025-${month}-${day}`,
    };
  });

export const MOCK_COMPANY_ROWS: MockCompanyRow[] = [
  ...BASE_COMPANY_ROWS,
  ...generateCompanyRows(60, 21),
];
