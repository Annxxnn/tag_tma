import { useGameContract } from "../../hooks/useGameContract";
import { useState, useEffect } from "react";
import { Card, FlexBoxCol } from "../styled/styled";

export function Leaderboard() {
  const { getLeaderboard } = useGameContract();
  const [leaderboardData, setLeaderboardData] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      const data = await getLeaderboard();
      setLeaderboardData(data ? data.toString() : null);
    }
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 3000);
    return () => clearInterval(interval);
  }, [getLeaderboard]);

  return (
    <Card>
      <FlexBoxCol>
        <h2>Leaderboard</h2>
        <div>{leaderboardData ? leaderboardData.toString() : "Loading..."}</div>
      </FlexBoxCol>
    </Card>
  );
}