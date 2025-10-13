"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CatalogDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CatalogDownloadDialog({ open, onOpenChange }: CatalogDownloadDialogProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Log the catalog download request
      const response = await fetch("/api/catalog/download", {
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

      if (!response.ok) {
        throw new Error("Error al procesar la solicitud")
      }

      toast.success("¡Catálogo enviado! Revisa tu correo electrónico.")
      
      // Simulate PDF download (in production, you'd have actual PDF files)
      const link = document.createElement("a")
      link.href = "#" // Replace with actual PDF URL
      link.download = "IWatches-Catalogo-2024.pdf"
      // In production: link.click()
      
      setEmail("")
      setName("")
      onOpenChange(false)
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
          <DialogTitle className="text-2xl font-light">Descarga Nuestro Catálogo</DialogTitle>
          <DialogDescription>
            Explora nuestra colección completa de relojes automáticos. 
            Déjanos tu email y te enviaremos el catálogo al instante.
          </DialogDescription>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  )
}