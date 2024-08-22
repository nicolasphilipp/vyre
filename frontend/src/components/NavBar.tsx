'use client';
import { Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { FireIcon } from './icons/FireIcon';
import { BurgerMenuIcon } from './icons/BurgerMenuIcon';

export default function NavBar() {
    return (
        <header className='nav-bar-container'>
            <div className='nav-bar'>
                <div>
                    <a href="/">
                        <FireIcon height={48} width={48} />
                    </a>
                </div>
                <div className='nav-link-container'>
                    <Link className='nav-link' href="/about">About</Link>
                    <Link className='nav-link' href="/docs">Docs</Link>
                    <Link className='nav-link' href="/learn">Learn</Link>
                </div>
                <div>
                    <div className='nav-burger-container'>
                        <Dropdown backdrop="opaque" classNames={{
                            content: "background"
                        }}>
                            <DropdownTrigger>
                                <Button variant='light'>
                                    <BurgerMenuIcon />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu variant="faded" color="secondary" aria-label="Static Actions" 
                            itemClasses={{
                                base: [
                                    "data-[hover=true]:bg-black/50",
                                    "data-[selectable=true]:focus:bg-black/50",
                                    "data-[focus-visible=true]:bg-black/50",
                                    "border-none"
                                ]
                            }}>
                                <DropdownItem key="about" className='nav-burger-link-container'>
                                    <a className="nav-burger-link" href='/about'>About</a>
                                </DropdownItem>
                                <DropdownItem key="docs" className='nav-burger-link-container'>
                                    <a className="nav-burger-link" href='/docs'>Docs</a>
                                </DropdownItem>
                                <DropdownItem key="learn" className='nav-burger-link-container'> 
                                    <a className="nav-burger-link" href='/learn'>Learn</a>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className='nav-download-container'>
                        <Button color='secondary'>
                            <Link className='text-white' href="/download">Download</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
