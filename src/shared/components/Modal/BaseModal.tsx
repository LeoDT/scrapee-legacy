import * as React from 'react';
import { cx } from 'emotion';
import { motion, Transition } from 'framer-motion';

import Portal from '../Portal';

interface Props extends React.HTMLProps<HTMLDivElement> {}

const transition: Transition = {
  duration: 0.18,
  ease: 'easeInOut'
};

export default function BaseModal({ className, ...restProps }: Props): JSX.Element {
  return (
    <Portal root="modals">
      <motion.div
        className="modal-wrapper left-0 top-0 absolute h-screen w-screen flex justify-center items-start overflow-auto pb-10"
        style={{
          backgroundColor: 'rgba(0,0,0,0.50)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <motion.div
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          exit={{ y: -30 }}
          transition={transition}
        >
          <div
            className={cx(
              'modal z-20 relative bg-white p-4 rounded-md rounded-t-none max-w-screen-sm shadow-lg',
              className
            )}
            {...restProps}
          />
        </motion.div>
      </motion.div>
    </Portal>
  );
}
