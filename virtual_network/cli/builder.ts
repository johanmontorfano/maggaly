import { ConsoleManager, PageBuilder } from "console-gui-tools";
import { eventsRegistry } from "./event_list";
import { pageRouter } from ".";

const GUI = new ConsoleManager({
    title: "Virtual Network Control Panel",
    logPageSize: 8,
    enableMouse: true,
    layoutOptions: {
        showTitle: true,
        boxed: true,
        direction: "vertical",
        fitHeight: true,
        type: "double"
    }
}).on("exit", () => {
    console.log("[CLI] Goobye !");
    process.exit();
}).on("keypressed", key => {
    const cb = eventsRegistry[key.name];
    if (cb !== undefined) cb();
});

/** Allows to go back and forth between pages and automatically handle
* page mounting and unmounting. */
export class PageRouter {
    pages: Page<any>[];
    router: Page<any>[];

    constructor() {
        this.pages = [];
        this.router = [];
    }

    addPage(page: Page<any>) {
        this.pages.push(page);
    }

    async mountPageOnRouter(id: number) {
        const page = this.pages[id];

        if (this.router.length > 0)
            this.router[this.router.length - 1].onPageUnmount();
        await page.onPageMount();
        this.router.push(page);
    }

    async unmountLastRoutedPage() {
        const routerPage = this.router.pop() as Page<any>;
        const prevRouterPage = this.router[this.router.length - 1];

        routerPage.onPageUnmount();
        prevRouterPage.onPageMount();
    }
}

export class Page<S extends {}> {
    state: S;
    renderingLoop?: NodeJS.Timeout;
    registeredEventsKey: string[];

    constructor(initial: S) {
        this.registeredEventsKey = [];
        this.state = initial;
    }

    /** @override Called when mounting the page. If this function returns
    * `false` mounting is aborted. */
    async onPageMount(): Promise<boolean> {
        const events = this.registerEvents();

        this.registeredEventsKey = Object.keys(events);
        this.registeredEventsKey.forEach(ek => {
            eventsRegistry[ek] = events[ek];
        });
        this.renderingLoop = setInterval(
            () => GUI.setPage(this.render()), 
            1000
        );
        GUI.setPage(this.render());
        return true;
    };

    /** @override Called when unmounting the page. */
    onPageUnmount(): void {
        this.unregisterEvents();
        if (this.renderingLoop) clearInterval(this.renderingLoop);
    };

    /** @override Page events should be registered in here. */
    registerEvents(): typeof eventsRegistry {
        return {
            escape: () => {
                this.unregisterEvents();
                pageRouter.unmountLastRoutedPage();
            }
        };
    };

    /** Call this function to automatically remove all page events. */
    private unregisterEvents() {
        this.registeredEventsKey.forEach(key => {
            eventsRegistry[key] = undefined;
        });
    }

    /** @override Rendering has to be done here. */
    render(): PageBuilder {
        return undefined as any;
    }
}
