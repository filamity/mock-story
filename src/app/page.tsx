"use client";

import styles from "./page.module.css";
import useLocalStorage from "./utils/useLocalStorage";
import {
  BATTLE_UNITS,
  DEFAULT_SCENE_EVENT_VALUES,
  Direction,
  DIRECTIONS,
  DOWN,
  HeroData,
  LEVELS,
  LEVELS_MAPS,
  PORTRAITS,
  RIGHT,
  Scenario,
  SCENE_EVENTS,
  SceneEvent,
  UP,
  Vector2,
} from "./utils/types";
import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Input,
  MultiSelect,
  Select,
  Textarea,
} from "@mantine/core";
import { deleteMapEntry } from "./utils/deleteMapEntry";

interface Level {
  name: string;
  image: string;
  scenarios: Scenario[];
}

const Home: React.FC = () => {
  const [flags, setFlags] = useLocalStorage<string[]>("flags", []);
  const [flagInputValue, setFlagInputValue] = useState("");
  const [flagDeleteValue, setFlagDeleteValue] = useState("");

  const [levels, setLevels] = useLocalStorage<Level[]>(
    "levels",
    Object.keys(LEVELS_MAPS).map((key) => ({
      name: key,
      image: LEVELS_MAPS[key as keyof typeof LEVELS_MAPS],
      scenarios: [],
    }))
  );
  const [level, setLevel] = useLocalStorage<string>("level", "InterviewRoom");

  const [loadDataValue, setLoadDataValue] = useState("");

  const currentLevel = levels?.find((l) => l.name === level);

  const createNewScenario = () => {
    const newScenario: Scenario = {
      name: "Scenario",
      conditions: {
        requires: [],
        bypass: [],
      },
      scene: [],
    };
    setLevels(
      levels.map((l) =>
        l.name === level
          ? {
              ...l,
              scenarios: [...l.scenarios, newScenario],
            }
          : l
      )
    );
  };

  function objectStringToJSON(jsStr: string): string {
    // add quotes to keys and remove trailing commas
    return jsStr
      .replace(/(?<!["'\w])([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":')
      .replace(/,\s*([\]}])/g, "$1");
  }

  return (
    <div className={styles.page}>
      <section>
        <strong>Flags</strong>
        <div className="grid-200">
          <Input
            value={flagInputValue}
            placeholder="New Flag"
            onChange={(event) => setFlagInputValue(event.currentTarget.value)}
          />
          <Button
            onClick={() => {
              setFlags([...flags, flagInputValue]);
              setFlagInputValue("");
            }}
          >
            Add Flag
          </Button>
          <Select
            data={flags}
            value={flagDeleteValue}
            placeholder="Delete Flag"
            onChange={(value) => value && setFlagDeleteValue(value)}
          />
          <Button
            onClick={() => {
              setFlags(flags.filter((f) => f !== flagDeleteValue));
              setFlagDeleteValue("");
            }}
          >
            Delete Flag
          </Button>
        </div>
      </section>

      <section>
        <strong>Level</strong>
        <Select
          data={LEVELS}
          value={level}
          onChange={(value) => value && setLevel(value)}
        />
      </section>

      {currentLevel && (
        <>
          <section>
            <strong>Map</strong>
            <img src={currentLevel.image} alt={currentLevel.name} />
          </section>

          <section>
            <strong>Scenarios</strong>
            {currentLevel.scenarios.map((scenario, i) => (
              <div className="box" key={i}>
                <div className="grid-200">
                  <Input
                    style={{ gridColumn: "span 2" }}
                    value={scenario.name}
                    placeholder="Scenario Name"
                    onChange={(event) =>
                      setLevels(
                        levels.map((l) =>
                          l.name === level
                            ? {
                                ...l,
                                scenarios: l.scenarios.map((s, j) =>
                                  j === i
                                    ? { ...s, name: event.currentTarget.value }
                                    : s
                                ),
                              }
                            : l
                        )
                      )
                    }
                  />
                  <Input
                    value={loadDataValue}
                    placeholder="Load Scene Events"
                    onChange={(event) =>
                      setLoadDataValue(event.currentTarget.value)
                    }
                  />
                  <Button
                    onClick={() => {
                      try {
                        const data = JSON.parse(
                          objectStringToJSON(loadDataValue)
                        );
                        console.log(data);
                        setLevels(
                          levels.map((l) =>
                            l.name === level
                              ? {
                                  ...l,
                                  scenarios: l.scenarios.map((s, j) =>
                                    j === i ? { ...s, scene: data } : s
                                  ),
                                }
                              : l
                          )
                        );
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    Load
                  </Button>
                  <MultiSelect
                    data={flags}
                    placeholder="Requires"
                    value={scenario.conditions.requires}
                    onChange={(value) =>
                      setLevels(
                        levels.map((l) =>
                          l.name === level
                            ? {
                                ...l,
                                scenarios: l.scenarios.map((s, j) =>
                                  j === i
                                    ? {
                                        ...s,
                                        conditions: {
                                          ...s.conditions,
                                          requires: value,
                                        },
                                      }
                                    : s
                                ),
                              }
                            : l
                        )
                      )
                    }
                  />
                  <MultiSelect
                    data={flags}
                    placeholder="Bypass"
                    value={scenario.conditions.bypass}
                    onChange={(value) =>
                      setLevels(
                        levels.map((l) =>
                          l.name === level
                            ? {
                                ...l,
                                scenarios: l.scenarios.map((s, j) =>
                                  j === i
                                    ? {
                                        ...s,
                                        conditions: {
                                          ...s.conditions,
                                          bypass: value,
                                        },
                                      }
                                    : s
                                ),
                              }
                            : l
                        )
                      )
                    }
                  />
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(scenario, null, 2)
                      )
                    }
                  >
                    Copy
                  </Button>
                  <Button
                    onClick={() =>
                      setLevels(
                        levels.map((l) =>
                          l.name === level
                            ? {
                                ...l,
                                scenarios: l.scenarios.filter(
                                  (_, j) => j !== i
                                ),
                              }
                            : l
                        )
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
                <SceneEditor
                  name={`${scenario.name || "Scene Events"} (${
                    scenario.scene.length
                  })`}
                  flags={flags}
                  scene={scenario.scene}
                  setScene={(value) =>
                    setLevels(
                      levels.map((l) =>
                        l.name === level
                          ? {
                              ...l,
                              scenarios: l.scenarios.map((s, j) =>
                                j === i ? { ...s, scene: value } : s
                              ),
                            }
                          : l
                      )
                    )
                  }
                />
              </div>
            ))}
            <div>
              <Button onClick={createNewScenario}>Add Scenario</Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const SceneEditor = ({
  name = "Scene",
  flags,
  scene,
  setScene,
}: {
  name?: string;
  flags: string[];
  scene: SceneEvent[];
  setScene: (value: SceneEvent[]) => void;
}) => {
  return (
    <Accordion chevronPosition="right" variant="contained" bg="transparent">
      <Accordion.Item value="1">
        <Accordion.Control>{name}</Accordion.Control>
        <Accordion.Panel>
          <div className="grid-400">
            {scene.map((se, i) => (
              <div
                key={i}
                className={`box ${
                  se.type === SCENE_EVENTS.CHOICE_MENU ||
                  se.type === SCENE_EVENTS.BATTLE
                    ? "span-all"
                    : ""
                }`}
              >
                <div className="flex">
                  <Button
                    onClick={() => {
                      const newScene = [...scene];
                      newScene.splice(i, 0, {
                        type: SCENE_EVENTS.TEXT_BOX,
                        ...DEFAULT_SCENE_EVENT_VALUES.TEXT_BOX,
                      });
                      setScene(newScene);
                    }}
                  >
                    Add Before
                  </Button>
                </div>

                <div className="flex">
                  <Select
                    data={Object.keys(SCENE_EVENTS)}
                    value={se.type}
                    placeholder="Type"
                    onChange={(value) =>
                      setScene(
                        scene.map((s, j) =>
                          j === i
                            ? {
                                type: value,
                                // @ts-expect-error
                                ...DEFAULT_SCENE_EVENT_VALUES[value],
                              }
                            : s
                        )
                      )
                    }
                  />
                  <Button
                    onClick={() => setScene(scene.filter((_, j) => j !== i))}
                  >
                    Delete
                  </Button>
                </div>

                {se.type === SCENE_EVENTS.TEXT_BOX && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <div className="flex">
                      <Select
                        data={Object.keys(PORTRAITS)}
                        value={se.portraitKey}
                        placeholder="Portrait"
                        onChange={(value) =>
                          setScene(
                            scene.map((s, j) =>
                              j === i ? { ...s, portraitKey: value || "" } : s
                            )
                          )
                        }
                      />
                      <Button
                        onClick={() =>
                          setScene(
                            scene.map((s, j) =>
                              j === i ? deleteMapEntry(s, "portraitKey") : s
                            )
                          )
                        }
                      >
                        None
                      </Button>
                    </div>
                    <Textarea
                      value={se.strings?.join("\n")}
                      autosize
                      onChange={(event) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  strings:
                                    event.currentTarget.value.split("\n"),
                                }
                              : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.ADD_CG && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <Input
                      value={se.imageKey}
                      placeholder="Image Key"
                      onChange={(event) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? { ...s, imageKey: event.currentTarget.value }
                              : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.REMOVE_CG && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <Input
                      value={se.imageKey}
                      placeholder="Image Key"
                      onChange={(event) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? { ...s, imageKey: event.currentTarget.value }
                              : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.CHOICE_MENU && (
                  <>
                    {se.choiceOptions?.map((choice, j) => (
                      <div key={j} className="box">
                        <div className="flex">
                          <Input
                            value={choice.text}
                            placeholder="Text"
                            onChange={(event) =>
                              setScene(
                                scene.map((s, k) =>
                                  k === i
                                    ? {
                                        ...s,
                                        choiceOptions: s.choiceOptions?.map(
                                          (c, l) =>
                                            l === j
                                              ? {
                                                  ...c,
                                                  text: event.currentTarget
                                                    .value,
                                                }
                                              : c
                                        ),
                                      }
                                    : s
                                )
                              )
                            }
                          />
                          <Button
                            onClick={() =>
                              setScene(
                                scene.map((s, k) =>
                                  k === i
                                    ? {
                                        ...s,
                                        choiceOptions: s.choiceOptions?.filter(
                                          (_, l) => l !== j
                                        ),
                                      }
                                    : s
                                )
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                        <SceneEditor
                          name={`Scene Events (${choice.scene.length})`}
                          scene={choice.scene}
                          flags={flags}
                          setScene={(value) =>
                            setScene(
                              scene.map((s, k) =>
                                k === i
                                  ? {
                                      ...s,
                                      choiceOptions: s.choiceOptions?.map(
                                        (c, l) =>
                                          l === j ? { ...c, scene: value } : c
                                      ),
                                    }
                                  : s
                              )
                            )
                          }
                        />
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  choiceOptions: [
                                    ...(s.choiceOptions || []),
                                    {
                                      text: "",
                                      scene: [],
                                    },
                                  ],
                                }
                              : s
                          )
                        )
                      }
                    >
                      Add Choice Option
                    </Button>
                  </>
                )}

                {se.type === SCENE_EVENTS.BATTLE && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <MultiSelect
                      data={Object.keys(BATTLE_UNITS)}
                      value={se.playerUnits}
                      placeholder="Player Units (need 2)"
                      onChange={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, playerUnits: value } : s
                          )
                        )
                      }
                    />
                    <Select
                      data={Object.keys(BATTLE_UNITS)}
                      value={se.enemy}
                      placeholder="Enemy"
                      onChange={(value) =>
                        value &&
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, enemy: value } : s
                          )
                        )
                      }
                    />
                    <SceneEditor
                      name={`Victory Scene (${se.victoryScene?.length})`}
                      flags={flags}
                      scene={se.victoryScene!}
                      setScene={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, victoryScene: value } : s
                          )
                        )
                      }
                    />
                    <SceneEditor
                      name={`Defeat Scene (${se.defeatScene?.length})`}
                      flags={flags}
                      scene={se.defeatScene!}
                      setScene={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, defeatScene: value } : s
                          )
                        )
                      }
                    />
                    <SceneEditor
                      name={`Run Scene (${se.runScene?.length})`}
                      flags={flags}
                      scene={se.runScene!}
                      setScene={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, runScene: value } : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.ADD_CHILD && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <Input
                      value={se.className}
                      placeholder="Class Name"
                      onChange={(event) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? { ...s, className: event.currentTarget.value }
                              : s
                          )
                        )
                      }
                    />
                    <div className="flex">
                      <Input
                        type="number"
                        value={se.x}
                        placeholder="X"
                        onChange={(event) =>
                          setScene(
                            scene.map((s, j) =>
                              j === i
                                ? { ...s, x: Number(event.currentTarget.value) }
                                : s
                            )
                          )
                        }
                      />
                      <Input
                        type="number"
                        value={se.y}
                        placeholder="Y"
                        onChange={(event) =>
                          setScene(
                            scene.map((s, j) =>
                              j === i
                                ? { ...s, y: Number(event.currentTarget.value) }
                                : s
                            )
                          )
                        }
                      />
                    </div>
                    <JSONEditor
                      value={se.config}
                      setValue={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, config: value } : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.REMOVE_CHILD && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <Input
                      value={se.childName}
                      placeholder="Child Name"
                      onChange={(event) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? { ...s, childName: event.currentTarget.value }
                              : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.ADD_FLAG && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <Select
                      data={flags}
                      value={se.addsFlag}
                      placeholder="Adds Flag"
                      onChange={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, addsFlag: value || "" } : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.MOOD && (
                  <MoodEditor
                    sceneEvent={se}
                    setSceneEvent={(value) =>
                      setScene(scene.map((s, j) => (j === i ? value : s)))
                    }
                  />
                )}

                {se.type === SCENE_EVENTS.FACE_DIRECTION && (
                  <FaceDirectionEditor
                    sceneEvent={se}
                    setSceneEvent={(value) =>
                      setScene(scene.map((s, j) => (j === i ? value : s)))
                    }
                  />
                )}

                {se.type === SCENE_EVENTS.PERSON_MOVES && (
                  <PersonMovesEditor
                    sceneEvent={se}
                    setSceneEvent={(value) =>
                      setScene(scene.map((s, j) => (j === i ? value : s)))
                    }
                  />
                )}

                {se.type === SCENE_EVENTS.WAIT && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <Input
                      type="number"
                      value={se.time}
                      placeholder="Time"
                      onChange={(event) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  time: Number(event.currentTarget.value),
                                }
                              : s
                          )
                        )
                      }
                    />
                  </>
                )}

                {se.type === SCENE_EVENTS.CHANGE_LEVEL && (
                  <>
                    <pre>{JSON.stringify(se, null, 2)}</pre>
                    <Select
                      data={LEVELS}
                      value={se.levelId}
                      placeholder="Level"
                      onChange={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i ? { ...s, levelId: value || "" } : s
                          )
                        )
                      }
                    />
                    <div className="flex">
                      <Input
                        type="number"
                        value={se.heroData!.position.x}
                        placeholder="X"
                        onChange={(event) =>
                          setScene(
                            scene.map((s, j) =>
                              j === i
                                ? {
                                    ...s,
                                    heroData: {
                                      ...s.heroData,
                                      position: {
                                        x: Number(event.currentTarget.value),
                                        y: s.heroData!.position.y,
                                      },
                                    } as HeroData,
                                  }
                                : s
                            )
                          )
                        }
                      />
                      <Input
                        type="number"
                        value={se.heroData!.position.y}
                        placeholder="Y"
                        onChange={(event) =>
                          setScene(
                            scene.map((s, j) =>
                              j === i
                                ? {
                                    ...s,
                                    heroData: {
                                      ...s.heroData,
                                      position: {
                                        x: s.heroData!.position.x,
                                        y: Number(event.currentTarget.value),
                                      },
                                    } as HeroData,
                                  }
                                : s
                            )
                          )
                        }
                      />
                    </div>
                    <Select
                      data={Object.keys(DIRECTIONS)}
                      value={se.heroData!.facingDirection}
                      placeholder="Facing Direction"
                      onChange={(value) =>
                        setScene(
                          scene.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  heroData: {
                                    ...s.heroData,
                                    facingDirection: value as Direction,
                                  } as HeroData,
                                }
                              : s
                          )
                        )
                      }
                    />
                  </>
                )}
              </div>
            ))}
            <div className="box">
              <Button
                onClick={() =>
                  setScene([
                    ...scene,
                    {
                      type: SCENE_EVENTS.TEXT_BOX,
                      ...DEFAULT_SCENE_EVENT_VALUES.TEXT_BOX,
                    },
                  ])
                }
              >
                Add Scene Event
              </Button>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

