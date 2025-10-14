"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Shield, Package, FileText, MessageCircle, Mail, Phone, Download, Star, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CatalogDownloadDialog } from "@/components/catalog-download-dialog"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const watches = [
  {
    name: "Seiko 5 Sports GMT",
    reference: "SSK021K1",
    price: "325€",
    description: "Reloj elegante con esfera sunburst y complicación de fecha. Perfecto para ocasiones formales.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/bc1cf909-541d-417d-af5a-f673996803ec/generated_images/professional-product-photograph-of-a-lux-c532ad9e-20251012084102.jpg"
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

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [catalogDialogOpen, setCatalogDialogOpen] = useState(false)
  const { data: session, isPending } = useSession()
  const router = useRouter()

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-light tracking-tight">IWatches</h1>
            <div className="flex gap-8 items-center text-sm">
              <a href="#home" className="hover:text-[var(--gold)] transition-colors">Inicio</a>
              <a href="#catalog" className="hover:text-[var(--gold)] transition-colors">Catálogo</a>
              <a href="#reviews" className="hover:text-[var(--gold)] transition-colors">Reseñas</a>
              <a href="#process" className="hover:text-[var(--gold)] transition-colors">Proceso</a>
              <a href="#contact" className="hover:text-[var(--gold)] transition-colors">Contacto</a>
              
              {!isPending && (
                <>
                  {session?.user ? (
                    <div className="flex gap-4 items-center ml-4 pl-4 border-l border-border">
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
                    <div className="flex gap-4 items-center ml-4 pl-4 border-l border-border">
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-6xl md:text-7xl font-light tracking-tight leading-tight">
              Precisión.<br />Herencia.<br />Valor.
            </h2>
            <div className="h-px w-24 bg-[var(--gold)] mx-auto"></div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Somos un distribuidor independiente especializado en relojes automáticos. 
              Creemos en el valor, la historia y la precisión.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Button 
                size="lg"
                onClick={() => setCatalogDialogOpen(true)}
                className="gap-2 bg-foreground hover:bg-foreground/90"
              >
                <Download className="w-4 h-4" />
                Descargar Catálogo
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Colección
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-light mb-4">Nuestra Colección</h3>
            <p className="text-muted-foreground">Selección curada de relojes excepcionales</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-light">{watch.name}</h4>
                    <span className="text-[var(--gold)] font-medium">{watch.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{watch.reference}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{watch.description}</p>
                  <Button variant="outline" className="w-full mt-4">Consultar</Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setCatalogDialogOpen(true)}
              className="gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Descarga el Catálogo Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-light mb-4">Lo Que Dicen Nuestros Clientes</h3>
            <p className="text-muted-foreground">Testimonios reales de clientes satisfechos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <p className="text-xs text-[var(--gold)] font-medium">{testimonial.watch}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="p-8 max-w-2xl mx-auto border-[var(--gold)]/20">
              <p className="text-muted-foreground mb-4">
                ¿Ya compraste con nosotros? Comparte tu experiencia
              </p>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Enviar Reseña
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-light mb-4">Nuestro Proceso</h3>
            <p className="text-muted-foreground">Transparencia y confianza en cada transacción</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h4 className="text-xl font-light">Autenticidad Garantizada</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada reloj es verificado y viene con documentación completa que prueba su autenticidad.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h4 className="text-xl font-light">Envío Asegurado</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Todos los relojes se envían asegurados con número de seguimiento. Tu inversión está protegida.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h4 className="text-xl font-light">Documentación Completa</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Emitimos facturas adecuadas y mantenemos registros completos de cada transacción.
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="p-8 border-[var(--gold)]/20">
              <p className="text-center text-muted-foreground leading-relaxed">
                "Todos los relojes se envían asegurados y con número de seguimiento. Emitimos factura y garantizamos la autenticidad."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-light mb-4">Contáctanos</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ¿Buscas un modelo específico? Escríbenos y te ayudaremos a encontrarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="space-y-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">WhatsApp</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Respuestas rápidas en horario comercial
                    </p>
                    <a 
                      href="https://wa.me/1234567890" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Envíanos un mensaje por WhatsApp
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--gold)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Correo Electrónico</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Consultas detalladas bienvenidas
                    </p>
                    <a 
                      href="mailto:contacto@iwatches.com" 
                      className="text-sm text-[var(--gold)] hover:underline"
                    >
                      contacto@iwatches.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--gold)]" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Teléfono</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Lunes - Viernes, 9AM - 6PM
                    </p>
                    <a 
                      href="tel:+1234567890" 
                      className="text-sm text-[var(--gold)] hover:underline"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-light tracking-tight">IWatches</h2>
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
      />
    </div>
  )
}