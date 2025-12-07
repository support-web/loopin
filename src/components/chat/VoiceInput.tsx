'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Send, Loader2 } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { VoiceWaveform } from './VoiceWaveform';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onResult, disabled = false }: VoiceInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finalText, setFinalText] = useState('');

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    audioLevel,
  } = useVoiceRecognition({
    onResult: (text) => {
      setFinalText((prev) => prev + text);
    },
  });

  // Reset when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setFinalText('');
      resetTranscript();
    }
  }, [isModalOpen, resetTranscript]);

  const handleOpen = () => {
    setIsModalOpen(true);
    startListening();
  };

  const handleClose = () => {
    stopListening();
    setIsModalOpen(false);
  };

  const handleSend = () => {
    const textToSend = finalText + interimTranscript;
    if (textToSend.trim()) {
      onResult(textToSend.trim());
    }
    handleClose();
  };

  if (!isSupported) {
    return null;
  }

  const displayText = finalText + interimTranscript;

  return (
    <>
      {/* Mic button */}
      <motion.button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center',
          'bg-gradient-to-br from-accent-500 to-primary-500 text-white',
          'shadow-lg shadow-accent-500/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:shadow-xl hover:shadow-accent-500/40 transition-shadow'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Mic className="w-5 h-5" />
      </motion.button>

      {/* Voice input modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-md bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-6 shadow-2xl"
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Status indicator */}
              <div className="text-center mb-6">
                <motion.div
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4',
                    isListening ? 'bg-white/20' : 'bg-red-500/20'
                  )}
                  animate={{
                    scale: isListening ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    repeat: isListening ? Infinity : 0,
                    duration: 1,
                  }}
                >
                  {isListening ? (
                    <>
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-white">
                        聞いています...
                      </span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-white">
                        停止中
                      </span>
                    </>
                  )}
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-2">
                  話してください
                </h3>
                <p className="text-white/70 text-sm">
                  あなたの言葉をテキストに変換します
                </p>
              </div>

              {/* Waveform visualization */}
              <motion.div
                className="flex justify-center mb-6"
                animate={{
                  scale: isListening ? 1 : 0.9,
                  opacity: isListening ? 1 : 0.5,
                }}
              >
                <div className="relative">
                  {/* Pulsing background */}
                  {isListening && (
                    <motion.div
                      className="absolute inset-0 bg-white/10 rounded-full blur-xl"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{
                        width: 150,
                        height: 150,
                        marginLeft: -25,
                        marginTop: -50,
                      }}
                    />
                  )}

                  {/* Main microphone circle */}
                  <motion.div
                    className={cn(
                      'w-24 h-24 rounded-full flex items-center justify-center',
                      isListening
                        ? 'bg-white shadow-lg shadow-white/30'
                        : 'bg-white/20'
                    )}
                    animate={{
                      scale: isListening ? 1 + audioLevel * 0.15 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 15,
                    }}
                    onClick={isListening ? stopListening : startListening}
                  >
                    {isListening ? (
                      <VoiceWaveform
                        audioLevel={audioLevel}
                        isActive={isListening}
                        barCount={7}
                      />
                    ) : (
                      <Mic
                        className={cn(
                          'w-10 h-10',
                          isListening ? 'text-primary-600' : 'text-white'
                        )}
                      />
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {/* Transcript display */}
              <div className="bg-white/10 rounded-2xl p-4 mb-6 min-h-[100px] max-h-[200px] overflow-y-auto">
                {displayText ? (
                  <p className="text-white leading-relaxed">
                    {finalText}
                    {interimTranscript && (
                      <span className="text-white/60">{interimTranscript}</span>
                    )}
                  </p>
                ) : (
                  <p className="text-white/50 text-center">
                    {isListening
                      ? '音声を認識中...'
                      : 'マイクをタップして開始'}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  キャンセル
                </motion.button>
                <motion.button
                  onClick={handleSend}
                  disabled={!displayText.trim()}
                  className={cn(
                    'flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2',
                    displayText.trim()
                      ? 'bg-white text-primary-600 hover:bg-white/90'
                      : 'bg-white/20 text-white/50 cursor-not-allowed'
                  )}
                  whileHover={displayText.trim() ? { scale: 1.02 } : {}}
                  whileTap={displayText.trim() ? { scale: 0.98 } : {}}
                >
                  <Send className="w-4 h-4" />
                  送信
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
