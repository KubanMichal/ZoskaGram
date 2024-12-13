import React from "react";  


import Watchdog from "../../components/Watchdog";

export default function PrivateLayout({children} : {children: React.ReactNode }) {
    return <Watchdog>{children} </Watchdog>
}