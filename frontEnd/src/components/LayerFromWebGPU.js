import FlowLayer from './flowlayer-mapbox'
import WaterDifLayer from './waterDifLayer-mapbox'
import WindLayer from './windlayer-mapbox'
import WindLayer9711 from './9711windOK-mapboxlayer'
import FlowLayer9711 from './9711flowOK-mapboxlayer'
import {prepareAddWaterLayer,addWaterLayer,prepareAddWaterLayer2,addWaterLayer2} from './9711add'

// const clearWebGPUCanvas = async ()=>{
//  // 初始化 WebGPU

//  const adapter = await navigator.gpu.requestAdapter()
//  const device = await adapter?.requestDevice()

//  const cvs = document.getElementById('WebGPUFrame')

//  const context = cvs.getContext("webgpu")
//  const format = navigator.gpu.getPreferredCanvasFormat()

//  context.configure({
//     format,
//     device,
//     alphaMode: 'premultiplied'
//  });

//  let passDescriptor = {
//  label: 'descriptor',
//     colorAttachments: [{
//         view: context.getCurrentTexture().createView(),
//         resolveTarget: undefined,
//         clearValue: [0.0, 0.0, 0.0, 0.0],
//         loadOp: "clear",
//         storeOp: "store",
//     }]
//  }


//  passDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
//  const encoder = device.createCommandEncoder();
//  const pass = encoder.beginRenderPass(passDescriptor);

//  pass.end();
//  const commandBuffer = encoder.finish();
//  device.queue.submit([commandBuffer]);


// }

const clearWebGPUCanvas = async () => {
    // 获取canvas

    const entry = navigator.gpu;
    if (!entry) {
        document.getElementById("notSupport").style.display = "";
        return;
    }
    // 拿到gpu的适配器（显卡）
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference: "high-performance",
    });

    // 适配器获取具体的device实例
    const device = await adapter.requestDevice();

    const canvas = document.querySelector("#WebGPUFrame");
    console.log('clear!');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // 这句非常顺序非常重要，不能在获取device之前获取context，否则会canvas不显示图形
    // 只有在dom更新（例如修改canvascss宽高）后才显示
    const context = ((
        canvas.getContext("webgpu")
    )) 

    // 获取swapchain 用于向canvas输出渲染结果
    // const format = await context.getSwapChainPreferredFormat(device);
    // const swapChain = context.configureSwapChain({
    //     device: device,
    //     format: format,
    //     usage: GPUTextureUsage.OUTPUT_ATTACHMENT,
    // });

    const format = navigator.gpu.getPreferredCanvasFormat()

    context.configure({
        format,
        device,
        alphaMode: 'premultiplied'
    });

    // 创建command生成器 用来编码向gpu发送的command
    const commandEncoder = device.createCommandEncoder();

    // 渲染pass的描述
    const backgroundColor = { r: 0.25, g: 0.5, b: 1, a: 1.0 };
    const renderPassDescriptor = {
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                clearValue: [0.0, 0.0, 0.0, 0.0],
                loadOp: "clear",
                storeOp: "store",
            },
        ],
    };


    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassDescriptor);

    pass.end();
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
};

export{
    FlowLayer,
    WindLayer,
    WaterDifLayer,
    WindLayer9711,
    FlowLayer9711,
    prepareAddWaterLayer,
    addWaterLayer,
    prepareAddWaterLayer2,addWaterLayer2,
    clearWebGPUCanvas
}