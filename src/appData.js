export const frameOptionSettings = {
  simple: {
    frameType: "simple",
    frameBevel: 5
  },

  fancy: {
    frameType: "fancy",
    frameBevel: 0
  }
};

const defaultAppData = {
  title: "Drawing Grids",
  infoUrl: "https://artfly.io/drawing-grid/",
  defaultSaveName: "artfly-drawing-grid.jpg",
  settings: {
    //
    showSource: {
      dividerAbove: true,
      label: "Show Source",
      type: "boolean",
      defaultValue: true
    },

    showGrid: {
      label: "Show Grid",
      type: "boolean",
      defaultValue: true
    },

    addOutline: {
      label: "Show Grid",
      type: "boolean",
      defaultValue: false
    },

    blur: {
      showIfs: [{ key: "addOutline", condition: true }],
      dividerAbove: true,
      label: "Detail 1",
      type: "range",
      min: 1,
      max: 12,
      step: 1,
      defaultValue: 32
    },

    highThreshold: {
      showIfs: [{ key: "addOutline", condition: true }],
      label: "Detail 2",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 20
    },

    lowThreshold: {
      showIfs: [{ key: "addOutline", condition: true }],
      label: "Detail 3",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 54
    }

    // cropArtwork: {
    //   dividerAbove: true,
    //   label: "Crop Art",
    //   type: "boolean",
    //   defaultValue: false
    // }

    // cropTop: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Top",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // },

    // cropBottom: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Bottom",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // },

    // cropLeft: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Left",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // },

    // cropRight: {
    //   showIfs: [{ key: "cropArtwork", condition: true }],
    //   label: "Right",
    //   type: "range",
    //   min: 0,
    //   max: 100,
    //   step: 1,
    //   defaultValue: 0
    // }
  }
};

export const getAppData = (srcData = defaultAppData) => {
  // add easy access values from default data
  const appData = { ...srcData };
  const settingsKeys = Object.keys(srcData.settings);

  for (let key of settingsKeys) {
    const currSetting = srcData.settings[key];
    appData[key] = currSetting.defaultValue;
  }

  return appData;
};
