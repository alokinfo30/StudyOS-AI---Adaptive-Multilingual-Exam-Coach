import React from 'react';
import { LanguageCode } from '../../types';
import { SpeechSynthesisPlayer } from './SpeechSynthesisPlayer';

interface TTSButtonProps {
  textToSpeak: string;
  language: LanguageCode;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  textToSpeak,
  language,
  label = 'Read Aloud (TTS)',
  size = 'sm',
  variant = 'secondary',
  className = '',
}) => {
  return (
    <SpeechSynthesisPlayer
      textToSpeak={textToSpeak}
      language={language}
      title={label}
      size={size}
      variant={variant === 'primary' ? 'button' : 'button'}
      className={className}
      showSpeedControl={true}
    />
  );
};
