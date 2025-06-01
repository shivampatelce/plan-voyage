import './Loader.css';
import { motion } from 'motion/react';

const Loader = () => {
  const dotVariants = {
    pulse: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      animate='pulse'
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className='loader-container'>
      <motion.div
        className='dot'
        variants={dotVariants}
      />
      <motion.div
        className='dot'
        variants={dotVariants}
      />
      <motion.div
        className='dot'
        variants={dotVariants}
      />
    </motion.div>
  );
};

export default Loader;
