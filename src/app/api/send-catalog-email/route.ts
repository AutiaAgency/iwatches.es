import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { email, name, catalogType } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email y nombre son requeridos" },
        { status: 400 }
      )
    }

    // Determinar el tipo de catálogo
    const catalogName = catalogType === "premium" 
      ? "Catálogo Premium IWatches 2025-2026" 
      : "Catálogo IWatches 2025-2026"

    const catalogUrl = catalogType === "premium"
      ? `${process.env.NEXT_PUBLIC_APP_URL}/catalogs/CATALOGO-PREMIUM-25-26.pdf`
      : `${process.env.NEXT_PUBLIC_APP_URL}/catalogs/CATALOGO-25-26.pdf`

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: "IWatches <onboarding@resend.dev>",
      to: [email],
      subject: `Tu ${catalogName} está listo`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 40px 0 30px;
                border-bottom: 1px solid #e5e5e5;
              }
              .header h1 {
                font-family: 'Crimson Pro', serif;
                font-size: 32px;
                font-weight: 300;
                margin: 0;
                letter-spacing: -0.02em;
              }
              .content {
                padding: 40px 20px;
              }
              .greeting {
                font-size: 18px;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                padding: 14px 32px;
                background-color: #0a0a0a;
                color: white;
                text-decoration: none;
                border-radius: 2px;
                margin: 30px 0;
                font-weight: 500;
              }
              .features {
                background-color: #f9f9f9;
                padding: 30px;
                border-radius: 4px;
                margin: 30px 0;
              }
              .features h3 {
                font-size: 16px;
                margin-top: 0;
                color: #b8860b;
              }
              .features ul {
                margin: 0;
                padding-left: 20px;
              }
              .features li {
                margin: 10px 0;
                color: #666;
              }
              .footer {
                text-align: center;
                padding: 30px 20px;
                border-top: 1px solid #e5e5e5;
                color: #999;
                font-size: 12px;
              }
              .gold-line {
                height: 1px;
                background-color: #b8860b;
                width: 60px;
                margin: 20px auto;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>IWatches</h1>
              <div class="gold-line"></div>
            </div>
            
            <div class="content">
              <p class="greeting">Hola ${name},</p>
              
              <p>Gracias por tu interés en nuestra colección de relojes automáticos. Tu ${catalogName} está listo para descargar.</p>
              
              <div style="text-align: center;">
                <a href="${catalogUrl}" class="button">Descargar Catálogo PDF</a>
              </div>
              
              ${catalogType === "premium" ? `
                <div class="features">
                  <h3>✨ Catálogo Premium - Acceso Exclusivo</h3>
                  <ul>
                    <li>Colección completa de ediciones limitadas</li>
                    <li>Precios especiales para clientes VIP</li>
                    <li>Acceso anticipado a nuevos lanzamientos</li>
                    <li>Información detallada de especificaciones técnicas</li>
                  </ul>
                </div>
              ` : `
                <div class="features">
                  <h3>📖 En Este Catálogo Encontrarás:</h3>
                  <ul>
                    <li>Nuestra selección de relojes Seiko 5 Sports GMT</li>
                    <li>Colección Seiko Prospex</li>
                    <li>Precios actualizados 2025-2026</li>
                    <li>Referencias y especificaciones</li>
                  </ul>
                </div>
              `}
              
              <p><strong>¿Necesitas ayuda?</strong></p>
              <p>Si estás buscando un modelo específico o tienes alguna pregunta, no dudes en contactarnos:</p>
              <p>
                📱 WhatsApp: <a href="https://wa.me/34644706402">+34 644 70 64 02</a><br>
                📧 Email: contacto@iwatches.com
              </p>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Todos nuestros relojes se envían asegurados con número de seguimiento. 
                Emitimos factura y garantizamos la autenticidad.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2025 IWatches. Distribuidor independiente.</p>
              <p>Precisión. Herencia. Valor.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return NextResponse.json(
        { error: "Error al enviar el email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in send-catalog-email:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}