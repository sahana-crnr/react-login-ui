export default function Input({ type, placeholder }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="w-full border rounded-full px-4 py-2 outline-none"
        />
    );
}