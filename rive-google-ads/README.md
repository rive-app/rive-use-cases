# Rive: Google Ads App Campaign Integration

This folder contains examples and resources for integrating Rive graphics into Google Ads app campaigns.

## Examples

### Parcel Bundler Example

**Location**: `rive-google-ads/examples/rive-google-ads-parcel/`

A complete example demonstrating how to use [Parcel](https://parceljs.org/) to bundle Rive into a Google Ads-compatible format.

**Features:**

- Proper ad sizing with responsive layout
- Runtime: Using the \*single variant of Rive's web runtime which bundles the Rive WASM library into a single JS package
- Random graphic selection between multiple Rive files
- Optimized bundle size for ad delivery
- Google Ads meta tags and structure

**Key Components:**

- `src/index.html` - Ad container with proper meta tags
- `src/index.ts` - Rive logic and setup
- `assets/` - Sample Rive files
- `dist/` - Built ad files ready for Google Ads

**Quick Start:**

```bash
cd rive-google-ads/examples/rive-google-ads-parcel
npm install
npm run build
```

The built files in `dist/` can be zipped up and uploaded to Google as an HTML5 ad.

**Testing Locally:**

```bash
cd rive-google-ads/examples/rive-google-ads-parcel
npm install
npm run start
```

#### Important Notes

⚠️ **No Source Maps**: To reduce the size of the `dist` folder we pass `--no-source-maps` to the build process.

⚠️ **Root relative assets**: Assets (`.js/.ts` and `.riv` files) need to be root relative to be discoverable. We pass `--public-url ./` to the build process to ensure this.

⚠️ **Performance and Feature Limitations:** Google App Ads are displayed inside a WebView in Android or iOS apps. WebViews aren't as powerful as modern browsers, and Google may limit permissions that are normally available elsewhere. To ensure compatibility:

- Follow Rive's [best practices guidelines](https://rive.app/docs/getting-started/best-practices)
- Avoid excessive blend modes
- Avoid clipping masks that clip the artboard
- Test your ad on a real device, preferably using a WebView
- Keep your total ad size (including .wasm, .js, .riv, and .html) under 1 MB
- Google does not allow you to reference external assets or code. Everything should be included in the uploaded zip file to Google, and a root relative path should be used to reference assets.

## Resources

- [Rive Documentation](https://rive.app/docs/runtimes/getting-started) - Complete runtime guides
- [Rive Best Practices](https://rive.app/docs/getting-started/best-practices) - Best practices to optimize Rive graphics
- [Rive Use Cases](https://rive.app/use-cases) - More examples and inspiration
- [Rive Community](https://community.rive.app/) - Get help and share projects

## Contributing

Found an issue or have a suggestion? Please [open an issue](https://github.com/rive-app/rive-use-cases/issues) or submit a pull request to help improve these examples.

---

For more Rive examples and use cases, visit the [main repository](https://github.com/rive-app/rive-use-cases/).
