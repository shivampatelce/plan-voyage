import type React from 'react';
import { Skeleton } from './skeleton';

const SkeletonCard: React.FC = () => {
  return (
    <div className='flex flex-col space-y-3 space-x-3'>
      <Skeleton className='h-[140px] w-[250px] rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
};

export default SkeletonCard;
