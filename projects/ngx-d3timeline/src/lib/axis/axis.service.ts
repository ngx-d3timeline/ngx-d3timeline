import { Axis } from './axis';
import { Orientation } from '../orientation';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TickMark } from './tick';
import { Line } from './line';
import { Store } from '../store/store';
import { OptionsService } from '../options.service';
import { TimelineView } from '../view/timeline-view';
import { Scale } from '../scale-types';
import { ResourceAxisTickMarkRenderer } from './resources-axis/resource-axis-tick-renderer';
import { TimeAxisTickMarkRenderer } from './time-axis/time-axis-tick-renderer';
import { TickMarkRenderer } from './tick-renderer';
import { flipOrientation } from '../orientation-utils';

@Injectable({ providedIn: 'root' })
export class AxisService {
  resourceAxis$ = this.store.state$.pipe(
    map(state =>
      this.createAxis(
        new ResourceAxisTickMarkRenderer(),
        state.bandScale,
        state.axisOrientations.resource,
        state.view
      )
    )
  );

  timeAxis$ = this.store.state$.pipe(
    map(state =>
      this.createAxis(
        new TimeAxisTickMarkRenderer(),
        state.timeScale,
        state.axisOrientations.time,
        state.view
      )
    )
  );

  constructor(private store: Store, private optionsService: OptionsService) {}

  private createAxis<TScale extends Scale>(
    tickRenderer: TickMarkRenderer<TScale>,
    scale: TScale,
    orientation: Orientation,
    timelineView: TimelineView
  ): Axis {
    return {
      tickMarks: this.getTickMarks(
        tickRenderer,
        scale,
        orientation,
        timelineView
      ),
      line: this.getLine(scale, orientation, timelineView)
    };
  }

  private getTickMarks<TScale extends Scale>(
    tickRenderer: TickMarkRenderer<TScale>,
    scale: TScale,
    orientation: Orientation,
    timelineView: TimelineView
  ): TickMark[] {
    return tickRenderer.getTickValues(scale).map(value => ({
      label: tickRenderer.getTickLabel(scale, value),
      transform: this.optionsService.getTranslation(
        tickRenderer.getTransform(scale, value),
        orientation,
        timelineView
      ),
      line: this.optionsService.getTickLine(
        tickRenderer.getTickLineOffset(),
        flipOrientation(orientation)
      )
    }));
  }

  private getLine<TScale extends Scale>(
    scale: TScale,
    orientation: Orientation,
    timelineView: TimelineView
  ): Line {
    const line: Line = {
      x1: timelineView.left,
      x2: timelineView.left,
      y1: timelineView.top,
      y2: timelineView.top
    };
    const rangeLimit = scale.range()[1];

    return orientation === Orientation.Vertical
      ? { ...line, y2: rangeLimit }
      : { ...line, x2: rangeLimit };
  }
}
