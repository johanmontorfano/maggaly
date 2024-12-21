import { CustomPopup, PageBuilder } from "console-gui-tools";
import { context } from "../../router";
import { RailSegmentType } from "../../network/components/rails";

export function railsPopup() {
    const page = new PageBuilder(5);
    
    context.sections.forEach(rail => {
        const segType = rail.segmentType === RailSegmentType.Depot ?
            "Depot" : rail.segmentType === RailSegmentType.Station ?
            "Station" : rail.segmentType === RailSegmentType.Switch ?
            "Switch" : "Rail";
        const { id, state } = rail;

        page.addRow({
            text: `${id} Type: ${segType} Electricity: ${state.electriclyFed}`
        });
    });

    return new CustomPopup({
        id: "rails_popup",
        title: "Rails List",
        content: page,
        width: 64
    }).show();
}
