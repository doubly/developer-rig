import * as React from 'react';
import './component.sass';
import { Configurations, RigProject } from '../core/models/rig';
import classNames = require('classnames');
import { fetchChannelConfigurationSegments, fetchUser } from '../util/api';

export interface Props {
  configurations?: Configurations;
  rigProject: RigProject,
  userId: string;
  authToken: string;
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
  fetchStatus: string;
  [key: string]: ConfigurationType | string;
}

export class ConfigurationServiceView extends React.Component<Props, State>{
  public state: State = {
    version: this.props.configurations && this.props.configurations.globalSegment && this.props.configurations.globalSegment.version || '',
    configurationType: ConfigurationType.Global,
    channelId: '',
    configuration: this.props.configurations && this.props.configurations.globalSegment && this.props.configurations.globalSegment.content || '',
    fetchStatus: '',
  };

  private onChange = (input: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = input.currentTarget;
    this.setState({ [name]: value });
  }

  private onChangeConfigurationType = (input: React.FormEvent<HTMLSelectElement>) => {
    const { name, value } = input.currentTarget;
    this.setState({ [name]: value });
    if (value === ConfigurationType.Global) {
      const { content, version } = this.props.configurations.globalSegment;
      this.setState({ configuration: content, version });
    }
  }

  private fetchChannelConfiguration = async () => {
    let channelId = this.state.channelId.trim();
    if (channelId) {
      this.setState({ fetchStatus: 'fetching...' });
      try {
        if (isNaN(Number(channelId))) {
          // Assume it's a channel (user) name.  Get the channel ID, if any.
          const user = await fetchUser(this.props.authToken, channelId);
          if (user) {
            channelId = user.id;
          } else {
            throw new Error(`Cannot fetch user "${channelId}"`);
          }
        }
        let segmentMap = this.props.configurations.channelSegments[channelId];
        if (!segmentMap) {
          const { rigProject: { manifest: { id: clientId }, secret }, userId } = this.props;
          segmentMap = await fetchChannelConfigurationSegments(clientId, userId, channelId, secret);
        }
        const segment = this.state.configurationType === ConfigurationType.Broadcaster ?
          segmentMap.broadcaster : segmentMap.developer;
        const { content, version } = segment || { content: '', version: '' };
        this.setState({ configuration: content, version });
        this.setState({ fetchStatus: '' });
      } catch (ex) {
        this.setState({ fetchStatus: ex.message });
      }
    }
  }

  private canSave = (): boolean => {
    const { channelId, configurationType } = this.state;
    if (configurationType !== ConfigurationType.Global && !channelId.trim()) {
      // The non-global configuration segments need a channel ID.
      return false;
    }
    return true;
  }

  private save = () => {
    if (this.canSave()) {
      this.props.saveHandler(this.state.configuration.trim());
    }
  }

  private viewDocumentation() {
    window.open('https://dev.twitch.tv/docs/extensions/building/#configuration-service', 'developer-rig-help');
  }

  private viewTutorial() {
    window.open('https://www.twitch.tv/videos/320483709', 'developer-rig-help');
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
    const extensionUrl = `https://dev.twitch.tv/projects/${this.props.rigProject.manifest.id}/files`;
    return (
      <div className="configuration-service-view">
        <div className="configuration-service-view__section configuration-service-view__section--left">
          <label className="configuration-service-view-property">
            <div className="configuration-service-view-property__name">Configuration Type</div>
            <select className="configuration-service-view-property__select" name="configurationType" value={this.state.configurationType} onChange={this.onChangeConfigurationType}>
              <option value={ConfigurationType.Broadcaster}>Broadcaster</option>
              <option value={ConfigurationType.Developer}>Developer</option>
              <option value={ConfigurationType.Global}>Global</option>
            </select>
          </label>
          {this.state.configurationType !== ConfigurationType.Global && <>
            <label className="configuration-service-view-property">
              <div className="configuration-service-view-property__name">Channel Name</div>
              <input className={channelClassName} type="text" name="channelId" value={this.state.channelId} onChange={this.onChange} />
            </label>
            <button className="configuration-service-view__button" onClick={this.fetchChannelConfiguration}>Fetch</button>
            <span>{this.state.fetchStatus}</span>
          </>}
          <label className="configuration-service-view-property">
            <div className="configuration-service-view-property__name">Configuration</div>
            <textarea className={configurationClassName} name="configuration" value={this.state.configuration} onChange={this.onChange} />
          </label>
          <label className="configuration-service-view-property">
            <div className="configuration-service-view-property__name">Version</div>
            <input className={versionClassName} type="text" name="version" value={this.state.version} onChange={this.onChange} />
          </label>
          {false && <>
            <button className="configuration-service-view__button" onClick={this.save}>Save</button>
            <button className="configuration-service-view__button">Cancel</button>
          </>}
        </div>
        <div className="configuration-service-view__vertical-bar" />
        <div className="configuration-service-view__section configuration-service-view__section--right">
          <div className="configuration-service-view__title">Using the Configuration Service</div>
          <p className="configuration-service-view__text">The Configuration Service can be used in
            your extension by leveraging specific APIs in the Extension Helper Library.</p>
          <p className="configuration-service-view__text">To access, view, and directly edit your
            data in the Rig, pick Broadcaster, Developer, or Global, and if appropriate, search
            for a specific broadcaster who has installed your extension.  Alternatively, when
            testing your extension in the Extension Views tab, your extension front-end will be
            able to access the object returned by the Configuration Service on extension load.</p>
          <p className="configuration-service-view__text">Having Trouble?  Make sure you’re set to
            use Hosted Configuration
            on <a href={extensionUrl} target="dev-site">your Extension Capabilities page</a>.
            Also you might need to refresh your Extension Manifest in the Rig (you can do so on
            the Project Tab).  Happy Coding!</p>
          <button className="configuration-service-view__button configuration-service-view__button--first" onClick={this.viewTutorial}>View Tutorial</button>
          <button className="configuration-service-view__button" onClick={this.viewDocumentation}>Go to Documentation</button>
        </div>
      </div>
    );
  }
}
