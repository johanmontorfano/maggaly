import { PageRouter } from "./builder";
import { Main } from "./main/page";
import { TrainPage } from "./trains/page";

export const pageRouter = new PageRouter();

export function cli() {
    pageRouter.pages.push(new Main(), new TrainPage());
    pageRouter.mountPageOnRouter(0);
}
