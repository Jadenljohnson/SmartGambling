import React, {useState} from "react";
import {getOptimalMove} from "../utils/BlackjackStrat";
import {runMonteCarlo} from "../utils/Monte_Carlo_Blackjack"
import BlackjackTable from "../components/BlackjackTable";
export default function TrainerPage(){
    const [arr_playerHand, setArr_playerHand] = useState(["2", "2"]);
    const [str_dealerCard, setStr_dealerCard] = useState("2");
    const [str_result, setStr_result] = useState("");
    const [obj_stats, setObj_stats] = useState(null);
    const [bool_loading, setBool_loading] = useState(false);

    const arr_cardOptions = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    const handleSubmit = async() => {
        const str_move = getOptimalMove({ arr_playerHand, str_dealerCard });
        console.log(arr_playerHand)
        console.log(str_dealerCard)
        setStr_result(`Optimal Move: ${str_move}`);
        setBool_loading(true);
        setTimeout(async () => {
            const obj_result = await runMonteCarlo(arr_playerHand, str_dealerCard, 5000);
            setObj_stats(obj_result);
            setBool_loading(false);
        }, 1000);
    };
    return(
        <div style={{ padding: "2rem" }}>
            <h2>Blackjack Trainer</h2>
            <div>
                <label>Player Card 1:</label>
                <select onChange={e => setArr_playerHand([e.target.value, arr_playerHand[1]])}>
                {arr_cardOptions.map(str_card => (
                    <option key={str_card}>{str_card}</option>
                ))}
                </select>

                <label>Player Card 2:</label>
                <select onChange={e => setArr_playerHand([arr_playerHand[0], e.target.value])}>
                {arr_cardOptions.map(str_card => (
                    <option key={str_card}>{str_card}</option>
                ))}
                </select>
            </div>

            <div>
                <label>Dealer Upcard:</label>
                <select onChange={e => setStr_dealerCard(e.target.value)}>
                {arr_cardOptions.map(str_card => (
                    <option key={str_card}>{str_card}</option>
                ))}
                </select>
            </div>

            <button onClick={handleSubmit}>Get Optimal Move</button>
            {str_result && <p>{str_result}</p>}
            {bool_loading && <p>⏳ Running Monte Carlo Simulation...</p>}

            {obj_stats && !bool_loading && (
            <div style={{ marginTop: "1rem" }}>
                <h3>📈 Estimated Outcomes (10000 hands, No split or Double):</h3>
                <ul>
                <li>Win: {obj_stats.win}%</li>
                <li>Push: {obj_stats.push}%</li>
                <li>Loss: {obj_stats.loss}%</li>
                </ul>
            </div>
            )}
            <BlackjackTable
                arr_dealerHand={[str_dealerCard]} // or add 2nd card if simulating full hand
                arr_playerHand={arr_playerHand}
            />

        </div>
    );
}