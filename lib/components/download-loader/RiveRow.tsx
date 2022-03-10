import React, { useEffect } from 'react';
import { useRive, useStateMachineInput, StateMachineInput } from 'rive-react';
import './RiveRow.css';

const STATE_MACHINE_NAME = 'loadingMachine';

interface RiveRowProps {
  isDownloadingAll: boolean;
}

const RiveRow: React.FC<RiveRowProps> = ({ isDownloadingAll, children }) => {
  const { rive: riveInstance, RiveComponent: DownloadComponent } = useRive({
    src: 'box-loader.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  const isHovered: StateMachineInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isHovered'
  );
  const isLoading: StateMachineInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isLoading'
  );
  const trigClicked: StateMachineInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isClicked'
  );
  const numLoadingPercent: StateMachineInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'loadingPercent'
  );

  // Simulate a download loading sequence
  const simulateLoading = () => {
    if (isLoading && numLoadingPercent) {
      isLoading.value = true;
      trigClicked.fire();
      const mockLoadInterval = setInterval(function () {
        if (numLoadingPercent.value >= 100) {
          clearInterval(mockLoadInterval);
          isLoading.value = false;
        }
        if (numLoadingPercent && numLoadingPercent.value < 100) {
          (numLoadingPercent.value as number) += 10;
        }
      }, 300);
    }
  };

  useEffect(() => {
    if (
      isDownloadingAll &&
      !isLoading?.value &&
      numLoadingPercent?.value <= 0
    ) {
      simulateLoading();
    }
  }, [isDownloadingAll]);

  const onHovering = () => {
    if (numLoadingPercent?.value < 100) {
      isHovered.value = true;
    }
  };

  const onLeaving = () => {
    if (numLoadingPercent?.value < 100) {
      isHovered.value = false;
    }
  };

  const onClick = () => {
    if (!isLoading.value) {
      simulateLoading();
    }
  };

  return (
    <div className="row">
      <h1>{children}</h1>
      <DownloadComponent
        className="rive-component"
        onMouseOver={onHovering}
        onMouseLeave={onLeaving}
        onClick={onClick}
      />
    </div>
  );
};

export default RiveRow;
