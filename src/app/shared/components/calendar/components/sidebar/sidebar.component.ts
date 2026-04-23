import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { CalendarCategory } from '../../interfaces/calendar.interface';

@Component({
  selector: 'app-sidebar-calendar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class SidebarCalendarComponent {
  public readonly calendarService = inject(CalendarService);

  categories = input<CalendarCategory[]>([]);
  createEventClick = output<Date>();

  currentDate = this.calendarService.currentDate;
  locale = this.calendarService.locale;
  translations = this.calendarService.translations;

  // Simple mini-cal logic
  get monthYear() {
    return this.currentDate().toLocaleString(this.locale(), { month: 'long', year: 'numeric' });
  }

  get daysOfWeek() {
    const locale = this.locale();
    // Get short names for days of week starting Sunday
    return [0, 1, 2, 3, 4, 5, 6].map(d => {
      const date = new Date(2021, 5, d + 6); // Just some Sunday to start
      return date.toLocaleString(locale, { weekday: 'narrow' }).toUpperCase();
    });
  }

  get daysInMonth() {
    const d = this.currentDate();
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();
    const padding = Array.from({ length: firstDay }, (_, i) => ({
      day: prevMonthDays - firstDay + i + 1,
      currentMonth: false,
      selected: false
    }));

    const current = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
      selected: i + 1 === d.getDate()
    }));

    // Fill to 42 cells (6 rows)
    const remaining = 42 - padding.length - current.length;
    const nextPadding = Array.from({ length: remaining }, (_, i) => ({
      day: i + 1,
      currentMonth: false,
      selected: false
    }));

    return [...padding, ...current, ...nextPadding];
  }

  onDayClick(day: number) {
    const d = new Date(this.currentDate());
    d.setDate(day);
    this.calendarService.currentDate.set(d);
  }

  toggleCategory(categoryId: string) {
    this.calendarService.toggleCategory(categoryId);
  }

  isCategorySelected(categoryId: string) {
    return this.calendarService.selectedCategories().includes(categoryId);
  }
}