const MoodEditor = ({
  sceneEvent,
  setSceneEvent,
}: {
  sceneEvent: SceneEvent;
  setSceneEvent: (value: SceneEvent) => void;
}) => {
  const [editing, setEditing] = useState<"setTo" | "changeBy">(
    sceneEvent.setTo ? "setTo" : "changeBy"
  );
  const [inputValue, setInputValue] = useState(
    sceneEvent[editing === "setTo" ? "setTo" : "changeBy"]
  );

  useEffect(() => {
    if (editing === "setTo") {
      const newSceneEvent = deleteMapEntry(sceneEvent, "changeBy");
      setSceneEvent({ ...newSceneEvent, setTo: inputValue });
    }
    if (editing === "changeBy") {
      const newSceneEvent = deleteMapEntry(sceneEvent, "setTo");
      setSceneEvent({ ...newSceneEvent, changeBy: inputValue });
    }
  }, [editing]);

  useEffect(() => {
    setSceneEvent({
      ...sceneEvent,
      [editing === "setTo" ? "setTo" : "changeBy"]: inputValue,
    });
  }, [inputValue]);

  return (
    <>
      <pre>{JSON.stringify(sceneEvent, null, 2)}</pre>
      <Button.Group>
        <Button
          variant={editing === "setTo" ? "filled" : "outline"}
          onClick={() => setEditing("setTo")}
        >
          Set To
        </Button>
        <Button
          variant={editing === "changeBy" ? "filled" : "outline"}
          onClick={() => setEditing("changeBy")}
        >
          Change By
        </Button>
      </Button.Group>
      <Input
        type="number"
        value={inputValue}
        placeholder="Set To"
        onChange={(event) => {
          setInputValue(Number(event.currentTarget.value));
        }}
      />
    </>
  );
};

