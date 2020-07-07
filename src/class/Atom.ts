import THREE, { Vector3 } from 'three'

const TIMESTEP_SQ = Math.pow(18 / 1000, 2)

/**
 * 有质量的点
 */
export class Particle {
  constructor(original: Vector3) {
    this.position = original
    this.previous = original
    this.original = original
  }
  position = new Vector3()
  previous = new Vector3()
  original = new Vector3()
  /**
   * 加速度向量 m/s^2
   */
  a = new Vector3(0, 0, 0)
  /**
   * 质量 kg
   */
  mass = 1
  get invMass() {
    return 1 / this.mass
  }
  ENV_DAMPING = 0.03
  get DRAG() {
    return this.ENV_DAMPING = 0.03
  }
  /**
   * 力转换为加速度
   * @param force 施加的力的向量 kg*m/s^2
   */
  addForce(force: Vector3) {
    this.a.add(new Vector3().copy(force).multiplyScalar(this.invMass))
  }
  /**
   * 生成下一帧的位置信息
   * @param timesq 一帧时间的平方 s^2
   */
  integrate( timesq: number = TIMESTEP_SQ) {
    // 新旧位置偏移向量 ---> 当前运动方向和速度
    var newPos = new Vector3().subVectors( this.position, this.previous );
    // 计算继续以当前速度偏移后的位置 其中偏移速度施加阻力
    newPos.multiplyScalar( this.DRAG ).add( this.position );
    // 计算由外力产生的加速度导致的偏移位置
    newPos.add( this.a.multiplyScalar( timesq ) );

    this.previous = this.position;
    this.position = newPos;
    // 释放加速度
    this.a.set( 0, 0, 0 );
  }
}
