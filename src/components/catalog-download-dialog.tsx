"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface CatalogDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  referralCode?: string | null
}

export function CatalogDownloadDialog({ open, onOpenChange, referralCode }: CatalogDownloadDialogProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Track referral if code exists
      if (referralCode) {
        const trackResponse = await fetch("/api/referrals/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referralCode,
            email,
            name
          }),
        })

        if (!trackResponse.ok) {
          const errorData = await trackResponse.json()
          // Don't fail the download if referral tracking fails
          console.warn("Referral tracking warning:", errorData.error)
        }
      }

      // Register the download in database
      const downloadResponse = await fetch("/api/catalog/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          catalogType: "public"
        }),
      })

      if (!downloadResponse.ok) {
        throw new Error("Error al procesar la solicitud")
      }

      // Send email with catalog link
      const emailResponse = await fetch("/api/send-catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          catalogType: "public"
        }),
      })

      if (!emailResponse.ok) {
        throw new Error("Error al enviar el email")
      }

      setEmailSent(true)
      toast.success("¡Catálogo enviado! Revisa tu correo electrónico.")
      
      // Download PDF automatically
      const link = document.createElement("a")
      link.href = "https://dl.dropboxusercontent.com/s/fi/mpao2eg23pr48nnz6dp1k/CAT-LOGO-25-26.pdf?rlkey=yajcjmetrxy3e7gj6fr7sk1eo&e=1&st=wxgk60h7&dl=0"
      link.download = "IWatches-Catalogo-2025-2026.pdf"
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setEmail("")
        setName("")
        setEmailSent(false)
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      toast.error("Hubo un error. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">
            {emailSent ? "¡Catálogo Enviado!" : "Descarga Nuestro Catálogo"}
          </DialogTitle>
          <DialogDescription>
            {emailSent ? (
              "Revisa tu bandeja de entrada. También se descargará automáticamente."
            ) : (
              <>
                Explora nuestra colección completa de relojes automáticos. Déjanos tu email y te enviaremos el catálogo al instante.
                {referralCode && (
                  <span className="block mt-2 text-[var(--gold)] font-medium">
                    ✨ Invitado por un cliente - ¡Bienvenido!
                  </span>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {emailSent ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-center text-muted-foreground">
              El catálogo ha sido enviado a <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleDownload} className="space-y-4 mt-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-2 block">
                Nombre
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="text-sm font-medium mb-2 block">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-foreground hover:bg-foreground/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Catálogo
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Al descargar, aceptas recibir información sobre nuestros productos y ofertas exclusivas.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}