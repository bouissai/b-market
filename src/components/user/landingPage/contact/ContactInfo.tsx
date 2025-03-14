import { Card } from '@/components/ui/card';
import { contactItems, hoursInfo } from '@/constants';
import { animations } from '@/lib/helpers/animation';
import { motion } from 'framer-motion';
import React from 'react';

export function ContactInfo() {
  return (
    <Card className="p-8">
      <motion.div
        variants={animations.staggerContainer}
        className="flex flex-col justify-center"
      >
        <ContactDetails />
        <OpeningHours />
      </motion.div>
    </Card>
  );
}

function ContactDetails() {
  return (
    <motion.div variants={animations.formItem} className="mb-12">
      <h2 className="text-2xl font-bold mb-2">Nos coordonnées</h2>
      <p className="text-muted-foreground mb-16">
        N'hésitez pas à nous contacter directement. Notre équipe est prête à
        vous aider.
      </p>
      {contactItems.map((item, index) => (
        <motion.div
          key={index}
          className="flex items-start mb-6"
          variants={animations.formItem}
          whileHover={animations.hover.moveRight}
          custom={index}
        >
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            {<item.icon />}
          </div>
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-muted-foreground">{item.info}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function OpeningHours() {
  return (
    <motion.div
      variants={animations.withDelay(animations.fadeInUp, 0.8)}
      className="bg-muted rounded-xl p-6"
    >
      <h3 className="font-semibold mb-2">Heures d'ouverture</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {hoursInfo.map((item, index) => (
          <React.Fragment key={index}>
            <div>{item.day}:</div>
            <div>{item.hours}</div>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}
