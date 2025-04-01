import styled from 'styled-components';

export const FlexBoxRow = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

export const PlayerArea = styled.div`
  flex: 1;
  height: 50%;
  padding: 20px;
  overflow: hidden;
  position: relative;
`;

export const EnemyArea = styled.div`
  flex: 1;
  height: 50%;
  padding: 20px;
  overflow: hidden;
  position: relative;
`;

export const ProgressBarContainer = styled.div`
  margin: 8px 0;
`;

export const ActionButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  width: 120px;
`;