import { Children, ReactNode } from 'react';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
}

export default function LayoutContainer(props: LayoutProps) {
  return (
    <div className='font-mulish bg-gray-100 min-h-screen xl:p-24 xl:px-96 text-slate-700 sm:py-8 sm:px-12'>
      <div
        className={`bg-white shadow-md px-16 py-8 rounded-xl ${props.className}`}
      >
        {props.children}
      </div>
    </div>
  );
}
