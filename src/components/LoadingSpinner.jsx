import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 24, color = 'blue', label = 'Loading...' }) {
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  const colors = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-green-500',
    gray: 'text-gray-500'
  };

  return (
    <div className="inline-flex flex-col items-center justify-center" role="status">
      <motion.div
        className={`relative ${colors[color] || colors.blue}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {/* Outer spinning circle */}
        <motion.span
          className="absolute inset-0 border-2 border-current rounded-full"
          style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
        
        {/* Inner spinning circle */}
        <motion.span
          className="absolute inset-1 border-2 border-current rounded-full opacity-75"
          style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }}
          animate={{ rotate: -360 }}
          transition={{
            ...spinTransition,
            duration: 1.5
          }}
        />

        {/* Center dot */}
        <motion.span
          className="absolute inset-[35%] rounded-full bg-current"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [1, 0.6, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {label && (
        <span className="sr-only">
          {label}
        </span>
      )}
    </div>
  );
}