export class ScenePlayer {
    private animationFrameId: number | null = null;
    private lastFrameTime: number = 0;
    private fpsInterval: number;
    private remainingFrames: number = Infinity;
    private isPlaying: boolean = false;

    constructor(private mainLoopCallback: (timeDelta: number) => void, fps: number = 60) {
        this.fpsInterval = 1000 / fps;
    }

    play(frames: number = Infinity) {
        this.remainingFrames = frames;
        this.lastFrameTime = performance.now();
        this.isPlaying = true;
        this.animate();
    }

    private animate = (): void => {
        if (!this.isPlaying) {
            return;
        }

        const currentTime = performance.now();
        const elapsed = currentTime - this.lastFrameTime;

        if (elapsed > this.fpsInterval) {
            this.lastFrameTime = currentTime - (elapsed % this.fpsInterval);
            this.mainLoopCallback(elapsed);
            this.remainingFrames--;
        }

        if (this.remainingFrames > 0) {
            this.animationFrameId = window.requestAnimationFrame(this.animate);
        } else {
            this.pause();
        }
    }

    pause() {
        this.isPlaying = false;

        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
