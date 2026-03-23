export default function Button({ children, className = "", ...props }) {
  const isWidthSet = className.includes("w-") || className.includes("flex-1");
  const widthClass = isWidthSet ? "" : "w-full";

  return (
    <button className={`bg-purple-600 text-white hover:bg-purple-800 font-bold py-2.5 rounded-2xl shadow-md transition-colors disabled:opacity-50 ${widthClass} ${className}`} {...props}>
      {children}
    </button>
  );
}