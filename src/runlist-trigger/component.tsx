import * as React from 'react';
import './component.sass';
import classNames = require('classnames');
import { ExtensionAction } from '../constants/extension-coordinator';
import { RunList, GenericResponse } from '../core/models/run-list';

export interface PublicProps {
  runList: RunList;
  iframe?: HTMLIFrameElement;
}

enum TriggerState {
  Hidden = 0,
  Visible = 1,
  Fading = 2,
}

interface State {
  triggerState: number;
  selectedTrigger: string;
  runListTriggerMap: {
    [key: string]: GenericResponse;
  };
  triggerTypeMap: {
    [key: string]: string;
  }
}

type Props = PublicProps;

export class RunListTrigger extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);

    this.state = {
      ...this.stateFromRunList(this.props.runList),
    }
  }

  public onChange(event: React.FormEvent<HTMLSelectElement>) {
    this.setState({
      selectedTrigger: event.currentTarget.value,
      triggerState: TriggerState.Hidden,
    });
  }

  private stateFromRunList(runList: RunList): State {
    let firstTrigger;
    let runlistMap: { [key: string]: GenericResponse } = {}
    let triggerMap: { [key: string]: string } = {}
    for (let callback in runList) {
      for (let resp of runList[callback]) {
        if (!firstTrigger) {
          firstTrigger = resp.name;
        }
        runlistMap[resp.name] = resp;
        triggerMap[resp.name] = callback;
      }
    }

    return {
      triggerState: TriggerState.Hidden,
      selectedTrigger: firstTrigger,
      runListTriggerMap: runlistMap,
      triggerTypeMap: triggerMap,
    }
  }

  private dataFromTrigger(trigger: string) {
    let data = undefined;

    const response = Object.assign({}, this.state.runListTriggerMap[trigger]);
    delete response.name;

    switch (this.state.triggerTypeMap[trigger]) {
      case 'onContext':
        data = {
          action: ExtensionAction.TwitchExtContext,
          context: response,
        }
        break;
      case 'onAuthorized':
        data = {
          action: ExtensionAction.TwitchExtAuth,
          auth: response,
        }
        break;
    }
    return data;
  }

  private triggerRunlistResponse(iframe?: HTMLIFrameElement) {
    const data = this.dataFromTrigger(this.state.selectedTrigger);
    if (data && iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, '*');
      this.setState({ triggerState: TriggerState.Visible });
    }
  }

  private renderRunListOptions(runList: RunList): JSX.Element[] {
    let opts = [];
    for (let callback in runList) {
      for (let resp of runList[callback]) {
        opts.push(
          <option key={resp.name}>
            {resp.name}
          </option>
        )
      }
    }
    return opts;
  }

  public render() {
    const textClassName = classNames('runlist-trigger__text', {
      'runlist-trigger__text--on': this.state.triggerState === TriggerState.Visible,
      'runlist-trigger__text--fading': this.state.triggerState === TriggerState.Fading,
    });
    if (this.state.triggerState === TriggerState.Visible) {
      setTimeout(() => {
        this.setState({ triggerState: TriggerState.Fading });
      });
    }
    return (
      <div className='runlist-trigger'>
        <div className={textClassName}>[Response Recieved]</div>
        <select className='runlist-trigger__select' onChange={(e) => this.onChange(e)}>
          {this.renderRunListOptions(this.props.runList)}
        </select>
        <button className='runlist-trigger__button' onClick={() => this.triggerRunlistResponse(this.props.iframe)}>Trigger</button>
      </div>
    );
  }
}
