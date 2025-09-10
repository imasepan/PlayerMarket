export class Mutex {
    private locked = false;
    private waiting: Array<() => void> = [];

    async lock(): Promise<() => void> {
        const unlock = () => {
            const next = this.waiting.shift();
            if (next) {
                next();
            } else {
                this.locked = false;
            }
        };

        if (this.locked) {
            await new Promise<void>(resolve => this.waiting.push(resolve));
        } else {
            this.locked = true;
        }
        return unlock;
    }
}