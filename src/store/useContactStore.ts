import { toast } from "@/hooks/use-toast";
import type { Category } from "@/types/category";
import { ContactDto, ContactQuoteDto } from "@/types/contact";
import { create } from "zustand";


type ContactStore = {
    sendContact: (contact: ContactDto) => Promise<{ success: boolean; message: string }>
    sendContactEvent: (contactQuote: ContactQuoteDto) => Promise<{ success: boolean; message: string }>
};


export const useContactStore = create<ContactStore>((set, get) => ({

    async sendContact(contact: ContactDto): Promise<{ success: boolean; message: string }> {
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'envoi");
          }
      
          return { success: true, message: "Message envoyé avec succès" };
        } catch (err) {
          return {
            success: false,
            message: err instanceof Error ? err.message : "Erreur inconnue",
          };
        }
      },
      
      async sendContactEvent(contactQuote: ContactQuoteDto): Promise<{ success: boolean; message: string }> {
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactQuote),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'envoi");
          }
      
          return { success: true, message: "Message envoyé avec succès" };
        } catch (err) {
          return {
            success: false,
            message: err instanceof Error ? err.message : "Erreur inconnue",
          };
        }
      }

}));
