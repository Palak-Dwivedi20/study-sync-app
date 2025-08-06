import { useRef } from "react";
import { useModal } from "../../contexts/ModalContext";
import { Button } from "../ComponentImport";
import { CiWarning } from "react-icons/ci";

function ConfirmModal({ title = "Are you sure?", message, onConfirm, onCancel }) {

    const { closeConfirmModal } = useModal();

    const bgRef = useRef(null);

    const closeOver = (e) => {
        if (bgRef.current === e.target) {
            closeConfirmModal();
        }
    }

    const handleConfirm = () => {
        onConfirm();
        closeConfirmModal();
    };

    const handleCancel = () => {
        onCancel?.();  // optional cancel logic
        closeConfirmModal();
    };

    return (
        <div
            className="fixed inset-0 backdrop-brightness-30 backdrop-blur-xs flex items-center justify-center z-50"
            ref={bgRef}
            onClick={closeOver}
            aria-hidden="true"
        >
            <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6">
                <div className="flex justify-start items-center space-x-2">
                    <CiWarning className="text-red-600 text-4xl" />
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                </div>
                <p className="text-sm text-gray-600 mt-2">{message}</p>
                <div className="mt-4 flex justify-end space-x-3">
                    <Button
                        title="Cancel"
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 p-1"
                        onClick={handleCancel}
                    />
                    <Button
                        title="Yes, Confirm"
                        className="bg-gray-700 text-white hover:bg-gray-900 p-1"
                        onClick={handleConfirm}
                    />
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
