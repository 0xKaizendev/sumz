import '../globals.css'
import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import { MainNav } from "@/components/main-nav"
import { siteConfig } from "@/config/site"
import { i18n } from '@/config/i18n-config'
import { cn } from "@/lib/utils"
import { marketingConfig } from "@/config/marketing"
import Providers from '@/components/Provider'
import { SiteFooter } from '@/components/site-footer'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/get-dictionary'
import { Locale } from '@/config/i18n-config'
import { Dictionary } from '@/types'
import Head from 'next/head'
import { Analytics } from '@/components/analytics'
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "article summarizer",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "Shadcn ui",
    "Openai",
    "GPT-4",
  ],
  authors: [
    {
      name: "Rozales",
      url: "https://openai-article-summarizer-mu.vercel.app",
    },
  ],
  creator: "Rozales",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@0xZales",
  },
  icons: {
    icon: "/icon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: `${siteConfig.url}/site.webmanifest`,
}
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
const fontHeading = localFont({
  src: "../../public/assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})
export default async function RootLayout({
  children, params
}: {
  children: React.ReactNode, params: { lang: Locale }
}) {

  const dictionary: Dictionary = await getDictionary(params.lang)
  return (
    <html lang={params.lang}>

      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col ",
          fontSans.variable,
          fontHeading.variable
        )}>
        <Providers>
          <header className=" z-40 bg-background border-b container">
            <MainNav />

          </header>
          {/* <Hero /> */}

          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
          <main className='flex-1'>

            {children}
          </main>



          {/* <Analytics /> */}
          {/* <Toaster /> */}
          {/* </ThemeProvider> */}
          <SiteFooter dictionary={dictionary.footer} />
          <Analytics />
        </Providers>




      </body>
    </html>
  )
}
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}