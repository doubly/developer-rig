import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ConfigurationServiceView } from './component';
import { createExtensionManifestForTest } from '../tests/constants/extension';

let globalAny = global as any;

describe('<ConfigurationServiceView />', () => {
  const setupShallow = setupShallowTest(ConfigurationServiceView, () => ({
    rigProject: {
      extensionViews: [],
      isLocal: true,
      projectFolderPath: 'test',
      manifest: createExtensionManifestForTest(),
      secret: 'test',
      frontendFolderName: 'test',
      frontendCommand: 'test',
      backendCommand: 'test',
    },
    userId: '999999999',
    saveHandler: jest.fn(),
  }));

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('invokes change handler', () => {
    const { wrapper } = setupShallow();
    const instance = wrapper.instance() as ConfigurationServiceView;
    const [name, value] = ['version', 'value'];
    wrapper.find('input[name="' + name + '"]').simulate('change', { currentTarget: { name, value } });
    wrapper.update();
    expect(instance.state[name]).toEqual(value);
  });

  it('has nothing to parse and save', () => {
    const { wrapper } = setupShallow();
    const instance = wrapper.instance() as ConfigurationServiceView;
    wrapper.find('.configuration-service-view__button').first().simulate('click');
    expect(instance.props.saveHandler).not.toHaveBeenCalled();
  });

  it('fails parse and save', () => {
    const { wrapper } = setupShallow();
    const instance = wrapper.instance() as ConfigurationServiceView;
    ['channelId', 'configuration', 'version'].forEach((name) => {
      const selector = name === 'configuration' ? 'textarea' : `input[name="${name}"]`;
      wrapper.find(selector).simulate('change', { currentTarget: { name, value: '{-}' } });
    });
    wrapper.update();
    wrapper.find('.configuration-service-view__button').first().simulate('click');
    expect(instance.props.saveHandler).not.toHaveBeenCalled();
  });

  it('invokes save handler', () => {
    const { wrapper } = setupShallow();
    const instance = wrapper.instance() as ConfigurationServiceView;
    ['channelId', 'configuration', 'version'].forEach((name) => {
      const selector = name === 'configuration' ? 'textarea' : `input[name="${name}"]`;
      wrapper.find(selector).simulate('change', { currentTarget: { name, value: '{}' } });
    });
    wrapper.update();
    wrapper.find('.configuration-service-view__button').first().simulate('click');
    expect(instance.props.saveHandler).toHaveBeenCalledTimes(1);
  });

  it('invokes cancel', () => {
    const { wrapper } = setupShallow();
    const instance = wrapper.instance() as ConfigurationServiceView;
    wrapper.find('.configuration-service-view__button').at(1).simulate('click');
  });

  it('opens documentation window', () => {
    globalAny.open = jest.fn();
    const { wrapper } = setupShallow();
    wrapper.find('.configuration-service-view__button').last().simulate('click');
    expect(globalAny.open).toHaveBeenCalledWith('https://dev.twitch.tv/docs/extensions/', 'developer-rig-help');
  });

  it('opens tutorial window', () => {
    globalAny.open = jest.fn();
    const { wrapper } = setupShallow();
    wrapper.find('.configuration-service-view__button').at(2).simulate('click');
    expect(globalAny.open).toHaveBeenCalledWith('https://www.twitch.tv/videos/239080621', 'developer-rig-help');
  });
});
