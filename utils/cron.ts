import dayjs from 'dayjs';
import parser from 'cron-parser';
import * as cronjsMatcher from '@datasert/cronjs-matcher';
import { Cron } from 'croner';
import { parse } from '@datasert/cronjs-parser';

export const getIntervals = (
  expression: string,
  period: 'day' | 'week' | 'month' | 'year',
  date = new Date()
) => {
  const currentDate = dayjs(date);

  return parser.parseExpression(expression, {
    // currentDate: currentDate.toDate(),
    currentDate: currentDate.toDate(),
    startDate: currentDate.startOf(period).toDate(),
    endDate: currentDate.endOf(period).toDate(),
    iterator: true,
  });
};

export const getOccurences = (intervals: parser.CronExpression<true>) => {
  let count = 0;
  let occurences: Date[] = [];
  while (intervals.hasNext()) {
    const d = intervals.next();
    count++;
    occurences.push(d.value.toDate());
  }
  intervals.reset();
  while (intervals.hasPrev()) {
    const d = intervals.prev();
    count++;
    occurences.unshift(d.value.toDate());
  }
  // console.log(occurences);
  return { count, occurences: occurences };
};

export const getMatches = (
  expr: string,
  option: { period: 'week' | 'month' | 'year' }
) => {
  // console.log(expr);
  const cron = parse(expr, { hasSeconds: false });
  const currentDate = dayjs(new Date());
  const options = {
    startAt: currentDate.startOf(option.period).toISOString(),
    endAt: currentDate.endOf(option.period).toISOString(),
  };
  const matches = cronjsMatcher.getFutureMatches(cron, {
    ...options,
    matchCount: 10000,
  });
  // console.log(matches);
  return matches;
};

export function getScheduledDates(
  expression: string,
  option: { period: 'month' | 'week' | 'year' }
) {
  // console.log(expression);
  const currentDate = dayjs(new Date());
  const cron = new Cron(expression, {
    maxRuns: Infinity,
  });
  console.log(cron.next(currentDate.startOf(option.period).toDate()));
  const scheduleDates = cron.enumerate(10);
  console.log(scheduleDates);
  return scheduleDates;
}
