"use client";

import Link from 'next/link';
import Carousel from './Carousel';

interface RoomCardProps {
    title: string;
    description: string;
    price: number;
    images: string[];
}

export default function RoomCard({ title, description, price, images }: RoomCardProps) {
    return (
        <div className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
            <div className="relative h-72 overflow-hidden">
                {/* Carousel with autoSlide disabled for cards */}
                <Carousel images={images} className="h-full" autoSlide={false} />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-pink-900 shadow-sm z-10">Popular</div>
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
