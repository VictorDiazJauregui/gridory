export interface ControlsSectionContent {
  id: string;
  title: string;
  description: string;
  entryPoint: string;
}

export const CONTROLS_SECTIONS: ControlsSectionContent[] = [
  {
    id: "segmented-control",
    title: "Control segmentado",
    description: "Opciones excluyentes con un indicador que se desliza hasta la elegida.",
    entryPoint: "gridory/segmented-control",
  },
  {
    id: "country-select",
    title: "Selector de país",
    description: "Búsqueda sin tildes, bandera y selección simple o múltiple.",
    entryPoint: "gridory/country-select",
  },
  {
    id: "phone-input",
    title: "Teléfono con prefijo",
    description: "Prefijo por país y un número que solo acepta dígitos y separadores.",
    entryPoint: "gridory/phone-input",
  },
];

export const EVENT_LOG_DESCRIPTION = "Los controles no guardan nada: emiten eventos y la demo los registra.";
