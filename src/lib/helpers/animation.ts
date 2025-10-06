export const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  },
  formContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  formItem: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  },
  hover: {
    scale: { scale: 1.03 },
    tap: { scale: 0.97 },
    moveRight: { x: 5 },
  },
  oneByOne: {
    hidden: { opacity: 0, x: -100 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.4,
        type: "spring",
        stiffness: 40,
      },
    }),
  },

  // 🎯 Fonction pour modifier le délai d'une animation
  withDelay: (animation: { visible: { transition?: Record<string, unknown> }; [key: string]: unknown }, delay: number) => ({
    ...animation,
    visible: {
      ...animation.visible,
      transition: {
        ...(animation.visible.transition || {}),
        delay,
      },
    },
  }),

  // 🎯 Fonction pour modifier la durée d'une animation
  withDuration: (animation: { visible: { transition?: Record<string, unknown> }; [key: string]: unknown }, duration: number) => ({
    ...animation,
    visible: {
      ...animation.visible,
      transition: {
        ...(animation.visible.transition || {}),
        duration,
      },
    },
  }),

  // 🎯 Fonction combinée pour modifier simultanément le délai et la durée
  withCustomTransition: (animation: { visible: { transition?: Record<string, unknown> }; [key: string]: unknown }, duration: number, delay: number) => ({
    ...animation,
    visible: {
      ...animation.visible,
      transition: {
        ...(animation.visible.transition || {}),
        duration,
        delay,
      },
    },
  }),
};
