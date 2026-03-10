import "./ShopPopUp.css";
import product from "../../assets/icon.png"

function ShopPopUp({ onClose }) {
    return (<>
        <div className="pop-up">
            <button className="close-btn" onClick={onClose}>x</button>
            <div className="product-section">
                <h3>Product Name</h3>
                <img src={product} alt="product_image" style={{ maxWidth: 350, maxHeight: 350 }} />
            </div>
        </div>
    </>);
}

export default ShopPopUp;