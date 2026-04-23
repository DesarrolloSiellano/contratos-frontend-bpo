export interface CalendarTranslations {
  today: string;
  dayLabel: string;
  weekLabel: string;
  weekdaysLabel: string;
  monthLabel: string;
  createEvent: string;
  categories: string;
  allDay: string;
  noEvents: string;
}

export type SupportedLocale = 'es' | 'en';

export const CALENDAR_I18N: Record<SupportedLocale, CalendarTranslations> = {
  es: {
    today: 'Hoy',
    dayLabel: 'Día',
    weekLabel: 'Semana',
    weekdaysLabel: 'Días Laborales',
    monthLabel: 'Mes',
    createEvent: 'Próximo Evento', // Following the screenshot's 'Create Event' equivalent
    categories: 'CATEGORÍAS',
    allDay: 'Todo el día',
    noEvents: 'Sin eventos'
  },
  en: {
    today: 'Today',
    dayLabel: 'Day',
    weekLabel: 'Week',
    weekdaysLabel: 'Weekdays',
    monthLabel: 'Month',
    createEvent: 'Create Event',
    categories: 'CATEGORIES',
    allDay: 'All day',
    noEvents: 'No events'
  }
};
