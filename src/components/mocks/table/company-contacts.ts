import type { MockCompanyRow } from "../company/company-rows";

export interface MockCompanyContact {
  id: string;
  name: string;
  role: string;
  email: string;
}

const FIRST_NAMES = ["Ana", "Bruno", "Carla", "Diego", "Elena", "Franco", "Gala", "Hugo"];
const LAST_NAMES = ["Rivas", "Soto", "Paz", "Luna", "Vera", "Mena", "Ortiz", "Rojas"];
const ROLES = ["Gerencia", "Compras", "Finanzas", "Soporte"];
const MAX_CONTACTS = 3;

// "Pack Norte" has no contacts, so its row shows no expand button (canExpandRow).
const COMPANIES_WITHOUT_CONTACTS = new Set(["c2"]);

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z]+/g, "");

const buildContact = (company: MockCompanyRow, seed: number, position: number): MockCompanyContact => {
  const name = `${FIRST_NAMES[(seed + position * 3) % FIRST_NAMES.length]} ${LAST_NAMES[(seed + position) % LAST_NAMES.length]}`;
  return {
    id: `${company.id}-contact-${position}`,
    name,
    role: ROLES[(seed + position) % ROLES.length],
    email: `${toSlug(name)}@${toSlug(company.name)}.com`,
  };
};

const seedOf = (company: MockCompanyRow) => [...company.id].reduce((sum, character) => sum + character.charCodeAt(0), 0);

/** The same contacts on every load: one to three per company, derived from its id. */
export const listCompanyContacts = (company: MockCompanyRow): MockCompanyContact[] => {
  if (COMPANIES_WITHOUT_CONTACTS.has(company.id)) return [];
  const seed = seedOf(company);
  return Array.from({ length: 1 + (seed % MAX_CONTACTS) }, (_, position) => buildContact(company, seed, position));
};

export const hasCompanyContacts = (company: MockCompanyRow) => listCompanyContacts(company).length > 0;
