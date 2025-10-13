"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import Link from "next/link"
import { Download, ShoppingBag, User, LogOut, FileText, Clock } from "lucide-react"

interface Purchase {
  id: number
  watchName: string
  watchReference: string
  purchaseAmount: number
  purchaseDate: string
  notes: string | null
  createdAt: string
}

interface CatalogDownload {
  id: number
  catalogType: string
  downloadedAt: string
}

export default function CustomerDashboard() {
  const router = useRouter()
  const { data: session, isPending, refetch } = useSession()
  const [isCustomer, setIsCustomer] = useState(false)
  const [purchaseCount, setPurchaseCount] = useState(0)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [downloads, setDownloads] = useState<CatalogDownload[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!session?.user) return

      try {
        const token = localStorage.getItem("bearer_token")
        
        // Fetch customer status
        const statusRes = await fetch("/api/customer/status", {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          setIsCustomer(statusData.isCustomer)
          setPurchaseCount(statusData.purchaseCount)
        }

        // Fetch purchases
        const purchasesRes = await fetch("/api/purchases/user", {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (purchasesRes.ok) {
          const purchasesData = await purchasesRes.json()
          setPurchases(purchasesData)
        }

        // Fetch download history
        const downloadsRes = await fetch("/api/catalog/downloads", {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (downloadsRes.ok) {
          const downloadsData = await downloadsRes.json()
          setDownloads(downloadsData)
        }
      } catch (error) {
        console.error("Error fetching customer data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (session?.user) {
      fetchCustomerData()
    }
  }, [session])

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut()
      if (error?.code) {
        toast.error(error.code)
      } else {
        localStorage.removeItem("bearer_token")
        refetch()
        toast.success("Sesión cerrada con éxito")
        router.push("/")
      }
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  const handleDownloadCatalog = async (catalogType: "public" | "premium") => {
    if (catalogType === "premium" && !isCustomer) {
      toast.error("Debes realizar una compra para acceder al catálogo premium")
      return
    }

    setIsDownloading(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch("/api/catalog/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ catalogType })
      })

      if (response.ok) {
        toast.success(`¡Catálogo ${catalogType === "premium" ? "Premium" : "Público"} descargado!`)
        
        // Refresh download history
        const downloadsRes = await fetch("/api/catalog/downloads", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (downloadsRes.ok) {
          const downloadsData = await downloadsRes.json()
          setDownloads(downloadsData)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al descargar catálogo")
      }
    } catch (error) {
      toast.error("Error al procesar la descarga")
    } finally {
      setIsDownloading(false)
    }
  }

  if (isPending || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-light tracking-tight">IWatches</h1>
            </Link>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-light mb-4">Mi Cuenta</h2>
            <p className="text-muted-foreground">Bienvenido, {session.user.name}</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estado</p>
                  <p className="text-xl font-light">
                    {isCustomer ? "Cliente Premium" : "Cliente Registrado"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Compras</p>
                  <p className="text-xl font-light">{purchaseCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center">
                  <Download className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Descargas</p>
                  <p className="text-xl font-light">{downloads.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Catalog Downloads */}
          <Card className="p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[var(--gold)]" />
              <h3 className="text-2xl font-light">Catálogos Disponibles</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Public Catalog */}
              <div className="border border-border rounded-lg p-6">
                <h4 className="text-xl font-light mb-2">Catálogo Público</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Acceso a nuestra colección de relojes con información general y precios de referencia.
                </p>
                <Button 
                  onClick={() => handleDownloadCatalog("public")}
                  disabled={isDownloading}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Catálogo Público
                </Button>
              </div>

              {/* Premium Catalog */}
              <div className="border border-[var(--gold)] rounded-lg p-6 bg-[var(--gold)]/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-light">Catálogo Premium</h4>
                  {isCustomer && (
                    <span className="text-xs bg-[var(--gold)] text-white px-2 py-1 rounded">
                      DESBLOQUEADO
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Catálogo exclusivo con modelos especiales, precios preferenciales y acceso prioritario a nuevas colecciones.
                </p>
                {isCustomer ? (
                  <Button 
                    onClick={() => handleDownloadCatalog("premium")}
                    disabled={isDownloading}
                    className="w-full bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Catálogo Premium
                  </Button>
                ) : (
                  <div>
                    <Button disabled variant="outline" className="w-full mb-2">
                      <Download className="w-4 h-4 mr-2" />
                      Requiere compra previa
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Realiza tu primera compra para desbloquear
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Purchase History */}
          {purchases.length > 0 && (
            <Card className="p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-[var(--gold)]" />
                <h3 className="text-2xl font-light">Historial de Compras</h3>
              </div>

              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{purchase.watchName}</h4>
                        <p className="text-sm text-muted-foreground">{purchase.watchReference}</p>
                      </div>
                      <p className="text-[var(--gold)] font-medium">
                        ${purchase.purchaseAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {new Date(purchase.purchaseDate).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </div>
                    {purchase.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{purchase.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Download History */}
          {downloads.length > 0 && (
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-6 h-6 text-[var(--gold)]" />
                <h3 className="text-2xl font-light">Historial de Descargas</h3>
              </div>

              <div className="space-y-3">
                {downloads.map((download) => (
                  <div key={download.id} className="flex justify-between items-center border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          Catálogo {download.catalogType === "premium" ? "Premium" : "Público"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(download.downloadedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}