import * as scr from '../scratch/scratch'
import { Delaunay } from "d3-delaunay";
import axios from "axios";
import earcut from "earcut";

//normal
// const prefix = '/testapi/flow/'
const prefix = '/testapi/flow/bin?name='
let resourceUrl = [
  "uv_0.bin",
  "uv_1.bin",
  "uv_2.bin",
  "uv_3.bin",
  "uv_4.bin",
  "uv_5.bin",
  "uv_6.bin",
  "uv_7.bin",
  "uv_8.bin",
  "uv_9.bin",
  "uv_10.bin",
  "uv_11.bin",
  "uv_12.bin",
  "uv_13.bin",
  "uv_14.bin",
  "uv_15.bin",
  "uv_16.bin",
  "uv_17.bin",
  "uv_18.bin",
  "uv_19.bin",
  "uv_20.bin",
  "uv_21.bin",
  "uv_22.bin",
  "uv_23.bin",
  "uv_24.bin",
  "uv_25.bin",
  "uv_26.bin",
  "uv_27.bin",
  "uv_28.bin",
  "uv_29.bin",
  "uv_30.bin",
  "uv_31.bin",
  "uv_32.bin",
  "uv_33.bin",
  "uv_34.bin",
  "uv_35.bin",
  "uv_36.bin",
  "uv_37.bin",
  "uv_38.bin",
  "uv_39.bin",
];
for(let i=0;i<resourceUrl.length;i++){
  resourceUrl[i] = prefix+resourceUrl[i]
}


export default class floww {
  constructor() {
    // Layer
    this.type = "custom";
    this.map = undefined;
    this.id = "flow";
    this.renderingMode = "3d";

    // Attributes
    this.preheat = 0;
    this.swapPointer = 0;
    this.extent = scr.boundingBox2D();
    this.randomSeed = scr.f32(Math.random());

    // Resource worker
    this.loadWorker = undefined;

    // Control
    this.progress = 0.0;
    this.framesPerPhase = 150;
    this.maxSpeed = scr.f32();
    this.currentResourceUrl = 0;
    this.maxParticleNum = 65535;
    this.progressRate = scr.f32();
    this.particleNum = scr.u32(65535);

    // Compute
    this.blockSizeX = 16;
    this.blockSizeY = 16;
    this.groupSizeX = Math.ceil(
      Math.sqrt(this.maxParticleNum) / this.blockSizeX
    );
    this.groupSizeY = Math.ceil(
      Math.sqrt(this.maxParticleNum) / this.blockSizeY
    );
    this.randomFillData = new Float32Array(this.maxParticleNum * 6).map(
      (_, index) => {
        if (index % 6 == 4 || index % 6 == 5) return 0;
        else return Math.random();
      }
    );

    // Buffer-related resource
    this.toRef = undefined;
    this.fromRef = undefined;
    this.nextRef = undefined;
    this.uniformBuffer_frame = undefined;
    this.indexBuffer_voronoi = undefined;
    this.vertexBuffer_voronoi = undefined;
    this.uniformBuffer_static = undefined;
    this.storageBuffer_particle = undefined;
    this.particleRef = scr.aRef(this.randomFillData);

    // Texture-related resource
    this.flowTexture = undefined;
    this.layerTexture1 = undefined;
    this.layerTexture2 = undefined;

    // Binding
    this.showBinding = undefined;
    this.layerBindings = undefined;
    this.voronoiBinding = undefined;
    this.particleBinding = undefined;
    this.voronoiToBinding = undefined;
    this.simulationBinding = undefined;
    this.trajectoryBindings = undefined;

    // Pipeline
    this.showPipeline = undefined;
    this.layerPipeline = undefined;
    this.voronoiPipeline = undefined;
    this.particlePipeline = undefined;
    this.trajectoryPipeline = undefined;
    this.simulationPipeline = undefined;

    // Pass
    this.swapPasses = undefined;
    this.voronoiPass = undefined;
    this.simulationPass = undefined;

    // Flag
    this.isHided = false;
    this.isIdling = false;
    this.showArrow = true;
    this.showVoronoi = true;
    this.nextPrepared = false;
    this.isInitialized = false;
    this.nextPreparing = false;
  }

