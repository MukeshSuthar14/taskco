import type React from "react";

const Modal = ({
    isOpen,
    onClose = () => { },
    children,
    title
}: {
    isOpen: boolean
    onClose?: Function
    children: React.ReactNode
    title: string | undefined
}) => {
    if (!isOpen) return <></>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={(event) => onClose(event)}
            ></div>

            {/* Modal Content */}
            <div className="relative w-[500px] max-w-lg mx-auto my-6">
                <div className="relative flex flex-col w-full border-0 rounded-lg shadow-lg outline-none bg-[#b6e9f9] focus:outline-none">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                        <h3 className="text-2xl font-semibold">{title}</h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={(event) => onClose(event)}
                        >
                            <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                            </span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative pl-6 pr-6 flex-auto">{children}</div>
                    
                </div>
            </div>
        </div>
    );
};

export default Modal;