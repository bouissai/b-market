// types/contact.ts

// DTO pour le formulaire simple de contact (ContactForm)
export type ContactDto = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  };
  
  // DTO pour le formulaire de demande de devis événementiel (ContactFormEvent)
  export type ContactQuoteDto = {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    date?: string; // formaté en ISO string comme dans votre logique
    guests: string;
    message: string;
  };
  