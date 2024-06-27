import { theme } from 'antd';
import { ThemeConfig } from 'antd/es/config-provider/context';
import colorScheme from './colorScheme';

const { defaultAlgorithm } = theme;
const {
  textColor,
  surfaceColor,
  primaryColor,
  whiteColor,
  defaultGrey,
  hoverColor,
  redPrimary,
  inActiveGrey
} = colorScheme;
const instance: ThemeConfig = {
  algorithm: [defaultAlgorithm],
  token: {
    fontFamily: 'Inter',
    colorText: textColor,
    colorBgLayout: surfaceColor,
    colorPrimary: primaryColor,
    borderRadius: 6,
    colorTextHeading: textColor,
    colorError: redPrimary
  },
  components: {
    Layout: {
      colorBgHeader: whiteColor,
      colorBgTrigger: primaryColor, //toggle menu button
      colorIconHover: textColor
    },
    Button: {
      colorPrimary: primaryColor
    },
    Menu: {
      colorItemText: defaultGrey,
      colorItemBgHover: hoverColor,
      colorItemTextHover: primaryColor,
      colorItemBgSelected: hoverColor,
      colorItemTextSelected: primaryColor,
      colorBgTextActive: primaryColor,
      radiusItem: 6,
      colorGroupTitle: primaryColor
    },
    Tabs: {
      colorBorderSecondary: inActiveGrey,
      colorText: inActiveGrey
    },
    Card: {
      colorBgContainer: whiteColor,
      borderRadiusLG: 16,
      paddingLG: 16
    },
    List: {
      colorBgElevated: redPrimary,
      colorPrimaryBg: redPrimary
      // bg
    },

    Segmented: {
      colorBgLayout: '#f5f5f5'
    },
    Table: {
      borderRadiusLG: 16
    }
  }
};

export default instance;
