// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Schéma de validation pour le formulaire simple
const simpleContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

// Schéma de validation pour le formulaire d'événement
const eventContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  eventType: z.string().min(1),
  date: z.string().optional(), // La date arrive comme chaîne ISO depuis le formulaire
  guests: z.string().min(1),
  message: z.string().min(10),
});


interface form_contact{
  name : string, 
  subject ?:string,
  email : string, 
  phone ?: string, 
  eventType ?: string, 
  date ?: string, 
  guests ?: string, 
  message : string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Détecter le type de formulaire en fonction des champs présents
    const isEventForm = 'eventType' in body && 'phone' in body && 'guests' in body;
    
    let validatedData : form_contact  ;
    
    if (isEventForm) {
      // Valider le formulaire d'événement
      const result = eventContactSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ 
          error: 'Validation échouée', 
          details: result.error.flatten().fieldErrors 
        }, { status: 400 });
      }
      validatedData = result.data;
    } else {
      // Valider le formulaire simple
      const result = simpleContactSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ 
          error: 'Validation échouée', 
          details: result.error.flatten().fieldErrors 
        }, { status: 400 });
      }
      validatedData = result.data;
    }

    // Vérifier les variables d'environnement
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Configuration d\'email manquante');
      return NextResponse.json({ 
        error: 'Configuration du serveur incorrecte'
      }, { status: 500 });
    }

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Préparer le contenu de l'e-mail en fonction du type de formulaire
    let htmlContent: string;
    let subjectMessage: string;
    
    if (isEventForm) {
      const { name, email, phone, eventType, date, guests, message } = validatedData;
      subjectMessage = `Nouvelle demande de devis de ${name}`;
      htmlContent = `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Type d'événement :</strong> ${eventType}</p>
        <p><strong>Date de l'événement :</strong> ${date || 'Non spécifiée'}</p>
        <p><strong>Nombre d'invités :</strong> ${guests}</p>
        <p><strong>Message :</strong> ${message}</p>
      `;
    } else {
      const { name, email, subject, message } = validatedData;
      subjectMessage = `Nouveau message de contact de ${name}: ${subject}`;
      htmlContent = `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <p><strong>Message :</strong> ${message}</p>
      `;
    }

    // Options d'e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || 'bouissailyass@gmail.com',
      subjectMessage,
      html: htmlContent,
    };

    // Envoi de l'e-mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true,
      message: 'E-mail envoyé avec succès' 
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'envoi de l\'e-mail',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}