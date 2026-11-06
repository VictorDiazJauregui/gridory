/** Accessible names of the date filter calendar. Each key documents its Spanish default. */
export interface CalendarLabels {
  /** Navigation landmark that holds the previous and next month buttons. `"Navegación del calendario"`. */
  calendarNavigation: string;
  /** Previous month button. `"Mes anterior"`. */
  calendarPreviousMonth: string;
  /** Next month button. `"Mes siguiente"`. */
  calendarNextMonth: string;
  /** Month dropdown of `calendarMonthYearDropdown`. `"Elegir el mes"`. */
  calendarChooseMonth: string;
  /** Year dropdown of `calendarMonthYearDropdown`. `"Elegir el año"`. */
  calendarChooseYear: string;
  /** Prefix of today's accessible name, before the full date. `"Hoy"`. */
  calendarToday: string;
}
