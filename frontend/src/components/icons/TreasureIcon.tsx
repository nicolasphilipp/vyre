import React from 'react';
import type { SVGProps } from 'react';

export function TreasureIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 20h20V7c0-.8-.32-1.56-.88-2.12S19.8 4 19 4H5c-.8 0-1.56.32-2.12.88S2 6.2 2 7zm18-9h-5V9H9v2H4V7c0-.26.11-.5.29-.71C4.5 6.11 4.74 6 5 6h14c.27 0 .5.11.71.29c.19.21.29.45.29.71zm-5 2h5v5H4v-5h5l2 2h2zm-4-2h2v2h-2z"></path></svg>);
}

// https://icon-sets.iconify.design/mdi/treasure-chest-outline/