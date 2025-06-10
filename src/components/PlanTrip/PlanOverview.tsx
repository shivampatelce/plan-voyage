import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PlanOverview: React.FC = () => {
  return (
    <div className='relative w-full'>
      <div className='relative w-full h-96 overflow-hidden rounded-lg'>
        <img
          src='https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'
          alt='India landscape with taj mahal'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />
      </div>

      <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4'>
        <Card className='bg-white/95 backdrop-blur-sm shadow-2xl border-0'>
          <CardContent className='p-8 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-2'>
              Plan To India
            </h1>
            <p className='text-gray-600 text-lg'>
              Discover the incredible journey that awaits you
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='h-20' />
    </div>
  );
};

export default PlanOverview;
