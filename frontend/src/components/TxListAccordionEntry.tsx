import { Tooltip } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { formatDate, formatNumber } from "@/services/TextFormatService";
import { Transaction } from "@/model/Transaction";
import { loveLaceToAda } from "@/Constants";
import React from "react";

interface ValueProps {
  transaction: Transaction;
}

const TxListAccordionEntry: React.FC<ValueProps> = ({ transaction }) => {
  const isLoveLace = transaction.amount.unit === "lovelace";

  return (
    <>
      {
        transaction && transaction.direction === "incoming" && 
          <div className="flex justify-between items-center mt-2 text-success">
            <div className="transaction-row">
              <div className="transaction-date-container">
                <span>{transaction.inserted_at && formatDate(transaction.inserted_at.time)}</span>
              </div>
              <div className="flex w-full justify-between">
                <span>{formatNumber(isLoveLace ? transaction.amount.quantity / loveLaceToAda : transaction.amount.quantity, 6)} {isLoveLace ? "ADA" : transaction.amount.unit}</span>
                <ArrowIcon width={20} height={20} className="rotate-45" />
              </div>
            </div>
          </div>
      }
      {
        transaction && transaction.direction === "outgoing" &&
          <div className="flex justify-between items-center mt-2 text-danger">
            <div className="transaction-row">
              <div className="transaction-date-container">
                <span>{transaction.inserted_at && formatDate(transaction.inserted_at.time)}</span>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-col">
                  <span>{formatNumber(isLoveLace ? transaction.amount.quantity / loveLaceToAda : transaction.amount.quantity, 6)} {isLoveLace ? "ADA" : transaction.amount.unit}</span>
                  <span className="text-xs ml-3 flex">
                    Fee: {formatNumber(isLoveLace ? transaction.fee.quantity / loveLaceToAda : transaction.fee.quantity, 6)} {isLoveLace ? "ADA" : transaction.amount.unit}
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
                      <span><DangerIcon width={10} height={10} /></span>
                    </Tooltip>
                  </span>
                </div>
                <ArrowIcon width={20} height={20} style={{ transform: "rotate(135deg)" }} />
              </div>
            </div>
          </div>
      }
    </>
  );
}

export default TxListAccordionEntry;