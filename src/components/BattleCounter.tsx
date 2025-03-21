import { useGameContract } from "../hooks/useGameContract";
import { useState, useEffect } from "react";
import { Card, FlexBoxCol } from "./styled/styled";

export function BattleCounter() {
  const { getBattleIdCounter } = useGameContract();
  const [battleIdCounter, setBattleIdCounter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBattleCounter() {
      const counter = await getBattleIdCounter();
      setBattleIdCounter(counter ? counter.toString() : null);
    }
    fetchBattleCounter();
    const interval = setInterval(fetchBattleCounter, 3000);
    return () => clearInterval(interval);
  }, [getBattleIdCounter]);

  return (
    <Card>
      <FlexBoxCol>
        <h2>Battle Counter</h2>
        <div>Total Battles: {battleIdCounter ? battleIdCounter.toString() : "Loading..."}</div>
      </FlexBoxCol>
    </Card>
  );
}