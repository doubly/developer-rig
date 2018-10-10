import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ConfigurationServiceView } from './component';
import { createExtensionManifestForTest } from '../tests/constants/extension';

const globalAny = global as any;

function mockApiFunctions() {
  const original = require.requireActual('../util/api');
  return {
    ...original,
    fetchChannelConfigurationSegments: jest.fn().mockImplementation(() => Promise.resolve({})),
    fetchUser: jest.fn().mockImplementation(() => Promise.resolve({ id: '999999999' })),
  }
}
jest.mock('../util/api', () => mockApiFunctions());
const api = require.requireMock('../util/api');

localStorage.setItem('rigLogin', JSON.stringify({ authToken: 1 }));

describe('<ConfigurationServiceView />', () => {
  const setupShallow = setupShallowTest(ConfigurationServiceView, () => ({
    authToken: 'authToken',
    configurations: {
      channelSegments: {},
      globalSegment: {
        content: '',
        version: '',
      },
    },
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
    userId: '265737932',
    saveHandler: jest.fn(),
  }));

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('fetches channel configuration', async () => {
    const { wrapper } = setupShallow();
    wrapper.find('select').simulate('change', { currentTarget: { name: 'configurationType', value: 'developer' } });
    wrapper.find('input[name="channelId"]').simulate('change', { currentTarget: { name: 'channelId', value: 'developerrig' } });
    wrapper.update();
    wrapper.find('.configuration-service-view__button').first().simulate('click');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(api.fetchUser).toHaveBeenCalledTimes(1);
          expect(api.fetchChannelConfigurationSegments).toHaveBeenCalledTimes(1);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('invokes configuration type change handler', () => {
    const { wrapper } = setupShallow();
    const instance = wrapper.instance() as ConfigurationServiceView;
    const [name, value] = ['configurationType', 'global'];
    wrapper.find('select').simulate('change', { currentTarget: { name, value } });
    wrapper.update();
    expect(instance.state[name]).toEqual(value);
  });

  it('opens documentation window', () => {
    globalAny.open = jest.fn();
    const { wrapper } = setupShallow();
    wrapper.find('.configuration-service-view__button').last().simulate('click');
    expect(globalAny.open).toHaveBeenCalledWith('https://dev.twitch.tv/docs/extensions/building/#configuration-service', 'developer-rig-help');
  });

  it('opens tutorial window', () => {
    globalAny.open = jest.fn();
    const { wrapper } = setupShallow();
    wrapper.find('.configuration-service-view__button').first().simulate('click');
    expect(globalAny.open).toHaveBeenCalledWith('https://www.twitch.tv/videos/320483709', 'developer-rig-help');
  });
});
