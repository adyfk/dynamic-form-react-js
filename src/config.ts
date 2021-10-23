//
export const formFields = [
  {
    label: 'Layanan',
    fieldName: 'service',
    options: ['BASIC', 'VPN-IP', 'OTHER'],
    fieldType: 'dropdown',
  },
  {
    label: 'Region',
    fieldName: 'region',
    fieldType: 'dropdown',
    options: ['JABODETABEK'],
    valueType: 'string',
    rules: [
      {
        type: 'string',
        includes: ['JABODETABEK'],
        error: 'Pilihan tidak ada',
      },
      {
        type: 'string',
        required: true,
        error: 'Form harus diisi',
      },
    ],
  },
  {
    label: 'Bandwidth',
    fieldName: 'bandwidth',
    fieldType: 'text',
    options: [],
    valueType: 'number',
    rules: [
      {
        type: 'number',
        min: 0.032,
        error: 'Minimal Bandwidth 0.032',
      },
      {
        type: 'number',
        max: 1000,
        error: 'Max Bandwidth 1000',
      },
    ],
  },
  {
    label: 'Fitur Layanan',
    fieldName: 'fitur',
    fieldType: 'checkbox',
    options: ['Dual Homing'],
    valueType: 'string',
    rules: [
      {
        type: 'number',
        min: 0.032,
        error: 'Minimal Bandwidth 0.032',
      },
      {
        type: 'number',
        max: 1000,
        error: 'Minimal Bandwidth 1000',
      },
    ],
  },
  {
    label: 'Quality of Services',
    fieldName: 'qos',
    fieldType: 'dropdown',
    valueType: 'number',
    options: [1, 2, 3, 4, 5, 6, 7],
    rules: [
      {
        type: 'number',
        min: 1,
        error: 'Minimal QOS 1',
      },
      {
        type: 'number',
        max: 7,
        error: 'Minimal Bandwidth 7',
      },
    ],
    assign: {
      case: {
        1: {
          bestEffort: 10,
          critical: 20,
          interactive: 80,
        },
        2: {
          bestEffort: 15,
          critical: 50,
          interactive: 50,
        },
        7: {
          bestEffort: 0,
          critical: 0,
          interactive: 0,
        },
      },
    },
  },
  {
    label: 'Best Effort',
    fieldName: 'bestEffort',
    fieldType: 'text',
    valueType: 'number',
    options: [],
    rules: [
      {
        type: 'when',
        refer: 'qos',
        case: {
          1: {
            type: 'number',
            equal: 10,
            error: 'Harus 10',
          },
          2: {
            type: 'number',
            equal: 20,
            error: 'Harus 20',
          },
          7: {
            type: 'number',
          },
        },
      },
    ],
    config: {
      size: 0.3,
      order: 4,
      view: [
        {
          when: 'qos',
          equal: 7,
          then: {
            disabled: false,
          },
          else: {
            disabled: true,
          },
        },
        {
          when: 'layanan',
          equal: 'vpn ip',
          then: {
            show: false,
          },
          else: {
            show: true,
          },
        },
      ],
    },
  },
];
