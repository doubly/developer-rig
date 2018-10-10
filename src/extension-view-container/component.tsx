import * as React from 'react';
import './component.sass';
import classNames = require('classnames');
import { Console } from '../console';
import { ExtensionMode } from '../constants/extension-coordinator';
import { ExtensionView } from '../extension-view';
import { ExtensionViewButton } from '../extension-view-button';
import { RigExtensionView } from '../core/models/rig';
import { ExtensionManifest } from '../core/models/manifest';
import { createExtensionObject } from '../util/extension';

interface Props {
  isDisplayed: boolean;
  extensionViews: RigExtensionView[];
  isLocal: boolean;
  manifest: ExtensionManifest;
  secret: string;
  deleteExtensionViewHandler: (id: string) => void;
  openEditViewHandler?: (id: string) => void;
  openExtensionViewHandler: Function;
}

interface State {
  mockTriggersEnabled: boolean;
}

const ConfigNames: { [key: string]: string; } = {
  [ExtensionMode.Config]: 'Broadcaster Configuration',
  [ExtensionMode.Dashboard]: 'Broadcaster Live Dashboard',
};

export class ExtensionViewContainer extends React.Component<Props, State> {
  public state: State = {
    mockTriggersEnabled: false,
  };

  private openExtensionViewDialog = () => {
    this.props.openExtensionViewHandler();
  }

  private toggleMockTriggers = () => {
    this.setState((previousState) => ({ mockTriggersEnabled: !previousState.mockTriggersEnabled }));
  }

  public render() {
    let extensionViews: JSX.Element[] = [];
    if (this.props.extensionViews && this.props.extensionViews.length > 0) {
      extensionViews = this.props.extensionViews.map((view, index) => {
        const linkedUserId = view.linked ? view.linkedUserId : '';
        const extension = createExtensionObject(this.props.manifest, index.toString(), view.role,
          linkedUserId, view.channelId, this.props.secret, view.opaqueId);
        return (
          <ExtensionView
            key={view.id}
            id={view.id}
            channelId={view.channelId}
            extension={extension}
            installationAbilities={view.features}
            type={view.type}
            mode={view.mode}
            role={view.mode === ExtensionMode.Viewer ? view.role : ConfigNames[view.mode]}
            frameSize={view.frameSize}
            position={{ x: view.x, y: view.y }}
            linked={view.linked}
            isLocal={this.props.isLocal}
            isPopout={view.isPopout}
            orientation={view.orientation}
            openEditViewHandler={this.props.openEditViewHandler}
            deleteViewHandler={this.props.deleteExtensionViewHandler}
            mockApiEnabled={this.state.mockTriggersEnabled}
          />
        );
      });
    }
    const [switchClassName, handleClassName, checkClassName] = ['', '-handle', '-check'].map((suffix) => {
      const root = "trigger-bar__switch" + suffix;
      return classNames(root, {
        [`${root}--on`]: this.state.mockTriggersEnabled,
      });
    });
    const wrapperClassName = classNames('view-container-wrapper', {
      'view-container-wrapper--hidden': !this.props.isDisplayed,
    });
    return (
      <div className={wrapperClassName}>
        <div className="trigger-bar">
          <svg version="1.1" viewBox="0 0 44 20" height="20" width="44">
            <g onClick={this.toggleMockTriggers}>
              <rect className={switchClassName} rx="2" ry="2" x="0.5" y="0.5" height="19" width="43" />
              <path className={checkClassName} d="m 6.5,9 4,4 6,-6 -1,-1 -5,5 -3,-3 z" />
              <rect className={handleClassName} rx="2" ry="2" x="0.5" y="0.5" height="19" width="21" />
            </g>
          </svg>
          <div className="trigger-bar__text">Use Mock Triggers</div>
        </div>
        <div className="view-container">
          {extensionViews}
        </div>
        <div>
          <ExtensionViewButton
            onClick={this.openExtensionViewDialog}>
          </ExtensionViewButton>
        </div>
        <Console />
      </div>
    );
  }
}
