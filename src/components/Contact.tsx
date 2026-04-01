'use client';

import { motion } from 'framer-motion';
import data from '@/data/data.json';
import { Mail, MapPin, Send, GitBranch, Link, AtSign } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="relative w-full min-h-screen py-24 px-6 md:px-12 flex flex-col justify-between overflow-hidden">
      {/* Dynamic Light */}
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[150px] mix-blend-overlay pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, type: 'spring' }}
        className="w-full max-w-4xl mx-auto flex flex-col justify-center items-center text-center flex-grow gap-12"
      >
        <h2 className="text-4xl md:text-7xl font-outfit font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-blue-500/50">
          Let's Build <br /> The Future Together.
        </h2>

        <p className="text-white/60 font-inter max-w-lg leading-relaxed md:text-lg">
          Currently seeking new opportunities. My inbox is always open — whether you have a question or just want to say hi, I'll get back to you!
        </p>

        <a
          href={`mailto:${data.contact.email}`}
          className="liquid-glass group px-8 py-4 rounded-full flex items-center gap-4 hover:bg-white/10 transition-colors border border-white/20 hover:border-blue-400"
        >
          <Send className="w-5 h-5 text-blue-400 group-hover:-translate-y-1 transition-transform" />
          <span className="font-outfit font-semibold tracking-wide text-white/90">Say Hello</span>
        </a>

        {/* Social Icons */}
        <div className="flex gap-4 mt-4">
          {data.bio.github && (
            <a href={data.bio.github} target="_blank" rel="noopener noreferrer"
              className="liquid-glass p-4 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white group" title="GitHub">
              <GitBranch className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
            </a>
          )}
          {data.bio.linkedin && (
            <a href={data.bio.linkedin} target="_blank" rel="noopener noreferrer"
              className="liquid-glass p-4 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white group" title="LinkedIn">
              <Link className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
            </a>
          )}
          {data.bio.twitter && (
            <a href={data.bio.twitter} target="_blank" rel="noopener noreferrer"
              className="liquid-glass p-4 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white group" title="Twitter / X">
              <AtSign className="w-6 h-6 group-hover:text-sky-400 transition-colors" />
            </a>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 mt-12 text-sm font-inter text-white/30 px-4">
        <p>© {new Date().getFullYear()} {data.bio.name}. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {data.contact.location}</span>
          <span>•</span>
          <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {data.contact.email}</span>
        </div>
      </footer>
    </section>
  );
}
