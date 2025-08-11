import { useEffect, useState } from "react";

export default function Header() {
    const [quote, setQuote] = useState<string | null>(null);
    const getQuote = async () => {
        const response = await fetch('https://quotes-api-self.vercel.app/quote');
        if (response.ok) {
            const result = await response.json();
            if (result?.quote) {
                setQuote(result?.quote)
            }
        }
    }

    useEffect(() => {
        getQuote()
        const quoteInterval = setInterval(getQuote, 60 * 1000);
        return () => clearInterval(quoteInterval);
    }, [])
    
    return (
        <div className="mx-auto flex items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <img className="h-20 shrink-0" src="/logo.png" alt="TaskComplete Logo" />
            <div>
                <div className="text-xl font-medium text-black dark:text-white">TaskComplete</div>
                <p className="text-gray-500 dark:text-gray-400">Project & Task Managment System!</p>
                {quote && <p className="text-gray-500 dark:text-gray-400">Today Quote: "{quote}"</p>}
            </div>
        </div>
    )
}