import { motion } from "framer-motion";

const BrandMessageSection = () => {
  return (
    <section className="py-28 md:py-40 px-6">
      <div className="container mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight text-foreground">
            It's not just a shirt.
            <br />
            <span className="gradient-text">It's who you are.</span>
          </p>
          <p className="text-base md:text-lg text-muted-foreground mt-8 max-w-lg mx-auto leading-relaxed">
            Base represents faith, identity, and purpose.
            <br />
            Wear Christ. Live the message.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandMessageSection;
