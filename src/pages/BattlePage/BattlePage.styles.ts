import styled from 'styled-components';
import { FlexBoxCol } from '../../components/styled/styled';



export const ProgressBarLabel = styled.span`
  font-size: 0.9rem;
  color: #2d3748;
`;

export const ProgressBar = styled.div<{ value: number; prevValue?: number }>`
  width: ${({ value }) => value}%;
  height: 1.5rem;
  background-color: #4299e1;
  border-radius: 4px;
  transition: width 0.3s ease;

  &::after {
    content: '${({ value }) => value}%';
    color: white;
    display: block;
    text-align: right;
    padding-right: 5px;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  justify-content: space-between;
`;

export const FlexBoxRow = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
  height: 100vh;
`;

export const PlayerArea = styled.div`
  position: relative;
  width: 40%;
  height: 80vh;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EnemyArea = styled.div`
  position: relative;
  width: 40%;
  height: 80vh;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProgressBarContainer = styled.div`
  margin-bottom: 40px;
  flex: 1;
`;

const BaseButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
`;

export const BaseButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ActionButton = styled(BaseButton)`
  background: #3182ce;
  color: white;

  &:hover:not(:disabled) {
    background: #2b6cb0;
  }
`;

export const MockButton = styled(BaseButton)`
  background: #dd6b20;
  color: white;

  &:hover:not(:disabled) {
    background: #c05621;
  }
`;

export const FloatingHelpButton = styled(BaseButton)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #38a169;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  &:hover:not(:disabled) {
    background: #2f855a;
  }
`;

export const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  margin-top: 1rem;
`;