import React from 'react';
import StakePoolCard from './StakePoolCard';
import { StakePoolData } from '@/model/StakePool';

const chunkPools = (array: StakePoolData[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

interface ValueProps {
    stakePools: StakePoolData[];
}

const StakePoolList: React.FC<ValueProps> = ({ stakePools }) => {
  const countPerRow = 4;
  const poolChunks = chunkPools(stakePools, countPerRow);

  return (
    <>
      { poolChunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="flex gap-4 justify-center">
          { chunk.map((pool: StakePoolData, index: number) => (
                <StakePoolCard key={index} pool={pool} />
            ))
          }
        </div>
      ))}
    </>
  );
};

export default StakePoolList;