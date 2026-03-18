export default function Button({ children }) {
  return (
    <button className="w-full bg-purple-600 text-white py-2 rounded-2xl  hover:bg-purple-800">
      {children}
    </button>
  );
}