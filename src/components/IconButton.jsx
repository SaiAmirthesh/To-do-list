function IconButton({ children, onClick, variant = "default" }) {
  const base =
    "w-10 h-10 flex items-center justify-center rounded-md transition active:scale-90";

  const variants = {
    default: "bg-gray-200 hover:bg-gray-300 text-black",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}

export default IconButton;