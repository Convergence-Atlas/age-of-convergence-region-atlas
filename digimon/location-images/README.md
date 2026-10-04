# Digimon location scenes

This branch contains 410 individual atlas scenes: 82 location overviews and 328 area scenes, extracted from the existing verified environment boards. These are atlas illustrations, not official anime screenshots. Original rectangles and pixel dimensions are preserved. Existing JPEG scenes are reused and the remaining scenes use WebP for efficient loading.

The Studio replacement contains 154 locations and 616 areas across the companion 37-region atlas. It preserves all 82 original location names, 328 original area keys and existing map anchors. Each location and area has a direct picture URL. New campaign destinations reuse suitable existing scenes; the 770 assignments and their source locations are recorded in studio-assignments.json.

manifest.json records the original board, extraction rectangle, dimensions, actual Git blob SHA and URL for every picture. The build checks original board and catalog hashes, JSON limits, faction and region references, connected reciprocal paths, map bounds and nonoverlapping additions.

Import digimon/studio/Digimon_Regions_UPDATED.json into World -> Regions, then digimon/studio/Digimon_Locations_UPDATED.json into World -> Locations. Each is a root object without an extra wrapper. locations-validation.json records the completed checks; these are file checks, not a claim that live Studio imported the world.

Adventure and Adventure 02 anchor the core fan campaign. Later shows, games and films are gated source-specific expeditions with actual dated rules. Added sites and layouts are campaign adaptations. Miracles and Destiny personal Crest paths are original campaign additions distinct from the golden Armor Digi-Eggs.
