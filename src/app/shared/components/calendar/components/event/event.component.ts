import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../interfaces/calendar.interface';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class EventCalendarComponent {
  event = input.required<CalendarEvent>();

  get timeRange() {
    return `${this.event().startTime} - ${this.event().endTime}`;
  }
}
