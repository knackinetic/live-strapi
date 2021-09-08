export default {
  config: {
    auth: {
      logo:
        'https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    },
    head: {
      favicon:
        'https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
      title: 'Strapi test',
    },
    locales: ['fr', 'de'],
    menu: {
      logo:
        'https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    },
    theme: {
      colors: {
        alternative100: '#f6ecfc',
        alternative200: '#e0c1f4',
        alternative500: '#ac73e6',
        alternative600: '#9736e8',
        alternative700: '#8312d1',
        danger100: '#fcecea',
        danger200: '#f5c0b8',
        danger500: '#ee5e52',
        danger600: '#d02b20',
        danger700: '#b72b1a',
        neutral0: 'black',
        neutral100: '#f6f6f9',
        neutral150: '#eaeaef',
        neutral200: '#dcdce4',
        neutral300: '#c0c0cf',
        neutral400: '#a5a5ba',
        neutral500: '#8e8ea9',
        neutral600: '#666687',
        neutral700: '#4a4a6a',
        neutral800: '#32324d',
        neutral900: '#212134',
        primary100: '#f0f0ff',
        primary200: '#d9d8ff',
        primary500: '#7b79ff',
        primary600: '#4945ff',
        primary700: '#271fe0',
        secondary100: '#eaf5ff',
        secondary200: '#b8e1ff',
        secondary500: '#66b7f1',
        secondary600: '#0c75af',
        secondary700: '#006096',
        success100: '#eafbe7',
        success200: '#c6f0c2',
        success500: '#5cb176',
        success600: '#328048',
        success700: '#2f6846',
        warning100: '#fdf4dc',
        warning200: '#fae7b9',
        warning500: '#f29d41',
        warning600: '#d9822f',
        warning700: '#be5d01',
      },
    },
    translations: {
      fr: {
        'Auth.form.email.label': 'test',
      },
    },
    tutorials: false,
    notifications: { release: false },
  },
  bootstrap() {},
};
