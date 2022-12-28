import dayjs from 'dayjs';
import parser from 'cron-parser';

export const getIntervals = (expression: string) => {
  const currentDate = dayjs(new Date());
  const weeklyIntervals = parser.parseExpression(expression, {
    // currentDate: currentDate.toDate(),
    startDate: currentDate.startOf('week').toDate(),
    endDate: currentDate.endOf('week').toDate(),
    iterator: true,
  });
  const monthlyIntervals = parser.parseExpression(expression, {
    // currentDate: currentDate.toDate(),
    startDate: currentDate.startOf('month').toDate(),
    endDate: currentDate.endOf('month').toDate(),
    iterator: true,
  });
  const yearlyIntervals = parser.parseExpression(expression, {
    // currentDate: currentDate.toDate(),
    startDate: currentDate.startOf('year').toDate(),
    endDate: currentDate.endOf('year').toDate(),
    iterator: true,
  });
  return { weeklyIntervals, monthlyIntervals, yearlyIntervals };
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
  return { count, occurences };
};
