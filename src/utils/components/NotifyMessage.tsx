export default function NotifyMessage({
    notifyMessage
}: {
    notifyMessage: { message: string }
}) {
    return (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 mt-5 mb-5" role="alert">
            <p className="font-bold">{notifyMessage?.message}</p>
        </div>
    )
}