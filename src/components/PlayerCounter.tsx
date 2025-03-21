import { useGameContract } from "../hooks/useGameContract";
import { useState, useEffect } from "react";
import { Card, FlexBoxCol } from "./styled/styled";

export function PlayerCounter() {
  const { getPlayerIdCounter } = useGameContract();
  const [playerIdCounter, setPlayerIdCounter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayerCounter() {
      const counter = await getPlayerIdCounter();
      setPlayerIdCounter(counter ? counter.toString() : null);
    }
    fetchPlayerCounter();
    const interval = setInterval(fetchPlayerCounter, 3000);
    return () => clearInterval(interval);
  }, [getPlayerIdCounter]);

  return (
    <div className="Container">
      <Card>
        <FlexBoxCol>
          <h3>Player Counter</h3>
          <p>
            Total Players: {playerIdCounter ? playerIdCounter.toString() : "Loading..."}
          </p>
        </FlexBoxCol>
      </Card>
    </div>
  );
}