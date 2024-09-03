module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [
            ".ios.ts",
            ".ios.tsx",
            ".android.ts",
            ".android.tsx",
            ".ts",
            ".tsx",
          ],
          alias: {
            "@": "./",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
