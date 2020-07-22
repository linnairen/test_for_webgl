import { Vector3, BufferAttribute, Mesh, BufferGeometry } from 'three'
import * as THREE from 'three'

/**
 * 帧耗时
 */
const TIMESTEP = 18 / 1000
/**
 * 全局阻尼
 */
const ENV_DAMPING = 0.03

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
  /**
   * 阻尼
   */
  ENV_DAMPING = ENV_DAMPING
  get DRAG() {
    return 1 - this.ENV_DAMPING
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
  integrate( timestep: number = TIMESTEP) {
    let timesq = Math.pow(timestep, 2)
    let newPos = new Vector3().copy(this.position)
    // 速度向量 m/s
    var speed = new Vector3().subVectors( this.position, this.previous ).multiplyScalar(1/timestep);

    let dragForce = new Vector3().copy(speed).normalize().multiplyScalar(speed.lengthSq()*0.5*this.ENV_DAMPING*1).negate()
    // 计算继续以当前速度偏移后的位置 其中偏移速度施加阻力
    // newPos.multiplyScalar( this.DRAG ).add( this.position );
    newPos.add(new Vector3().copy(speed).multiplyScalar(timestep))
    // 计算由外力产生的加速度导致的偏移位置
    newPos.add( new Vector3().addVectors(this.a, dragForce).multiplyScalar( timesq ) );

    this.previous = this.position;
    this.position = newPos;
    // 释放加速度
    this.a.set( 0, 0, 0 );
  }
}

/**
 * 可变形的平面  弹力公式备注：F=kx  F 单位 N = kg*m/s^2  k单位 N/m = kg/s^2   x单位 m
 */
export class Plane {
  constructor(width: number = 10, height: number = 10, gap: number = 5, ElasticCoefficient: number = 10) {
    this.width = width
    this.height = height
    this.gap = gap
    this.ElasticCoefficient = ElasticCoefficient
    this.InitParticle()
  }
  width: number = 10
  height: number = 10
  gap: number = 2
  center: Vector3 = new Vector3()
  particles: Particle[] = []
  adjoinParticles: Particle[][] = []
  /**
   * 弹性限度 N = kg*m/s^2
   */
  ElasticLimit: number = 100
  /**
   * 弹性系数 N/m = kg/s^2
   */
  ElasticCoefficient: number = 100000
  /**
   * 取点的当前索引
   * @param x 横向索引
   * @param z 纵向索引
   */
  index(x: number, z: number) {
    return x + z * (this.width + 1)
  }

  /**
   * 生成平面
   */
  InitParticle() {
    for(let i = 0; i <= this.height; i ++) {
      for(let j = 0; j <= this.width; j ++) {
        this.particles.push(new Particle(new Vector3(this.center.x + (j - 0.5*this.width) * this.gap, this.center.y, this.center.z + (i - 0.5*this.height) * this.gap)))
      }
    }
    for(let i = 0; i < this.height; i ++) {
      for(let j = 0; j < this.width; j ++) {
        this.adjoinParticles.push([
          this.particles[this.index(j, i)],
          this.particles[this.index(j + 1, i)]
        ], [
          this.particles[this.index(j, i)],
          this.particles[this.index(j, i + 1)]
        ])
      }
    }
    for(let j = this.width, i = 0; i < this.height; i ++) {
      this.adjoinParticles.push([
        this.particles[this.index(j, i)],
        this.particles[this.index(j, i + 1)]
      ])
    }
    for(let i = this.height, j = 0; j < this.width; j ++) {
      this.adjoinParticles.push([
        this.particles[this.index(j, i)],
        this.particles[this.index(j + 1, i)]
      ])
    }
  }

  /**
   * 计算弹力
   */
  CalculateElastic() {
    this.adjoinParticles.forEach(particles => {
      let distance = new Vector3().subVectors(particles[1].position, particles[0].position)
      let x = distance.length() - this.gap
      if (x === 0) return
      let elastic = this.ElasticCoefficient * x
      let forone = distance.normalize().multiplyScalar(elastic * 0.5)
      particles[0].addForce(new Vector3(forone.x.roundFixed(6), forone.y.roundFixed(6), forone.z.roundFixed(6)))
      particles[1].addForce(new Vector3(forone.x.roundFixed(6), forone.y.roundFixed(6), forone.z.roundFixed(6)).negate())
      // console.log('加速度',new Vector3().copy(this.particles[60].a))
    })
  }

  addForce(x: number, z: number, force: Vector3) {
    this.particles[this.index(x, z)].addForce(force)
  }

}

/**
 * 返回发生碰撞的键对 碰撞检测为盒型碰撞 
 * @param array 检测碰撞的缓存位置数组 三维数据
 */
export function BufferBoxCrash(mesh: Mesh<BufferGeometry>[]) {
  let itemSize = 3
  let array = mesh.map(it => new Float32Array(it.geometry.attributes.position.array))
  let pos = mesh.map(it => [it.position.x, it.position.y, it.position.z])
  let totalArr = array.map((arr, index) => {
    let total = []
    for(let n = 0; n < itemSize; n ++) {
      let target = arr.filter((it, i) => i%3 == n)
      total.push({
        max: Math.max(...target) + pos[index][n],
        min: Math.min(...target) + pos[index][n]
      })
    }
    return total
  })
  let impact = []
  for(let i = 0; i < totalArr.length; i ++) {
    for(let j = i + 1; j < totalArr.length; j ++) {
      if (totalArr[i].every((it, k) => it.max >= totalArr[j][k].min && it.min <= totalArr[j][k].max)) {
        impact.push([i, j])
        if (totalArr[i][0].max > totalArr[j][0].max) {
          
        }
      }
    }
  }
  return impact
}

/**
 * 返回发生碰撞的键对 碰撞检测为点碰撞 
 * @param array 检测碰撞的缓存位置数组 三维数据
 */
export function BufferPointCrash(mesh: Mesh<BufferGeometry>[]) {
  let itemSize = 3
  let array = mesh.map(it => {
    let arr = []
    let position = it.geometry.attributes.position.array
    for(let i = 0; i < position.length; i += itemSize) {
      arr.push(new Vector3(position[i], position[i + 1], position[i + 2]))
    }
    return arr
  })
  let pos = mesh.map(it => it.position)
  let impact: {index: number[], crashPoint: THREE.Intersection[]}[] = []
  for(let i = 0; i < array.length; i ++) {
    for(let j = i + 1; j < array.length; j ++) {
      let crash: THREE.Intersection[] = []
      array[i].forEach(it => {
        let v = it.clone()
        let direct = v.sub(pos[i])
        let ray = new THREE.Raycaster(pos[i].clone(), direct.clone().normalize())
        let res = ray.intersectObject(mesh[j])
        if (res.length > 0 && res[0].distance <= direct.length()) {
          crash.push(...res.filter(r => r.distance <= direct.length()))
        }
      })
      if (crash.length) {
        impact.push({
          index: [i, j],
          crashPoint: crash
        })
      }
    }
  }
  return impact
}

export class ParticleMesh {
  constructor() {

  }
  mesh: Mesh<BufferGeometry> = new Mesh()
  mass: number = 1
  V: Vector3 = new Vector3()
  RealizeV() {
    this.mesh.position.add(this.V)
  }
  Hit(P: ParticleMesh) {
    let hit = BufferBoxCrash([this.mesh, P.mesh])[0]
    if (!(hit && hit.length)) return
    let V = P.V.clone()
    let mass = P.mass
    let E = V.clone().multiply(V).multiplyScalar(0.5*mass).add(this.V.clone().multiply(this.V).multiplyScalar(0.5*this.mass))
  }
}
