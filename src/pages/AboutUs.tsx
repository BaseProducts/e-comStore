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
        <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
            <SEO 
                title="Our Story — BASE"
                description="Base was founded in 2018 by a pastoral family from Los Angeles. Learn about our mission to represent faith through premium apparel."
                keywords="base products story, christian clothing brand, faith apparel, los angeles"
                canonicalUrl="https://baseproducts.online/about"
            />
            <Navbar />

            {/* Hero */}
            <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{ backgroundImage: `url(${dynamicBanner})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent z-10" />
                <div className="container mx-auto relative z-20 text-center max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                    >
                        <h1 className="text-[48px] md:text-[80px] lg:text-[96px] font-medium text-white tracking-tighter leading-[0.95]">
                            Our <span className="italic font-light text-white/80">story.</span>
                        </h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-[14px] md:text-[18px] text-white/70 max-w-xl mx-auto leading-relaxed font-light tracking-wide"
                        >
                            Founded on the Word. Guided by faith.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 md:py-24 px-6 border-b border-[#E8E5E0]">
                <div className="container mx-auto max-w-5xl space-y-8">
                    <div className="space-y-6 text-[14px] md:text-[15px] text-[#4A4A4A] leading-relaxed">
                        <p>
                            Base was founded in 2018 with a purpose that goes far beyond creating apparel. It was established to represent the Kingdom of God through every piece we produce, carrying a message of faith, hope, and transformation.
                        </p>
                        <p>
                            We are a pastoral family honored to serve the Lord by shepherding the Church of Los Angeles, California. Throughout this journey, we have come to understand that our calling extends beyond the pulpit. God has entrusted us with the mission of helping build a strong Christian identity in people's lives.
                        </p>
                        <p>It was from this vision that Base was born.</p>
                        
                        <blockquote className="border-l-2 border-[#1A1A1A] pl-5 py-2 my-8">
                            <p className="text-[16px] md:text-[18px] text-[#1A1A1A] italic font-light">
                                "But as for me and my house, we will serve the Lord."
                            </p>
                            <cite className="block text-[12px] text-[#8A8A8A] mt-2 not-italic">— Joshua 24:15</cite>
                        </blockquote>
                        
                        <p>
                            This verse is more than a reference to us; it is the foundation upon which our family, our ministry, and our company have been built.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision + Image */}
            <section className="py-16 md:py-24 px-6">
                <div className="container mx-auto max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    <div className="flex-1 w-full">
                        <div className="aspect-square w-full overflow-hidden bg-[#F0EDE8]">
                            <img 
                                src={dynamicPoster} 
                                alt="Base — An Expression of Faith" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-5">
                        <h2 className="text-[36px] md:text-[48px] font-medium text-[#1A1A1A] tracking-tight leading-tight">
                            Our vision
                        </h2>
                        <h3 className="text-[18px] md:text-[22px] font-medium text-[#4A4A4A] tracking-tight">
                            An expression of our faith.
                        </h3>
                        <div className="space-y-4 text-[14px] text-[#4A4A4A] leading-relaxed">
                            <p>
                                We believe that clothing is more than appearance. Every garment communicates a message, reflects values, and expresses an identity. That is why we have chosen to build a brand founded on the principles of God's Word.
                            </p>
                            <p>
                                Base exists so that every person who wears our brand carries a purpose. We want our apparel to be a tool for sharing faith and reminding the world that we are called to live lives that glorify God.
                            </p>
                            <p>
                                More than a brand, we are an expression of our faith. Every design is created with the desire to impact lives, strengthen Christian identity, and proclaim the love of Christ through excellence and personal testimony.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-24 px-6 border-t border-[#E8E5E0]">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-[22px] md:text-[28px] font-medium text-[#1A1A1A] tracking-tight">
                            Our foundation
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Glorify God", desc: "Everything we do — from design to delivery — is rooted in our desire to bring glory to God and honor His name through excellence." },
                            { title: "Serve people", desc: "We exist to serve our community and customers, helping build a strong Christian identity in men, women, young people, and families." },
                            { title: "Expand His Kingdom", desc: "Our apparel is a tool for sharing faith and opening doors for conversations about Jesus, proclaiming the love of Christ to the world." }
                        ].map((pillar) => (
                            <div key={pillar.title} className="border border-[#E8E5E0] p-8 bg-white">
                                <h3 className="text-[14px] font-medium text-[#1A1A1A] mb-3">{pillar.title}</h3>
                                <p className="text-[13px] text-[#6B6B6B] leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="py-16 md:py-20 bg-[#1A1A1A] text-white px-6">
                <div className="container mx-auto max-w-2xl text-center space-y-4">
                    <h2 className="text-[22px] md:text-[28px] font-medium tracking-tight">
                        Welcome to Base.
                    </h2>
                    <div className="space-y-1 text-[13px] text-white/50">
                        <p>Founded on the Word.</p>
                        <p>Guided by faith.</p>
                        <p>Committed to the Kingdom of God.</p>
                    </div>
                </div>
            </section>

            <FooterSection />
        </div>
    );
};

export default AboutUs;
