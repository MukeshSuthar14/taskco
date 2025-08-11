import type React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full p-100 layout">
            <Header />
            {children}
            <Footer />
        </div>
    )
}