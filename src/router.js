import { createBrowserRouter } from "react-router-dom";
import { GamePage } from "./pages/GamePage/GamePage";
import { SelectLevelPage } from "./pages/SelectLevelPage/SelectLevelPage";
import { Leaderboard } from "./pages/Leaderboard/Leaderboard"

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <SelectLevelPage />,
      // children: [
      // {
      //   path: "/leaderboard",
      //   element: <Leaderboard />,
      // },
      // ],
    },
    {
      path: "/game/:pairsCount",
      element: <GamePage />,
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />,
    },
  ],
  /**
   * basename нужен для корректной работы в gh pages
   * он же указан в homepage package.json и в index.html
   */
  { basename: "/react-memo" },
);
