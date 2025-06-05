import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {

  title: 'Fono al Día',
  description: 'Desarrolla tus habilidades en fonología con niveles progresivos de aprendizaje interactivo.',
  keywords: ['fonología', 'aprendizaje interactivo', 'audiometría', 'patología del habla'],
  icons: {
    icon: '/fono.ico', 
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/fono.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
