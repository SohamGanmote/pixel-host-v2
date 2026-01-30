'use client';

import {
  Github,
  Zap,
  Settings,
  Cpu,
  BookOpen,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import logo from "@/public/logo.png"
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className='min-h-150 flex flex-col md:flex-row justify-between items-center'>
        <div className="max-w-4xl space-y-8 z-10">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Host Your Own{' '}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-blue-400">
                Minecraft Servers
              </span>
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl">
              Self-hosted control panel for managing Minecraft servers on your own hardware. No
              middleman, full control, open-source.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/create-new-server"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#42A5F5] text-white transition hover:bg-[#1E88E5]"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a
              href="https://github.com/SohamGanmote/pixel-host-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="
    flex items-center gap-2 px-3 py-2 rounded-lg
    border border-gray-200
    text-gray-700
    hover:bg-gray-100
    transition-colors
  "
            >
              <Github className="w-4 h-4 mr-2" /> View on GitHub
            </a>
          </div>
        </div>
        <Image src={logo} alt='logo' height={600} className='' />
      </div>

      {/* Features Section */}
      <section className="py-20 sm:py-32 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold">What You Can Do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage Minecraft servers from a single, intuitive interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: 'Create & Run Servers',
                description: 'Spin up new Minecraft servers with just a few clicks. Full control over server instances.',
              },
              {
                icon: Settings,
                title: 'Configure Settings',
                description:
                  'Adjust RAM allocation, Minecraft version, server properties, and all advanced options.',
              },
              {
                icon: Zap,
                title: 'Start, Stop & Restart',
                description: 'Manage server lifecycle through a web interface. No SSH commands needed.',
              },
              {
                icon: BookOpen,
                title: 'Backup Management',
                description: 'Create manual backups of your servers and restore them when needed.',
              },
              {
                icon: Github,
                title: 'Open Source',
                description: 'Fully transparent source code. Contribute, audit, and modify as you wish.',
              },
              {
                icon: ExternalLink,
                title: 'Self-Hosted Only',
                description: 'No cloud dependencies. Run it on your homelab, VPS, or local Linux server.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-xl border border-gray-200 bg-gray-100 hover:border-primary/20 hover:bg-card transition-all duration-300 p-6 space-y-4"
              >
                <div className="w-12 h-12 rounded-lg bg-white text-blue-400 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Ready to Host Your Own Servers?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start managing Minecraft servers on your own hardware today. Open-source, free, and
              fully under your control.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/create-new-server"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#42A5F5] text-white transition hover:bg-[#1E88E5]"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a
              href="https://github.com/SohamGanmote/pixel-host-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="
    flex items-center gap-2 px-3 py-2 rounded-lg
    border border-gray-200
    text-gray-700
    hover:bg-gray-100
    transition-colors
  "
            >
              <Github className="w-4 h-4 mr-2" /> View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
