'use client';

import AnimatedButton from '@/components/ui/AnimatedButton';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { animations } from '@/lib/helpers/animation';
import { motion } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormFieldsProps {
  formData: FormData;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: FormEvent) => void;
}

const formFields = [
  { id: 'name', label: 'Nom', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'subject', label: 'Sujet', type: 'text' },
];

function ContactFormFields({
  formData,
  handleChange,
  handleSubmit,
}: ContactFormFieldsProps) {
  return (
    <motion.form
      variants={animations.formContainer}
      onSubmit={handleSubmit}
      className="h-full"
    >
      {formFields.map((field) => (
        <motion.div
          key={field.id}
          variants={animations.formItem}
          className="mb-6"
        >
          <Label htmlFor={field.id} className="block mb-2">
            {field.label}
          </Label>
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            value={formData[field.id as keyof FormData]}
            onChange={handleChange}
            required
            className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
          />
        </motion.div>
      ))}

      <motion.div variants={animations.formItem} className="mb-6">
        <Label htmlFor="message" className="block mb-2">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
        />
      </motion.div>

      <motion.div
        variants={animations.formItem}
        whileHover={animations.hover.scale}
        whileTap={animations.hover.tap}
      >
        <AnimatedButton
          type="submit"
          Icon={Send}
          className="w-full py-6 text-lg"
        >
          Envoyer
        </AnimatedButton>
      </motion.div>
    </motion.form>
  );
}

function SubmissionSuccess() {
  return (
    <motion.div
      variants={animations.scale}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col items-center justify-center text-center"
    >
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-2xl font-semibold text-foreground">
        Message envoyé!
      </h3>
      <p className="mt-2 text-muted-foreground">
        Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs
        délais.
      </p>
    </motion.div>
  );
}

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitted(true);
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }, 3000);
    }, 1000);
  };

  return (
    <Card className="p-8">
      <motion.div variants={animations.formItem}>
        <h2 className="text-2xl font-bold mb-2">Envoyez-nous un message</h2>
        <p className="text-muted-foreground">
          Pour toute question ou autre qui n'ont pas pu être repondu dans la FAQ
          posez les nous ici.
        </p>
      </motion.div>
      <motion.div
        variants={animations.withDuration(animations.fadeIn, 1)}
        className="rounded-xl text-left mt-4"
      >
        {isSubmitted ? (
          <SubmissionSuccess />
        ) : (
          <ContactFormFields
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </motion.div>
    </Card>
  );
}