  async onAdd(map, gl) {
    this.map = map;

    this.addWorker(
      new Worker(new URL("./flowJson.worker.js", import.meta.url), {
        type: "module",
      })
    );

    // this.extent.reset(
    //   120.04485952099877,
    //   31.757211235652274,
    //   121.00010037560567,
    //   32.08267764177068
    // );
    this.extent.reset(117.6008663, 29.00020341, 124.9995024, 33.99616132);

    // Buffer-related resource
    this.storageBuffer_particle = scr.storageBuffer({
      name: "Storage Buffer (Particle Position & Velocity)",
      resource: { arrayRef: this.particleRef },
    });
    this.uniformBuffer_static = scr.uniformBuffer({
      name: "Uniform Buffer (Flow Layer Static)",
      blocks: [
        scr.bRef({
          name: "staticUniform",
          map: {
            groupSize: scr.asVec2u(this.groupSizeX, this.groupSizeY),
            extent: this.extent.boundary,
          },
        }),
      ],
    });
    this.uniformBuffer_frame = scr.uniformBuffer({
      name: "Uniform Buffer (Flow Layer Frame)",
      blocks: [
        scr.bRef({
          name: "frameUniform",
          dynamic: true,
          map: {
            randomSeed: this.randomSeed,
            viewPort: this.map.screen.sizeF,
            mapBounds: this.map.cameraBounds.boundary,
            zoomLevel: this.map.zoom,
            progressRate: this.progressRate,
            maxSpeed: this.maxSpeed,
          },
        }),
      ],
    });

    // Texture-related resource
    this.layerTexture1 = this.map.screen.createScreenDependentTexture(
      "Texture (Background 1)"
    );
    this.layerTexture2 = this.map.screen.createScreenDependentTexture(
      "Texture (Background 2)"
    );
    this.flowTexture = this.map.screen.createScreenDependentTexture(
      "Texture (Velocity)",
      "rg32float"
    );
    this.maskTexture =
      this.map.screen.createScreenDependentTexture("Texture(Mask)");

    //PASS 0
    await this.getMask("/ffvsrc/flowbound2.geojson");
    this.maskPass = scr
      .renderPass({
        name: "mask render pass",
        colorAttachments: [{ colorResource: this.maskTexture }],
      })
      .add(this.maskPipline, this.maskBinding);

    // PASS - 1: flow textures (mix(from -> to)) generation ////////////////////////////////////////////////
    // station ---> coordinates
    await this.getVoronoi(prefix+"station.bin");

    await this.addVoronoiBindingSync(prefix+"uv_0.bin");

    this.swapVoronoiBinding();
    await this.addVoronoiBindingSync(prefix+"uv_1.bin");

    this.currentResourceUrl = 1;
    this.nextPrepared = true;

    this.voronoiPipeline = scr.renderPipeline({
      name: "Render Pipeline (Voronoi Flow)",
      shader: {
        module: scr.shaderLoader.load(
          "Shader (Flow Voronoi)",
          "/shader/flowshader/flowVoronoi.wgsl"
        ),
      },
    });
    this.voronoiPass = scr
      .renderPass({
        name: "Render Pass (Voronoi Flow From)",
        colorAttachments: [{ colorResource: this.flowTexture }],
        depthStencilAttachment: { depthStencilResource: this.map.depthTexture },
      })
      .add(this.voronoiPipeline, this.voronoiBinding);

    // PASS - 2: particle position simulation ////////////////////////////////////////////////
    this.simulationBinding = scr.binding({
      name: "Binding (Particle Simulation)",
      range: () => [this.groupSizeX, this.groupSizeY],
      textures: [
        { texture: this.flowTexture, sampleType: "unfilterable-float" },
      ],
      storages: [{ buffer: this.storageBuffer_particle, writable: true }],
      uniforms: [
        {
          name: "controllerUniform",
          map: {
            particleNum: scr.asU32(this.maxParticleNum),
            dropRate: scr.asF32(0.003),
            dropRateBump: scr.asF32(0.001),
            speedFactor: scr.asF32(1.0),
          },
        },
      ],
      sharedUniforms: [
        { buffer: this.uniformBuffer_frame },
        { buffer: this.uniformBuffer_static },
        { buffer: this.map.dynamicUniformBuffer },
      ],
    });
    this.simulationPipeline = scr.computePipeline({
      name: "Compute Pipeline (Flow Simulation)",
      shader: {
        module: scr.shaderLoader.load(
          "Shader (Particle Simulation)",
          "/shader/flowshader/simulation.compute.wgsl"
        ),
      },
      constants: { blockSize: 16 },
    });
    this.simulationPass = scr
      .computePass({
        name: "Compute Pass (Particle Simulation)",
      })
      .add(this.simulationPipeline, this.simulationBinding);

    // PASS - 3: flow trajectory rendering (particle past trajectory + particle current position) ////////////////////////////////////////////////
    // SubPass - 1: past trajectory rendering
    this.trajectoryBindings = [
      scr.binding({
        name: "Binding (Background Swap 1)",
        range: () => [4],
        textures: [{ texture: this.layerTexture2 }],
      }),
      scr.binding({
        name: "Binding (Background Swap 2)",
        range: () => [4],
        textures: [{ texture: this.layerTexture1 }],
      }),
    ];
    this.trajectoryPipeline = scr.renderPipeline({
      name: "Rendej pipeline (Background Swap)",
      shader: {
        module: scr.shaderLoader.load(
          "Shader (Background Swap)",
          "/shader/flowshader/swap.wgsl"
        ),
      },
      primitive: { topology: "triangle-strip" },
      depthTest: false,
    });
    // SubPass - 2: current position rendering
    this.particleBinding = scr.binding({
      name: "Binding (Particles)",
      range: () => [2, this.particleNum.n],
      storages: [{ buffer: this.storageBuffer_particle }],
      sharedUniforms: [
        { buffer: this.uniformBuffer_frame },
        { buffer: this.uniformBuffer_static },
        { buffer: this.map.dynamicUniformBuffer },
      ],
    });
    this.particlePipeline = scr.renderPipeline({
      name: "Render Pipeline (Particles)",
      shader: {
        module: scr.shaderLoader.load(
          "Shader (Particles)",
          "/shader/flowshader/particles.wgsl"
        ),
      },
      primitive: { topology: "line-list" },
    });
    this.swapPasses = [
      scr
        .renderPass({
          name: "Render Pass (Past Trajectory 1)",
          colorAttachments: [{ colorResource: this.layerTexture1 }],
          depthStencilAttachment: {
            depthStencilResource: this.map.depthTexture,
          },
        })
        /* Pass 3.1 */ .add(this.trajectoryPipeline, this.trajectoryBindings[0])
        /* Pass 3.2 */ .add(this.particlePipeline, this.particleBinding),

      scr
        .renderPass({
          name: "Render Pass (Past Trajectory 2)",
          colorAttachments: [{ colorResource: this.layerTexture2 }],
          depthStencilAttachment: {
            depthStencilResource: this.map.depthTexture,
          },
        })
        /* Pass 3.1 */ .add(this.trajectoryPipeline, this.trajectoryBindings[1])
        /* Pass 3.2 */ .add(this.particlePipeline, this.particleBinding),

      scr.renderPass({
        name: "Render Pass (Trajectory Empty)",
        colorAttachments: [
          { colorResource: this.layerTexture1 },
          { colorResource: this.layerTexture2 },
        ],
      }) /* Pass 3.3* Trajectory Clear */,
    ];

    // PASS - 4: flow layer rendering ////////////////////////////////////////////////
    this.layerBindings = [
      scr.binding({
        name: "Binding (Layer Renderig 1)",
        range: () => [4],
        textures: [{ texture: this.layerTexture1 }],
      }),
      scr.binding({
        name: "Binding (Layer Renderig 2)",
        range: () => [4],
        textures: [{ texture: this.layerTexture2 }],
      }),
    ];
    this.layerPipeline = scr.renderPipeline({
      name: "Render Pipeline (Layer Rendering)",
      shader: {
        module: scr.shaderLoader.load(
          "Shader (Flow Layer Rendering)",
          "/shader/flowshader/flowLayer.wgsl"
        ),
      },
      primitive: { topology: "triangle-strip" },
      colorTargetStates: [{ blend: scr.NormalBlending }],
    });

    // PASS - 5*: flow texture showing
    this.showBinding = scr.binding({
      name: "Binding (Flow Show)",
      range: () => [4],
      textures: [
        { texture: this.flowTexture, sampleType: "unfilterable-float" },
        { texture: this.maskTexture, sampleType: "unfilterable-float" },
      ],
      sharedUniforms: [{ buffer: this.uniformBuffer_frame }],
    });
    this.showPipeline = scr.renderPipeline({
      name: "Render Pipeline (Flow Show)",
      shader: {
        module: scr.shaderLoader.load(
          "Shader (Flow Show)",
          "/shader/flowshader/flowShow.wgsl"
        ),
      },
      primitive: { topology: "triangle-strip" },
      colorTargetStates: [{ blend: scr.NormalBlending }],
    });
    this.arrowPipeline = scr.renderPipeline({
      name: "Render Pipeline (Flow Arrow)",
      shader: {
        module: scr.shaderLoader.load(
          "Shader (Flow Show)",
          "/shader/flowshader/arrow.wgsl"
        ),
      },
      primitive: { topology: "triangle-strip" },
      colorTargetStates: [{ blend: scr.NormalBlending }],
    });

    // Execution configuration
    this.swapPasses[0].executable = true;
    this.swapPasses[1].executable = false;
    this.swapPasses[2].executable = false;
    this.layerBindings[0].executable = true;
    this.layerBindings[1].executable = false;

    // Add to map
    this.showArrow &&
      this.map.add2RenderPass(this.arrowPipeline, this.particleBinding);
    this.showVoronoi &&
      this.map
        .add2RenderPass(this.showPipeline, this.showBinding)
        .add2RenderPass(this.layerPipeline, this.layerBindings[0])
        .add2RenderPass(this.layerPipeline, this.layerBindings[1]);
    this.map
      .add2PreProcess(this.maskPass)
      .add2PreProcess(this.voronoiPass)
      .add2PreProcess(this.simulationPass)
      .add2PreProcess(this.swapPasses[0])
      .add2PreProcess(this.swapPasses[1])
      .add2PreProcess(this.swapPasses[2]);

    this.map.on("movestart", () => this.idle());
    this.map.on("move", () => this.idle());
    this.map.on("moveend", () => this.restart());
    this.map.on("dragstart", () => this.idle());
    this.map.on("drag", () => this.idle());
    this.map.on("dragend", () => this.restart());
    this.map.on("zoomstart", () => this.idle());
    this.map.on("zoom", () => this.idle());
    this.map.on("zoomend", () => this.restart());
    this.map.on("rotatestart", () => this.idle());
    this.map.on("rotate", () => this.idle());
    this.map.on("rotateend", () => this.restart());
    this.map.on("pitchstart", () => this.idle());
    this.map.on("pitch", () => this.idle());
    this.map.on("pitchend", () => this.restart());

    this.isInitialized = true;
  }

