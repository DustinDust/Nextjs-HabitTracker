import { Children, ReactNode } from 'react';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
}

export default function LayoutContainer(props: LayoutProps) {
  return (
    <div
      className='font-mulish bg-white min-h-screen lg:py-16 lg:px-48 xl:p-24 xl:px-80 text-slate-700 md:py-16 md:px-12 py-16 sm:bg-gray-100 flex flex-col justify-center md:block'
      style={{ minWidth: '100vw' }}
    >
      <div
        className={`bg-white sm:shadow-md rounded-xl ${props.className || ''}`}
      >
        {props.children}
      </div>
    </div>
  );
}
