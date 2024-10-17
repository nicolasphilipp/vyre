import { EpochTime, State, Tip } from "./Wallet";

export interface NetworkInformation {
    network_info: NetworkInfo;
    network_tip: Tip;
    next_epoch: EpochTime;
    sync_progress: State;
}

interface NetworkInfo {
    network_id: string;
    protocol_magic: number;
}