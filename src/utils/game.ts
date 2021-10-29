import { GameEnvironment, GamePanelType } from "@/types/game";

export function showPanel(env: GameEnvironment, whichPanel: GamePanelType): GamePanelType[] {
  let panelList = [...env.panels];

  panelList = panelList.filter(panel => panel != whichPanel)
  panelList.unshift(whichPanel);

  console.log(panelList, whichPanel)

  return panelList;
}

export function isPanelVisible(env: GameEnvironment, whichPanel: GamePanelType): boolean {
  return env.panels[0] === whichPanel;
}