import React from 'react';
import type { SVGProps } from 'react';

export function PledgeIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M17.825 6.175L20.65 3.35q.3-.3.713-.3t.712.3t.3.713t-.3.712L18.525 8.3q-.3.3-.7.3t-.7-.3L15.7 6.875q-.275-.275-.275-.687t.275-.713q.3-.3.713-.3t.712.3zM12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h5q.425 0 .713.288T13 4t-.288.713T12 5H7v12.95l5-2.15l5 2.15V12q0-.425.288-.712T18 11t.713.288T19 12v5.975q0 1.075-.9 1.663t-1.9.162zm0-13H7h6z"></path></svg>);
}

// https://icon-sets.iconify.design/material-symbols/bookmark-added-outline-rounded/