import { Body } from './body';
import { Drawer } from './drawer';
import { GlobalInteraction } from './global-interaction';
import { SpatialInteraction } from './spatial-interaction';
import { Viewport } from './viewport';

type VIEW_TARGET = "WORLD" | "VIEWPORT"; 

export class SceneController {
    private bodies: Body[];
    private globalInteractions: GlobalInteraction[];
    private spatialInteractions: SpatialInteraction[];
    private drawer: Drawer;
    private viewport: Viewport;
    private worldView = false;

    constructor(
        drawer: Drawer, 
        bodies: Body[]=[], 
        globalInteractions: GlobalInteraction[]=[],
        spatialInteractions: SpatialInteraction[]=[],
        viewport: Viewport) {            
        this.bodies = bodies;
        this.drawer = drawer;
        this.globalInteractions = globalInteractions;
        this.spatialInteractions = spatialInteractions;
        this.viewport = viewport;
    }

    public switchView(target?: VIEW_TARGET) {
        if (target) this.worldView = (target === "VIEWPORT") ? false:true;
        else this.worldView = !this.worldView;
    }

    public addBody(body: Body): void {
        this.bodies.push(body);
    }

    public render = (timeDelta: number): void => {
        this.update(timeDelta);
        this.draw(timeDelta);
    }

	private runGlobalInteractions() {
		for (let i=0,len=this.globalInteractions.length; i<len; i++) {
			this.globalInteractions[i].run(this.bodies);
		}
	}

    private runSpatialInteractions() {
		for (let i=0,len=this.spatialInteractions.length; i<len; i++) {
			this.spatialInteractions[i].resolve();
		}
    }

    private update(timeDelta: number=0): void {
        this.viewport.update();
		for (let i=0, len=this.bodies.length; i<len; i++) {
			const body = this.bodies[i];
			body.update();
			this.spatialInteractionsRegister(body);
		}
        this.runSpatialInteractions();
        this.runGlobalInteractions();
    }

    private spatialInteractionsRegister(body: Body) {
		for (let i=0,len=this.spatialInteractions.length; i<len; i++) {
			this.spatialInteractions[i].registerBody(body)
		}
    }

    private draw(timeDelta: number=0): void {
        this.drawer.clear();
        this.bodies.forEach(body => {
            if (this.worldView) {
                this.drawer.drawModel(body.getWorldModel());
            } else {
                const viewModel = this.viewport.getRelativeView(body);
                this.drawer.drawModel(viewModel);
            }            
        });

        // Print viewport as a world transformed model
        if (this.worldView)
            this.drawer.drawModel(this.viewport.getWorldModel());



        //this.drawer.printText(`DELTA ${timeDelta}`, 300, 300)
    }
}
