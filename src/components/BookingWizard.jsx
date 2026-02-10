import React from 'react';
import { useBooking } from '../context/BookingContext';
import { User1, User2, User3, User4, User5, User6 } from './user_flow';

const BookingWizard = () => {
    const { step } = useBooking();

    return (
        <>
            {step === 1 && <User1 />}
            {step === 2 && <User2 />}
            {step === 3 && <User3 />}
            {step === 4 && <User4 />}
            {step === 5 && <User5 />}
            {step === 6 && <User6 />}
        </>
    );
};

export default BookingWizard;