const FaceDirectionEditor = ({
  sceneEvent,
  setSceneEvent,
}: {
  sceneEvent: SceneEvent;
  setSceneEvent: (value: SceneEvent) => void;
}) => {
  const [editing, setEditing] = useState<"direction" | "targetName">(
    sceneEvent.direction ? "direction" : "targetName"
  );
  const [inputValue, setInputValue] = useState<Direction | string>(
    sceneEvent[editing === "direction" ? "direction" : "targetName"]!
  );

  useEffect(() => {
    if (editing === "direction") {
      const newSceneEvent = deleteMapEntry(sceneEvent, "targetName");
      setSceneEvent({ ...newSceneEvent, direction: DOWN });
      setInputValue(DOWN);
    }
    if (editing === "targetName") {
      const newSceneEvent = deleteMapEntry(sceneEvent, "direction");
      setSceneEvent({ ...newSceneEvent, targetName: "" });
      setInputValue("");
    }
  }, [editing]);

  useEffect(() => {
    setSceneEvent({
      ...sceneEvent,
      [editing === "direction" ? "direction" : "targetName"]: inputValue,
    });
  }, [inputValue]);

  return (
    <>
      <pre>{JSON.stringify(sceneEvent, null, 2)}</pre>
      <Input
        placeholder="Person Name"
        value={sceneEvent.personName}
        onChange={(event) =>
          setSceneEvent({
            ...sceneEvent,
            personName: event.currentTarget.value,
          })
        }
      />
      <Button.Group>
        <Button
          variant={editing === "direction" ? "filled" : "outline"}
          onClick={() => setEditing("direction")}
        >
          Direction
        </Button>
        <Button
          variant={editing === "targetName" ? "filled" : "outline"}
          onClick={() => setEditing("targetName")}
        >
          Target Name
        </Button>
      </Button.Group>
      {editing === "direction" ? (
        <Select
          data={Object.keys(DIRECTIONS)}
          value={inputValue as Direction}
          placeholder="Direction"
          onChange={(value) => setInputValue(value as Direction)}
        />
      ) : (
        <Input
          placeholder="Target Name"
          value={inputValue as string}
          onChange={(event) => setInputValue(event.currentTarget.value)}
        />
      )}
    </>
  );
};

