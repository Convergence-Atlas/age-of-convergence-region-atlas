# Digimon: Echoes of the First Light — section copy guide

The completed world has been split into all 49 top-level sections. The content is unchanged. Each `.json` file contains the value of exactly one section from the original export.

## Choose the kind of field you are filling

1. **An entire section that accepts JSON:** open the matching `.json` file, copy everything including its opening and closing braces or brackets, and replace that section's contents. The file already contains the section value; do not add an extra section-name wrapper. For example, `quests.json` begins with the quest names, rather than `{ "quests": ... }`.
2. **One record that accepts JSON:** open `Digimon_Section_Copy_Helper.html`, choose the section, and click the record name. Copy the displayed object into the matching record's JSON field. A section-wide import expecting a name-keyed collection instead needs the whole section file.
3. **A text field, such as a description:** use the copy helper, open the record, and select the specific field. When its value is a string, the helper automatically shows plain text without JSON quotes or escaped newlines. Paste it into the corresponding text box. AI instructions can be opened through their task and instruction names in the same way.
4. **A whole-world import:** use the original complete world file. These fragments are intended for matching section fields; they are not complete world exports on their own.

The destination names below describe the original schema keys. An editor may display different menu labels. Use the exact key and the type of field it expects to identify the destination. For example, `npcTypes` holds species templates while `npcs` holds individual characters and species exemplars.

Do not paste several standalone JSON objects one after another into one field. For a complete section, use its single complete file. Empty sections may be skipped during manual entry; keep them if reconstructing the full export. `heroesVersion` is metadata and should remain 36.

The copy helper works offline and includes every section. Its Copy button uses the browser clipboard when available and otherwise selects the text for Ctrl+C or Command+C. Large sections contain several megabytes; an editor's own paste or import limits still apply.

## Where to put the Digimon material

| Material | Section key |
|---|---|
| Fresh, In-Training, Rookie, Champion, Ultimate, Mega, Armor and campaign Ultra forms | `npcTypes` and `npcs`; detailed profiles and evolution information in `worldLore` |
| Digimon moves and evolution actions | `abilities` |
| Original DigiDestined, their partners, NPCs and enemies | `npcs` |
| Digivices, Digitama, armor Digi-Eggs, crests, Miracles and Destiny items | `itemTypes` |
| Your DigiDestined identity, partner seed and crest affinity | `traits`, `traitCategories` and `premadeCharacters` |
| Real World and Digital World maps | `realms`, `regions` and `locations` |
| Canon history, later-series connections and campaign rules | `worldLore` and `aiInstructions` |
| Starting adventure and ongoing campaign | `storyStarts`, `quests`, `arcs`, `narrativeEvents`, `triggers` and `questTriggers` |

## All section files

Counts refer to top-level entries in that section, not to separate species or canon techniques. Abilities include campaign actions as well as sourced moves.

### World and maps

| Destination / key | Entries | File | Contents |
|---|---:|---|---|
| Realms / `realms` | 4 | `01_World_and_Maps/realms.json` | Real World, Digital World, Network Realms and Archive Branches. |
| Regions / `regions` | 21 | `01_World_and_Maps/regions.json` | The regions belonging to those realms. |
| Locations / `locations` | 82 | `01_World_and_Maps/locations.json` | Locations, their areas, connections and local details. |
| Unassigned areas / `unassignedAreas` | 0 | `01_World_and_Maps/unassignedAreas.json` | Empty in this world; keep only when rebuilding the export. |
| Factions / `factions` | 35 | `01_World_and_Maps/factions.json` | Allied groups, independent communities and enemy organizations. |
| World voices / `worldVoices` | 0 | `01_World_and_Maps/worldVoices.json` | Empty in this world; keep only when rebuilding the export. |
| World lore / `worldLore` | 1,611 | `01_World_and_Maps/worldLore.json` | Digimon profiles, evolution information, history and campaign lore. |

### Characters and Digimon

| Destination / key | Entries | File | Contents |
|---|---:|---|---|
| Skills / `skills` | 23 | `02_Characters_and_Digimon/skills.json` | The skills used by characters and ability requirements. |
| Abilities / moves / `abilities` | 9,661 | `02_Characters_and_Digimon/abilities.json` | Digimon techniques, evolution actions and other usable abilities. |
| NPC types / `npcTypes` | 1,565 | `02_Characters_and_Digimon/npcTypes.json` | Digimon species templates and other character types. |
| Trait categories / `traitCategories` | 4 | `02_Characters_and_Digimon/traitCategories.json` | The categories that organize selectable traits. |
| Traits / `traits` | 225 | `02_Characters_and_Digimon/traits.json` | DigiDestined identities, partner seeds, crest affinities and other traits. |
| Item types / `itemTypes` | 1,646 | `02_Characters_and_Digimon/itemTypes.json` | Digivices, Digitama, armor Digi-Eggs, crests and other items. |
| NPCs / `npcs` | 1,704 | `02_Characters_and_Digimon/npcs.json` | Digimon exemplars, named partners, DigiDestined, other NPCs and villains. |
| Premade characters / `premadeCharacters` | 4 | `02_Characters_and_Digimon/premadeCharacters.json` | Four customizable starting character choices. |
| Character archetypes / `characterArchetypes` | 22 | `02_Characters_and_Digimon/characterArchetypes.json` | Generation templates for characters. |
| Name filter settings / `nameFilterSettings` | 10 | `02_Characters_and_Digimon/nameFilterSettings.json` | Rules governing generated names. |
| Random names / `randomNames` | 2 | `02_Characters_and_Digimon/randomNames.json` | Name lists for character generation. |

