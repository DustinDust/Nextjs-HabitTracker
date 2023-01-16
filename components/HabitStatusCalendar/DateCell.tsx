import dayjs, { Dayjs } from 'dayjs';
import { breakPoints } from '../../utils';
import { useMedia } from 'react-use';

export type DateCellProps = {
  children?: React.ReactNode;
  className?: string;
  date: Dayjs;
  onClick?: (() => void) | (() => Promise<void>);
  responsiveStyle?: React.CSSProperties;
  style?: React.CSSProperties;
};

export default function DateCell(props: DateCellProps) {
  const isLg = useMedia(`(min-width: ${breakPoints.lg}px)`, true);

  if (!isLg) {
    return (
      <div
        className={`flex justify-center items-center bg-opacity-5 py-1.5 rounded m-0.5`}
        style={props.responsiveStyle}
        onTouchStart={props.onClick}
        onClick={props.onClick}
      >
        {props.date.date()}
      </div>
    );
  } else
    return (
      <div
        className={`rounded m-0.5 rounded-t-none flex flex-col justify-start items-stretch px-2 py-4 ${
          dayjs(new Date()).isSame(props.date, 'day')
            ? 'border-t-blue-400'
            : 'border-t-gray-200'
        } border-t-2 hover:bg-slate-100 ${props.className || ''}`}
        onClick={props.onClick}
        onTouchStart={props.onClick}
        style={props.style}
      >
        <div className='w-full flex flex-row justify-end mb-3 px-2 '>
          <span>{props.date.date()}</span>
        </div>
        <div className='w-full h-16'>{props.children}</div>
      </div>
    );
}
