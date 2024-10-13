import { useParams } from "react-router-dom";

import { Cards } from "../../components/Cards/Cards";

export function GamePage() {
  const { pairsCount } = useParams();
  const lives = parseInt(new URLSearchParams(window.location.search).get('lives'), 10);

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5} lives={lives} />
    </>
  );
}
