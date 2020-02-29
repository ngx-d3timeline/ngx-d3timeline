import { TimeScale } from '../../scale-types';
import { TickRenderer } from '../tick-renderer';

export class TimeAxisTickRenderer implements TickRenderer<TimeScale> {
  getTickValues(scale: TimeScale): Date[] {
    return scale.ticks();
  }

  getLabel(scale: TimeScale, tick: any): string {
    return scale.tickFormat()(tick);
  }

  getTransform(scale: TimeScale, tick: any): number {
    return scale(tick);
  }

  getTickLineOffset() {
    return 5;
  }
}
