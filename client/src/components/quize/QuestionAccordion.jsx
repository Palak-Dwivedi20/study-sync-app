import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from "react-icons/fa";

function QuestionAccordion({ question, index, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-700 rounded-md bg-zinc-800 text-white shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between w-full px-4 py-3 text-left font-medium hover:bg-zinc-900 rounded-md"
      >
        <span>{index + 1}. {question.questionText}</span>
        <span className="cursor-pointer">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-2 text-sm">
          <ul className="list-disc ml-5">
            {question.options.map((opt, i) => (
              <li key={i}>
                <span className={question.correctOption === String.fromCharCode(65 + i) ? "font-semibold text-green-600" : ""}>
                  {String.fromCharCode(65 + i)}. {opt}
                </span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex justify-between items-center space-x-3 pt-2">
            <button
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center cursor-pointer"
              onClick={() => onEdit(question)}
            >
              <FaEdit className="mr-1" /> Edit
            </button>
            <button
              className="text-red-600 hover:text-red-800 text-sm flex items-center cursor-pointer"
              onClick={() => onDelete(question._id)}
            >
              <FaTrash className="mr-1" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionAccordion;
