import { StakePoolData, StakePoolListDto } from "@/model/StakePool";
import { getAllPools } from "@/services/StakeService";
import { BreadcrumbItem, Breadcrumbs, Input, Pagination, ScrollShadow, Image, Snippet, Divider, Progress, Tooltip, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { GlobalIcon } from "./icons/GlobalIcon";
import { SearchIcon } from "./icons/SearchIcon";
import StakePoolList from "./StakePoolList";
import { Wallet } from "@/model/Wallet";
import useWalletStore from "@/model/WalletState";
import { cutText, extractTicker, formatNumber, numberToPercent } from "@/services/TextFormatService";
import { SaturationIcon } from "./icons/SaturationIcon";
import { PledgeIcon } from "./icons/PledgeIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { loveLaceToAda } from "@/Constants";
import { HandCoinIcon } from "./icons/HandCoinIcon";
import { DelegatorIcon } from "./icons/DelegatorIcon";
import DelegateModal from "./DelegateModal";
import { ActiveStakeIcon } from "./icons/ActiveStakeIcon";
import { BoxesIcon } from "./icons/BoxesIcon";
import { BoxIcon } from "./icons/BoxIcon";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { LiveStakeIcon } from "./icons/LiveStakeIcon";
import { LuckIcon } from "./icons/LuckIcon";
import { ProjectedBoxIcon } from "./icons/ProjectedBoxIcon";
import { RecentApyIcon } from "./icons/RecentApyIcon";
import { RocketIcon } from "./icons/RocketIcon";
import { WebsiteIcon } from "./icons/WebsiteIcon";
import PoolHistoryChart from "./PoolHistoryChart";
import PoolSocials from "./PoolSocials";

export default function BrowsePoolSection() {   
    const { wallets, selected } = useWalletStore();
    const [selectedWallet, setSelectedWallet] = useState({} as Wallet);
    const [stakePools, setStakePools] = useState([] as StakePoolData[]);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [currentBreadCrumb, setCurrentBreadCrumb] = useState("Browse Pools");
    const [selectedPool, setSelectedPool] = useState({} as StakePoolData);

    useEffect(() => {
        for(let i = 0; i < wallets.length; i++) {
          if(wallets[i].id === selected) {
            setSelectedWallet(wallets[i]);
          }
        }
      }, [selected]);

    useEffect(() => {
        if(currentBreadCrumb === "Browse Pools") {
          setSelectedPool({} as StakePoolData);
        }
    }, [currentBreadCrumb]);

    function changeSelectedPool(pool: StakePoolData) {
        setSelectedPool(pool);
    }

    useEffect(() => {
        if(selectedPool.pool_id) {
          setCurrentBreadCrumb(selectedPool.pool_id);
        }
    }, [selectedPool]);

    useEffect(() => {
        getAllPools(currentPage, 8, search)
            .then(res => {
                let listDto = res as StakePoolListDto;
                setTotalPages(listDto.totalPages);
                setStakePools(listDto.pools);
            });
    }, [currentPage, search]);

    return (
        <div className="col-span-5 row-span-3 p-4 overview-card gap-2 flex-col break-words">
            <div className="flex gap-4 items-center">
              <Breadcrumbs onAction={(key) => setCurrentBreadCrumb(key as string)}>
                <BreadcrumbItem key={"Browse Pools"} isCurrent={currentBreadCrumb === "Browse Pools"}>
                  <div className="flex gap-0.5 items-center">
                    <span className="text-xl">Browse Pools</span>
                    <GlobalIcon width={20} height={20} />
                  </div>
                </BreadcrumbItem>
                
                {
                  selectedPool && selectedPool.pool_id && 
                  <BreadcrumbItem key={selectedPool.pool_id} isCurrent={currentBreadCrumb === selectedPool.pool_id}>{selectedPool.name}</BreadcrumbItem>
                }
              </Breadcrumbs>
            </div>

            {
              selectedPool && !selectedPool.pool_id && 
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex w-fit">
                    <Input type="text" isClearable variant="bordered" label="Search" placeholder="Type to search..." startContent={<SearchIcon className="text-white mb-0.5" width={16} height={16} />} value={search} onValueChange={setSearch} />
                  </div>

                  <div className="w-full" style={{height: "270px"}}>
                    <ScrollShadow className="h-full gap-2 flex flex-col overflow-x-hidden" size={20}>
                      <StakePoolList stakePools={stakePools} wallet={selectedWallet} setSelectedPool={changeSelectedPool} />                    
                    </ScrollShadow>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Pagination 
                    total={totalPages} 
                    variant="faded" 
                    color="secondary" 
                    showControls 
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                </div>
              </div>
            }
            {
              selectedPool && selectedPool.pool_id && 
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex gap-3 items-center">
                    <Image
                      alt={selectedPool.name}
                      height={50}
                      radius="sm"
                      src={selectedPool.img}
                      width={50}
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span>{extractTicker(selectedPool.name, true)}</span>
                        <span>{extractTicker(selectedPool.name, false)}</span>
                      </div>
                      <div>
                        <Snippet 
                          symbol="" 
                          tooltipProps={{
                            className: "dark"
                          }}
                          codeString={selectedPool.pool_id}
                          size="md"
                          classNames={{
                            base: "p-0 bg-transparent text-inherit",
                            pre: "font-sans"
                          }}
                        >
                          <span>{cutText(selectedPool.pool_id, 30)}</span>
                        </Snippet>
                      </div>
                    </div>
                  </div>
                  <Divider className="mb-2 mt-3" />
                  <div className="flex gap-3 justify-between">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center">
                        <div className="flex gap-0.5 items-center">
                          <SaturationIcon width={18} height={18} />
                          <span>Saturation</span>
                        </div>
                        <div className="flex gap-2 items-center w-full">
                          <Progress color="secondary" key={"progress"} aria-label={"progress"} value={parseFloat(numberToPercent(selectedPool.saturation, 2))} />
                          <span>{numberToPercent(selectedPool.saturation, 2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <div className="flex gap-0.5 items-center">
                            <PledgeIcon width={20} height={20} />
                            <span>Pledge </span>
                            <Tooltip
                              color="warning"
                              className='tooltip-container text-white'
                              content={
                                <div className="px-1 py-2">
                                  <div className="text-small font-bold text-success">Information</div>
                                  <div className="text-tiny">The pledge is the amount of ADA pledged <br></br> by the operator to the pool.</div>
                                </div>
                              }
                            >
                              <span className="-mt-0.5"><DangerIcon width={12} height={12} /></span>
                            </Tooltip>
                          </div>
                        </div>
                        <span>₳ {formatNumber(parseFloat(selectedPool.pledge) / loveLaceToAda, 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="flex gap-0.5 items-center">
                            <HandCoinIcon width={20} height={20} />
                            <span>Fees </span>
                            <Tooltip
                              color="warning"
                              className='tooltip-container text-white'
                              content={
                                <div className="px-1 py-2">
                                  <div className="text-small font-bold text-success">Information</div>
                                  <div className="text-tiny flex flex-col">
                                    <span>The fees consist of a fixed fee and a variable fee (margin).</span>
                                      <span className="mt-1">The fixed fee is deducted from the total rewards of the pool <br></br> to cover stake pool operating costs.</span>
                                      <span className="mt-1">The variable fee is a percentage share of the total rewards <br></br> that the operator receives.</span>
                                  </div>
                                </div>
                              }
                            >
                              <span className="-mt-0.5"><DangerIcon width={12} height={12} /></span>
                            </Tooltip>
                          </div>
                        </div>
                        <span>₳ {formatNumber(parseFloat(selectedPool.tax_fix) / loveLaceToAda, 2)} ({formatNumber(parseFloat(selectedPool.tax_ratio), 2)}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <DelegatorIcon width={20} height={20} />
                          <span>Delegators</span>
                        </div>
                        <span>{selectedPool.delegators}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <ActiveStakeIcon width={20} height={20} />
                          <span>Active Stake</span>
                        </div>
                        <span>₳ {formatNumber(parseFloat(selectedPool.stake_active) / loveLaceToAda, 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <LiveStakeIcon width={20} height={20} />
                          <span>Live Stake</span>
                        </div>
                        <span>₳ {formatNumber(parseFloat(selectedPool.stake) / loveLaceToAda, 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <WebsiteIcon width={20} height={20} />
                          <span>Website</span>
                        </div>
                        <Link color='secondary' href={String(selectedPool.handles.homepage).substring(1, selectedPool.handles.homepage.length - 1)} isExternal>
                          <span>{String(selectedPool.handles.homepage).substring(1, selectedPool.handles.homepage.length - 1)}</span> 
                        </Link>
                      </div>   
                    </div>

                    <Divider orientation="vertical" className="min-h-44 max-h-44" />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <BoxesIcon width={20} height={20} />
                          <span>Blocks Lifetime</span>
                        </div>
                        <span>{selectedPool.blocks_lifetime}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <BoxIcon width={20} height={20} />
                          <span>Blocks this Epoch</span>
                        </div>
                        <span>{selectedPool.blocks_epoch}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <ProjectedBoxIcon width={20} height={20} />
                          <span>Projected Blocks</span>
                        </div>
                        <span>{selectedPool.blocks_est_epoch}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <RecentApyIcon width={20} height={20} />
                          <span>Recent APY</span>
                        </div>
                        <span>~{formatNumber(parseFloat(selectedPool.roa_short), 2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <RocketIcon width={20} height={20} />
                          <span>Lifetime APY</span>
                        </div>
                        <span>~{selectedPool.roa_lifetime}%</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex gap-0.5 items-center">
                          <LuckIcon width={20} height={20} />
                          <span>Luck Lifetime</span>
                        </div>
                        <span>{numberToPercent(parseFloat(selectedPool.luck_lifetime), 2)}</span>
                      </div>
                    </div>
                  </div>

                  {
                    'pool1qqqqqdk4zhsjuxxd8jyvwncf5eucfskz0xjjj64fdmlgj735lr9' !== selectedPool.pool_id && // wallet.delegation.active.target
                    <div>
                      <DelegateModal wallet={selectedWallet} pool={selectedPool} />
                    </div>
                  }

                  <div className="absolute bottom-4 left-4">
                    <PoolSocials pool={selectedPool} />
                  </div>
                  
                  <Link color='secondary' className='wallet-nav-link absolute bottom-2 right-2' href={selectedPool.url} isExternal>
                    <div className="flex gap-0.5 items-center">
                      <span>view on cexplorer.io</span> 
                      <ExternalLinkIcon width={18} height={18} />
                    </div>
                  </Link>
                </div>

                <Divider orientation="vertical" />

                <div className="flex-1"> 
                  <PoolHistoryChart stats={selectedPool.stats} />
                </div>
              </div>
            }
        </div>
    );
}