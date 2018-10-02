import * as React from 'react';
import './component.sass';
import { RigProject } from '../core/models/rig';
import classNames = require('classnames');

export interface Props {
  rigProject: RigProject,
  userId: string;
  saveHandler: (configuration: string) => void,
}

enum ConfigurationType {
  Broadcaster = 'broadcaster',
  Developer = 'developer',
  Global = 'global',
}

interface State {
  version: string;
  configurationType: ConfigurationType;
  channelId: string;
  configuration: string;
  [key: string]: ConfigurationType | string;
}

export class ConfigurationServiceView extends React.Component<Props, State>{
  public state: State = {
    version: this.props.rigProject.manifest.version,
    configurationType: ConfigurationType.Broadcaster,
    channelId: '',
    configuration: '',
  };

  private onChange = (input: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = input.currentTarget;
    this.setState({ [name]: value });
  }

  private canSave = (): boolean => {
    const { channelId, configuration, configurationType, version } = this.state;
    if (configurationType !== ConfigurationType.Global && !channelId.trim()) {
      // The non-global configuration segments need a channel ID.
      return false;
    }
    if (configuration.trim().startsWith('{') && version.trim()) {
      try {
        JSON.parse(this.state.configuration);
        return true;
      } catch (ex) {
        // Fall out to exit with a failure.
      }
    }
    return false;
  }

  private save = () => {
    if (this.canSave()) {
      this.props.saveHandler(this.state.configuration.trim());
    }
  }

  private viewDocumentation() {
    window.open('https://dev.twitch.tv/docs/extensions/', 'developer-rig-help');
  }

  private viewTutorial() {
    window.open('https://www.twitch.tv/videos/239080621', 'developer-rig-help');
  }

  public render() {
    const versionClassName = classNames('configuration-service-view-property__input', {
      'configuration-service-view-property__input--error': !this.state.version.trim(),
    });
    const channelClassName = classNames('configuration-service-view-property__input', {
      'configuration-service-view-property__input--error': !this.state.channelId.trim(),
    });
    const configurationClassName = classNames('configuration-service-view-property__input', {
      'configuration-service-view-property__input--error': !this.state.configuration.trim(),
    });
    return (
      <div className="configuration-service-view">
        <div className="configuration-service-view__section configuration-service-view__section--left">
          <label className="configuration-service-view-property">
            <div className="configuration-service-view-property__name">Extension Version</div>
            <input className={versionClassName} type="text" name="version" value={this.state.version} onChange={this.onChange} />
          </label>
          <label className="configuration-service-view-property">
            <div className="configuration-service-view-property__name">Configuration Type</div>
            <select className="configuration-service-view-property__select" name="configurationType" value={this.state.configurationType} onChange={this.onChange}>
              <option value={ConfigurationType.Broadcaster}>Broadcaster</option>
              <option value={ConfigurationType.Developer}>Developer</option>
              <option value={ConfigurationType.Global}>Global</option>
            </select>
          </label>
          {this.state.configurationType !== ConfigurationType.Global && <label className="configuration-service-view-property">
            <div className="configuration-service-view-property__name">Channel</div>
            <input className={channelClassName} type="text" name="channelId" value={this.state.channelId} onChange={this.onChange} />
          </label>}
          <label className="configuration-service-view-property">
            <div className="configuration-service-view-property__name">Configuration</div>
            <textarea className={configurationClassName} name="configuration" value={this.state.configuration} onChange={this.onChange} />
          </label>
          <button className="configuration-service-view__button" onClick={this.save}>Save</button>
          <button className="configuration-service-view__button">Cancel</button>
        </div>
        <div className="configuration-service-view__vertical-bar" />
        <div className="configuration-service-view__section configuration-service-view__section--right">
          <div className="configuration-service-view__title">Using the Configuration Service</div>
          <p className="configuration-service-view__text">The Configuration Service can be used in
            your extension by leveraging specific APIs in the extension Helper.</p>
          <p className="configuration-service-view__text">To access your data in the rig, choose
            your version number, pick broadcaster or extension, and if appropriate search for a
            specific broadcaster who has installed your extension.</p>
          <p className="configuration-service-view__text">You can edit your data in the panel, but
            be careful if this is live data.</p>
          <button className="configuration-service-view__button configuration-service-view__button--first" onClick={this.viewTutorial}>View Tutorial</button>
          <button className="configuration-service-view__button" onClick={this.viewDocumentation}>Go to Documentation</button>
        </div>
      </div>
    );
  }
}
