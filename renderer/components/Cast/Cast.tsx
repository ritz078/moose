import React, { useCallback, useContext, useState } from "react";
import Icon from "@mdi/react";
import { mdiCast, mdiCastConnected, mdiCheck } from "@mdi/js";
import { ipcRenderer } from "electron";
import styles from "./Cast.module.scss";
import Popover from "react-tiny-popover";
import { SelectedCastContext } from "@contexts/SelectedCast";
import { CastEvents } from "../../../shared/constants/CastEvents";

export enum StreamingDevice {
  DLNA = 1,
  CHROMECAST,
}

interface IProps {
  type: StreamingDevice;
}

interface CastDevice {
  name: string;
  host: string;
}

export const Cast: React.FC<IProps> = () => {
  const [devices, setDevices] = useState<CastDevice[]>(null);
  const [show, setShow] = useState(false);
  const { setSelectedCast, selectedCast } = useContext(SelectedCastContext);

  const fetchAndOpen = useCallback(() => {
    (async function () {
      const _devices = await ipcRenderer.sendSync(CastEvents.LIST_DEVICES);
      console.log(_devices);
      setDevices(_devices);
      setShow(true);
    })();
  }, []);

  return (
    <Popover
      isOpen={show}
      position="bottom"
      onClickOutside={() => setShow(false)}
      content={() => (
        <div className={styles.wrapper}>
          {devices?.map((device) => (
            <div
              onClick={() => {
                const res = ipcRenderer.sendSync(
                  CastEvents.SET_CAST_DEVICE,
                  device.host
                );
                if (res) {
                  setSelectedCast(device.host);
                  setShow(false);
                }
              }}
              key={device.host}
            >
              {device.name}{" "}
              {selectedCast === device.host && (
                <Icon path={mdiCheck} size={0.8} color="#8bc34a" />
              )}
            </div>
          ))}
        </div>
      )}
    >
      <button onClick={fetchAndOpen}>
        <Icon
          path={selectedCast ? mdiCastConnected : mdiCast}
          title="Cast"
          size={0.72}
          color={selectedCast ? "#8edcff" : "#fff"}
        />
      </button>
    </Popover>
  );
};
