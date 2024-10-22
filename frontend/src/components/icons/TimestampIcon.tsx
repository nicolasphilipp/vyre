import React from 'react';
import type { SVGProps } from 'react';

export function TimestampIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13a7 7 0 1 0 14 0a7 7 0 0 0-14 0m9.5-2.5L12 13m5-5l1-1m-4-4h-4"></path></svg>);
}

// https://icon-sets.iconify.design/tabler/stopwatch/