### Story and quests

| Destination / key | Entries | File | Contents |
|---|---:|---|---|
| Story starts / `storyStarts` | 12 | `03_Story_and_Quests/storyStarts.json` | Starting scenarios, including The Egg That Heard Your Name. |
| Quests / `quests` | 80 | `03_Story_and_Quests/quests.json` | Main and side quests, objectives, sources and completion conditions. |
| Arcs / `arcs` | 10 | `03_Story_and_Quests/arcs.json` | The ten major campaign arcs. |
| Quest triggers / `questTriggers` | 20 | `03_Story_and_Quests/questTriggers.json` | Conditions for unlocking or advancing quests. |
| Narrative events / `narrativeEvents` | 60 | `03_Story_and_Quests/narrativeEvents.json` | Scripted event definitions and story changes. |
| Triggers / `triggers` | 60 | `03_Story_and_Quests/triggers.json` | Conditions that activate events or other world behavior. |
| Game modes / `gameModes` | 5 | `03_Story_and_Quests/gameModes.json` | The supported ways to play this world. |
| Author seeds / `authorSeeds` | 19 | `03_Story_and_Quests/authorSeeds.json` | Scenario seeds for generating additional campaign material. |

### AI and play settings

| Destination / key | Entries | File | Contents |
|---|---:|---|---|
| AI instructions / `aiInstructions` | 17 | `04_AI_and_Play_Settings/aiInstructions.json` | Narrator and generation rules, organized by task and instruction. |
| Narrator style / `narratorStyle` | text | `04_AI_and_Play_Settings/narratorStyle.json` | The plain-text voice and tone of the narration. |
| Story settings / `storySettings` | 2 | `04_AI_and_Play_Settings/storySettings.json` | Story setup and general campaign behavior. |
| Resource settings / `resourceSettings` | 4 | `04_AI_and_Play_Settings/resourceSettings.json` | Resources and their configuration. |
| Attribute settings / `attributeSettings` | 10 | `04_AI_and_Play_Settings/attributeSettings.json` | The character attribute configuration. |
| Skill settings / `skillSettings` | 14 | `04_AI_and_Play_Settings/skillSettings.json` | Skill generation and usage configuration. |
| Progression settings / `progressionSettings` | 13 | `04_AI_and_Play_Settings/progressionSettings.json` | Character progression and level-related configuration. |
| Location settings / `locationSettings` | 9 | `04_AI_and_Play_Settings/locationSettings.json` | Location generation and navigation configuration. |
| Item settings / `itemSettings` | 4 | `04_AI_and_Play_Settings/itemSettings.json` | Item generation and usage configuration. |
| Combat settings / `combatSettings` | 7 | `04_AI_and_Play_Settings/combatSettings.json` | Combat configuration. |
| Tip settings / `tipSettings` | 5 | `04_AI_and_Play_Settings/tipSettings.json` | Player tips and help configuration. |
| Death settings / `death` | 2 | `04_AI_and_Play_Settings/death.json` | What happens when a character dies. |
| End game / `endGame` | 3 | `04_AI_and_Play_Settings/endGame.json` | End-of-game behavior and conditions. |
| Relationship stages / `relationshipStages` | 11 | `04_AI_and_Play_Settings/relationshipStages.json` | The ordered relationship stage list. |
| Gameplay music settings / `gameplayMusicSettings` | 2 | `04_AI_and_Play_Settings/gameplayMusicSettings.json` | Music cues and playback settings. |
| Other settings / `otherSettings` | 3 | `04_AI_and_Play_Settings/otherSettings.json` | Additional health and presentation settings. |
| Image prompt configuration / `imagePromptConfiguration` | 5 | `04_AI_and_Play_Settings/imagePromptConfiguration.json` | Instructions used when requesting character or world images. |
| Character creation settings / `characterCreationSettings` | 1 | `04_AI_and_Play_Settings/characterCreationSettings.json` | Allows customization during character creation. |
| Encounter elements / `encounterElements` | 21 | `04_AI_and_Play_Settings/encounterElements.json` | Elements available when generating encounters. |
| Location archetypes / `locationArchetypes` | 11 | `04_AI_and_Play_Settings/locationArchetypes.json` | Generation templates for locations. |
| Region archetypes / `regionArchetypes` | 23 | `04_AI_and_Play_Settings/regionArchetypes.json` | Generation templates for regions. |

### Export metadata

| Destination / key | Entries | File | Contents |
|---|---:|---|---|
| Heroes version / `heroesVersion` | 36 | `05_Export_Metadata/heroesVersion.json` | Export version 36; usually not a field to paste into the editor. |
| Mods / `mods` | 0 | `05_Export_Metadata/mods.json` | Empty mod list from the export template. |

### Narrator style text box

For a plain narrator-style text box, use `04_AI_and_Play_Settings/narratorStyle_PLAIN_TEXT.txt`. For a JSON section field, use `narratorStyle.json`, which is a valid JSON string with surrounding quotes.

### Content and pictures

This pack reorganizes the existing world and adds copying controls. It preserves all NPCs, abilities, quests, settings and image references. For the complete illustrated catalog with embedded pictures, use the previously supplied `Digimon_First_Light_Illustrated_Companion.html`.
