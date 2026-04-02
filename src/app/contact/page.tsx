'use client';

import { motion } from 'framer-motion';
import data from '@/data/data.json';
import { Mail, MapPin, Send, GitBranch, Link, AtSign } from 'lucide-react';
import dynamic from 'next/dynamic';
import ThreadsBackground from '@/components/ThreadsBackground';

const VadodaraMap = dynamic(() => import('@/components/VadodaraMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-2xl" />
});

export default function ContactPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col justify-between pb-24 md:pb-28">
      <ThreadsBackground />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-blue-900/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 flex flex-col items-start gap-12 flex-grow">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-blue-400/80 font-inter">Get In Touch</span>
          <h1 className="mt-3 font-outfit font-black tracking-tighter text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
            Contact
          </h1>
          <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-blue-500/50 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full">
          {/* Big cinematic CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-8 w-full"
          >
            <p className="text-3xl md:text-5xl font-outfit font-bold text-white/80 leading-tight max-w-2xl">
              Let's build <span className="text-gradient">something remarkable</span> together.
            </p>

            <p className="text-white/50 font-inter max-w-lg leading-relaxed">
              Currently open to new opportunities and exciting projects. Whether you have a role in mind, a wild idea, or just want to talk tech — reach out!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`mailto:${data.contact.email}`}
                className="liquid-glass text-nowrap flex gap-3 items-center p-4 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors text-white/50 hover:text-white"
              >
                <Send className="w-5 h-5 text-blue-400" />
                <span className="font-outfit font-semibold text-white/90">Send a Message</span>
              </a>

              <div className="flex gap-3 items-center">
                {data.bio.github && (
                  <a href={data.bio.github} target="_blank" rel="noopener noreferrer"
                    className="group/tooltip relative liquid-glass p-4 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors text-white/50 hover:text-white">
                    <GitBranch className="w-5 h-5" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-[10px] font-inter font-medium tracking-wider pointer-events-none z-50">
                      GitHub
                    </span>
                  </a>
                )}
                {data.bio.linkedin && (
                  <a href={data.bio.linkedin} target="_blank" rel="noopener noreferrer"
                    className="group/tooltip relative liquid-glass p-4 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors text-white/50 hover:text-white">
                    <Link className="w-5 h-5" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-[10px] font-inter font-medium tracking-wider pointer-events-none z-50">
                      LinkedIn
                    </span>
                  </a>
                )}
                {data.bio.twitter && (
                  <a href={data.bio.twitter} target="_blank" rel="noopener noreferrer"
                    className="group/tooltip relative liquid-glass p-4 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors text-white/50 hover:text-white">
                    <AtSign className="w-5 h-5" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 liquid-glass text-[10px] font-inter font-medium tracking-wider pointer-events-none z-50">
                      Twitter
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Contact details */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-3 text-sm text-white/40 font-inter">
                <MapPin className="w-4 h-4 flex-shrink-0 text-blue-400" />
                {data.contact.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-white/40 font-inter">
                <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <a href={`mailto:${data.contact.email}`} className="hover:text-white transition-colors">
                  {data.contact.email}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:mt-0 w-full"
          >
            <div className="relative group">
              {/* Decorative element for map card */}
              <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-transparent rounded-3xl blur-xl group-hover:from-blue-500/30 transition-all duration-700" />

              <div className="relative liquid-glass overflow-hidden rounded-2xl border-white/10 h-[350px] md:h-[450px] w-full z-10 shadow-2xl shadow-blue-900/20">
                <div className="absolute top-4 left-4 z-[1000] liquid-glass px-4 py-2 flex items-center gap-2 border-white/20">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-inter font-bold tracking-[0.2em] uppercase text-white/80">Based in {data.contact.location}</span>
                </div>

                <VadodaraMap />
              </div>

              {/* Subtle text below map */}
              <div className="mt-4 flex justify-end">
                <p className="text-[10px] font-inter text-white/20 tracking-widest uppercase">Gujarat, India —— 22.3072° N, 73.1812° E</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 px-6 md:px-12 pt-6 mt-12 text-xs font-inter text-white/25 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} {data.bio.name}</p>
        <p>All rights reserved.</p>
      </footer>
    </main>
  );
}


