import { Divider, Link, Progress, Snippet, Tooltip, Image } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { cutText, formatNumber, numberToPercent, parseDate } from "@/services/TextFormatService";
import { Transaction } from "@/model/Transaction";
import { DelegationStatus } from "@/model/Wallet";
import { setActiveItem } from "@/services/NavbarHelperService";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { StakePool } from "@/model/StakePool";

interface ValueProps {
    pool: StakePool;
}

const StakePoolCard: React.FC<ValueProps> = ({ pool }) => {
  const loveLaceToAda = 1000000;  // TODO add global constants

  return (
    <div className="overview-highlight-card p-2 mt-2">
        <div className="flex flex-col">
            <Link color='secondary' className='wallet-nav-link absolute top-2 right-2' href="https://preview.cardanoscan.io/pool/0bf63c6f8504de6d4ed5cf272784e0245632323e7f4bae161c57f527" isExternal>
                <ExternalLinkIcon width={16} height={16} />
            </Link>
            <div className="flex gap-3 items-center">
                <Image
                    alt="Stake Pool Logo"
                    height={40}
                    radius="sm"
                    src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                    width={40}
                />
                <div className="flex flex-col">
                    <span>[ADAR]</span>
                    <span>ADA Rewards</span>
                </div>
            </div>

            <Snippet 
                symbol="" 
                tooltipProps={{
                    className: "dark"
                }}
                codeString={"pool1p0mrcmu9qn0x6nk4eunj0p8qy3tryv370a96u9su2l6jwkytnru"}
                size="md"
                classNames={{
                    base: "p-0 bg-transparent text-inherit",
                    pre: "font-sans"
                }}
            >
                <span>{cutText("pool1p0mrcmu9qn0x6nk4eunj0p8qy3tryv370a96u9su2l6jwkytnru", 20)}</span>
            </Snippet>

            <Divider className="mb-1" />
                  
            <span>
                { pool.metrics && 
                    <div className="flex gap-4 items-center">
                       <span>Saturation</span>
                        <div className="flex gap-2 items-center w-full">
                          <Progress color="secondary" value={parseFloat(numberToPercent(pool.metrics.saturation, 2))} />
                          <span>{numberToPercent(pool.metrics.saturation, 2)}</span>
                        </div>
                    </div>
                }
            </span>
            <span>
                { pool.pledge && 
                    <div className="flex justify-between">
                        <span>Pledge </span>
                        <span>₳ {formatNumber(pool.pledge.quantity / loveLaceToAda, 2)}</span>
                    </div>
                }
            </span>
            <span>
                { pool.margin && pool.cost && 
                    <div className="flex justify-between">
                        <span>Fees </span>
                        <span>₳ {formatNumber(pool.cost.quantity / loveLaceToAda, 2)} ({pool.margin.quantity}%)</span>
                    </div>
                }
            </span>

            <Divider className="my-1"/>
                  
            <span>
                APY: 2.55%
            </span>
        </div>
    </div>
  );
}

export default StakePoolCard;