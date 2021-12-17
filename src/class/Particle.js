import Value from "./Value.js";

/**
 * @typedef Vector2
 * @property {T} x
 * @property {T} y
 * @template T
 */
/**
 * @typedef Size
 * @property {T} width
 * @property {T} height
 * @template T
 */

/**
 * @typedef ParticleOptions
 * @property {string | string[]} [group] - Particle group
 * @property {Object.<string, number | string>} variables
 * @property {Size<number | string>} [size] - Size of the particle.
 * @property {Vector2<number | string>} [position] - Position of the particle.
 * @property {string} [color] - Color of the particle.
 * @property {string | number} [speed]
 * @property {string | number} [deg]
 */
/**
 * @typedef ParticleValues
 * @property {string} group
 * @property {Vector2<number>} position
 * @property {Size<number>} size
 * @property {string} color
 * @property {number} speed
 * @property {number} deg
 */
/**
 * @typedef DrawData
 * @property {Vector2<number>} position
 * @property {Size<number>} size
 */

class Particle {
  /**
   * @param {ParticleOptions} options 
   */
  constructor(options) {
    const variables = {
      t: 0,
      ...options.variables
    };
    /** @type {Object.<string, number | string>} */
    this.variables = new Value(variables).getValue(variables);
    /** @type {ParticleValues} */
    this.values = {};

    /** @type {ParticleValues["group"]} */
    this.group = options.group ?? "default";
    /** @type {ParticleValues["position"]} */
    const position = options.position ?? { x: 50, y: 50 };
    this._position = new Value(position, this.variables);
    /** @type {ParticleValues["size"]} */
    const size = options.size ?? { width: 2, height: 2 };
    this._size = new Value(size, this.variables);
    /** @type {ParticleValues["color"]} */
    const color = options.color ?? "#000";
    this._color = new Value(color, this.variables);
    /** @type {ParticleValues["speed"]} */
    const speed = options.speed ?? 0;
    this._speed = new Value(speed, this.variables);
    /** @type {ParticleValues["deg"]} */
    const deg = options.deg ?? 0;
    this._deg = new Value(deg, this.variables);

    this.updateValues();
  }

  updateValues() {
    const variables = this.variables;

    this.values = {
      group: this.group,
      position: this._position.getValue(variables),
      size: this._size.getValue(variables),
      color: this._color.getValue(variables),
      speed: this._speed.getValue(variables),
      deg: this._deg.getValue(variables),
    };

    return this;
  }

  /**
   * @param {number} dt 
   */
  tick(dt) {
    const t = dt/1000;
    this.variables.t += dt;

    // Update position
    if (this._position.isValueFixed) {
      const speed = this._speed.getValue(this.variables);
      const position = this._position.getValue(this.variables);
      const [ dx, dy ] = [
        Math.sin(this.values.deg/180*Math.PI),
        -Math.cos(this.values.deg/180*Math.PI)
      ];
      this._position.changeValue({ key: "x", value: Number(position.x) + speed*dx*t });
      this._position.changeValue({ key: "y", value: Number(position.y) + speed*dy*t });
    }

    this.updateValues();

    return this;
  }

  /**
   * @returns {DrawData}
   */
  get drawData() {
    return {
      position: {...this.values.position},
      size: {...this.values.size},
    };
  }
}

export default Particle;

// let test = new Particle({
//   id: "test",
//   color: "\"#\"+0+0+0+\"f\"+0+1",
//   position: {
//     x: "$a+$t/10",
//     y: "$b"
//   },
//   size: {
//     x: "$a*$b",
//     y: "$b/$a"
//   }
// }, {
//   a: 5,
//   b: 6
// });
// window.Particle = Particle;
// window.test = test;
