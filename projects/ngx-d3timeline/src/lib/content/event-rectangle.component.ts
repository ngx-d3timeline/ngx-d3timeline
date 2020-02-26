import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { EventRectangle } from './content';
import { drag } from 'd3-drag';
import { select, event } from 'd3-selection';
import { DragService } from './drag.service';

@Component({
  selector: '[ngx-d3timeline-event-rectangle]',
  template: `
    <svg:g
      [attr.transform]="eventRectangle.transform"
      *ngIf="eventRectangle"
      #eventRectangleEl
    >
      <svg:rect
        [attr.height]="eventRectangle.height"
        [attr.width]="eventRectangle.width"
      ></svg:rect>
      <svg:text dy="1em">{{ eventRectangle.title }}</svg:text>
    </svg:g>
  `,
  styles: [
    `
      rect {
        fill: #fff;
        stroke: #000;
      }

      text {
        font-size: 10px;
      }
    `
  ]
})
export class EventRectangleComponent implements AfterViewInit {
  @Input() eventRectangle: EventRectangle;

  @ViewChild('eventRectangleEl') eventRectangleEl: ElementRef;

  constructor(private dragService: DragService) {}

  ngAfterViewInit() {
    this.setupDrag();
  }

  private setupDrag() {
    if (this.eventRectangleEl) {
      const onDrag = drag()
        .on('drag', () => this.dragService.onDrag(this.eventRectangle, event))
        .on('end', () => this.dragService.onDragEnd());

      onDrag(select(this.eventRectangleEl.nativeElement));
    }
  }
}
