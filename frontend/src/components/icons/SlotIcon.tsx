import React from 'react';
import type { SVGProps } from 'react';

export function SlotIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 6l-8 4l8 4l8-4zm-8 8l8 4l8-4"></path></svg>);
}

// https://icon-sets.iconify.design/tabler/stack/