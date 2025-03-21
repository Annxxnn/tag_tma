import { useGameContract } from "../../hooks/useGameContract";
import { useState, useEffect } from "react";

import {
  Card,
  FlexBoxCol
} from "../styled/styled";
export function GameTimestamp() {
  const { contract } = useGameContract();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTimestamps() {
      if (!contract) return;
      const start = await contract.getGameStartTimestamp();
      const end = await contract.getGameEndTimestamp();
      setStartTime(start);
      setEndTime(end);
    }
    fetchTimestamps();
  }, [contract]);

  return (
    <Card>
      <FlexBoxCol>
        <h2>Game Time</h2>
        <div>Start Time: {startTime ? new Date(startTime * 1000).toLocaleString() : "Loading..."}</div>
        <div>End Time: {endTime ? new Date(endTime * 1000).toLocaleString() : "Loading..."}</div>
      </FlexBoxCol>
    </Card>
  );
}