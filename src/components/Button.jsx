export default function Button({ children }) {
  return (
    <button className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700">
      {children}
    </button>
  );
}