export default function Button({ children, className = "w-full py-2 rounded-2xl", ...props }) {
  return (
    <button className={`bg-purple-600 text-white hover:bg-purple-800 ${className}`} {...props}>
      {children}
    </button>
  );
}