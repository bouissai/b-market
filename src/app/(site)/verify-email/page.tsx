// app/verify-email/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de vérification manquant.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email vérifié avec succès !");
        } else {
          setStatus("error");
          setMessage(data.message || "Erreur lors de la vérification de l'email.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Une erreur est survenue lors de la vérification.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Vérification de l'email</CardTitle>
          <CardDescription>
            {status === "loading" && "Nous vérifions votre adresse email..."}
            {status === "success" && "Votre email a été vérifié avec succès !"}
            {status === "error" && "La vérification a échoué."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="mt-4">Vérification en cours...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="mt-4">{message}</p>
              <Button 
                className="mt-6" 
                onClick={() => router.push("/auth")}
              >
                Se connecter
              </Button>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="mt-4">{message}</p>
              <Button 
                className="mt-6" 
                onClick={() => router.push("/auth")}
                variant="outline"
              >
                Retour à la connexion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}