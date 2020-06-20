import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';


import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { Header, Loading } from '../components';
import { CartItem, BookTrips } from '../containers';
import { RouteComponentProps } from '@reach/router';
import { GetCartItems } from './__generated__/GetCartItems';

const stripePromise = loadStripe("pk_test_51GuhkpDj5yJqt2Y1qwiF3EBoHwo2xfkIUwYYB0aoyrQDbs9101tT1AfRWubfaqzLxVRSAY5FKFL45Xghy29lWuU800hW8e0hBZ");

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

interface CartProps extends RouteComponentProps { }

const Cart: React.FC<CartProps> = () => {
    const { data, loading, error } = useQuery<GetCartItems>(
        GET_CART_ITEMS
    );

    if (loading) return <Loading />;
    if (error) return <p>ERROR: {error.message}</p>;
    if (data) console.log(data);

    return (
        <Fragment>
            <Header>My Cart</Header>
            {!data || !!data && data.cartItems.length === 0 ? (
                <p data-testid="empty-message">No items in your cart</p>
            ) : (
                    <Fragment>
                        {!!data && data.cartItems.map((launchId: any) => (
                            <CartItem key={launchId} launchId={launchId} />
                        ))}
                        <Elements stripe={stripePromise}>
                            <BookTrips cartItems={!!data ? data.cartItems : []} />
                        </Elements>
                    </Fragment>
                )}
        </Fragment>
    );
}

export default Cart;