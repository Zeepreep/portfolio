// alias Matter modules
const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Mouse,
    MouseConstraint,
    Composite
} = Matter;

const engine = Engine.create();
engine.world.gravity.y = 1;

const canvas = document.getElementById('world');
const render = Render.create({
    canvas,
    engine,
    options: {
        background: 'transparent',
        wireframes: false,
        width: window.innerWidth,
        height: window.innerHeight,
    }
});
Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

const thickness = 100;
const floor    = Bodies.rectangle(window.innerWidth/2, window.innerHeight + thickness/2, window.innerWidth, thickness, {
    isStatic: true,
    collisionFilter: { category: 0x0002 }
});
const leftWall = Bodies.rectangle(-thickness/2, window.innerHeight/2, thickness, window.innerHeight, { isStatic: true });
const rightWall= Bodies.rectangle(window.innerWidth + thickness/2, window.innerHeight/2, thickness, window.innerHeight, { isStatic: true });
const roof    = Bodies.rectangle(window.innerWidth/2, -thickness/2, window.innerWidth, thickness, {  
    isStatic: true,
    collisionFilter: { category: 0x0002 }
});
World.add(engine.world, [ floor, leftWall, rightWall, roof ]);

const avatar = Bodies.circle(200, 100, 75, {
    restitution: 0.9,
    friction: 0.01,
    collisionFilter: { category: 0x0001 },
    render: {
        sprite: {
            texture: '../assets/me-picture.png',
            xScale: 0.3,
            yScale: 0.3
        }
    }
});
World.add(engine.world, [ floor, leftWall, rightWall, roof, avatar ]);

const canvasEl = render.canvas;
const radius  = avatar.circleRadius;     
canvasEl.style.pointerEvents = 'none';   

window.addEventListener('pointermove', ev => {
    const rect = canvasEl.getBoundingClientRect();
    const x    = ev.clientX - rect.left;
    const y    = ev.clientY - rect.top;

    const dx = x - avatar.position.x;
    const dy = y - avatar.position.y;

    if (dx*dx + dy*dy <= radius*radius) {
        canvasEl.style.pointerEvents = 'auto';
    } else {
        canvasEl.style.pointerEvents = 'none';
    }
});

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(render.canvas),
    constraint: { stiffness: 0.2, render: { visible: false } },
    collisionFilter: { mask: 0x0001 }   
});
World.add(engine.world, mouseConstraint);

window.addEventListener('resize', () => {
    Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: window.innerWidth, y: window.innerHeight } });
});
