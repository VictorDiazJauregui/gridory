export interface SidebarDemoSectionContent {
  id: string;
  title: string;
  description: string;
}

export const SIDEBAR_DEMO_SECTIONS: SidebarDemoSectionContent[] = [
  {
    id: "structure",
    title: "Estructura",
    description: "Cabecera y pie fijos; con muchos ítems, solo el centro scrollea.",
  },
  {
    id: "modes",
    title: "Modos",
    description: "Se despliega por encima al pasar el mouse; el botón lo fija, en la cabecera o en el pie.",
  },
  {
    id: "tooltips",
    title: "Tooltips",
    description: "Sin despliegue por hover, cada icono dice su nombre y el botón expande a mano.",
  },
  {
    id: "custom",
    title: "Personalizado (solo tokens)",
    description: "Anchos, colores y separador cambiados solo con tokens --gdy-sidebar-*.",
  },
];

export const SIDEBAR_EVENT_LOG_DESCRIPTION = "El menú no guarda nada: emite eventos y la demo los registra.";
