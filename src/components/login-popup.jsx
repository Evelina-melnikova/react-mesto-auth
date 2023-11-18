export default function Popup ({ name, children, isOpen, onClose }) {

    return (
        <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
            <div className={`${name === "image" ? "popup__container-image" : "popup__container"} ${name === "result" ? "popup__container-registration" : ""}`}
            onMouseDown={(event) => event.stopPropagation()}>
                <button type="button" className="popup__close" onClick={onClose} />
                {children}
            </div>
        </div>
    )
}