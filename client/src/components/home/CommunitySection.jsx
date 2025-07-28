"use client";
import Section from "../layout/Section";
import Container from "../layout/Container";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Button from "../common/Button";
import { motion } from "framer-motion";

// Floating animation variants for continuous motion
const floatingVariants1 = {
  float: {
    y: [0, -12, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatingVariants2 = {
  float: {
    y: [0, 8, 0],
    rotate: [0, -1.5, 0],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.3,
    },
  },
};

const floatingVariants3 = {
  float: {
    y: [0, -10, 0],
    rotate: [0, 1.5, 0],
    transition: {
      duration: 4.8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.6,
    },
  },
};

const floatingVariants4 = {
  float: {
    y: [0, 10, 0],
    rotate: [0, -2, 0],
    transition: {
      duration: 3.6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.2,
    },
  },
};

const floatingVariants5 = {
  float: {
    y: [0, -8, 0],
    rotate: [0, 1, 0],
    transition: {
      duration: 4.2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.8,
    },
  },
};

const floatingVariants6 = {
  float: {
    y: [0, 14, 0],
    rotate: [0, -1.8, 0],
    transition: {
      duration: 3.8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.4,
    },
  },
};

const images = [
  {
    src: "/images/hero.png",
    className: "-left-16 top-16 w-46 h-56 rounded-2xl",
    delay: 0.2,
    floatingVariant: floatingVariants1,
  },
  {
    src: "/images/hero.png",
    className: "left-24 -top-16 w-20 h-28 rounded-xl",
    delay: 0.4,
    floatingVariant: floatingVariants2,
  },
  {
    src: "/images/hero.png",
    className: "left-10 bottom-12 w-48 h-60 rounded-3xl",
    delay: 0.6,
    floatingVariant: floatingVariants3,
  },
  {
    src: "/images/hero.png",
    className: "-right-16 top-16 w-46 h-56 rounded-2xl",
    delay: 0.3,
    floatingVariant: floatingVariants4,
  },
  {
    src: "/images/hero.png",
    className: "right-24 -top-16 w-20 h-28 rounded-xl",
    delay: 0.5,
    floatingVariant: floatingVariants5,
  },
  {
    src: "/images/hero.png",
    className: "right-10 bottom-12 w-48 h-60 rounded-3xl",
    delay: 0.7,
    floatingVariant: floatingVariants6,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const backgroundVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: -10,
  },
  visible: (delay) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeOut",
      type: "spring",
      bounce: 0.4,
    },
  }),
  hover: {
    scale: 1.05,
    rotate: 2,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const textVariants = {
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hidden: {
    y: 30,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.8,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const mobileGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.3,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
};

const mobileImageVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function CommunitySection() {
  return (
    <Section className="my-24 md:my-48 md:mt-[300px] overflow-visible py-16 md:py-0">
      <Container className="relative">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 md:w-[68rem] md:h-[68rem] opacity-20 md:opacity-40 bg-radial from-white via-primary/50 to-white blur-3xl rounded-full z-0"
          variants={backgroundVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        />

        {/* Desktop Floating images */}
        {images.map((img, i) => (
          <motion.div
            key={i}
            className={`absolute z-10 ${img.className} hidden lg:block`}
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.3 }}
            custom={img.delay}
          >
            <motion.div
              className="w-full h-full"
              variants={img.floatingVariant}
              animate="float"
            >
              <Image
                src={img.src}
                alt="Community member"
                fill
                className="object-cover rounded-2xl shadow-lg"
                sizes="(max-width: 768px) 80px, 120px"
              />
            </motion.div>
          </motion.div>
        ))}

        {/* Mobile decorative images grid */}
        <motion.div
          className="lg:hidden absolute inset-0 z-10 opacity-30"
          variants={mobileGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-4 h-full px-8 py-8">
            <div className="space-y-4">
              <motion.div
                className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden"
                variants={mobileImageVariants}
              >
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={64}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <motion.div
                className="w-20 h-24 bg-gray-200 rounded-xl overflow-hidden ml-4"
                variants={mobileImageVariants}
              >
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={80}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </div>
            <div className="space-y-4 pt-8">
              <motion.div
                className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden ml-auto"
                variants={mobileImageVariants}
              >
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={64}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <motion.div
                className="w-20 h-24 bg-gray-200 rounded-xl overflow-hidden mr-4"
                variants={mobileImageVariants}
              >
                <Image
                  src="/images/hero.png"
                  alt="Community"
                  width={80}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Centered content */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center text-center px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-5xl lg:text-8xl font-extrabold text-gray-900 mb-6 md:mb-8 leading-tight"
            variants={textVariants}
          >
            Meet{" "}
            <span className="block sm:inline">
              <br className="hidden sm:block" /> those who
            </span>
            <br />
            make our{" "}
            <span className="block sm:inline">
              <br className="hidden sm:block" />
              <span className="text-primary">Community</span>
            </span>
          </motion.h2>
          <motion.div variants={buttonVariants}>
            <Button
              type="secondary"
              text="Explore The Communities"
              className="mt-2 w-full"
              link="/communities"
            />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
