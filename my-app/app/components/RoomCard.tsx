"use client";

import Link from 'next/link';
import Carousel from './Carousel';

interface RoomCardProps {
    title: string;
    description: string;
    price: number;
    images: string[];
    capacity?: number;
}

export default function RoomCard({ title, description, price, images, capacity }: RoomCardProps) {
    return (
        <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
            <div className="relative h-72 overflow-hidden">
                {/* Carousel with autoSlide disabled for cards */}
                <Carousel images={images} className="h-full" autoSlide={false} />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-pink-900 shadow-sm">
                        Popular
                    </div>
                    {capacity && (
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                            {capacity}
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white/90 mb-2">{title}</h3>
                <p className="text-white/90 mb-6 line-clamp-2">{description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-white/90">${price} <span className="text-sm text-white/90 font-normal">/ noche</span></span>
                    <Link href="/rooms" className="px-5 py-2.5 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition font-medium">
                        Reservar
                    </Link>
                </div>
            </div>
        </div>
    );
}
