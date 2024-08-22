'use client';
import { useState, useMemo } from 'react';
import {Input, Button, Link} from "@nextui-org/react";
import { CheckIcon } from './icons/CheckIcon';
import { FireIcon } from './icons/FireIcon';

export default function Footer() {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);

    function validateEmail(email: string): boolean {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(email);
    }

    function isInvalid(isSubmitted: boolean): boolean {
        if(!isSubmitted || value === ""){
            return false;
        }
        return validateEmail(value) ? false : true;
    };

    function updateEmail(email: string): void {
        setValue(email);
        setSubmitted(false);
        setSuccess(false);
    } 
    
    function submitEmail(): void {
        setSubmitted(true);
        if(!isInvalid(true) && value !== ""){
            setValue("");
            setSubmitted(false);
            setSuccess(true);

            // TODO: implement email feature
        }
    }

    return (
        <footer className='footer-container'>
            <div className='footer'>
                <div className="footer-logo">
                    <span id="icon">
                        <FireIcon height={72} width={72} />
                    </span>
                    <span id="copyright">© Vyre 2024</span>
                </div>
                <div className='footer-links'>
                    <div className="footer-col">
                        <h2 className="font-bold">Browse</h2>
                        <ul>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Docs</a></li>
                            <li><a href="#">Download</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h2 className="font-bold">Resources</h2>
                        <ul>
                            <li><a href="#">Blockchain</a></li>
                            <li><a href="#">Cardano</a></li>
                            <li><a href="#">EUTXO</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h2 className="font-bold">Company</h2>
                        <ul>
                            <li><a href="#">Mission</a></li>
                            <li><a href="#">Team</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h2 className="font-bold">Socials</h2>
                        <ul>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">X</a></li>
                        </ul>
                    </div>
                    <div className="footer-email">
                        <div className='flex flex-row gap-3'>
                            <Input
                                size='md'
                                value={value}
                                description={success ? "Thank you for subscribing!" : "Sign up for our newsletter if you want to receive frequent updates."}
                                type="email"
                                placeholder="Enter your email"
                                variant="bordered"
                                isInvalid={isInvalid(submitted)}
                                color={success ? "success" : (isInvalid(submitted) ? "danger" : "secondary")}
                                errorMessage="Please enter a valid email"
                                onValueChange={updateEmail}
                                className="max-w-xs"                          
                            />
                            <Button color="secondary" onClick={() => submitEmail()}>
                                {success ? <CheckIcon /> : <Link className='text-white'>Submit</Link>}
                            </Button>  
                        </div>
                    </div>
                </div>
                
            </div>
        </footer>
    );
}
