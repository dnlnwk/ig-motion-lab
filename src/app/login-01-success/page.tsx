'use client';
import Image from 'next/image';
import { ContactForm } from './contact-form';

export default function Page() {
    return (
        <div
            onClick={() => document.querySelector('button')?.click()}
            className="relative flex flex-1 items-center justify-center overflow-hidden">
            <Image src="/bg/1.webp" alt="" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 flex w-full items-center justify-center p-6">
                <ContactForm />
            </div>
        </div>
    );
}
