/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

export type AnimatedModalState = {
  showModal: boolean;
};

export class AnimatedModalComponent<
  P = Record<string, unknown>,
  S extends AnimatedModalState = AnimatedModalState
> extends React.Component<P, S> {
  constructor(props: P) {
    super(props as any);
    this.state = {
      ...(this.state as any),
      showModal: false,
    };
  }

  openModal = () => {
    this.setState({ showModal: true } as S);
  };

  closeModal = () => {
    this.setState({ showModal: false } as S);
  };

  /** 
   * Override this method to define modal body 
   */
  renderModalContent(): React.ReactNode {
    return (
      <div className="text-white">
        <p>Override `renderModalContent()` in your subclass</p>
      </div>
    );
  }

  renderModalWrapper() {
    const { showModal } = this.state;

    return (
      <AnimatePresence>
        {showModal && (
          <Dialog
            open={showModal}
            onClose={this.closeModal}
            className="relative z-50"
          >
            {/* Overlay */}
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                key="modal"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="bg-gray-800 rounded-lg p-6 w-[400px] shadow-xl"
              >
                {this.renderModalContent()}
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    );
  }
}
