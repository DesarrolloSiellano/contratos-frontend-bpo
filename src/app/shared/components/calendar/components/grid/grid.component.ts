import { ChangeDetectionStrategy, Component, inject, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../interfaces/calendar.interface';
import { EventCalendarComponent } from '../event/event.component';

@Component({
  selector: 'app-grid-calendar',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EventCalendarComponent],
  host: {
    'style': 'display: block;'
  }
})
export class GridCalendarComponent {
  private readonly calendarService = inject(CalendarService);

  eventClick = output<CalendarEvent>();

  readonly visibleDays = this.calendarService.visibleDays;
  readonly viewType = this.calendarService.viewType;
  readonly events = this.calendarService.filteredEvents;
  readonly translations = this.calendarService.translations;
  readonly locale = this.calendarService.locale;

  readonly hours = Array.from({ length: 24 }, (_, i) => i);

  readonly monthDayNames = computed(() => {
    const locale = this.locale();
    return [0, 1, 2, 3, 4, 5, 6].map(d => {
      const date = new Date(2021, 5, d + 6); // Sunday
      return date.toLocaleString(locale, { weekday: 'short' });
    });
  });

  // Helper to get events for a specific day
  getEventsForDay(date: Date) {
    // Format local date to YYYY-MM-DD for comparison
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return this.events().filter(event => {
      if (!event.date) return false;
      const eventDateStr = event.date.split('T')[0];
      return eventDateStr === dateStr;
    });
  }

  // Calculate grid-row based on startTime (HH:mm)
  // Each hour is 2 rows (30min slots) or just 1 row per hour.
  // Let's do 1 row per hour for simplicity, or 60 rows for per-minute precision.
  // Grid row 1 is the header. Grid row 2 is 00:00.
  getEventStyles(event: CalendarEvent) {
    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);

    const startRow = startH + 1; // 00:00 is row 1
    const durationMin = (endH * 60 + endM) - (startH * 60 + startM);
    const spanRows = Math.max(1, Math.round(durationMin / 60));

    return {
      'grid-row-start': startRow,
      'grid-row-end': `span ${spanRows}`
    };
  }

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isOtherMonth(date: Date): boolean {
    return date.getMonth() !== this.calendarService.currentDate().getMonth();
  }

  getDayName(date: Date): string {
    return date.toLocaleString(this.locale(), { weekday: 'short' }).toUpperCase();
  }
}
