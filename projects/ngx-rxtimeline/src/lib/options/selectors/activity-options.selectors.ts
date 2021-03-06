import { createSelector } from '../../store-lib/selector/create-selector';
import { selectOptions } from '../../store/state';
import { selectTypeOptions } from './type-options.selectors';
import { partialApply } from '../../core/function-utils';
import { ActivityOptions, TypeOptions } from '../options';
import { partial } from '../../core/partial';

const selectActivityOptions = createSelector(
  selectOptions,
  options => options.activity
);

const selectTypeActivityOptions = createSelector(
  selectTypeOptions,
  partialApply(getTypeActivityOptions)
);

function getTypeActivityOptions(
  type: string,
  typeOptions: (type: string) => TypeOptions
): ActivityOptions {
  return typeOptions(type) && typeOptions(type).activity;
}

const selectGetTypeActivityOption = <TOption extends keyof ActivityOptions>(
  key: TOption
) =>
  createSelector(selectTypeActivityOptions, options =>
    partial(getTypeActivityOption, options, key)
  );

function getTypeActivityOption<TOption extends keyof ActivityOptions>(
  typeActivityOptions: (type: string) => ActivityOptions,
  key: TOption,
  type: string
): ActivityOptions[TOption] {
  return typeActivityOptions(type) && typeActivityOptions(type)[key];
}

const selectGetGlobalActivityOption = <TOption extends keyof ActivityOptions>(
  key: TOption
) => createSelector(selectActivityOptions, options => options[key]);

const selectGetActivityOption = <TOption extends keyof ActivityOptions>(
  key: TOption
) =>
  createSelector(
    selectGetTypeActivityOption(key),
    selectGetGlobalActivityOption(key),
    partialApply(getActivityOption)
  );

function getActivityOption<T>(
  type: string,
  typeActivityOption: (type: string) => T,
  globalActivityOption: T
): T {
  return typeActivityOption(type) || globalActivityOption;
}

export const selectGetActivityDisableDrag = selectGetActivityOption(
  'disableDrag'
);
export const selectGetActivityFontFace = selectGetActivityOption('fontFace');
export const selectGetActivityFontSize = selectGetActivityOption('fontSize');
export const selectGetActivityPadding = selectGetActivityOption('padding');
