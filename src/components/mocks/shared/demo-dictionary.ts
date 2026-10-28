import { getDemoLanguage, useDemoLanguage, type DemoLanguage } from "./demo-language";

// The demo app's own texts in English. Company and country names are proper nouns and stay as they are.
const ENGLISH_DEMO_TEXTS: Record<string, string> = {
  Empresa: "Company",
  Marca: "Brand",
  País: "Country",
  Estado: "Status",
  Alta: "Created",
  Monto: "Amount",
  Notas: "Notes",
  Activa: "Active",
  Archivada: "Archived",
  Pendiente: "Pending",
  Todos: "All",
  Todas: "All",
  "Alcance temporal": "Time range",
  "Acciones rápidas": "Quick actions",
  Duplicar: "Duplicate",
  "Exportar fila": "Export row",
  "Exportar tarjeta": "Export card",
  "Marcar favorito": "Mark favorite",
  "Quitar favorito": "Remove favorite",
  "Cambiar estado": "Change status",
  Compartir: "Share",
  Acciones: "Actions",
  "Acciones de la empresa": "Company actions",
  "Nueva empresa": "New company",
  empresas: "companies",
  empresa: "company",
  "Asientos 7/10": "Seats 7/10",
  Cargando: "Loading",
  "Total de las filas filtradas": "Total of the filtered rows",
  "Sin montos": "No amounts",
  "Ninguna empresa coincide con la búsqueda.": "No company matches the search.",
  "Crear empresa": "Create company",
  "Servidor simulado": "Simulated server",
  "Volver a la página 1": "Back to page 1",
  "Filas según la altura": "Rows by height",
  "Eventos emitidos": "Emitted events",
  "Aún no hay eventos.": "No events yet.",
  "Detalle de": "Details of",
  "Cerrar el detalle": "Close the details",
};

export const translateDemoText = (text: string, language: DemoLanguage) =>
  language === "en" ? (ENGLISH_DEMO_TEXTS[text] ?? text) : text;

/** For values read during render without a hook (a column `footer` is called, not mounted). */
export const translateWithCurrentLanguage = (text: string) => translateDemoText(text, getDemoLanguage());

export const useDemoText = () => {
  const language = useDemoLanguage();
  return (text: string) => translateDemoText(text, language);
};
