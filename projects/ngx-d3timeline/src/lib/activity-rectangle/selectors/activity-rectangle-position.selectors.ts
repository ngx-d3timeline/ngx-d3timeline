import { createSelector } from '../../store-lib/selector/create-selector';
import { selectTimeScale, selectBandScale } from '../../scales/scale-selectors';
import {
  selectTimeOrientation,
  selectStrokeWidth
} from '../../options/selectors/options.selectors';
import { selectGetActivityLateralMargin } from '../../options/selectors/activity-options.selectors';
import { selectResourcePadding } from '../../options/selectors/resource-options.selectors';
import { MemoizedSelector } from '../../store-lib/selector/memoized-selector';
import { Point, translatePoint, pointToTransform } from '../../core/point';
import { partial3, partial2, partial1, partial4 } from '../../core/partial';
import { BandScale, TimeScale } from '../../scales/scale-types';
import { PositionedActivity } from '../../activity/positioned-activity';
import { Orientation } from '../../core/orientation';

const selectGetPositionInTimeAxis = createSelector(
  selectTimeScale,
  partial1(getPositionInTimeAxis)
);

function getPositionInTimeAxis(
  timeScale: TimeScale,
  positionedActivity: PositionedActivity
): number {
  return timeScale(positionedActivity.updatedStart);
}

const selectGetPositionInResourceAxis = createSelector(
  selectBandScale,
  selectResourcePadding,
  selectGetActivityLateralMargin,
  selectStrokeWidth,
  partial4(getPositionInResourceAxis)
);

function getPositionInResourceAxis(
  bandScale: BandScale,
  resourcePadding: number,
  getActivityLateralMargin: (type: string) => number,
  strokeWidth: number,
  positionedActivity: PositionedActivity
): number {
  return (
    bandScale(positionedActivity.updatedResource) +
    resourcePadding +
    getActivityLateralMargin(positionedActivity.type) +
    0.5 * strokeWidth
  );
}

const selectGetActivityX = createSelector(
  selectTimeOrientation,
  selectGetPositionInResourceAxis,
  selectGetPositionInTimeAxis,
  partial3(getActivityX)
);

function getActivityX(
  timeOrientation: Orientation,
  positionInResourceAxis: (p: PositionedActivity) => number,
  positionInTimeAxis: (p: PositionedActivity) => number,
  positionedActivity: PositionedActivity
): number {
  return timeOrientation === Orientation.Vertical
    ? positionInResourceAxis(positionedActivity)
    : positionInTimeAxis(positionedActivity);
}

const selectGetActivityY = createSelector(
  selectTimeOrientation,
  selectGetPositionInResourceAxis,
  selectGetPositionInTimeAxis,
  partial3(getActivityY)
);

function getActivityY(
  timeOrientation: Orientation,
  positionInResourceAxis: (p: PositionedActivity) => number,
  positionInTimeAxis: (p: PositionedActivity) => number,
  positionedActivity: PositionedActivity
): number {
  return timeOrientation === Orientation.Vertical
    ? positionInTimeAxis(positionedActivity)
    : positionInResourceAxis(positionedActivity);
}

const selectGetActivityTopLeft = createSelector(
  selectGetActivityX,
  selectGetActivityY,
  partial2(getActivityTopLeft)
);

function getActivityTopLeft(
  x: (p: PositionedActivity) => number,
  y: (p: PositionedActivity) => number,
  positionedActivity: PositionedActivity
): Point {
  return { x: x(positionedActivity), y: y(positionedActivity) };
}

const selectGetOffsetActivityTopLeft = (
  selectOffset: MemoizedSelector<Point>
) =>
  createSelector(
    selectGetActivityTopLeft,
    selectOffset,
    partial2(getOffsetActivityTopLeft)
  );

function getOffsetActivityTopLeft(
  activityTopLeft: (p: PositionedActivity) => Point,
  offset: Point,
  positionedActivity: PositionedActivity
): Point {
  return translatePoint(activityTopLeft(positionedActivity), offset);
}

const createSelectTopLeft = (selectOffset?: MemoizedSelector<Point>) =>
  selectOffset
    ? selectGetOffsetActivityTopLeft(selectOffset)
    : selectGetActivityTopLeft;

export const selectGetActivityTransform = (
  selectOffset: MemoizedSelector<Point>
) =>
  createSelector(
    createSelectTopLeft(selectOffset),
    partial1(getActivityTransform)
  );

function getActivityTransform(
  activityTopLeft: (p: PositionedActivity) => Point,
  positionedActivity: PositionedActivity
): string {
  return pointToTransform(activityTopLeft(positionedActivity));
}
