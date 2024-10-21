import React from 'react';
import type { SVGProps } from 'react';

export function ActiveStakeIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={96} height={96} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3s-3.582-3-8-3s-8 1.343-8 3"></path><path d="M4 6v6c0 1.657 3.582 3 8 3c1.118 0 2.182-.086 3.148-.241M20 12V6"></path><path d="M4 12v6c0 1.657 3.582 3 8 3c1.064 0 2.079-.078 3.007-.22M19 16v3m0 3v.01"></path></g></svg>);
}

// https://icon-sets.iconify.design/tabler/database-exclamation/