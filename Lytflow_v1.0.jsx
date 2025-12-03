#target photoshop

/**
 * Layerstorm Breakdown Engine – Layer Reveal Breakdown (Nested Support)
 * Photoshop Script for PSDs: reveals each visible ArtLayer (including nested inside groups)
 * from bottom to top, creating a frame animation for breakdown videos or GIFs.
 */

function createLayerBreakdown() {
    if (!app.documents.length) {
        alert("No document open.");
        return;
    }

    var doc = app.activeDocument;
    var layers = [];

    // Recursive function to collect visible ArtLayers
    function collectVisibleArtLayers(container) {
        for (var i = 0; i < container.layers.length; i++) {
            var lyr = container.layers[i];
            if (!lyr.visible) continue;
            if (lyr.typename === "ArtLayer") {
                layers.push(lyr);
            } else if (lyr.typename === "LayerSet") {
                collectVisibleArtLayers(lyr);
            }
        }
    }

    // 2. Collect all visible ArtLayers (bottom-to-top)
    collectVisibleArtLayers(doc);
    if (layers.length < 2) {
        alert("Need at least 2 visible layers to create a breakdown.");
        return;
    }
    // Reverse order so bottom-most layer is first
    layers.reverse();

    // 3. Hide all collected layers initially
    for (var j = 0; j < layers.length; j++) {
        layers[j].visible = false;
    }

    // 4. Create frame animation
    try {
        executeAction(stringIDToTypeID("makeFrameAnimation"), undefined, DialogModes.NO);
    } catch (e) {
        alert("Enable the Timeline panel first (Window > Timeline).");
        return;
    }

    // 5. Reveal layers bottom-to-top, adding a new frame each time
    for (var f = 0; f < layers.length; f++) {
        layers[f].visible = true;
        if (f > 0) {
            var dupFrameId = charIDToTypeID("Dplc");
            var dupDescriptor = new ActionDescriptor();
            var dupRef = new ActionReference();
            dupRef.putEnumerated(stringIDToTypeID("animationFrameClass"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            dupDescriptor.putReference(charIDToTypeID("null"), dupRef);
            executeAction(dupFrameId, dupDescriptor, DialogModes.NO);
        }
    }


    alert("✅ Breakdown created with " + "\nExport via File > Export > Render Video or Save for Web.");
}

// Run the breakdown script
createLayerBreakdown();
