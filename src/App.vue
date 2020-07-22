<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <!-- <router-view/> -->
    <div ref="oo"></div>
  </div>
</template>

<script>
import {Plane,BufferBoxCrash, BufferPointCrash} from '@/class/Atom'
import * as THREE from 'three'
import { Vector3 } from 'three'
import { OrbitControls } from '@/utils/OrbitControls'
export default {
  data() {
    return {
      plane: new Plane(50, 50, 1),
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 ),
      planeGeometry: new THREE.BufferGeometry(),
      cloth: new THREE.Mesh(),
      sphere: new THREE.Mesh(),
      renderer: new THREE.WebGLRenderer( { antialias: true } )
    }
  },
  mounted() {
    this.init()
    this.animation()
  },
  methods: {
    render() {
      // this.plane.addForce(5, 5, new Vector3(0, 10, 0))
      // this.sphere.position.y -= 0.1
      // this.plane.CalculateElastic()
      // let forceon = this.plane.particles[this.plane.index(5,5)]
      // console.log(new Vector3().copy(forceon.position), new Vector3().copy(forceon.a))
      let testArr = [this.cloth, this.sphere]
      let crashArr = BufferBoxCrash(testArr)
      if (crashArr.length) {
        console.log("碰到一起了")
      }

      // this.plane.particles.forEach(it => it.integrate())
      // let fix = [this.plane.index(0,0), this.plane.index(0, this.plane.height), this.plane.index(this.plane.width, 0), this.plane.index(this.plane.width, this.plane.height)]
      // fix.forEach(n => {
      //   this.plane.particles[n].position.copy(this.plane.particles[n].original)
      //   this.plane.particles[n].previous.copy(this.plane.particles[n].original)
      // })
      // this.planeGeometry.attributes.position.copyVector3sArray(this.plane.particles.map(it => it.position))
      // this.planeGeometry.attributes.position.needsUpdate = true
      // this.planeGeometry.computeVertexNormals()
      this.renderer.render( this.scene, this.camera )
    },
    animation() {
      requestAnimationFrame(this.animation)
      this.render()
      // this.render()
      // this.render()
      // this.render()
      // this.render()
    },
    onWindowResize() {

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight );

    },
    init() {
      this.scene.background = new THREE.Color( 0xcce0ff );
      this.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
      this.camera.position.set( 1000, 50, 1500 );
      this.scene.add( new THREE.AmbientLight( 0x666666 ) );
      var light = new THREE.DirectionalLight( 0xdfebff, 1 );
      light.position.set( 50, 200, 100 );
      light.position.multiplyScalar( 1.3 );

      light.castShadow = true;

      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;

      var d = 300;

      light.shadow.camera.left = - d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d;
      light.shadow.camera.bottom = - d;

      light.shadow.camera.far = 1000;

      this.scene.add( light );


      var loader = new THREE.TextureLoader();
      var clothTexture = loader.load( 'circuit_pattern.png' );
      clothTexture.anisotropy = 16;

      // console.log(clothTexture)
      var clothMaterial = new THREE.MeshLambertMaterial( {
        map: clothTexture,
        side: THREE.DoubleSide,
        alphaTest: 0.5
      } );

      // let vers = new Float32Array(this.plane.particles.map(it => [it.position.x, it.position.y, it.position.z]).flat(2))
      // let attr = new THREE.BufferAttribute(vers, 3)
      // this.planeGeometry.setAttribute('position', attr)
      let that = this
      // this.planeGeometry = new THREE.ParametricBufferGeometry( function(x, z, d) {
      //   var x = x * that.plane.width * that.plane.gap;
      //   var z = z * that.plane.height * that.plane.gap;
      //   var y = 0;
      //   d.set(x, y, z)
      // }, this.plane.width, this.plane.height );

      this.planeGeometry = new THREE.SphereBufferGeometry( 50, 32, 16 );
      this.cloth = new THREE.Mesh(this.planeGeometry, clothMaterial)

      this.cloth.position.set( 0, 0, 0 );
      this.cloth.castShadow = true;
      this.scene.add( this.cloth );

      this.cloth.customDepthMaterial = new THREE.MeshDepthMaterial( {
        depthPacking: THREE.RGBADepthPacking,
        map: clothTexture,
        alphaTest: 0.5
      } );

      
      var ballGeo = new THREE.SphereBufferGeometry( 50, 32, 16 );
      var ballMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });

      let sphere = new THREE.Mesh( ballGeo, ballMaterial );
      sphere.position.set(0, 75, 0)
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.visible = true;
      this.sphere = sphere
      this.scene.add( sphere );

      console.log(sphere)

      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( window.innerWidth, window.innerHeight );

      this.$refs.oo.appendChild( this.renderer.domElement );

      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.renderer.shadowMap.enabled = true;

      
      var controls = new OrbitControls( this.camera, this.renderer.domElement );
      controls.maxPolarAngle = Math.PI;
      controls.minDistance = 100;
      controls.maxDistance = 5000;


      window.addEventListener( 'resize', this.onWindowResize, false );

      

    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  // padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
