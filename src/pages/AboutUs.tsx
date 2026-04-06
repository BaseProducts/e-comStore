import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-background font-mono selection:bg-primary/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/50 via-background to-background opacity-70"></div>
                
                <div className="container mx-auto relative z-10 text-center max-w-4xl">
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-6"
                    >
                        Our Story
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none"
                    >
                        Base: <span className="gradient-text">Christian</span> Streetwear
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent mx-auto mb-8"></div>
                    </motion.div>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-xl text-muted-foreground leading-relaxed"
                    >
                        We aren't just selling fabric; we are carrying a message. Born out of a desire to see faith represented boldly in contemporary culture, Base merges premium streetwear silhouettes with unapologetic Christian values.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-muted/20 border-y border-border px-6">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <motion.h2 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-5xl font-black tracking-tight"
                        >
                            WEAR YOUR <br /> FAITH.
                        </motion.h2>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4 text-muted-foreground"
                        >
                            <p>
                                The streets are the largest mission field in the world. For too long, the aesthetic of faith-based apparel has been relegated to the background. We built Base to change that paradigm. 
                            </p>
                            <p>
                                Every garment is meticulously designed with a focus on oversized cuts, heavyweight fabrics, and washed textures—crafted not just for aesthetics, but to be conversation starters.
                            </p>
                            <p>
                                Stand firm on the foundation. Spread the Word. Look good doing it.
                            </p>
                        </motion.div>
                    </div>
                    <div className="flex-1 w-full aspect-square md:aspect-[4/5] bg-card rounded-md border border-border overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img 
                                src={heroBg} 
                                alt="Base Campaign" 
                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black uppercase tracking-widest mb-4">The Pillars</h2>
                        <div className="h-1 w-12 bg-primary mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Uncompromising Quality",
                                desc: "Heavyweight cottons, precision drop-shoulders, and durable prints. If it isn't built to last, it doesn't carry the Base name."
                            },
                            {
                                title: "Bold Conviction",
                                desc: "No subtle hints here. Our designs are unapologetic visual representations of the Gospel, meant to stand out in the modern uniform."
                            },
                            {
                                title: "Community First",
                                desc: "We are more than a brand. We are a movement of believers taking dominion of the creative space and supporting one another."
                            }
                        ].map((pillar, i) => (
                            <motion.div 
                                key={pillar.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                className="bg-muted/10 border border-border p-8 rounded-sm hover:-translate-y-2 transition-transform duration-300 group"
                            >
                                <h3 className="text-xl font-bold uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{pillar.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