  async render(gl, matrix) {
    // Ask map to repaint
    this.map.triggerRepaint();
    // this.mapbuffer&&this.mapbuffer.mapping()
    // No render condition
    if (!this.isInitialized || this.isIdling || this.preheat-- > 0) return;
    if (this.isHided) {
      this.makeVisibility(false);
      return;
    } else {
      this.makeVisibility(true);
    }

    // Swap
    this.showBinding.executable = false;
    this.maskBinding.executable = true;

    this.swapPasses[0].executable = this.swapPointer;
    this.layerBindings[0].executable = this.swapPointer;
    this.swapPasses[1].executable = 1 - this.swapPointer;
    this.layerBindings[1].executable = 1 - this.swapPointer;

    // Update
    this.updateVoronoi();
    this.randomSeed.n = Math.random();
    this.swapPointer = (this.swapPointer + 1) % 2;
  }

  idle() {
    this.isIdling = true;

    this.showBinding.executable = true;
    this.swapPasses[2].executable = true;
    this.arrowPipeline.executable = false;

    this.swapPasses[0].executable = false;
    this.swapPasses[1].executable = false;
    this.layerBindings[0].executable = false;
    this.layerBindings[1].executable = false;
  }

  restart() {
    this.preheat = 10;
    this.isIdling = false;
    this.arrowPipeline.executable = true;
    this.swapPasses[2].executable = false;
    this.swapPasses[2].executable = false;
    this.particleRef.value = this.randomFillData;
  }

