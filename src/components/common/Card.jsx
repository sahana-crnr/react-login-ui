export default function Card({ children }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-md w-[90%] md:w-[400px]">
            {children}
        </div>
    );
}