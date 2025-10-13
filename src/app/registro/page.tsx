"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import Link from "next/link"

type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>

const errorCodes = {
  USER_ALREADY_EXISTS: "El usuario ya está registrado",
} satisfies ErrorTypes

const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes]
  }
  return "Registro fallido"
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    // Validate password length
    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password
      })

      if (error?.code) {
        toast.error(getErrorMessage(error.code))
        setIsLoading(false)
        return
      }

      toast.success("¡Cuenta creada con éxito!")
      router.push("/login?registered=true")
    } catch (error) {
      toast.error("Error al crear la cuenta. Por favor, inténtalo de nuevo.")
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
          <h2 className="text-3xl font-light mb-2">Crear Cuenta</h2>
          <p className="text-muted-foreground">
            Regístrate para acceder a catálogos exclusivos
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nombre Completo
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Tu nombre"
                disabled={isLoading}
              />
            </div>

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
                placeholder="Mínimo 8 caracteres"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Confirmar Contraseña
              </label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Repite tu contraseña"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-foreground hover:bg-foreground/90"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-[var(--gold)] hover:underline">
                Inicia sesión aquí
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