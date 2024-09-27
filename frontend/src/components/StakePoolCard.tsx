import { Divider, Link, Progress, Snippet, Tooltip, Image } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { cutText, formatNumber, numberToPercent, parseDate } from "@/services/TextFormatService";
import { Transaction } from "@/model/Transaction";
import { DelegationStatus } from "@/model/Wallet";
import { setActiveItem } from "@/services/NavbarHelperService";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { StakePool, StakePoolData } from "@/model/StakePool";
import { loveLaceToAda } from "@/Constants";

interface ValueProps {
    pool: StakePoolData;
}

const StakePoolCard: React.FC<ValueProps> = ({ pool }) => {

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
    <div className="overview-highlight-card p-2 mt-2">
        <div className="flex flex-col">
            <Link color='secondary' className='wallet-nav-link absolute top-2 right-2' href={pool.url} isExternal>
                <ExternalLinkIcon width={16} height={16} />
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
                <span>{cutText(pool.pool_id, 20)}</span>
            </Snippet>

            <Divider className="mb-1" />
                  

            <div className="flex gap-4 items-center">
                <span>Saturation</span>
                <div className="flex gap-2 items-center w-full">
                    <Progress color="secondary" value={parseFloat(numberToPercent(pool.saturation, 2))} />
                    <span>{numberToPercent(pool.saturation, 2)}</span>
                </div>
            </div>
            <div className="flex justify-between">
                <span>Pledge </span>
                <span>₳ {formatNumber(parseFloat(pool.pledge) / loveLaceToAda, 2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Fees </span>
                <span>₳ {formatNumber(parseFloat(pool.tax_fix) / loveLaceToAda, 2)} ({pool.tax_ratio}%)</span>
            </div>
            <Divider className="my-1"/>
                  
            <span>APY: ~{pool.roa_short}%</span>
        </div>
    </div>
  );
}

export default StakePoolCard;