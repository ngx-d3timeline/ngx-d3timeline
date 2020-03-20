import { PositionedActivity } from '../positioned-activity';
import { TimeScale, BandScale } from '../scale-types';
import { Orientation } from '../orientation';
import { Point, translatePoint } from '../point';
import { ActivityRectangle } from './activity-rectangle';
import { pointToTransform } from '../transform-utils';

type PositionInAxis = (p: PositionedActivity) => number;
export type PointInAxis = (p: PositionedActivity) => Point;
export type ActivityTransform = (p: PositionedActivity) => string;

export function getPositionInResourceAxis(
  bandScale: BandScale,
  positionedActivity: PositionedActivity
): number {
  return bandScale(positionedActivity.updatedResource);
}

export function getPositionInTimeAxis(
  timeScale: TimeScale,
  positionedActivity: PositionedActivity
): number {
  return timeScale(positionedActivity.updatedStart);
}

export function getActivityX(
  timeOrientation: Orientation,
  positionInResourceAxis: PositionInAxis,
  positionInTimeAxis: PositionInAxis,
  positionedActivity: PositionedActivity
): number {
  return timeOrientation === Orientation.Vertical
    ? positionInResourceAxis(positionedActivity)
    : positionInTimeAxis(positionedActivity);
}

export function getActivityY(
  timeOrientation: Orientation,
  positionInResourceAxis: PositionInAxis,
  positionInTimeAxis: PositionInAxis,
  positionedActivity: PositionedActivity
): number {
  return timeOrientation === Orientation.Vertical
    ? positionInTimeAxis(positionedActivity)
    : positionInResourceAxis(positionedActivity);
}

export function getActivityTopLeft(
  x: PositionInAxis,
  y: PositionInAxis,
  positionedActivity: PositionedActivity
): Point {
  return { x: x(positionedActivity), y: y(positionedActivity) };
}

export function getOffsetActivityTopLeft(
  activityTopLeft: PointInAxis,
  offset: Point,
  positionedActivity: PositionedActivity
): Point {
  return translatePoint(activityTopLeft(positionedActivity), offset);
}

export function getActivityTransform(
  activityTopLeft: PointInAxis,
  positionedActivity: PositionedActivity
): string {
  return pointToTransform(activityTopLeft(positionedActivity));
}

export function getRectBreadthInTimeAxis(
  timeScale: TimeScale,
  positionedActivity: PositionedActivity
): number {
  return (
    timeScale(positionedActivity.finish) - timeScale(positionedActivity.start)
  );
}

export function getRectHeight(
  timeOrientation: Orientation,
  rectBreathInTimeAxis: PositionInAxis,
  rectBreadthInResourceAxis: number,
  positionedActivity: PositionedActivity
): number {
  return timeOrientation === Orientation.Vertical
    ? rectBreathInTimeAxis(positionedActivity)
    : rectBreadthInResourceAxis;
}

export function getRectWidth(
  timeOrientation: Orientation,
  rectBreathInTimeAxis: PositionInAxis,
  rectBreadthInResourceAxis: number,
  positionedActivity: PositionedActivity
) {
  return timeOrientation === Orientation.Vertical
    ? rectBreadthInResourceAxis
    : rectBreathInTimeAxis(positionedActivity);
}

export function createActivityRectangle(
  transform: ActivityTransform,
  width: PositionInAxis,
  height: PositionInAxis,
  fontSize: number,
  positionedActivity: PositionedActivity
): ActivityRectangle {
  const rectWidth = width(positionedActivity);
  const rectHeight = height(positionedActivity);
  return {
    id: positionedActivity.id,
    title: positionedActivity.type,
    showTitle: shouldShowActivityTitle(rectHeight, fontSize),
    transform: transform(positionedActivity),
    width: rectWidth,
    height: rectHeight
  };
}

function shouldShowActivityTitle(height: number, fontSize: number): boolean {
  const labelPaddingEachSide = 1;
  const minHeightToShowLabel = fontSize + labelPaddingEachSide * 2;

  return height >= minHeightToShowLabel; // TODO consider orientation
}
