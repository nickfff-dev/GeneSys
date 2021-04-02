import React from "react";
import { increment, decrement } from "../../actions/dashboard";
import { useDispatch } from "react-redux";

export default function Dashboard() {
    const dispatch = useDispatch();
    return (
        <div>
            <p>
                Clicked: <span id="value">0</span> times
                <button id="increment" onClick={() => dispatch(increment())}>
                    +
                </button>
                <button id="decrement" onClick={() => dispatch(decrement())}>
                    -
                </button>
                <button id="incrementIfOdd">Increment if odd</button>
                <button id="incrementAsync">Increment async</button>
            </p>
        </div>
    );
}
