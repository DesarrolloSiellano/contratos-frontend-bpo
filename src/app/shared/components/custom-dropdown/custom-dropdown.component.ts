import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayModule,
  OverlayPositionBuilder,
} from '@angular/cdk/overlay';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-dropdown-panel',
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule, CdkScrollableModule],
  template: `
    <ng-template #panelTemplate>
      <div class="custom-panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <section class="panel-header">
          <ng-content select="[slot=header]"></ng-content>
        </section>

        <!-- Body (Scrollable) -->
        <section class="panel-body" cdkScrollable>
          <ng-content select="[slot=body]"></ng-content>
        </section>

        <!-- Footer -->
        <section class="panel-footer">
          <ng-content select="[slot=footer]"></ng-content>
        </section>
      </div>
    </ng-template>
  `,
  styleUrls: ['./custom-dropdown.component.scss'],
})
export class CustomDropdownComponent implements OnDestroy {
  @ViewChild('panelTemplate', { read: TemplateRef }) panelTemplate!: TemplateRef<any>;

  private overlayRef?: OverlayRef;
  private destroy$ = new Subject<void>();

  constructor(
    private overlay: Overlay,
    private positionBuilder: OverlayPositionBuilder,
    private viewContainerRef: ViewContainerRef
  ) {}

  open(triggerElement: HTMLElement) {
    this.close();

    const positionStrategy = this.positionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 4,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'overlay-notification-container',
    });

    this.overlayRef.backdropClick().pipe(takeUntil(this.destroy$)).subscribe(() => this.close());

    const portal = new TemplatePortal(this.panelTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  close() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.close();
  }
}
