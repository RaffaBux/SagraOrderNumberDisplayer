import { useEffect, useState } from 'react';
import './App.css';
import OrderNumber from '../OrderNumber/OrderNumber.js';

export default function App() {

    const[ preparingOrders, setPreparingOrders ] = useState([]);
    const[ readyOrders, setReadyOrders ] = useState([]);
    const[ ordersHistory, setOrdersHistory ] = useState([]); 

    useEffect(() => {
        const orderInput = document.getElementById('order-input');

        if (orderInput) {
            orderInput.focus();

            const handleKeyUp = (event) => {
                if (event.key === 'Enter') {
                    const value = orderInput.value.trim();
                    if (value === 'UNDO') {
                        undoAction();
                    } else if (value === 'RISOTTO') {
                        resetAll();
                    } else if (!isNaN(value) && value !== '') {
                        processOrder(value);
                    }
                    orderInput.value = '';
                }
            };

            orderInput.addEventListener('keyup', handleKeyUp);

            return () => {
                orderInput.removeEventListener('keyup', handleKeyUp);
            };
        }
    }, [processOrder]);

    useEffect(() => {
        localStorage.setItem('preparingOrders', JSON.stringify(preparingOrders));
        localStorage.setItem('readyOrders', JSON.stringify(readyOrders));
        localStorage.setItem('ordersHistory', JSON.stringify(ordersHistory));
    }, [preparingOrders, readyOrders, ordersHistory]);

    function processOrder(orderNumber) {
        setOrdersHistory((prevOrdersHistory) => [
            ...prevOrdersHistory,
            {
                preparing: preparingOrders,
                ready: readyOrders
            }
        ]);

        if (preparingOrders.includes(orderNumber)) {
            const newPreparingOrders = preparingOrders.filter((order) => (order !== orderNumber));

            setPreparingOrders(newPreparingOrders);
            setReadyOrders((prevReadyOrders) => [orderNumber, ...prevReadyOrders]);

        } else {
            setPreparingOrders((prevPreparingOrders) => [...prevPreparingOrders, orderNumber]);
        }
    }

    function undoAction() {
        if (ordersHistory.length > 1) {
            var lastState = ordersHistory[ordersHistory.length - 1];

            setPreparingOrders(lastState.preparing);
            setReadyOrders(lastState.ready);
            
            setOrdersHistory((prevOrdersHistory) => prevOrdersHistory.slice(0, -1));
        }
    }

    function resetAll() {
        setPreparingOrders([]);
        setReadyOrders([]);
        setOrdersHistory([]);
    }

    return (
        <div className="app">
            <div className="input-area">
                <input type="text" id="order-input" placeholder="Numero ordine" />
            </div>
            <div className="ready-orders">
                <div className="order-title"> Ordini Pronti </div>
                <div className="numbers-container">
                    {
                        
                        readyOrders.slice(0, 5).map((number, index) => (
                            <OrderNumber key={index} number={number} />
                        ))
                    }
                </div>
            </div>
            <div className="preparing-orders">
                <div className="order-title"> Ordini in Preparazione </div>
                <div className="numbers-container">
                    {
                        preparingOrders.map((number, index) => (
                            <OrderNumber key={index} number={number} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}