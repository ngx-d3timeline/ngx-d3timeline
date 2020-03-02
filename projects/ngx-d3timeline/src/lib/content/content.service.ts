import { Injectable } from '@angular/core';
import { Store } from '../store/store';
import { State } from '../store/state';
import { map } from 'rxjs/operators';
import { TimelineEvent } from '../timeline-event';
import { EventRectangle } from './content';
import { Orientation } from '../orientation';
import { TimeScale, BandScale } from '../scale-types';
import { TimelineDragEvent } from './timeline-drag-event';

@Injectable({ providedIn: 'root' })
export class ContentService {
  eventRectangles$ = this.store.state$.pipe(
    map(state => this.createEventRectangles(state))
  );

  dragEventRectangle$ = this.store.state$.pipe(
    map(state => this.createDragEventRectangle(state))
  );

  constructor(private store: Store) {}

  private createEventRectangles(state: State): EventRectangle[] {
    return state.data.map(data =>
      this.timelineEventToEventRectangle(data, state)
    );
  }

  private createDragEventRectangle(state: State): EventRectangle {
    const timelineEvent =
      state.dragEvent && state.data.find(d => d.id === state.dragEvent.id);
    return (
      timelineEvent &&
      this.timelineEventToEventRectangle(timelineEvent, state, state.dragEvent)
    );
  }

  private timelineEventToEventRectangle(
    timelineEvent: TimelineEvent,
    state: State,
    dragEvent?: TimelineDragEvent
  ): EventRectangle {
    return {
      id: timelineEvent.id,
      title: timelineEvent.type,
      transform: this.dataTransform(
        timelineEvent,
        state.axisOrientations.time,
        state.bandScale,
        state.timeScale,
        dragEvent
      ),
      width: this.rectWidth(
        timelineEvent,
        state.axisOrientations.time,
        state.bandScale,
        state.timeScale
      ),
      height: this.rectHeight(
        timelineEvent,
        state.axisOrientations.time,
        state.bandScale,
        state.timeScale
      )
    };
  }

  private dataTransform(
    data: TimelineEvent,
    orientation: Orientation,
    scaleBand: BandScale,
    scaleTime: TimeScale,
    dragEvent?: TimelineDragEvent
  ) {
    const eventX = this.getEventX(data, orientation, scaleBand, scaleTime);
    const dx = (dragEvent && dragEvent.dx) || 0;

    const eventY = this.getEventY(data, orientation, scaleBand, scaleTime);
    const dy = (dragEvent && dragEvent.dy) || 0;

    return `translate(${eventX + dx}, ${eventY + dy})`;
  }

  private rectHeight(
    data: TimelineEvent,
    orientation: Orientation,
    scaleBand: BandScale,
    scaleTime: TimeScale
  ) {
    return orientation === Orientation.Vertical
      ? this.rectTimeBreadth(data, scaleTime)
      : this.rectResourceBreadth(scaleBand);
  }

  private rectWidth(
    data: TimelineEvent,
    orientation: Orientation,
    scaleBand: BandScale,
    scaleTime: TimeScale
  ) {
    return orientation === Orientation.Vertical
      ? this.rectResourceBreadth(scaleBand)
      : this.rectTimeBreadth(data, scaleTime);
  }
  private getEventX(
    data: TimelineEvent,
    orientation: Orientation,
    scaleBand: BandScale,
    scaleTime: TimeScale
  ) {
    return orientation === Orientation.Vertical
      ? this.positionInResourceAxis(data, scaleBand)
      : this.positionInTimeAxis(data, scaleTime);
  }

  private getEventY(
    data: TimelineEvent,
    orientation: Orientation,
    scaleBand: BandScale,
    scaleTime: TimeScale
  ) {
    return orientation === Orientation.Vertical
      ? this.positionInTimeAxis(data, scaleTime)
      : this.positionInResourceAxis(data, scaleBand);
  }

  private positionInResourceAxis(
    data: TimelineEvent,
    scaleBand: BandScale
  ): number {
    return scaleBand(data.series);
  }

  private positionInTimeAxis(
    data: TimelineEvent,
    scaleTime: TimeScale
  ): number {
    return scaleTime(data.start);
  }

  private rectTimeBreadth(data: TimelineEvent, scaleTime: TimeScale): number {
    return scaleTime(data.finish) - scaleTime(data.start);
  }

  private rectResourceBreadth(scaleBand: BandScale): number {
    return scaleBand.bandwidth();
  }
}
