"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Shield, Package, FileText, MessageCircle, Mail, Phone, Download, Star, User, LogOut, Menu, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { CatalogDownloadDialog } from "@/components/catalog-download-dialog"
import { useSession } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Suspense } from "react"

const watches = [
  {
    name: "Seiko 5 Sports GMT",
    reference: "SSK021K1",
    price: "325€",
    description: "Reloj elegante con esfera sunburst y complicación de fecha. Perfecto para ocasiones formales.",
    image: "https://res.cloudinary.com/djg9xipqe/image/upload/v1761213377/SSK019K1_uz6rrd.png"
  },
  {
    name: "Seiko 5 Sports GMT",
    reference: "SSK003K1",
    price: "325€",
    description: "Automático clásico con números romanos y cristal abovedado. Diseño atemporal a un valor excepcional.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/bc1cf909-541d-417d-af5a-f673996803ec/generated_images/professional-product-photograph-of-a-jap-998b0f75-20251012084109.jpg"
  },
  {
    name: "Seiko 5 Sports GMT",
    reference: "SSk035K1",
    price: "325€",
    description: "Cronómetro automático de precisión con reserva de marcha de 40 horas y precisión superior.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/bc1cf909-541d-417d-af5a-f673996803ec/generated_images/professional-product-photograph-of-a-vin-3d6af314-20251012084115.jpg"
  },
  {
    name: "Seiko Prospex",
    reference: "SSC947P1",
    price: "595€",
    description: "Artesanía exquisita con esfera acabada a mano y el reconocido movimiento Spring Drive.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/bc1cf909-541d-417d-af5a-f673996803ec/generated_images/professional-product-photograph-of-a-jap-6815d532-20251012084122.jpg"
  },
  {
    name: "Seiko Propspex",
    reference: "SSC911P1",
    price: "545€",
    description: "Icónico reloj de campo con bisel de brújula y agujas catedral. Construido para la aventura.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/bc1cf909-541d-417d-af5a-f673996803ec/generated_images/professional-product-photograph-of-an-el-4b33064b-20251012084129.jpg"
  }
]

const testimonials = [
  {
    name: "Carlos Mendoza",
    location: "Madrid, España",
    rating: 5,
    comment: "Pedí un Seiko Prospex y el servicio fue excepcional. El reloj llegó perfectamente empaquetado con toda la documentación. ¡Totalmente recomendado!",
    watch: "SSK035K1"
  },
  {
    name: "Alberto Pérez",
    location: "Valladolid, España",
    rating: 5,
    comment: "La atención al cliente es increíble. Me ayudaron a encontrar el Seiko GMT naranja a un precio excepcional. Llegó antes del tiempo estimado y asegurado.",
    watch: "SSK005K1"
  },
  {
    name: "Javier Ruiz",
    location: "Valencia, España",
    rating: 5,
    comment: "Como coleccionista, aprecio la autenticidad y transparencia. IWatches cumple con todo lo prometido.",
    watch: "TAG Heuer Fórmula 1"
  },
  {
    name: "Carlos",
    location: "Cádiz, España",
    rating: 5,
    comment: "Excelente experiencia de compra. El seguimiento del envío fue perfecto y el reloj superó mis expectativas. Volveré a comprar sin duda.",
    watch: "SSK021K1"
  },
  {
    name: "Carlos",
    location: "Cádiz, España",
    rating: 5,
    comment: "Excelente experiencia de compra. El seguimiento del envío fue perfecto y el reloj superó mis expectativas. Volveré a comprar sin duda.",
    watch: "SSC911P1"
  }
]

function HomeContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [catalogDialogOpen, setCatalogDialogOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get("ref")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    toast.success("Gracias por tu mensaje. Te responderemos pronto.")
    setFormData({ name: "", email: "", message: "" })
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

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - RESPONSIVE */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-light tracking-tight">IWatches</h1>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-6 xl:gap-8 items-center text-sm">
              <a href="#home" className="hover:text-[var(--gold)] transition-colors">Inicio</a>
              <a href="#catalog" className="hover:text-[var(--gold)] transition-colors">Catálogo</a>
              <a href="#reviews" className="hover:text-[var(--gold)] transition-colors">Reseñas</a>
              <a href="#process" className="hover:text-[var(--gold)] transition-colors">Proceso</a>
              <a href="#contact" className="hover:text-[var(--gold)] transition-colors">Contacto</a>
              
              {!isPending && (
                <>
                  {session?.user ? (
                    <div className="flex gap-3 items-center ml-4 pl-4 border-l border-border">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push("/mi-cuenta")}
                        className="gap-2"
                      >
                        <User className="w-4 h-4" />
                        Mi Cuenta
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleLogout}
                        className="gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Salir
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-center ml-4 pl-4 border-l border-border">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push("/login")}
                      >
                        Iniciar Sesión
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => router.push("/registro")}
                        className="bg-[var(--gold)] text-white hover:bg-[var(--gold)]/90"
                      >
                        Registrarse
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 hover:text-[var(--gold)] transition-colors">
                Inicio
              </button>
              <button onClick={() => scrollToSection('catalog')} className="block w-full text-left py-2 hover:text-[var(--gold)] transition-colors">
                Catálogo
              </button>
              <button onClick={() => scrollToSection('reviews')} className="block w-full text-left py-2 hover:text-[var(--gold)] transition-colors">
                Reseñas
              </button>
              <button onClick={() => scrollToSection('process')} className="block w-full text-left py-2 hover:text-[var(--gold)] transition-colors">
                Proceso
              </button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 hover:text-[var(--gold)] transition-colors">
                Contacto
              </button>
              
              {!isPending && (
                <div className="pt-3 border-t border-border space-y-2">
                  {session?.user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          router.push("/mi-cuenta")
                        }}
                        className="w-full justify-start gap-2"
                      >
                        <User className="w-4 h-4" />
                        Mi Cuenta
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Salir
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          router.push("/login")
                        }}
                        className="w-full"
                      >
                        Iniciar Sesión
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          router.push("/registro")
                        }}
                        className="w-full bg-[var(--gold)] text-white hover:bg-[var(--gold)]/90"
                      >
                        Registrarse
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - RESPONSIVE */}
      <section id="home" className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
              Precisión.<br />Herencia.<br />Valor.
            </h2>
            <div className="h-px w-16 sm:w-24 bg-[var(--gold)] mx-auto"></div>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
              Somos un distribuidor independiente especializado en relojes automáticos. 
              Creemos en el valor, la historia y la precisión.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 px-4">
              <Button 
                size="lg"
                onClick={() => setCatalogDialogOpen(true)}
                className="gap-2 bg-foreground hover:bg-foreground/90 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Descargar Catálogo
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('catalog')}
                className="w-full sm:w-auto"
              >
                Ver Colección
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section - RESPONSIVE */}
      <section id="catalog" className="py-12 sm:py-20 px-4 sm:px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4">Nuestra Colección</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Selección curada de relojes excepcionales</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {watches.map((watch) => (
              <Card key={watch.reference} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square relative overflow-hidden bg-white">
                  <Image
                    src={watch.image}
                    alt={watch.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-lg sm:text-xl font-light">{watch.name}</h4>
                    <span className="text-[var(--gold)] font-medium flex-shrink-0">{watch.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{watch.reference}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{watch.description}</p>
                  <Button variant="outline" className="w-full mt-4">Consultar</Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button 
              size="lg"
              onClick={() => setCatalogDialogOpen(true)}
              className="gap-2 w-full sm:w-auto"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Descarga el Catálogo Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section - RESPONSIVE */}
      <section id="reviews" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4">Lo Que Dicen Nuestros Clientes</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Testimonios reales de clientes satisfechos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-5 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <p className="text-xs text-[var(--gold)] font-medium">{testimonial.watch}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Card className="p-6 sm:p-8 max-w-2xl mx-auto border-[var(--gold)]/20">
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                ¿Ya compraste con nosotros? Comparte tu experiencia
              </p>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto"
              >
                Enviar Reseña
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section - RESPONSIVE */}
      <section id="process" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4">Nuestro Proceso</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Transparencia y confianza en cada transacción</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--gold)]" />
              </div>
              <h4 className="text-lg sm:text-xl font-light">Autenticidad Garantizada</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada reloj es verificado y viene con documentación completa que prueba su autenticidad.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--gold)]" />
              </div>
              <h4 className="text-lg sm:text-xl font-light">Envío Asegurado</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Todos los relojes se envían asegurados con número de seguimiento. Tu inversión está protegida.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--gold)]" />
              </div>
              <h4 className="text-lg sm:text-xl font-light">Documentación Completa</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Emitimos facturas adecuadas y mantenemos registros completos de cada transacción.
              </p>
            </div>
          </div>

          <div className="mt-10 sm:mt-16 max-w-3xl mx-auto">
            <Card className="p-6 sm:p-8 border-[var(--gold)]/20">
              <p className="text-center text-sm sm:text-base text-muted-foreground leading-relaxed">
                "Todos los relojes se envían asegurados y con número de seguimiento. Emitimos factura y garantizamos la autenticidad."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section - RESPONSIVE */}
      <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4">Contáctanos</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              ¿Buscas un modelo específico? Escríbenos y te ayudaremos a encontrarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <Card className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nombre</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Correo Electrónico</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mensaje</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder="Cuéntanos sobre el reloj que estás buscando..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full bg-foreground hover:bg-foreground/90">
                  Enviar Mensaje
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <Card className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-2">WhatsApp</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Respuestas rápidas en horario comercial
                    </p>
                    <a 
                      href="https://wa.me/34644706402" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline break-words"
                    >
                      Envíanos un mensaje por WhatsApp
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--gold)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-2">Correo Electrónico</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Consultas detalladas bienvenidas
                    </p>
                    <a 
                      href="mailto:contacto@iwatches.com" 
                      className="text-sm text-[var(--gold)] hover:underline break-words"
                    >
                      contacto@iwatches.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--gold)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-2">Teléfono</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Lunes - Viernes, 9AM - 6PM
                    </p>
                    <a 
                      href="tel:+34644706402" 
                      className="text-sm text-[var(--gold)] hover:underline"
                    >
                      +34 644 70 64 02
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-light tracking-tight">IWatches</h2>
          <p className="text-sm text-muted-foreground">
            Distribuidor independiente
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 IWatches. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Catalog Download Dialog */}
      <CatalogDownloadDialog 
        open={catalogDialogOpen}
        onOpenChange={setCatalogDialogOpen}
        referralCode={referralCode}
      />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  )
}