  show() {
    this.isHided = false;
  }

  hide() {
    this.isHided = true;
  }

  makeVisibility(visibility) {
    if (!visibility) {
      this.showPipeline.executable = false;
      this.layerBindings[0].executable = false;
      this.layerBindings[1].executable = false;

      this.voronoiPass.executable = false;
      this.swapPasses[0].executable = false;
      this.swapPasses[1].executable = false;
      this.swapPasses[2].executable = false;
      this.simulationPass.executable = false;
    } else {
      this.showPipeline.executable = true;

      this.voronoiPass.executable = true;
      this.simulationPass.executable = true;
    }
  }

  updateMaxSpeed(maxSpeed) {
    console.log("!!!!",maxSpeed)
    this.maxSpeed.n = maxSpeed > this.maxSpeed.n ? maxSpeed : this.maxSpeed.n;
  }

  updateVoronoi() {
    // No update and tick when preparing resource
    if (this.nextPreparing) return;

    // Update resource codition
    if (this.progress === 0) {
      this.currentResourceUrl =
        (this.currentResourceUrl + 1) % resourceUrl.length;
      this.addVoronoiBindingAsync(resourceUrl[this.currentResourceUrl]);
    }

    // Tick progress
    this.progress = Math.min(this.progress + 1, this.framesPerPhase - 1);

    // Swap condition
    if (this.nextPrepared && this.progress === this.framesPerPhase - 1) {
      this.progress = 0;
      this.swapVoronoiBinding();
    }

    // Tick progress rate
    this.progressRate.n = this.progress / (this.framesPerPhase - 1);
  }
  async getVoronoi(url) {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    const meshes = new Delaunay(new Float32Array(res.data));

    const vertices = [];
    const indices = meshes.triangles;
    for (let i = 0; i < meshes.points.length; i += 2) {
      const x = encodeFloatToDouble(
        scr.MercatorCoordinate.mercatorXfromLon(meshes.points[i + 0])
      );
      const y = encodeFloatToDouble(
        scr.MercatorCoordinate.mercatorYfromLat(meshes.points[i + 1])
      );

      vertices.push(x[0]);
      vertices.push(y[0]);
      vertices.push(x[1]);
      vertices.push(y[1]);
    }
    this.toRef = scr.aRef(new Float32Array(meshes.points.length).fill(0));
    this.fromRef = scr.aRef(new Float32Array(meshes.points.length).fill(0));
    this.nextRef = scr.aRef(new Float32Array(meshes.points.length).fill(0));

    this.indexBuffer_voronoi = scr.indexBuffer({
      name: `IndexBuffer (Voronoi Index (${url}))`,
      resource: { arrayRef: scr.aRef(new Uint32Array(indices)) },
    });
    this.vertexBuffer_voronoi = scr.vertexBuffer({
      name: `VertexBuffer (Station Position (${url}))`,
      resource: {
        arrayRef: scr.aRef(new Float32Array(vertices)),
        structure: [{ components: 4 }],
      },
    });

    this.voronoiBinding = scr.binding({
      name: `Binding (Flow-Field Voronoi)`,
      range: () => [this.indexBuffer_voronoi.length],
      index: { buffer: this.indexBuffer_voronoi },
      textures: [
        { texture: this.maskTexture, sampleType: "unfilterable-float" },
      ],
      vertices: [
        { buffer: this.vertexBuffer_voronoi },
        {
          buffer: scr.vertexBuffer({
            name: `VertexBuffer (Station Velocity (From)`,
            resource: {
              arrayRef: this.fromRef,
              structure: [{ components: 2 }],
            },
          }),
        },
        {
          buffer: scr.vertexBuffer({
            name: `VertexBuffer (Station Velocity (To)`,
            resource: { arrayRef: this.toRef, structure: [{ components: 2 }] },
          }),
        },
      ],
      sharedUniforms: [
        { buffer: this.uniformBuffer_frame },
        { buffer: this.uniformBuffer_static },
        { buffer: this.map.dynamicUniformBuffer },
      ],
    });
  }
  async getMask(url) {
    // const json = (await axios.get(url)).data;
    // let coordinate = json["features"][0]["geometry"]["coordinates"];
    // coordinate = coordinate[0][0].flat();
    // var triangle = earcut(coordinate);

    const geojson = (await axios.get(url)).data;
    let coordinate = geojson.features[0].geometry.coordinates[0];

    var data = earcut.flatten(coordinate);
    var triangle = earcut(data.vertices, data.holes, data.dimensions);

    coordinate = data.vertices.flat()
    //test
    // coordinate = [0.0,0.0,  0.0,0.5,  0.5,0.0,  0.5,0.5]
    // triangle = [0,1,2,1,2,3]

    const shaderSource = `
        struct Vinput{
            @builtin(vertex_index) vertexIndex: u32,
            @location(0) position: vec2f,
        }
        struct Voutput {
            @builtin(position) position: vec4f,
        }

        struct FrameUniformBlock {
            randomSeed: f32,
            viewPort: vec2f,
            mapBounds: vec4f,
            zoomLevel: f32,
            progressRate: f32,
            maxSpeed: f32,
        };
        
        struct StaticUniformBlock {
            groupSize: vec2u,
            extent: vec4f,
        };
        
        struct DynamicUniformBlock {
            far: f32,
            near: f32,
            uMatrix: mat4x4f,
            centerLow: vec3f,
            centerHigh: vec3f,
        };
        
        // Uniform Bindings
        @group(0) @binding(0) var<uniform> frameUniform: FrameUniformBlock;
        @group(0) @binding(1) var<uniform> staticUniform: StaticUniformBlock;
        @group(0) @binding(2) var<uniform> dynamicUniform: DynamicUniformBlock;

        
        fn translateRelativeToEye(high: vec3f, low: vec3f) -> vec3f {

            let highDiff = high - dynamicUniform.centerHigh;
            let lowDiff = low - dynamicUniform.centerLow;

            return highDiff + lowDiff;
        }

        @vertex
        fn vMain(in: Vinput) -> Voutput {
            
            let pos = vec4f(in.position,0.0,1.0);
            let cs_pos = dynamicUniform.uMatrix * vec4f(translateRelativeToEye(vec3f(in.position, 0.0), vec3f(0.0)), 1.0);

            var out: Voutput;
            out.position = cs_pos;
            return out;
        }
    
        @fragment
        fn fMain(in: Voutput) -> @location(0) vec4f {
            return vec4f(1.0,0.0,0.0,0.3);
        }
    `;
    let vertexData = [];
    for (let i = 0; i < coordinate.length; i += 2) {
      let [x, y] = lnglat2Mercator(coordinate[i], coordinate[i + 1]);
      //   let x = coordinate[i]
      //   let y = coordinate[i+1]
      vertexData.push(x);
      vertexData.push(y);
    }
    let vertexBuffer = scr.vertexBuffer({
      name: "vertexbuffer",
      resource: {
        arrayRef: scr.aRef(new Float32Array(vertexData)),
        structure: [{ components: 2 }],
      },
    });
    let indexBuffer = scr.indexBuffer({
      name: "indexbuffer",
      resource: {
        arrayRef: scr.aRef(new Uint32Array(triangle)),
      },
    });
    this.maskBinding = scr.binding({
      name: "binding",
      range: () => [triangle.length],
      vertices: [{ buffer: vertexBuffer }],
      index: { buffer: indexBuffer },
      sharedUniforms: [
        { buffer: this.uniformBuffer_frame },
        { buffer: this.uniformBuffer_static },
        { buffer: this.map.dynamicUniformBuffer },
      ],
    });

    this.maskPipline = scr.renderPipeline({
      name: "mask pipline",
      shader: {
        module: scr.shader({
          name: "shader",
          codeFunc: () => shaderSource,
        }),
      },
    });
  }

