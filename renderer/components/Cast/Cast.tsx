import React, { useCallback, useContext, useState } from "react";
import Icon from "@mdi/react";
import { mdiCast, mdiCastConnected, mdiCastOff, mdiCheck } from "@mdi/js";
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

export interface CastDevice {
  name: string;
  host: string;
}

export const Cast: React.FC<IProps> = () => {
  const [devices, setDevices] = useState<CastDevice[]>(null);
  const [show, setShow] = useState(false);
  const { setSelectedCast, selectedCast } = useContext(SelectedCastContext);

  const fetchAndOpen = useCallback(() => {
    if (show) {
      setShow(false);
      return;
    }
    (async function () {
      const _devices = await ipcRenderer.sendSync(CastEvents.LIST_DEVICES);
      setDevices(_devices);
      setShow(true);
    })();
  }, [show]);

  return (
    <>
      <Popover
        isOpen={show}
        position="bottom"
        onClickOutside={() => setShow(false)}
        content={() => (
          <div className={styles.wrapper}>
            {devices?.length ? (
              devices.map((device) => (
                <div
                  className={styles.list}
                  onClick={() => {
                    const deselect = device.host === selectedCast?.host;
                    const res = ipcRenderer.sendSync(
                      CastEvents.SET_CAST_DEVICE,
                      deselect ? null : device.host
                    );
                    if (res) {
                      setSelectedCast(deselect ? null : device);
                      setShow(false);
                    }
                  }}
                  key={device.host}
                >
                  {device.name}{" "}
                  {selectedCast?.host === device.host && (
                    <Icon path={mdiCheck} size={0.8} color="#8bc34a" />
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noCast}>
                <Icon path={mdiCastOff} size={1} />
                <span>No cast devices found.</span>
              </div>
            )}
          </div>
        )}
      >
        {(ref) => (
          <button ref={ref} onClick={fetchAndOpen} title="Cast">
            <Icon
              path={selectedCast ? mdiCastConnected : mdiCast}
              size={0.72}
              color={selectedCast ? "#8edcff" : "#fff"}
            />
          </button>
        )}
      </Popover>
    </>
  );
};
