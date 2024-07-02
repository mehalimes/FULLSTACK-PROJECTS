import React from "react";
import "./../styles/Button.css";

interface ButtonProps {
    name: string;
    Event: () => void;
    width: number;
    height: number;
}

export default function Button(props: ButtonProps) {
    const { name, Event, width, height } = props;

    const buttonStyle = {
        width: `${width}px`,
        height: `${height}px`,
    };

    return (
        <button className="btn" style={buttonStyle} onClick={Event}>
            {name}
        </button>
    );
}
