import { Injectable, signal, computed } from '@angular/core';
import { CalendarViewType, CalendarEvent, CalendarCategory } from '../interfaces/calendar.interface';
import { CALENDAR_I18N, CalendarTranslations, SupportedLocale } from '../interfaces/calendar.translations';

@Injectable()
export class CalendarService {
  // State Signals
  readonly currentDate = signal<Date>(new Date());
  readonly viewType = signal<CalendarViewType>('week');
  readonly categories = signal<CalendarCategory[]>([]);
  readonly selectedCategories = signal<string[]>([]);
  readonly allEvents = signal<CalendarEvent[]>([]);
  readonly locale = signal<SupportedLocale>('es');

  // Computed Values
  readonly visibleDays = computed(() => {
    const current = this.currentDate();
    const type = this.viewType();

    if (type === 'day') {
      return [new Date(current)];
    }

    if (type === 'month') {
      const year = current.getFullYear();
      const month = current.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const start = new Date(firstDayOfMonth);
      
      // Go back to the first Sunday
      start.setDate(1 - firstDayOfMonth.getDay());
      start.setHours(0, 0, 0, 0);

      // Return 42 days (6 weeks) for a consistent grid
      return Array.from({ length: 42 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
    }

    const start = new Date(current);
    const day = current.getDay(); // 0 is Sunday, 1 is Monday

    // For both week and weekdays, we'll start showing from the beginning of the week
    // Usually, Sun-Sat or Mon-Fri.
    // Let's standardise start on Sunday (0) for 'week' and 'weekdays' (then filter).
    start.setDate(current.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });

    if (type === 'weekdays') {
      // Filter for Mon (1) to Fri (5)
      return days.filter(d => d.getDay() >= 1 && d.getDay() <= 5);
    }

    return days;
  });

  readonly range = computed(() => {
    const days = this.visibleDays();
    return {
      start: days[0],
      end: days[days.length - 1]
    };
  });

  readonly translations = computed(() => {
    const locale = this.locale();
    return CALENDAR_I18N[locale];
  });

  readonly filteredEvents = computed(() => {
    const categories = this.selectedCategories();
    const events = this.allEvents();
    if (categories.length === 0) return events;
    return events.filter(e => e.type && categories.includes(e.type));
  });

  readonly categoryCounts = computed(() => {
    const events = this.allEvents();
    const counts: { [key: string]: number } = {};
    events.forEach(event => {
      if (event.type) {
        counts[event.type] = (counts[event.type] || 0) + 1;
      }
    });
    return counts;
  });

  // Actions
  next() {
    const type = this.viewType();
    this.currentDate.update(d => {
      const next = new Date(d);
      if (type === 'month') {
        next.setMonth(d.getMonth() + 1);
      } else if (type === 'week' || type === 'weekdays') {
        next.setDate(d.getDate() + 7);
      } else {
        next.setDate(d.getDate() + 1);
      }
      return next;
    });
  }

  prev() {
    const type = this.viewType();
    this.currentDate.update(d => {
      const prev = new Date(d);
      if (type === 'month') {
        prev.setMonth(d.getMonth() - 1);
      } else if (type === 'week' || type === 'weekdays') {
        prev.setDate(d.getDate() - 7);
      } else {
        prev.setDate(d.getDate() - 1);
      }
      return prev;
    });
  }

  today() {
    this.currentDate.set(new Date());
  }

  setView(type: CalendarViewType) {
    this.viewType.set(type);
  }

  setLocale(locale: SupportedLocale) {
    this.locale.set(locale);
  }

  toggleCategory(categoryId: string) {
    this.selectedCategories.update(current => 
      current.includes(categoryId) 
        ? current.filter(id => id !== categoryId) 
        : [...current, categoryId]
    );
  }

  setCategories(categories: CalendarCategory[]) {
    this.categories.set(categories);
    // Initialize selected categories if none are selected
    if (this.selectedCategories().length === 0 && categories.length > 0) {
      this.selectedCategories.set(categories.map(c => c.id));
    }
  }

  setEvents(events: CalendarEvent[]) {
    this.allEvents.set(events);
  }
}
