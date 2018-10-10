import { ExtensionAnchor, ExtensionPlatform } from '../../constants/extension-coordinator';

export interface ExtensionManifest {
  authorName: string;
  bitsEnabled: boolean;
  configurationLocation: string;
  description: string;
  hasChatSupport: boolean;
  iconUrls: {
    '100x100': string;
    '24x24'?: string;
    '300x200'?: string;
  };
  id: string;
  name: string;
  requestIdentityLink: boolean;
  sku: string;
  state: string;
  summary: string;
  vendorCode: string;
  version: string;
  views: {
    component?: {
      aspectHeight: number;
      aspectWidth: number;
      canLinkExternalContent: boolean;
      size: number;
      viewerUrl: string;
      zoom: boolean;
      zoomPixels: number;
    };
    config?: {
      canLinkExternalContent: boolean;
      viewerUrl: string;
    };
    hidden?: {
      canLinkExternalContent: boolean;
      viewerUrl: string;
    };
    liveConfig?: {
      canLinkExternalContent: boolean;
      viewerUrl: string;
    };
    mobile?: {
      viewerUrl: string;
    };
    panel?: {
      canLinkExternalContent: boolean;
      height: number;
      viewerUrl: string;
    };
    videoOverlay?: {
      canLinkExternalContent: boolean;
      viewerUrl: string;
    };
  };
  whitelistedConfigUrls: string[];
  whitelistedPanelUrls: string[];
}

export function getSupportedAnchors(views: ExtensionCoordinator.ExtensionViews): ExtensionAnchor[] {
  const anchors = [];
  if (views.videoOverlay && views.videoOverlay.viewerUrl) {
    anchors.push(ExtensionAnchor.Overlay);
  }

  if (views.panel && views.panel.viewerUrl) {
    anchors.push(ExtensionAnchor.Panel);
  }

  if (views.component && views.component.viewerUrl) {
    anchors.push(ExtensionAnchor.Component);
  }

  return anchors;
}

export function getSupportedPlatforms(views: ExtensionCoordinator.ExtensionViews): ExtensionPlatform[] {
  const platforms = [ExtensionPlatform.Web];

  if (views.mobile && views.mobile.viewerUrl) {
    platforms.push(ExtensionPlatform.Mobile);
  }

  return platforms;
}
