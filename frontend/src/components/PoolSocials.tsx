import { Divider, Link, Progress, Snippet, Tooltip, Image, Button } from "@nextui-org/react";
import { ArrowIcon } from "./icons/ArrowIcon";
import { DangerIcon } from "./icons/DangerIcon";
import { cutText, extractTicker, formatNumber, numberToPercent } from "@/services/TextFormatService";
import { Transaction } from "@/model/Transaction";
import { DelegationStatus, Wallet } from "@/model/Wallet";
import { setActiveItem } from "@/services/NavbarHelperService";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import { StakePool, StakePoolData } from "@/model/StakePool";
import { loveLaceToAda } from "@/Constants";
import { useEffect, useState } from "react";
import React from "react";
import DelegateModal from "./DelegateModal";
import { HelpIcon } from "./icons/HelpIcon";
import { XLogoIcon } from "./icons/XLogoIcon";
import { YouTubeLogoIcon } from "./icons/YouTubeLogoIcon";
import { TwitchLogoIcon } from "./icons/TwitchLogoIcon";
import { TelegramLogoIcon } from "./icons/TelegramLogoIcon";
import { DiscordLogoIcon } from "./icons/DiscordLogoIcon";
import { GithubLogoIcon } from "./icons/GithubLogoIcon";
import { FacebookLogoIcon } from "./icons/FacebookLogoIcon";

interface ValueProps {
    pool: StakePoolData;
}

const PoolSocials: React.FC<ValueProps> = ({ pool }) => {

    return (
        <>
            {
                pool &&
                <div className="flex gap-2">
                    {
                        pool.handles.twitter_handle &&
                        <Link className="text-white" href={"https://x.com/" + pool.handles.twitter_handle} isExternal>
                            <XLogoIcon width={18} height={18} />
                        </Link>
                    }
                    {
                        pool.handles.telegram_handle &&
                        <Link className="text-white" href={"https://t.me/" + pool.handles.telegram_handle} isExternal>
                            <TelegramLogoIcon width={18} height={18} />
                        </Link>
                    }
                    {
                        pool.handles.discord_handle &&
                        <Link className="text-white" href={"https://discord.com/invite/" + pool.handles.discord_handle} isExternal>
                            <DiscordLogoIcon width={18} height={18} />
                        </Link>
                    }
                    {
                        pool.handles.github_handle &&
                        <Link className="text-white" href={"https://github.com/" + pool.handles.github_handle} isExternal>
                            <GithubLogoIcon width={18} height={18} />
                        </Link>
                    }
                    {
                        pool.handles.facebook_handle &&
                        <Link className="text-white" href={"https://www.facebook.com/" + pool.handles.facebook_handle} isExternal>
                            <FacebookLogoIcon width={18} height={18} />
                        </Link>
                    }
                    {
                        pool.handles.twitch_handle &&
                        <Link className="text-white" href={"https://www.twitch.tv/" + pool.handles.twitch_handle} isExternal>
                            <TwitchLogoIcon width={18} height={18} />
                        </Link>
                    }
                    {
                        pool.handles.youtube_handle &&
                        <Link className="text-white" href={"https://www.youtube.com/@" + pool.handles.youtube_handle} isExternal>
                            <YouTubeLogoIcon width={18} height={18} />
                        </Link>
                    }
                </div>
            }
        </>
    );
}

export default PoolSocials;