  async addVoronoiBindingSync(url) {
    this.nextPreparing = true;
    const res = await axios.get(url, { responseType: "arraybuffer" });
    const uvs = new Float32Array(res.data);

    let maxSpeed = -Infinity;
    for (let i = 0; i < uvs.length; i += 2) {
      const u = uvs[i + 0];
      const v = uvs[i + 1];

      const speed = Math.sqrt(u * u + v * v);
      maxSpeed = speed > maxSpeed ? speed : maxSpeed;
    }

    this.nextRef.value = uvs;
    this.updateMaxSpeed(maxSpeed);

    this.nextPreparing = false;
    this.nextPrepared = true;
  }

  swapVoronoiBinding() {
    // from - to - next --> to - next - from

    let tmpValue = this.fromRef.value;
    this.fromRef.value = this.toRef.value;
    this.toRef.value = tmpValue;

    tmpValue = this.toRef.value;
    this.toRef.value = this.nextRef.value;
    this.nextRef.value = tmpValue;
    this.nextPrepared = false;
  }

  addWorker(worker) {
    const that = this;
    this.loadWorker = worker;
    this.loadWorker.addEventListener("message", (event) => {
      const { url, maxSpeed, uvs } = event.data;
      const name = url;
      that.updateMaxSpeed(maxSpeed);
      that.nextRef.value = uvs;

      that.nextPrepared = true;
      that.nextPreparing = false;
    });
  }

  addVoronoiBindingAsync(url) {
    this.nextPreparing = true;

    this.loadWorker.postMessage({ url });
  }
}

// Helpers //////////////////////////////////////////////////////////////////////////////////////////////////////
function encodeFloatToDouble(value) {
  const result = new Float32Array(2);
  result[0] = value;

  const delta = value - result[0];
  result[1] = delta;
  return result;
}

function lnglat2Mercator(lng, lat) {
  let x = (180 + lng) / 360;
  let y =
    (180 -
      (180 / Math.PI) *
        Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) /
    360;
  return [x, y];
}
