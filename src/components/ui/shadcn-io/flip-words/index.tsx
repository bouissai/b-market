'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from "@/lib/utils"

type FlipWordsProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  words: string[];
  duration?: number;
  letterDelay?: number;
  wordDelay?: number;
};

function FlipWords({
  ref,
  words,
  duration = 3000,
  letterDelay = 0.05,
  wordDelay = 0.3,
  className,
  ...props
}: Omit<FlipWordsProps, 'ref'> & { ref?: React.Ref<HTMLSpanElement> }) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement);

  const [currentWord, setCurrentWord] = React.useState(words[0]);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  const startAnimation = React.useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  React.useEffect(() => {
    if (!isAnimating) {
      const timeoutId = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timeoutId);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <span ref={localRef} data-slot="flip-words" {...props}>
      <AnimatePresence
        onExitComplete={() => {
          setIsAnimating(false);
        }}
      >
        <motion.span
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 10,
          }}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: 'blur(8px)',
            scale: 2,
            position: 'absolute',
          }}
          className={cn(
            'inline-block relative text-left px-2 will-change-transform will-change-opacity will-change-filter',
            className
          )}
          key={currentWord}
        >
          {currentWord.split(' ').map((word, wordIndex) => (
            <motion.span
              key={`${word}-${wordIndex}`}
              initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: wordIndex * wordDelay,
                duration: 0.3,
              }}
              className="inline-block whitespace-nowrap"
            >
              {word.split('').map((letter, letterIndex) => (
                <motion.span
                  key={`${word}-${letterIndex}`}
                  initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: wordIndex * wordDelay + letterIndex * letterDelay,
                    duration: 0.2,
                  }}
                  className="inline-block will-change-transform will-change-opacity will-change-filter"
                >
                  {letter}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export { FlipWords, type FlipWordsProps };