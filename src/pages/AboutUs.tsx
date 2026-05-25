import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import SEO from "../components/SEO";
import banner1 from "@/assets/banner1.png";
import poster from "@/assets/poster.png";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-orange-500/30">
            <SEO 
                title="Our Story | Christian Streetwear Movement"
                description="Learn about the mission and vision of Base Products. Discover how we merge premium quality fabrics with unapologetic faith-based streetwear."
                keywords="base products story, base products team, christian clothing brand origin, faith garments message"
                canonicalUrl="https://baseproducts.online/about"
            />
            <Navbar />

            {/* Hero Section with banner1 background */}
            <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center py-16 md:py-28 px-4 sm:px-6 overflow-hidden bg-zinc-950 text-white">
                {/* Background Image with low opacity */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
                    style={{ backgroundImage: `url(${banner1})` }}
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
                        BASE: Streetwear <br className="hidden md:inline" /> <span className="text-orange-500">With A Purpose</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs xs:text-sm md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans font-medium"
                    >
                        We aren't just selling garments; we are carrying a message. Merging premium streetwear silhouettes with unapologetic Christian values to speak to a chosen generation.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24 bg-white border-y border-zinc-200 px-4 sm:px-6">
                <div className="container mx-auto max-w-4xl text-center space-y-8 md:space-y-12">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-5xl font-black tracking-tight text-zinc-900 uppercase"
                    >
                        WEAR YOUR FAITH.
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8 text-zinc-650 font-sans leading-relaxed text-sm md:text-base max-w-3xl mx-auto"
                    >
                        <p>
                            The streets are the largest mission field in the world. For too long, the aesthetic of faith-based apparel has been relegated to the background. We built Base to change that paradigm.
                        </p>
                        
                        <div className="border-l-4 border-orange-500 pl-4 md:pl-6 italic text-zinc-800 text-base md:text-xl font-semibold text-left my-6 py-1.5">
                            "Stand firm on the foundation. Spread the Word. Look good doing it."
                        </div>
                        
                        <p>
                            Every garment is meticulously designed with a focus on oversized cuts, heavyweight fabrics, and washed textures—crafted not just for comfort and aesthetics, but to serve as modern-day conversation starters.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Design & Campaign Section (featuring poster.png) */}
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
                                src={poster} 
                                alt="Base Poster Campaign" 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 space-y-6 lg:pl-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-650 bg-orange-50 px-2 py-1 rounded">
                            Creative Campaign
                        </span>
                        <h2 className="text-2xl md:text-5xl font-black tracking-tight text-zinc-950 uppercase">
                            Designed to be different.
                        </h2>
                        <div className="space-y-4 text-zinc-650 font-sans text-sm md:text-base leading-relaxed font-medium">
                            <p>
                                At Base, we look at streetwear as a functional canvas for message-bearing creativity. Every drop represents a carefully curated chapter of design, aesthetic exploration, and faith-centered testimony.
                            </p>
                            <p>
                                We choose not to fit in. Our silhouettes are built using heavy-density fabrics, vintage wash dyes, and carefully engineered proportions. It's a statement against fast fashion and shallow narratives.
                            </p>
                            <p>
                                When you wear a Base garment, you join a globally connected community of believers who values aesthetic integrity as highly as the conviction of their faith. Let your apparel speak before you do.
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
                                title: "Uncompromising Quality",
                                desc: "Heavyweight cottons, precision drop-shoulders, and durable prints. If it isn't built to last, it doesn't carry the Base name."
                            },
                            {
                                num: "02",
                                title: "Bold Conviction",
                                desc: "No subtle hints here. Our designs are unapologetic visual representations of the Gospel, meant to stand out in the modern uniform."
                            },
                            {
                                num: "03",
                                title: "Community First",
                                desc: "We are more than a brand. We are a movement of believers taking dominion of the creative space and supporting one another."
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

            <FooterSection />
        </div>
    );
};

export default AboutUs;
