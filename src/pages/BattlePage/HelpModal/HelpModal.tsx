import { Card } from '../../../components/styled/styled';
import styles from './HelpModal.module.css';

export const HelpModal = ({ onClose }: { onClose: () => void }) => (
  <div className={styles.overlay}>
    <Card className={styles.modal}>
      <h2>战斗规则说明</h2>
      <ol className={styles.rulesList}>
        <li>双方都为mock，则直接根据生命值判断获胜者</li>
        <li>双方都为防御，进入下一回合</li>
        <li>一方为mock，另一方不是，则复制不是mock的一方的动作</li>
        <li>双方为attack，根据攻击力的比例决定谁造成伤害</li>
        <li>一方为攻击，另一方为防御，防御的一方防御力乘以1.2倍，随机生成一个攻击值（0-攻击方的攻击值），大于加倍后的防御力，攻击生效</li>
        <li>若都为mock或有一方生命值为0，重置玩家属性，方便进行下一轮</li>
      </ol>
      <button className={styles.closeButton} onClick={onClose}>关闭</button>
    </Card>
  </div>
);