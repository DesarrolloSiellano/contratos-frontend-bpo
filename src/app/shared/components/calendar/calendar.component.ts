import { ChangeDetectionStrategy, Component, input, output, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from './services/calendar.service';
import { CalendarCategory, CalendarEvent, CalendarViewType } from './interfaces/calendar.interface';
import { SidebarCalendarComponent } from './components/sidebar/sidebar.component';
import { HeaderCalendarComponent } from './components/header/header.component';
import { GridCalendarComponent } from './components/grid/grid.component';
import { SupportedLocale } from './interfaces/calendar.translations';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CalendarService],
  imports: [
    CommonModule,
    SidebarCalendarComponent,
    HeaderCalendarComponent,
    GridCalendarComponent
  ]
})
export class CalendarComponent implements OnInit {
  private readonly calendarService = inject(CalendarService);

  // Inputs
  events = input.required<CalendarEvent[]>();
  categories = input<CalendarCategory[]>([]);
  initialView = input<CalendarViewType>('week');
  locale = input<SupportedLocale>('es');

  // Outputs
  eventCreate = output<Date>();
  eventClick = output<CalendarEvent>();
  viewChange = output<{ start: string, end: string }>();

  constructor() {
    // Watch for range changes and emit
    effect(() => {
      const range = this.calendarService.range();
      if (range.start && range.end) {
        const start = range.start.toISOString().split('T')[0];
        const end = range.end.toISOString().split('T')[0];
        this.viewChange.emit({ start, end });
      }
    });

    // Sync inputs with service
    effect(() => {
      const currentEvents = this.events();
      const currentCategories = this.categories();

      const eventsWithColors = currentEvents.map(event => ({
        ...event,
        categoryColor: currentCategories.find(c => c.id === event.type)?.color || '#3182ce'
      }));

      this.calendarService.setCategories(currentCategories);
      this.calendarService.setEvents(eventsWithColors);
    });

    effect(() => {
      const view = this.initialView();
      this.calendarService.setView(view);
    });

    effect(() => {
      const locale = this.locale();
      this.calendarService.setLocale(locale);
    });
  }

  ngOnInit(): void {
    // Initialization if needed
  }
}
