import React from 'react';
import StakePoolCard from './StakePoolCard';
import { StakePoolData } from '@/model/StakePool';
import { Wallet } from '@/model/Wallet';

const chunkPools = (array: StakePoolData[], chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

interface ValueProps {
  stakePools: StakePoolData[];
  wallet: Wallet;
  setSelectedPool: (pool: StakePoolData) => void;
}

const StakePoolList: React.FC<ValueProps> = ({ stakePools, wallet, setSelectedPool }) => {
  const countPerRow = 4;
  const poolChunks = chunkPools(stakePools, countPerRow);

  // TODO instead of 'pool1qqqqqdk4zhsjuxxd8jyvwncf5eucfskz0xjjj64fdmlgj735lr9' -> wallet.delegation.active.target
  return (
    <>
      { poolChunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="flex gap-4 justify-center">
          { chunk.map((pool: StakePoolData, index: number) => (
              <div style={{ width: "300px" }}>
                <StakePoolCard key={index} pool={pool} delegate={'pool1qqqqqdk4zhsjuxxd8jyvwncf5eucfskz0xjjj64fdmlgj735lr9' !== pool.pool_id} wallet={wallet} setSelectedPool={() => setSelectedPool(pool)} />
              </div>
            ))
          }
        </div>
      ))}
    </>
  );
};

export default StakePoolList;