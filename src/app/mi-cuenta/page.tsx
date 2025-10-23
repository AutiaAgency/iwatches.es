"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Download, 
  LogOut, 
  Loader2, 
  ShoppingBag, 
  Calendar,
  Share2,
  Copy,
  CheckCircle,
  Gift,
  Users
} from "lucide-react"
import { toast } from "sonner"

interface Purchase {
  id: number
  watchName: string
  watchReference: string
  purchaseAmount: number
  purchaseDate: string
  notes: string | null
}

interface ReferralStats {
  totalReferrals: number
  premiumUnlocked: boolean
}

export default function MiCuenta() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true)
  const [referralCode, setReferralCode] = useState<string>("")
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)
  const [isLoadingReferral, setIsLoadingReferral] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session?.user) {
      fetchPurchases()
      fetchReferralData()
    }
  }, [session])

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/purchases/user", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPurchases(data.purchases || [])
      }
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setIsLoadingPurchases(false)
    }
  }

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem("bearer_token")
      
      // Get or create referral code
      const codeResponse = await fetch("/api/referrals/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      if (codeResponse.ok) {
        const codeData = await codeResponse.json()
        setReferralCode(codeData.code)
      }

      // Get referral stats
      const statsResponse = await fetch("/api/referrals/stats", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setReferralStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching referral data:", error)
    } finally {
      setIsLoadingReferral(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { authClient } = await import("@/lib/auth-client")
      const { error } = await authClient.signOut()
      if (error?.code) {
        toast.error("Error al cerrar sesión")
      } else {
        localStorage.removeItem("bearer_token")
        toast.success("Sesión cerrada exitosamente")
        router.push("/")
      }
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  const handleDownloadCatalog = async (type: "public" | "premium") => {
    if (type === "premium" && !referralStats?.premiumUnlocked) {
      toast.error("Necesitas 3 referidos para desbloquear el catálogo premium")
      return
    }

    try {
      const token = localStorage.getItem("bearer_token")
      await fetch("/api/catalog/download", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: session?.user?.email,
          catalogType: type
        })
      })

      // Send email
      await fetch("/api/send-catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: session?.user?.email,
          name: session?.user?.name,
          catalogType: type
        })
      })

      const link = document.createElement("a")
      link.href = "https://dl.dropboxusercontent.com/s/fi/mpao2eg23pr48nnz6dp1k/CAT-LOGO-25-26.pdf?rlkey=yajcjmetrxy3e7gj6fr7sk1eo&e=1&st=wxgk60h7&dl=0"
      link.download = type === "premium" ? "IWatches-Catalogo-Premium.pdf" : "IWatches-Catalogo-2025-2026.pdf"
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Catálogo ${type === "premium" ? "Premium" : ""} descargado exitosamente`)
    } catch (error) {
      toast.error("Error al descargar el catálogo")
    }
  }

  const copyReferralLink = () => {
    const appUrl = window.location.origin
    const shareUrl = `${appUrl}/?ref=${referralCode}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success("¡Link copiado al portapapeles!")
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralLink = async () => {
    const appUrl = window.location.origin
    const shareUrl = `${appUrl}/?ref=${referralCode}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IWatches - Catálogo de Relojes',
          text: '¡Descubre relojes automáticos en IWatches!',
          url: shareUrl
        })
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      copyReferralLink()
    }
  }

  if (isPending || isLoadingPurchases) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const remainingReferrals = Math.max(0, 3 - (referralStats?.totalReferrals || 0))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 
              className="text-xl sm:text-2xl font-light tracking-tight cursor-pointer hover:text-[var(--gold)] transition-colors"
              onClick={() => router.push("/")}
            >
              IWatches
            </h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-2">Mi Cuenta</h2>
          <p className="text-muted-foreground">Bienvenido, {session.user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Referral System */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Stats Card */}
            <Card className="p-6 sm:p-8 border-[var(--gold)]/20 bg-gradient-to-br from-[var(--gold)]/5 to-transparent">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--gold)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-light mb-2">Programa de Referidos</h3>
                  <p className="text-sm text-muted-foreground">
                    Comparte tu link y desbloquea el catálogo premium
                  </p>
                </div>
              </div>

              {isLoadingReferral ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progreso</span>
                      <span className="text-sm text-[var(--gold)] font-medium">
                        {referralStats?.totalReferrals || 0} / 3 referidos
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div 
                        className="bg-[var(--gold)] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${((referralStats?.totalReferrals || 0) / 3) * 100}%` }}
                      />
                    </div>
                    {referralStats?.premiumUnlocked ? (
                      <div className="flex items-center gap-2 mt-3 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">¡Catálogo Premium Desbloqueado!</span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-3">
                        {remainingReferrals === 1 
                          ? "¡Solo 1 referido más para desbloquear!" 
                          : `${remainingReferrals} referidos más para desbloquear el catálogo premium`}
                      </p>
                    )}
                  </div>

                  {/* Share Link */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium block">Tu Link de Referido</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/?ref=${referralCode}`}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-md"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyReferralLink}
                        className="gap-2 flex-shrink-0"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copiar</span>
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={shareReferralLink}
                        className="gap-2 bg-[var(--gold)] hover:bg-[var(--gold)]/90 flex-shrink-0"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Compartir</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Comparte este link con amigos. Cuando 3 personas descarguen el catálogo usando tu link, desbloquearás acceso al catálogo premium exclusivo.
                    </p>
                  </div>
                </>
              )}
            </Card>

            {/* Purchases */}
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-[var(--gold)]" />
                <h3 className="text-xl sm:text-2xl font-light">Mis Compras</h3>
              </div>

              {purchases.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Aún no has realizado ninguna compra</p>
                  <Button 
                    variant="outline"
                    onClick={() => router.push("/#catalog")}
                  >
                    Ver Catálogo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div 
                      key={purchase.id}
                      className="border border-border rounded-lg p-4 hover:border-[var(--gold)]/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{purchase.watchName}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{purchase.watchReference}</p>
                          {purchase.notes && (
                            <p className="text-sm text-muted-foreground italic">{purchase.notes}</p>
                          )}
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="text-lg font-medium text-[var(--gold)] mb-1">
                            {purchase.purchaseAmount}€
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(purchase.purchaseDate).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Catalogs */}
          <div className="space-y-6">
            {/* Public Catalog */}
            <Card className="p-6">
              <h3 className="text-lg font-light mb-4">Catálogo Público</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explora nuestra colección completa de relojes automáticos
              </p>
              <Button 
                className="w-full gap-2"
                variant="outline"
                onClick={() => handleDownloadCatalog("public")}
              >
                <Download className="w-4 h-4" />
                Descargar Catálogo
              </Button>
            </Card>

            {/* Premium Catalog */}
            <Card className={`p-6 ${referralStats?.premiumUnlocked ? 'border-[var(--gold)]/30 bg-[var(--gold)]/5' : 'opacity-75'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-[var(--gold)]" />
                <h3 className="text-lg font-light">Catálogo Premium</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {referralStats?.premiumUnlocked 
                  ? "Acceso exclusivo a precios especiales y nuevas colecciones"
                  : "Desbloquea con 3 referidos exitosos"}
              </p>
              <Button 
                className="w-full gap-2 bg-[var(--gold)] hover:bg-[var(--gold)]/90"
                disabled={!referralStats?.premiumUnlocked}
                onClick={() => handleDownloadCatalog("premium")}
              >
                {referralStats?.premiumUnlocked ? (
                  <>
                    <Download className="w-4 h-4" />
                    Descargar Premium
                  </>
                ) : (
                  <>
                    🔒 Bloqueado
                  </>
                )}
              </Button>
              {!referralStats?.premiumUnlocked && (
                <p className="text-xs text-center text-muted-foreground mt-3">
                  {remainingReferrals} referido{remainingReferrals !== 1 ? 's' : ''} más
                </p>
              )}
            </Card>

            {/* Account Info */}
            <Card className="p-6">
              <h3 className="text-lg font-light mb-4">Información de Cuenta</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Nombre</p>
                  <p className="font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{session.user.email}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}