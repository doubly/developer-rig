import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { Console } from './component';

const propGenerator = () => ({});
const setupShallow = setupShallowTest(Console, propGenerator);

describe('<Console />', () => {
  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wrapper.update();
        try {
          expect(wrapper).toMatchSnapshot();
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('calling window.rig.update correctly updates the console.', () => {
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wrapper.update();
        try {
          expect(wrapper.children().length).toEqual(0);
          window.rig.history = [
            {
              log: 'test',
              frame: 'test-frame',
            },
          ];
          window.rig.update();
          wrapper.update();
          expect(wrapper.children().length).toEqual(1);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('renders log messages correctly', () => {
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wrapper.update();
        try {
          wrapper.setState({
            logHistory: [
              {
                log: 'test',
                frame: 'test-frame',
              },
            ],
          });
          wrapper.update();
          expect(wrapper.childAt(0).text()).toEqual('test-frame $ test');
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });
});
