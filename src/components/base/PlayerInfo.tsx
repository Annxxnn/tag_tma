import { useState, useEffect } from 'react';
import { Card, FlexBoxCol } from "../styled/styled";
import { useGameContract } from '../../hooks/useGameContract';
import { Address } from "ton-core";
export function PlayerInfo({ address }: { address: Address }) {
  const { getPlayer } = useGameContract();
  const [playerInfo, setPlayerInfo] = useState<{
    id: bigint;
    health: bigint;
    attack: bigint;
    defense: bigint;
    battlesWon: bigint;
    battlesLost: bigint;
    mocksWon: bigint;
    lastBuffTime: bigint;
    name: string;
    battleId: bigint;
  } | null>(null);

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      if (!address || !getPlayer) return;
      try {
        const info = await getPlayer(address);
        setPlayerInfo(info);
      } catch (error) {
        console.error('Failed to fetch player info:', error);
      }
    };

    fetchPlayerInfo();
  }, [getPlayer]);

  if (!playerInfo) {
    return <Card>Loading player info...</Card>;
  }

  return (
    <Card>
      <FlexBoxCol>
        <h3>Player Info</h3>
        <p>ID: {playerInfo.id.toString()}</p>
        <p>Name: {playerInfo.name}</p>
        <p>Health: {playerInfo.health.toString()}</p>
        <p>Attack: {playerInfo.attack.toString()}</p>
        <p>Defense: {playerInfo.defense.toString()}</p>
        <p>Battles Won: {playerInfo.battlesWon.toString()}</p>
        <p>Battles Lost: {playerInfo.battlesLost.toString()}</p>
        <p>Mocks Won: {playerInfo.mocksWon.toString()}</p>
        <p>Last Buff Time: {new Date(Number(playerInfo.lastBuffTime) * 1000).toLocaleString()}</p>
        <p>Battle ID: {playerInfo.battleId.toString()}</p>
      </FlexBoxCol>
    </Card>
  );
}