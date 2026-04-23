import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { CalendarViewType } from '../../interfaces/calendar.interface';

@Component({
  selector: 'app-header-calendar',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class HeaderCalendarComponent {
  private readonly calendarService = inject(CalendarService);

  readonly currentDate = this.calendarService.currentDate;
  readonly viewType = this.calendarService.viewType;
  readonly translations = this.calendarService.translations;
  readonly locale = this.calendarService.locale;

  readonly displayTitle = computed(() => {
    const date = this.currentDate();
    const locale = this.locale();
    const month = date.toLocaleString(locale, { month: 'long' });
    const year = date.getFullYear();
    // Capitalize first letter of month
    return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
  });

  readonly views = computed(() => {
    const t = this.translations();
    return [
      { label: t.dayLabel, value: 'day' as CalendarViewType },
      { label: t.weekLabel, value: 'week' as CalendarViewType },
      { label: t.weekdaysLabel, value: 'weekdays' as CalendarViewType },
      { label: t.monthLabel, value: 'month' as CalendarViewType }
    ];
  });

  next() { this.calendarService.next(); }
  prev() { this.calendarService.prev(); }
  today() { this.calendarService.today(); }
  setView(view: CalendarViewType) { this.calendarService.setView(view); }
}
