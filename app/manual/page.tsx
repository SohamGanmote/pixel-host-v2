"use client"

import {
  User,
  GitBranch,
  Settings,
  Shield,
  LucideIcon,
  CheckCircle,
} from "lucide-react"
import type React from "react"
import { useState } from "react"


interface SectionProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <section className="scroll-mt-20" id={title.toLowerCase().replace(/\s+/g, "-")}>
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <Icon className="w-10 h-10 text-gray-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2"></div>
        </div>
      </div>
      <div className="ml-14">{children}</div>
    </section>
  )
}

interface CodeBlockProps {
  code: string
  isSmall?: boolean
}

function CodeBlock({ code, isSmall = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${isSmall ? "mb-4" : "mb-6"} border`}>
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-100 text-sm rounded transition-colors"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <pre className={`text-gray-100 overflow-x-auto font-mono ${isSmall ? "p-3 text-xs" : "p-6 text-sm"}`}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

interface StepCardProps {
  step: number
  title: string
  children: React.ReactNode
}

function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="flex gap-4 p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors overflow-hidden">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
          {step}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        <div className="text-gray-600 text-sm">{children}</div>
      </div>
    </div>
  )
}


export default function ManualPage() {
  return (
    <div className="pb-20 space-y-20 max-w-7xl mx-auto">
      {/* Minecraft User Creation Section */}
      <Section title="Step 1: Create Minecraft System User" icon={User}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Create a dedicated system user for running and managing the Minecraft server securely.
        </p>

        <CodeBlock
          code={`# Create minecraft user
sudo adduser minecraft

# Open sudoers file safely
sudo visudo

# Add this line at the end
minecraft ALL=(root) NOPASSWD: \
/bin/mv, \
/bin/ln, \
/bin/rm, \
/bin/systemctl`}
        />

        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Using a separate minecraft user improves security and keeps server files isolated.
          </p>
        </div>
      </Section>

      {/* Install Java */}
      <Section title="Step 2: Install Java" icon={Settings}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Install required packages like Java to run the Minecraft server and open the necessary firewall ports.
        </p>

        <CodeBlock
          code={`# Add OpenJDK repository
sudo add-apt-repository ppa:openjdk-r/ppa

# Update system packages
sudo apt update

# Install Java 17 (required for modern Minecraft versions)
sudo apt install openjdk-17-jre-headless -y
`}
        />

        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
          <p className="text-sm text-green-900">
            <strong>Success:</strong> Java configuration is completed.
          </p>
        </div>
      </Section>

      {/* Clone Repository Section */}
      <Section title="Step 3: Clone Minecraft Panel Repository" icon={GitBranch}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Clone the Minecraft panel repository and install all required Node.js dependencies.
        </p>

        <CodeBlock
          code={`# Switch to minecraft user
su - minecraft

# Clone the repository
git clone https://github.com/SohamGanmote/pixel-host-v2

# Navigate into project
cd pixel-host-v2

# Install dependencies
npm install`}
        />
      </Section>

      {/* Environment Variables Section */}
      <Section title="Step 4: Configure Environment Variables" icon={Settings}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Configure environment variables required for server networking and panel access.
        </p>

        <CodeBlock
          code={`# Create environment file
nano .env

# Add the following values
NEXT_PUBLIC_LOCAL_IP=192.168.x.x
NEXT_PUBLIC_STATIC_IP=182.26.xxx.xx`}
        />

        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="text-sm text-yellow-900">
            <strong>Important:</strong> Never commit your .env file. Always keep it private.
          </p>
        </div>
      </Section>

      {/* PM2 Installation Section */}
      <Section title="Step 5: Install and Configure PM2" icon={Settings}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Use PM2 to keep the Minecraft panel running in the background and auto-restart on crashes.
        </p>

        <CodeBlock
          code={`# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "minecraft-panel" -- start

# Save PM2 process list
pm2 save

# Enable PM2 startup on reboot
pm2 startup`}
        />
      </Section>

      {/* Firewall */}
      <Section title="Step 6: Open Ports" icon={Shield}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Open required ports to access the Minecraft panel and allow players to join the server.
        </p>

        <CodeBlock
          code={`# Open panel port
sudo ufw allow 3000

# Minecraft server port
sudo ufw allow 25575

# Enable firewall if not enabled
sudo ufw enable`}
        />

        <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
          <p className="text-sm text-purple-900">
            <strong>Router Setup:</strong>
            Forward port <strong>3000</strong> for the Minecraft panel and
            <strong> 25575</strong> for the Minecraft server in your router settings.
          </p>
        </div>
      </Section>

      {/* Port Forwarding Section */}
      <Section title="Step 7: Configure Port Forwarding" icon={Shield}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Set up port forwarding on your router to expose your application to the internet.
        </p>

        <div className="space-y-4">
          <StepCard step={1} title="Access Router Admin Panel">
            <p>
              Open your browser and navigate to your {`router's`} IP (usually 192.168.1.1 or 192.168.0.1). Log in with
              admin credentials.
            </p>
          </StepCard>

          <StepCard step={2} title="Find Port Forwarding Settings">
            <p>
              Look for sections like {`"Port Forwarding", "Virtual Server", or "NAT"`} in your router settings. The exact
              location varies by router manufacturer (TP-Link, Netgear, ASUS, etc.).
            </p>
          </StepCard>

          <StepCard step={3} title="Configure Port Forwarding Rules">
            <CodeBlock
              code={`External Port 3000 and 25575
Internal IP Address: 192.168.x.x  (your server's local IP)
Internal Port 3000 and 25575
Protocol: TCP
Enable: Yes`}
              isSmall={true}
            />
          </StepCard>

          <StepCard step={4} title="Save and Restart (if needed)">
            <p>
              Apply the settings. Some routers require a restart. Your application is now accessible via your public
              IP on ports 3000 and 25575.
            </p>
          </StepCard>
        </div>

        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <p className="text-sm text-red-900">
            <strong>Security Note:</strong> Only open ports you actually need. Consider using a reverse proxy like
            Nginx for better security and to expose only port 80/443.
          </p>
        </div>
      </Section>

      {/* Final Join Section */}
      <Section title="Step 8: Join the Minecraft Server 🎮" icon={CheckCircle}>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your Minecraft server and panel are now fully set up and ready to use.
        </p>

        <CodeBlock
          code={`# Local play
<LOCAL_IP>:25575

# Public play (friends)
<STATIC_IP>:25575`}
        />

        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
          <p className="text-sm text-green-900">
            <strong>Done!</strong> Your Minecraft server is live. Invite your friends and start playing 🚀
          </p>
        </div>
      </Section>
    </div>
  )
}