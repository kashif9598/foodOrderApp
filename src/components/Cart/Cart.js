import React from 'react';
import { useContext, useState } from 'react';
import CartContext from '../../store/cart-context';
import Modal from '../UI/Modal';
import classes from './Cart.module.css'
import CartItem from './CartItem';
import Checkout from './Checkout';

const Cart = (props) => {
    const [isCheckOut, setIsCheckOut] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [didSubmit, setDidSubmit] = useState(false)
    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItem = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    }

    const cartAddItemHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 })
    }

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map((item) => (
                <CartItem key={item.id} name={item.name} amount={item.amount} price={item.price} onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartAddItemHandler.bind(null, item)} />
            ))}
        </ul>
    )

    const onOrderHandler = () => {
        setIsCheckOut(true);
    }

    const submitOrderHandler = (userData) => {
        setIsSubmitting(true);
        fetch('https://react-http-3e969-default-rtdb.firebaseio.com/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items,
            })
        });
        setIsSubmitting(false);
        setDidSubmit(true)
        cartCtx.clearCart();
    }

    const modalAction =
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
            {hasItem && <button className={classes.button} onClick={onOrderHandler}>Order</button>}
        </div>

    const modalContent = <React.Fragment>
        {cartItems}
        <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
        </div>
        {isCheckOut && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
        {!isCheckOut && modalAction}
    </React.Fragment>

    const successModalContent = <React.Fragment>
        <p>Sucessfully placed your Order</p>
        <div className={classes.actions}>
            <button className={classes.button} onClick={props.onClose}>Close</button>
        </div>
    </React.Fragment>

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && modalContent}
            {isSubmitting && <p>Placing your order....</p>}
            {didSubmit && !isSubmitting && successModalContent}
        </Modal>
    )
}

export default Cart;