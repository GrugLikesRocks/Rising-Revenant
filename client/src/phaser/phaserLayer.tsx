import { useEffect } from "react";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { store } from "../store/store";
import { usePhaserLayer } from "../hooks/usePhaserLayer";

import { MenuState } from "../ui/components/navbar";

type Props = {
  networkLayer: NetworkLayer | null;
  menuState: MenuState; 
};

// TODO: this is where we need to set the burner account from local storage.

export const PhaserLayer = ({ networkLayer }: Props) => {
  const { phaserLayer, ref } = usePhaserLayer({ networkLayer });

  useEffect(() => {
    if (phaserLayer) {
      store.setState({ phaserLayer });

      console.log("Setting phaser layer");
    }
  }, [phaserLayer]);

  return (
    <div>
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: "-2",
        }}
      />
    </div>
  );
};
