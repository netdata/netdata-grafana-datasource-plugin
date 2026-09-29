import { GroupByList } from 'shared/constants';
import { normalizeGroupBy } from 'shared/utils/transformations';

const BUILT_IN_GROUPINGS = GroupByList.map(({ value }) => value);

/**
 * Splits the selected groupings into the two fields the API expects: the built-in ones go to
 * `group_by`, anything else is a label key and goes to `group_by_label` behind a single `label`
 * entry. Combining them is what allows one query to separate series per node AND per label.
 */
export const buildGrouping = (groupBy?: string | string[]) => {
  const group_by: string[] = [];
  const group_by_label: string[] = [];

  normalizeGroupBy(groupBy).forEach((value) => {
    const target = BUILT_IN_GROUPINGS.includes(value) ? group_by : group_by_label;

    if (!target.includes(value)) {
      target.push(value);
    }
  });

  if (group_by_label.length && !group_by.includes('label')) {
    group_by.push('label');
  }

  if (!group_by.length) {
    group_by.push(GroupByList[0].value);
  }

  return { group_by, group_by_label };
};
