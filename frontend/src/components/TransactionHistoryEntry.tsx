import { Tooltip } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { formatNumber } from "@/services/TextFormatService";

interface ValueProps {
    date: string;
    amount: number;
    fee: number;
    currency: string;
}

const TransactionHistoryEntry: React.FC<ValueProps> = ({ date, amount, fee, currency }) => {

    return (
        <>
            {
                amount >= 0 && 
                <div className="flex justify-between items-center mt-2 text-success">
                    <div className="flex flex-row gap-2">
                        <div className="transaction-date-container">
                        <span>{date}</span>
                        </div>
                        <span>+{formatNumber(amount)} {currency}</span>
                    </div>
                    <ArrowIcon width={20} height={20} className="rotate-45" />
                </div>
            }
            {
                amount < 0 &&
                <div className="flex justify-between items-center mt-2 text-danger">
                  <div className="flex flex-row gap-2">
                    <div className="transaction-date-container">
                      <span>{date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span>{formatNumber(amount)} {currency}</span>
                      <span className="text-xs ml-3">
                        Fee: {formatNumber(fee)} {currency}
                        <Tooltip
                          color="warning"
                          className='tooltip-container text-white'
                          content={
                            <div className="px-1 py-2">
                              <div className="text-small font-bold text-success">Information</div>
                              <div className="text-tiny">Cardano uses a transaction fee system that covers the processing <br></br> and long-term storage cost of transactions.</div>
                            </div>
                          }
                        >
                          <span className='absolute'><DangerIcon width={10} height={10} /></span>
                        </Tooltip>
                      </span>
                    </div>
                  </div>
                  <ArrowIcon width={20} height={20} style={{ transform: "rotate(135deg)" }} />
                </div>
            }
        </>
    );
}

export default TransactionHistoryEntry;