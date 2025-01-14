import { AccordionItem, Divider, Link, Snippet, Tooltip } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { formatNumber } from "@/services/TextFormatService";
import TransactionListAccordionEntry from "./TxListAccordionEntry";
import { Transaction } from "@/model/Transaction";
import React from "react";
import { BoxIcon } from "./icons/BoxIcon";
import { TimestampIcon } from "./icons/TimestampIcon";
import { TransactionHashIcon } from "./icons/TransactionHashIcon";
import { EpochIcon } from "./icons/EpochIcon";
import { ReceiverIcon } from "./icons/ReceiverIcon";
import { SenderIcon } from "./icons/SenderIcon";
import { SlotIcon } from "./icons/SlotIcon";
import { AbsoluteSlotIcon } from "./icons/AbsoluteSlotIcon";

interface ValueProps {
  transaction: Transaction;
}

const TxListDetailEntry: React.FC<ValueProps> = ({ transaction }) => {

  return (
    <>
      {
        transaction &&
        <div className="flex justify-between overflow-hidden">
          <div className="flex flex-col w-full gap-3">
            <div className="flex gap-3 w-full">
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <TransactionHashIcon width={20} height={20} />
                  <span>Transaction Hash </span>
                </div>
                <span className="text-sm" style={{overflowWrap: "anywhere"}}>{transaction.id}</span>
              </div>
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <TimestampIcon width={20} height={20} />
                  <span>Timestamp </span>
                </div>
                <span className="text-sm">{transaction.inserted_at && new Date(transaction.inserted_at.time).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <EpochIcon width={20} height={20} />
                  <span>Epoch</span>
                </div>
                <span className="text-sm">{transaction.inserted_at.epoch_number}</span>
              </div>
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <SlotIcon width={20} height={20} />
                  <span>Slot </span>
                </div>
                <span className="text-sm">{transaction.inserted_at.slot_number}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full break-words">
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <BoxIcon width={20} height={20} />
                  <span>Block </span>
                </div>
                <span className="text-sm">{transaction.inserted_at.height.quantity}</span>
              </div>
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <AbsoluteSlotIcon width={20} height={20} />
                  <span>Absolute Slot </span>
                </div>
                <span className="text-sm">{transaction.inserted_at.absolute_slot_number}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full break-words">
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <ReceiverIcon width={20} height={20} />
                  <span>Receiver Address </span>
                </div>
                <span className="text-sm" style={{overflowWrap: "anywhere"}}>{transaction.outputs[0] && transaction.outputs[0].address}</span>
              </div>
              <div className="flex flex-col overview-highlight-card p-2 w-1/2">
                <div className="flex gap-0.5 items-center text-white">
                  <SenderIcon width={20} height={20} />
                  <span>Sender Address </span>
                </div>
                <span className="text-sm" style={{overflowWrap: "anywhere"}}>{transaction.inputs[0] ? transaction.inputs[0].address : transaction.outputs[1] ? transaction.outputs[1].address : ""}</span>
              </div>
            </div>
        
            <div className="flex justify-end">
              <Link color='secondary' className='wallet-nav-link' href={"https://preview.cardanoscan.io/transaction/" + transaction.id} isExternal>
                view on cardanoscan.io
                <ArrowIcon width={16} height={16} className='mb-0.5 rotate-45' />
              </Link>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default TxListDetailEntry;