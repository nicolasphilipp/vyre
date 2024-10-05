import { Divider, Link, Progress, Snippet, Tooltip, Image, Button } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { cutText, formatNumber, numberToPercent, parseDate } from "@/services/TextFormatService";
import { Transaction } from "@/model/Transaction";
import { DelegationStatus } from "@/model/Wallet";
import { setActiveItem } from "@/services/NavbarHelperService";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { StakePool, StakePoolData } from "@/model/StakePool";
import { loveLaceToAda } from "@/Constants";
import { useEffect, useState } from "react";
import React from "react";
import { ScatterIcon } from "./icons/ScatterIcon";

interface ValueProps {
    pool: StakePoolData;
    delegate: boolean;
}

const StakePoolCard: React.FC<ValueProps> = ({ pool, delegate }) => {
    // TODO implement delegate button

    function extractTicker(name: string, ticker: boolean): string {
        if(name) {
            if(ticker) {
                return name.slice(0, name.indexOf("]") + 1);
            } else {
                return name.slice(name.indexOf("]") + 1);
            }
        } 
        return "";
    }

  return (
    <>
        {
            pool &&
            <div className="overview-highlight-card p-2 mt-2 text-sm">
                <div className="flex flex-col">
                    <Link color='secondary' className='wallet-nav-link absolute top-2 right-2' href={pool.url} isExternal>
                        <ExternalLinkIcon width={18} height={18} />
                    </Link>
                    <div className="flex gap-3 items-center">
                        <Image
                            alt={pool.name}
                            height={50}
                            radius="sm"
                            src={pool.img}
                            width={50}
                        />
                        <div className="flex flex-col">
                            <span>{extractTicker(pool.name, true)}</span>
                            <span>{extractTicker(pool.name, false)}</span>
                        </div>
                    </div>
        
                    <div className="flex items-center justify-between my-1">
                        <Snippet 
                            symbol="" 
                            tooltipProps={{
                                className: "dark"
                            }}
                            codeString={pool.pool_id}
                            size="md"
                            classNames={{
                                base: "p-0 bg-transparent text-inherit",
                                pre: "font-sans"
                            }}
                        >
                            <span>{cutText(pool.pool_id, 15)}</span>
                        </Snippet>
                        {
                            delegate &&
                            <div>
                                <Button size="sm" color="secondary" variant="ghost" className="text-sm" startContent={<ScatterIcon width={18} height={18} className="-m-1" />}>delegate</Button>   
                            </div>
                        }
                    </div>
        
                    <Divider className="my-1" />
                        
        
                    <div className="flex gap-4 items-center">
                        <span>Saturation</span>
                        <div className="flex gap-2 items-center w-full">
                            <Progress color="secondary" key={"progress"} aria-label={"progress"} value={parseFloat(numberToPercent(pool.saturation, 2))} />
                            <span>{numberToPercent(pool.saturation, 2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
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
                                <span className="absolute mt-0.5"><DangerIcon width={12} height={12} /></span>
                            </Tooltip>
                        </div>
                        <span>₳ {formatNumber(parseFloat(pool.pledge) / loveLaceToAda, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <div>
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
                                <span className="absolute mt-0.5"><DangerIcon width={12} height={12} /></span>
                            </Tooltip>
                        </div>
                        <span>₳ {formatNumber(parseFloat(pool.tax_fix) / loveLaceToAda, 2)} ({pool.tax_ratio}%)</span>
                    </div>
                    <Divider className="my-1"/>
                            
                    <div className="flex justify-between">
                        <span>APY</span>
                        <span>~{pool.roa_short}%</span>
                    </div>
                </div>
            </div>
        }
    </>
  );
}

export default StakePoolCard;