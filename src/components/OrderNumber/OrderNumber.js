import './OrderNumber.css';

export default function OrderNumber(props) {
    return(
        <div className="order-number">
            { props.number }
        </div>
    );
}
