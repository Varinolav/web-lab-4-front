import {useState} from 'react'
import './App.css'
import SkinCard from "./components/SkinCard.tsx";

function App() {

    return (
        <div>
            <SkinCard name="Ak-47" price="45$"/>
            <SkinCard name="Ak-47" price="45$"/>
            <SkinCard name="Ak-47" price="45$"/>
        </div>

    )
}

export default App
