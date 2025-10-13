"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: "/mi-cuenta"
      })

      if (error?.code) {
        toast.error("Correo electrónico o contraseña inválidos. Por favor, asegúrate de haber registrado una cuenta e inténtalo de nuevo.")
        setIsLoading(false)
        return
      }

      toast.success("¡Sesión iniciada con éxito!")
      router.push("/mi-cuenta")
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-light tracking-tight">IWatches</h1>
          </Link>
          <h2 className="text-3xl font-light mb-2">Iniciar Sesión</h2>
          <p className="text-muted-foreground">
            Accede a tu cuenta de cliente
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Correo Electrónico
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="tu@correo.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Contraseña
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded border-border"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-muted-foreground">
                Recordarme
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-foreground hover:bg-foreground/90"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="text-[var(--gold)] hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}