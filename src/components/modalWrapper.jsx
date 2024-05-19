import { useEffect, useRef } from "react";

const ModalWrapper = ({ onClose, header, body: Body, footer }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, onClose]);
  return (
    <div className="modal" ref={modalRef}>
      <div className="modal-header">{header}</div>
      <div className="modal-body">{Body}</div>
      <div className="modal-footer">{footer}</div>
    </div>
  )
}

export default ModalWrapper
