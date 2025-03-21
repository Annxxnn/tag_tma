import { RegisterPlayer } from '../../components/base/RegisterPlayer';
import { FlexBoxCol } from '../../components/styled/styled';

export function RegisterPlayerPage() {
  return (
    <FlexBoxCol>
      <h2>玩家注册</h2>
      <RegisterPlayer />
    </FlexBoxCol>
  );
}