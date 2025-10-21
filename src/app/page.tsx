import { Suspense } from "react"
import HomePageClient from "./_components/home-page-client"

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageClient />
    </Suspense>
  )
}
