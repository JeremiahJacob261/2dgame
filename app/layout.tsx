import "./globals.css"

import type React from "react"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
   
      <head>
           <title>
        2D CAR GAME BY JERRY
      </title>
      <meta name="description" content="A fun and engaging 2D car game by Jerry. Play now and enjoy the excitement!"/>
      <meta property="og:title" content="2D Car Game by Jerry"/>
      <meta property="og:description" content="A fun and engaging 2D car game by Jerry. Play now and enjoy the excitement!"/>
      <meta property="og:type" content="website"/>
      <meta property="og:url" content="https://2dgame-six.vercel.app"/>
      <meta property="og:image" content="https://2dgame-six.vercel.app/car.jpg"/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content="2D Car Game by Jerry"/>
      <meta name="twitter:description" content="A fun and engaging 2D car game by Jerry. Play now and enjoy the excitement!"/>
      <meta name="twitter:image" content="https://2dgame-six.vercel.app/car.jpg"/>
      </head>
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}

