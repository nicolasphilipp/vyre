import { AccordionItem, Divider, Link, Snippet, Tooltip } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { formatNumber } from "@/services/TextFormatService";
import TransactionListAccordionEntry from "./TransactionListAccordionEntry";
import { Transaction } from "@/model/Transaction";

interface ValueProps {
  transaction: Transaction;
}

const TransactionListDetailEntry: React.FC<ValueProps> = ({ transaction }) => {
  const loveLaceToAda = 1000000;
  const isLoveLace = transaction.amount.unit === "lovelace";

  return (
    <div className="flex justify-between overflow-hidden">
      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-3 w-full">
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Transaction Hash </span>
            <span className="text-sm" style={{overflowWrap: "anywhere"}}>{transaction.id}</span>
          </div>
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Timestamp </span>
            <span className="text-sm">{new Date(transaction.inserted_at.time).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Epoch / Slot </span>
            <span className="text-sm">{transaction.inserted_at.epoch_number} / {transaction.inserted_at.slot_number}</span>
          </div>
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Absolute Slot </span>
            <span className="text-sm">{transaction.inserted_at.absolute_slot_number}</span>
          </div>
        </div>

        <div className="flex gap-3 w-full break-words">
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Block </span>
            <span className="text-sm">{transaction.inserted_at.height.quantity}</span>
          </div>
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Placeholder </span>
            <span className="text-sm">Placeholer</span>
          </div>
        </div>

        <div className="flex gap-3 w-full break-words">
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Receiver Address </span>
            <span className="text-sm" style={{overflowWrap: "anywhere"}}>{transaction.outputs[0] && transaction.outputs[0].address}</span>
          </div>
          <div className="flex flex-col overview-highlight-card p-2 w-1/2">
            <span className="text-white">Sender Address </span>
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
  );
}

export default TransactionListDetailEntry;