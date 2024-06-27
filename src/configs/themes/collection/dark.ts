import { theme } from 'antd';
import { ThemeConfig } from 'antd/es/config-provider/context';
import colorScheme from './colorScheme';

const { defaultAlgorithm, darkAlgorithm } = theme;
const {
  textColor,
  blackSurface,
  primaryColor,
  whiteColor,
  defaultGrey,
  hoverColor,
  redPrimary,
  blackInput
} = colorScheme;

const instance: ThemeConfig = {
  algorithm: [defaultAlgorithm, darkAlgorithm],
  token: {
    fontFamily: 'Inter',
    colorText: whiteColor,
    colorBgLayout: blackSurface,
    colorPrimary: whiteColor,
    borderRadius: 6,
    colorTextHeading: whiteColor,
    colorError: redPrimary
  },
  components: {
    Layout: {
      colorBgHeader: textColor,
      colorBgTrigger: primaryColor
    },
    Button: {
      colorPrimary: primaryColor,
      boxShadow: 'none'
    },
    Menu: {
      colorItemText: defaultGrey,
      colorItemBgHover: hoverColor,
      colorItemTextHover: primaryColor,
      colorItemBgSelected: primaryColor,
      colorItemTextSelected: whiteColor
    },
    Tabs: {
      colorBorderSecondary: whiteColor,
      colorText: whiteColor
    },
    Card: {
      colorBgLayout: blackSurface,
      borderRadiusLG: 16,
      paddingLG: 16
    },

    Tree: {
      colorBgContainer: textColor
    },
    Table: {
      borderRadiusLG: 16
    },
    Input: {
      colorBgContainer: blackInput,
      colorText: whiteColor
    },
    InputNumber: {
      colorTextDisabled: whiteColor
    },
    Select: {
      colorBgContainer: blackInput
    },
    DatePicker: {
      colorBgContainer: blackInput
    }
  }
};

export default instance;
