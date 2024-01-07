import { Drawer } from './class/drawer';
import { SceneController } from './class/scene-controller';
import { CanvasDrawingContext } from './class/canvas-drawing-context';
import { ScenePlayer } from './class/scene-player';
import { BodyFactory } from './class/body-factory';
import { GravityInteraction } from './class/gravity-interaction';
import { Viewport } from './class/viewport';
import { Point } from './model/geometry';
import { SpatialInteraction } from './class/spatial-interaction';
import { PhysicsService } from './class/physics-service';
import { Vector } from './class/vector';

function start() {

    // Setup canvas
    const canvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;
    const canvasContext: CanvasRenderingContext2D | null = canvasElement?.getContext("2d");
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight - 4;
    canvasElement.focus();
    if (!canvasContext) {
        throw new Error("Invalid CanvasRenderingContext2D");
    }

    const center: Point = [
        canvasElement.width/2,
        canvasElement.height/2
    ]

    // Drawing context
    const canvasCtx = new CanvasDrawingContext(canvasContext, canvasElement.width, canvasElement.height);
    const canvasDrawer = new Drawer(canvasCtx);

    // Viewport    
    const viewport = new Viewport(
        canvasElement.width,
        canvasElement.height,
        center
    );
    viewport.setScale(1);

    // Bodies
    const style1 = { strokeColor: "#ffffff", fillColor: "#ffffff" }
    const style2 = { strokeColor: "green", fillColor: "green" }
    const r = 1;
    const bodies = BodyFactory.createRandomBodies(2, 3, 0.7, 1, 16, 70, style1, center, r, 50);
    
    bodies[0].getLocation().setY(center[1])
    bodies[0].getLocation().setX(center[0] - 80)
    bodies[0].applyForce(new Vector(20 , 0));

    bodies[1].getLocation().setY(center[1])
    bodies[1].getLocation().setX(center[0] + 80)
    bodies[1].applyForce(new Vector(-20, 0));
    bodies[1].getModel().style = style2;

    // Gravity
    const gravity = new GravityInteraction();
    
    const collision = new SpatialInteraction(600, 1);
    collision.setLocalResolver(PhysicsService.elasticCollision);



    // Scene
    const scene = new SceneController(canvasDrawer, bodies, [], [collision], viewport);
    const player = new ScenePlayer(scene.render, 1);

    // RUN
    //player.play();



    // Keyboard controls
    document.addEventListener('keydown', function (ev) {
        if (ev.key === " ") {
            console.log("Playing scene")
            player.play(1);
        }

        if (ev.key === "Escape") {
            console.log("Stopping scene")
            player.pause();
        }

        if (ev.key === "-") {
            viewport.scaleUp(0.01);
        }
        if (ev.key === "+") {
            viewport.scaleDown(0.01);
        }

        // Translation
        if (ev.key === "ArrowUp") {
            viewport.moveUp(3);
        }
        if (ev.key === "ArrowLeft") {
            viewport.moveLeft(3);
        }
        if (ev.key === "ArrowRight") {
            viewport.moveRight(3);
        }
        if (ev.key === "ArrowDown") {
            viewport.moveDown(3);
        }
        if (ev.key === "q") {
            viewport.rotateLeft();
        }
        if (ev.key === "e") {
            viewport.rotateRight();
        }
        if (ev.key === "w") {
            viewport.rotateRight();
        }
        if (ev.key === "s") {
            viewport.rotateRight();
        }
        if (ev.key === "v") {
            scene.switchView();
        }        
    
    });

    canvasElement.addEventListener("wheel", (ev: WheelEvent) => {
        ev.preventDefault();
        const zoomFactor = 0.06
    
        if (ev.deltaY > 0) {
            viewport.scaleDown(zoomFactor);
        } else {
            viewport.scaleUp(zoomFactor);
        }
    });


    let isDragging = false;
    let lastMouseX: number;
    let lastMouseY: number;
    
    canvasElement.addEventListener('mousedown', (event) => {
        isDragging = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    });
    
    canvasElement.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;
            viewport.getLocation().setX(deltaX);
            viewport.getLocation().setY(deltaY);

            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        }
    });
    
    canvasElement.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvasElement.addEventListener('mouseleave', () => {
        isDragging = false;
    });
};

window.onload = start;
