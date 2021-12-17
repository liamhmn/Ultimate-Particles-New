import testStage from "../testStages/first.js";
import StagePlayer from "./class/StagePlayer.js";

const stagePlayer = await new StagePlayer().load(testStage);
stagePlayer.play();

window.stagePlayer = stagePlayer;

function tick() {
  stagePlayer.tick();

  requestAnimationFrame(tick);
}
tick();
