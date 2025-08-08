import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const previewImages = [
    {
        src: '/assets/profile.png',
        alt: 'Lynkr profile view on desktop',
        caption: 'Beautiful, customizable profiles that showcase your content'
    },
    {
        src: '/press/dashboard.png',
        alt: 'Lynkr user dashboard',
        caption: 'Fully responsive design optimized for all devices'
    },
    {
        src: '/press/analytics.png',
        alt: 'Lynkr analytics dashboard',
        caption: 'Powerful analytics to track engagement and growth'
    },
    {
        src: '/press/customization.png',
        alt: 'Lynkr customization options',
        caption: 'Endless customization options to match your brand'
    }
];

const PreviewCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-advance the carousel
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % previewImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % previewImages.length);
    };

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + previewImages.length) % previewImages.length);
    };

    const goToSlide = (index) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    return (
        <section className="w-full py-24 bg-[#f8ebeb]">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-extrabold text-gray-800 sm:text-4xl">
                        See Lynkr in action
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600">
                        Create beautiful, organized link pages that drive engagement and showcase your content professionally
                    </p>
                </div>

                <div className="relative">
                    {/* Main carousel area */}
                    <div className="relative flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="relative"
                            >
                                <div className="relative">
                                    <Image
                                        className="border border-gray-700 rounded-lg shadow-2xl"
                                        src={previewImages[currentIndex].src}
                                        alt={previewImages[currentIndex].alt}
                                        height={700}
                                        width={1200}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/70 to-transparent rounded-b-lg">
                                        <p className="text-white text-lg">{previewImages[currentIndex].caption}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Previous/Next Buttons */}
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation dots */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {previewImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-blue-500 w-6'
                                    : 'bg-gray-500 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PreviewCarousel;
