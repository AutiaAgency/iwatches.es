import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // CRÍTICO: Verificar que RESEND_API_KEY esté configurada ANTES de inicializar
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // CRÍTICO: Inicializar Resend DENTRO de la función, no fuera
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email, name, catalogType } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Email y nombre son requeridos" }, { status: 400 });
    }

    const catalogUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/CATALOGO-25-26-1760710906370.pdf";
    
    const isPremium = catalogType === 'premium';

    const { data, error } = await resend.emails.send({
      from: 'IWatches <onboarding@resend.dev>',
      to: [email],
      subject: isPremium 
        ? '🎁 Tu Catálogo Premium - IWatches' 
        : '📖 Catálogo IWatches 2025/2026',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px; }
              .header p { margin: 10px 0 0; font-size: 14px; opacity: 0.9; }
              .content { background: #ffffff; padding: 40px 30px; }
              .content h2 { color: #1a1a1a; font-size: 24px; font-weight: 300; margin: 0 0 20px; }
              .content p { margin: 15px 0; color: #666; }
              .content ul { margin: 20px 0; padding-left: 20px; }
              .content li { margin: 10px 0; color: #666; }
              .button { display: inline-block; padding: 16px 40px; background: #d4af37; color: white; text-decoration: none; border-radius: 4px; margin: 25px 0; font-weight: 500; letter-spacing: 0.5px; }
              .button:hover { background: #c19b2c; }
              .contact-info { background: #f9f9f9; padding: 20px; border-radius: 4px; margin: 30px 0; }
              .contact-info p { margin: 8px 0; color: #666; font-size: 14px; }
              .footer { text-align: center; padding: 30px; color: #999; font-size: 12px; background: #f5f5f5; }
              .footer p { margin: 5px 0; }
              .divider { height: 1px; background: #e0e0e0; margin: 30px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>IWatches</h1>
                <p>Relojes Automáticos de Prestigio</p>
              </div>
              <div class="content">
                <h2>Hola ${name},</h2>
                <p>¡Gracias por tu interés en IWatches! Hemos preparado nuestro ${isPremium ? 'catálogo premium exclusivo' : 'catálogo completo'} para ti.</p>
                
                ${isPremium ? `
                  <p><strong>Como cliente premium, disfruta de:</strong></p>
                  <ul>
                    <li>✨ Acceso anticipado a nuevas colecciones</li>
                    <li>💎 Precios exclusivos para clientes</li>
                    <li>🎁 Ofertas especiales y promociones</li>
                    <li>📦 Envío prioritario en todos tus pedidos</li>
                  </ul>
                ` : `
                  <p>Explora nuestra colección de relojes automáticos japoneses de las mejores marcas: Seiko, Prospex, y más.</p>
                  <p>Cada reloj viene con garantía de autenticidad, envío asegurado y documentación completa.</p>
                `}
                
                <div class="divider"></div>
                
                <center>
                  <a href="${catalogUrl}" class="button">📥 Descargar Catálogo PDF</a>
                </center>
                
                <div class="divider"></div>
                
                <p>Si tienes alguna pregunta o necesitas ayuda para encontrar el reloj perfecto, no dudes en contactarnos.</p>
                
                <div class="contact-info">
                  <p><strong>📞 Contacto:</strong></p>
                  <p>📧 Email: contacto@iwatches.com</p>
                  <p>📱 WhatsApp: +34 644 70 64 02</p>
                  <p>🕒 Horario: Lunes - Viernes, 9AM - 6PM</p>
                </div>
              </div>
              <div class="footer">
                <p><strong>IWatches</strong> - Distribuidor Independiente de Relojes Automáticos</p>
                <p>Has recibido este email porque solicitaste nuestro catálogo en iwatches.com</p>
                <p>© 2024 IWatches. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 });
  }
}