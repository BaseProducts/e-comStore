import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import SEO from "../components/SEO";
import { BASE_URL } from "@/lib/utils";
import banner1 from "@/assets/banner1.png";
import poster from "@/assets/poster.png";

const AboutUs = () => {
    const [dynamicBanner, setDynamicBanner] = useState(banner1);
    const [dynamicPoster, setDynamicPoster] = useState(poster);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/settings`);
                const { data } = await res.json();
                if (data?.banner_image_1) setDynamicBanner(data.banner_image_1);
                if (data?.purpose_image) setDynamicPoster(data.purpose_image);
            } catch (e) {
                console.error("Failed to fetch settings", e);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-orange-500/30">
            <SEO 
                title="Our Story | Founded on the Word, Guided by Faith"
                description="Base Products was founded in 2018 by a pastoral family from Los Angeles to represent the Kingdom of God through premium faith-driven apparel."
                keywords="base products story, base products mission, christian clothing brand, faith apparel, kingdom of god, pastoral family los angeles"
                canonicalUrl="https://baseproducts.online/about"
            />
            <Navbar />

            {/* Hero Section with banner1 background */}
            <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-16 md:py-28 px-4 sm:px-6 overflow-hidden bg-zinc-950 text-white">
                {/* Background Image with low opacity */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url(${dynamicBanner})` }}
                />
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40 z-10" />
                
                <div className="container mx-auto relative z-20 text-center max-w-4xl space-y-4 md:space-y-6">
                    <motion.span 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs bg-orange-950/40 border border-orange-900/50 px-3.5 py-1.5 rounded-full inline-block"
                    >
                        Our Story & Purpose
                    </motion.span>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl xs:text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight"
                    >
                        Founded on <br className="hidden md:inline" /> <span className="text-orange-500">The Word</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs xs:text-sm md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans font-medium"
                    >
                        We don't just sell apparel. We carry a message, wear a purpose, and proclaim a Kingdom.
                    </motion.p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-white border-y border-zinc-200 px-4 sm:px-6">
                <div className="container mx-auto max-w-4xl text-center space-y-8 md:space-y-12">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-5xl font-black tracking-tight text-zinc-900 uppercase"
                    >
                        OUR STORY
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8 text-zinc-650 font-sans leading-relaxed text-sm md:text-base max-w-3xl mx-auto"
                    >
                        <p>
                            Base Products was founded in 2018 with a purpose that goes far beyond creating apparel. It was established to represent the Kingdom of God through every piece we produce, carrying a message of faith, hope, and transformation wherever we go.
                        </p>

                        <p>
                            We are a pastoral family honored to serve the Lord by shepherding the Church of Los Angeles, California. Throughout this journey, we have come to understand that our calling extends beyond the pulpit. God has entrusted us with the mission of helping build a strong Christian identity in people's lives, encouraging men, women, young people, and families to live according to the values of the Gospel in every area of life.
                        </p>

                        <p>
                            It was from this vision that Base Products was born.
                        </p>
                        
                        <div className="border-l-4 border-orange-500 pl-4 md:pl-6 italic text-zinc-800 text-base md:text-xl font-semibold text-left my-6 py-1.5">
                            "But as for me and my house, we will serve the Lord."
                            <span className="block text-sm text-orange-600 font-black mt-2 not-italic tracking-widest uppercase">— Joshua 24:15</span>
                        </div>
                        
                        <p>
                            This verse is more than a reference to us; it is the foundation upon which our family, our ministry, and our company have been built.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision & Mission Section (featuring poster.png) */}
            <section className="py-12 md:py-20 bg-white px-4 sm:px-6">
                <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    {/* Image Block */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-2xl -z-10 transform translate-x-3 translate-y-3" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-200"
                        >
                            <img 
                                src={dynamicPoster} 
                                alt="Base Products — An Expression of Faith" 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 space-y-6 lg:pl-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-650 bg-orange-50 px-2 py-1 rounded">
                            Our Vision
                        </span>
                        <h2 className="text-2xl md:text-5xl font-black tracking-tight text-zinc-950 uppercase">
                            An expression of our faith.
                        </h2>
                        <div className="space-y-4 text-zinc-650 font-sans text-sm md:text-base leading-relaxed font-medium">
                            <p>
                                We believe that clothing is more than appearance. Every garment communicates a message, reflects values, and expresses an identity. That is why we have chosen to build a brand founded on the principles of God's Word, with Christ at the center of everything we do.
                            </p>
                            <p>
                                Base Products exists so that every person who wears our brand carries a purpose. We want our apparel to be a tool for sharing faith, opening doors for conversations about Jesus, and reminding the world that we are called to live lives that glorify God.
                            </p>
                            <p>
                                More than a brand, we are an expression of our faith. Every design is created with the desire to impact lives, strengthen Christian identity, and proclaim the love of Christ through excellence, hard work, and personal testimony.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Pillars / Values */}
            <section className="py-16 md:py-24 px-4 sm:px-6 bg-zinc-50 border-t border-zinc-200">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12 md:mb-16 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-650 bg-orange-50 px-2.5 py-1 rounded">
                            Our Foundation
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-zinc-900">
                            The Pillars of Base
                        </h2>
                        <div className="h-1 w-12 bg-orange-500 mx-auto rounded"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                num: "01",
                                title: "Glorify God",
                                desc: "Everything we do — from design to delivery — is rooted in our desire to bring glory to God and honor His name through excellence."
                            },
                            {
                                num: "02",
                                title: "Serve People",
                                desc: "We exist to serve our community and customers, helping build a strong Christian identity in men, women, young people, and families."
                            },
                            {
                                num: "03",
                                title: "Expand His Kingdom",
                                desc: "Our apparel is a tool for sharing faith and opening doors for conversations about Jesus, proclaiming the love of Christ to the world."
                            }
                        ].map((pillar, i) => (
                            <motion.div 
                                key={pillar.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                            >
                                {/* Subtle corner highlight */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="space-y-4">
                                    <span className="font-mono text-4xl font-black text-orange-500/20 group-hover:text-orange-500/40 transition-colors block">
                                        {pillar.num}
                                    </span>
                                    <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-900 group-hover:text-orange-600 transition-colors">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-zinc-600 text-xs md:text-sm leading-relaxed font-sans font-medium">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing Statement */}
            <section className="py-16 md:py-20 bg-zinc-950 text-white px-4 sm:px-6">
                <div className="container mx-auto max-w-3xl text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                            Welcome to <span className="text-orange-500">Base Products</span>.
                        </h2>
                        <div className="space-y-1 text-sm md:text-base text-zinc-400 font-semibold">
                            <p>Founded on the Word.</p>
                            <p>Guided by Faith.</p>
                            <p>Committed to the Kingdom of God.</p>
                        </div>
                        <div className="h-1 w-16 bg-orange-500 mx-auto rounded mt-6"></div>
                        <p className="text-xs md:text-sm text-zinc-500 italic pt-4 max-w-xl mx-auto leading-relaxed">
                            Our mission is simple yet powerful: to glorify God, serve people, and expand His Kingdom through everything He has entrusted into our hands.
                        </p>
                    </motion.div>
                </div>
            </section>

            <FooterSection />
        </div>
    );
};

export default AboutUs;
