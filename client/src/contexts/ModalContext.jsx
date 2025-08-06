import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  // Upload Notes Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);
  const toggleUploadModal = () => setIsUploadModalOpen(prev => !prev);

  // View Notes Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewNoteId, setViewNoteId] = useState(null);
  const openViewModal = (id) => {
    setViewNoteId(id);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewNoteId(null);
    setIsViewModalOpen(false);
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const toggleLoginModal = () => setIsLoginModalOpen(prev => !prev);

  // ✅ Confirm Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({
    title: "",
    message: "",
    onConfirm: () => { },
    onCancel: () => { }
  });

  const openConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    setConfirmModalProps({ title, message, onConfirm, onCancel });
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalProps({
      title: "",
      message: "",
      onConfirm: () => { },
      onCancel: () => { }
    });
  };

  return (
    <ModalContext.Provider
      value={{
        // Upload
        isUploadModalOpen,
        openUploadModal,
        closeUploadModal,
        toggleUploadModal,

        // Upload
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        toggleLoginModal,

        // View
        isViewModalOpen,
        viewNoteId,
        openViewModal,
        closeViewModal,

        // ✅ Confirm Modal
        isConfirmModalOpen,
        confirmModalProps,
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
