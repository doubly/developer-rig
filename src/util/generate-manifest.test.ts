import { generateManifest } from './generate-manifest';
import { ExtensionViewType } from '../constants/extension-coordinator';

describe('generateManifest', () => {
  it('generates a Manifest we expect', () => {
    const baseUri = 'https://test:8080', ownerName = 'ownerName', name = 'name';
    const types = [ExtensionViewType.Component, ExtensionViewType.Mobile, ExtensionViewType.Overlay, ExtensionViewType.Panel];
    const actual = generateManifest(baseUri, ownerName, name, types);
    const expected = {
      authorName: "ownerName",
      bitsEnabled: false,
      description: "This is a local-mode extension project, name",
      hasChatSupport: false,
      iconUrls: {
        "100x100": "https://media.forgecdn.net/avatars/158/128/636650453584584748.png",
      },
      id: actual.id,
      name: "name",
      requestIdentityLink: false,
      sku: "",
      state: "Testing",
      summary: "Summary for name",
      vendorCode: "",
      version: "0.0.1",
      views: {
        component: {
          aspectHeight: 4000,
          aspectWidth: 3000,
          canLinkExternalContent: false,
          size: 0,
          viewerUrl: "https://test:8080/video_component.html",
          zoom: true,
          zoomPixels: 1024,
        },
        config: {
          canLinkExternalContent: false,
          viewerUrl: "https://test:8080/config.html",
        }, liveConfig: {
          canLinkExternalContent: false,
          viewerUrl: "https://test:8080/live_config.html",
        },
        mobile: {
          viewerUrl: "https://test:8080/mobile.html",
        },
        panel: {
          canLinkExternalContent: false,
          height: 300,
          viewerUrl: "https://test:8080/panel.html",
        },
        videoOverlay: {
          canLinkExternalContent: false,
          viewerUrl: "https://test:8080/video_overlay.html",
        },
      },
      whitelistedConfigUrls: [] as string[],
      whitelistedPanelUrls: [] as string[],
    };
    expect(actual).toEqual(expected);
  });
});
