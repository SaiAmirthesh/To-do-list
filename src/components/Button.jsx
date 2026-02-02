function Button({ children, onClick, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        mt-4 ml-2 px-4 py-2 rounded-md font-medium
        bg-blue-600 text-white
        hover:bg-blue-700
        active:scale-95
        transition
        disabled:bg-gray-400
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  );
}

export default Button;