const PersonMovesEditor = ({
  sceneEvent,
  setSceneEvent,
}: {
  sceneEvent: SceneEvent;
  setSceneEvent: (value: SceneEvent) => void;
}) => {
  const [editing, setEditing] = useState<"moveList" | "destinationPosition">(
    sceneEvent.moveList ? "moveList" : "destinationPosition"
  );
  const [inputValue, setInputValue] = useState<Direction[] | Vector2>(
    sceneEvent[editing === "moveList" ? "moveList" : "destinationPosition"]!
  );

  useEffect(() => {
    setSceneEvent({
      ...sceneEvent,
      [editing === "moveList" ? "moveList" : "destinationPosition"]: inputValue,
    });
  }, [inputValue]);

  return (
    <>
      <pre>{JSON.stringify(sceneEvent, null, 2)}</pre>
      <Input
        placeholder="Person Name"
        value={sceneEvent.personName}
        onChange={(event) =>
          setSceneEvent({
            ...sceneEvent,
            personName: event.currentTarget.value,
          })
        }
      />
      <Button.Group>
        <Button
          variant={sceneEvent.walkType === "walk" ? "filled" : "outline"}
          onClick={() => setSceneEvent({ ...sceneEvent, walkType: "walk" })}
        >
          Walk
        </Button>
        <Button
          variant={
            sceneEvent.walkType === "walkBackwards" ? "filled" : "outline"
          }
          onClick={() =>
            setSceneEvent({ ...sceneEvent, walkType: "walkBackwards" })
          }
        >
          Walk Backwards
        </Button>
      </Button.Group>
      <Button.Group>
        <Button
          variant={editing === "moveList" ? "filled" : "outline"}
          onClick={() => {
            setEditing("moveList");
            const newSceneEvent = deleteMapEntry(
              sceneEvent,
              "destinationPosition"
            );
            setSceneEvent({ ...newSceneEvent, moveList: [] });
            setInputValue([]);
          }}
        >
          Move List
        </Button>
        <Button
          variant={editing === "destinationPosition" ? "filled" : "outline"}
          onClick={() => {
            setEditing("destinationPosition");
            const newSceneEvent = deleteMapEntry(sceneEvent, "moveList");
            setSceneEvent({
              ...newSceneEvent,
              destinationPosition: { x: 0, y: 0 },
            });
            setInputValue({ x: 0, y: 0 });
          }}
        >
          Destination Position
        </Button>
      </Button.Group>
      {editing === "moveList" ? (
        <>
          <div className="flex">
            {Object.keys(DIRECTIONS).map((direction) => (
              <Button
                key={direction}
                onClick={() =>
                  setInputValue([
                    ...(inputValue as Direction[]),
                    direction,
                  ] as Direction[])
                }
              >
                {direction}
              </Button>
            ))}
          </div>
          <Button
            onClick={() =>
              setInputValue((inputValue as Direction[]).slice(0, -1))
            }
          >
            Undo
          </Button>
        </>
      ) : (
        <div className="flex">
          <Input
            type="number"
            value={(inputValue as Vector2).x}
            placeholder="X"
            onChange={(event) =>
              setInputValue({
                x: Number(event.currentTarget.value),
                y: (inputValue as Vector2).y,
              })
            }
          />
          <Input
            type="number"
            value={(inputValue as Vector2).y}
            placeholder="Y"
            onChange={(event) =>
              setInputValue({
                x: (inputValue as Vector2).x,
                y: Number(event.currentTarget.value),
              })
            }
          />
        </div>
      )}
    </>
  );
};

const JSONEditor = ({
  value,
  setValue,
}: {
  value: any;
  setValue: (value: any) => void;
}) => {
  const [textAreaValue, setTextAreaValue] = useState(
    JSON.stringify(value, null, 2)
  );

  return (
    <>
      <Textarea
        style={{ fontFamily: "var(--font-geist-mono)" }}
        value={textAreaValue}
        autosize
        onChange={(event) => setTextAreaValue(event.currentTarget.value)}
      />
      <Button
        onClick={() => {
          try {
            setValue(JSON.parse(textAreaValue));
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Update
      </Button>
    </>
  );
};

export default Home;
